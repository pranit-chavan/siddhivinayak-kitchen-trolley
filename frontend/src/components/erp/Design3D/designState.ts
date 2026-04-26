// ── Design State Manager v2 ──
// Free-placement model: items have x/z world coords + rotation.
// No more wall-snapping — user drags items anywhere in the room.

import type { FurniturePiece } from "./furnitureData";

export interface PlacedItem {
  uid: string;
  pieceId: string;
  piece: FurniturePiece;
  /** World X position (center of piece) */
  x: number;
  /** World Z position (center of piece) */
  z: number;
  /** Y rotation in radians (0, π/2, π, 3π/2) */
  rotationY: number;
  /** Overridden body color */
  color: string;
  /** Counter/granite color */
  counterColor: string;
}

export interface DesignState {
  room: {
    width: number;
    depth: number;
    height: number;
  };
  items: PlacedItem[];
  selectedUid: string | null;
  counterColor: string;
  projectId: string | null;
}

export function createDefaultDesign(): DesignState {
  return {
    room: { width: 3.05, depth: 2.44, height: 2.74 },
    items: [],
    selectedUid: null,
    counterColor: "#1e1e1e",
    projectId: null,
  };
}

export function genUid(): string {
  return Math.random().toString(36).substring(2, 10);
}

/** Clamp a position so the piece stays inside the room */
export function clampPosition(
  x: number,
  z: number,
  pieceWidth: number,
  pieceDepth: number,
  rotationY: number,
  roomWidth: number,
  roomDepth: number
): [number, number] {
  // After rotation, effective width/depth swap at 90° and 270°
  const isRotated = Math.abs(Math.sin(rotationY)) > 0.5;
  const effW = isRotated ? pieceDepth : pieceWidth;
  const effD = isRotated ? pieceWidth : pieceDepth;

  const halfW = effW / 2;
  const halfD = effD / 2;

  const cx = Math.max(halfW, Math.min(roomWidth - halfW, x));
  const cz = Math.max(halfD, Math.min(roomDepth - halfD, z));
  return [cx, cz];
}
