import { NextRequest, NextResponse } from "next/server";
import {
  getCalendarConfig,
  saveCalendarConfig,
  CalendarConfig,
} from "@/lib/calendar-config";

// Simple admin password check (in production, use proper auth)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "tekom2026";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const password = authHeader.replace("Bearer ", "");
  return password === ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = await getCalendarConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error getting calendar config:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Konfiguration" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config: CalendarConfig = await request.json();

    // Validate config
    if (config.startHour < 0 || config.startHour > 23) {
      return NextResponse.json(
        { error: "Ungültige Startzeit" },
        { status: 400 }
      );
    }
    if (config.endHour < 0 || config.endHour > 23) {
      return NextResponse.json(
        { error: "Ungültige Endzeit" },
        { status: 400 }
      );
    }
    if (config.startHour >= config.endHour) {
      return NextResponse.json(
        { error: "Startzeit muss vor Endzeit liegen" },
        { status: 400 }
      );
    }
    if (config.slotDuration < 15 || config.slotDuration > 120) {
      return NextResponse.json(
        { error: "Slot-Dauer muss zwischen 15 und 120 Minuten liegen" },
        { status: 400 }
      );
    }

    await saveCalendarConfig(config);

    return NextResponse.json({
      success: true,
      message: "Konfiguration gespeichert",
    });
  } catch (error) {
    console.error("Error saving calendar config:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Konfiguration" },
      { status: 500 }
    );
  }
}
