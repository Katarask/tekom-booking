# Deniz Levent Tulay - Terminbuchung

Self-hosted Calendly-Alternative für Karriereberatungen.
**Personal Brand Projekt** - Fokus auf Deniz Levent Tulay als Tech Recruiter & Headhunter.

**Live URL:** https://termine.denizleventtulay.de

## Tech Stack

- **Framework:** Next.js 15.5.9 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Font:** JetBrains Mono
- **Database:** Notion API
- **Calendar:** Microsoft Graph API (Outlook/Teams)
- **Email:** Resend (React Email Templates)
- **Hosting:** Vercel
- **Domain:** termine.denizleventtulay.de (Subdomain)

## Brand Design

```
Farben:
- Sand:     #DBD6CC (Akzente, Ecken)
- Cream:    #EFEDE5 (Hintergrund)
- Burgundy: #652126 (Primary, CTA)
- Dark:     #0a0a0a (Text, Logo)

Typografie:
- Font: JetBrains Mono (200-600 weight)
- Monospace-Ästhetik durchgehend
```

## Projekt-Struktur

```
src/
├── app/
│   ├── api/
│   │   ├── calendar/
│   │   │   ├── available-slots/      # GET: Verfügbare Termine
│   │   │   └── book/                 # POST: Termin buchen
│   │   ├── booking/
│   │   │   └── [id]/
│   │   │       ├── cancel/           # POST: Termin stornieren
│   │   │       └── reschedule/       # POST: Termin verschieben
│   │   ├── admin/
│   │   │   └── calendar-config/      # GET/POST: Kalender-Einstellungen
│   │   └── cron/
│   │       └── send-reminders/       # POST: Reminder-E-Mails
│   ├── booking/
│   │   ├── page.tsx                  # Kalender-Auswahl
│   │   ├── details/                  # Formular
│   │   ├── confirmation/             # Bestätigung
│   │   ├── cancel/[id]/              # Stornierung
│   │   └── reschedule/[id]/          # Verschiebung
│   ├── embed/
│   │   ├── page.tsx                  # Embed Widget Landing
│   │   └── booking/                  # Embeddable Booking Flow
│   ├── admin/                        # Admin Panel (Kalender-Config)
│   ├── sitemap.ts                    # Dynamische Sitemap
│   ├── layout.tsx                    # Root Layout mit SEO + Schema.org
│   └── page.tsx                      # Landing Page
├── components/
│   ├── booking/
│   │   ├── CalendarView.tsx          # Monatskalender
│   │   ├── TimeSlotPicker.tsx        # Zeitslot-Auswahl
│   │   └── BookingForm.tsx           # Kandidaten-Formular
│   └── layout/
│       └── Header.tsx                # Site Header
├── emails/
│   ├── BookingConfirmation.tsx       # Bestätigungs-E-Mail
│   ├── BookingReminder.tsx           # Reminder-E-Mail
│   └── BookingCancellation.tsx       # Stornierungs-E-Mail
├── lib/
│   ├── notion.ts                     # Notion API Integration
│   ├── microsoft-graph.ts            # Outlook/Teams Integration
│   ├── resend.ts                     # E-Mail Versand
│   ├── calendar-config.ts            # Kalender-Konfiguration
│   └── utils.ts                      # Hilfsfunktionen
├── types/
│   └── index.ts                      # TypeScript Types
public/
├── favicon.svg                       # DT Logo (SVG)
├── apple-touch-icon.svg              # iOS Icon
├── og-image.svg                      # Open Graph Image (1200x630)
├── manifest.json                     # PWA Manifest
└── robots.txt                        # Suchmaschinen-Direktiven
```

## SEO & Structured Data

### Implementiert:
- **Meta Tags:** Title, Description, Keywords, Author, Publisher
- **Open Graph:** Vollständige OG-Tags für Social Sharing
- **Twitter Cards:** Summary Large Image
- **Canonical URLs:** Selbstreferenzierend
- **robots.txt:** Allow/Disallow Direktiven
- **sitemap.xml:** Dynamisch generiert via `sitemap.ts`
- **manifest.json:** PWA-ready

### Schema.org (JSON-LD):
- **Person:** Deniz Levent Tulay als zentrale Entität
- **Service:** Karriereberatung für IT-Fachkräfte
- **WebSite:** Terminbuchungs-Website
- **BreadcrumbList:** Navigation

## Notion Database Properties

Die Notion-Datenbank verwendet folgende Felder:
- `Name` (title) - Kandidatenname
- `E-Mail` (email)
- `Handynummer` (phone)
- `Position` (rich_text)
- `Verfügbarkeit` (date)
- `Kündigungsfrist` (rich_text)
- `Gesuchte Region` (rich_text)
- `Gehaltsvorstellung` (rich_text)
- `Beschäftigungsverhältnis` (multi_select) - ANÜ, Festanstellung, Freelancing
- `Arbeitszeit` (select) - Vollzeit, Teilzeit, Flexibel
- `Home-Office` (select) - Remote, Hybrid, Vor Ort
- `Vertragsform` (multi_select) - Unbefristet, Befristet, Projektarbeit
- `LinkedIn URL` (url)
- `Pipeline Status` (status) - Erstgespräch als Default
- `Meeting Briefing` (rich_text) - Teams Link + Event Details
- `Booking ID` (rich_text) - Eindeutige Buchungs-ID
- `Reminder Sent` (checkbox) - Reminder-Status

## Environment Variables

```env
# Notion
NOTION_API_KEY=
NOTION_DATABASE_ID=

# Resend (Email)
RESEND_API_KEY=
FROM_EMAIL=hello@denizleventtulay.de
FROM_NAME=Deniz Levent Tulay

# Microsoft Graph API (Azure AD)
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=
MICROSOFT_USER_ID=

# App
NEXT_PUBLIC_APP_URL=https://termine.denizleventtulay.de

# Admin Panel (Optional)
ADMIN_PASSWORD=
```

## Development

```bash
npm run dev    # Startet auf Port 3000
npm run build  # Production Build
npm run lint   # ESLint Check
```

## Mock-Modus

Wenn Azure-Credentials fehlen, läuft das System im Mock-Modus:
- Kalender-Slots werden generiert (nächste 14 Tage, 9-17 Uhr)
- Teams-Links sind Platzhalter
- Notion + E-Mail funktionieren normal

## API Endpoints

### GET /api/calendar/available-slots
Gibt verfügbare Termine zurück.

### POST /api/calendar/book
Bucht einen Termin.

Request Body:
```json
{
  "date": "2025-01-10",
  "time": "10:00",
  "duration": 30,
  "formData": {
    "firstName": "Max",
    "lastName": "Mustermann",
    "email": "max@example.com",
    "phone": "0171234567",
    "position": "Developer",
    "availableFrom": "Ab sofort",
    "regions": ["Berlin", "Brandenburg"],
    "salary": "60000",
    "employmentTypes": ["Festanstellung"],
    "workTime": "Vollzeit",
    "workLocation": "Hybrid",
    "contractTypes": ["Unbefristet"],
    "linkedIn": "https://linkedin.com/in/max"
  }
}
```

### POST /api/booking/[id]/cancel
Storniert einen Termin anhand der Booking ID.

### POST /api/booking/[id]/reschedule
Verschiebt einen Termin auf ein neues Datum/Uhrzeit.

### GET/POST /api/admin/calendar-config
Liest/Speichert Kalender-Einstellungen (Verfügbarkeitszeiten, etc.)

## Embed Widget

Das Buchungssystem kann auf anderen Seiten eingebettet werden:

```html
<iframe
  src="https://termine.denizleventtulay.de/embed/booking"
  width="100%"
  height="700"
  frameborder="0"
></iframe>
```

Oder als Modal-Button:
```html
<script src="https://termine.denizleventtulay.de/embed.js"></script>
<button onclick="openTekomBooking()">Termin buchen</button>
```

## Features

- [x] Notion Integration (Kandidaten-Datenbank)
- [x] E-Mail Versand (Resend + React Email)
- [x] Mock-Modus für Kalender
- [x] Responsive Design (Mobile-ready)
- [x] SEO Optimierung (Schema.org, Open Graph, Sitemap)
- [x] Termin stornieren
- [x] Termin verschieben
- [x] Admin Panel (Kalender-Config)
- [x] Embed Widget
- [x] Vercel Deployment
- [x] Custom Domain (termine.denizleventtulay.de)
- [ ] Azure AD Integration (Credentials von IT pending)
- [ ] Reminder Cron Jobs (Vercel Pro erforderlich)

## Domain & E-Mail Setup

- **Website:** termine.denizleventtulay.de (Vercel)
- **E-Mails:** hello@denizleventtulay.de (Resend)
- **DNS:** IONOS (A-Record + CNAME für Vercel)
- **E-Mail Auth:** SPF, DKIM, DMARC konfiguriert

## Deployment

Das Projekt ist auf Vercel deployed:
1. GitHub Repository: `Katarask/tekom-booking`
2. Vercel Projekt verbunden
3. Environment Variables in Vercel gesetzt
4. Custom Domain konfiguriert

## Known Issues

- **Cron Jobs:** Vercel Free Tier unterstützt keine Cron Jobs. Reminder müssen manuell oder über externen Service (z.B. cron-job.org) getriggert werden.
- **Azure AD:** Noch keine Credentials - System läuft im Mock-Modus.
