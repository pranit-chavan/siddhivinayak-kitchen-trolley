import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Grid } from "@react-three/drei";
import { Room, DraggableCabinet, FloorDropZone, StudioLighting } from "./SceneObjects";
import type { PlacedItem } from "./designState";
import { useRef, useState, useCallback } from "react";

interface DesignViewportProps {
  roomWidth: number;
  roomDepth: number;
  roomHeight: number;
  items: PlacedItem[];
  selectedUid: string | null;
  counterColor: string;
  onSelectItem: (uid: string) => void;
  onDeselectAll: () => void;
  onMoveItem: (uid: string, x: number, z: number) => void;
  onFloorClick: (x: number, z: number) => void;
}

export default function DesignViewport({
  roomWidth,
  roomDepth,
  roomHeight,
  items,
  selectedUid,
  counterColor,
  onSelectItem,
  onDeselectAll,
  onMoveItem,
  onFloorClick,
}: DesignViewportProps) {
  const orbitRef = useRef<any>(null);
  // Track dragging state to disable orbit controls
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    // Immediately disable orbit so it doesn't fight
    if (orbitRef.current) {
      orbitRef.current.enabled = false;
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // Re-enable orbit after drag finishes
    if (orbitRef.current) {
      orbitRef.current.enabled = true;
    }
  }, []);

  return (
    <Canvas
      shadows
      gl={{ antialias: true, toneMapping: 3 }}
      style={{ background: "#2a2a2e" }}
      onPointerMissed={() => onDeselectAll()}
    >
      <PerspectiveCamera
        makeDefault
        position={[roomWidth * 1.5, roomHeight * 1.1, roomDepth * 2.2]}
        fov={45}
        near={0.1}
        far={100}
      />

      <OrbitControls
        ref={orbitRef}
        target={[roomWidth / 2, roomHeight * 0.35, roomDepth / 2]}
        minDistance={1}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2 - 0.05}
        enableDamping
        dampingFactor={0.08}
      />

      <StudioLighting />
      <Environment preset="apartment" background={false} />

      <Grid
        position={[roomWidth / 2, -0.001, roomDepth / 2]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#4a4a4a"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#6a6a6a"
        fadeDistance={15}
        infiniteGrid
      />

      <Room width={roomWidth} depth={roomDepth} height={roomHeight} />
      <FloorDropZone width={roomWidth} depth={roomDepth} onDrop={onFloorClick} />

      {items.map((item) => (
        <DraggableCabinet
          key={item.uid}
          item={item}
          isSelected={selectedUid === item.uid}
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          onSelect={onSelectItem}
          onMove={onMoveItem}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
    </Canvas>
  );
}
