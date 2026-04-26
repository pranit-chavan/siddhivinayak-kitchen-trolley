import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Grid } from "@react-three/drei";
import { Room, DraggableCabinet, StudioLighting } from "@/components/erp/Design3D/SceneObjects";
import type { PlacedItem } from "@/components/erp/Design3D/designState";
import { Box, X } from "lucide-react";

interface Customer3DViewerProps {
  items: PlacedItem[];
  roomWidth: number;
  roomDepth: number;
  roomHeight: number;
  counterColor: string;
  onClose: () => void;
}

/**
 * A Read-Only version of the 3D Studio for Customers.
 * Dragging and Editing are disabled.
 */
export default function Customer3DViewer({
  items,
  roomWidth,
  roomDepth,
  roomHeight,
  counterColor,
  onClose,
}: Customer3DViewerProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col">
      {/* Header Bar */}
      <div className="bg-slate-900 border-b border-white/10 p-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
            <Box className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-white font-display font-bold text-lg leading-tight">Your 3D Kitchen Design</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Siddhivinayak Kitchen Trolley</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-slate-400 rounded-full flex items-center justify-center transition-all border border-white/5"
        >
          <X size={20} />
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="flex-grow relative bg-[#0f172a]">
        <Suspense fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <Box className="animate-bounce text-primary mb-4" size={48} />
            <p className="font-bold uppercase tracking-widest text-xs text-slate-500">Generating 3D Reality...</p>
          </div>
        }>
          <Canvas shadows gl={{ antialias: true, toneMapping: 3 }}>
            <PerspectiveCamera 
              makeDefault 
              position={[roomWidth * 1.6, roomHeight * 1.2, roomDepth * 2]} 
              fov={45} 
            />
            <OrbitControls 
              target={[roomWidth / 2, roomHeight * 0.35, roomDepth / 2]}
              enableDamping
              maxPolarAngle={Math.PI / 2 - 0.1}
              minDistance={2}
              maxDistance={12}
            />
            
            <StudioLighting />
            <Environment preset="apartment" />
            
            <Grid
              position={[roomWidth / 2, -0.001, roomDepth / 2]}
              args={[20, 20]}
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#1e293b"
              sectionColor="#334155"
              fadeDistance={15}
              infiniteGrid
            />

            <Room width={roomWidth} depth={roomDepth} height={roomHeight} />

            {/* In the customer view, we use the same DraggableCabinet 
                but we don't pass any onMove or onSelect props, 
                locking them in place. */}
            {items.map((item) => (
              <DraggableCabinet
                key={item.uid}
                item={item}
                isSelected={false}
                roomWidth={roomWidth}
                roomDepth={roomDepth}
                onSelect={() => {}} // Disabled for customer
                onMove={() => {}}   // Disabled for customer
                onDragStart={() => {}} // Disabled for customer
                onDragEnd={() => {}}   // Disabled for customer
              />
            ))}
          </Canvas>
        </Suspense>

        {/* View Controls Helper */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-none">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] whitespace-nowrap">
            Rotate: Mouse Drag · Zoom: Scroll · Move: Right Click
          </p>
        </div>
      </div>
    </div>
  );
}
