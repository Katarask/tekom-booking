import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://termine.denizleventtulay.de";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Beratungstermin buchen | Deniz Levent Tulay - Tech Recruiter",
    template: "%s | Deniz Levent Tulay",
  },
  description: "Buchen Sie jetzt Ihr kostenloses Beratungsgespraech mit Deniz Levent Tulay - Tech Recruiter & Headhunter fuer IT-Fachkraefte in Deutschland. Persoenliche Karriereberatung per Microsoft Teams.",
  keywords: [
    "Tech Recruiter",
    "Headhunter IT",
    "IT Recruiting Berlin",
    "Karriereberatung Tech",
    "Beratungstermin buchen",
    "IT Jobs Deutschland",
    "Software Developer Jobs",
    "Tech Karriere",
    "Personalvermittlung IT",
    "Deniz Levent Tulay",
  ],
  authors: [{ name: "Deniz Levent Tulay", url: "https://denizleventtulay.de" }],
  creator: "Deniz Levent Tulay",
  publisher: "TEKOM GmbH",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "Deniz Levent Tulay - Tech Recruiter",
    title: "Beratungstermin buchen | Deniz Levent Tulay",
    description: "Kostenloses Beratungsgespraech mit Tech Recruiter Deniz Levent Tulay. Karriereberatung fuer IT-Fachkraefte - jetzt Termin buchen!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Deniz Levent Tulay - Tech Recruiter Terminbuchung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beratungstermin buchen | Deniz Levent Tulay",
    description: "Kostenloses Beratungsgespraech mit Tech Recruiter - jetzt Termin buchen!",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Structured Data for LocalBusiness/Service
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Deniz Levent Tulay - Tech Recruiter",
    description: "Tech Recruiter & Headhunter fuer IT-Fachkraefte in Deutschland",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/og-image.png`,
    priceRange: "Kostenlos",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DE",
    },
    areaServed: {
      "@type": "Country",
      name: "Germany",
    },
    serviceType: ["Tech Recruiting", "IT Headhunting", "Karriereberatung"],
    provider: {
      "@type": "Person",
      name: "Deniz Levent Tulay",
      jobTitle: "Tech Recruiter & Headhunter",
      url: "https://denizleventtulay.de",
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/booking`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Beratungstermin",
      },
    },
  };

  return (
    <html lang="de" className={jetbrainsMono.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-mono antialiased">
        <main className="min-h-screen bg-cream">
          {children}
        </main>
      </body>
    </html>
  );
}
