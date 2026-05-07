import AdminLayout from "@/components/erp/AdminLayout";
import { useEffect, useState } from "react";
import { Search, Filter, Phone, MapPin, CheckCircle, Clock } from "lucide-react";

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/leads`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating status.");
    }
  };

  const filteredLeads = leads.filter(l => 
    l.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.phone?.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "NEW": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={12} /> New Inquiry</span>;
      case "CONTACTED": return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Phone size={12} /> Contacted</span>;
      case "CONVERTED": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle size={12} /> Converted</span>;
      case "LOST": return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">Lost</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Website Inquiries</h1>
          <p className="text-muted-foreground">Manage leads generated directly from your website's contact forms and products.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Total Inquiries</p>
            <p className="text-3xl font-bold font-display">{leads.length}</p>
         </div>
         <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">New</p>
            <p className="text-3xl font-bold font-display text-blue-600">
              {leads.filter(l => l.status === "NEW").length}
            </p>
         </div>
         <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Contacted</p>
            <p className="text-3xl font-bold font-display text-yellow-600">
              {leads.filter(l => l.status === "CONTACTED").length}
            </p>
         </div>
         <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Converted</p>
            <p className="text-3xl font-bold font-display text-green-600">
              {leads.filter(l => l.status === "CONVERTED").length}
            </p>
         </div>
      </div>

      <div className="bg-background rounded-3xl border border-border shadow-md overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="w-full md:w-96 relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
               placeholder="Search by Name or Phone..." 
               className="w-full h-11 bg-muted/40 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <Filter size={18} />
              Filter
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 text-[10px] uppercase tracking-widest font-bold text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-5 text-left">Date</th>
                <th className="px-6 py-5 text-left">Customer Info</th>
                <th className="px-6 py-5 text-left">Product Interest</th>
                <th className="px-6 py-5 text-left">Message / Notes</th>
                <th className="px-6 py-5 text-left">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-6 text-sm text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{lead.fullName}</span>
                        <span className="text-sm font-semibold text-primary">{lead.phone}</span>
                        {lead.location && <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={10} /> {lead.location}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-semibold">{lead.interest || "General Inquiry"}</span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm text-muted-foreground max-w-xs truncate" title={lead.notes}>
                        {lead.notes || "No message"}
                      </p>
                    </td>
                    <td className="px-6 py-6">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="px-6 py-6 text-right">
                      <select 
                        className="text-xs bg-muted/50 border border-border rounded-lg px-2 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      >
                        <option value="NEW">Mark as New</option>
                        <option value="CONTACTED">Mark as Contacted</option>
                        <option value="CONVERTED">Mark as Converted</option>
                        <option value="LOST">Mark as Lost</option>
                      </select>
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
