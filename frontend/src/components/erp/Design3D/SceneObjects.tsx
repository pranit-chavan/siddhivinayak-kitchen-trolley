import { useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import type { PlacedItem } from "./designState";
import { clampPosition } from "./designState";

// ── Room Shell ──
interface RoomProps {
  width: number;
  depth: number;
  height: number;
}

export function Room({ width, depth, height }: RoomProps) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, 0, depth / 2]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#d4c9a8" roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[width / 2, height, depth / 2]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#fafafa" roughness={0.9} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[width / 2, height / 2, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[0, height / 2, depth / 2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#ededea" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width, height / 2, depth / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#ededea" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── Draggable Cabinet ──
interface DraggableCabinetProps {
  item: PlacedItem;
  isSelected: boolean;
  roomWidth: number;
  roomDepth: number;
  onSelect: (uid: string) => void;
  onMove: (uid: string, x: number, z: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function DraggableCabinet({
  item,
  isSelected,
  roomWidth,
  roomDepth,
  onSelect,
  onMove,
  onDragStart,
  onDragEnd,
}: DraggableCabinetProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { raycaster, camera, gl } = useThree();

  // Floor-plane for raycasting during drag
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersectPoint = useRef(new THREE.Vector3());
  const dragOffset = useRef(new THREE.Vector3());

  const { piece } = item;
  const yCenter = piece.yOffset + piece.height / 2;
  const isGlass = item.pieceId.includes("glass");
  const hasDrawer = item.pieceId.includes("drawer");
  const isWindow = item.pieceId.includes("window");

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onSelect(item.uid);

      // Calculate offset between click point and object center
      raycaster.ray.intersectPlane(floorPlane.current, intersectPoint.current);
      dragOffset.current.set(
        intersectPoint.current.x - item.x,
        0,
        intersectPoint.current.z - item.z
      );

      setIsDragging(true);
      onDragStart();
      gl.domElement.style.cursor = "grabbing";

      // Capture pointer for smooth dragging
      (e as any).target?.setPointerCapture?.(e.pointerId);
    },
    [item.uid, item.x, item.z, onSelect, raycaster, gl]
  );

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isDragging) return;
      e.stopPropagation();

      raycaster.ray.intersectPlane(floorPlane.current, intersectPoint.current);

      const newX = intersectPoint.current.x - dragOffset.current.x;
      const newZ = intersectPoint.current.z - dragOffset.current.z;

      const [cx, cz] = clampPosition(
        newX,
        newZ,
        piece.width,
        piece.depth,
        item.rotationY,
        roomWidth,
        roomDepth
      );

      onMove(item.uid, cx, cz);
    },
    [isDragging, item.uid, item.rotationY, piece, roomWidth, roomDepth, onMove, raycaster]
  );

  const handlePointerUp = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isDragging) return;
      setIsDragging(false);
      onDragEnd();
      gl.domElement.style.cursor = "auto";
      (e as any).target?.releasePointerCapture?.(e.pointerId);
    },
    [isDragging, gl]
  );

  return (
    <group
      ref={meshRef}
      position={[item.x, yCenter, item.z]}
      rotation={[0, item.rotationY, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[piece.width, piece.height, piece.depth]} />
        <meshStandardMaterial
          color={isDragging ? "#818cf8" : isSelected ? "#6366f1" : item.color}
          roughness={isGlass ? 0.1 : 0.6}
          metalness={isGlass ? 0.3 : 0.05}
          transparent={isGlass}
          opacity={isGlass ? 0.4 : isDragging ? 0.85 : 1}
        />
      </mesh>

      {/* Selection wireframe */}
      {isSelected && !isDragging && (
        <mesh>
          <boxGeometry args={[piece.width + 0.02, piece.height + 0.02, piece.depth + 0.02]} />
          <meshBasicMaterial color="#6366f1" wireframe />
        </mesh>
      )}

      {/* Drag indicator wireframe */}
      {isDragging && (
        <mesh>
          <boxGeometry args={[piece.width + 0.03, piece.height + 0.03, piece.depth + 0.03]} />
          <meshBasicMaterial color="#a5b4fc" wireframe />
        </mesh>
      )}

      {/* Drawer lines */}
      {hasDrawer && (
        <>
          <mesh position={[0, piece.height * 0.15, piece.depth / 2 + 0.002]}>
            <boxGeometry args={[piece.width * 0.85, 0.008, 0.001]} />
            <meshBasicMaterial color="#000" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, -piece.height * 0.15, piece.depth / 2 + 0.002]}>
            <boxGeometry args={[piece.width * 0.85, 0.008, 0.001]} />
            <meshBasicMaterial color="#000" transparent opacity={0.5} />
          </mesh>
        </>
      )}

      {/* Countertop */}
      {piece.hasCounter && (
        <mesh position={[0, piece.height / 2 + 0.015, 0.025]} castShadow>
          <boxGeometry args={[piece.width + 0.02, 0.03, piece.depth + 0.05]} />
          <meshStandardMaterial color={item.counterColor} roughness={0.2} metalness={0.1} />
        </mesh>
      )}

      {/* Window glass panes */}
      {isWindow && (
        <>
          <mesh position={[-(piece.width / 4), 0, 0.01]}>
            <planeGeometry args={[piece.width / 2 - 0.06, piece.height - 0.08]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
          </mesh>
          <mesh position={[(piece.width / 4), 0, 0.01]}>
            <planeGeometry args={[piece.width / 2 - 0.06, piece.height - 0.08]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ── Floor Drop Zone (invisible plane for placing new items) ──
interface FloorDropZoneProps {
  width: number;
  depth: number;
  onDrop: (x: number, z: number) => void;
}

export function FloorDropZone({ width, depth, onDrop }: FloorDropZoneProps) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[width / 2, 0.001, depth / 2]}
      onClick={(e) => {
        e.stopPropagation();
        onDrop(e.point.x, e.point.z);
      }}
      visible={false}
    >
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// ── Lighting ──
export function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} />
      <pointLight position={[2, 2.5, 2]} intensity={0.3} color="#fff5e0" />
    </>
  );
}
