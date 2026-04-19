// ── Furniture Catalog: Every placeable item in the 3D studio ──
// All dimensions are in meters (Three.js units).
// origin = bottom-center of the piece; it snaps to wall + floor automatically.
export type FurnitureCategory = "lower" | "upper" | "tall" | "corner" | "appliance" | "window_door" | "table_stool" | "structural" | "accessory";

export interface FurniturePiece {
  id: string;
  name: string;
  category: FurnitureCategory;
  /** Width along the wall (X) */
  width: number;
  /** Height (Y) */
  height: number;
  /** Depth away from wall (Z) */
  depth: number;
  /** Y-offset from floor — upper cabinets float above counter */
  yOffset: number;
  /** Default hex color */
  color: string;
  /** Whether this piece has a countertop slab on it */
  hasCounter: boolean;
}

// ── LOWER CABINETS (base units sitting on floor) ──
export const LOWER_CABINETS: FurniturePiece[] = [
  {
    id: "lower-600",
    name: "Base Cabinet 600mm",
    category: "lower",
    width: 0.6,
    height: 0.85,
    depth: 0.55,
    yOffset: 0,
    color: "#7a7d85",
    hasCounter: true,
  },
  {
    id: "lower-900",
    name: "Base Cabinet 900mm",
    category: "lower",
    width: 0.9,
    height: 0.85,
    depth: 0.55,
    yOffset: 0,
    color: "#7a7d85",
    hasCounter: true,
  },
  {
    id: "lower-drawer-600",
    name: "Drawer Unit 600mm",
    category: "lower",
    width: 0.6,
    height: 0.85,
    depth: 0.55,
    yOffset: 0,
    color: "#7a7d85",
    hasCounter: true,
  },
  {
    id: "lower-drawer-900",
    name: "Drawer Unit 900mm",
    category: "lower",
    width: 0.9,
    height: 0.85,
    depth: 0.55,
    yOffset: 0,
    color: "#7a7d85",
    hasCounter: true,
  },
  {
    id: "lower-sink-900",
    name: "Sink Unit 900mm",
    category: "lower",
    width: 0.9,
    height: 0.85,
    depth: 0.55,
    yOffset: 0,
    color: "#7a7d85",
    hasCounter: true,
  },
  {
    id: "lower-corner",
    name: "Corner L-Unit",
    category: "lower",
    width: 0.9,
    height: 0.85,
    depth: 0.9,
    yOffset: 0,
    color: "#7a7d85",
    hasCounter: true,
  },
];

// ── UPPER CABINETS (wall-mounted above counter) ──
export const UPPER_CABINETS: FurniturePiece[] = [
  {
    id: "upper-600",
    name: "Wall Cabinet 600mm",
    category: "upper",
    width: 0.6,
    height: 0.7,
    depth: 0.35,
    yOffset: 1.4,
    color: "#e8e8e8",
    hasCounter: false,
  },
  {
    id: "upper-900",
    name: "Wall Cabinet 900mm",
    category: "upper",
    width: 0.9,
    height: 0.7,
    depth: 0.35,
    yOffset: 1.4,
    color: "#e8e8e8",
    hasCounter: false,
  },
  {
    id: "upper-glass-600",
    name: "Glass Shutter 600mm",
    category: "upper",
    width: 0.6,
    height: 0.7,
    depth: 0.35,
    yOffset: 1.4,
    color: "#1a1a2e",
    hasCounter: false,
  },
  {
    id: "upper-glass-900",
    name: "Glass Shutter 900mm",
    category: "upper",
    width: 0.9,
    height: 0.7,
    depth: 0.35,
    yOffset: 1.4,
    color: "#1a1a2e",
    hasCounter: false,
  },
  {
    id: "upper-loft-600",
    name: "Loft Cabinet 600mm",
    category: "upper",
    width: 0.6,
    height: 0.45,
    depth: 0.35,
    yOffset: 2.15,
    color: "#e8e8e8",
    hasCounter: false,
  },
];

// ── TALL UNITS ──
export const TALL_UNITS: FurniturePiece[] = [
  {
    id: "tall-pantry",
    name: "Tall Pantry Unit",
    category: "tall",
    width: 0.6,
    height: 2.1,
    depth: 0.55,
    yOffset: 0,
    color: "#7a7d85",
    hasCounter: false,
  },
  {
    id: "tall-fridge",
    name: "Fridge Housing",
    category: "tall",
    width: 0.7,
    height: 2.1,
    depth: 0.6,
    yOffset: 0,
    color: "#e8e8e8",
    hasCounter: false,
  },
];

export const CORNER_CABINETS: FurniturePiece[] = [
  {
    id: "corner-base-l",
    name: "Base Corner L-Shape",
    category: "corner",
    width: 0.9,
    height: 0.85,
    depth: 0.9,
    yOffset: 0,
    color: "#7a7d85",
    hasCounter: true,
  },
  {
    id: "corner-wall-diagonal",
    name: "Wall Corner Diagonal",
    category: "corner",
    width: 0.6,
    height: 0.7,
    depth: 0.6,
    yOffset: 1.4,
    color: "#e8e8e8",
    hasCounter: false,
  },
];

export const APPLIANCES: FurniturePiece[] = [
  {
    id: "app-fridge-double",
    name: "Double Door Fridge",
    category: "appliance",
    width: 0.9,
    height: 1.8,
    depth: 0.7,
    yOffset: 0,
    color: "#c0c0c0",
    hasCounter: false,
  },
  {
    id: "app-oven-built-in",
    name: "Built-in Oven",
    category: "appliance",
    width: 0.6,
    height: 0.6,
    depth: 0.55,
    yOffset: 0.85,
    color: "#2a2a2a",
    hasCounter: false,
  },
  {
    id: "app-hob-4burner",
    name: "4-Burner Hob",
    category: "appliance",
    width: 0.6,
    height: 0.05,
    depth: 0.5,
    yOffset: 0.86,
    color: "#111111",
    hasCounter: false,
  },
  {
    id: "app-chimney",
    name: "Wall Chimney",
    category: "appliance",
    width: 0.6,
    height: 0.8,
    depth: 0.5,
    yOffset: 1.6,
    color: "#c0c0c0",
    hasCounter: false,
  },
];

export const WINDOWS_DOORS: FurniturePiece[] = [
  {
    id: "window-standard",
    name: "Window (1200x900)",
    category: "window_door",
    width: 1.2,
    height: 0.9,
    depth: 0.1,
    yOffset: 1.0,
    color: "#87ceeb",
    hasCounter: false,
  },
  {
    id: "door-standard",
    name: "Standard Door",
    category: "window_door",
    width: 0.9,
    height: 2.1,
    depth: 0.1,
    yOffset: 0,
    color: "#5c4033",
    hasCounter: false,
  },
];

export const TABLES_STOOLS: FurniturePiece[] = [
  {
    id: "table-island",
    name: "Island Table / Counter",
    category: "table_stool",
    width: 1.8,
    height: 0.9,
    depth: 0.9,
    yOffset: 0,
    color: "#e8e8e8",
    hasCounter: true,
  },
  {
    id: "stool-bar",
    name: "Bar Stool",
    category: "table_stool",
    width: 0.4,
    height: 0.75,
    depth: 0.4,
    yOffset: 0,
    color: "#36454f",
    hasCounter: false,
  },
];

// ── ACCESSORIES ──
export const ACCESSORIES: FurniturePiece[] = [
  {
    id: "acc-sink-double",
    name: "Double Sink Bowl",
    category: "accessory",
    width: 0.8,
    height: 0.2,
    depth: 0.45,
    yOffset: 0.85,
    color: "#c0c0c0",
    hasCounter: false,
  },
];

// ── MATERIALS / COLORS ──
export interface MaterialOption {
  id: string;
  name: string;
  hex: string;
  type: "laminate" | "granite" | "glass" | "wood";
}

export const MATERIALS: MaterialOption[] = [
  { id: "grey-laminate", name: "Grey Laminate", hex: "#7a7d85", type: "laminate" },
  { id: "white-laminate", name: "White Laminate", hex: "#e8e8e8", type: "laminate" },
  { id: "beige-laminate", name: "Beige Laminate", hex: "#d4c5a9", type: "laminate" },
  { id: "walnut-wood", name: "Walnut Wood", hex: "#5c4033", type: "wood" },
  { id: "oak-wood", name: "Light Oak", hex: "#c4a35a", type: "wood" },
  { id: "charcoal", name: "Charcoal", hex: "#36454f", type: "laminate" },
  { id: "navy-blue", name: "Navy Blue", hex: "#1a1a4e", type: "laminate" },
  { id: "forest-green", name: "Forest Green", hex: "#2d4a22", type: "laminate" },
  { id: "black-granite", name: "Black Granite", hex: "#1e1e1e", type: "granite" },
  { id: "white-marble", name: "White Marble", hex: "#f0ece2", type: "granite" },
  { id: "brown-granite", name: "Brown Granite", hex: "#4a3728", type: "granite" },
  { id: "glass-clear", name: "Clear Glass", hex: "#b0c4de", type: "glass" },
  { id: "glass-frosted", name: "Frosted Glass", hex: "#d9e4ec", type: "glass" },
];

// ── ROOM PRESETS ──
export interface RoomPreset {
  name: string;
  width: number;
  depth: number;
  height: number;
}

export const ROOM_PRESETS: RoomPreset[] = [
  { name: "Small (8×6 ft)", width: 2.44, depth: 1.83, height: 2.74 },
  { name: "Medium (10×8 ft)", width: 3.05, depth: 2.44, height: 2.74 },
  { name: "Large (12×10 ft)", width: 3.66, depth: 3.05, height: 2.74 },
  { name: "L-Shape (12×10 ft)", width: 3.66, depth: 3.05, height: 2.74 },
];

// ── ALL catalog items flat ──
export const ALL_FURNITURE = [
  ...LOWER_CABINETS,
  ...UPPER_CABINETS,
  ...CORNER_CABINETS,
  ...TALL_UNITS,
  ...APPLIANCES,
  ...WINDOWS_DOORS,
  ...TABLES_STOOLS,
  ...ACCESSORIES,
];
