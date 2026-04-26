// ──────────────────────────────────────────────
// Business Identity
// ──────────────────────────────────────────────
export const FIRM_NAME = "Siddhivinayak Kitchen Trolley System";
export const FIRM_SHORT = "Siddhivinayak";
export const OWNER_NAME = "Sachin Kuwar";
export const OWNER_TITLE = "Owner & Chief Designer";
export const FOUNDED_YEAR = 2012;

// ──────────────────────────────────────────────
// Contact
// ──────────────────────────────────────────────
export const PHONE_NUMBER = "+919657472241";
export const PHONE_DISPLAY = "+91 96574 72241";
export const LOCATION_DISPLAY = "Nashik, Maharashtra";
export const WHATSAPP_URL = "https://wa.me/919657472241";
export const WHATSAPP_COLOR = "#25D366";

// ──────────────────────────────────────────────
// Working Hours
// ──────────────────────────────────────────────
export const WORKING_HOURS = {
  weekday: { days: "Monday - Saturday", time: "10:00 AM - 08:00 PM" },
  weekend: { days: "Sunday", time: "Site Visits Only" },
};

// ──────────────────────────────────────────────
// Project Lifecycle Stages (used by Tracker + ERP)
// ──────────────────────────────────────────────
export type ProjectStatus =
  | "Inquiry"
  | "Site Visit"
  | "Design"
  | "Manufacturing"
  | "Installation"
  | "Completed";

export const PROJECT_STAGES: ProjectStatus[] = [
  "Inquiry",
  "Site Visit",
  "Design",
  "Manufacturing",
  "Installation",
  "Completed",
];

// ──────────────────────────────────────────────
// ERP Status Badge Styles
// ──────────────────────────────────────────────
export const STATUS_STYLES: Record<string, string> = {
  Inquiry: "bg-blue-100 text-blue-700",
  "Site Visit Done": "bg-purple-100 text-purple-700",
  "Design Ready": "bg-yellow-100 text-yellow-700",
  "Order Confirmed": "bg-orange-100 text-orange-700",
  Manufacturing: "bg-indigo-100 text-indigo-700",
  "Installation Scheduled": "bg-cyan-100 text-cyan-700",
  Completed: "bg-green-100 text-green-700",
};

// ──────────────────────────────────────────────
// Furniture Types (used by Contact form + ERP)
// ──────────────────────────────────────────────
export const FURNITURE_TYPES = [
  "Modular Kitchen",
  "Storage Cabinets / Custom Cupboards",
  "Bed & Bedroom Customisation",
  "Wardrobe",
  "Loft & Wall Cabinets",
  "TV Unit / Study Table / Bookshelf",
  "Indian-Style Home Temple",
  "Other",
] as const;

// ──────────────────────────────────────────────
// Stats (About section)
// ──────────────────────────────────────────────
export const BUSINESS_STATS = [
  { label: "Years of Craft", value: "10+" },
  { label: "Projects Delivered", value: "1200+" },
  { label: "Happy Homes", value: "950+" },
  { label: "Cities Served", value: "8+" },
];
