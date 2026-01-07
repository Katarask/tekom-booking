"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="bg-white border border-burgundy/20 rounded-lg p-8 max-w-md text-center shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-burgundy/10 flex items-center justify-center">
          <span className="text-burgundy text-2xl font-mono">!</span>
        </div>
        <h2 className="text-xl font-mono font-semibold text-dark mb-2">
          Etwas ist schiefgelaufen
        </h2>
        <p className="text-dark/60 font-mono text-sm mb-6">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-burgundy text-cream rounded font-mono text-sm hover:bg-burgundy/90 transition-colors"
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            className="px-6 py-2 bg-dark/10 text-dark rounded font-mono text-sm hover:bg-dark/20 transition-colors"
          >
            Zur Startseite
          </a>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-dark/40 cursor-pointer font-mono">
              Technische Details
            </summary>
            <pre className="mt-2 p-3 bg-dark/5 rounded text-xs overflow-auto font-mono text-dark/60 max-h-40">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
