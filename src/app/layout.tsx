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
  publisher: "TEKOM GmbH",
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
  verification: {
    google: "google-site-verification-code", // Später ersetzen
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Structured Data - Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TEKOM GmbH",
    url: "https://tekom-gmbh.de",
    logo: `${siteUrl}/favicon.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49-XXX-XXXXXXX",
      contactType: "customer service",
      availableLanguage: ["German", "English"],
    },
  };

  // JSON-LD Structured Data - Person (Recruiter)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Deniz Levent Tulay",
    jobTitle: "Tech Recruiter & Headhunter",
    url: "https://denizleventtulay.de",
    sameAs: [
      "https://linkedin.com/in/denizleventtulay",
    ],
    worksFor: {
      "@type": "Organization",
      name: "TEKOM GmbH",
    },
  };

  // JSON-LD Structured Data - Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Tech Recruiting Beratung",
    description: "Kostenlose Karriereberatung für IT-Fachkräfte - Vermittlung von Software Developers, DevOps Engineers und IT-Spezialisten",
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    image: `${siteUrl}/og-image.png`,
    priceRange: "Kostenlos für Kandidaten",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DE",
      addressRegion: "Berlin",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "52.5200",
      longitude: "13.4050",
    },
    areaServed: {
      "@type": "Country",
      name: "Germany",
    },
    serviceType: [
      "Tech Recruiting",
      "IT Headhunting",
      "Karriereberatung",
      "Personalvermittlung IT",
    ],
    provider: {
      "@type": "Person",
      name: "Deniz Levent Tulay",
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
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Kostenloses 30-minütiges Beratungsgespräch",
    },
  };

  // JSON-LD Structured Data - WebSite with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Deniz Levent Tulay - Tech Recruiter Terminbuchung",
    url: siteUrl,
    description: "Online-Terminbuchung für Beratungsgespräche mit Tech Recruiter Deniz Levent Tulay",
    inLanguage: "de-DE",
    publisher: {
      "@type": "Person",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
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
