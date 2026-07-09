"use client";

import { useEffect, useState } from "react";
import { AdminCategory, CategoryInput } from "@/lib/actions/admin-categories";
import ProductTile from "@/components/ProductTile";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { tileFromHex } from "@/components/admin/ProductFormModal";

type FormState = { name: string; blurb: string; tileHex: string };

const blank: FormState = { name: "", blurb: "", tileHex: "#111114" };

export default function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CategoryInput) => Promise<void>;
  initial?: AdminCategory | null;
}) {
  const [form, setForm] = useState<FormState>(blank);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initial ? { name: initial.name, blurb: initial.blurb, tileHex: initial.tileHex } : blank);
    setError("");
  }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <p className="font-body text-xs uppercase tracking-widest text-stone">
        {initial ? "Edit Category" : "Add Category"}
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="flex items-center gap-3">
          <ProductTile tile={tileFromHex(form.tileHex)} className="h-14 w-12 flex-shrink-0 rounded-sm" />
          <input
            type="color"
            value={form.tileHex}
            onChange={(e) => setForm({ ...form, tileHex: e.target.value })}
            className="h-9 w-9 flex-shrink-0 cursor-pointer rounded-sm border border-ink/20 bg-transparent p-0.5"
            aria-label="Tile color"
          />
          <input
            required
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="min-w-0 flex-1 rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
        </div>

        <input
          placeholder="Blurb (e.g. Coats, jackets, shells)"
          value={form.blurb}
          onChange={(e) => setForm({ ...form, blurb: e.target.value })}
          className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
        />

        {error && <p className="font-body text-[11px] text-red-500">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Saving..." : initial ? "Save Changes" : "Add Category"}
        </Button>
      </form>
    </Modal>
  );
}
