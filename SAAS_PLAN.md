# BookMe SaaS - Implementierungsplan

> Calendly-Alternative für Freelancer. Einfach, günstig, stylisch.
> **Ziel:** 5€/Monat, Launch in 1 Woche

---

## 1. Produkt-Vision

```
"Die einfachste Art, Termine zu buchen.
 Deine Buchungsseite in 2 Minuten."

Zielgruppe: Freelancer, Coaches, Berater
Preis: 5€/Monat (später 9-15€ mit mehr Features)
Konkurrenz: Calendly (zu teuer), Cal.com (zu komplex)
```

---

## 2. MVP Features (Woche 1)

### Must-Have für Launch
- [ ] **Auth:** Google + GitHub + E-Mail Login (Supabase)
- [ ] **Onboarding:** Name, Slug, Timezone → fertig
- [ ] **Buchungsseite:** `bookme.app/[username]`
- [ ] **1 Event-Typ:** z.B. "30 Min Gespräch"
- [ ] **Google Calendar:** Sync (Verfügbarkeit + Events erstellen)
- [ ] **Verfügbarkeit:** Mo-Fr, 9-17 Uhr (einstellbar)
- [ ] **Buchungsformular:** Name, E-Mail, Nachricht
- [ ] **E-Mail Bestätigung:** An beide Parteien
- [ ] **Basic Styling:** 4 Themes zur Auswahl
- [ ] **Stripe:** 5€/Monat Abo (14 Tage Trial)

### Nice-to-Have (wenn Zeit)
- [ ] Custom Farben
- [ ] Profilbild Upload
- [ ] Mehrere Event-Typen

---

## 3. Database Schema (Supabase)

```sql
-- Users (erweitert Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  slug TEXT UNIQUE NOT NULL,           -- bookme.app/[slug]
  timezone TEXT DEFAULT 'Europe/Berlin',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Status
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'trialing',      -- trialing, active, canceled, past_due
  trial_ends_at TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branding/Einstellungen
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'minimal',        -- minimal, dark, colorful, professional
  primary_color TEXT DEFAULT '#652126',
  font TEXT DEFAULT 'Inter',
  logo_url TEXT,
  bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verfügbarkeit
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,            -- 0=So, 1=Mo, ..., 6=Sa
  start_time TIME NOT NULL,            -- 09:00
  end_time TIME NOT NULL,              -- 17:00
  is_available BOOLEAN DEFAULT true
);

-- Event-Typen (verschiedene Buchungsarten)
CREATE TABLE event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                  -- "Erstgespräch"
  slug TEXT NOT NULL,                  -- "erstgespraech"
  description TEXT,
  duration INT NOT NULL DEFAULT 30,    -- Minuten
  color TEXT DEFAULT '#652126',
  is_active BOOLEAN DEFAULT true,
  price DECIMAL(10,2),                 -- NULL = kostenlos
  currency TEXT DEFAULT 'EUR',
  location_type TEXT DEFAULT 'google_meet', -- google_meet, zoom, phone, in_person
  questions JSONB DEFAULT '[]',        -- Custom Fragen
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buchungen
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id UUID REFERENCES event_types(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Gast-Daten
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  guest_notes TEXT,
  guest_answers JSONB DEFAULT '{}',

  -- Termin
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL,

  -- Status
  status TEXT DEFAULT 'confirmed',     -- confirmed, canceled, rescheduled, completed
  canceled_at TIMESTAMPTZ,
  cancel_reason TEXT,

  -- Meeting
  meeting_url TEXT,                    -- Google Meet / Zoom Link
  calendar_event_id TEXT,              -- Google Calendar Event ID

  -- Payment (optional)
  payment_status TEXT,                 -- pending, paid, refunded
  stripe_payment_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Connections
CREATE TABLE calendar_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,              -- google, outlook, apple
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  calendar_id TEXT,                    -- Primary Calendar ID
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;

-- Policies (User kann nur eigene Daten sehen)
CREATE POLICY "Users can view own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own availability" ON availability
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own event types" ON event_types
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings" ON bookings
  FOR ALL USING (auth.uid() = user_id);

-- Public Access für Buchungsseiten (ohne Auth)
CREATE POLICY "Public can view active event types" ON event_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view profiles by slug" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Public can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);
```

---

## 4. API Struktur

```
/api
├── /auth
│   ├── callback/google      # OAuth Callback
│   └── callback/github
│
├── /user
│   ├── GET  /profile        # Eigenes Profil
│   ├── PUT  /profile        # Profil updaten
│   ├── GET  /settings       # Einstellungen
│   ├── PUT  /settings       # Einstellungen updaten
│   └── PUT  /availability   # Verfügbarkeit setzen
│
├── /event-types
│   ├── GET    /             # Alle Event-Typen
│   ├── POST   /             # Neuen Typ erstellen
│   ├── PUT    /[id]         # Typ updaten
│   └── DELETE /[id]         # Typ löschen
│
├── /calendar
│   ├── POST   /connect      # Kalender verbinden
│   ├── DELETE /disconnect   # Kalender trennen
│   └── GET    /available-slots  # Freie Slots
│
├── /bookings
│   ├── GET    /             # Eigene Buchungen
│   ├── POST   /             # Neue Buchung (public)
│   ├── POST   /[id]/cancel  # Stornieren
│   └── POST   /[id]/reschedule
│
├── /billing
│   ├── POST   /checkout     # Stripe Checkout starten
│   ├── POST   /portal       # Stripe Customer Portal
│   └── POST   /webhook      # Stripe Webhooks
│
└── /public
    └── GET /[username]      # Öffentliche Profilseite
    └── GET /[username]/[event-slug]  # Event-Typ Details
```

---

## 5. Seiten-Struktur

```
/app
├── (auth)
│   ├── /login              # Login Page
│   ├── /signup             # Signup Page
│   └── /onboarding         # Nach Signup: Name, Slug wählen
│
├── (dashboard)             # Eingeloggt
│   ├── /dashboard          # Übersicht, nächste Termine
│   ├── /bookings           # Alle Buchungen
│   ├── /event-types        # Event-Typen verwalten
│   ├── /availability       # Verfügbarkeit einstellen
│   ├── /settings
│   │   ├── /profile        # Name, Bio, Links
│   │   ├── /branding       # Theme, Farben, Logo
│   │   ├── /calendar       # Kalender verbinden
│   │   └── /billing        # Abo verwalten
│   └── /analytics          # Stats (Phase 2)
│
├── (public)                # Ohne Auth
│   ├── /[username]         # Buchungsseite
│   ├── /[username]/[event] # Spezifischer Event-Typ
│   └── /book/[bookingId]   # Buchung bestätigen/stornieren
│
└── (marketing)
    ├── /                   # Landing Page
    ├── /pricing            # Preise
    └── /features           # Features
```

---

## 6. UI/UX Flow

### A) Signup Flow (2 Minuten)
```
1. Landing Page → "Kostenlos starten"
2. Google Login (1 Click)
3. Onboarding:
   - "Wie heißt du?" → Max Mustermann
   - "Deine URL:" → bookme.app/max-mustermann (auto-generiert)
   - "Was machst du?" → Freelance Developer (optional)
4. "Verbinde deinen Kalender" → Google Calendar OAuth
5. → Dashboard (fertig!)
```

### B) Buchungsseite (Gast-Sicht)
```
1. bookme.app/max-mustermann
2. Sieht: Name, Bio, verfügbare Event-Typen
3. Klickt: "30 Min Gespräch"
4. Wählt: Datum im Kalender
5. Wählt: Uhrzeit aus freien Slots
6. Formular: Name, E-Mail, Nachricht
7. Bestätigung: "Termin gebucht!"
8. E-Mail: Beide bekommen Bestätigung + Calendar Invite
```

### C) Dashboard (User-Sicht)
```
┌─────────────────────────────────────────────────────┐
│  BookMe          Dashboard  Buchungen  Settings  ▼  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Guten Morgen, Max! 👋                              │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ Heute           │  │ Diese Woche     │          │
│  │ 2 Termine       │  │ 8 Termine       │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
│  Deine Buchungsseite:                              │
│  🔗 bookme.app/max-mustermann    [Kopieren]        │
│                                                     │
│  Nächste Termine                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📅 Heute, 14:00 - Anna Schmidt              │   │
│  │    30 Min Erstgespräch                      │   │
│  │    [Google Meet] [Stornieren]               │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 📅 Morgen, 10:00 - Tom Weber                │   │
│  │    60 Min Beratung                          │   │
│  │    [Google Meet] [Stornieren]               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 7. Themes (MVP)

```css
/* Theme: Minimal (Default) */
--bg: #ffffff;
--text: #0a0a0a;
--primary: #0a0a0a;
--accent: #f5f5f5;

/* Theme: Dark */
--bg: #0a0a0a;
--text: #ffffff;
--primary: #ffffff;
--accent: #1a1a1a;

/* Theme: Warm */
--bg: #EFEDE5;
--text: #0a0a0a;
--primary: #652126;
--accent: #DBD6CC;

/* Theme: Ocean */
--bg: #f0f9ff;
--text: #0c4a6e;
--primary: #0284c7;
--accent: #e0f2fe;
```

---

## 8. Tech Stack

```yaml
Framework:      Next.js 15 (App Router)
Styling:        Tailwind CSS + shadcn/ui
Auth:           Supabase Auth
Database:       Supabase PostgreSQL
Storage:        Supabase Storage (Avatare, Logos)
Payments:       Stripe (Checkout + Customer Portal)
Email:          Resend + React Email
Calendar:       Google Calendar API (Start)
Hosting:        Vercel
Domain:         bookme.app (oder ähnlich)
Analytics:      Plausible oder PostHog (später)
```

### Kosten (bis 1.000 User)
```
Supabase:       Free (500MB DB, 1GB Storage)
Vercel:         Free (100GB Bandwidth)
Resend:         Free (3.000 Emails/Monat)
Stripe:         2.9% + 0.30€ pro Transaktion
Domain:         ~12€/Jahr
─────────────────────────────────
Total:          ~1€/Monat + Stripe Fees
```

---

## 9. Implementierungs-Reihenfolge

### Tag 1: Setup + Auth
```
□ Neues Next.js Projekt (oder Fork von tekom-booking)
□ Supabase Projekt erstellen
□ Database Schema ausführen
□ Supabase Auth einrichten (Google OAuth)
□ Login/Signup Pages
□ Auth Middleware
```

### Tag 2: Onboarding + Profil
```
□ Onboarding Flow (Name, Slug)
□ Profil-Seite (Dashboard)
□ Settings: Profil bearbeiten
□ Slug-Validierung (unique check)
```

### Tag 3: Event-Typen + Verfügbarkeit
```
□ Event-Typen CRUD
□ Verfügbarkeit einstellen (Wochentage, Zeiten)
□ Available Slots API
```

### Tag 4: Buchungsseite (Public)
```
□ /[username] Seite
□ Kalender-Komponente
□ Zeitslot-Auswahl
□ Buchungsformular
□ Buchung in DB speichern
```

### Tag 5: Google Calendar + E-Mail
```
□ Google Calendar OAuth
□ Freie Slots aus Kalender lesen
□ Event in Kalender erstellen
□ Bestätigungs-E-Mail (beide Parteien)
□ Google Meet Link generieren
```

### Tag 6: Stripe + Billing
```
□ Stripe Checkout Integration
□ Webhook Handler
□ Subscription Status in DB
□ Trial Logic (14 Tage)
□ Feature Gating (aktives Abo prüfen)
```

### Tag 7: Polish + Launch
```
□ Themes implementieren
□ Mobile Responsive
□ Error Handling
□ Loading States
□ Landing Page
□ Deploy auf Vercel
□ Domain verbinden
```

---

## 10. Go-to-Market (Erste 100 Kunden)

### Woche 1-2: Soft Launch
```
□ Produkt auf eigener Website nutzen
□ 10 Freelancer-Freunde einladen (Feedback)
□ Bugs fixen, UX verbessern
```

### Woche 3-4: Community Launch
```
□ Indie Hackers Post
□ Reddit: r/freelance, r/SideProject, r/SaaS
□ Twitter/X: Build in Public Thread
□ Product Hunt vorbereiten
```

### Monat 2: Product Hunt Launch
```
□ Product Hunt Launch (Dienstag, 00:01 PST)
□ Hacker News "Show HN"
□ LinkedIn Posts in Freelancer-Gruppen
```

### Ongoing: Content + SEO
```
□ Blog: "Calendly Alternative für Freelancer"
□ YouTube: Setup Tutorial
□ SEO: "kostenlose Terminbuchung"
□ Affiliate: 20% für geworbene Kunden
```

### Preismodell für Launch
```
🎁 Early Bird (erste 100 Kunden):
   3€/Monat statt 5€ (lifetime)

🆓 Free Tier (später):
   - 1 Event-Typ
   - 10 Buchungen/Monat
   - BookMe Branding

💰 Pro (5€/Monat):
   - Unlimited Event-Typen
   - Unlimited Buchungen
   - Eigenes Branding
   - Google Calendar Sync

🚀 Business (15€/Monat) - Phase 2:
   - Alles von Pro
   - Team (3 User)
   - Custom Domain
   - Zapier Integration
   - Priority Support
```

---

## 11. Phase 2 Features (Monat 2-3)

```
□ Outlook Calendar Integration
□ Zoom Integration
□ Custom Branding (Farben, Fonts)
□ Mehrere Event-Typen
□ Bezahlte Buchungen (Stripe Connect)
□ Reminder E-Mails (1h, 24h vorher)
□ Buffer zwischen Terminen
□ Embed Widget
□ Analytics Dashboard
```

---

## 12. Phase 3: Killer-Feature (Monat 4+)

### Landing Page Builder
```
"Deine Freelancer-Seite in 5 Minuten"

Features:
□ Drag & Drop Sections
□ Hero mit Name + Tagline
□ Über mich Block
□ Services/Preise Block
□ Testimonials
□ Buchungs-Widget (integriert!)
□ Kontakt-Formular
□ Social Links
□ Custom Domain

Preis: 15-29€/Monat (Premium Tier)
```

---

## 13. Erfolgs-Metriken

```
Launch-Ziele (Monat 1):
- 50 Signups
- 20 aktive User
- 5 zahlende Kunden (25€ MRR)

Monat 3:
- 200 Signups
- 80 aktive User
- 40 zahlende Kunden (200€ MRR)

Monat 6:
- 1.000 Signups
- 300 aktive User
- 150 zahlende Kunden (750€ MRR)

Jahr 1:
- 5.000 Signups
- 1.000 aktive User
- 400 zahlende Kunden (2.000€ MRR)
```

---

## 14. Risiken & Mitigations

| Risiko | Wahrscheinlichkeit | Mitigation |
|--------|-------------------|------------|
| Zu viel Konkurrenz | Hoch | Fokus auf Nische (DE Freelancer), Preis |
| Wenig Traktion | Mittel | Content Marketing, Build in Public |
| Support-Aufwand | Mittel | Gute Docs, FAQ, Self-Service |
| Google API Limits | Niedrig | Caching, Rate Limiting |
| Stripe Account Issues | Niedrig | Saubere AGB, kein Fraud |

---

## 15. Offene Fragen

```
□ Produktname? (bookme.app, slotly, termino, ...)
□ Domain kaufen?
□ Neues Repo oder Fork von tekom-booking?
□ Free Tier ja/nein?
□ Deutsche oder englische UI?
□ DSGVO: Auftragsverarbeitung nötig?
```

---

## Ready to Build! 🚀

Dieser Plan ist deine Roadmap. Bei Fragen oder wenn du starten willst, sag Bescheid.

**Nächster Schritt:** Supabase Projekt aufsetzen + Auth implementieren.
