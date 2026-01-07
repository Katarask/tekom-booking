import { NextRequest, NextResponse } from "next/server";
import { getBooking, updateBookingStatus } from "@/lib/notion";
import { sendCancellationEmail } from "@/lib/resend";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    // Get the booking from Notion
    const booking = await getBooking(id);

    if (!booking) {
      return NextResponse.json(
        { error: "Buchung nicht gefunden" },
        { status: 404 }
      );
    }

    // Extract email and name from Notion properties
    const properties = booking.properties;
    const email = properties["E-Mail"]?.email;
    const nameProperty = properties["Name"]?.title;
    const name = nameProperty?.[0]?.text?.content || "Kandidat";
    const firstName = name.split(" ")[0];

    // Update booking status in Notion
    await updateBookingStatus(id, "Abgesagt");

    // Send cancellation email to candidate
    if (email) {
      try {
        await sendCancellationEmail({
          to: email,
          name: firstName,
          date: "Ihr gebuchter Termin",
          time: "",
        });
      } catch (emailError) {
        console.error("Error sending cancellation email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Termin wurde abgesagt",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      {
        error: "Fehler beim Absagen des Termins",
        message: error instanceof Error ? error.message : "Unbekannter Fehler",
      },
      { status: 500 }
    );
  }
}
