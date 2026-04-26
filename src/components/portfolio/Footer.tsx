import { Link } from "react-router-dom";
import { MessageCircle, Phone, MapPin, Hammer, ArrowRight } from "lucide-react";
import { FIRM_NAME, PHONE_DISPLAY, LOCATION_DISPLAY, WHATSAPP_URL } from "@/data/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted-foreground/5 border-t border-border pt-12 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                Siddhivinayak
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-1">
                Kitchen Trolley System
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bespoke modular furniture & interior woodwork. <br />
              {LOCATION_DISPLAY} — since 2012.
            </p>
          </div>

          {/* Navigate Column */}
          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs">Navigate</h4>
            <ul className="space-y-3">
              {["Home", "About", "Products", "Craftfolio", "Reviews", "FAQ", "Contact"].map((link) => (
                <li key={link}>
                  <a 
                    href={`/#${link.toLowerCase()}`} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/track/SVK-2025-042" className="text-sm text-primary font-bold hover:opacity-80 transition-opacity">
                  Track My Project
                </Link>
              </li>
            </ul>
          </div>

          {/* What We Build Column */}
          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs">What We Build</h4>
            <ul className="space-y-3">
              {[
                "Modular Kitchens",
                "Storage Cabinets & Cupboards",
                "Beds & Bedroom Customisation",
                "Loft & Wall Cabinets",
                "Custom Furniture Units",
                "Indian-Style Home Temples"
              ].map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground font-medium">{PHONE_DISPLAY}</span>
              </li>
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-primary shrink-0" />
                <span className="text-sm text-muted-foreground font-medium">{LOCATION_DISPLAY}</span>
              </li>
              <li className="pt-2">
                <a 
                  href={WHATSAPP_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <MessageCircle size={18} />
                  WhatsApp Us
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-muted-foreground font-medium">
            © {currentYear} {FIRM_NAME}. All rights reserved.
          </p>
          <div className="bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
            <p className="text-[10px] uppercase font-bold tracking-widest text-primary">
              Designed with craft. Built with care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
