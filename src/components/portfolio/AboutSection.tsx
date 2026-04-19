import { Users, Layout, ShieldCheck, PenTool, Gem, Truck, FileText } from "lucide-react";
import { BUSINESS_STATS } from "@/data/constants";
import { motion } from "framer-motion";

const highlights = [
  {
    title: "Made to Measure",
    description: "Designed around your space — never off-the-shelf.",
    icon: <PenTool size={24} className="text-primary" />,
  },
  {
    title: "Premium Grade Materials",
    description: "ISI-grade BWR plywood, quality laminates, durable hardware.",
    icon: <Gem size={24} className="text-primary" />,
  },
  {
    title: "White-Glove Installation",
    description: "Precise fitting, zero wall damage, on-time delivery.",
    icon: <Truck size={24} className="text-primary" />,
  },
  {
    title: "Transparent Pricing",
    description: "Written quotation before work begins. No surprises, ever.",
    icon: <FileText size={24} className="text-primary" />,
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 md:px-8 bg-muted/20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Layered Image Frame */}
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative z-20 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-background"
            >
              <img 
                src="/images/portfolio/about/about_hero.png" 
                alt="Bespoke Kitchen Design" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
              />
            </motion.div>

            {/* Decorative background element */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>

          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-10 pt-10 md:pt-0"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                Who We Are
              </div>
              <h2 className="text-3xl md:text-[2.5rem] font-display mb-6">Where Precision<br /><span className="text-primary italic">Meets Craftsmanship</span>.</h2>
              <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                Siddhivinayak Kitchen Trolley System is a bespoke furniture studio rooted in Maharashtra — built on honest craft, clean finishes, and spaces that actually work.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every piece is measured twice, engineered to your room, and installed without compromise. Dedicated to 10+ years of hands-on experience, one home at a time.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {highlights.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-background border border-border rounded-2xl"
            >
              {BUSINESS_STATS.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
