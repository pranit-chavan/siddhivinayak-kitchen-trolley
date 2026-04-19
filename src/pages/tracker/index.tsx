import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { CheckCircle2, Box, Clock, MapPin, Layout } from "lucide-react";
import { PROJECT_STAGES, WHATSAPP_URL, type ProjectStatus } from "@/data/constants";
import Customer3DViewer from "@/components/shared/Customer3DViewer";
import { LOWER_CABINETS, UPPER_CABINETS } from "@/components/erp/Design3D/furnitureData";

const mockDesignItems = [
  {
    uid: "m1",
    pieceId: "lower-600",
    piece: LOWER_CABINETS[0],
    x: 1.0, z: 0.28, rotationY: 0,
    color: "#7a7d85", counterColor: "#1e1e1e"
  },
  {
    uid: "m2",
    pieceId: "lower-900",
    piece: LOWER_CABINETS[1],
    x: 1.75, z: 0.28, rotationY: 0,
    color: "#7a7d85", counterColor: "#1e1e1e"
  },
  {
    uid: "m3",
    pieceId: "upper-600",
    piece: UPPER_CABINETS[0],
    x: 1.0, z: 0.18, rotationY: 0,
    color: "#e8e8e8", counterColor: "#1e1e1e"
  }
];

const mockProjectData = {
  id: "SVK-2025-042",
  customerName: "Meera Kulkarni",
  location: "Pashan Area",
  furnitureType: "Modular Kitchen",
  currentStatus: "Manufacturing" as ProjectStatus,
  progressPercent: 65,
  lastUpdated: "2025-04-02",
  has3DDesign: true,
};

export default function Tracker() {
  const { projectId } = useParams();
  const [show3D, setShow3D] = useState(false);

  // In a real app, we would fetch live project data from the DB using the projectId.
  const project = {
    ...mockProjectData,
    id: projectId || "SVK-UNKNOWN",
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-40 pb-24 px-4 text-center">
          <h1 className="text-3xl font-display mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Please check the link sent to you via WhatsApp.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full"
          >
            Return Home
          </Link>
        </main>
      </div>
    );
  }

  const currentStageIndex = PROJECT_STAGES.indexOf(project.currentStatus);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <WhatsAppButton />

      <main className="pt-32 pb-24 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-muted/30 rounded-3xl p-8 border border-border/50 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                  <Clock size={14} /> Project Tracking
                </div>
                <h1 className="text-3xl font-display mb-2">
                  Hello, {project.customerName}
                </h1>
                <p className="text-muted-foreground">
                  Detailed status of your {project.furnitureType}
                </p>
              </div>
              <div className="bg-background px-6 py-4 rounded-2xl border border-border flex flex-col items-center justify-center">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                  Project ID
                </p>
                <p className="text-xl font-bold font-display">{project.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border text-primary shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-none mb-1">
                    Location
                  </p>
                  <p className="font-bold">{project.location}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border text-primary shadow-sm">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-none mb-1">
                    Last Updated
                  </p>
                  <p className="font-bold">{project.lastUpdated}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar and Steps */}
            <div className="space-y-12 mb-8">
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative border border-border/20">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${project.progressPercent}%` }}
                />
              </div>

              <div className="relative flex justify-between">
                {PROJECT_STAGES.map((stage, index) => {
                  const isCompleted = index < currentStageIndex;
                  const isCurrent = index === currentStageIndex;

                  return (
                    <div
                      key={stage}
                      className="flex flex-col items-center relative z-10 w-16 md:w-24"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 mb-2 ${
                          isCompleted || isCurrent
                            ? "bg-primary text-primary-foreground shadow-lg scale-110"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <div className="text-xs font-bold">{index + 1}</div>
                        )}
                      </div>
                      <p
                        className={`text-[9px] md:text-sm font-bold text-center transition-colors duration-300 ${
                          isCurrent
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stage}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {project.currentStatus === "Completed" && project.has3DDesign && (
              <div className="animate-in fade-in zoom-in duration-700 mt-12 bg-primary/5 p-8 rounded-3xl border-2 border-dashed border-primary/20 text-center">
                <Layout
                  size={48}
                  className="mx-auto text-primary mb-4"
                  strokeWidth={1.5}
                />
                <h2 className="text-2xl font-display mb-2">
                  Your 3D Design is Ready!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Sachin has finalized the 3D render of your project. Click
                  below to view the design from all angles.
                </p>
                <button 
                  onClick={() => setShow3D(true)}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2 mx-auto hover:bg-primary/95 transition-all shadow-xl hover:shadow-primary/20"
                >
                  <Box size={20} />
                  View Your 3D Design
                </button>
              </div>
            )}
          </div>

          {show3D && (
            <Customer3DViewer
              items={mockDesignItems as any}
              roomWidth={3.05}
              roomDepth={2.44}
              roomHeight={2.74}
              counterColor="#1e1e1e"
              onClose={() => setShow3D(false)}
            />
          )}

          <div className="text-center p-8 bg-muted/20 border border-border/50 rounded-3xl border-dashed">
            <h4 className="font-bold mb-2">Need to speak with Sachin?</h4>
            <p className="text-muted-foreground mb-6 text-sm">
              Have a query about your project status? Connect with us via
              WhatsApp.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
