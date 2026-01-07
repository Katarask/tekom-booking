import { NextRequest, NextResponse } from "next/server";
import { getBookingsForReminder } from "@/lib/notion";
import { sendReminderEmail } from "@/lib/resend";
import { formatDate, formatTime } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = {
      sent24h: 0,
      sent1h: 0,
      errors: [] as string[],
    };

    // Send 24-hour reminders
    const bookings24h = await getBookingsForReminder(24);
    for (const booking of bookings24h) {
      try {
        const props = booking.properties;
        const email = props.Email?.email;
        const name = props.Name?.title?.[0]?.text?.content || "Kandidat";
        const dateTime = props.Termin?.date?.start;
        const meetingLink = props["Meeting Link"]?.url || "";

        if (email && dateTime) {
          const date = new Date(dateTime);
          await sendReminderEmail({
            to: email,
            name,
            date: formatDate(date),
            time: formatTime(date.toTimeString().slice(0, 5)),
            meetingLink,
            hoursUntil: 24,
          });
          results.sent24h++;
        }
      } catch (error) {
        results.errors.push(`24h reminder error: ${error}`);
      }
    }

    // Send 1-hour reminders
    const bookings1h = await getBookingsForReminder(1);
    for (const booking of bookings1h) {
      try {
        const props = booking.properties;
        const email = props.Email?.email;
        const name = props.Name?.title?.[0]?.text?.content || "Kandidat";
        const dateTime = props.Termin?.date?.start;
        const meetingLink = props["Meeting Link"]?.url || "";

        if (email && dateTime) {
          const date = new Date(dateTime);
          await sendReminderEmail({
            to: email,
            name,
            date: formatDate(date),
            time: formatTime(date.toTimeString().slice(0, 5)),
            meetingLink,
            hoursUntil: 1,
          });
          results.sent1h++;
        }
      } catch (error) {
        results.errors.push(`1h reminder error: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { error: "Fehler beim Senden der Erinnerungen" },
      { status: 500 }
    );
  }
}
