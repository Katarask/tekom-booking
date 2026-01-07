// Calendar configuration stored in a JSON file
import fs from "fs";
import path from "path";

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

  // Blocked dates (holidays, vacation)
  blockedDates: string[]; // e.g., ["2026-01-01", "2026-12-25"]

  // How many days in advance can people book
  advanceBookingDays: number; // e.g., 30

  // Minimum hours before a slot can be booked
  minimumNoticeHours: number; // e.g., 24
}

const CONFIG_FILE_PATH = path.join(process.cwd(), "calendar-config.json");

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
  advanceBookingDays: 30,
  minimumNoticeHours: 24,
};

export function getCalendarConfig(): CalendarConfig {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const configData = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
      return { ...DEFAULT_CONFIG, ...JSON.parse(configData) };
    }
  } catch (error) {
    console.error("Error reading calendar config:", error);
  }
  return DEFAULT_CONFIG;
}

export function saveCalendarConfig(config: CalendarConfig): void {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error saving calendar config:", error);
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

// Check if a date is blocked
export function isBlockedDate(dateString: string, config: CalendarConfig): boolean {
  return config.blockedDates.includes(dateString);
}

// Check if a slot meets minimum notice requirement
export function meetsMinimumNotice(
  date: string,
  time: string,
  config: CalendarConfig
): boolean {
  const slotDateTime = new Date(`${date}T${time}:00`);
  const now = new Date();
  const minimumTime = new Date(now.getTime() + config.minimumNoticeHours * 60 * 60 * 1000);
  return slotDateTime >= minimumTime;
}
