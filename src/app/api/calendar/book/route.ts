import { NextRequest, NextResponse } from "next/server";
import { createCalendarEvent } from "@/lib/microsoft-graph";
import { createBooking, uploadCvToNotion } from "@/lib/notion";
import { sendConfirmationEmail, sendCvBackupEmail } from "@/lib/resend";
import { formatDate, formatTime, createISODateTime } from "@/lib/utils";
import { BookingFormData } from "@/types";

// Check if Azure credentials are configured
const isAzureConfigured = () => {
  return !!(
    process.env.MICROSOFT_CLIENT_ID &&
    process.env.MICROSOFT_CLIENT_SECRET &&
    process.env.MICROSOFT_TENANT_ID &&
    process.env.MICROSOFT_USER_ID
  );
};

export async function POST(request: NextRequest) {
  try {
    // Check content type to determine how to parse the request
    const contentType = request.headers.get("content-type") || "";

    let date: string;
    let time: string;
    let duration: number;
    let formData: BookingFormData;
    let cvFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      // Parse FormData (with file upload)
      const data = await request.formData();
      date = data.get("date") as string;
      time = data.get("time") as string;
      duration = parseInt(data.get("duration") as string, 10);
      formData = JSON.parse(data.get("formData") as string);
      cvFile = data.get("cv") as File | null;
    } else {
      // Parse JSON (legacy support)
      const body = await request.json();
      date = body.date;
      time = body.time;
      duration = body.duration;
      formData = body.formData;
    }

    // Validate required fields
    if (!date || !time || !formData) {
      return NextResponse.json(
        { error: "Fehlende erforderliche Felder" },
        { status: 400 }
      );
    }

    let calendarEvent: { eventId: string; meetingLink: string };

    if (isAzureConfigured()) {
      // 1. Create calendar event in Outlook
      calendarEvent = await createCalendarEvent(date, time, duration, {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      });
    } else {
      // Mock calendar event for development
      console.log("⚠️ Azure not configured - using mock calendar event");
      calendarEvent = {
        eventId: `mock-event-${Date.now()}`,
        meetingLink: "https://teams.microsoft.com/l/meetup-join/mock-meeting-link",
      };
    }

    // 2. Create booking in Notion
    const notionBooking = await createBooking({
      ...formData,
      dateTime: createISODateTime(date, time),
      outlookEventId: calendarEvent.eventId,
      meetingLink: calendarEvent.meetingLink,
    });

    // 3. Upload CV to Notion if provided
    if (cvFile) {
      try {
        console.log("📄 Uploading CV to Notion:", cvFile.name);
        await uploadCvToNotion(notionBooking.pageId, cvFile);
        console.log("✅ CV uploaded successfully");
      } catch (cvError) {
        console.error("Error uploading CV to Notion:", cvError);
        // Don't fail the booking if CV upload fails
      }

      // 4. Send CV backup email
      try {
        await sendCvBackupEmail({
          candidateName: `${formData.firstName} ${formData.lastName}`,
          candidateEmail: formData.email,
          position: formData.position,
          cvFile,
        });
        console.log("✅ CV backup email sent");
      } catch (emailError) {
        console.error("Error sending CV backup email:", emailError);
      }
    }

    // 5. Send confirmation email
    try {
      await sendConfirmationEmail({
        to: formData.email,
        name: formData.firstName,
        date: formatDate(date),
        time: formatTime(time),
        meetingLink: calendarEvent.meetingLink,
        bookingId: notionBooking.pageId,
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      bookingId: notionBooking.pageId,
      eventId: calendarEvent.eventId,
      meetingLink: calendarEvent.meetingLink,
      notionPageId: notionBooking.pageId,
      date: formatDate(date),
      time: formatTime(time),
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Buchen des Termins",
        message: error instanceof Error ? error.message : "Unbekannter Fehler"
      },
      { status: 500 }
    );
  }
}
