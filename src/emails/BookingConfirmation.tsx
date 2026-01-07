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
  Font,
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
  cancelLink = "https://termine.denizleventtulay.de/booking/cancel/123",
  rescheduleLink = "https://termine.denizleventtulay.de/booking/reschedule/123",
}: BookingConfirmationProps) {
  const consentLink = "https://tekom-einwilligung.vercel.app/";

  return (
    <Html>
      <Head>
        <Font
          fontFamily="JetBrains Mono"
          fallbackFontFamily="monospace"
          webFont={{
            url: "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2",
            format: "woff2",
          }}
        />
      </Head>
      <Preview>Terminbestätigung - Gespräch mit Deniz Levent Tulay</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              <span style={logoDot}>●</span> ~DENIZ
            </Text>
          </Section>

          {/* Greeting */}
          <Text style={paragraph}>Hallo {name},</Text>

          <Text style={paragraph}>
            vielen Dank für Ihren Eintrag in meinen Kalender – ich freue mich auf unser Gespräch.
          </Text>

          {/* Details Box */}
          <Section style={detailsBox}>
            <Text style={detailsHeading}>TERMINDETAILS</Text>
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
              Am Meeting teilnehmen →
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Transparency Notice */}
          <Text style={subheading}>EIN KURZER HINWEIS</Text>

          <Text style={paragraphSmall}>
            Ihre Angaben werden in meinem System (ATS) gespeichert und können im Anschluss
            in anonymisierter Form mit potenziellen Firmen ausgetauscht werden.
          </Text>

          <Text style={paragraphSmall}>
            Während des Gesprächs erstelle ich ein Transkript mithilfe einer KI-gestützten
            Software, um die Inhalte strukturiert auswerten zu können.
          </Text>

          {/* Consent Button */}
          <Section style={buttonSection}>
            <Button style={secondaryButton} href={consentLink}>
              Einwilligung erteilen
            </Button>
          </Section>

          <Hr style={hr} />

          {/* CV Request */}
          <Text style={paragraphSmall}>
            Falls noch nicht geschehen, senden Sie mir bitte Ihren Lebenslauf an{" "}
            <Link href="mailto:d.l.tulay@tekom-gmbh.de" style={emailLink}>
              d.l.tulay@tekom-gmbh.de
            </Link>
          </Text>

          <Hr style={hr} />

          {/* Footer Actions */}
          <Section style={footerActions}>
            <Link href={rescheduleLink} style={footerLink}>
              Termin verschieben
            </Link>
            <Text style={footerDivider}> | </Text>
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
            <Text style={signatureRole}>
              Tech Recruiter & Headhunter
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              termine.denizleventtulay.de
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Brand Colors
const colors = {
  cream: "#EFEDE5",
  sand: "#DBD6CC",
  burgundy: "#652126",
  dark: "#0a0a0a",
};

// Styles
const main = {
  backgroundColor: colors.cream,
  fontFamily: '"JetBrains Mono", monospace',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const header = {
  backgroundColor: colors.dark,
  padding: "16px 24px",
  marginBottom: "30px",
};

const logo = {
  fontSize: "14px",
  fontWeight: "400",
  color: colors.cream,
  margin: "0",
  letterSpacing: "0.1em",
};

const logoDot = {
  color: colors.burgundy,
  marginRight: "8px",
};

const subheading = {
  fontSize: "11px",
  fontWeight: "600",
  color: colors.dark,
  margin: "0 0 15px 0",
  letterSpacing: "0.15em",
  opacity: 0.5,
};

const paragraph = {
  fontSize: "14px",
  color: colors.dark,
  lineHeight: "1.6",
  margin: "0 0 15px 0",
};

const paragraphSmall = {
  fontSize: "12px",
  color: colors.dark,
  lineHeight: "1.6",
  margin: "0 0 12px 0",
  opacity: 0.7,
};

const detailsBox = {
  backgroundColor: colors.sand,
  padding: "24px",
  borderRadius: "4px",
  border: `1px solid ${colors.dark}10`,
  margin: "25px 0",
};

const detailsHeading = {
  fontSize: "11px",
  fontWeight: "600",
  color: colors.dark,
  letterSpacing: "0.15em",
  margin: "0 0 12px 0",
  opacity: 0.5,
};

const detailsText = {
  fontSize: "14px",
  color: colors.dark,
  lineHeight: "1.8",
  margin: "0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const primaryButton = {
  backgroundColor: colors.burgundy,
  color: colors.cream,
  padding: "14px 28px",
  borderRadius: "4px",
  textDecoration: "none",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
};

const secondaryButton = {
  backgroundColor: "transparent",
  color: colors.burgundy,
  padding: "12px 24px",
  borderRadius: "4px",
  border: `1px solid ${colors.burgundy}`,
  textDecoration: "none",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
};

const emailLink = {
  color: colors.burgundy,
  textDecoration: "underline",
};

const hr = {
  borderTop: `1px solid ${colors.dark}15`,
  margin: "30px 0",
};

const footerActions = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const footerLink = {
  color: colors.burgundy,
  textDecoration: "none",
  fontSize: "12px",
};

const footerDivider = {
  display: "inline",
  margin: "0 10px",
  color: colors.dark,
  opacity: 0.3,
};

const signatureSection = {
  marginBottom: "30px",
};

const signatureText = {
  fontSize: "14px",
  color: colors.dark,
  lineHeight: "1.6",
  margin: "0 0 4px 0",
};

const signatureRole = {
  fontSize: "11px",
  color: colors.dark,
  opacity: 0.5,
  letterSpacing: "0.1em",
  margin: "0",
};

const footer = {
  textAlign: "center" as const,
  borderTop: `1px solid ${colors.dark}10`,
  paddingTop: "20px",
};

const footerText = {
  fontSize: "11px",
  color: colors.dark,
  opacity: 0.4,
  letterSpacing: "0.1em",
  margin: "0",
};
