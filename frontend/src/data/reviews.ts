export interface Review {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: "Meera Kulkarni",
    role: "Nashik",
    comment:
      "Full modular kitchen done end-to-end. The finish, the hardware, the fit — exactly as shown in the 3D preview. Not a single gap, not a single rough edge.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rahul Deshmukh",
    role: "Nashik",
    comment:
      "The storage system they built is brilliant. Every corner used. Zero loose fittings after 8 months of daily use.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sunita Patil",
    role: "Nashik",
    comment:
      "They showed us a 3D design before touching a single board. That level of professionalism is rare. The final result was even better.",
    rating: 5,
  },
  {
    id: 4,
    name: "Amit Wagh",
    role: "Nashik",
    comment:
      "Full bedroom customisation — wardrobe, bed with storage, side units. One consistent finish throughout. Clean installation, no damage to walls.",
    rating: 5,
  },
  {
    id: 5,
    name: "Pooja Shinde",
    role: "Nashik",
    comment:
      "Very honest with pricing. Sachin bhai gave us a written quotation before starting and the final bill matched exactly. That trust is everything.",
    rating: 5,
  },
  {
    id: 6,
    name: "Ganesh More",
    role: "Nashik",
    comment:
      "Got loft shutters and wall cabinets done. Precise measurements, neat finish. Already planning to call them for the bedroom next.",
    rating: 4,
  },
  {
    id: 7,
    name: "Rekha Jadhav",
    role: "Nashik",
    comment:
      "The space is completely transformed. Storage doubled. My only regret is not calling them sooner.",
    rating: 5,
  },
  {
    id: 8,
    name: "Suresh Kamble",
    role: "Nashik",
    comment:
      "Written quotation before work. No surprise charges at the end. In this industry, that kind of transparency is rare and deeply appreciated.",
    rating: 5,
  },
  {
    id: 9,
    name: "Deepa Nair",
    role: "Nashik",
    comment:
      "Small flat, big ideas. They planned every inch intelligently. The modular layout they suggested was something we hadn't even thought of.",
    rating: 5,
  },
  {
    id: 10,
    name: "Vinod Tawde",
    role: "Nashik",
    comment:
      "Good material quality, clean laminate finish, solid hardware. Minor delay on day two but they called ahead to inform. That's how it should work.",
    rating: 4,
  },
];
