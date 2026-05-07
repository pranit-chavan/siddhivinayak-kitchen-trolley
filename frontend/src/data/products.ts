export interface Product {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  image: string;
  warranty?: string;
  material?: string;
  hardware?: string;
  finish?: string;
}

export const products: Product[] = [
  {
    id: "modular",
    title: "Modular Kitchens",
    oneLiner: "The kitchen you always pictured — now built exactly to your walls.",
    description: "L-shape, U-shape, parallel & island layouts. Full fit-out with soft-close shutters, premium hardware and intelligent storage systems.",
    image: "/images/portfolio/products/modular.jpg",
    warranty: "10 Year Warranty",
    material: "IS:710 Marine Grade BWR Plywood",
    hardware: "Hettich / Hafele Soft-Close",
    finish: "High-Gloss Acrylic / PU / Laminate"
  },
  {
    id: "cupboards",
    title: "Storage Cabinets & Custom Cupboards",
    oneLiner: "Every inch of your wall, working for you.",
    description: "Floor-to-ceiling storage units, crockery cabinets, utility cupboards — clean lines, zero wasted space.",
    image: "/images/portfolio/products/cupboards.jpg",
    warranty: "5 Year Warranty",
    material: "BWP / MR Grade Plywood",
    hardware: "Heavy Duty Hinges & Channels",
    finish: "Premium Laminate / Edge Banding"
  },
  {
    id: "bedroom",
    title: "Beds & Bedroom Customisation",
    oneLiner: "Your bedroom. Designed from the floor up.",
    description: "Custom beds with storage, full wardrobe systems, dresser units and side tables — all in one cohesive finish.",
    image: "/images/portfolio/products/bedroom.jpg",
    warranty: "5 Year Warranty",
    material: "Premium Hardwood / Plywood",
    hardware: "Hydraulic Storage Mechanisms",
    finish: "Veneer / Laminate / PU Paint"
  },
  {
    id: "loft",
    title: "Loft & Wall Cabinets",
    oneLiner: "Look up. That space above your head? We build there too.",
    description: "Custom loft shutters, wall-mounted cabinets, overhead storage — every vertical inch maximised.",
    image: "/images/portfolio/products/loft.jpg",
    warranty: "5 Year Warranty",
    material: "Lightweight BWP Plywood",
    hardware: "Gas Springs / Soft-Close Hinges",
    finish: "Matching Room Laminate"
  },
  {
    id: "units",
    title: "Custom Furniture Units",
    oneLiner: "Beyond the kitchen. Beyond the bedroom.",
    description: "TV units, floating shelves, bookshelves, study tables and workstations — built to your brief, your dimensions, your style.",
    image: "/images/portfolio/products/units.jpg",
    warranty: "5 Year Warranty",
    material: "HDHMR / Plywood Core",
    hardware: "Concealed Wiring Managers",
    finish: "Textured / Solid Color Laminates"
  },
  {
    id: "temple",
    title: "Indian-Style Home Temples",
    oneLiner: "A sacred corner, crafted with devotion.",
    description: "Handcrafted wooden mandirs in traditional Indian styles — teak finish, carved detailing, wall-mounted or floor-standing.",
    image: "/images/portfolio/products/temple.jpg",
    warranty: "Lifetime Craftsmanship Warranty",
    material: "Solid Teak Wood / Premium Plywood",
    hardware: "Brass Bells & Fittings",
    finish: "Natural Wood Polish / PU Clear Coat"
  },
];
