import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/microsoft-graph";
import { TimeSlot } from "@/types";
import {
  getCalendarConfig,
  generateConfiguredTimeSlots,
  isWorkingDay,
  isBlockedDate,
  meetsMinimumNotice,
} from "@/lib/calendar-config";

// Check if Azure credentials are configured
const isAzureConfigured = () => {
  return !!(
    process.env.MICROSOFT_CLIENT_ID &&
    process.env.MICROSOFT_CLIENT_SECRET &&
    process.env.MICROSOFT_TENANT_ID &&
    process.env.MICROSOFT_USER_ID
  );
};

// Generate slots based on calendar config (now async)
async function generateConfiguredSlots(startDate: Date, endDate: Date): Promise<TimeSlot[]> {
  const config = await getCalendarConfig();
  const slots: TimeSlot[] = [];
  const currentDate = new Date(startDate);
  const allTimes = generateConfiguredTimeSlots(config);

  // Limit end date to advanceBookingDays
  const maxEndDate = new Date();
  maxEndDate.setDate(maxEndDate.getDate() + config.advanceBookingDays);
  const effectiveEndDate = endDate < maxEndDate ? endDate : maxEndDate;

  while (currentDate <= effectiveEndDate) {
    const dateString = currentDate.toISOString().split("T")[0];

    // Check if it's a working day and not blocked
    if (isWorkingDay(currentDate, config) && !isBlockedDate(dateString, config)) {
      // Filter times that meet minimum notice requirement
      const availableTimes = allTimes.filter((time) =>
        meetsMinimumNotice(dateString, time, config)
      );

      if (availableTimes.length > 0) {
        slots.push({
          date: dateString,
          times: availableTimes,
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const duration = parseInt(searchParams.get("duration") || "30");

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { error: "startDate und endDate sind erforderlich" },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Ungültiges Datumsformat" },
        { status: 400 }
      );
    }

    let slots: TimeSlot[];

    if (isAzureConfigured()) {
      // Use real Microsoft Graph API
      slots = await getAvailableSlots(startDate, endDate, duration);
    } else {
      // Use configured slots (from admin panel)
      console.log("⚠️ Azure not configured - using configured slots");
      slots = await generateConfiguredSlots(startDate, endDate);
    }

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der verfügbaren Termine" },
      { status: 500 }
    );
  }
}
