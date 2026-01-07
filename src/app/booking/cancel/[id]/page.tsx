"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";

export default function CancelBookingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const handleCancel = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/booking/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fehler beim Absagen des Termins");
      }

      setIsCancelled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      setIsSubmitting(false);
    }
  };

  if (isCancelled) {
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
              Stornierung bestÃ¤tigt
            </p>
            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-dark mb-3 font-mono">
              Termin abgesagt
            </h1>
            <p className="text-dark/60 font-mono text-sm mb-8">
              Ihr Termin wurde erfolgreich abgesagt. Sie erhalten eine
              BestÃ¤tigung per E-Mail.
            </p>
            <button
              onClick={() => router.push("/booking")}
              className="px-6 py-3 bg-burgundy text-cream rounded font-mono text-sm tracking-wider hover:bg-burgundy/90 transition-colors"
            >
              Neuen Termin buchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <div className="bg-cream border border-dark/10 rounded p-8 md:p-10">
          <div className="text-center mb-8">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/40 mb-3">
              Termin stornieren
            </p>
            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-dark mb-3 font-mono">
              Termin absagen
            </h1>
            <p className="text-dark/60 font-mono text-sm">
              Schade, dass Sie den Termin nicht wahrnehmen kÃ¶nnen. MÃ¶chten Sie
              Ihren Termin wirklich absagen?
            </p>
          </div>

          {error && (
            <div className="bg-burgundy/10 border border-burgundy/30 rounded p-4 mb-6">
              <p className="text-burgundy font-mono text-sm">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-dark/60 mb-2">
              Grund fÃ¼r die Absage{" "}
              <span className="text-dark/40">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-cream border border-dark/10 rounded font-mono text-sm text-dark focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/20 resize-none transition-all"
              rows={3}
              placeholder="z.B. Terminkonflikt, Krankheit, etc."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-dark/20 text-dark rounded font-mono text-sm tracking-wider hover:bg-sand/50 transition-colors"
            >
              ZurÃ¼ck
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-burgundy text-cream rounded font-mono text-sm tracking-wider hover:bg-burgundy/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Wird abgesagt..." : "Termin absagen"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push(`/booking/reschedule/${bookingId}`)}
              className="text-burgundy hover:text-burgundy/80 font-mono text-sm tracking-wider transition-colors"
            >
              Lieber Termin verschieben?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
