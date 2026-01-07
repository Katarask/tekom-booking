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

interface BookingCancellationProps {
  name: string;
  date: string;
  time: string;
  rebookLink: string;
}

export default function BookingCancellation({
  name = "Max Mustermann",
  date = "Freitag, 10. Januar 2025",
  time = "10:00 Uhr",
  rebookLink = "https://termine.tekom.de/booking",
}: BookingCancellationProps) {
  return (
    <Html>
      <Head />
      <Preview>Ihr Termin wurde abgesagt</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Text style={logoText}>TEKOM</Text>
          </Section>

          {/* Header */}
          <Section style={headerSection}>
            <Text style={icon}>✕</Text>
            <Text style={heading}>Termin abgesagt</Text>
          </Section>

          {/* Greeting */}
          <Text style={paragraph}>Hallo {name},</Text>
          <Text style={paragraph}>
            Ihr folgender Termin bei TEKOM wurde abgesagt:
          </Text>

          {/* Details Box */}
          <Section style={detailsBox}>
            <Text style={detailsText}>
              📅 {date}
              <br />
              🕐 {time}
            </Text>
          </Section>

          <Text style={paragraph}>
            Falls Sie weiterhin Interesse an einem Beratungsgespräch haben,
            können Sie gerne einen neuen Termin buchen.
          </Text>

          {/* Rebook Button */}
          <Section style={buttonSection}>
            <Button style={primaryButton} href={rebookLink}>
              Neuen Termin buchen
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              TEKOM Industrielle Systemtechnik GmbH
              <br />
              Ihr Partner für Recruiting in der High-Tech-Industrie
            </Text>
            <Text style={footerTextSmall}>
              Bei Fragen kontaktieren Sie uns unter{" "}
              <Link href="mailto:recruiting@tekom.de" style={footerLink}>
                recruiting@tekom.de
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

const icon = {
  fontSize: "40px",
  color: "#dc2626",
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
  backgroundColor: "#fef2f2",
  padding: "24px",
  borderRadius: "8px",
  border: "1px solid #fecaca",
  margin: "25px 0",
};

const detailsText = {
  fontSize: "16px",
  color: "#1a1a1a",
  lineHeight: "1.8",
  margin: "0",
  textDecoration: "line-through",
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

const hr = {
  borderTop: "1px solid #e0e0e0",
  margin: "30px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#666666",
  lineHeight: "1.5",
  margin: "0 0 10px 0",
};

const footerTextSmall = {
  fontSize: "12px",
  color: "#999999",
  margin: "0",
};

const footerLink = {
  color: "#0066cc",
  textDecoration: "none",
};
