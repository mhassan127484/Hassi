"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from "@/lib/actions/admin-products";
import { useToastStore } from "@/store/toast";
import { formatPrice } from "@/lib/data/products";
import { AdminProduct } from "@/types";
import ProductTile from "@/components/ProductTile";
import { StatusPill } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProductFormModal, { ResolvedProductFormState } from "@/components/admin/ProductFormModal";

export default function AdminProductsPage() {
  const push = useToastStore((s) => s.push);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);

  const refresh = () => getAdminProducts().then((p) => { setProducts(p); setLoading(false); });

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: AdminProduct) => { setEditing(p); setModalOpen(true); };

  const handleSubmit = async (form: ResolvedProductFormState) => {
    const input = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: form.status,
      colors: form.colors,
      images: form.images,
    };
    if (editing) {
      await updateProduct(editing.id, input);
      push("Product updated", "success");
    } else {
      await createProduct(input);
      push("Product added", "success");
    }
    setModalOpen(false);
    refresh();
  };

  const handleDelete = async (p: AdminProduct) => {
    await deleteProduct(p.id);
    push("Product deleted");
    refresh();
  };

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tightest text-ink">Products</h1>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Product
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border border-ink/20 bg-white py-2.5 pl-11 pr-4 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-ink/10 text-left font-body text-xs uppercase tracking-widest text-stone">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="flex items-center gap-3 p-4">
                  <ProductTile tile={p.colors[0]?.tile ?? ["#111114", "#2A2A30"]} image={p.colors[0]?.image} className="h-10 w-9 flex-shrink-0 rounded-sm" />
                  <span className="font-body text-sm text-ink">{p.name}</span>
                </td>
                <td className="p-4 font-body text-sm text-ink/70">{p.category}</td>
                <td className="p-4 font-body text-sm text-ink/70">{p.stock}</td>
                <td className="p-4 font-body text-sm text-ink/70">{formatPrice(p.price)}</td>
                <td className="p-4"><StatusPill status={p.status} /></td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(p)} className="text-ink/50 hover:text-cobalt">
                      <Pencil className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                    <button onClick={() => handleDelete(p)} className="text-ink/50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center font-body text-sm text-ink/50">No products match your search.</p>
        )}
      </div>

      <ProductFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initial={editing} />
    </div>
  );
}
