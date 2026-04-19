import { useState, useEffect } from "react";
import { Menu, X, Rocket } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Products", id: "products" },
  { label: "Craftfolio", id: "craftfolio" },
  { label: "Reviews", id: "reviews" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (!isHomePage) return;

      // Scroll Spy Logic
      const sections = navLinks.map(link => link.id);
      let current = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage && location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location, isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);

    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${id}`);
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        {/* ── LEFT: Logo + Shop Name ── */}
        <a 
          href="/#home" 
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-3"
        >
          <img 
            src="/images/logo.png" 
            alt="Siddhivinayak Logo" 
            className="h-12 md:h-14 w-auto"
          />
          <div className="flex flex-col">
            <span className="font-display text-2xl md:text-3xl font-bold leading-none text-foreground">
              Siddhivinayak
            </span>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-0.5 font-semibold">
              Kitchen Trolley System
            </span>
          </div>
        </a>

        {/* ── RIGHT: Desktop Nav Links ── */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = isHomePage && activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`/#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`text-base font-semibold transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          
          <Link
            to="/track/SVK-2025-042"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Rocket size={18} />
            Track My Project
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border animate-in fade-in slide-in-from-top-4 duration-300">
          <ul className="flex flex-col py-6 px-8 gap-6">
            {navLinks.map((link) => {
              const isActive = isHomePage && activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`/#${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className={`text-lg font-semibold transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li className="pt-2">
              <Link
                to="/track/SVK-2025-042"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center px-5 py-3 bg-primary text-primary-foreground rounded-md text-base font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Rocket size={18} />
                Track My Project
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
