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

interface BookingCancellationProps {
  name: string;
  date: string;
  time: string;
  rebookLink: string;
}

const BASE_URL = "https://termine.denizleventtulay.de";

export default function BookingCancellation({
  name = "Max",
  date = "Freitag, 10. Januar 2025",
  time = "10:00 Uhr",
  rebookLink = `${BASE_URL}/booking`,
}: BookingCancellationProps) {
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
      <Preview>Ihr Termin wurde abgesagt</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>Deniz Levent Tulay</Text>
            <Text style={headerSubtitle}>Headhunting / Personalberatung</Text>
          </Section>

          {/* Icon */}
          <Section style={iconSection}>
            <Text style={icon}>✕</Text>
          </Section>

          <Text style={subheading}>TERMIN ABGESAGT</Text>

          {/* Greeting */}
          <Text style={paragraph}>Hallo {name},</Text>
          <Text style={paragraph}>
            Ihr folgender Termin wurde abgesagt:
          </Text>

          {/* Details Box */}
          <Section style={detailsBox}>
            <Text style={detailsText}>
              <span style={strikethrough}>📅 {date}</span>
              <br />
              <span style={strikethrough}>🕐 {time}</span>
            </Text>
          </Section>

          <Text style={paragraph}>
            Falls Sie weiterhin Interesse an einem Beratungsgespräch haben,
            können Sie gerne einen neuen Termin buchen.
          </Text>

          {/* Rebook Button */}
          <Section style={buttonSection}>
            <Button style={primaryButton} href={rebookLink}>
              Neuen Termin buchen →
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Signature */}
          <Section style={signatureSection}>
            <Text style={signatureText}>
              Viele Grüße,
              <br />
              <strong>Deniz Levent Tulay</strong>
            </Text>
            <Text style={signatureRole}>
              Headhunting / Personalberatung
            </Text>
            <Text style={signatureContact}>
              📱 0172 293 5160
              <br />
              ✉️ d.l.tulay@tekom-gmbh.de
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Link href={BASE_URL} style={footerWebsite}>
              termine.denizleventtulay.de
            </Link>
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
  padding: "24px",
  marginBottom: "30px",
  textAlign: "center" as const,
};

const headerTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: colors.cream,
  margin: "0 0 4px 0",
  letterSpacing: "0.05em",
};

const headerSubtitle = {
  fontSize: "11px",
  fontWeight: "400",
  color: colors.burgundy,
  margin: "0",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
};

const iconSection = {
  textAlign: "center" as const,
  marginBottom: "20px",
};

const icon = {
  fontSize: "32px",
  color: colors.burgundy,
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
  backgroundColor: `${colors.burgundy}10`,
  padding: "24px",
  borderRadius: "4px",
  border: `1px solid ${colors.burgundy}30`,
  margin: "25px 0",
};

const detailsText = {
  fontSize: "14px",
  color: colors.dark,
  lineHeight: "1.8",
  margin: "0",
};

const strikethrough = {
  textDecoration: "line-through",
  opacity: 0.6,
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

const hr = {
  borderTop: `1px solid ${colors.dark}15`,
  margin: "30px 0",
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
  color: colors.burgundy,
  letterSpacing: "0.1em",
  margin: "0 0 12px 0",
  fontWeight: "600",
};

const signatureContact = {
  fontSize: "12px",
  color: colors.dark,
  lineHeight: "1.8",
  margin: "0",
  opacity: 0.6,
};

const footer = {
  textAlign: "center" as const,
  borderTop: `1px solid ${colors.dark}10`,
  paddingTop: "20px",
};

const footerWebsite = {
  fontSize: "11px",
  color: colors.dark,
  opacity: 0.4,
  letterSpacing: "0.1em",
  textDecoration: "none",
};
