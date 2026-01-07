import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE, d. MMMM yyyy", { locale: de });
}

export function formatTime(time: string): string {
  return `${time} Uhr`;
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} um ${formatTime(time)}`;
}

export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 17,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  
  return slots;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`;
}

export function createISODateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}
