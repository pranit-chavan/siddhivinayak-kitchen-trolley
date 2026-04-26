import AdminLayout from "@/components/erp/AdminLayout";
import { Plus, Trash2, FileText, Download, Share2, IndianRupee, Printer, Calculator, ArrowLeft, Save, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LineItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  unit: string;
  rate: number;
}

const CATEGORIES = ["Plywood", "Laminate", "Hardware", "S.S. Accessories", "Glass/Mirror", "Labor", "Transport", "Other"];

const initialQuotations = [
  {
    id: "QUO-SVK-2501",
    customer: "Meera Kulkarni",
    amount: "₹1,45,000",
    date: "2025-04-01",
    status: "Sent",
  },
  {
    id: "QUO-SVK-2502",
    customer: "Amit Wagh",
    amount: "₹65,000",
    date: "2025-04-03",
    status: "Draft",
  },
];

export default function Quotation() {
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", name: "18mm BWR Plywood (Base Units)", category: "Plywood", qty: 1, unit: "sqft", rate: 0 },
  ]);

  const subtotal = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  }, [lineItems]);

  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      category: "Hardware",
      qty: 1,
      unit: "nos",
      rate: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  if (!isCreating) {
    return (
      <AdminLayout>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Quotation Builder</h1>
            <p className="text-muted-foreground">Replacing manual Excel sheets with precise digital logic.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity"
          >
             <Plus size={20} />
             New Quote
          </button>
        </div>

        <div className="bg-background rounded-3xl border border-border shadow-md h-[400px] flex items-center justify-center text-center p-12">
           <div className="max-w-md">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <Calculator size={40} />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Start A Professional Quote</h2>
              <p className="text-muted-foreground mb-8">Click the button above to launch the interactive builder. You can pull measurements from active SVK projects or build from scratch.</p>
           </div>
        </div>

        <div className="mt-12 bg-background rounded-3xl border border-border shadow-md overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
             <h3 className="font-bold font-display text-lg">Recent Quotations</h3>
             <div className="flex bg-muted/50 p-1 rounded-lg gap-1">
               <button onClick={() => setActiveTab("all")} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "all" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>All</button>
               <button onClick={() => setActiveTab("draft")} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "draft" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>Drafts</button>
               <button onClick={() => setActiveTab("sent")} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === "sent" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>Sent</button>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 text-[10px] uppercase tracking-widest font-bold text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-8 py-5 text-left">Quote ID</th>
                  <th className="px-6 py-5 text-left">Customer</th>
                  <th className="px-6 py-5 text-left">Total Value</th>
                  <th className="px-6 py-5 text-left">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {initialQuotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-8 py-6">
                      <span className="font-bold text-foreground font-display">{quote.id}</span>
                    </td>
                    <td className="px-6 py-6 font-bold">{quote.customer}</td>
                    <td className="px-6 py-6 font-bold text-primary">{quote.amount}</td>
                    <td className="px-6 py-6 font-bold text-primary">
                       <span className={`px-2 py-0.5 rounded-lg text-[10px] ${quote.status === "Sent" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{quote.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-2 border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors" title="Download PDF">
                          <Download size={16} />
                        </button>
                        <button className="p-2 border border-border rounded-lg text-muted-foreground hover:text-green-600 transition-colors" title="Share via WhatsApp">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 font-sans">
        <button 
          onClick={() => setIsCreating(false)}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
               <Sparkles size={12} /> Live Drafting Engine
            </div>
            <h1 className="text-3xl font-display font-bold">New Quotation</h1>
            <p className="text-muted-foreground">Draft ID: <span className="font-bold text-foreground underline decoration-primary/30 text-xs">QUO-SVK-{String(new Date().getFullYear()).slice(2)}-{Math.floor(100+Math.random()*900)}</span></p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-all flex items-center gap-2 text-sm">
                <Save size={18} />
                Save Draft
             </button>
             <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20 text-sm">
                <Printer size={18} />
                Preview PDF
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Line Items Builder */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-background rounded-[2.5rem] border border-border shadow-xl overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
                 <h3 className="font-bold font-display uppercase tracking-widest text-[11px] text-muted-foreground">Line Items & Measurements</h3>
                 <button onClick={addLineItem} className="flex items-center gap-2 text-xs font-black text-primary hover:opacity-80 transition-opacity">
                    <Plus size={16} /> ADD ROW
                 </button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-muted/5 text-[10px] uppercase font-black text-muted-foreground border-b border-border/50">
                       <tr>
                          <th className="px-6 py-4 text-left">Category</th>
                          <th className="px-6 py-4 text-left">Description</th>
                          <th className="px-4 py-4 text-center w-20">Qty</th>
                          <th className="px-6 py-4 text-right w-32">Rate (₹)</th>
                          <th className="px-6 py-4 text-right w-32">Total (₹)</th>
                          <th className="px-4 py-4 w-10"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                       <AnimatePresence>
                          {lineItems.map((item) => (
                             <motion.tr 
                               layout
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               exit={{ opacity: 0, scale: 0.95 }}
                               key={item.id} 
                               className="hover:bg-muted/5 transition-colors"
                             >
                                <td className="px-6 py-4">
                                   <select 
                                     className="bg-muted/30 border-none rounded-lg text-[10px] font-bold p-2 focus:ring-1 focus:ring-primary outline-none"
                                     value={item.category}
                                     onChange={(e) => updateItem(item.id, "category", e.target.value)}
                                   >
                                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                   </select>
                                </td>
                                <td className="px-6 py-4">
                                   <input 
                                     className="w-full bg-transparent border-b border-transparent focus:border-primary/30 outline-none text-xs font-medium transition-all"
                                     placeholder="Item description..."
                                     value={item.name}
                                     onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                   />
                                </td>
                                <td className="px-4 py-4">
                                   <input 
                                     type="number"
                                     className="w-full bg-muted/20 border-none rounded-lg text-center text-sm font-bold p-2 outline-none"
                                     value={item.qty}
                                     onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                                   />
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <input 
                                     type="number"
                                     className="w-full bg-muted/20 border-none rounded-lg text-right text-sm font-bold p-2 outline-none"
                                     value={item.rate}
                                     onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                                   />
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-black text-foreground">
                                   ₹{(item.qty * item.rate).toLocaleString()}
                                </td>
                                <td className="px-4 py-4">
                                   <button 
                                     onClick={() => removeItem(item.id)}
                                     className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                                   >
                                      <Trash2 size={14} />
                                   </button>
                                </td>
                             </motion.tr>
                          ))}
                       </AnimatePresence>
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Right: Financial Summary */}
        <div className="space-y-6">
           <div className="bg-primary text-primary-foreground rounded-[2.5rem] p-8 shadow-xl shadow-primary/30 relative overflow-hidden group">
              <IndianRupee className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
              
              <h3 className="font-bold uppercase tracking-[0.2em] text-[10px] opacity-80 mb-8">Quote Summary</h3>
              
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-4">
                    <span className="text-sm font-medium opacity-80">Subtotal</span>
                    <span className="text-lg font-display font-bold">₹{subtotal.toLocaleString()}</span>
                 </div>
                 
                 <div className="flex justify-between items-center border-b border-primary-foreground/20 pb-4">
                    <div className="flex flex-col">
                       <span className="text-xs font-medium opacity-80">Output GST</span>
                       <span className="text-[10px] font-black">STANDARD 18%</span>
                    </div>
                    <span className="text-lg font-display font-bold">₹{gst.toLocaleString()}</span>
                 </div>

                 <div className="pt-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 text-center">Grand Total Payable</p>
                    <div className="text-4xl font-display font-bold text-center drop-shadow-lg">
                       ₹{grandTotal.toLocaleString()}
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-background rounded-[2rem] p-8 border border-border shadow-sm">
              <h4 className="font-bold text-xs mb-6 uppercase tracking-widest">Actions</h4>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => {
                     import("@/lib/whatsapp").then(({ openWhatsApp, buildQuotationMessage }) => {
                       const msg = buildQuotationMessage({ customer: "Valued Customer", type: lineItems[0]?.category || "Furniture" });
                       openWhatsApp(msg);
                     });
                   }}
                   className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200/50"
                 >
                    <Share2 size={20} />
                    <span className="text-[8px] font-black uppercase">WhatsApp</span>
                 </button>
                 <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200/50">
                    <Download size={20} />
                    <span className="text-[8px] font-black uppercase">Export PDF</span>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
