import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/50 mb-4">
            Tech Recruiter & Headhunter
          </p>
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-light text-dark mb-6 tracking-tight leading-tight">
            Kostenloses Beratungsgespraech
            <br />
            <span className="text-burgundy">fuer IT-Fachkraefte</span>
          </h1>
          <p className="text-dark/60 font-mono text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Buchen Sie jetzt Ihr persoenliches 30-minuetiges Gespraech mit Deniz Levent Tulay.
            Erhalten Sie individuelle Karriereberatung und Zugang zu exklusiven IT-Stellenangeboten
            in ganz Deutschland.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-burgundy text-cream font-mono text-[11px] uppercase tracking-[0.1em] hover:bg-burgundy/90 transition-all duration-200 group"
          >
            Termin buchen
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/50 mb-3">
            Ihre Vorteile
          </p>
          <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-dark">
            Warum ein Beratungsgespraech?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <article className="bg-sand/30 border border-dark/10 rounded p-6">
            <div className="w-12 h-12 bg-burgundy/10 rounded flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-mono text-dark text-sm mb-2">Exklusive Stellen</h3>
            <p className="text-dark/60 font-mono text-xs leading-relaxed">
              Zugang zu nicht oeffentlich ausgeschriebenen IT-Positionen bei Top-Arbeitgebern.
            </p>
          </article>

          <article className="bg-sand/30 border border-dark/10 rounded p-6">
            <div className="w-12 h-12 bg-burgundy/10 rounded flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-mono text-dark text-sm mb-2">Vertraulich</h3>
            <p className="text-dark/60 font-mono text-xs leading-relaxed">
              Diskrete Beratung - Ihre Jobsuche bleibt vollstaendig vertraulich.
            </p>
          </article>

          <article className="bg-sand/30 border border-dark/10 rounded p-6">
            <div className="w-12 h-12 bg-burgundy/10 rounded flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-burgundy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-mono text-dark text-sm mb-2">100% Kostenlos</h3>
            <p className="text-dark/60 font-mono text-xs leading-relaxed">
              Die Beratung ist fuer Sie als Kandidat komplett kostenlos und unverbindlich.
            </p>
          </article>
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-dark/50 mb-3">
            So funktioniert es
          </p>
          <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-dark">
            In 3 Schritten zum Traumjob
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-burgundy text-cream rounded-full flex items-center justify-center mx-auto mb-4 font-mono text-sm">
              01
            </div>
            <h3 className="font-mono text-dark text-sm mb-2">Termin buchen</h3>
            <p className="text-dark/60 font-mono text-xs">
              Waehlen Sie einen passenden Zeitslot fuer Ihr Online-Gespraech.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-burgundy text-cream rounded-full flex items-center justify-center mx-auto mb-4 font-mono text-sm">
              02
            </div>
            <h3 className="font-mono text-dark text-sm mb-2">Beratungsgespraech</h3>
            <p className="text-dark/60 font-mono text-xs">
              30 Minuten persoenliche Karriereberatung per Microsoft Teams.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-burgundy text-cream rounded-full flex items-center justify-center mx-auto mb-4 font-mono text-sm">
              03
            </div>
            <h3 className="font-mono text-dark text-sm mb-2">Passende Stellen</h3>
            <p className="text-dark/60 font-mono text-xs">
              Erhalten Sie massgeschneiderte Jobangebote basierend auf Ihrem Profil.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-burgundy/5 border border-burgundy/20 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-light text-dark mb-4">
            Bereit fuer den naechsten Karriereschritt?
          </h2>
          <p className="text-dark/60 font-mono text-sm mb-8 max-w-xl mx-auto">
            Lassen Sie uns gemeinsam Ihre Karriereziele besprechen und die passenden
            Moeglichkeiten fuer Sie finden.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-burgundy text-cream font-mono text-[11px] uppercase tracking-[0.1em] hover:bg-burgundy/90 transition-all duration-200 group"
          >
            Jetzt Termin vereinbaren
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 max-w-4xl border-t border-dark/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-dark/40 font-mono text-xs">
          <p>© {new Date().getFullYear()} Deniz Levent Tulay. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <a href="https://denizleventtulay.de" target="_blank" rel="noopener noreferrer" className="hover:text-burgundy transition-colors">
              Portfolio
            </a>
            <a href="https://linkedin.com/in/denizleventtulay" target="_blank" rel="noopener noreferrer" className="hover:text-burgundy transition-colors">
              LinkedIn
            </a>
            <a href="mailto:d.l.tulay@tekom-gmbh.de" className="hover:text-burgundy transition-colors">
              Kontakt
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
