import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Maximize2, Tag, MapPin, X, Search } from "lucide-react";
import { portfolioItems, portfolioCategories, PortfolioItem } from "@/data/portfolio";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/portfolio/Footer";

const CraftfolioPage = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredItems = portfolioItems.filter((item) => {
    const matchesCategory = filter === "All" || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-24 pb-12 bg-muted/20">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-semibold">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                Our Work
              </div>
              <h1 className="text-4xl md:text-[3.5rem] font-display text-foreground leading-tight mb-4">
                The Complete <span className="text-primary italic">Craftfolio</span>.
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg">
                A gallery of precision, care, and bespoke design. Explore our past installations across Maharashtra.
              </p>
            </motion.div>

            {/* Filters & Search */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4 w-full md:w-auto"
            >
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search by client, city or title..." 
                  className="w-full md:w-80 h-12 pl-12 pr-4 bg-background border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {portfolioCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      filter === cat
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-background border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="py-16 flex-1">
        <div className="container mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-display text-muted-foreground mb-2">No projects found.</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              <button 
                onClick={() => { setFilter("All"); setSearchQuery(""); }}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary rounded-full font-semibold hover:bg-primary/20 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={item.id} 
                    className="group relative bg-muted rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                      <div className="absolute top-6 right-6">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <Maximize2 size={18} className="text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        <span className="flex items-center gap-1.5 opacity-90">
                          <Tag size={14} className="text-primary" /> {item.category}
                        </span>
                        <span className="flex items-center gap-1.5 opacity-90">
                          <MapPin size={14} className="text-primary" /> {item.location}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-6xl w-full max-h-[90vh] relative flex flex-col lg:flex-row overflow-hidden bg-zinc-900 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 bg-black flex items-center justify-center relative min-h-[40vh] lg:min-h-0">
                <img 
                  src={selectedImage.image} 
                  alt={selectedImage.title} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
              
              <div className="text-white lg:w-96 p-8 lg:p-10 flex flex-col bg-zinc-900 overflow-y-auto">
                <h2 className="text-3xl font-display font-bold mb-2">{selectedImage.title}</h2>
                <p className="text-zinc-400 leading-relaxed mb-8">
                  {selectedImage.description || "Bespoke furniture implementation perfectly aligned with client requirements."}
                </p>
                
                <div className="space-y-6 mt-auto">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                       <Tag size={20} />
                     </div>
                     <div>
                       <p className="text-xs uppercase text-zinc-500 font-bold tracking-widest mb-1">Category</p>
                       <p className="font-semibold text-lg">{selectedImage.category}</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-zinc-800 text-zinc-300 rounded-xl flex items-center justify-center shrink-0">
                       <MapPin size={20} />
                     </div>
                     <div>
                       <p className="text-xs uppercase text-zinc-500 font-bold tracking-widest mb-1">Location</p>
                       <p className="font-semibold text-lg">{selectedImage.location}</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-zinc-800 text-primary rounded-xl flex items-center justify-center shrink-0 font-display text-2xl pt-1">
                       C
                     </div>
                     <div>
                       <p className="text-xs uppercase text-zinc-500 font-bold tracking-widest mb-1">Client</p>
                       <p className="font-semibold text-lg">{selectedImage.owner}</p>
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default CraftfolioPage;
