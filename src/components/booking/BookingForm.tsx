"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  BookingFormData,
  GERMAN_REGIONS,
  EmploymentType,
  WorkTime,
  WorkLocation,
  ContractType,
} from "@/types";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface BookingFormProps {
  onSubmit: (data: BookingFormData, cvFile?: File) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Arbeitnehmerüberlassung",
  "Festanstellung",
  "Freelancing",
];

const WORK_TIMES: WorkTime[] = ["Vollzeit", "Teilzeit", "Flexibel"];

const WORK_LOCATIONS: WorkLocation[] = ["Hybrid", "Remote", "Vor Ort"];

const CONTRACT_TYPES: ContractType[] = [
  "Unbefristet",
  "Befristet",
  "Projektarbeit",
];

export function BookingForm({
  onSubmit,
  onBack,
  isSubmitting,
}: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookingFormData>({
    defaultValues: {
      employmentTypes: [],
      regions: [],
      contractTypes: [],
    },
  });

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<EmploymentType[]>([]);
  const [selectedContractTypes, setSelectedContractTypes] = useState<ContractType[]>([]);
  const [selectedWorkTime, setSelectedWorkTime] = useState<WorkTime | null>(null);
  const [selectedWorkLocation, setSelectedWorkLocation] = useState<WorkLocation | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleRegion = (region: string) => {
    const newRegions = selectedRegions.includes(region)
      ? selectedRegions.filter((r) => r !== region)
      : [...selectedRegions, region];
    setSelectedRegions(newRegions);
    setValue("regions", newRegions);
  };

  const toggleEmploymentType = (type: EmploymentType) => {
    const newTypes = selectedEmploymentTypes.includes(type)
      ? selectedEmploymentTypes.filter((t) => t !== type)
      : [...selectedEmploymentTypes, type];
    setSelectedEmploymentTypes(newTypes);
    setValue("employmentTypes", newTypes);
  };

  const toggleContractType = (type: ContractType) => {
    const newTypes = selectedContractTypes.includes(type)
      ? selectedContractTypes.filter((t) => t !== type)
      : [...selectedContractTypes, type];
    setSelectedContractTypes(newTypes);
    setValue("contractTypes", newTypes);
  };

  const selectWorkTime = (time: WorkTime) => {
    setSelectedWorkTime(time);
    setValue("workTime", time);
  };

  const selectWorkLocation = (location: WorkLocation) => {
    setSelectedWorkLocation(location);
    setValue("workLocation", location);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCvError(null);

    if (!file) {
      setCvFile(null);
      return;
    }

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setCvError("Bitte laden Sie eine PDF- oder Word-Datei hoch.");
      setCvFile(null);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setCvError("Die Datei ist zu gross. Maximale Groesse: 10 MB.");
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    setCvError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(
      {
        ...data,
        regions: selectedRegions,
        employmentTypes: selectedEmploymentTypes,
        contractTypes: selectedContractTypes,
        workTime: selectedWorkTime!,
        workLocation: selectedWorkLocation!,
      },
      cvFile || undefined
    );
  });

  // Styled input class
  const inputClass = "w-full px-4 py-3 bg-cream border border-dark/10 rounded font-mono text-sm text-dark placeholder:text-dark/30 focus:ring-1 focus:ring-burgundy focus:border-burgundy transition-all duration-200";
  const labelClass = "block text-[11px] font-mono uppercase tracking-[0.15em] text-dark/50 mb-2";
  const errorClass = "mt-1 text-[11px] font-mono text-burgundy";

  return (
    <form onSubmit={onFormSubmit} className="space-y-8">
      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Vorname <span className="text-burgundy">*</span>
          </label>
          <input
            type="text"
            {...register("firstName", { required: "Vorname ist erforderlich" })}
            className={cn(inputClass, errors.firstName && "border-burgundy")}
            placeholder="Max"
          />
          {errors.firstName && (
            <p className={errorClass}>{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Nachname <span className="text-burgundy">*</span>
          </label>
          <input
            type="text"
            {...register("lastName", { required: "Nachname ist erforderlich" })}
            className={cn(inputClass, errors.lastName && "border-burgundy")}
            placeholder="Mustermann"
          />
          {errors.lastName && (
            <p className={errorClass}>{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>
          E-Mail <span className="text-burgundy">*</span>
        </label>
        <input
          type="email"
          {...register("email", {
            required: "E-Mail ist erforderlich",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Ungueltige E-Mail-Adresse",
            },
          })}
          className={cn(inputClass, errors.email && "border-burgundy")}
          placeholder="max.mustermann@email.de"
        />
        {errors.email && (
          <p className={errorClass}>{errors.email.message}</p>
        )}
      </div>

      {/* Position */}
      <div>
        <label className={labelClass}>
          Welcher Beruf/Position interessiert Sie? <span className="text-burgundy">*</span>
        </label>
        <input
          type="text"
          {...register("position", { required: "Position ist erforderlich" })}
          className={cn(inputClass, errors.position && "border-burgundy")}
          placeholder="z.B. Software Engineer, Projektmanager"
        />
        {errors.position && (
          <p className={errorClass}>{errors.position.message}</p>
        )}
      </div>

      {/* Available From */}
      <div>
        <label className={labelClass}>
          Ab wann stehen Sie fÃ¼r eine neue Position zur Verfuegung? <span className="text-burgundy">*</span>
        </label>
        <input
          type="text"
          {...register("availableFrom", { required: "VerfÃ¼gbarkeit ist erforderlich" })}
          className={cn(inputClass, errors.availableFrom && "border-burgundy")}
          placeholder="z.B. Sofort, Ab 01.03.2025, 3 Monate KÃ¼ndigungsfrist"
        />
        {errors.availableFrom && (
          <p className={errorClass}>{errors.availableFrom.message}</p>
        )}
      </div>

      {/* Regions */}
      <div>
        <label className={labelClass}>
          In welchen Regionen Deutschlands suchen Sie? <span className="text-burgundy">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GERMAN_REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => toggleRegion(region)}
              className={cn(
                "px-3 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all duration-200",
                selectedRegions.includes(region)
                  ? "bg-burgundy text-cream"
                  : "bg-sand/50 text-dark hover:bg-burgundy/10 hover:text-burgundy border border-dark/10"
              )}
            >
              {region}
            </button>
          ))}
        </div>
        {selectedRegions.length === 0 && (
          <p className="mt-2 text-[11px] font-mono text-dark/40">Mindestens eine Region auswÃ¤hlen</p>
        )}
      </div>

      {/* Salary */}
      <div>
        <label className={labelClass}>
          Welche Gehaltsvorstellungen haben Sie? <span className="text-burgundy">*</span>
        </label>
        <input
          type="text"
          {...register("salary", { required: "Gehaltsvorstellung ist erforderlich" })}
          className={cn(inputClass, errors.salary && "border-burgundy")}
          placeholder="z.B. 60.000 - 70.000 EUR brutto/Jahr"
        />
        {errors.salary && (
          <p className={errorClass}>{errors.salary.message}</p>
        )}
      </div>

      {/* Employment Types */}
      <div>
        <label className={labelClass}>
          Welche Arbeitsverhaeltnisse kaemen fÃ¼r Sie in Frage? <span className="text-burgundy">*</span>
        </label>
        <div className="space-y-3">
          {EMPLOYMENT_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                  selectedEmploymentTypes.includes(type)
                    ? "bg-burgundy border-burgundy"
                    : "border-dark/20 group-hover:border-burgundy/50"
                )}
              >
                {selectedEmploymentTypes.includes(type) && (
                  <svg className="w-3 h-3 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={selectedEmploymentTypes.includes(type)}
                onChange={() => toggleEmploymentType(type)}
                className="hidden"
              />
              <span className="text-sm font-mono text-dark">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Time */}
      <div>
        <label className={labelClass}>
          Suchen Sie eine Stelle in Vollzeit oder Teilzeit? <span className="text-burgundy">*</span>
        </label>
        <div className="space-y-3">
          {WORK_TIMES.map((time) => (
            <label
              key={time}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  selectedWorkTime === time
                    ? "border-burgundy"
                    : "border-dark/20 group-hover:border-burgundy/50"
                )}
              >
                {selectedWorkTime === time && (
                  <div className="w-2.5 h-2.5 rounded-full bg-burgundy" />
                )}
              </div>
              <input
                type="radio"
                name="workTime"
                checked={selectedWorkTime === time}
                onChange={() => selectWorkTime(time)}
                className="hidden"
              />
              <span className="text-sm font-mono text-dark">{time}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Location */}
      <div>
        <label className={labelClass}>
          Arbeitsort <span className="text-burgundy">*</span>
        </label>
        <div className="space-y-3">
          {WORK_LOCATIONS.map((location) => (
            <label
              key={location}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  selectedWorkLocation === location
                    ? "border-burgundy"
                    : "border-dark/20 group-hover:border-burgundy/50"
                )}
              >
                {selectedWorkLocation === location && (
                  <div className="w-2.5 h-2.5 rounded-full bg-burgundy" />
                )}
              </div>
              <input
                type="radio"
                name="workLocation"
                checked={selectedWorkLocation === location}
                onChange={() => selectWorkLocation(location)}
                className="hidden"
              />
              <span className="text-sm font-mono text-dark">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contract Types */}
      <div>
        <label className={labelClass}>
          Vertragsform <span className="text-burgundy">*</span>
        </label>
        <div className="space-y-3">
          {CONTRACT_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                  selectedContractTypes.includes(type)
                    ? "bg-burgundy border-burgundy"
                    : "border-dark/20 group-hover:border-burgundy/50"
                )}
              >
                {selectedContractTypes.includes(type) && (
                  <svg className="w-3 h-3 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={selectedContractTypes.includes(type)}
                onChange={() => toggleContractType(type)}
                className="hidden"
              />
              <span className="text-sm font-mono text-dark">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* LinkedIn */}
      <div>
        <label className={labelClass}>
          LinkedIn URL <span className="text-dark/30">(optional)</span>
        </label>
        <input
          type="url"
          {...register("linkedIn")}
          className={inputClass}
          placeholder="https://linkedin.com/in/ihr-profil"
        />
      </div>

      {/* CV Upload */}
      <div>
        <label className={labelClass}>
          Lebenslauf hochladen <span className="text-dark/30">(empfohlen)</span>
        </label>
        <p className="text-[11px] font-mono text-dark/40 mb-3">
          PDF oder Word-Dokument, max. 10 MB
        </p>

        {!cvFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded p-8 text-center cursor-pointer transition-all duration-200",
              cvError
                ? "border-burgundy/30 bg-burgundy/5"
                : "border-dark/10 hover:border-burgundy/30 hover:bg-burgundy/5"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-3xl mb-3 opacity-50">+</div>
            <p className="text-xs font-mono text-dark/60">
              Klicken zum Hochladen
            </p>
          </div>
        ) : (
          <div className="border border-success/30 rounded p-4 bg-success/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-success/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-dark truncate">
                  {cvFile.name}
                </p>
                <p className="text-[10px] font-mono text-dark/40">
                  {formatFileSize(cvFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-dark/40 hover:text-burgundy transition-colors"
                title="Datei entfernen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {cvError && (
          <p className="mt-2 text-[11px] font-mono text-burgundy">{cvError}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>
          Telefon fÃ¼r SMS-Erinnerung <span className="text-dark/30">(optional)</span>
        </label>
        <input
          type="tel"
          {...register("phone")}
          className={inputClass}
          placeholder="+49 170 1234567"
        />
      </div>

      {/* Privacy Notice */}
      <div className="bg-sand/30 rounded p-4">
        <p className="text-[11px] font-mono text-dark/60 leading-relaxed">
          Mit dem Absenden dieses Formulars stimmen Sie unserer{" "}
          <a href="/datenschutz" className="text-burgundy hover:underline">
            Datenschutzerklaerung
          </a>{" "}
          zu. Ihre Daten werden ausschliesslich fÃ¼r den Recruiting-Prozess verwendet.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-4 border border-dark/10 text-dark font-mono text-[11px] uppercase tracking-[0.1em] hover:bg-dark/5 transition-all duration-200"
        >
          ZurÃ¼ck
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "flex-1 px-6 py-4 bg-burgundy text-cream font-mono text-[11px] uppercase tracking-[0.1em] transition-all duration-200",
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-burgundy/90"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Wird gebucht...
            </span>
          ) : (
            "Termin buchen"
          )}
        </button>
      </div>
    </form>
  );
}
