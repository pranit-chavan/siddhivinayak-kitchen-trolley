import AdminLayout from "@/components/erp/AdminLayout";
import { Plus, Trash2, FileText, Download, Share2, IndianRupee, Printer, Calculator, ArrowLeft, Save, Sparkles, ChevronDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export default function Quotation() {
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [saving, setSaving] = useState(false);

  // All real projects from backend
  const [projects, setProjects] = useState<any[]>([]);
  // Quotations from backend
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loadingQuotations, setLoadingQuotations] = useState(true);

  // Selected project for new quotation
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", name: "18mm BWR Plywood (Base Units)", category: "Plywood", qty: 1, unit: "sqft", rate: 0 },
  ]);

  // Fetch all projects for the dropdown
  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(console.error);
  }, []);

  // Fetch all quotations
  const fetchQuotations = () => {
    setLoadingQuotations(true);
    fetch(`${API_BASE}/quotations`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setQuotations(data);
      })
      .catch(console.error)
      .finally(() => setLoadingQuotations(false));
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // When project selection changes, load its full details
  const handleProjectSelect = async (projectId: string) => {
    setSelectedProjectId(projectId);
    if (!projectId) { setSelectedProject(null); return; }
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}`);
      const data = await res.json();
      setSelectedProject(data);
    } catch { setSelectedProject(null); }
  };

  const subtotal = useMemo(() => lineItems.reduce((acc, item) => acc + (item.qty * item.rate), 0), [lineItems]);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: Math.random().toString(36).substr(2, 9),
      name: "", category: "Hardware", qty: 1, unit: "nos", rate: 0
    }]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => setLineItems(lineItems.filter(item => item.id !== id));

  const handleSaveDraft = async () => {
    if (!selectedProjectId) { alert("Please select a project first."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectId,
          items: lineItems.map(item => ({
            name: item.name,
            category: item.category,
            qty: item.qty,
            unit: item.unit,
            rate: item.rate,
            total: item.qty * item.rate,
          })),
          subtotal,
          gstPercent: 18,
          grandTotal,
        })
      });
      if (!res.ok) throw new Error("Failed to save quotation");
      alert("Quotation saved successfully!");
      setIsCreating(false);
      fetchQuotations();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredQuotations = quotations.filter(q => {
    if (activeTab === "draft") return q.status === "DRAFT";
    if (activeTab === "sent") return q.status === "SENT";
    return true;
  });

  if (!isCreating) {
    return (
      <AdminLayout>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Quotation Builder</h1>
            <p className="text-muted-foreground">Build precise quotations linked directly to your active projects.</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            <Plus size={20} /> New Quote
          </button>
        </div>

        <div className="bg-background rounded-3xl border border-border shadow-md overflow-hidden">
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
                  <th className="px-6 py-5 text-left">Project</th>
                  <th className="px-6 py-5 text-left">Customer</th>
                  <th className="px-6 py-5 text-left">Total Value</th>
                  <th className="px-6 py-5 text-left">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loadingQuotations ? (
                  <tr><td colSpan={6} className="px-8 py-12 text-center text-sm text-muted-foreground font-bold">Loading quotations...</td></tr>
                ) : filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Calculator size={32} /></div>
                        <p className="text-sm text-muted-foreground font-bold">No quotations yet. Click <span className="text-primary">New Quote</span> to build one.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map(quote => (
                    <tr key={quote.id} className="hover:bg-muted/5 transition-colors">
                      <td className="px-8 py-6"><span className="font-bold text-foreground font-display">{quote.code}</span></td>
                      <td className="px-6 py-6 text-sm font-bold text-primary">{quote.project?.code || "—"}</td>
                      <td className="px-6 py-6 font-bold">{quote.project?.customer?.name || "—"}</td>
                      <td className="px-6 py-6 font-bold text-primary">₹{Number(quote.grandTotal || 0).toLocaleString()}</td>
                      <td className="px-6 py-6">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${quote.status === "SENT" || quote.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="p-2 border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors" title="Download PDF"><Download size={16} /></button>
                          <button className="p-2 border border-border rounded-lg text-muted-foreground hover:text-green-600 transition-colors" title="Share via WhatsApp"><Share2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
        <button onClick={() => setIsCreating(false)} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
              <Sparkles size={12} /> Live Drafting Engine
            </div>
            <h1 className="text-3xl font-display font-bold">New Quotation</h1>
            {selectedProject ? (
              <p className="text-muted-foreground mt-1">
                For: <span className="font-bold text-foreground">{selectedProject.customer?.name}</span> — <span className="text-primary text-xs font-bold">{selectedProject.code}</span>
              </p>
            ) : (
              <p className="text-muted-foreground">Select a project below to begin.</p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-6 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Draft"}
            </button>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20 text-sm">
              <Printer size={18} /> Preview PDF
            </button>
          </div>
        </div>
      </div>

      {/* Project Selector Banner */}
      <div className="mb-8 bg-background border border-border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Link to Project</p>
            <p className="text-xs text-muted-foreground">This quotation will be saved under the selected project.</p>
          </div>
        </div>
        <div className="relative flex-1 min-w-[260px]">
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <select
            value={selectedProjectId}
            onChange={(e) => handleProjectSelect(e.target.value)}
            className="w-full h-12 bg-muted/40 rounded-xl px-4 pr-10 text-sm font-bold border border-transparent focus:border-primary focus:outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="">— Select a Project —</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.customer?.name} ({p.furnitureType})
              </option>
            ))}
          </select>
        </div>
        {selectedProject && (
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-primary/10 text-primary">{selectedProject.status?.replace("_", " ")}</span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-muted text-muted-foreground">{selectedProject.furnitureType}</span>
          </div>
        )}
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
                    {lineItems.map(item => (
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
                          <button onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors">
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
                <div className="text-4xl font-display font-bold text-center drop-shadow-lg">₹{grandTotal.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-[2rem] p-8 border border-border shadow-sm">
            <h4 className="font-bold text-xs mb-6 uppercase tracking-widest">Actions</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  import("@/lib/whatsapp").then(({ openWhatsAppForCustomer, buildQuotationMessage }) => {
                    const phone = selectedProject?.customer?.phone;
                    const msg = buildQuotationMessage(selectedProject || { customer: "Valued Customer", type: lineItems[0]?.category || "Furniture" });
                    if (phone) openWhatsAppForCustomer(phone, msg);
                    else alert("No customer phone found. Please link a project first.");
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
