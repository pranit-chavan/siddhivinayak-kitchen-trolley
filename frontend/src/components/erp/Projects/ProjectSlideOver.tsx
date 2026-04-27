import { X, Save, Ruler, User, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface ProjectSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any) => void;
  initialData?: any;
}

const furnitureTypes = [
  "Modular Kitchen",
  "Kitchen Trolleys",
  "Wardrobes",
  "Loft Cabinets",
  "TV Units",
  "Indian-Style Temples",
  "Custom Furniture"
];

const statuses = [
  "Inquiry",
  "Site Visit Done",
  "Design Ready",
  "Order Confirmed",
  "Manufacturing",
  "Installation Scheduled",
  "Completed"
];

export default function ProjectSlideOver({ isOpen, onClose, onSave, initialData }: ProjectSlideOverProps) {
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    address: "",
    city: "",
    type: furnitureTypes[0],
    status: "Inquiry",
    date: new Date().toISOString().split('T')[0],
    measurements: {
      width: "",
      height: "",
      depth: ""
    },
    notes: ""
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        customer: initialData?.name || "",
        phone: initialData?.phone || "",
        address: initialData?.location || "",
        city: "",
        type: furnitureTypes.includes(initialData?.interest) ? initialData?.interest : furnitureTypes[0],
        status: "Inquiry",
        date: new Date().toISOString().split('T')[0],
        measurements: { width: "", height: "", depth: "" },
        notes: initialData ? `Source: Web Portfolio Inquiry` : ""
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";
      
      // 1. Create Customer
      const customerRes = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.customer,
          phone: formData.phone,
          addressLine1: formData.address,
          city: formData.city,
          notes: formData.notes,
        })
      });
      if (!customerRes.ok) throw new Error("Failed to create customer");
      const customerData = await customerRes.json();

      // Status mapping to Prisma Enum
      const statusMap: Record<string, string> = {
        "Inquiry": "INQUIRY",
        "Site Visit Done": "SITE_VISIT",
        "Design Ready": "DESIGN",
        "Order Confirmed": "ORDER_CONFIRMED",
        "Manufacturing": "PRODUCTION",
        "Installation Scheduled": "INSTALLATION",
        "Completed": "COMPLETED"
      };
      
      const backendStatus = statusMap[formData.status] || "INQUIRY";

      // 2. Create Project
      const projectRes = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${formData.customer} - ${formData.type}`,
          scope: formData.notes || "New project created from ERP",
          furnitureType: formData.type,
          location: formData.city || formData.address.substring(0, 15) || "N/A",
          addressLine1: formData.address,
          city: formData.city,
          status: backendStatus,
          customerId: customerData.id,
          notes: formData.notes,
          startDate: formData.date ? new Date(formData.date).toISOString() : undefined,
        })
      });
      if (!projectRes.ok) throw new Error("Failed to create project");
      const projectData = await projectRes.json();
      
      // Re-map it slightly for the frontend table
      onSave({
        ...formData,
        id: projectData.code,
        location: projectData.location,
        type: projectData.furnitureType,
        status: formData.status, // keep frontend label for now
        date: formData.date,
        customer: formData.customer
      });
      
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Ensure backend is running.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-background border-l border-border shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div>
                <h2 className="text-xl font-display font-bold">New Project</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Manual Intake Form</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-8">
              
              {/* Customer Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <User size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Customer Discovery</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">Full Name *</label>
                    <input 
                      required
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      placeholder="e.g. Rahul Patil"
                      value={formData.customer}
                      onChange={(e) => setFormData({...formData, customer: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">Phone Number *</label>
                    <input 
                      required
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">Site Address</label>
                  <textarea 
                    rows={2}
                    className="w-full bg-muted/40 rounded-xl p-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all resize-none"
                    placeholder="Exact apartment/building and area..."
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">City/Area</label>
                  <input 
                    className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                    placeholder="e.g. Bhiwandi, Thane"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>

              {/* Project Specs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Project Specification</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">Furniture Type</label>
                    <select 
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      {furnitureTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground">Site Visit Date</label>
                    <input 
                      type="date"
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Ruler size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Room Measurements (cm)</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Width</label>
                    <input 
                      type="number"
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      placeholder="W"
                      value={formData.measurements.width}
                      onChange={(e) => setFormData({
                        ...formData, 
                        measurements: {...formData.measurements, width: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Height</label>
                    <input 
                      type="number"
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      placeholder="H"
                      value={formData.measurements.height}
                      onChange={(e) => setFormData({
                        ...formData, 
                        measurements: {...formData.measurements, height: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Depth</label>
                    <input 
                      type="number"
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      placeholder="D"
                      value={formData.measurements.depth}
                      onChange={(e) => setFormData({
                        ...formData, 
                        measurements: {...formData.measurements, depth: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Status & Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <FileText size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Internal Notes</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">Current Status</label>
                  <select 
                    className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all font-bold text-primary"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">Technician Notes</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-muted/40 rounded-xl p-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all resize-none"
                    placeholder="Specific requirements, laminate choices, or hardware requests..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>

            </form>

            {/* Footer Actions */}
            <div className="p-6 border-t border-border bg-muted/20 flex gap-4">
              <button 
                onClick={onClose}
                type="button"
                className="flex-1 h-12 border border-border rounded-xl font-bold hover:bg-muted transition-colors text-sm"
              >
                Discard
              </button>
              <button 
                onClick={handleSubmit}
                type="submit"
                className="flex-[2] h-12 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm"
              >
                <Save size={18} />
                Register Project
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
