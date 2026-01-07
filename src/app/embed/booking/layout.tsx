import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termin buchen | Deniz Levent Tulay",
  description: "Buchen Sie Ihren persoenlichen Beratungstermin",
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --sand: #DBD6CC;
            --cream: #EFEDE5;
            --burgundy: #652126;
            --dark: #0a0a0a;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'JetBrains Mono', 'SF Mono', monospace;
            background-color: var(--cream);
          }
          /* Brand color overrides */
          .bg-burgundy { background-color: var(--burgundy) !important; }
          .text-burgundy { color: var(--burgundy) !important; }
          .border-burgundy { border-color: var(--burgundy) !important; }
          .bg-cream { background-color: var(--cream) !important; }
          .text-cream { color: var(--cream) !important; }
          .bg-sand { background-color: var(--sand) !important; }
          .text-dark { color: var(--dark) !important; }
          .bg-dark { background-color: var(--dark) !important; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
