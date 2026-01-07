"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookingForm } from "@/components/booking/BookingForm";
import { Header } from "@/components/layout/Header";
import { formatDate, formatTime } from "@/lib/utils";
import { BookingFormData } from "@/types";

function BookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate required params
  if (!date || !time) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-dark mb-3 font-mono">
            Ungueltiger Link
          </h1>
          <p className="text-dark/60 font-mono text-sm mb-6">
            Bitte waehlen Sie zuerst einen Termin aus.
          </p>
          <button
            onClick={() => router.push("/booking")}
            className="text-burgundy hover:text-burgundy/80 font-mono text-sm tracking-wider transition-colors"
          >
            Zurueck zur Terminauswahl
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: BookingFormData, cvFile?: File) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create FormData to handle file upload
      const submitData = new FormData();
      submitData.append("date", date);
      submitData.append("time", time);
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
        throw new Error(errorData.message || "Fehler beim Buchen des Termins");
      }

      const result = await response.json();

      // Redirect to confirmation
      router.push(`/booking/confirmation?id=${result.bookingId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/booking");
  };

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
              2
            </div>
            <div className="w-12 md:w-20 h-px bg-dark/20 mx-2" />
            <div className="w-8 h-8 rounded-full bg-sand text-dark/40 flex items-center justify-center text-xs font-mono">
              3
            </div>
          </div>
        </div>

        {/* Selected Time Info */}
        <div className="bg-sand/50 border border-dark/10 rounded p-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-burgundy/10 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-burgundy"
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
            <div>
              <p className="font-mono text-dark text-sm">{formatDate(date)}</p>
              <p className="font-mono text-dark/60 text-sm">{formatTime(time)} Uhr</p>
            </div>
            <button
              onClick={handleBack}
              className="ml-auto text-[11px] font-mono uppercase tracking-[0.15em] text-burgundy hover:text-burgundy/80 transition-colors"
            >
              Aendern
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/40 mb-3">
            Schritt 2 von 3
          </p>
          <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-light text-dark mb-3 font-mono">
            Ihre Daten
          </h1>
          <p className="text-dark/60 font-mono text-sm max-w-md mx-auto">
            Bitte fuellen Sie das Formular aus, um den Termin zu bestaetigen
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-burgundy/10 border border-burgundy/30 rounded p-4 mb-6">
            <p className="text-burgundy font-mono text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-cream border border-dark/10 rounded p-6 md:p-8">
          <BookingForm
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
        </div>
      }
    >
      <BookingDetailsContent />
    </Suspense>
  );
}
