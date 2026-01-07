import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buchung bestÃ¤tigt",
  description: "Ihr Beratungstermin mit Tech Recruiter Deniz Levent Tulay wurde erfolgreich gebucht. PrÃ¼fen Sie Ihre E-Mails fÃ¼r den Microsoft Teams Meeting-Link.",
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
