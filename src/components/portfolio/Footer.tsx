import { Link } from "react-router-dom";
import { MessageCircle, Phone, MapPin, Hammer, ArrowRight } from "lucide-react";
import { FIRM_NAME, PHONE_DISPLAY, LOCATION_DISPLAY, WHATSAPP_URL } from "@/data/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f0f0f] text-neutral-300 pt-24 pb-12 border-t border-neutral-800">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-6 lg:pr-8">
            <div className="flex flex-col">
              <span className="font-display text-3xl font-bold tracking-tight text-white">
                Siddhivinayak
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-primary mt-2">
                Kitchen Trolley System
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-loose">
              Bespoke modular furniture & interior woodwork. <br />
              {LOCATION_DISPLAY} — since 2012.
            </p>
          </div>

          {/* Navigate Column */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-[0.15em] text-xs">Navigate</h4>
            <ul className="space-y-4">
              {["Home", "About", "Products", "Craftfolio", "Reviews", "FAQ", "Contact"].map((link) => (
                <li key={link}>
                  <a 
                    href={`/#${link.toLowerCase()}`} 
                    className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-3 group"
                  >
                    <ArrowRight size={14} className="opacity-0 -translate-x-3 text-primary group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/track/SVK-2025-042" className="text-sm text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-2">
                  Track My Project <ArrowRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* What We Build Column */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-[0.15em] text-xs">What We Build</h4>
            <ul className="space-y-4">
              {[
                "Modular Kitchens",
                "Storage Cabinets & Cupboards",
                "Beds & Bedroom Customisation",
                "Loft & Wall Cabinets",
                "Custom Furniture Units",
                "Indian-Style Home Temples"
              ].map((item) => (
                <li key={item} className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors cursor-default">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-[0.15em] text-xs">Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-300">{PHONE_DISPLAY}</span>
              </li>
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-300 leading-relaxed">{LOCATION_DISPLAY}</span>
              </li>
              <li className="pt-4">
                <a 
                  href={WHATSAPP_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-neutral-800 text-white rounded-xl text-sm font-bold hover:bg-primary transition-colors group border border-neutral-700 hover:border-primary"
                >
                  <MessageCircle size={18} className="text-[#25D366] group-hover:text-white transition-colors" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-neutral-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-xs text-neutral-500 font-medium">
            © {currentYear} {FIRM_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-neutral-500">
            <Hammer size={14} className="text-primary" />
            <p className="text-[10px] uppercase font-bold tracking-[0.2em]">
              Designed with craft. Built with care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
