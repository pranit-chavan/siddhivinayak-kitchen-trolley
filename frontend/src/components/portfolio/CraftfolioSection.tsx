import { useState } from "react";
import { Maximize2, Tag, MapPin, X } from "lucide-react";

interface GalleryItem {
  id: number;
  category: "Kitchen" | "Wardrobe" | "Modular" | "Custom";
  title: string;
  location: string;
  owner: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    category: "Kitchen",
    title: "L-Shaped SS Trolley",
    location: "Nashik",
    owner: "Ramesh Patil",
    image: "/images/portfolio/craftfolio/l-shaped-kitchen.png",
  },
  {
    id: 2,
    category: "Modular",
    title: "Premium Modular Kitchen",
    location: "Nashik",
    owner: "Santosh Deshmukh",
    image: "/images/portfolio/craftfolio/premium-modular-kitchen.png",
  },
  {
    id: 3,
    category: "Wardrobe",
    title: "Master Bedroom Wardrobe",
    location: "Nashik",
    owner: "Vishal Kadam",
    image: "/images/portfolio/craftfolio/master-wardrobe.png",
  },
  {
    id: 4,
    category: "Custom",
    title: "Sleek TV Unit",
    location: "Nashik",
    owner: "Sunil Joshi",
    image: "/images/portfolio/craftfolio/tv-unit.png",
  },
  {
    id: 5,
    category: "Kitchen",
    title: "Parallel Kitchen Layout",
    location: "Nashik",
    owner: "Pradip Pawar",
    image: "/images/portfolio/craftfolio/l-shaped-kitchen.png",
  },
  {
    id: 6,
    category: "Wardrobe",
    title: "Sliding Door Wardrobe",
    location: "Nashik",
    owner: "Ganesh Shinde",
    image: "/images/portfolio/craftfolio/sliding-wardrobe.png",
  },
];

const categories = ["All", "Kitchen", "Wardrobe", "Modular", "Custom"];

const CraftfolioSection = () => {
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = galleryItems.filter(
    (item) => filter === "All" || item.category === filter
  );

  return (
    <section id="craftfolio" className="py-24 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display mb-6"> Our <span className="text-primary italic">Craftfolio</span></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Browse through our successfully completed projects and see how we transform living spaces with quality furniture and modular solutions.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-muted rounded-2xl overflow-hidden aspect-square cursor-pointer animate-in zoom-in-95 duration-500"
              onClick={() => setSelectedImage(item)}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6 text-center">
                <Maximize2 size={32} className="mb-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-500" />
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-medium uppercase tracking-widest opacity-80 mt-2">
                  <span className="flex items-center gap-1">
                    <Tag size={12} /> {item.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {item.location}
                  </span>
                  <span className="flex items-center gap-1 w-full justify-center opacity-70 mt-1">
                    Client: {item.owner}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <div 
            className="max-w-5xl w-full max-h-[85vh] relative flex flex-col md:flex-row items-center justify-center gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl" 
            />
            
            <div className="text-white md:w-64">
              <h2 className="text-2xl font-bold mb-4">{selectedImage.title}</h2>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                     <Tag size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Category</p>
                     <p className="font-semibold">{selectedImage.category}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Location</p>
                     <p className="font-semibold">{selectedImage.location}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 text-primary">
                     <span className="font-display text-xl leading-none pt-1">C</span>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Client</p>
                     <p className="font-semibold">{selectedImage.owner}</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CraftfolioSection;
