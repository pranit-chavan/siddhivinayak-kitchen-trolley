import { useState } from "react";
import { Send, Phone, MapPin } from "lucide-react";
import { WHATSAPP_URL, FURNITURE_TYPES } from "@/data/constants";
import { motion } from "framer-motion";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    type: FURNITURE_TYPES[0] as string,
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `*Inquiry from Website*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Location:* ${formData.location}%0A*Furniture Type:* ${formData.type}%0A*Message:* ${formData.message}`;
    const whatsappUrl = `${WHATSAPP_URL}?text=${message}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="contact" className="py-24 px-4 md:px-8 bg-background relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 -z-10 w-1/4 h-1/4 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-accent/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Title, Desc, and Map */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-6 uppercase tracking-wider">
                Get in Touch
              </div>
              <h2 className="text-4xl md:text-[3.5rem] font-display text-foreground leading-[1.1] mb-6">
                Let's Build<br /><span className="text-primary italic">Something Together</span>.
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-xl text-lg">
                Tell us about your space. We'll visit, measure, design, and give you a clear quotation — no obligation.
              </p>
            </div>

            <div className="flex flex-col gap-8 mb-12">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">Call Us</p>
                  <p className="text-xl font-bold text-foreground">+91 96574 72241</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">Our Location</p>
                  <p className="text-xl font-bold text-foreground">Nashik, Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-[350px] lg:flex-1 min-h-[300px] bg-muted/30 rounded-3xl overflow-hidden shadow-xl border border-border/50 relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3751.75463831109!2d73.83040837494853!3d19.8925799258311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdd958daa97f733%3A0xc16e4b480c7fa14c!2sSiddhivinayak%20kitchen%20trolly!5e0!3m2!1sen!2sin!4v1775383766136!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background border border-border/50 shadow-2xl rounded-3xl p-8 md:p-12 relative preserve-3d h-full"
          >
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold tracking-wide ml-1 uppercase text-foreground">Your Name</label>
                    <input
                      id="name"
                      required
                      className="w-full h-14 bg-muted/20 border border-border/50 rounded-xl px-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-bold tracking-wide ml-1 uppercase text-foreground">Phone Number</label>
                    <input
                      id="phone"
                      required
                      type="tel"
                      className="w-full h-14 bg-muted/20 border border-border/50 rounded-xl px-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="+91"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-bold tracking-wide ml-1 uppercase text-foreground">Project Location</label>
                  <input
                    id="location"
                    required
                    className="w-full h-14 bg-muted/20 border border-border/50 rounded-xl px-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Area / City"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-bold tracking-wide ml-1 uppercase text-foreground">Furniture Type</label>
                  <select
                    id="type"
                    className="w-full h-14 bg-muted/20 border border-border/50 rounded-xl px-5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {FURNITURE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold tracking-wide ml-1 uppercase text-foreground">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full bg-muted/20 border border-border/50 rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Describe your requirement, room size, preferred material or finish (optional)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 relative group overflow-hidden mt-6"
              >
                <span className="relative z-10">Send on WhatsApp →</span>
                <div className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
