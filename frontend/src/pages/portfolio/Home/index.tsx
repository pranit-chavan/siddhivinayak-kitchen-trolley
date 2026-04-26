import { useEffect } from "react";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ProductsSection from "@/components/portfolio/ProductsSection";
import CraftfolioSection from "@/components/portfolio/CraftfolioSection";
import ReviewsSection from "@/components/portfolio/ReviewsSection";
import FAQSection from "@/components/portfolio/FAQSection";
import ContactSection from "@/components/portfolio/ContactSection";

export default function Home() {
  useEffect(() => {
    // 1. Tell the browser intentionally NOT to remember the scroll position on reload
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 2. If the page loads with a hash, forcefully remove it
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    
    // 3. Guarantee we are at the top of the page. We use multiple stages to fight the browser engine
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full relative">
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <CraftfolioSection />
        <ReviewsSection />
        <FAQSection />
        <ContactSection />
      </main>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
