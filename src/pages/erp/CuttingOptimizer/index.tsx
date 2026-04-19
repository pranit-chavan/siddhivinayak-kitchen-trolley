import AdminLayout from "@/components/erp/AdminLayout";
import { Scissors, Download, Play, Trash2, Printer, Plus, Grid3X3, Calculator, Box, Layout, Import } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Part {
  id: string;
  label: string;
  width: number;
  height: number;
  qty: number;
}

interface PlacedPart extends Part {
  x: number;
  y: number;
  rotated: boolean;
}

interface SheetOutput {
  id: number;
  placed: PlacedPart[];
  usage: number; // percentage
}

const DEFAULT_SHEET = { w: 2440, h: 1220, cost: 2500 }; // 8x4 ft in mm, assumed cost

export default function CuttingOptimizer() {
  const [sheet, setSheet] = useState(DEFAULT_SHEET);
  const [parts, setParts] = useState<Part[]>([
    { id: "1", label: "Side Panel A", width: 720, height: 560, qty: 2 },
    { id: "2", label: "Bottom Panel", width: 600, height: 560, qty: 1 },
    { id: "3", label: "Top Support", width: 600, height: 100, qty: 2 },
    { id: "4", label: "Back Panel", width: 720, height: 600, qty: 1 },
  ]);

  const [optimizedSheets, setOptimizedSheets] = useState<SheetOutput[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);

  const addPart = () => {
    setParts([...parts, { id: Math.random().toString(36).substr(2, 9), label: "New Piece", width: 500, height: 500, qty: 1 }]);
    setIsOptimized(false);
  };

  const removePart = (id: string) => {
    setParts(parts.filter(p => p.id !== id));
    setIsOptimized(false);
  };

  const updatePart = (id: string, field: keyof Part, value: any) => {
    setParts(parts.map(p => p.id === id ? { ...p, [field]: value } : p));
    setIsOptimized(false);
  };

  const totalAreaObj = useMemo(() => {
    const area = parts.reduce((acc, p) => acc + (p.width * p.height * p.qty), 0);
    return (area / 1000000).toFixed(2); // in sq meters
  }, [parts]);

  // A basic Shelf Bin Packing algorithm for visualization
  const runOptimization = () => {
    // Flatten quantities into single pieces
    let allPieces: Part[] = [];
    parts.forEach(p => {
      for (let i = 0; i < p.qty; i++) {
        allPieces.push({ ...p, id: `${p.id}-${i}` });
      }
    });

    // Sort by height descending (Shelf algorithm heuristic)
    allPieces.sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height));

    const sheetsResult: SheetOutput[] = [];
    let currentSheetId = 1;
    
    // Fallback simple shelf packing logic
    let tempSheets: { id: number, shelves: { y: number, height: number, currentX: number }[], placed: PlacedPart[] }[] = [];

    const packItem = (piece: Part) => {
      // Always align longest side along x or y to fit max height
      let pw = piece.width;
      let ph = piece.height;
      let rotated = false;

      // Try to find a shelf
      for (let s of tempSheets) {
        for (let shelf of s.shelves) {
          // Normal rotation
          if (shelf.currentX + pw <= sheet.w && ph <= shelf.height) {
            s.placed.push({ ...piece, x: shelf.currentX, y: shelf.y, rotated: false });
            shelf.currentX += pw;
            return;
          }
          // Try rotating
          if (shelf.currentX + ph <= sheet.w && pw <= shelf.height) {
            s.placed.push({ ...piece, x: shelf.currentX, y: shelf.y, rotated: true, width: ph, height: pw });
            shelf.currentX += ph;
            return;
          }
        }

        // Output to new shelf on existing sheet if vertical space allows
        const lastShelfY = s.shelves.length > 0 ? s.shelves[s.shelves.length - 1].y + s.shelves[s.shelves.length - 1].height : 0;
        
        if (lastShelfY + ph <= sheet.h && pw <= sheet.w) {
          s.shelves.push({ y: lastShelfY, height: ph, currentX: pw });
          s.placed.push({ ...piece, x: 0, y: lastShelfY, rotated: false });
          return;
        } else if (lastShelfY + pw <= sheet.h && ph <= sheet.w) {
          s.shelves.push({ y: lastShelfY, height: pw, currentX: ph });
          s.placed.push({ ...piece, x: 0, y: lastShelfY, rotated: true, width: ph, height: pw });
          return;
        }
      }

      // Need a new sheet
      const newSheet = { id: currentSheetId++, shelves: [{ y: 0, height: ph, currentX: pw }], placed: [{ ...piece, x: 0, y: 0, rotated: false }] };
      tempSheets.push(newSheet);
    };

    allPieces.forEach(packItem);

    // Calculate usage
    const finalOutput = tempSheets.map(s => {
      const usedArea = s.placed.reduce((acc, p) => acc + (p.width * p.height), 0);
      const usage = (usedArea / (sheet.w * sheet.h)) * 100;
      return {
        id: s.id,
        placed: s.placed,
        usage
      };
    });

    setOptimizedSheets(finalOutput);
    setIsOptimized(true);
  };

  const totalWastage = optimizedSheets.length > 0 
    ? (100 - (optimizedSheets.reduce((acc, s) => acc + s.usage, 0) / optimizedSheets.length)).toFixed(1) 
    : "0.0";
  
  const overallEfficiency = optimizedSheets.length > 0 
    ? (optimizedSheets.reduce((acc, s) => acc + s.usage, 0) / optimizedSheets.length).toFixed(1) 
    : "0.0";

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Cutting Optimizer</h1>
          <p className="text-muted-foreground">Maximize raw material usage and minimize wastage.</p>
        </div>
        <div className="flex gap-4">
           {isOptimized && (
             <button className="px-8 py-3 bg-muted text-foreground border border-border rounded-xl font-bold flex items-center gap-2 hover:bg-primary/5 transition-all">
                <Printer size={18} />
                Export PDF
             </button>
           )}
           <button 
             onClick={runOptimization}
             className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity"
           >
              <Play size={18} />
              Generate Cutlist
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 space-y-8">
            {/* Sheet Settings */}
            <div className="bg-background rounded-[2rem] border border-border shadow-sm p-8">
               <h4 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
                 <Box size={20} className="text-primary" />
                 Master Sheet Data
               </h4>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Width (mm)</label>
                     <input 
                       value={sheet.w} 
                       onChange={(e) => setSheet({...sheet, w: parseInt(e.target.value)||0})}
                       type="number" 
                       className="w-full h-12 bg-muted/40 rounded-xl px-4 text-sm font-bold border border-transparent focus:border-primary outline-none transition-all" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Height (mm)</label>
                     <input 
                       value={sheet.h} 
                       onChange={(e) => setSheet({...sheet, h: parseInt(e.target.value)||0})}
                       type="number" 
                       className="w-full h-12 bg-muted/40 rounded-xl px-4 text-sm font-bold border border-transparent focus:border-primary outline-none transition-all" 
                     />
                  </div>
               </div>
               <div className="space-y-2 mb-4">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Cost per sheet (₹)</label>
                  <input 
                    value={sheet.cost} 
                    onChange={(e) => setSheet({...sheet, cost: parseInt(e.target.value)||0})}
                    type="number" 
                    className="w-full h-12 bg-primary/5 text-primary rounded-xl px-4 text-sm font-bold border border-primary/20 focus:border-primary outline-none transition-all" 
                  />
               </div>
               <div className="mt-4 flex items-center gap-2 text-[10px] uppercase font-black text-muted-foreground p-3 border border-border border-dashed rounded-lg justify-center bg-muted/20">
                  <Layout size={14} className="text-primary" /> Default: standard 8ft x 4ft
               </div>
            </div>

            {/* Parts List */}
            <div className="bg-background rounded-[2.5rem] border border-border shadow-md overflow-hidden">
               <div className="p-6 border-b border-border bg-muted/10 flex items-center justify-between">
                  <h4 className="font-bold flex items-center gap-2 uppercase tracking-widest text-[11px] text-muted-foreground">
                    <Grid3X3 size={16} />
                    Required Cut-List
                  </h4>
                  <div className="flex gap-2">
                     <button className="p-2 border border-border text-muted-foreground rounded-lg hover:text-primary transition-all" title="Import from Project">
                       <Import size={14} />
                     </button>
                     <button onClick={addPart} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
                       <Plus size={14} />
                     </button>
                  </div>
               </div>
               <div className="p-0 overflow-x-auto max-h-[400px]">
                 <table className="w-full">
                    <thead className="bg-muted/5 text-[9px] uppercase tracking-widest font-black text-muted-foreground border-b border-border/50 sticky top-0 backdrop-blur-md">
                       <tr>
                          <th className="px-6 py-4 text-left">Label</th>
                          <th className="px-2 py-4 text-center">W</th>
                          <th className="px-2 py-4 text-center">H</th>
                          <th className="px-4 py-4 text-center">Qty</th>
                          <th className="px-4 py-4 text-right"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                       <AnimatePresence>
                         {parts.map(p => (
                           <motion.tr 
                             layout
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             key={p.id} className="hover:bg-muted/5"
                           >
                             <td className="px-6 py-3">
                                <input 
                                  className="w-full bg-transparent border-b border-transparent focus:border-primary/30 outline-none text-xs font-bold transition-all"
                                  value={p.label}
                                  onChange={(e) => updatePart(p.id, "label", e.target.value)}
                                />
                             </td>
                             <td className="px-2 py-3">
                                <input 
                                  type="number"
                                  className="w-14 bg-muted/30 border-none rounded-lg text-center text-xs font-bold p-2 outline-none"
                                  value={p.width}
                                  onChange={(e) => updatePart(p.id, "width", parseInt(e.target.value)||0)}
                                />
                             </td>
                             <td className="px-2 py-3">
                                <input 
                                  type="number" 
                                  className="w-14 bg-muted/30 border-none rounded-lg text-center text-xs font-bold p-2 outline-none"
                                  value={p.height}
                                  onChange={(e) => updatePart(p.id, "height", parseInt(e.target.value)||0)}
                                />
                             </td>
                             <td className="px-4 py-3">
                                <input 
                                  type="number"
                                  className="w-12 bg-primary/10 text-primary border-none rounded-lg text-center text-xs font-black p-2 outline-none"
                                  value={p.qty}
                                  onChange={(e) => updatePart(p.id, "qty", parseInt(e.target.value)||1)}
                                />
                             </td>
                             <td className="px-4 py-3 text-right">
                                <button onClick={() => removePart(p.id)} className="p-1.5 text-muted-foreground rounded-md hover:text-red-600 transition-all">
                                  <Trash2 size={14} />
                                </button>
                             </td>
                           </motion.tr>
                         ))}
                       </AnimatePresence>
                    </tbody>
                 </table>
               </div>
               <div className="p-6 bg-muted/5 border-t border-border/50">
                  <p className="text-[10px] text-center uppercase font-black tracking-widest">Total Surface Area: <span className="text-primary">{totalAreaObj} m²</span></p>
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 flex flex-col gap-6">
            {!isOptimized ? (
               <div className="bg-background rounded-[2.5rem] border border-border border-dashed shadow-sm flex flex-col items-center justify-center p-12 h-full min-h-[600px] text-center">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary/40 mb-6">
                     <Scissors size={48} />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-4">Awaiting Calculation</h2>
                  <p className="text-muted-foreground max-w-sm mb-8">Enter your project measurements on the left, then click "Generate Cutlist" to calculate the optimal sheet layout.</p>
                  <button onClick={runOptimization} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                     <Play size={18} fill="currentColor" />
                     Start Generation
                  </button>
               </div>
            ) : (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col gap-8"
               >
                  {/* Financial & Efficiency Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-background rounded-3xl p-6 border border-border shadow-sm">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Sheets Required</p>
                        <p className="text-3xl font-bold font-display">{optimizedSheets.length}</p>
                     </div>
                     <div className="bg-background rounded-3xl p-6 border border-border shadow-sm border-l-4 border-l-primary leading-none">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Material Cost</p>
                        <p className="text-3xl font-bold font-display text-primary">₹{(optimizedSheets.length * sheet.cost).toLocaleString()}</p>
                     </div>
                     <div className="bg-background rounded-3xl p-6 border border-border shadow-sm">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Avg Efficiency</p>
                        <p className="text-3xl font-bold font-display text-green-600">{overallEfficiency}%</p>
                     </div>
                     <div className="bg-background rounded-3xl p-6 border border-border shadow-sm">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Total Wastage</p>
                        <p className="text-3xl font-bold font-display text-red-500">{totalWastage}%</p>
                     </div>
                  </div>

                  {/* Diagrams */}
                  <div className="space-y-8">
                     {optimizedSheets.map((s, index) => (
                       <div key={s.id} className="bg-background rounded-[2.5rem] border border-border shadow-xl overflow-hidden">
                          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
                             <h4 className="text-lg font-display font-bold flex items-center gap-3">
                               <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">{index + 1}</span>
                               Plywood Board #{s.id}
                             </h4>
                             <div className="px-4 py-1.5 bg-green-50 rounded-full border border-green-100">
                                <span className="text-[10px] font-black uppercase text-green-700 tracking-widest">Usage: {s.usage.toFixed(1)}%</span>
                             </div>
                          </div>

                          <div className="p-8">
                             {/* The Visualizer Canvas. Maintaining aspect ratio of sheet */}
                             <div className="w-full relative shadow-inner border-4 border-slate-300 bg-slate-100 overflow-hidden mx-auto" style={{ aspectRatio: `${sheet.w} / ${sheet.h}` }}>
                                {/* Draw placed pieces */}
                                {s.placed.map((piece, pIdx) => {
                                   // Calculate percentages for absolute positioning
                                   const leftPct = (piece.x / sheet.w) * 100;
                                   const topPct = (piece.y / sheet.h) * 100;
                                   const widthPct = (piece.width / sheet.w) * 100;
                                   const heightPct = (piece.height / sheet.h) * 100;

                                   return (
                                     <div 
                                       key={piece.id + pIdx}
                                       className="absolute border border-blue-400 bg-blue-100/80 flex flex-col items-center justify-center hover:bg-blue-200 transition-colors cursor-crosshair overflow-hidden shadow-sm"
                                       style={{ left: `${leftPct}%`, top: `${topPct}%`, width: `${widthPct}%`, height: `${heightPct}%` }}
                                       title={`${piece.label} (${piece.width}x${piece.height})`}
                                     >
                                        <span className="text-[0.6rem] font-bold text-blue-900 uppercase leading-none text-center hidden md:block px-1 truncate w-full">{piece.label}</span>
                                        <span className="text-[0.5rem] font-medium text-blue-800 leading-none text-center hidden md:block mt-1">{piece.width} × {piece.height}</span>
                                     </div>
                                   );
                                })}
                                {/* Unused space indicator (simulated) */}
                             </div>
                          </div>
                          
                          <div className="px-8 py-4 bg-muted/5 border-t border-border/50 text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] flex justify-center gap-4">
                             <span>Raw Board: <span className="text-foreground">{sheet.w} × {sheet.h} mm</span></span>
                             <span>•</span>
                             <span>Pieces Accommodated: <span className="text-primary">{s.placed.length}</span></span>
                          </div>
                       </div>
                     ))}
                  </div>

               </motion.div>
            )}
         </div>
      </div>
    </AdminLayout>
  );
}
