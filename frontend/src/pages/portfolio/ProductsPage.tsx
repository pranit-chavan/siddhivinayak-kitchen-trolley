import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Gem, Hammer, MessageCircle } from "lucide-react";
import { products } from "@/data/products";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/data/constants";
import Footer from "@/components/portfolio/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 50 } },
};

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", location: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInquireClick = (productTitle: string) => {
    setSelectedProduct(productTitle);
    setFormData({ ...formData, message: `I am interested in the ${productTitle}.` });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";
      const response = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          location: formData.location,
          interest: selectedProduct,
          notes: formData.message,
          source: "WEBSITE",
          status: "NEW",
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSuccess(false);
          setFormData({ name: "", phone: "", location: "", message: "" });
        }, 3000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="pt-24 pb-12 bg-muted/20">
        <div className="container mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-semibold">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
              Full Catalog
            </div>
            <h1 className="text-4xl md:text-[3.5rem] font-display text-foreground leading-tight mb-4">
              Premium Furniture <span className="text-primary italic">Collection</span>.
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore our complete range of bespoke modular solutions, designed for precision and built for longevity.
            </p>
          </motion.div>
        </div>
      </div>

      <section className="py-16 flex-1">
        <div className="container mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 transform-gpu flex flex-col"
              >
                <div className="aspect-[3/2] overflow-hidden relative">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{product.title}</h3>
                  <p className="text-primary text-sm font-semibold mb-4 leading-tight">
                    {product.oneLiner}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {product.description}
                  </p>
                  
                  <div className="space-y-3 mb-8 bg-muted/30 p-4 rounded-xl border border-border/50">
                    {product.warranty && (
                      <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                        <ShieldCheck size={16} className="text-primary shrink-0" /> {product.warranty}
                      </div>
                    )}
                    {product.material && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                        <Gem size={16} className="text-muted-foreground shrink-0" /> {product.material}
                      </div>
                    )}
                    {product.hardware && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                        <Hammer size={16} className="text-muted-foreground shrink-0" /> {product.hardware}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleInquireClick(product.title)}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    Inquire Now →
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-background rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-border/50">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <h2 className="text-2xl font-display font-bold mb-2">Request Quote</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Inquiring about: <span className="font-semibold text-foreground">{selectedProduct}</span>
            </p>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase ml-1">Name</label>
                <input required className="w-full h-12 bg-muted/30 border border-border/50 rounded-xl px-4 mt-1 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase ml-1">Phone Number</label>
                <input required type="tel" className="w-full h-12 bg-muted/30 border border-border/50 rounded-xl px-4 mt-1 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase ml-1">Location</label>
                <input required className="w-full h-12 bg-muted/30 border border-border/50 rounded-xl px-4 mt-1 focus:ring-2 focus:ring-primary/20 focus:outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City / Area" />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full h-12 font-bold rounded-xl mt-4 transition-all ${isSuccess ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50'}`}
              >
                {isSubmitting ? "Sending..." : isSuccess ? "Sent Successfully! ✓" : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
