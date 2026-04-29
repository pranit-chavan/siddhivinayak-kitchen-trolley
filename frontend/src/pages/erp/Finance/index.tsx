import AdminLayout from "@/components/erp/AdminLayout";
import PaymentSlideOver from "@/components/erp/Finance/PaymentSlideOver";
import { ArrowUpRight, ArrowDownRight, IndianRupee, FileText, Download, MoreVertical, CreditCard, Wallet, TrendingUp, TrendingDown, Plus, BarChart3, PieChart } from "lucide-react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const dummyPayments: any[] = [];

const chartData = [
  { name: 'Raw Materials', value: 45, color: '#6366f1' },
  { name: 'Workshop Labor', value: 25, color: '#a855f7' },
  { name: 'Net Profit', value: 30, color: '#10b981' },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export default function Finance() {
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalCollected: 0,
    totalOutstanding: 0,
    avgProjectValue: 0,
    netMargin: 32
  });
  const [loading, setLoading] = useState(true);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE}/finance/payments`),
        fetch(`${API_BASE}/finance/summary`)
      ]);
      
      const paymentsData = await paymentsRes.json();
      const summaryData = await summaryRes.json();
      
      if (Array.isArray(paymentsData)) setPayments(paymentsData);
      if (summaryData) {
        setSummary({
          totalCollected: summaryData.totalCollected || 0,
          totalOutstanding: summaryData.totalOutstanding || 0,
          avgProjectValue: summaryData.avgProjectValue || 0,
          netMargin: summaryData.netMargin || 32
        });
      }
    } catch (err) {
      console.error("Failed to fetch finance data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordPayment = () => {
    fetchData(); // Refresh all data when a new payment is saved
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Finance & Billing</h1>
          <p className="text-muted-foreground">Track payments, generate invoices, and monitor business profitability.</p>
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity"
        >
           <Plus size={20} />
           Record New Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
         <div className="bg-background rounded-3xl p-8 border border-border shadow-sm group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Total Collected (MTD)</p>
            <p className="text-3xl font-bold font-display text-green-700">₹{(summary.totalCollected/1000).toFixed(1)}K</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-600 font-bold">
               <ArrowUpRight size={14} /> Tracking live payments
            </div>
         </div>
          <div className="bg-background rounded-3xl p-8 border border-border shadow-sm group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
              <IndianRupee size={24} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Avg Project Value</p>
            <p className="text-3xl font-bold font-display text-blue-700">₹{(summary.avgProjectValue/1000).toFixed(1)}K</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 font-bold">
               <span className="opacity-80">Based on recent sales</span>
            </div>
         </div>
         <div className="bg-background rounded-3xl p-8 border border-border shadow-sm group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-2xl flex items-center justify-center mb-6">
              <Wallet size={24} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Total Outstanding</p>
            <p className="text-3xl font-bold font-display text-orange-700">₹{(summary.totalOutstanding/1000).toFixed(1)}K</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-orange-600 font-bold underline cursor-pointer">
               View All Pending Dues
            </div>
         </div>
         <div className="bg-background rounded-3xl p-8 border border-border shadow-sm group hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard size={24} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Net Margin (YTD)</p>
            <p className="text-3xl font-bold font-display text-purple-700">{summary.netMargin}%</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-purple-600 font-bold">
              <TrendingUp size={14} /> Efficiency improved
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Payments Ledger */}
        <div className="lg:col-span-2 bg-background rounded-[2.5rem] border border-border shadow-md overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between bg-muted/5">
            <div>
              <h3 className="font-bold font-display text-lg">Incoming Payments Ledger</h3>
              <p className="text-xs text-muted-foreground mt-1">Real-time credit tracking for SVK studio</p>
            </div>
            <button className="p-2 border border-border rounded-xl text-muted-foreground hover:text-primary transition-colors">
               <Download size={20} />
            </button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/10 text-[10px] uppercase tracking-widest font-black text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-8 py-5 text-left">Customer / Ref</th>
                  <th className="px-6 py-5 text-left">Type & Mode</th>
                  <th className="px-6 py-5 text-right">Amount Received</th>
                  <th className="px-8 py-5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-sm text-muted-foreground font-bold">
                        Loading financial records...
                      </td>
                    </tr>
                  ) : payments.length > 0 ? (
                    payments.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/5 group transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="font-bold text-foreground text-sm">{p.project?.customer?.name || "Ref: " + p.project?.code}</span>
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                {new Date(p.paymentDate).toLocaleDateString()}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex gap-2 items-center">
                              <span className="text-[9px] font-black bg-muted px-2 py-0.5 rounded uppercase tracking-tighter">{p.type}</span>
                              <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-tighter">{p.mode}</span>
                           </div>
                        </td>
                        <td className="px-6 py-6 text-right font-black text-green-700 text-base">₹{p.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-right">
                           <button className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-primary transition-all">
                              <MoreVertical size={16} />
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-sm text-muted-foreground font-bold">
                        No payments recorded yet.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* P&L Analysis Viz */}
        <div className="bg-background rounded-[2.5rem] border border-border shadow-md overflow-hidden flex flex-col">
           <div className="p-8 border-b border-border bg-muted/5">
              <h3 className="font-bold font-display text-lg flex items-center gap-2">
                 <PieChart className="text-primary" size={20} />
                 P&L Analysis
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Budget utilization per project avg</p>
           </div>
           <div className="p-8 flex-grow flex flex-col items-center justify-center">
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`${value}%`, 'Value']}
                      />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                         {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-full space-y-3 mt-4">
                 {chartData.map((item) => (
                   <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                      </div>
                      <span className="text-sm font-black">{item.value}%</span>
                   </div>
                 ))}
              </div>
           </div>
           <div className="p-6 bg-muted/10 border-t border-border mt-auto">
              <button className="w-full py-3 bg-white border border-border rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                 <FileText size={16} /> Download Monthly Report
              </button>
           </div>
        </div>
      </div>

      {/* Payment Slide Over */}
      <PaymentSlideOver 
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        onSave={handleRecordPayment}
      />
    </AdminLayout>
  );
}
