import { X, Save, Ruler, User, Phone, MapPin, Calendar, FileText, Trash2, Plus } from "lucide-react";
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
    measurements: [
      { name: "Main Kitchen Counter", width: "", height: "", depth: "" }
    ],
    notes: ""
  });

  useEffect(() => {
    if (isOpen) {
      const isEditMode = !!initialData?.id;

      setFormData({
        // Edit mode: initialData.customer is the name string
        // Lead mode: initialData.name is the name string
        customer: initialData?.customer || initialData?.name || "",

        phone: initialData?.phone || "",

        // Edit mode: initialData.address is addressLine1
        // Lead mode: initialData.location is the address
        address: initialData?.address || initialData?.location || "",

        // Edit mode: initialData.city; Lead mode: no city field
        city: initialData?.city || "",

        // Edit mode: initialData.type is the furnitureType string
        // Lead mode: initialData.interest is the interest string
        type: initialData?.type
          || (furnitureTypes.includes(initialData?.interest) ? initialData?.interest : furnitureTypes[0]),

        // Edit mode: preserve real status; Lead mode: always start at Inquiry
        status: isEditMode ? (initialData?.status || "Inquiry") : "Inquiry",

        // Edit mode: preserve real date; Lead mode: today
        date: isEditMode
          ? (initialData?.date || new Date().toISOString().split('T')[0])
          : new Date().toISOString().split('T')[0],

        measurements: initialData?.measurements || [{ name: "Main Kitchen Counter", width: "", height: "", depth: "" }],

        // Edit mode: show real notes; Lead mode: auto-fill source tag
        notes: isEditMode
          ? (initialData?.notes || "")
          : (initialData ? `Source: Web Portfolio Inquiry` : ""),
      });
    }
  }, [isOpen, initialData]);

  const isEditing = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";
      const isEditing = !!initialData?.id;
      
      let customerId = initialData?.customerId;
      
      // 1. Create or Update Customer
      const customerRes = await fetch(`${API_BASE}/customers${isEditing ? `/${customerId}` : ""}`, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.customer,
          phone: formData.phone,
          addressLine1: formData.address,
          city: formData.city,
          notes: formData.notes,
        })
      });
      if (!customerRes.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} customer`);
      const customerData = await customerRes.json();
      if (!isEditing) customerId = customerData.id;

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

      // 2. Create or Update Project
      const projectRes = await fetch(`${API_BASE}/projects${isEditing ? `/${initialData.id}` : ""}`, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${formData.customer} - ${formData.type}`,
          scope: formData.notes || "Project details updated from ERP",
          furnitureType: formData.type,
          location: formData.city || formData.address.substring(0, 15) || "N/A",
          addressLine1: formData.address,
          city: formData.city,
          status: backendStatus,
          customerId: customerId,
          notes: formData.notes,
          startDate: formData.date ? new Date(formData.date).toISOString() : undefined,
        })
      });
      if (!projectRes.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} project`);
      const projectData = await projectRes.json();
      
      // 3. Save Measurements (always creates a new version/record linked to project)
      const validMeasurements = formData.measurements.filter(m => m.name && m.width && m.height && m.depth);
      if (validMeasurements.length > 0) {
        await fetch(`${API_BASE}/projects/${isEditing ? initialData.id : projectData.id}/measurements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rooms: validMeasurements.map(m => ({
              name: m.name,
              width: parseInt(m.width, 10) || 0,
              height: parseInt(m.height, 10) || 0,
              depth: parseInt(m.depth, 10) || 0,
            }))
          })
        });
      }

      // Re-map it slightly for the frontend table
      onSave({
        ...formData,
        id: isEditing ? (projectData.code || initialData.id) : projectData.code,
        realId: isEditing ? initialData.id : projectData.id,
        location: projectData.location,
        type: projectData.furnitureType,
        status: formData.status, 
        backendStatus: backendStatus,
        date: formData.date,
        customer: formData.customer,
        phone: formData.phone
      });
      
      onClose();
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} project:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} project. Check console for details.`);
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
                <h2 className="text-xl font-display font-bold">{isEditing ? "Edit Project" : "New Project"}</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
                  {isEditing ? `Editing Project ${initialData.id}` : "Manual Intake Form"}
                </p>
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
                  <h3 className="font-bold text-sm uppercase tracking-wider">Room Measurements (MM)</h3>
                </div>
                
                {formData.measurements.map((measurement, index) => (
                  <div key={index} className="space-y-3 p-4 bg-muted/20 rounded-2xl border border-border/50 relative">
                    {formData.measurements.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => {
                          const newMeasurements = [...formData.measurements];
                          newMeasurements.splice(index, 1);
                          setFormData({...formData, measurements: newMeasurements});
                        }}
                        className="absolute right-3 top-3 text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    
                    <div className="space-y-2 pr-8">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Measurement Name</label>
                      <input 
                        className="w-full h-10 bg-background rounded-lg px-3 text-sm border border-border focus:border-primary focus:outline-none transition-all"
                        placeholder="e.g. Wardrobe, Kitchen Island"
                        value={measurement.name}
                        onChange={(e) => {
                          const newM = [...formData.measurements];
                          newM[index].name = e.target.value;
                          setFormData({...formData, measurements: newM});
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Width</label>
                        <input 
                          type="number"
                          className="w-full h-10 bg-background rounded-lg px-3 text-sm border border-border focus:border-primary focus:outline-none transition-all"
                          placeholder="W"
                          value={measurement.width}
                          onChange={(e) => {
                            const newM = [...formData.measurements];
                            newM[index].width = e.target.value;
                            setFormData({...formData, measurements: newM});
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Height</label>
                        <input 
                          type="number"
                          className="w-full h-10 bg-background rounded-lg px-3 text-sm border border-border focus:border-primary focus:outline-none transition-all"
                          placeholder="H"
                          value={measurement.height}
                          onChange={(e) => {
                            const newM = [...formData.measurements];
                            newM[index].height = e.target.value;
                            setFormData({...formData, measurements: newM});
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Depth</label>
                        <input 
                          type="number"
                          className="w-full h-10 bg-background rounded-lg px-3 text-sm border border-border focus:border-primary focus:outline-none transition-all"
                          placeholder="D"
                          value={measurement.depth}
                          onChange={(e) => {
                            const newM = [...formData.measurements];
                            newM[index].depth = e.target.value;
                            setFormData({...formData, measurements: newM});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData, 
                      measurements: [...formData.measurements, { name: "", width: "", height: "", depth: "" }]
                    });
                  }}
                  className="w-full py-3 border border-dashed border-primary text-primary rounded-xl text-sm font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Another Measurement
                </button>
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
                {isEditing ? "Save Changes" : "Register Project"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
