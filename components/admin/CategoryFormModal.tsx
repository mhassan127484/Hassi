"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { AdminCategory, CategoryInput, uploadCategoryImage } from "@/lib/actions/admin-categories";
import ProductTile from "@/components/ProductTile";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { tileFromHex } from "@/components/admin/ProductFormModal";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

type FormState = {
  name: string;
  blurb: string;
  tileHex: string;
  file?: File;
  previewUrl?: string;
  existingImageUrl?: string;
};

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
    setForm(
      initial
        ? { name: initial.name, blurb: initial.blurb, tileHex: initial.tileHex, existingImageUrl: initial.imageUrl }
        : blank
    );
    setError("");
  }, [initial, open]);

  const previewImage = form.previewUrl ?? form.existingImageUrl;

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be under 2MB.");
      return;
    }
    setError("");
    setForm((f) => ({ ...f, file, previewUrl: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      let imageUrl = form.existingImageUrl;
      if (form.file) {
        const fd = new FormData();
        fd.set("file", form.file);
        imageUrl = await uploadCategoryImage(fd);
      }
      await onSubmit({ name: form.name, blurb: form.blurb, tileHex: form.tileHex, imageUrl });
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
          <ProductTile tile={tileFromHex(form.tileHex)} image={previewImage} className="h-14 w-12 flex-shrink-0 rounded-sm" />
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

        <div className="flex items-center gap-3">
          <label className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-ink/20 px-3 py-2 font-body text-xs uppercase tracking-widest text-ink transition-colors hover:border-ink/50">
            <ImagePlus className="h-3.5 w-3.5" strokeWidth={2} />
            {previewImage ? "Replace Photo" : "Upload Photo"}
            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0])} className="hidden" />
          </label>
          {previewImage && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, file: undefined, previewUrl: undefined, existingImageUrl: undefined }))}
              aria-label="Remove image"
              className="flex-shrink-0 text-ink/40 transition-colors hover:text-red-500"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>
        <p className="-mt-2 font-body text-[11px] text-ink/40">
          PNG or JPG, up to 2MB. Falls back to the tile color when no photo is uploaded.
        </p>

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
