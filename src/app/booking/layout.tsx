import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://termine.denizleventtulay.de";

export const metadata: Metadata = {
  title: "Beratungstermin buchen",
  description: "WÃ¤hlen Sie Ihren Wunschtermin fÃ¼r ein kostenloses BeratungsgesprÃ¤ch mit Tech Recruiter Deniz Levent Tulay. 30 Minuten persÃ¶nliche Karriereberatung per Microsoft Teams.",
  keywords: [
    "Termin buchen",
    "BeratungsgesprÃ¤ch",
    "Tech Recruiter Termin",
    "Karriereberatung buchen",
    "IT Recruiter Termin",
    "kostenlose Beratung",
  ],
  openGraph: {
    title: "Beratungstermin buchen | Deniz Levent Tulay",
    description: "Jetzt Wunschtermin wÃ¤hlen - 30 Min. kostenlose Karriereberatung mit Tech Recruiter",
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
