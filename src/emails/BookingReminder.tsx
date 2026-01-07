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

interface BookingReminderProps {
  name: string;
  date: string;
  time: string;
  meetingLink: string;
  hoursUntil: number;
}

export default function BookingReminder({
  name = "Max",
  date = "Freitag, 10. Januar 2025",
  time = "10:00 Uhr",
  meetingLink = "https://teams.microsoft.com/meet/...",
  hoursUntil = 1,
}: BookingReminderProps) {
  return (
    <Html>
      <Head />
      <Preview>Erinnerung: Unser Gespräch beginnt in etwa einer Stunde</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Text style={logoText}>TEKOM</Text>
          </Section>

          {/* Header */}
          <Section style={headerSection}>
            <Text style={bellIcon}>🔔</Text>
            <Text style={heading}>Gleich geht's los!</Text>
          </Section>

          {/* Greeting */}
          <Text style={paragraph}>Hallo {name},</Text>

          <Text style={paragraph}>
            ich freue mich auf unser Gespräch – in etwa einer Stunde ist es so weit.
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

          {/* Tips */}
          <Section style={tipsBox}>
            <Text style={tipsHeading}>Kurze Checkliste:</Text>
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
          <Text style={paragraph}>
            Bis gleich!
          </Text>

          <Section style={signatureSection}>
            <Text style={signatureText}>
              <strong>Deniz Levent Tulay</strong>
              <br />
              <span style={signatureRole}>Vermittlung innovativer Köpfe in Defense | IT | Robotik | Aviation | Aerospace</span>
            </Text>
          </Section>

          <Section style={companyInfo}>
            <Text style={companyText}>
              TEKOM INDUSTRIELLE SYSTEMTECHNIK GMBH
              <br />
              Westenriederstraße 49
              <br />
              80331 München
            </Text>
            <Text style={contactText}>
              📱 0172 293 5160
              <br />
              ☎️ 089 290 33 815
              <br />
              ✉️{" "}
              <Link href="mailto:d.l.tulay@tekom-gmbh.de" style={contactLink}>
                d.l.tulay@tekom-gmbh.de
              </Link>
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

const headerSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const bellIcon = {
  fontSize: "40px",
  margin: "0 0 10px 0",
};

const heading = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0",
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

const tipsBox = {
  backgroundColor: "#f0f7ff",
  padding: "20px",
  borderRadius: "8px",
  margin: "25px 0",
};

const tipsHeading = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#0066cc",
  margin: "0 0 10px 0",
};

const tipsText = {
  fontSize: "14px",
  color: "#4a4a4a",
  lineHeight: "1.8",
  margin: "0",
};

const hr = {
  borderTop: "1px solid #e0e0e0",
  margin: "30px 0",
};

const signatureSection = {
  marginBottom: "20px",
};

const signatureText = {
  fontSize: "14px",
  color: "#4a4a4a",
  lineHeight: "1.6",
  margin: "0",
};

const signatureRole = {
  fontSize: "12px",
  color: "#666666",
};

const companyInfo = {
  marginTop: "20px",
};

const companyText = {
  fontSize: "12px",
  color: "#666666",
  lineHeight: "1.5",
  margin: "0 0 10px 0",
};

const contactText = {
  fontSize: "12px",
  color: "#666666",
  lineHeight: "1.8",
  margin: "0",
};

const contactLink = {
  color: "#0066cc",
  textDecoration: "none",
};
