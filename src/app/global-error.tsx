"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body style={{
        margin: 0,
        fontFamily: "JetBrains Mono, monospace",
        backgroundColor: "#EFEDE5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}>
        <div style={{
          backgroundColor: "white",
          border: "1px solid rgba(101, 33, 38, 0.2)",
          borderRadius: "0.5rem",
          padding: "2rem",
          maxWidth: "28rem",
          textAlign: "center",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            width: "4rem",
            height: "4rem",
            margin: "0 auto 1rem",
            borderRadius: "50%",
            backgroundColor: "rgba(101, 33, 38, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ color: "#652126", fontSize: "1.5rem" }}>!</span>
          </div>
          <h2 style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#0a0a0a",
            marginBottom: "0.5rem"
          }}>
            Kritischer Fehler
          </h2>
          <p style={{
            color: "rgba(10, 10, 10, 0.6)",
            fontSize: "0.875rem",
            marginBottom: "1.5rem"
          }}>
            Die Anwendung konnte nicht geladen werden. Bitte laden Sie die Seite neu.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#652126",
              color: "#EFEDE5",
              border: "none",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              cursor: "pointer"
            }}
          >
            Seite neu laden
          </button>
        </div>
      </body>
    </html>
  );
}
