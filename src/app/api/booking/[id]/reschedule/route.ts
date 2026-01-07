import { NextRequest, NextResponse } from "next/server";
import { getBooking } from "@/lib/notion";
import { sendConfirmationEmail } from "@/lib/resend";
import { formatDate, formatTime, createISODateTime } from "@/lib/utils";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { newDate, newTime } = body;

    if (!newDate || !newTime) {
      return NextResponse.json(
        { error: "Neues Datum und Uhrzeit erforderlich" },
        { status: 400 }
      );
    }

    // Get the booking from Notion
    const booking = await getBooking(id);

    if (!booking) {
      return NextResponse.json(
        { error: "Buchung nicht gefunden" },
        { status: 404 }
      );
    }

    // Extract data from Notion properties
    const properties = booking.properties;
    const email = properties["E-Mail"]?.email;
    const nameProperty = properties["Name"]?.title;
    const name = nameProperty?.[0]?.text?.content || "Kandidat";
    const firstName = name.split(" ")[0];

    // Get existing meeting link from Meeting Briefing
    const meetingBriefing = properties["Meeting Briefing"]?.rich_text?.[0]?.text?.content || "";
    const meetingLinkMatch = meetingBriefing.match(/Teams Link: (https:\/\/[^\n]+)/);
    const meetingLink = meetingLinkMatch?.[1] || "https://teams.microsoft.com/l/meetup-join/mock-meeting-link";

    // Update the booking in Notion with new date/time
    const newDateTime = createISODateTime(newDate, newTime);
    await notion.pages.update({
      page_id: id,
      properties: {
        "Meeting Briefing": {
          rich_text: [
            {
              text: {
                content: `Teams Link: ${meetingLink}\nTermin: ${newDateTime}\n(Verschoben am ${new Date().toLocaleDateString("de-DE")})`,
              },
            },
          ],
        },
      },
    });

    // Send confirmation email with new date
    if (email) {
      try {
        await sendConfirmationEmail({
          to: email,
          name: firstName,
          date: formatDate(newDate),
          time: formatTime(newTime),
          meetingLink,
          bookingId: id,
        });
      } catch (emailError) {
        console.error("Error sending reschedule confirmation:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Termin wurde verschoben",
      newDate: formatDate(newDate),
      newTime: formatTime(newTime),
    });
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Verschieben des Termins",
        message: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}
