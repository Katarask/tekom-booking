import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termin absagen",
  description: "Sagen Sie Ihren Beratungstermin ab oder verschieben Sie ihn auf einen anderen Zeitpunkt.",
  robots: {
    index: false, // Don't index cancel pages
    follow: false,
  },
};

export default function CancelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
