import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
  Preview,
} from "@react-email/components";

interface BookingConfirmationProps {
  name: string;
  date: string;
  time: string;
  meetingLink: string;
  cancelLink: string;
  rescheduleLink: string;
}

export default function BookingConfirmation({
  name = "Max",
  date = "Freitag, 10. Januar 2025",
  time = "10:00 Uhr",
  meetingLink = "https://teams.microsoft.com/meet/...",
  cancelLink = "https://termine.tekom.de/cancel/123",
  rescheduleLink = "https://termine.tekom.de/reschedule/123",
}: BookingConfirmationProps) {
  const consentLink = "https://tekom-einwilligung.vercel.app/";

  return (
    <Html>
      <Head />
      <Preview>Terminbestätigung - Gespräch mit Deniz Levent Tulay</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Text style={logoText}>TEKOM</Text>
          </Section>

          {/* Greeting */}
          <Text style={paragraph}>Hallo {name},</Text>

          <Text style={paragraph}>
            vielen Dank für Ihren Eintrag in meinen Kalender – ich freue mich auf unser Gespräch.
          </Text>

          {/* Details Box */}
          <Section style={detailsBox}>
            <Text style={detailsHeading}>Termindetails</Text>
            <Text style={detailsText}>
              📅 {date}
              <br />
              🕐 {time}
              <br />
              📍 Microsoft Teams (Online)
            </Text>
          </Section>

          {/* Join Button */}
          <Section style={buttonSection}>
            <Button style={primaryButton} href={meetingLink}>
              Am Meeting teilnehmen
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Transparency Notice */}
          <Text style={subheading}>Ein kurzer transparenter Hinweis:</Text>

          <Text style={paragraph}>
            Ihre Angaben werden in meinem System (ATS) gespeichert und können im Anschluss
            in anonymisierter Form mit potenziellen Firmen ausgetauscht werden – z. B. zur
            fachlichen Einordnung und Vermittlung.
          </Text>

          <Text style={paragraph}>
            Während des Gesprächs erstelle ich zudem ein Transkript mithilfe einer KI-gestützten
            Software, um die Inhalte strukturiert auswerten und objektiv einschätzen zu können.
          </Text>

          <Text style={paragraph}>
            Damit ich Ihre Daten in anonymisierter Form mit meinen Kunden teilen darf,
            benötige ich Ihre Einwilligung zur Weitergabe der Bewerberdaten.
          </Text>

          {/* Consent Button */}
          <Section style={buttonSection}>
            <Button style={consentButton} href={consentLink}>
              👉 Einwilligung erteilen
            </Button>
          </Section>

          <Hr style={hr} />

          {/* CV Request */}
          <Text style={paragraph}>
            Falls noch nicht geschehen, senden Sie mir bitte kurz Ihren Lebenslauf an{" "}
            <Link href="mailto:d.l.tulay@tekom-gmbh.de" style={emailLink}>
              d.l.tulay@tekom-gmbh.de
            </Link>
            , damit ich Sie optimal vorbereiten und bei passenden Positionen berücksichtigen kann.
          </Text>

          <Text style={infoText}>
            Wenn Sie mit der Aufzeichnung nicht einverstanden sind, geben Sie mir bitte
            einfach kurz Bescheid – Ihre Daten bleiben selbstverständlich vertraulich.
          </Text>

          <Hr style={hr} />

          {/* Footer Actions */}
          <Section style={footerActions}>
            <Link href={rescheduleLink} style={footerLink}>
              Termin verschieben
            </Link>
            <Text style={footerDivider}>|</Text>
            <Link href={cancelLink} style={footerLink}>
              Termin absagen
            </Link>
          </Section>

          {/* Signature */}
          <Section style={signatureSection}>
            <Text style={signatureText}>
              Viele Grüße,
              <br />
              <strong>Deniz Levent Tulay</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              TEKOM Industrielle Systemtechnik GmbH
              <br />
              Ihr Partner für Recruiting in der High-Tech-Industrie
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const logoText = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#0066cc",
  margin: "0",
};

const subheading = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 15px 0",
};

const paragraph = {
  fontSize: "16px",
  color: "#4a4a4a",
  lineHeight: "1.6",
  margin: "0 0 15px 0",
};

const detailsBox = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  margin: "25px 0",
};

const detailsHeading = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#666666",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 12px 0",
};

const detailsText = {
  fontSize: "16px",
  color: "#1a1a1a",
  lineHeight: "1.8",
  margin: "0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const primaryButton = {
  backgroundColor: "#0066cc",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "600",
};

const consentButton = {
  backgroundColor: "#10b981",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "600",
};

const emailLink = {
  color: "#0066cc",
  textDecoration: "underline",
};

const infoText = {
  fontSize: "14px",
  color: "#666666",
  lineHeight: "1.6",
  margin: "15px 0",
  fontStyle: "italic" as const,
};

const hr = {
  borderTop: "1px solid #e0e0e0",
  margin: "30px 0",
};

const footerActions = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const footerLink = {
  color: "#0066cc",
  textDecoration: "none",
  fontSize: "14px",
};

const footerDivider = {
  display: "inline",
  margin: "0 10px",
  color: "#cccccc",
};

const signatureSection = {
  marginBottom: "30px",
};

const signatureText = {
  fontSize: "16px",
  color: "#4a4a4a",
  lineHeight: "1.6",
  margin: "0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#666666",
  lineHeight: "1.5",
  margin: "0",
};
