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

interface BookingReminderProps {
  name: string;
  date: string;
  time: string;
  meetingLink: string;
  hoursUntil?: number;
}

export default function BookingReminder({
  name = "Max",
  date = "Freitag, 10. Januar 2025",
  time = "10:00 Uhr",
  meetingLink = "https://teams.microsoft.com/meet/...",
}: BookingReminderProps) {
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
      <Preview>Erinnerung: Unser Gespräch beginnt in etwa einer Stunde</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              <span style={logoDot}>●</span> ~DENIZ
            </Text>
          </Section>

          {/* Icon */}
          <Section style={iconSection}>
            <Text style={icon}>🔔</Text>
          </Section>

          <Text style={subheading}>GLEICH GEHT&apos;S LOS!</Text>

          {/* Greeting */}
          <Text style={paragraph}>Hallo {name},</Text>

          <Text style={paragraph}>
            ich freue mich auf unser Gespräch – in etwa einer Stunde ist es so weit.
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

          {/* Tips */}
          <Section style={tipsBox}>
            <Text style={tipsHeading}>KURZE CHECKLISTE</Text>
            <Text style={tipsText}>
              ✓ Stabile Internetverbindung
              <br />
              ✓ Ruhige Umgebung
              <br />
              ✓ Kamera und Mikrofon getestet
              <br />
              ✓ Lebenslauf griffbereit
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Signature */}
          <Text style={paragraph}>Bis gleich!</Text>

          <Section style={signatureSection}>
            <Text style={signatureText}>
              <strong>Deniz Levent Tulay</strong>
            </Text>
            <Text style={signatureRole}>
              Tech Recruiter & Headhunter
            </Text>
          </Section>

          <Section style={companyInfo}>
            <Text style={companyText}>
              📱 0172 293 5160
              <br />
              ✉️{" "}
              <Link href="mailto:d.l.tulay@tekom-gmbh.de" style={contactLink}>
                d.l.tulay@tekom-gmbh.de
              </Link>
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

const iconSection = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const icon = {
  fontSize: "32px",
  margin: "0",
};

const subheading = {
  fontSize: "11px",
  fontWeight: "600",
  color: colors.dark,
  margin: "0 0 20px 0",
  letterSpacing: "0.15em",
  textAlign: "center" as const,
  opacity: 0.5,
};

const paragraph = {
  fontSize: "14px",
  color: colors.dark,
  lineHeight: "1.6",
  margin: "0 0 15px 0",
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

const tipsBox = {
  backgroundColor: `${colors.burgundy}08`,
  padding: "20px",
  borderRadius: "4px",
  border: `1px solid ${colors.burgundy}15`,
  margin: "25px 0",
};

const tipsHeading = {
  fontSize: "11px",
  fontWeight: "600",
  color: colors.burgundy,
  letterSpacing: "0.15em",
  margin: "0 0 12px 0",
};

const tipsText = {
  fontSize: "13px",
  color: colors.dark,
  lineHeight: "1.8",
  margin: "0",
  opacity: 0.8,
};

const hr = {
  borderTop: `1px solid ${colors.dark}15`,
  margin: "30px 0",
};

const signatureSection = {
  marginBottom: "10px",
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

const companyInfo = {
  marginTop: "15px",
  marginBottom: "30px",
};

const companyText = {
  fontSize: "12px",
  color: colors.dark,
  lineHeight: "1.8",
  margin: "0",
  opacity: 0.6,
};

const contactLink = {
  color: colors.burgundy,
  textDecoration: "none",
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
