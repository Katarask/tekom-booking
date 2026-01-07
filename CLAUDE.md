# TEKOM Booking System

Self-hosted Calendly-Alternative für TEKOM Recruiting.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Notion API
- **Calendar:** Microsoft Graph API (Outlook/Teams)
- **Email:** Resend
- **Hosting:** Vercel (geplant)

## Projekt-Struktur

```
src/
├── app/
│   ├── api/
│   │   ├── calendar/
│   │   │   ├── available-slots/   # GET: Verfügbare Termine
│   │   │   └── book/              # POST: Termin buchen
│   │   └── cron/                  # Reminder-Jobs
│   ├── book/                      # Booking Flow UI
│   └── page.tsx                   # Landing Page
├── components/                    # React Components
├── lib/
│   ├── notion.ts                  # Notion API Integration
│   ├── microsoft-graph.ts         # Outlook/Teams Integration
│   ├── resend.ts                  # E-Mail Versand
│   └── utils.ts                   # Hilfsfunktionen
└── types/                         # TypeScript Types
```

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

## Environment Variables

```env
# Notion
NOTION_API_KEY=
NOTION_DATABASE_ID=

# Resend (Email)
RESEND_API_KEY=
FROM_EMAIL=hello@denizleventtulay.de
FROM_NAME=TEKOM Recruiting

# Microsoft Graph API (Azure AD)
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=
MICROSOFT_USER_ID=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Jobs
CRON_SECRET=
```

## Development

```bash
npm run dev    # Startet auf Port 3000 (oder 3001 wenn belegt)
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

## Status

- [x] Notion Integration
- [x] E-Mail Versand (Resend)
- [x] Mock-Modus für Kalender
- [ ] Azure AD Integration (Credentials von IT pending)
- [ ] Vercel Deployment
- [ ] Custom Domain (termine.denizleventtulay.de)

## Domain Setup

- E-Mails werden von `hello@denizleventtulay.de` gesendet
- Domain ist bei Resend verifiziert
- DNS Records bei IONOS konfiguriert (SPF, DKIM, DMARC)
