import { useEffect } from "react";
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
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInquire = (productTitle: string) => {
    const message = `*Inquiry from Website*%0A%0AHi, I'm interested in the *${productTitle}* I saw on your website. Can you provide more details?`;
    window.open(`${WHATSAPP_URL}?text=${message}`, "_blank");
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
                    onClick={() => handleInquire(product.title)}
                    className="w-full py-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Inquire on WhatsApp
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
