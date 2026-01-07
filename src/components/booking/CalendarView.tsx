"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types";

interface CalendarViewProps {
  availableSlots: TimeSlot[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export function CalendarView({
  availableSlots,
  selectedDate,
  onDateSelect,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get available dates as Set for quick lookup
  const availableDates = new Set(availableSlots.map((slot) => slot.date));

  // Check if a date has available slots
  const hasAvailableSlots = (date: Date): boolean => {
    const dateString = format(date, "yyyy-MM-dd");
    return availableDates.has(dateString);
  };

  // Check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    return isBefore(startOfDay(date), startOfDay(new Date()));
  };

  // Navigate months
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const startDay = monthStart.getDay();
  // Adjust for Monday start (German calendar)
  const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-dark/5 rounded transition-colors text-dark/60 hover:text-dark"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-base font-light text-dark tracking-wide">
          {format(currentMonth, "MMMM yyyy", { locale: de })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-dark/5 rounded transition-colors text-dark/60 hover:text-dark"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-mono uppercase tracking-wider text-dark/40 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month start */}
        {Array.from({ length: adjustedStartDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-10" />
        ))}

        {/* Days of month */}
        {days.map((day) => {
          const dateString = format(day, "yyyy-MM-dd");
          const isSelected = selectedDate === dateString;
          const isAvailable = hasAvailableSlots(day);
          const isPast = isPastDate(day);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={dateString}
              onClick={() => isAvailable && !isPast && onDateSelect(dateString)}
              disabled={!isAvailable || isPast}
              className={cn(
                "h-10 rounded text-sm font-mono transition-all duration-200",
                // Base styles
                "flex items-center justify-center",
                // Available and selectable
                isAvailable &&
                  !isPast &&
                  !isSelected &&
                  "bg-burgundy/10 text-burgundy hover:bg-burgundy/20",
                // Selected
                isSelected && "bg-burgundy text-cream",
                // Unavailable or past
                (!isAvailable || isPast) &&
                  "text-dark/20 cursor-not-allowed",
                // Today indicator
                isCurrentDay && !isSelected && "ring-1 ring-burgundy/30"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-[11px] font-mono text-dark/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-burgundy/10" />
          <span>Verfuegbar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-burgundy" />
          <span>Ausgewaehlt</span>
        </div>
      </div>
    </div>
  );
}
