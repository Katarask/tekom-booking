// Booking Form Data
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  availableFrom: string;
  regions: string[];
  salary: string;
  employmentTypes: EmploymentType[];
  workTime: WorkTime;
  workLocation: WorkLocation;
  contractTypes: ContractType[];
  linkedIn?: string;
}

// Enums
export type EmploymentType = 
  | "Arbeitnehmerüberlassung" 
  | "Festanstellung" 
  | "Freelancing";

export type WorkTime = 
  | "Vollzeit" 
  | "Teilzeit" 
  | "Flexibel";

export type WorkLocation = 
  | "Hybrid" 
  | "Remote" 
  | "Vor Ort";

export type ContractType = 
  | "Unbefristet" 
  | "Befristet" 
  | "Projektarbeit";

export type BookingStatus = 
  | "Geplant" 
  | "Abgeschlossen" 
  | "Abgesagt" 
  | "No-Show";

// German Regions (Bundesländer)
export const GERMAN_REGIONS = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
  "Bundesweit",
] as const;

export type GermanRegion = typeof GERMAN_REGIONS[number];

// Calendar Types
export interface TimeSlot {
  date: string;
  times: string[];
}

export interface AvailableSlotsResponse {
  slots: TimeSlot[];
}

// Booking Types
export interface BookingRequest {
  date: string;
  time: string;
  duration: number;
  formData: BookingFormData;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  eventId: string;
  meetingLink: string;
  notionPageId: string;
}

// Notion Types
export interface NotionBooking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateTime: string;
  status: BookingStatus;
  position: string;
  availableFrom: string;
  regions: GermanRegion[];
  salary: string;
  employmentTypes: EmploymentType[];
  workTime: WorkTime;
  workLocation: WorkLocation;
  contractTypes: ContractType[];
  linkedIn?: string;
  outlookEventId: string;
}

// Email Types
export interface ConfirmationEmailData {
  to: string;
  name: string;
  date: string;
  time: string;
  meetingLink: string;
  bookingId: string;
}

export interface ReminderEmailData {
  to: string;
  name: string;
  date: string;
  time: string;
  meetingLink: string;
  hoursUntil: number;
}
