"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { formatDate, formatTime } from "@/lib/utils";

interface TimeSlot {
  date: string;
  times: string[];
}

export default function RescheduleBookingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRescheduled, setIsRescheduled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch("/api/calendar/available-slots");
      if (!response.ok) throw new Error("Fehler beim Laden der Termine");
      const data = await response.json();
      setSlots(data.slots);
    } catch {
      setError("VerfÃ¼gbare Termine konnten nicht geladen werden");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/booking/${bookingId}/reschedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newDate: selectedDate,
          newTime: selectedTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fehler beim Verschieben");
      }

      setIsRescheduled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      setIsSubmitting(false);
    }
  };

  if (isRescheduled) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-lg text-center">
          <div className="bg-cream border border-dark/10 rounded p-8 md:p-10">
            <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-burgundy"
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
              Termin aktualisiert
            </p>
            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-dark mb-3 font-mono">
              Termin verschoben
            </h1>
            <p className="text-dark/60 font-mono text-sm mb-6">
              Ihr Termin wurde erfolgreich auf den neuen Zeitpunkt verschoben:
            </p>
            <div className="bg-sand/50 rounded p-4 mb-6">
              <p className="font-mono text-dark text-sm">
                {formatDate(selectedDate!)}
              </p>
              <p className="font-mono text-dark/60 text-sm">{formatTime(selectedTime!)} Uhr</p>
            </div>
            <p className="text-dark/60 font-mono text-sm mb-8">
              Sie erhalten eine BestÃ¤tigung per E-Mail mit dem neuen
              Teams-Meeting-Link.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-burgundy text-cream rounded font-mono text-sm tracking-wider hover:bg-burgundy/90 transition-colors"
            >
              Fertig
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedSlot = slots.find((s) => s.date === selectedDate);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-cream border border-dark/10 rounded p-6 md:p-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-burgundy"
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
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/40 mb-3">
              Neuen Termin wÃ¤hlen
            </p>
            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-dark mb-3 font-mono">
              Termin verschieben
            </h1>
            <p className="text-dark/60 font-mono text-sm">
              WÃ¤hlen Sie einen neuen Termin aus den verfÃ¼gbaren Zeitfenstern
            </p>
          </div>

          {error && (
            <div className="bg-burgundy/10 border border-burgundy/30 rounded p-4 mb-6">
              <p className="text-burgundy font-mono text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy mx-auto"></div>
              <p className="mt-4 text-dark/60 font-mono text-sm">Lade verfÃ¼gbare Termine...</p>
            </div>
          ) : (
            <>
              {/* Date Selection */}
              <div className="mb-8">
                <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/60 mb-4">
                  Datum wÃ¤hlen
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.date}
                      onClick={() => {
                        setSelectedDate(slot.date);
                        setSelectedTime(null);
                      }}
                      className={`p-3 text-center rounded border transition-all ${
                        selectedDate === slot.date
                          ? "bg-burgundy text-cream border-burgundy"
                          : "bg-sand/30 border-dark/10 hover:border-burgundy/50 text-dark"
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                        {new Date(slot.date).toLocaleDateString("de-DE", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="font-mono text-lg">
                        {new Date(slot.date).getDate()}.
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                        {new Date(slot.date).toLocaleDateString("de-DE", {
                          month: "short",
                        })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && selectedSlot && (
                <div className="mb-8">
                  <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/60 mb-4">
                    Uhrzeit wÃ¤hlen
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {selectedSlot.times.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-3 text-center rounded font-mono text-sm transition-all ${
                          selectedTime === time
                            ? "bg-burgundy text-cream"
                            : "bg-sand/50 text-dark hover:bg-burgundy/10 hover:text-burgundy"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Summary */}
              {selectedDate && selectedTime && (
                <div className="bg-sand/50 border border-dark/10 rounded p-4 mb-8">
                  <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/40 mb-2">Neuer Termin</p>
                  <p className="font-mono text-dark">
                    {formatDate(selectedDate)} um {formatTime(selectedTime)} Uhr
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-dark/20 text-dark rounded font-mono text-sm tracking-wider hover:bg-sand/50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={handleReschedule}
                  disabled={!selectedDate || !selectedTime || isSubmitting}
                  className="flex-1 px-6 py-3 bg-burgundy text-cream rounded font-mono text-sm tracking-wider hover:bg-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Wird verschoben..." : "Termin verschieben"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
