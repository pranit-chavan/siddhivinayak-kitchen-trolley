export interface Product {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "modular",
    title: "Modular Kitchens",
    oneLiner: "The kitchen you always pictured — now built exactly to your walls.",
    description: "L-shape, U-shape, parallel & island layouts. Full fit-out with soft-close shutters, premium hardware and intelligent storage systems.",
    image: "/images/portfolio/products/modular.jpg",
  },
  {
    id: "cupboards",
    title: "Storage Cabinets & Custom Cupboards",
    oneLiner: "Every inch of your wall, working for you.",
    description: "Floor-to-ceiling storage units, crockery cabinets, utility cupboards — clean lines, zero wasted space.",
    image: "/images/portfolio/products/cupboards.jpg",
  },
  {
    id: "bedroom",
    title: "Beds & Bedroom Customisation",
    oneLiner: "Your bedroom. Designed from the floor up.",
    description: "Custom beds with storage, full wardrobe systems, dresser units and side tables — all in one cohesive finish.",
    image: "/images/portfolio/products/bedroom.jpg",
  },
  {
    id: "loft",
    title: "Loft & Wall Cabinets",
    oneLiner: "Look up. That space above your head? We build there too.",
    description: "Custom loft shutters, wall-mounted cabinets, overhead storage — every vertical inch maximised.",
    image: "/images/portfolio/products/loft.jpg",
  },
  {
    id: "units",
    title: "Custom Furniture Units",
    oneLiner: "Beyond the kitchen. Beyond the bedroom.",
    description: "TV units, floating shelves, bookshelves, study tables and workstations — built to your brief, your dimensions, your style.",
    image: "/images/portfolio/products/units.jpg",
  },
  {
    id: "temple",
    title: "Indian-Style Home Temples",
    oneLiner: "A sacred corner, crafted with devotion.",
    description: "Handcrafted wooden mandirs in traditional Indian styles — teak finish, carved detailing, wall-mounted or floor-standing.",
    image: "/images/portfolio/products/temple.jpg",
  },
];
