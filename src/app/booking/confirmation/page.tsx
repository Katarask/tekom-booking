"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";

interface BookingDetails {
  name: string;
  date: string;
  time: string;
  meetingLink: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch booking details from API
    // For now, we'll use mock data or localStorage
    const storedBooking = localStorage.getItem(`booking_${bookingId}`);
    if (storedBooking) {
      setBooking(JSON.parse(storedBooking));
    }
    setIsLoading(false);
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-burgundy text-cream flex items-center justify-center text-xs font-mono">
              ✓
            </div>
            <div className="w-12 md:w-20 h-px bg-burgundy mx-2" />
            <div className="w-8 h-8 rounded-full bg-burgundy text-cream flex items-center justify-center text-xs font-mono">
              ✓
            </div>
            <div className="w-12 md:w-20 h-px bg-burgundy mx-2" />
            <div className="w-8 h-8 rounded-full bg-burgundy text-cream flex items-center justify-center text-xs font-mono">
              ✓
            </div>
          </div>
        </div>

        {/* Success Card */}
        <div className="bg-cream border border-dark/10 rounded p-8 md:p-10 text-center">
          {/* Checkmark */}
          <div className="w-20 h-20 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-10 h-10 text-burgundy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/40 mb-3">
            Buchung bestaetigt
          </p>
          <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-light text-dark mb-3 font-mono">
            Termin gebucht!
          </h1>
          <p className="text-dark/60 font-mono text-sm mb-10">
            Eine Bestaetigung wurde an Ihre E-Mail-Adresse gesendet.
          </p>

          {/* Details */}
          <div className="bg-sand/50 rounded p-6 mb-10 text-left">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/40 mb-4">
              Termindetails
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-burgundy/10 rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-burgundy"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-mono text-dark text-sm">
                  {booking?.date || "Datum wird geladen..."}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-burgundy/10 rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-burgundy"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="font-mono text-dark text-sm">
                  {booking?.time || "Zeit wird geladen..."} Uhr
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-burgundy/10 rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-burgundy"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-mono text-dark text-sm">
                  Microsoft Teams (Online)
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {booking?.meetingLink && (
              <a
                href={booking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-burgundy text-cream rounded font-mono text-sm tracking-wider hover:bg-burgundy/90 transition-colors"
              >
                Meeting-Link oeffnen
              </a>
            )}
            <button
              onClick={() => {
                // Generate ICS file for calendar
                const icsContent = generateICS(booking);
                downloadICS(icsContent);
              }}
              className="px-6 py-3 border border-dark/20 text-dark rounded font-mono text-sm tracking-wider hover:bg-sand/50 transition-colors"
            >
              Zum Kalender hinzufuegen
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-10 text-center">
          <p className="text-dark/50 font-mono text-xs">
            Sie erhalten 24 Stunden und 1 Stunde vor dem Termin eine Erinnerung.
          </p>
          <p className="mt-2 text-dark/50 font-mono text-xs">
            Bei Fragen kontaktieren Sie uns unter{" "}
            <a
              href="mailto:d.l.tulay@tekom-gmbh.de"
              className="text-burgundy hover:text-burgundy/80 transition-colors"
            >
              d.l.tulay@tekom-gmbh.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}

// Helper function to generate ICS file
function generateICS(booking: BookingDetails | null): string {
  if (!booking) return "";

  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TEKOM Booking//DE
BEGIN:VEVENT
DTSTART:${booking.date.replace(/-/g, "")}T${booking.time.replace(":", "")}00
DTEND:${booking.date.replace(/-/g, "")}T${addMinutesToTime(booking.time, 30).replace(":", "")}00
SUMMARY:Beratungsgespräch TEKOM
DESCRIPTION:Ihr Beratungsgespräch bei TEKOM\\n\\nMeeting-Link: ${booking.meetingLink}
LOCATION:Microsoft Teams (Online)
STATUS:CONFIRMED
SEQUENCE:0
DTSTAMP:${now}
END:VEVENT
END:VCALENDAR`;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`;
}

function downloadICS(content: string) {
  const blob = new Blob([content], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tekom-termin.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
