"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarView } from "@/components/booking/CalendarView";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { Header } from "@/components/layout/Header";
import { TimeSlot } from "@/types";

export default function BookingPage() {
  const router = useRouter();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available slots on mount
  useEffect(() => {
    async function fetchSlots() {
      try {
        setIsLoading(true);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30); // Next 30 days

        const response = await fetch(
          `/api/calendar/available-slots?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`
        );

        if (!response.ok) {
          throw new Error("Fehler beim Laden der verfügbaren Termine");
        }

        const data = await response.json();
        setAvailableSlots(data.slots);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSlots();
  }, []);

  // Get times for selected date
  const timesForSelectedDate = selectedDate
    ? availableSlots.find((slot) => slot.date === selectedDate)?.times || []
    : [];

  // Handle continue to details
  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      router.push(
        `/booking/details?date=${selectedDate}&time=${encodeURIComponent(selectedTime)}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Section Label */}
        <div className="mb-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/50">
            [01] Termin wählen
          </span>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-burgundy text-cream flex items-center justify-center text-xs font-mono tracking-wider">
              01
            </div>
            <div className="w-20 h-[2px] bg-dark/10 mx-3" />
            <div className="w-10 h-10 rounded-full bg-sand text-dark/40 flex items-center justify-center text-xs font-mono tracking-wider">
              02
            </div>
            <div className="w-20 h-[2px] bg-dark/10 mx-3" />
            <div className="w-10 h-10 rounded-full bg-sand text-dark/40 flex items-center justify-center text-xs font-mono tracking-wider">
              03
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-[clamp(28px,4vw,48px)] font-light text-dark mb-4 tracking-tight">
            Termin auswählen
          </h1>
          <p className="text-dark/60 font-mono text-sm max-w-md mx-auto">
            Wählen Sie einen passenden Termin für Ihr Beratungsgespräch
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-burgundy/10 border border-burgundy/20 rounded-lg p-4 mb-8">
            <p className="text-burgundy font-mono text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-burgundy border-t-transparent" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div className="bg-cream border border-dark/10 rounded-lg p-6">
              <h2 className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/50 mb-6">
                Datum
              </h2>
              <CalendarView
                availableSlots={availableSlots}
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
              />
            </div>

            {/* Time Slots */}
            <div className="bg-cream border border-dark/10 rounded-lg p-6">
              <h2 className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/50 mb-6">
                Uhrzeit
              </h2>
              {selectedDate ? (
                <TimeSlotPicker
                  times={timesForSelectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              ) : (
                <div className="text-center py-12 text-dark/40 font-mono text-sm">
                  Bitte wählen Sie zuerst ein Datum aus
                </div>
              )}
            </div>
          </div>
        )}

        {/* Continue Button */}
        {selectedDate && selectedTime && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleContinue}
              className="group px-8 py-4 bg-burgundy text-cream font-mono text-[11px] uppercase tracking-[0.1em] hover:bg-burgundy/90 transition-all duration-200"
            >
              Weiter zu den Details
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
