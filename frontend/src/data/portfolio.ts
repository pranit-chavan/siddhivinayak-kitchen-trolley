export interface PortfolioItem {
  id: number;
  category: "Kitchen" | "Wardrobe" | "Modular" | "Custom";
  title: string;
  location: string;
  owner: string;
  image: string;
  description?: string;
}

export const portfolioItems: PortfolioItem[] = [
  // Original 6
  {
    id: 1,
    category: "Kitchen",
    title: "L-Shaped SS Trolley",
    location: "Nashik",
    owner: "Ramesh Patil",
    image: "/images/portfolio/craftfolio/l-shaped-kitchen.png",
    description: "Full modular kitchen with seamless L-shape layout and high-gloss finish."
  },
  {
    id: 2,
    category: "Modular",
    title: "Premium Modular Kitchen",
    location: "Nashik",
    owner: "Santosh Deshmukh",
    image: "/images/portfolio/craftfolio/premium-modular-kitchen.png",
    description: "Complete modular setup including overhead storage and custom pull-outs."
  },
  {
    id: 3,
    category: "Wardrobe",
    title: "Master Bedroom Wardrobe",
    location: "Nashik",
    owner: "Vishal Kadam",
    image: "/images/portfolio/craftfolio/master-wardrobe.png",
    description: "Floor-to-ceiling wardrobe maximizing vertical storage space."
  },
  {
    id: 4,
    category: "Custom",
    title: "Sleek TV Unit",
    location: "Nashik",
    owner: "Sunil Joshi",
    image: "/images/portfolio/craftfolio/tv-unit.png",
    description: "Minimalist TV unit with concealed wiring and ambient lighting."
  },
  {
    id: 5,
    category: "Kitchen",
    title: "Parallel Kitchen Layout",
    location: "Nashik",
    owner: "Pradip Pawar",
    image: "/images/portfolio/craftfolio/l-shaped-kitchen.png", // Reusing image for now
    description: "Space-optimized parallel kitchen layout ideal for narrow spaces."
  },
  {
    id: 6,
    category: "Wardrobe",
    title: "Sliding Door Wardrobe",
    location: "Nashik",
    owner: "Ganesh Shinde",
    image: "/images/portfolio/craftfolio/sliding-wardrobe.png",
    description: "Smooth sliding doors with mirror panels for a modern look."
  },
  // Expanded items (mocked for now, client can replace images later)
  {
    id: 7,
    category: "Custom",
    title: "Study Table & Bookshelf",
    location: "Pune",
    owner: "Amit Desai",
    image: "/images/portfolio/craftfolio/tv-unit.png", // Placeholder
    description: "Integrated study unit with ample open and closed storage."
  },
  {
    id: 8,
    category: "Kitchen",
    title: "Island Kitchen Design",
    location: "Mumbai",
    owner: "Neha Sharma",
    image: "/images/portfolio/craftfolio/premium-modular-kitchen.png", // Placeholder
    description: "Luxurious island kitchen serving as a dining and prep area."
  },
  {
    id: 9,
    category: "Wardrobe",
    title: "Walk-in Closet",
    location: "Nashik",
    owner: "Pooja Wagh",
    image: "/images/portfolio/craftfolio/master-wardrobe.png", // Placeholder
    description: "Custom walk-in closet with dedicated shoe racks and accessory drawers."
  },
  {
    id: 10,
    category: "Modular",
    title: "Space-Saving Crockery Unit",
    location: "Nashik",
    owner: "Vinod Tawde",
    image: "/images/portfolio/craftfolio/sliding-wardrobe.png", // Placeholder
    description: "Glass-front crockery unit highlighting fine dining ware."
  }
];

export const portfolioCategories = ["All", "Kitchen", "Wardrobe", "Modular", "Custom"];
