import AdminLayout from "@/components/erp/AdminLayout";
import ProjectSlideOver from "@/components/erp/Projects/ProjectSlideOver";
import { Plus, Search, Filter, MessageCircle, ExternalLink, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const initialProjects: any[] = [];

const statusStyles: Record<string, string> = {
  "Inquiry": "bg-blue-100 text-blue-700",
  "Site Visit Done": "bg-purple-100 text-purple-700",
  "Design Ready": "bg-yellow-100 text-yellow-700",
  "Order Confirmed": "bg-orange-100 text-orange-700",
  "Manufacturing": "bg-indigo-100 text-indigo-700",
  "Installation Scheduled": "bg-cyan-100 text-cyan-700",
  "Completed": "bg-green-100 text-green-700",
};

export default function Projects() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [projectList, setProjectList] = useState<any[]>([]);
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            id: p.code,
            customer: p.customer?.name || "Unknown Customer",
            location: p.location || "N/A",
            type: p.furnitureType || "Custom",
            status: mapBackendStatusToFrontend(p.status),
            date: new Date(p.createdAt).toISOString().split('T')[0]
          }));
          setProjectList(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch projects", err));
  }, []);

  const mapBackendStatusToFrontend = (backendStatus: string) => {
    const map: Record<string, string> = {
      "INQUIRY": "Inquiry",
      "SITE_VISIT": "Site Visit Done",
      "DESIGN": "Design Ready",
      "ORDER_CONFIRMED": "Order Confirmed",
      "PRODUCTION": "Manufacturing",
      "INSTALLATION": "Installation Scheduled",
      "COMPLETED": "Completed"
    };
    return map[backendStatus] || "Inquiry";
  };

  useEffect(() => {
    // If we navigated here from the Notification Lead Converter, auto-open the form
    if (location.state?.newLead) {
      setLeadData(location.state.newLead);
      setIsSlideOverOpen(true);
      
      // Clear the state so it doesn't pop open again simply on a refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [leadData, setLeadData] = useState<any>(null);

  const filteredProjects = projectList.filter(p => 
    p.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = (newProject: any) => {
    setProjectList([newProject, ...projectList]);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Projects Module</h1>
          <p className="text-muted-foreground">Manage all active and completed furniture projects.</p>
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity"
        >
           <Plus size={20} />
           New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Total Active</p>
            <p className="text-3xl font-bold font-display">{projectList.length}</p>
         </div>
         <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">In Production</p>
            <p className="text-3xl font-bold font-display text-indigo-600">
              {projectList.filter(p => p.status === "Manufacturing").length}
            </p>
         </div>
         <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Pending Visits</p>
            <p className="text-3xl font-bold font-display text-purple-600">
              {projectList.filter(p => p.status === "Site Visit Done").length}
            </p>
         </div>
         <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Completed</p>
            <p className="text-3xl font-bold font-display text-green-600">
              {projectList.filter(p => p.status === "Completed").length}
            </p>
         </div>
      </div>

      <div className="bg-background rounded-3xl border border-border shadow-md overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="w-full md:w-96 relative">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
               placeholder="Search by ID or Customer..." 
               className="w-full h-11 bg-muted/40 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
           <button className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <Filter size={18} />
              Filter Status
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 text-[10px] uppercase tracking-widest font-bold text-muted-foreground border-b border-border">
              <tr>
                <th className="px-8 py-5 text-left">Project ID</th>
                <th className="px-6 py-5 text-left">Customer</th>
                <th className="px-6 py-5 text-left">Furniture Type</th>
                <th className="px-6 py-5 text-left">Current Status</th>
                <th className="px-6 py-5 text-left">Inquiry Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-muted/5 transition-colors">
                  <td className="px-8 py-6">
                    <span className="font-bold text-primary font-display">{project.id}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{project.customer}</span>
                      <span className="text-xs text-muted-foreground">{project.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm">{project.type}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[project.status] || "bg-muted"}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm text-muted-foreground">
                    {project.date}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg transition-colors border border-border/50" title="Manage Status">
                        <Settings size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          import("@/lib/whatsapp").then(({ openWhatsApp, buildOrderConfirmationMessage }) => {
                            const msg = buildOrderConfirmationMessage(project);
                            openWhatsApp(msg);
                          });
                        }}
                        className="p-2 bg-muted hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors border border-border/50" 
                        title="Send WhatsApp Tracker"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <Link to={`/track/${project.id}`} target="_blank" className="p-2 bg-muted hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors border border-border/50" title="View Tracker Page">
                        <ExternalLink size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Component */}
      <ProjectSlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => {
          setIsSlideOverOpen(false);
          // Optional delay allows closing animation before wiping data
          setTimeout(() => setLeadData(null), 300);
        }}
        onSave={handleAddProject}
        initialData={leadData}
      />
    </AdminLayout>
  );
}
