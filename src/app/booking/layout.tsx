import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://termine.denizleventtulay.de";

export const metadata: Metadata = {
  title: "Beratungstermin buchen",
  description: "Waehlen Sie Ihren Wunschtermin fuer ein kostenloses Beratungsgespraech mit Tech Recruiter Deniz Levent Tulay. 30 Minuten persoenliche Karriereberatung per Microsoft Teams.",
  keywords: [
    "Termin buchen",
    "Beratungsgespraech",
    "Tech Recruiter Termin",
    "Karriereberatung buchen",
    "IT Recruiter Termin",
    "kostenlose Beratung",
  ],
  openGraph: {
    title: "Beratungstermin buchen | Deniz Levent Tulay",
    description: "Jetzt Wunschtermin waehlen - 30 Min. kostenlose Karriereberatung mit Tech Recruiter",
    url: `${siteUrl}/booking`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/booking`,
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
