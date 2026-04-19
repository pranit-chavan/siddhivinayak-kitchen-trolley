import { Rocket, Sparkles, MapPin, Hammer, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      {/* Background with abstract blobs */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-accent/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 md:px-8 relative w-full h-full flex flex-col justify-center">
        <div className="max-w-[100%] lg:max-w-[55%] relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-8"
          >
            <Sparkles size={14} />
            Crafting Bespoke Spaces Since 2012
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-display text-foreground leading-[1] mb-6"
          >
            Your Space.<br /><span className="text-primary italic">Reimagined.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed font-medium"
          >
            Bespoke modular furniture & interior woodwork — designed to measure, built to last, installed with precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <a
              href="/#craftfolio"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group shadow-xl shadow-primary/20"
            >
              Explore Our Craftfolio
              <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
            <a
              href="/#contact"
              className="px-8 py-4 border border-border bg-background/50 backdrop-blur-sm rounded-full font-bold hover:bg-muted-foreground/5 transition-colors flex items-center justify-center"
            >
              Book a Free Site Visit
            </a>
          </motion.div>

        </div>

        {/* Visual representative images background - Now bound to the centered container */}
        <div className="absolute right-0 lg:right-4 top-1/2 -translate-y-1/2 w-[45%] h-[80%] min-h-[500px] -z-10 hidden lg:block opacity-40 lg:opacity-100">
          <div className="relative w-full h-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
              className="absolute top-0 right-0 w-[90%] h-[70%] bg-muted rounded-2xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1556911223-e455013161c3?auto=format&fit=crop&q=80" 
                alt="Modular Kitchen Design" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -50, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 50 }}
              className="absolute bottom-0 left-0 w-[80%] h-[50%] bg-muted rounded-2xl overflow-hidden shadow-2xl border-8 border-background"
            >
              <img 
                src="https://images.unsplash.com/photo-1579725942955-4d8377f8c6d1?auto=format&fit=crop&q=80" 
                alt="Kitchen Trolley Detail" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
