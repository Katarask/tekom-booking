"use client";

import { useState, useEffect } from "react";

interface CalendarConfig {
  startHour: number;
  endHour: number;
  slotDuration: number;
  bufferMinutes: number;
  workingDays: number[];
  breaks: {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  }[];
  blockedDates: string[];
  advanceBookingDays: number;
  minimumNoticeHours: number;
}

const WEEKDAYS = [
  { value: 1, label: "Mo" },
  { value: 2, label: "Di" },
  { value: 3, label: "Mi" },
  { value: 4, label: "Do" },
  { value: 5, label: "Fr" },
  { value: 6, label: "Sa" },
  { value: 0, label: "So" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [config, setConfig] = useState<CalendarConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [newBlockedDate, setNewBlockedDate] = useState("");

  // Load config after authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadConfig();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/admin/calendar-config", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("adminPassword", password);
      } else {
        setAuthError("Falsches Passwort");
      }
    } catch {
      setAuthError("Verbindungsfehler");
    } finally {
      setIsLoading(false);
    }
  };

  // Check for stored password on mount
  useEffect(() => {
    const stored = localStorage.getItem("adminPassword");
    if (stored) {
      setPassword(stored);
      // Auto-login with stored password
      fetch("/api/admin/calendar-config", {
        headers: { Authorization: `Bearer ${stored}` },
      }).then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("adminPassword");
        }
      });
    }
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/calendar-config", {
        headers: {
          Authorization: `Bearer ${password || localStorage.getItem("adminPassword")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Error loading config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/admin/calendar-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password || localStorage.getItem("adminPassword")}`,
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaveMessage({ type: "success", text: "Einstellungen gespeichert!" });
      } else {
        const error = await response.json();
        setSaveMessage({
          type: "error",
          text: error.error || "Fehler beim Speichern",
        });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Verbindungsfehler" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const toggleWorkingDay = (day: number) => {
    if (!config) return;
    const newDays = config.workingDays.includes(day)
      ? config.workingDays.filter((d) => d !== day)
      : [...config.workingDays, day];
    setConfig({ ...config, workingDays: newDays });
  };

  const addBlockedDate = () => {
    if (!config || !newBlockedDate) return;
    if (!config.blockedDates.includes(newBlockedDate)) {
      setConfig({
        ...config,
        blockedDates: [...config.blockedDates, newBlockedDate].sort(),
      });
    }
    setNewBlockedDate("");
  };

  const removeBlockedDate = (date: string) => {
    if (!config) return;
    setConfig({
      ...config,
      blockedDates: config.blockedDates.filter((d) => d !== date),
    });
  };

  const updateBreak = (
    index: number,
    field: "startHour" | "startMinute" | "endHour" | "endMinute",
    value: number
  ) => {
    if (!config) return;
    const newBreaks = [...config.breaks];
    newBreaks[index] = { ...newBreaks[index], [field]: value };
    setConfig({ ...config, breaks: newBreaks });
  };

  const addBreak = () => {
    if (!config) return;
    setConfig({
      ...config,
      breaks: [
        ...config.breaks,
        { startHour: 12, startMinute: 0, endHour: 13, endMinute: 0 },
      ],
    });
  };

  const removeBreak = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      breaks: config.breaks.filter((_, i) => i !== index),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminPassword");
    setIsAuthenticated(false);
    setPassword("");
    setConfig(null);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="bg-dark-alt border border-cream/10 rounded p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-burgundy text-lg">●</span>
              <span className="text-cream font-mono text-sm tracking-wider uppercase">
                ~admin
              </span>
            </div>
            <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-light text-cream font-mono">
              Admin-Bereich
            </h1>
            <p className="text-cream/50 font-mono text-sm mt-2">
              Kalender-Einstellungen verwalten
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {authError && (
              <div className="bg-burgundy/20 border border-burgundy/50 rounded p-3 mb-4">
                <p className="text-burgundy font-mono text-sm">{authError}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-cream/60 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark border border-cream/20 rounded font-mono text-sm text-cream focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/20 transition-all"
                placeholder="Admin-Passwort eingeben"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-burgundy text-cream rounded font-mono text-sm tracking-wider hover:bg-burgundy/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Wird geladen..." : "Anmelden"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy" />
      </div>
    );
  }

  // Admin panel
  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="bg-dark-alt border-b border-cream/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-burgundy text-lg">●</span>
            <span className="text-cream font-mono text-sm tracking-wider uppercase">
              ~admin
            </span>
            <span className="text-cream/40 font-mono text-sm">/</span>
            <span className="text-cream/70 font-mono text-sm tracking-wider">
              kalender
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-cream/50 hover:text-cream font-mono text-sm tracking-wider transition-colors"
          >
            Abmelden
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Save message */}
        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded font-mono text-sm ${
              saveMessage.type === "success"
                ? "bg-burgundy/20 border border-burgundy/50 text-cream"
                : "bg-burgundy/20 border border-burgundy/50 text-burgundy"
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Working Hours */}
          <div className="bg-dark-alt border border-cream/10 rounded p-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-cream/40 mb-4">
              Arbeitszeiten
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-cream/60 mb-2">
                  Start
                </label>
                <select
                  value={config.startHour}
                  onChange={(e) =>
                    setConfig({ ...config, startHour: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-dark border border-cream/20 rounded font-mono text-sm text-cream focus:outline-none focus:border-burgundy/50"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-cream/60 mb-2">
                  Ende
                </label>
                <select
                  value={config.endHour}
                  onChange={(e) =>
                    setConfig({ ...config, endHour: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 bg-dark border border-cream/20 rounded font-mono text-sm text-cream focus:outline-none focus:border-burgundy/50"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Slot Duration */}
          <div className="bg-dark-alt border border-cream/10 rounded p-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-cream/40 mb-4">
              Termin-Einstellungen
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-cream/60 mb-2">
                  Termindauer
                </label>
                <select
                  value={config.slotDuration}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      slotDuration: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-dark border border-cream/20 rounded font-mono text-sm text-cream focus:outline-none focus:border-burgundy/50"
                >
                  <option value={15}>15 Minuten</option>
                  <option value={30}>30 Minuten</option>
                  <option value={45}>45 Minuten</option>
                  <option value={60}>60 Minuten</option>
                  <option value={90}>90 Minuten</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-cream/60 mb-2">
                  Puffer
                </label>
                <select
                  value={config.bufferMinutes}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bufferMinutes: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-dark border border-cream/20 rounded font-mono text-sm text-cream focus:outline-none focus:border-burgundy/50"
                >
                  <option value={0}>Kein Puffer</option>
                  <option value={5}>5 Minuten</option>
                  <option value={10}>10 Minuten</option>
                  <option value={15}>15 Minuten</option>
                  <option value={30}>30 Minuten</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-cream/60 mb-2">
                  Buchbar bis (Tage)
                </label>
                <input
                  type="number"
                  value={config.advanceBookingDays}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      advanceBookingDays: parseInt(e.target.value) || 30,
                    })
                  }
                  min={1}
                  max={365}
                  className="w-full px-4 py-2 bg-dark border border-cream/20 rounded font-mono text-sm text-cream focus:outline-none focus:border-burgundy/50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-[0.15em] text-cream/60 mb-2">
                  Vorlaufzeit (Std)
                </label>
                <input
                  type="number"
                  value={config.minimumNoticeHours}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      minimumNoticeHours: parseInt(e.target.value) || 24,
                    })
                  }
                  min={0}
                  max={168}
                  className="w-full px-4 py-2 bg-dark border border-cream/20 rounded font-mono text-sm text-cream focus:outline-none focus:border-burgundy/50"
                />
              </div>
            </div>
          </div>

          {/* Working Days */}
          <div className="bg-dark-alt border border-cream/10 rounded p-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-cream/40 mb-4">
              Arbeitstage
            </p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.value}
                  onClick={() => toggleWorkingDay(day.value)}
                  className={`px-4 py-2 rounded font-mono text-sm transition-all ${
                    config.workingDays.includes(day.value)
                      ? "bg-burgundy text-cream"
                      : "bg-dark border border-cream/20 text-cream/60 hover:border-burgundy/50"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Breaks */}
          <div className="bg-dark-alt border border-cream/10 rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-cream/40">
                Pausen
              </p>
              <button
                onClick={addBreak}
                className="text-burgundy hover:text-burgundy/80 font-mono text-sm tracking-wider transition-colors"
              >
                + Hinzufuegen
              </button>
            </div>

            {config.breaks.length === 0 ? (
              <p className="text-cream/40 font-mono text-sm">Keine Pausen konfiguriert</p>
            ) : (
              <div className="space-y-3">
                {config.breaks.map((breakPeriod, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-dark rounded border border-cream/10"
                  >
                    <div className="flex items-center gap-2">
                      <select
                        value={breakPeriod.startHour}
                        onChange={(e) =>
                          updateBreak(index, "startHour", parseInt(e.target.value))
                        }
                        className="px-2 py-1 bg-dark-alt border border-cream/20 rounded font-mono text-sm text-cream"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>
                            {i.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      <span className="text-cream/40">:</span>
                      <select
                        value={breakPeriod.startMinute}
                        onChange={(e) =>
                          updateBreak(index, "startMinute", parseInt(e.target.value))
                        }
                        className="px-2 py-1 bg-dark-alt border border-cream/20 rounded font-mono text-sm text-cream"
                      >
                        {[0, 15, 30, 45].map((m) => (
                          <option key={m} value={m}>
                            {m.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-cream/40 font-mono text-sm">bis</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={breakPeriod.endHour}
                        onChange={(e) =>
                          updateBreak(index, "endHour", parseInt(e.target.value))
                        }
                        className="px-2 py-1 bg-dark-alt border border-cream/20 rounded font-mono text-sm text-cream"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>
                            {i.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      <span className="text-cream/40">:</span>
                      <select
                        value={breakPeriod.endMinute}
                        onChange={(e) =>
                          updateBreak(index, "endMinute", parseInt(e.target.value))
                        }
                        className="px-2 py-1 bg-dark-alt border border-cream/20 rounded font-mono text-sm text-cream"
                      >
                        {[0, 15, 30, 45].map((m) => (
                          <option key={m} value={m}>
                            {m.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeBreak(index)}
                      className="ml-auto text-burgundy hover:text-burgundy/80 font-mono text-sm transition-colors"
                    >
                      Entfernen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blocked Dates */}
          <div className="bg-dark-alt border border-cream/10 rounded p-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-cream/40 mb-4">
              Geblockte Tage
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="flex-1 px-4 py-2 bg-dark border border-cream/20 rounded font-mono text-sm text-cream focus:outline-none focus:border-burgundy/50"
              />
              <button
                onClick={addBlockedDate}
                disabled={!newBlockedDate}
                className="px-4 py-2 bg-burgundy text-cream rounded font-mono text-sm tracking-wider hover:bg-burgundy/90 transition-colors disabled:opacity-50"
              >
                Hinzufuegen
              </button>
            </div>

            {config.blockedDates.length === 0 ? (
              <p className="text-cream/40 font-mono text-sm">
                Keine geblockten Tage konfiguriert
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {config.blockedDates.map((date) => (
                  <div
                    key={date}
                    className="flex items-center gap-2 px-3 py-1 bg-burgundy/20 border border-burgundy/50 rounded"
                  >
                    <span className="text-sm font-mono text-cream">
                      {new Date(date).toLocaleDateString("de-DE", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => removeBlockedDate(date)}
                      className="text-burgundy hover:text-burgundy/80"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveConfig}
              disabled={isSaving}
              className="px-8 py-3 bg-burgundy text-cream rounded font-mono text-sm tracking-wider hover:bg-burgundy/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Wird gespeichert..." : "Einstellungen speichern"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
