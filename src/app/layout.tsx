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
  description: "Buchen Sie jetzt Ihr kostenloses Beratungsgespräch mit Deniz Levent Tulay - Tech Recruiter & Headhunter für IT-Fachkräfte in Deutschland. Persönliche Karriereberatung per Microsoft Teams.",
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
  publisher: "Deniz Levent Tulay",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/manifest.json",
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
    description: "Kostenloses Beratungsgespräch mit Tech Recruiter Deniz Levent Tulay. Karriereberatung für IT-Fachkräfte - jetzt Termin buchen!",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Deniz Levent Tulay - Tech Recruiter Terminbuchung",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beratungstermin buchen | Deniz Levent Tulay",
    description: "Kostenloses Beratungsgespräch mit Tech Recruiter - jetzt Termin buchen!",
    creator: "@denizlevent",
    images: ["/og-image.svg"],
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
  // JSON-LD Structured Data - Person (Personal Brand)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://denizleventtulay.de/#person",
    name: "Deniz Levent Tulay",
    givenName: "Deniz Levent",
    familyName: "Tulay",
    jobTitle: "Tech Recruiter & Headhunter",
    description: "Tech Recruiter spezialisiert auf IT-Fachkräfte in Deutschland. Kostenlose Karriereberatung für Software Developer, DevOps Engineers und IT-Spezialisten.",
    url: "https://denizleventtulay.de",
    image: `${siteUrl}/og-image.svg`,
    sameAs: [
      "https://www.linkedin.com/in/deniz-levent-tulay-tekom2025/",
      "https://denizleventtulay.de",
    ],
    knowsAbout: [
      "Tech Recruiting",
      "IT Headhunting",
      "Karriereberatung",
      "Software Development",
      "DevOps",
      "IT-Branche Deutschland",
    ],
    knowsLanguage: ["de", "en", "tr"],
  };

  // JSON-LD Structured Data - Service (von Person angeboten)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Karriereberatung für IT-Fachkräfte",
    description: "Kostenlose 30-minütige Karriereberatung per Microsoft Teams. Individuelle Beratung zu Jobmöglichkeiten, Gehaltsverhandlung und Karriereplanung in der IT-Branche.",
    url: siteUrl,
    image: `${siteUrl}/og-image.svg`,
    provider: {
      "@type": "Person",
      "@id": "https://denizleventtulay.de/#person",
      name: "Deniz Levent Tulay",
    },
    areaServed: {
      "@type": "Country",
      name: "Germany",
    },
    serviceType: "Karriereberatung",
    audience: {
      "@type": "Audience",
      audienceType: "IT-Fachkräfte",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Kostenloses 30-minütiges Beratungsgespräch",
      availability: "https://schema.org/InStock",
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

  // JSON-LD Structured Data - WebSite
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Deniz Levent Tulay - Terminbuchung",
    url: siteUrl,
    description: "Online-Terminbuchung für kostenlose Karriereberatung mit Tech Recruiter Deniz Levent Tulay",
    inLanguage: "de-DE",
    author: {
      "@type": "Person",
      "@id": "https://denizleventtulay.de/#person",
      name: "Deniz Levent Tulay",
    },
  };

  // JSON-LD Structured Data - BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Termin buchen",
        item: `${siteUrl}/booking`,
      },
    ],
  };

  return (
    <html lang="de" className={jetbrainsMono.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#652126" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
