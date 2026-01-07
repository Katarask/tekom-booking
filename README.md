# TEKOM Booking System

Eine selbst-gehostete Calendly-Alternative für TEKOM Recruiting. Ermöglicht Kandidaten, Beratungstermine zu buchen, und synchronisiert diese mit Outlook/Notion.

## Features

- 📅 **Kalender-Integration**: Synchronisiert mit Outlook (Microsoft Graph API)
- 📝 **Fragebogen**: Erfasst alle relevanten Kandidaten-Informationen
- 💾 **Notion-Datenbank**: Speichert alle Buchungen automatisch in Notion
- 📧 **Email-Benachrichtigungen**: Bestätigungen und Reminder via Resend
- 🎨 **Modernes UI**: Responsive Design mit Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Kalender**: Microsoft Graph API (Outlook)
- **Datenbank**: Notion API
- **Emails**: Resend
- **Hosting**: Vercel

## Setup

### 1. Repository klonen

```bash
git clone https://github.com/YOUR_USERNAME/tekom-booking.git
cd tekom-booking
npm install
```

### 2. Environment Variables

Kopiere `.env.example` zu `.env.local` und fülle die Werte aus:

```bash
cp .env.example .env.local
```

### 3. Azure AD App erstellen

1. Gehe zu [Azure Portal](https://portal.azure.com)
2. Azure Active Directory → App registrations → New registration
3. Name: "TEKOM Booking System"
4. Redirect URI: `https://your-domain.vercel.app/api/auth/microsoft`
5. API Permissions hinzufügen:
   - `Calendars.ReadWrite`
   - `User.Read`
6. Client Secret erstellen

### 4. Notion Integration erstellen

1. Gehe zu [Notion Integrations](https://www.notion.so/my-integrations)
2. Neue Integration erstellen
3. Datenbank erstellen mit folgenden Properties:
   - Name (Title)
   - Email (Email)
   - Telefon (Phone)
   - Termin (Date)
   - Status (Select: Geplant, Abgeschlossen, Abgesagt, No-Show)
   - Position (Rich Text)
   - Verfügbar ab (Rich Text)
   - Region (Multi-Select: Alle Bundesländer)
   - Gehaltsvorstellung (Rich Text)
   - Arbeitsverhältnis (Multi-Select)
   - Arbeitszeit (Select)
   - Arbeitsort (Select)
   - Vertragsform (Multi-Select)
   - LinkedIn (URL)
   - Outlook Event ID (Rich Text)
   - Meeting Link (URL)

### 5. Resend Account

1. Account erstellen auf [resend.com](https://resend.com)
2. Domain verifizieren
3. API Key kopieren

### 6. Lokal starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. Repository zu GitHub pushen
2. In Vercel importieren
3. Environment Variables setzen
4. Deployen!

## Projektstruktur

```
tekom-booking/
├── src/
│   ├── app/
│   │   ├── booking/           # Booking Flow Pages
│   │   └── api/               # API Routes
│   ├── components/
│   │   ├── booking/           # Booking-spezifische Komponenten
│   │   └── layout/            # Layout Komponenten
│   ├── lib/                   # Helper Functions
│   ├── emails/                # React Email Templates
│   └── types/                 # TypeScript Types
└── public/                    # Static Assets
```

## Kosten

| Service | Kosten |
|---------|--------|
| Vercel | Kostenlos |
| Notion API | Kostenlos |
| Resend | Kostenlos (3k Emails/Monat) |
| Microsoft Graph | Kostenlos |
| **Total** | **0€/Monat** |

## Lizenz

Internes Projekt für TEKOM Industrielle Systemtechnik GmbH.
