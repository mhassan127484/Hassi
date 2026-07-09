"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  AdminCategory,
  CategoryInput,
} from "@/lib/actions/admin-categories";
import { useToastStore } from "@/store/toast";
import ProductTile from "@/components/ProductTile";
import Button from "@/components/ui/Button";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import { tileFromHex } from "@/components/admin/ProductFormModal";

export default function AdminCategoriesPage() {
  const push = useToastStore((s) => s.push);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);

  const refresh = () => getAdminCategories().then((c) => { setCategories(c); setLoading(false); });

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [categories, query]
  );

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c: AdminCategory) => { setEditing(c); setModalOpen(true); };

  const handleSubmit = async (input: CategoryInput) => {
    if (editing) {
      await updateCategory(editing.id, input);
      push("Category updated", "success");
    } else {
      await createCategory(input);
      push("Category added", "success");
    }
    setModalOpen(false);
    refresh();
  };

  const handleDelete = async (c: AdminCategory) => {
    try {
      await deleteCategory(c.id);
      push("Category deleted");
      refresh();
    } catch (err) {
      push(err instanceof Error ? err.message : "Could not delete category");
    }
  };

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tightest text-ink">Categories</h1>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Category
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories..."
          className="w-full rounded-full border border-ink/20 bg-white py-2.5 pl-11 pr-4 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10 bg-white">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-ink/10 text-left font-body text-xs uppercase tracking-widest text-stone">
              <th className="p-4">Category</th>
              <th className="p-4">Blurb</th>
              <th className="p-4">Products</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((c) => (
              <tr key={c.id}>
                <td className="flex items-center gap-3 p-4">
                  <ProductTile tile={tileFromHex(c.tileHex)} className="h-10 w-9 flex-shrink-0 rounded-sm" />
                  <span className="font-body text-sm text-ink">{c.name}</span>
                </td>
                <td className="p-4 font-body text-sm text-ink/70">{c.blurb}</td>
                <td className="p-4 font-body text-sm text-ink/70">{c.productCount}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(c)} className="text-ink/50 hover:text-cobalt">
                      <Pencil className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      disabled={c.productCount > 0}
                      title={c.productCount > 0 ? "Reassign products before deleting" : undefined}
                      className="text-ink/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center font-body text-sm text-ink/50">No categories match your search.</p>
        )}
      </div>

      <CategoryFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initial={editing} />
    </div>
  );
}
