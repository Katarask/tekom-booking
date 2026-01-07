"use client";

import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  times: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function TimeSlotPicker({
  times,
  selectedTime,
  onTimeSelect,
}: TimeSlotPickerProps) {
  if (times.length === 0) {
    return (
      <div className="text-center py-8 text-dark/40 font-mono text-sm">
        Keine verfuegbaren Zeiten fuer dieses Datum
      </div>
    );
  }

  // Group times by morning/afternoon
  const morningTimes = times.filter((time) => {
    const hour = parseInt(time.split(":")[0]);
    return hour < 12;
  });

  const afternoonTimes = times.filter((time) => {
    const hour = parseInt(time.split(":")[0]);
    return hour >= 12;
  });

  return (
    <div className="space-y-6">
      {/* Morning */}
      {morningTimes.length > 0 && (
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-dark/40 mb-3">
            Vormittag
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {morningTimes.map((time) => (
              <TimeButton
                key={time}
                time={time}
                isSelected={selectedTime === time}
                onClick={() => onTimeSelect(time)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Afternoon */}
      {afternoonTimes.length > 0 && (
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-dark/40 mb-3">
            Nachmittag
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {afternoonTimes.map((time) => (
              <TimeButton
                key={time}
                time={time}
                isSelected={selectedTime === time}
                onClick={() => onTimeSelect(time)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TimeButtonProps {
  time: string;
  isSelected: boolean;
  onClick: () => void;
}

function TimeButton({ time, isSelected, onClick }: TimeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-3 px-4 rounded font-mono text-sm transition-all duration-200",
        isSelected
          ? "bg-burgundy text-cream"
          : "bg-sand/50 text-dark hover:bg-burgundy/10 hover:text-burgundy"
      )}
    >
      {time}
    </button>
  );
}
