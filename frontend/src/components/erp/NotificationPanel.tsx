import { X, CheckCircle2, User, Phone, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const dummyLeads = [
  {
    id: "LEAD-001",
    name: "Vikram Jadhav",
    phone: "9876543210",
    location: "Kothrud",
    interest: "Modular Kitchen",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "LEAD-002",
    name: "Sneha Sharma",
    phone: "8899776655",
    location: "Baner",
    interest: "Wardrobe & Kitchen",
    timestamp: "2 hours ago",
    read: false,
  }
];

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [leads, setLeads] = useState(dummyLeads);
  const navigate = useNavigate();

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLeads(leads.map(l => l.id === id ? { ...l, read: true } : l));
  };

  const convertToProject = (id: string) => {
    // Find the lead data
    const leadData = leads.find(l => l.id === id);
    
    // Mark as read in local state
    setLeads(leads.map(l => l.id === id ? { ...l, read: true } : l));
    
    // In a real app, this would shift the data to the Projects database
    onClose();
    
    // Pass the lead payload to the Projects page via Router state
    navigate("/admin/projects", { state: { newLead: leadData } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div>
                <h2 className="text-xl font-display font-bold">Inbox & Leads</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1 text-primary">Website Inquiries</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {leads.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                    <CheckCircle2 size={40} className="mb-4" />
                    <p className="font-bold">You're all caught up!</p>
                    <p className="text-xs">No new web inquiries.</p>
                 </div>
              ) : (
                leads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${lead.read ? 'bg-background border-border shadow-sm opacity-60' : 'bg-primary/5 border-primary/30 shadow-md shadow-primary/5'}`}
                    onClick={() => convertToProject(lead.id)}
                  >
                    {!lead.read && (
                       <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                    
                    <div className="flex justify-between items-start mb-3">
                       <h3 className="font-bold font-display text-sm flex items-center gap-2">
                          <User size={14} className="text-muted-foreground" />
                          {lead.name}
                       </h3>
                       <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{lead.timestamp}</span>
                    </div>

                    <div className="space-y-1 mb-4">
                       <p className="text-xs flex items-center gap-2 text-muted-foreground"><Phone size={12} /> {lead.phone}</p>
                       <p className="text-xs flex items-center gap-2 text-muted-foreground"><MapPin size={12} /> {lead.location}</p>
                       <p className="text-xs flex items-center gap-2 font-bold text-foreground mt-2 px-2 py-1 bg-muted rounded-md inline-block">
                          {lead.interest}
                       </p>
                    </div>

                    <div className="flex gap-2 relative z-10">
                       {!lead.read && (
                         <button 
                           onClick={(e) => markAsRead(lead.id, e)}
                           className="flex-1 py-2 rounded-lg border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                         >
                            Mark Read
                         </button>
                       )}
                       <button 
                         onClick={(e) => { e.stopPropagation(); convertToProject(lead.id); }}
                         className="flex-[2] py-2 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm"
                       >
                          Convert to Project
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-border bg-muted/10 text-center">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bridged via Web Portfolio</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
