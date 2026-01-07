// Calendar configuration stored in Vercel KV (Redis)
import { kv } from "@vercel/kv";

export interface CalendarConfig {
  // Working hours
  startHour: number; // e.g., 9 for 09:00
  endHour: number; // e.g., 17 for 17:00

  // Slot duration in minutes
  slotDuration: number; // e.g., 30

  // Buffer between slots in minutes
  bufferMinutes: number; // e.g., 0 or 15

  // Working days (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  workingDays: number[]; // e.g., [1, 2, 3, 4, 5] for Mon-Fri

  // Breaks (e.g., lunch break)
  breaks: {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  }[];

  // Blocked dates (holidays, vacation) - legacy single dates
  blockedDates: string[]; // e.g., ["2026-01-01", "2026-12-25"]

  // Blocked periods (date ranges with optional labels)
  blockedPeriods?: {
    startDate: string; // e.g., "2026-01-01"
    endDate: string;   // e.g., "2026-01-15"
    label?: string;    // e.g., "Urlaub", "Feiertage"
  }[];

  // How many days in advance can people book
  advanceBookingDays: number; // e.g., 30

  // Minimum hours before a slot can be booked
  minimumNoticeHours: number; // e.g., 24
}

const CONFIG_KEY = "calendar-config";

const DEFAULT_CONFIG: CalendarConfig = {
  startHour: 9,
  endHour: 17,
  slotDuration: 30,
  bufferMinutes: 0,
  workingDays: [1, 2, 3, 4, 5], // Monday to Friday
  breaks: [
    {
      startHour: 12,
      startMinute: 0,
      endHour: 13,
      endMinute: 0,
    },
  ],
  blockedDates: [],
  blockedPeriods: [],
  advanceBookingDays: 30,
  minimumNoticeHours: 24,
};

export async function getCalendarConfig(): Promise<CalendarConfig> {
  try {
    // Check if KV is available (has environment variables)
    if (!process.env.KV_REST_API_URL) {
      console.log("KV not configured, using default config");
      return DEFAULT_CONFIG;
    }

    const config = await kv.get<CalendarConfig>(CONFIG_KEY);
    if (config) {
      return { ...DEFAULT_CONFIG, ...config };
    }
  } catch (error) {
    console.error("Error reading calendar config from KV:", error);
  }
  return DEFAULT_CONFIG;
}

export async function saveCalendarConfig(config: CalendarConfig): Promise<void> {
  try {
    if (!process.env.KV_REST_API_URL) {
      throw new Error("KV not configured");
    }
    await kv.set(CONFIG_KEY, config);
  } catch (error) {
    console.error("Error saving calendar config to KV:", error);
    throw error;
  }
}

// Generate time slots based on config
export function generateConfiguredTimeSlots(config: CalendarConfig): string[] {
  const slots: string[] = [];
  let currentMinutes = config.startHour * 60;
  const endMinutes = config.endHour * 60;

  while (currentMinutes + config.slotDuration <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    // Check if this slot falls within a break
    const isInBreak = config.breaks.some((breakPeriod) => {
      const breakStart = breakPeriod.startHour * 60 + breakPeriod.startMinute;
      const breakEnd = breakPeriod.endHour * 60 + breakPeriod.endMinute;
      const slotEnd = currentMinutes + config.slotDuration;
      return currentMinutes < breakEnd && slotEnd > breakStart;
    });

    if (!isInBreak) {
      slots.push(timeString);
    }

    currentMinutes += config.slotDuration + config.bufferMinutes;
  }

  return slots;
}

// Check if a date is a working day
export function isWorkingDay(date: Date, config: CalendarConfig): boolean {
  const dayOfWeek = date.getDay();
  return config.workingDays.includes(dayOfWeek);
}

// Check if a date is blocked (single dates or within periods)
export function isBlockedDate(dateString: string, config: CalendarConfig): boolean {
  // Check legacy single dates
  if (config.blockedDates.includes(dateString)) {
    return true;
  }

  // Check blocked periods (date ranges)
  if (config.blockedPeriods && config.blockedPeriods.length > 0) {
    const checkDate = new Date(dateString);
    for (const period of config.blockedPeriods) {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      if (checkDate >= startDate && checkDate <= endDate) {
        return true;
      }
    }
  }

  return false;
}

// Check if a slot meets minimum notice requirement (Berlin timezone)
export function meetsMinimumNotice(
  date: string,
  time: string,
  config: CalendarConfig
): boolean {
  // Parse the slot time as Berlin time
  const slotDateTime = new Date(`${date}T${time}:00`);

  // Get current time in Berlin
  const berlinNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" }));

  // Add minimum notice hours
  const minimumTime = new Date(berlinNow.getTime() + config.minimumNoticeHours * 60 * 60 * 1000);

  return slotDateTime >= minimumTime;
}

// Rate limiting helper
const RATE_LIMIT_PREFIX = "rate-limit:";
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds
const MAX_BOOKINGS_PER_HOUR = 5; // Max 5 bookings per IP per hour

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    if (!process.env.KV_REST_API_URL) {
      // No rate limiting without KV
      return { allowed: true, remaining: MAX_BOOKINGS_PER_HOUR };
    }

    const key = `${RATE_LIMIT_PREFIX}${ip}`;
    const current = await kv.get<number>(key) || 0;

    if (current >= MAX_BOOKINGS_PER_HOUR) {
      return { allowed: false, remaining: 0 };
    }

    // Increment counter with TTL
    await kv.set(key, current + 1, { ex: RATE_LIMIT_WINDOW });

    return { allowed: true, remaining: MAX_BOOKINGS_PER_HOUR - current - 1 };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    // Allow on error to not block legitimate users
    return { allowed: true, remaining: MAX_BOOKINGS_PER_HOUR };
  }
}
