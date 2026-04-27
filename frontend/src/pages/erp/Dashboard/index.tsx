import AdminLayout from "@/components/erp/AdminLayout";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Factory,
  FileText,
  IndianRupee,
  Layout,
  Scissors,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { FIRM_NAME, OWNER_NAME } from "@/data/constants";

const quickStats = [
  {
    label: "Active Projects",
    value: "0",
    change: "No new activity",
    icon: FolderKanban,
    color: "text-blue-700 bg-blue-100",
    link: "/admin/projects",
  },
  {
    label: "In Production",
    value: "0",
    change: "Workshop idle",
    icon: Factory,
    color: "text-indigo-700 bg-indigo-100",
    link: "/admin/production",
  },
  {
    label: "Pending Quotes",
    value: "0",
    change: "None pending",
    icon: FileText,
    color: "text-orange-700 bg-orange-100",
    link: "/admin/quotation",
  },
  {
    label: "Monthly Revenue",
    value: "₹0.00",
    change: "Month starting",
    icon: IndianRupee,
    color: "text-green-700 bg-green-100",
    link: "/admin/finance",
  },
];

const recentActivity: any[] = [];

const activityIcons: Record<string, typeof CheckCircle2> = {
  production: Factory,
  finance: IndianRupee,
  inquiry: AlertCircle,
  design: Layout,
};

const activityColors: Record<string, string> = {
  production: "text-indigo-600 bg-indigo-50",
  finance: "text-green-600 bg-green-50",
  inquiry: "text-blue-600 bg-blue-50",
  design: "text-purple-600 bg-purple-50",
};

const shortcuts = [
  { label: "Projects", icon: FolderKanban, href: "/admin/projects" },
  { label: "Production", icon: Factory, href: "/admin/production" },
  { label: "Quotation", icon: FileText, href: "/admin/quotation" },
  { label: "Finance", icon: IndianRupee, href: "/admin/finance" },
  { label: "3D Design", icon: Layout, href: "/admin/design" },
  { label: "Cutting", icon: Scissors, href: "/admin/cutting" },
];

export default function Dashboard() {
  const [projectCount, setProjectCount] = useState(0);
  const [productionCount, setProductionCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("svk_projects");
    if (saved) {
      const projects = JSON.parse(saved);
      setProjectCount(projects.length);
      setProductionCount(projects.filter((p: any) => p.status === "Manufacturing").length);
    }
  }, []);

  const dynamicStats = quickStats.map(stat => {
    if (stat.label === "Active Projects") return { ...stat, value: projectCount.toString() };
    if (stat.label === "In Production") return { ...stat, value: productionCount.toString() };
    return stat;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-display font-bold mb-2">
          Welcome, {OWNER_NAME.split(" ")[0]}
        </h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {dynamicStats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${stat.color}`}
            >
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold font-display mb-3">{stat.value}</p>
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <TrendingUp size={12} />
              {stat.change}
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Open Module <ArrowUpRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column: Activity + Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-background rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold font-display text-lg">Recent Activity</h3>
            <Link
              to="/admin/projects"
              className="text-xs font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-border/50 min-h-[200px] flex flex-col items-center justify-center">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const Icon = activityIcons[activity.type] || CheckCircle2;
                const colorClass =
                  activityColors[activity.type] || "text-gray-600 bg-gray-50";
                return (
                  <div
                    key={activity.id + activity.action}
                    className="px-6 py-5 flex items-center gap-4 hover:bg-muted/5 transition-colors w-full"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">
                        {activity.customer}{" "}
                        <span className="text-muted-foreground font-normal">
                          — {activity.id}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.action}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock size={12} />
                      {activity.time}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
                  <Clock size={24} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No recent activity to show.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="bg-background rounded-3xl border border-border shadow-sm p-6">
          <h3 className="font-bold font-display text-lg mb-6">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.label}
                to={shortcut.href}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border/50 bg-muted/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group"
              >
                <shortcut.icon
                  size={28}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {shortcut.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
