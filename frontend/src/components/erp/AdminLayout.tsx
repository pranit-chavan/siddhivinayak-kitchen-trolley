import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Factory, FileText, IndianRupee, Box, Scissors, Settings, LogOut, Menu, X, Rocket, Bell } from "lucide-react";
import { useState } from "react";
import NotificationPanel from "./NotificationPanel";
import { dummyLeads } from "./NotificationPanel";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Projects", path: "/admin/projects" },
  { icon: Factory, label: "Production Tracking", path: "/admin/production" },
  { icon: FileText, label: "Quotation Builder", path: "/admin/quotation" },
  { icon: IndianRupee, label: "Finance & Billing", path: "/admin/finance" },
  { icon: Box, label: "3D Design Studio", path: "/admin/design" },
  { icon: Scissors, label: "Cutting Optimizer", path: "/admin/cutting" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Calculate unread leads specifically dynamically if possible, right now hardcoded via dummyLeads static ref.
  const unreadCount = dummyLeads.filter(l => !l.read).length;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="font-display font-bold text-lg flex items-center gap-2">
           <img src="/images/logo.png" alt="SVK Logo" className="w-8 h-8 object-contain" />
           SVK Admin
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setIsNotificationOpen(true)} className="relative p-2 border border-border rounded-lg">
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />}
           </button>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 border border-border rounded-lg">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-[61px] md:top-0 h-[calc(100vh-61px)] md:h-screen w-full md:w-64 bg-background border-r border-border p-6 flex flex-col z-40 transition-all duration-300 ${
           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="mb-12 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="SVK Logo" className="w-10 h-10 object-contain drop-shadow-sm min-w-[40px]" />
              <div className="font-display font-bold text-xl leading-none">
                SVK <span className="text-primary italic">ERP</span>
              </div>
           </div>
           
           <button onClick={() => setIsNotificationOpen(true)} className="relative p-2 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors md:hidden">
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
           </button>
        </div>

        <nav className="flex-grow space-y-2">
           {sidebarLinks.map((link) => (
             <Link
               key={link.path}
               to={link.path}
               onClick={() => setIsMobileMenuOpen(false)}
               className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                 location.pathname === link.path 
                 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold" 
                 : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
               }`}
             >
               <link.icon size={20} className="min-w-[20px]" />
               <span className="text-sm">{link.label}</span>
             </Link>
           ))}
        </nav>

        <div className="pt-6 border-t border-border mt-6">
           <button className="flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all font-bold">
              <LogOut size={20} className="min-w-[20px]" />
              <span className="text-sm">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 overflow-auto max-h-screen">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      {/* Global Modals */}
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  );
}
