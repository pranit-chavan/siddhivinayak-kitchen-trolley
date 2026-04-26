import AdminLayout from "@/components/erp/AdminLayout";
import {
  Save, Trash2, RotateCw, RotateCcw, Ruler, Palette, Copy,
  ChevronDown, ChevronRight, Sofa, Grid3X3, Box, Settings2, Undo2, Redo2, Monitor, Grid, Columns, Split
} from "lucide-react";
import { useState, useCallback, Suspense, useRef } from "react";
import {
  LOWER_CABINETS,
  UPPER_CABINETS,
  CORNER_CABINETS,
  TALL_UNITS,
  APPLIANCES,
  WINDOWS_DOORS,
  TABLES_STOOLS,
  ACCESSORIES,
  MATERIALS,
  ROOM_PRESETS,
  type FurniturePiece,
} from "@/components/erp/Design3D/furnitureData";
import {
  createDefaultDesign,
  genUid,
  clampPosition,
  type DesignState,
  type PlacedItem,
} from "@/components/erp/Design3D/designState";
import DesignViewport from "@/components/erp/Design3D/DesignViewport";

// ── Collapsible Section ──
function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-2 group">
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <Icon size={13} />
          <span className="text-[10px] uppercase font-bold tracking-widest">{title}</span>
        </div>
        {open ? <ChevronDown size={12} className="text-muted-foreground" /> : <ChevronRight size={12} className="text-muted-foreground" />}
      </button>
      {open && children}
    </div>
  );
}

// ── Catalog Item Button ──
function CatalogItem({ piece, onAdd }: { piece: FurniturePiece; onAdd: (p: FurniturePiece) => void }) {
  return (
    <button
      onClick={() => onAdd(piece)}
      className="w-full text-left px-3 py-2 rounded-lg border border-border/40 bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-3 group"
    >
      <div className="w-6 h-6 rounded flex-shrink-0" style={{ backgroundColor: piece.color }} />
      <div className="min-w-0">
        <p className="text-[11px] font-bold truncate group-hover:text-primary transition-colors">{piece.name}</p>
        <p className="text-[9px] text-muted-foreground">{(piece.width * 100).toFixed(0)}×{(piece.height * 100).toFixed(0)}×{(piece.depth * 100).toFixed(0)} cm</p>
      </div>
    </button>
  );
}

export default function Design3D() {
  const [design, setDesignState] = useState<DesignState>(createDefaultDesign());
  const [pendingPiece, setPendingPiece] = useState<FurniturePiece | null>(null);

  // ── History for Undo / Redo ──
  const [past, setPast] = useState<DesignState[]>([]);
  const [future, setFuture] = useState<DesignState[]>([]);

  // Wrapper for setDesign that records history
  const setDesign = useCallback(
    (updater: (prev: DesignState) => DesignState) => {
      setDesignState((prev) => {
        const nextState = updater(prev);
        // Only record if state actually changed items or room size (simplification)
        setPast((p) => [...p, prev]);
        setFuture([]); // clear redo stack on new action
        return nextState;
      });
    },
    []
  );

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [design, ...f]);
    setDesignState(previous);
  }, [past, design]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, design]);
    setDesignState(next);
  }, [future, design]);

  // ── Pick a piece from catalog (click catalog → click on floor to place) ──
  const pickPiece = useCallback((piece: FurniturePiece) => {
    setPendingPiece(piece);
  }, []);

  // ── Place the pending piece at clicked floor position ──
  const placeOnFloor = useCallback((x: number, z: number) => {
    if (!pendingPiece) return;

    const [cx, cz] = clampPosition(
      x, z,
      pendingPiece.width, pendingPiece.depth, 0,
      design.room.width, design.room.depth
    );

    const newItem: PlacedItem = {
      uid: genUid(),
      pieceId: pendingPiece.id,
      piece: { ...pendingPiece },
      x: cx,
      z: cz,
      rotationY: 0,
      color: pendingPiece.color,
      counterColor: design.counterColor,
    };

    setDesign((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      selectedUid: newItem.uid,
    }));
    setPendingPiece(null);
  }, [pendingPiece, design.room, design.counterColor]);

  // ── Quick-add: place in center of room immediately ──
  const addToCenter = useCallback((piece: FurniturePiece) => {
    const cx = design.room.width / 2;
    const cz = design.room.depth / 2;
    const newItem: PlacedItem = {
      uid: genUid(),
      pieceId: piece.id,
      piece: { ...piece },
      x: cx,
      z: cz,
      rotationY: 0,
      color: piece.color,
      counterColor: design.counterColor,
    };
    setDesign((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      selectedUid: newItem.uid,
    }));
  }, [design.room, design.counterColor]);

  // ── Select ──
  const selectItem = useCallback((uid: string) => {
    setDesign((prev) => ({ ...prev, selectedUid: uid }));
    setPendingPiece(null);
  }, []);

  const deselectAll = useCallback(() => {
    setDesign((prev) => ({ ...prev, selectedUid: null }));
  }, []);

  // ── Move (called per frame during drag) ──
  const moveItem = useCallback((uid: string, x: number, z: number) => {
    setDesign((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.uid === uid ? { ...i, x, z } : i)),
    }));
  }, []);

  // ── Rotate selected 90° ──
  const rotateSelected = useCallback((dir: 1 | -1) => {
    setDesign((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.uid === prev.selectedUid
          ? { ...i, rotationY: i.rotationY + (Math.PI / 2) * dir }
          : i
      ),
    }));
  }, []);

  // ── Duplicate selected ──
  const duplicateSelected = useCallback(() => {
    setDesign((prev) => {
      const sel = prev.items.find((i) => i.uid === prev.selectedUid);
      if (!sel) return prev;
      const copy: PlacedItem = {
        ...sel,
        uid: genUid(),
        x: sel.x + 0.15,
        z: sel.z + 0.15,
      };
      return { ...prev, items: [...prev.items, copy], selectedUid: copy.uid };
    });
  }, []);

  // ── Delete selected ──
  const deleteSelected = useCallback(() => {
    setDesign((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.uid !== prev.selectedUid),
      selectedUid: null,
    }));
  }, []);

  // ── Change color ──
  const changeColor = useCallback((hex: string) => {
    setDesign((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.uid === prev.selectedUid ? { ...i, color: hex } : i
      ),
    }));
  }, []);

  // ── Change counter color ──
  const changeCounterColor = useCallback((hex: string) => {
    setDesign((prev) => ({
      ...prev,
      counterColor: hex,
      items: prev.items.map((i) => ({ ...i, counterColor: hex })),
    }));
  }, []);

  // ── Room resize ──
  const setRoomDim = useCallback((key: "width" | "depth" | "height", val: number) => {
    setDesign((prev) => ({ ...prev, room: { ...prev.room, [key]: val } }));
  }, []);

  // ── Clear all ──
  const clearAll = useCallback(() => {
    setDesign((prev) => ({ ...prev, items: [], selectedUid: null }));
    setPendingPiece(null);
  }, []);

  const selectedItem = design.items.find((i) => i.uid === design.selectedUid);

  return (
    <AdminLayout>
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold">3D Design Studio</h1>
          {pendingPiece && (
            <p className="text-xs text-primary font-bold mt-0.5">
              ▸ Click inside the room to place: {pendingPiece.name}
              <button onClick={() => setPendingPiece(null)} className="ml-2 text-red-500 underline text-[10px]">Cancel</button>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={clearAll} className="px-4 py-2 border border-border rounded-lg text-xs font-bold hover:bg-muted transition-all flex items-center gap-1.5">
            <RotateCcw size={14} /> Reset
          </button>
          <button className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      {/* ── Main Layout: Catalog Panel | 3D Viewport | Properties Panel ── */}
      <div className="flex gap-3" style={{ height: "calc(100vh - 160px)" }}>

        {/* LEFT: Furniture Catalog */}
        <aside className="w-60 bg-background border border-border rounded-xl p-4 overflow-y-auto shrink-0 flex flex-col">
          <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-3">Click to place in center · Or click catalog then click in room</p>

          <Section title="Base Cabinets" icon={Sofa}>
            <div className="space-y-1.5">
              {LOWER_CABINETS.map((p) => (
                <CatalogItem key={p.id} piece={p} onAdd={addToCenter} />
              ))}
            </div>
          </Section>

          <Section title="Wall Cabinets" icon={Grid3X3}>
            <div className="space-y-1.5">
              {UPPER_CABINETS.map((p) => (
                <CatalogItem key={p.id} piece={p} onAdd={addToCenter} />
              ))}
            </div>
          </Section>

          <Section title="Corner Units" icon={Grid} defaultOpen={false}>
            <div className="space-y-1.5">
              {CORNER_CABINETS.map((p) => (
                <CatalogItem key={p.id} piece={p} onAdd={addToCenter} />
              ))}
            </div>
          </Section>

          <Section title="Tall Units" icon={Split} defaultOpen={false}>
            <div className="space-y-1.5">
              {TALL_UNITS.map((p) => (
                <CatalogItem key={p.id} piece={p} onAdd={addToCenter} />
              ))}
            </div>
          </Section>

          <Section title="Appliances" icon={Monitor} defaultOpen={false}>
            <div className="space-y-1.5">
              {APPLIANCES.map((p) => (
                <CatalogItem key={p.id} piece={p} onAdd={addToCenter} />
              ))}
            </div>
          </Section>

          <Section title="Windows & Doors" icon={Columns} defaultOpen={false}>
            <div className="space-y-1.5">
              {WINDOWS_DOORS.map((p) => (
                <CatalogItem key={p.id} piece={p} onAdd={addToCenter} />
              ))}
            </div>
          </Section>

          <Section title="Tables & Stools" icon={Box} defaultOpen={false}>
            <div className="space-y-1.5">
              {TABLES_STOOLS.map((p) => (
                <CatalogItem key={p.id} piece={p} onAdd={addToCenter} />
              ))}
            </div>
          </Section>

          <Section title="Accessories" icon={Settings2} defaultOpen={false}>
            <div className="space-y-1.5">
              {ACCESSORIES.map((p) => (
                <CatalogItem key={p.id} piece={p} onAdd={addToCenter} />
              ))}
            </div>
          </Section>
        </aside>

        {/* CENTER: 3D Viewport */}
        <div className="flex-grow bg-slate-900 border border-slate-700/40 rounded-xl relative overflow-hidden min-h-[300px]">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <Box size={60} className="text-primary/30 mx-auto mb-3" strokeWidth={0.5} />
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading 3D Engine...</p>
                </div>
              </div>
            }
          >
            <DesignViewport
              roomWidth={design.room.width}
              roomDepth={design.room.depth}
              roomHeight={design.room.height}
              items={design.items}
              selectedUid={design.selectedUid}
              counterColor={design.counterColor}
              onSelectItem={selectItem}
              onDeselectAll={deselectAll}
              onMoveItem={moveItem}
              onFloorClick={placeOnFloor}
            />
          </Suspense>

          {/* Viewport HUD */}
          <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
            <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md">
              <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest">● Live</span>
            </div>
            <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                {(design.room.width * 3.281).toFixed(0)}×{(design.room.depth * 3.281).toFixed(0)}×{(design.room.height * 3.281).toFixed(0)} ft
              </span>
            </div>
            <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                {design.items.length} items
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md pointer-events-none">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
              Drag items to move · Orbit: Left-click empty · Zoom: Scroll
            </span>
          </div>

          {/* Floating action bar when item is selected */}
          {selectedItem && (
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={undo}
                disabled={past.length === 0}
                className="px-2 py-2 bg-black/70 backdrop-blur-sm text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                title="Undo"
              >
                <Undo2 size={14} />
              </button>
              <button
                onClick={redo}
                disabled={future.length === 0}
                className="px-2 py-2 bg-black/70 backdrop-blur-sm text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                title="Redo"
              >
                <Redo2 size={14} />
              </button>
              
              <div className="w-px h-6 bg-white/20 self-center mx-1" />

              <button
                onClick={() => rotateSelected(-1)}
                className="px-3 py-2 bg-black/70 backdrop-blur-sm text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-indigo-600 transition-colors"
                title="Rotate -90°"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={duplicateSelected}
                className="px-3 py-2 bg-black/70 backdrop-blur-sm text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-indigo-600 transition-colors"
                title="Duplicate"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={deleteSelected}
                className="px-3 py-2 bg-red-600/90 backdrop-blur-sm text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 hover:bg-red-500 transition-colors"
                title="Delete selected item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Properties & Room Settings */}
        <aside className="w-60 bg-background border border-border rounded-xl p-4 overflow-y-auto shrink-0 flex flex-col">

          {/* Room Settings */}
          <Section title="Room Size" icon={Ruler}>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {(["width", "depth", "height"] as const).map((key) => (
                <div key={key}>
                  <label className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest block mb-0.5 ml-0.5">
                    {key === "width" ? "W" : key === "depth" ? "D" : "H"}
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    min={1}
                    max={8}
                    value={design.room[key]}
                    onChange={(e) => setRoomDim(key, parseFloat(e.target.value) || 1)}
                    className="w-full h-8 bg-muted/40 rounded-md px-1.5 text-[11px] font-bold text-center border border-transparent focus:border-primary outline-none transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {ROOM_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => { setRoomDim("width", p.width); setRoomDim("depth", p.depth); setRoomDim("height", p.height); }}
                  className="px-2 py-0.5 bg-muted/40 rounded text-[8px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </Section>

          {/* Counter Material */}
          <Section title="Countertop" icon={Palette}>
            <div className="flex flex-wrap gap-1.5">
              {MATERIALS.filter((m) => m.type === "granite").map((m) => (
                <button
                  key={m.id}
                  onClick={() => changeCounterColor(m.hex)}
                  className={`w-7 h-7 rounded-md border-2 transition-all hover:scale-110 ${
                    design.counterColor === m.hex ? "border-primary ring-1 ring-primary/30" : "border-border/40"
                  }`}
                  style={{ backgroundColor: m.hex }}
                  title={m.name}
                />
              ))}
            </div>
          </Section>

          {/* Separator */}
          <div className="border-t border-border my-3" />

          {/* Selected Item Properties */}
          {selectedItem ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Selected</p>
                <p className="text-sm font-bold">{selectedItem.piece.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {(selectedItem.piece.width * 100).toFixed(0)}×{(selectedItem.piece.height * 100).toFixed(0)}×{(selectedItem.piece.depth * 100).toFixed(0)} cm
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Pos: X={( selectedItem.x * 100).toFixed(0)}cm  Z={(selectedItem.z * 100).toFixed(0)}cm
                </p>
              </div>

              {/* Rotate */}
              <div>
                <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Rotate</p>
                <div className="flex gap-2">
                  <button onClick={() => rotateSelected(-1)} className="flex-1 py-2 bg-muted/40 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary/10 hover:text-primary transition-all">
                    <RotateCcw size={13} /> -90°
                  </button>
                  <button onClick={() => rotateSelected(1)} className="flex-1 py-2 bg-muted/40 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary/10 hover:text-primary transition-all">
                    <RotateCw size={13} /> +90°
                  </button>
                </div>
              </div>

              {/* Color */}
              <div>
                <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Color</p>
                <div className="flex flex-wrap gap-1.5">
                  {MATERIALS.filter((m) => m.type === "laminate" || m.type === "wood").map((m) => (
                    <button
                      key={m.id}
                      onClick={() => changeColor(m.hex)}
                      className="w-7 h-7 rounded-md border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: m.hex,
                        borderColor: selectedItem.color === m.hex ? "#6366f1" : "transparent",
                      }}
                      title={m.name}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={duplicateSelected} className="flex-1 py-2 bg-muted/40 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-primary/10 hover:text-primary transition-all">
                  <Copy size={12} /> Duplicate
                </button>
                <button onClick={deleteSelected} className="flex-1 py-2 border border-red-200 text-red-500 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-red-50 transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-muted-foreground font-bold">No item selected</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Click a cabinet in the 3D view or add one from the catalog</p>
            </div>
          )}

          {/* Items List */}
          {design.items.length > 0 && (
            <>
              <div className="border-t border-border my-3" />
              <div>
                <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Placed Items ({design.items.length})</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {design.items.map((item) => (
                    <button
                      key={item.uid}
                      onClick={() => selectItem(item.uid)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-2 ${
                        item.uid === design.selectedUid
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.piece.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </AdminLayout>
  );
}
