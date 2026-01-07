import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://termine.denizleventtulay.de";

export const metadata: Metadata = {
  title: "Ihre Daten eingeben",
  description: "VervollstÃ¤ndigen Sie Ihre Buchung - geben Sie Ihre Kontaktdaten und Karrierewuensche ein fÃ¼r Ihr BeratungsgesprÃ¤ch mit Tech Recruiter Deniz Levent Tulay.",
  robots: {
    index: false, // Don't index form pages
    follow: true,
  },
  openGraph: {
    title: "Buchung vervollstÃ¤ndigen | Deniz Levent Tulay",
    description: "Geben Sie Ihre Daten ein um den Beratungstermin zu bestÃ¤tigen",
    url: `${siteUrl}/booking/details`,
  },
};

export default function DetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
