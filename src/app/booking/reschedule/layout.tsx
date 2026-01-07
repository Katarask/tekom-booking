import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termin verschieben",
  description: "Verschieben Sie Ihren Beratungstermin auf einen anderen Zeitpunkt.",
  robots: {
    index: false, // Don't index reschedule pages
    follow: false,
  },
};

export default function RescheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
