import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import { addMinutes, generateTimeSlots, isWeekend } from "./utils";
import { TimeSlot } from "@/types";

// Initialize Graph Client with access token
function getGraphClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

// Get access token using client credentials flow
async function getAccessToken(): Promise<string> {
  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.error_description}`);
  }

  return data.access_token;
}

// Fetch calendar events for a date range
async function getCalendarEvents(
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const accessToken = await getAccessToken();
  const client = getGraphClient(accessToken);
  const userId = process.env.MICROSOFT_USER_ID;

  const events = await client
    .api(`/users/${userId}/calendar/events`)
    .select("start,end,subject")
    .filter(
      `start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'`
    )
    .orderby("start/dateTime")
    .get();

  return events.value || [];
}

// Check if a time slot overlaps with existing events
function isSlotAvailable(
  date: string,
  time: string,
  duration: number,
  events: any[]
): boolean {
  const slotStart = new Date(`${date}T${time}:00`);
  const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

  for (const event of events) {
    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);

    // Check for overlap
    if (slotStart < eventEnd && slotEnd > eventStart) {
      return false;
    }
  }

  return true;
}

// Get available time slots for a date range
export async function getAvailableSlots(
  startDate: Date,
  endDate: Date,
  duration: number = 30
): Promise<TimeSlot[]> {
  const events = await getCalendarEvents(startDate, endDate);
  const allTimeSlots = generateTimeSlots(9, 17, 30); // 09:00 - 17:00
  const result: TimeSlot[] = [];

  // Iterate through each day
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Skip weekends
    if (!isWeekend(currentDate)) {
      const dateString = currentDate.toISOString().split("T")[0];
      const availableTimes: string[] = [];

      // Check each time slot
      for (const time of allTimeSlots) {
        if (isSlotAvailable(dateString, time, duration, events)) {
          availableTimes.push(time);
        }
      }

      if (availableTimes.length > 0) {
        result.push({
          date: dateString,
          times: availableTimes,
        });
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

// Create a calendar event with Teams meeting
export async function createCalendarEvent(
  date: string,
  time: string,
  duration: number,
  attendee: { name: string; email: string }
): Promise<{ eventId: string; meetingLink: string }> {
  const accessToken = await getAccessToken();
  const client = getGraphClient(accessToken);
  const userId = process.env.MICROSOFT_USER_ID;

  const startDateTime = new Date(`${date}T${time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

  const event = await client.api(`/users/${userId}/calendar/events`).post({
    subject: `Kandidaten-Gespräch: ${attendee.name}`,
    body: {
      contentType: "HTML",
      content: `<p>Beratungsgespräch mit ${attendee.name}</p><p>Email: ${attendee.email}</p>`,
    },
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "Europe/Berlin",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "Europe/Berlin",
    },
    attendees: [
      {
        emailAddress: {
          address: attendee.email,
          name: attendee.name,
        },
        type: "required",
      },
    ],
    isOnlineMeeting: true,
    onlineMeetingProvider: "teamsForBusiness",
  });

  return {
    eventId: event.id,
    meetingLink: event.onlineMeeting?.joinUrl || "",
  };
}

// Delete a calendar event
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const accessToken = await getAccessToken();
  const client = getGraphClient(accessToken);
  const userId = process.env.MICROSOFT_USER_ID;

  await client.api(`/users/${userId}/calendar/events/${eventId}`).delete();
}

// Update a calendar event
export async function updateCalendarEvent(
  eventId: string,
  updates: {
    date?: string;
    time?: string;
    duration?: number;
  }
): Promise<void> {
  const accessToken = await getAccessToken();
  const client = getGraphClient(accessToken);
  const userId = process.env.MICROSOFT_USER_ID;

  const updateBody: any = {};

  if (updates.date && updates.time) {
    const startDateTime = new Date(`${updates.date}T${updates.time}:00`);
    const endDateTime = new Date(
      startDateTime.getTime() + (updates.duration || 30) * 60 * 1000
    );

    updateBody.start = {
      dateTime: startDateTime.toISOString(),
      timeZone: "Europe/Berlin",
    };
    updateBody.end = {
      dateTime: endDateTime.toISOString(),
      timeZone: "Europe/Berlin",
    };
  }

  await client
    .api(`/users/${userId}/calendar/events/${eventId}`)
    .patch(updateBody);
}
