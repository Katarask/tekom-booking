import { Client } from "@notionhq/client";
import { BookingFormData, BookingStatus } from "@/types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

interface CreateBookingParams extends BookingFormData {
  dateTime: string;
  outlookEventId: string;
  meetingLink: string;
}

export async function createBooking(
  data: CreateBookingParams
): Promise<{ pageId: string; url: string }> {
  // Map work location to Home-Office format
  const homeOfficeValue = data.workLocation === "Remote" ? "Remote"
    : data.workLocation === "Hybrid" ? "Hybrid"
    : "Vor Ort";

  const response = await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      // Title field (Name des Kandidaten)
      Name: {
        title: [
          {
            text: {
              content: `${data.firstName} ${data.lastName}`,
            },
          },
        ],
      },
      // E-Mail (Email type)
      "E-Mail": {
        email: data.email,
      },
      // Handynummer (Phone type)
      "Handynummer": {
        phone_number: data.phone || null,
      },
      // Position (Rich text)
      "Position": {
        rich_text: [
          {
            text: {
              content: data.position,
            },
          },
        ],
      },
      // Verfügbarkeit (Date) - wann der Kandidat verfügbar ist
      "Verfügbarkeit": {
        date: data.availableFrom ? {
          start: data.dateTime.split("T")[0], // Use booking date as placeholder
        } : null,
      },
      // Kündigungsfrist (Rich text)
      "Kündigungsfrist": {
        rich_text: [
          {
            text: {
              content: data.availableFrom,
            },
          },
        ],
      },
      // Gesuchte Region (Rich text)
      "Gesuchte Region": {
        rich_text: [
          {
            text: {
              content: data.regions.join(", "),
            },
          },
        ],
      },
      // Gehaltsvorstellung (Rich text)
      "Gehaltsvorstellung": {
        rich_text: [
          {
            text: {
              content: data.salary,
            },
          },
        ],
      },
      // Beschäftigungsverhältnis (Multi-select) - ANÜ, Festanstellung, Freelancing
      "Beschäftigungsverhältnis": {
        multi_select: data.employmentTypes.map((t) => ({ name: t })),
      },
      // Arbeitszeit (Select)
      "Arbeitszeit": {
        select: {
          name: data.workTime,
        },
      },
      // Home-Office (Select) - Remote, Hybrid, Vor Ort
      "Home-Office": {
        select: {
          name: homeOfficeValue,
        },
      },
      // Vertragsform (Multi-select) - Unbefristet, Befristet, Projektarbeit
      "Vertragsform": {
        multi_select: data.contractTypes.map((t) => ({ name: t })),
      },
      // LinkedIn URL
      "LinkedIn URL": {
        url: data.linkedIn || null,
      },
      // Pipeline Status (Status) - Erstgespräch als Default
      "Pipeline Status": {
        status: {
          name: "Erstgespräch",
        },
      },
      // Meeting Briefing (Rich text) - Meeting Link und Event ID
      "Meeting Briefing": {
        rich_text: [
          {
            text: {
              content: `Teams Link: ${data.meetingLink}\nTermin: ${data.dateTime}\nEvent ID: ${data.outlookEventId}`,
            },
          },
        ],
      },
    },
  });

  return {
    pageId: response.id,
    url: (response as any).url,
  };
}

export async function updateBookingStatus(
  pageId: string,
  status: BookingStatus
): Promise<void> {
  // Map our status to Pipeline Status values
  const pipelineStatus = status === "Geplant" ? "Erstgespräch"
    : status === "Abgeschlossen" ? "Erstgespräch"
    : status === "Abgesagt" ? "Erstgespräch"
    : "Erstgespräch";

  await notion.pages.update({
    page_id: pageId,
    properties: {
      "Pipeline Status": {
        status: {
          name: pipelineStatus,
        },
      },
    },
  });
}

export async function getBooking(pageId: string): Promise<any> {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
}

export async function getUpcomingBookings(): Promise<any[]> {
  const now = new Date().toISOString();

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "Pipeline Status",
      status: {
        equals: "Erstgespräch",
      },
    },
    sorts: [
      {
        property: "Verfügbarkeit",
        direction: "ascending",
      },
    ],
  });

  return response.results;
}

export async function getBookingsForReminder(
  hoursAhead: number
): Promise<any[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "Pipeline Status",
      status: {
        equals: "Erstgespräch",
      },
    },
  });

  return response.results;
}

// Upload CV to Notion using the File Upload API (2024+)
export async function uploadCvToNotion(
  pageId: string,
  file: File
): Promise<void> {
  const NOTION_API_KEY = process.env.NOTION_API_KEY!;
  const NOTION_VERSION = "2022-06-28";

  // Step 1: Create a file upload object with single_part mode
  const createResponse = await fetch("https://api.notion.com/v1/file_uploads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "single_part",
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    console.error("File upload create error:", error);
    throw new Error(`Failed to create file upload: ${error}`);
  }

  const fileUpload = await createResponse.json();
  console.log("📄 File upload created:", fileUpload.id);

  // Step 2: Send the file content using multipart/form-data
  const fileBuffer = await file.arrayBuffer();
  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer], { type: file.type }), file.name);

  const sendResponse = await fetch(
    `https://api.notion.com/v1/file_uploads/${fileUpload.id}/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": NOTION_VERSION,
      },
      body: formData,
    }
  );

  if (!sendResponse.ok) {
    const error = await sendResponse.text();
    console.error("File send error:", error);
    throw new Error(`Failed to send file: ${error}`);
  }

  const sendResult = await sendResponse.json();
  console.log("📄 File sent, status:", sendResult.status);

  // Step 3: Attach file to the page's CV property
  await notion.pages.update({
    page_id: pageId,
    properties: {
      CV: {
        files: [
          {
            name: file.name,
            type: "file_upload",
            file_upload: {
              id: fileUpload.id,
            },
          } as any,
        ],
      },
    },
  });

  console.log("📄 CV attached to Notion page");
}
