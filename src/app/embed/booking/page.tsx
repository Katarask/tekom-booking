"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CalendarView } from "@/components/booking/CalendarView";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { BookingForm } from "@/components/booking/BookingForm";
import { TimeSlot, BookingFormData } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

function EmbedBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get custom colors from URL params
  const primaryColor = searchParams.get("primaryColor") || "0891b2"; // Default cyan
  const bgColor = searchParams.get("bgColor") || "ffffff";

  const [step, setStep] = useState<"calendar" | "form" | "success">("calendar");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{
    date: string;
    time: string;
  } | null>(null);

  // Apply custom colors via CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty("--embed-primary", `#${primaryColor}`);
    document.documentElement.style.setProperty("--embed-bg", `#${bgColor}`);
  }, [primaryColor, bgColor]);

  // Fetch available slots
  useEffect(() => {
    async function fetchSlots() {
      try {
        setIsLoading(true);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        const response = await fetch(
          `/api/calendar/available-slots?startDate=${startDate.toISOString().split("T")[0]}&endDate=${endDate.toISOString().split("T")[0]}`
        );

        if (!response.ok) throw new Error("Fehler beim Laden");
        const data = await response.json();
        setAvailableSlots(data.slots);
      } catch (err) {
        setError("Termine konnten nicht geladen werden");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSlots();
  }, []);

  const timesForSelectedDate = selectedDate
    ? availableSlots.find((slot) => slot.date === selectedDate)?.times || []
    : [];

  const handleContinueToForm = () => {
    if (selectedDate && selectedTime) {
      setStep("form");
    }
  };

  const handleSubmit = async (formData: BookingFormData, cvFile?: File) => {
    if (!selectedDate || !selectedTime) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const submitData = new FormData();
      submitData.append("date", selectedDate);
      submitData.append("time", selectedTime);
      submitData.append("duration", "30");
      submitData.append("formData", JSON.stringify(formData));
      if (cvFile) {
        submitData.append("cv", cvFile);
      }

      const response = await fetch("/api/calendar/book", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Buchung fehlgeschlagen");
      }

      const result = await response.json();
      setBookingResult({
        date: result.date,
        time: result.time,
      });
      setStep("success");

      // Notify parent window
      window.parent.postMessage({
        type: "TEKOM_BOOKING_SUCCESS",
        data: result,
      }, "*");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (step === "success" && bookingResult) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: `#${bgColor}` }}
      >
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Termin gebucht!</h2>
          <p className="text-gray-600 mb-4">
            Sie erhalten eine Bestätigung per E-Mail.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-900">{bookingResult.date}</p>
            <p className="text-gray-600">{bookingResult.time} Uhr</p>
          </div>
        </div>
      </div>
    );
  }

  // Form step
  if (step === "form") {
    return (
      <div
        className="min-h-screen p-4"
        style={{ backgroundColor: `#${bgColor}` }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setStep("calendar")}
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurueck
          </button>

          {/* Selected slot summary */}
          <div
            className="rounded-lg p-4 mb-6"
            style={{ backgroundColor: `#${primaryColor}15` }}
          >
            <p className="text-sm text-gray-600">Ausgewaehlter Termin:</p>
            <p className="font-semibold text-gray-900">
              {formatDate(selectedDate!)} um {formatTime(selectedTime!)}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ihre Daten</h2>
            <BookingForm
              onSubmit={handleSubmit}
              onBack={() => setStep("calendar")}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    );
  }

  // Calendar step
  return (
    <div
      className="min-h-screen p-4"
      style={{ backgroundColor: `#${bgColor}` }}
    >
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div
              className="animate-spin rounded-full h-10 w-10 border-b-2"
              style={{ borderColor: `#${primaryColor}` }}
            />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h2 className="text-lg font-semibold mb-4">Datum waehlen</h2>
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
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <h2 className="text-lg font-semibold mb-4">Uhrzeit waehlen</h2>
                {selectedDate ? (
                  <TimeSlotPicker
                    times={timesForSelectedDate}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Bitte waehlen Sie zuerst ein Datum
                  </div>
                )}
              </div>
            </div>

            {/* Continue Button */}
            {selectedDate && selectedTime && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleContinueToForm}
                  className="px-8 py-3 text-white rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: `#${primaryColor}` }}
                >
                  Weiter
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function EmbedBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      }
    >
      <EmbedBookingContent />
    </Suspense>
  );
}
