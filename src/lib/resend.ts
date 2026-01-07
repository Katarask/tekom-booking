import { Resend } from "resend";
import BookingConfirmation from "@/emails/BookingConfirmation";
import BookingReminder from "@/emails/BookingReminder";
import BookingCancellation from "@/emails/BookingCancellation";
import { ConfirmationEmailData, ReminderEmailData } from "@/types";
import { formatDate, formatTime } from "./utils";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "termine@tekom.de";
const FROM_NAME = process.env.FROM_NAME || "TEKOM Recruiting";

export async function sendConfirmationEmail(
  data: ConfirmationEmailData
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://termine.denizleventtulay.de";

  console.log("📧 Sending confirmation email to:", data.to);
  console.log("📧 From:", `${FROM_NAME} <${FROM_EMAIL}>`);
  console.log("📧 Base URL:", baseUrl);
  console.log("📧 Cancel Link:", `${baseUrl}/booking/cancel/${data.bookingId}`);
  console.log("📧 Reschedule Link:", `${baseUrl}/booking/reschedule/${data.bookingId}`);

  const result = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.to,
    subject: `Terminbestätigung: ${data.date} um ${data.time}`,
    react: BookingConfirmation({
      name: data.name,
      date: data.date,
      time: data.time,
      meetingLink: data.meetingLink,
      cancelLink: `${baseUrl}/booking/cancel/${data.bookingId}`,
      rescheduleLink: `${baseUrl}/booking/reschedule/${data.bookingId}`,
    }),
  });

  console.log("📧 Email result:", JSON.stringify(result, null, 2));
}

export async function sendReminderEmail(
  data: ReminderEmailData
): Promise<void> {
  const subject =
    data.hoursUntil === 1
      ? `Erinnerung: Ihr Termin in 1 Stunde`
      : `Erinnerung: Ihr Termin morgen um ${data.time}`;

  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.to,
    subject,
    react: BookingReminder({
      name: data.name,
      date: data.date,
      time: data.time,
      meetingLink: data.meetingLink,
      hoursUntil: data.hoursUntil,
    }),
  });
}

export async function sendCancellationEmail(data: {
  to: string;
  name: string;
  date: string;
  time: string;
}): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://termine.denizleventtulay.de";

  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.to,
    subject: `Termin abgesagt: ${data.date}`,
    react: BookingCancellation({
      name: data.name,
      date: data.date,
      time: data.time,
      rebookLink: `${baseUrl}/booking`,
    }),
  });
}

// Send CV backup email to recruiter
export async function sendCvBackupEmail(data: {
  candidateName: string;
  candidateEmail: string;
  position: string;
  cvFile: File;
}): Promise<void> {
  const RECRUITER_EMAIL = "d.l.tulay@tekom-gmbh.de";

  // Convert File to base64 for attachment
  const fileBuffer = await data.cvFile.arrayBuffer();
  const base64Content = Buffer.from(fileBuffer).toString("base64");

  await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: RECRUITER_EMAIL,
    subject: `Neuer Lebenslauf: ${data.candidateName} - ${data.position}`,
    html: `
      <h2>Neuer Lebenslauf eingegangen</h2>
      <p><strong>Kandidat:</strong> ${data.candidateName}</p>
      <p><strong>E-Mail:</strong> ${data.candidateEmail}</p>
      <p><strong>Position:</strong> ${data.position}</p>
      <p>Der Lebenslauf ist als Anhang beigefügt und wurde auch in Notion gespeichert.</p>
    `,
    attachments: [
      {
        filename: data.cvFile.name,
        content: base64Content,
      },
    ],
  });
}
