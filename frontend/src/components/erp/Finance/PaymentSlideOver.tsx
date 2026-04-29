import { X, Save, IndianRupee, CreditCard, User, Hash, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface PaymentSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: any) => void;
}

const paymentModes = ["UPI", "CASH", "BANK TRANSFER", "CHEQUE"];
const paymentTypes = ["Advance", "Partial", "Final Balance", "Other"];

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export default function PaymentSlideOver({ isOpen, onClose, onSave }: PaymentSlideOverProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    projectId: "",
    amount: "",
    mode: "UPI",
    type: "Advance",
    date: new Date().toISOString().split('T')[0],
    reference: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE}/finance/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectCode: formData.projectId, // Backend uses projectCode to link
          amount: parseFloat(formData.amount),
          paymentDate: new Date(formData.date).toISOString(),
          mode: formData.mode,
          type: formData.type.toUpperCase().replace(" ", "_"), // Match Prisma Enum (ADVANCE, PARTIAL, etc)
          reference: formData.reference,
          notes: `Recorded for ${formData.customer}`
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to record payment");
      }

      onSave(await res.json());
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
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
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div>
                <h2 className="text-xl font-display font-bold">Record Payment</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1 text-primary">Incoming Credit</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-8">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <User size={18} />
                  <h3 className="font-bold text-[11px] uppercase tracking-widest">Payer Information</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground">Customer Name</label>
                  <input 
                    required
                    className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                    placeholder="e.g. Sunita Patil"
                    value={formData.customer}
                    onChange={(e) => setFormData({...formData, customer: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground">Project ID (Optional)</label>
                  <div className="relative">
                    <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      className="w-full h-11 bg-muted/40 rounded-xl pl-10 pr-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      placeholder="SVK-2025-XXX"
                      value={formData.projectId}
                      onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <IndianRupee size={18} />
                  <h3 className="font-bold text-[11px] uppercase tracking-widest">Transaction Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground">Amount (₹)</label>
                    <input 
                      required
                      type="number"
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm font-bold border border-transparent focus:border-primary focus:outline-none transition-all text-primary"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground">Payment Date</label>
                    <input 
                      type="date"
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground">Payment Mode</label>
                    <select 
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      value={formData.mode}
                      onChange={(e) => setFormData({...formData, mode: e.target.value})}
                    >
                      {paymentModes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground">Payment Type</label>
                    <select 
                      className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      {paymentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground">Ref No / Transaction ID</label>
                  <input 
                    className="w-full h-11 bg-muted/40 rounded-xl px-4 text-sm border border-transparent focus:border-primary focus:outline-none transition-all"
                    placeholder="e.g. TXN99283..."
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                  />
                </div>
              </div>

            </form>

            <div className="p-6 border-t border-border bg-muted/20 flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 h-12 border border-border rounded-xl font-bold hover:bg-muted transition-all text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] h-12 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Save Transaction
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
