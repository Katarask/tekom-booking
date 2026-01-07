import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buchung bestaetigt",
  description: "Ihr Beratungstermin mit Tech Recruiter Deniz Levent Tulay wurde erfolgreich gebucht. Pruefen Sie Ihre E-Mails fuer den Microsoft Teams Meeting-Link.",
  robots: {
    index: false, // Don't index confirmation pages
    follow: false,
  },
};

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
