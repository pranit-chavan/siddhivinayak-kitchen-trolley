import AdminLayout from "@/components/erp/AdminLayout";
import { CheckCircle2, Factory, Package, Scissors, Droplet, Settings, ShieldCheck, Truck, MoreHorizontal, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

function Layers(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m2.6 12.08 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9" />
      <path d="m2.6 17.08 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9" />
    </svg>
  );
}

const PRODUCTION_STAGES = [
  { id: "material_ordered", label: "Material Ordered", icon: Package },
  { id: "material_received", label: "Material Received", icon: CheckCircle2 },
  { id: "cutting", label: "Cutting", icon: Scissors },
  { id: "lamination", label: "Lamination", icon: Layers },
  { id: "polishing", label: "Polishing", icon: Droplet },
  { id: "hardware", label: "Hardware Fitting", icon: Settings },
  { id: "qc", label: "Quality Check", icon: ShieldCheck },
  { id: "ready", label: "Ready for Delivery", icon: Truck },
];

const initialProduction: any[] = [];

export default function Production() {
  const [projects, setProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem("svk_projects");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("svk_projects", JSON.stringify(projects));
  }, [projects]);

  const toggleStage = (projectId: string, stageId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;

      const stageIndex = PRODUCTION_STAGES.findIndex(s => s.id === stageId);
      const isDone = p.completedStages.includes(stageId);

      // Un-mark: only allow removing the LAST completed stage (no skipping back)
      if (isDone) {
        const lastCompletedIndex = PRODUCTION_STAGES.findLastIndex(s =>
          p.completedStages.includes(s.id)
        );
        if (stageIndex !== lastCompletedIndex) return p; // can't remove a middle stage
        return { ...p, completedStages: p.completedStages.filter((s: string) => s !== stageId) };
      }

      // Mark done: only allow the NEXT stage in sequence
      const prevStage = PRODUCTION_STAGES[stageIndex - 1];
      if (stageIndex > 0 && !p.completedStages.includes(prevStage.id)) {
        return p; // previous stage not done yet
      }

      return { ...p, completedStages: [...p.completedStages, stageId] };
    }));
  };

  const calculatePercent = (completed: string[]) => {
    if (!completed) return 0;
    return Math.round((completed.length / PRODUCTION_STAGES.length) * 100);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Production Tracking</h1>
          <p className="text-muted-foreground">Monitor the manufacturing progress of every project.</p>
        </div>
        
        {/* Worker Stats Row */}
        <div className="flex gap-4">
           <div className="bg-background px-4 py-3 rounded-xl border border-border shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                 <Clock size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">In Progress</p>
                 <p className="text-sm font-bold">{projects.length} Projects</p>
              </div>
           </div>
           <div className="bg-background px-4 py-3 rounded-xl border border-border shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                 <Factory size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Stages</p>
                 <p className="text-sm font-bold">12 Tasks Today</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {projects.map((project) => {
          const percent = calculatePercent(project.completedStages);
          return (
            <div key={project.id} className="bg-background rounded-[2.5rem] border border-border shadow-xl shadow-muted/20 overflow-hidden group">
              {/* Card Header */}
              <div className="p-8 border-b border-border bg-muted/10 flex flex-col lg:flex-row justify-between gap-8 items-center transition-colors group-hover:bg-muted/20">
                 <div className="flex items-center gap-6 w-full lg:w-auto">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
                       <Factory size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold font-display text-foreground leading-none">{project.customer}</h2>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.15em] border ${percent === 100 ? "bg-green-100 text-green-700 border-green-200" : "bg-primary/5 text-primary border-primary/10"}`}>
                           {percent === 100 ? "READY" : "IN WORKSHOP"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                         <span className="font-bold text-primary">{project.id}</span>
                         <span className="opacity-30">|</span>
                         {project.type}
                      </p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-10 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Project Health</p>
                      <div className="flex items-center gap-3">
                         <div className="w-32 h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${percent}%` }} />
                         </div>
                         <p className="text-2xl font-bold text-primary font-display w-12">{percent}%</p>
                      </div>
                    </div>
                    <button className="p-2 border border-border rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                       <MoreHorizontal size={24} />
                    </button>
                 </div>
              </div>

              {/* Progress Stepper Tool */}
              <div className="p-10">
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 relative">
                    {/* Background Progress Line */}
                    <div className="absolute top-8 left-8 right-8 h-1 bg-muted rounded-full -z-10 hidden lg:block" />
                    
                    {PRODUCTION_STAGES.map((stage, idx) => {
                      const isCompleted = project.completedStages.includes(stage.id);
                      const isNext = !isCompleted && (idx === 0 || project.completedStages.includes(PRODUCTION_STAGES[idx-1].id));
                      
                      return (
                        <div key={stage.id} className="flex flex-col items-center group/step">
                           <button 
                             onClick={() => toggleStage(project.id, stage.id)}
                             className={`w-16 h-16 rounded-3xl mb-4 flex items-center justify-center border-2 transition-all duration-500 relative ${
                               isCompleted 
                               ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 rotate-[360deg]" 
                               : isNext
                               ? "bg-white border-primary border-dashed text-primary animate-pulse shadow-md"
                               : "bg-background border-border text-muted-foreground hover:border-primary/50"
                             }`}
                           >
                             <stage.icon size={28} className={`${isCompleted ? "scale-110" : ""}`} />
                             {isCompleted && (
                               <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                                  <CheckCircle2 size={12} className="text-white" />
                               </div>
                             )}
                           </button>
                           <h4 className={`text-[10px] font-black text-center uppercase tracking-[0.1em] leading-tight mb-2 h-8 flex items-center justify-center ${
                             isCompleted ? "text-foreground" : "text-muted-foreground opacity-60"
                           }`}>
                             {stage.label}
                           </h4>
                           <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${isCompleted ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground/50"}`}>
                             {isCompleted ? "VERIFIED" : "PENDING"}
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>

              {/* Status Footer */}
              <div className="px-10 py-6 bg-muted/5 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="hidden">
                     {/* Workshop team block removed as requested */}
                  </div>
                  <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full animate-pulse ${percent === 100 ? "bg-green-500" : "bg-amber-400"}`} />
                         <span className="text-[10px] uppercase font-black text-foreground tracking-widest">
                           {percent === 100 ? "Ready for Loading" : "Stage: " + (project.completedStages.length + 1) + " of 8"}
                         </span>
                      </div>
                      <button className="flex items-center gap-2 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                         View Design Docs <ArrowRight size={14} />
                      </button>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
