import { ShoppingBag, ChevronRight } from "lucide-react";
import { products } from "@/data/products";
import { motion } from "framer-motion";

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
  show: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" as const, stiffness: 50 } },
};

const ProductsSection = () => {
  return (
    <section id="products" className="py-24 px-4 md:px-8 bg-background">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
            What We Build
          </div>
          <h2 className="text-3xl md:text-[2.5rem] font-display text-foreground leading-tight mb-4">
            Furniture for<br /><span className="text-primary italic">Every Corner of Your Home</span>.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From the kitchen to the bedroom — every piece made to your exact dimensions, in your chosen finish.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              variants={itemVariants}
              whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
              className="group bg-muted/30 rounded-2xl overflow-hidden border border-border/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 transform-gpu preserve-3d flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">{product.title}</h3>
                <p className="text-primary text-sm font-semibold mb-4 leading-tight">
                  {product.oneLiner}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                  {product.description}
                </p>
                <a href="/#contact" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-background border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary rounded-xl font-bold transition-all duration-300 mt-auto">
                  Get Quote
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
