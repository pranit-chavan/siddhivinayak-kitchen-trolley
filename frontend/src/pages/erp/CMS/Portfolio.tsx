import AdminLayout from "@/components/erp/AdminLayout";
import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon } from "lucide-react";

export default function CMSPortfolio() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/cms/portfolio`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (id?: string) => {
    try {
      const url = id ? `${API_BASE}/cms/portfolio/${id}` : `${API_BASE}/cms/portfolio`;
      const method = id ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          priority: parseInt(editForm.priority) || 0
        })
      });
      
      if (res.ok) {
        fetchItems();
        setIsEditing(null);
        setEditForm({});
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save portfolio item.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${API_BASE}/cms/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (item?: any) => {
    if (item) {
      setIsEditing(item.id);
      setEditForm(item);
    } else {
      setIsEditing("new");
      setEditForm({ title: "", description: "", image: "", size: "", duration: "", budget: "", priority: 0 });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Manage Craftfolio</h1>
          <p className="text-muted-foreground">Add, edit, or remove past completed projects displayed on the portfolio page.</p>
        </div>
        <button 
          onClick={() => startEdit()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          New Craftfolio Item
        </button>
      </div>

      <div className="bg-background rounded-3xl border border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 text-[10px] uppercase tracking-widest font-bold text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-5 text-left w-16">Priority</th>
                <th className="px-6 py-5 text-left w-24">Image</th>
                <th className="px-6 py-5 text-left">Details</th>
                <th className="px-6 py-5 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isEditing === "new" && (
                <tr className="bg-muted/10">
                  <td className="px-6 py-4">
                    <input type="number" className="w-16 p-2 rounded border" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})} placeholder="0" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="text" className="w-full p-2 rounded border text-xs" value={editForm.image} onChange={e => setEditForm({...editForm, image: e.target.value})} placeholder="Image URL..." />
                  </td>
                  <td className="px-6 py-4 space-y-2">
                    <input type="text" className="w-full p-2 rounded border font-bold" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} placeholder="Project Title" />
                    <textarea className="w-full p-2 rounded border text-sm" rows={2} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} placeholder="Detailed description..." />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" className="w-full p-2 rounded border text-xs" value={editForm.size} onChange={e => setEditForm({...editForm, size: e.target.value})} placeholder="Size Info" />
                      <input type="text" className="w-full p-2 rounded border text-xs" value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} placeholder="Duration Info" />
                      <input type="text" className="w-full p-2 rounded border text-xs" value={editForm.budget} onChange={e => setEditForm({...editForm, budget: e.target.value})} placeholder="Budget Info" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleSave()} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Check size={16} /></button>
                      <button onClick={() => setIsEditing(null)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><X size={16} /></button>
                    </div>
                  </td>
                </tr>
              )}

              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading portfolio items...</td></tr>
              ) : items.length === 0 && isEditing !== "new" ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No items found. Click "New Craftfolio Item" to add one.</td></tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-6 font-bold text-center">
                      {isEditing === p.id ? (
                         <input type="number" className="w-16 p-2 rounded border" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})} />
                      ) : (
                         p.priority
                      )}
                    </td>
                    <td className="px-6 py-6">
                      {isEditing === p.id ? (
                        <input type="text" className="w-full p-2 rounded border text-xs" value={editForm.image} onChange={e => setEditForm({...editForm, image: e.target.value})} placeholder="Image URL..." />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-muted/30 overflow-hidden border border-border/50 flex items-center justify-center">
                          {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-muted-foreground/30" />}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6">
                      {isEditing === p.id ? (
                        <div className="space-y-2">
                          <input type="text" className="w-full p-2 rounded border font-bold" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} placeholder="Project Title" />
                          <textarea className="w-full p-2 rounded border text-sm" rows={2} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} placeholder="Detailed description..." />
                          <div className="grid grid-cols-3 gap-2">
                            <input type="text" className="w-full p-2 rounded border text-xs" value={editForm.size} onChange={e => setEditForm({...editForm, size: e.target.value})} placeholder="Size Info" />
                            <input type="text" className="w-full p-2 rounded border text-xs" value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} placeholder="Duration Info" />
                            <input type="text" className="w-full p-2 rounded border text-xs" value={editForm.budget} onChange={e => setEditForm({...editForm, budget: e.target.value})} placeholder="Budget Info" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">{p.title}</span>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-w-xl">{p.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                            {p.size && <span>S: {p.size}</span>}
                            {p.duration && <span>D: {p.duration}</span>}
                            {p.budget && <span>B: {p.budget}</span>}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6 text-right">
                      {isEditing === p.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleSave(p.id)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"><Check size={16} /></button>
                          <button onClick={() => setIsEditing(null)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"><X size={16} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => startEdit(p)} className="p-2 bg-muted hover:text-primary rounded-lg transition-colors border"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 bg-muted hover:text-red-600 rounded-lg transition-colors border"><Trash2 size={16} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
