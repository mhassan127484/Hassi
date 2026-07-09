"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { AdminProduct, Category } from "@/types";
import { uploadProductImage } from "@/lib/actions/admin-products";
import ProductTile from "@/components/ProductTile";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 255) + amount);
  const g = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function tileFromHex(hex: string): [string, string] {
  return [hex, shade(hex, -60)];
}

export type VariantForm = { name: string; hex: string; file?: File; previewUrl?: string; existingImageUrl?: string };
export type PhotoForm = { file?: File; previewUrl?: string; existingUrl?: string };

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export type ProductFormState = {
  name: string;
  slug: string;
  brand: string;
  category: Category;
  price: string;
  stock: string;
  status: AdminProduct["status"];
  colors: VariantForm[];
  photos: PhotoForm[];
  sizes: string;
  drop: string;
  description: string;
  highlights: string;
  details: string;
  shipping: string;
  returns: string;
};

export type ResolvedProductFormState = Omit<ProductFormState, "colors" | "photos" | "sizes" | "highlights" | "details"> & {
  colors: { name: string; hex: string; imageUrl?: string }[];
  images: string[];
  sizes: string[];
  highlights: string[];
  details: Record<string, string>;
};

const blankVariant: VariantForm = { name: "Ink", hex: "#111114" };
const blank: ProductFormState = {
  name: "",
  slug: "",
  brand: "Hassi Standard",
  category: "Outerwear",
  price: "",
  stock: "",
  status: "Active",
  colors: [blankVariant],
  photos: [],
  sizes: "S, M, L, XL",
  drop: "Vol. 01",
  description: "",
  highlights: "",
  details: "",
  shipping: "Free standard shipping on orders over $50.",
  returns: "30-day returns on unworn pieces with tags attached.",
};

function colorsToForm(colors: AdminProduct["colors"]): VariantForm[] {
  return colors.map((c) => ({ name: c.name, hex: c.hex, existingImageUrl: c.image }));
}

function photosToForm(images: AdminProduct["images"]): PhotoForm[] {
  return images.map((url) => ({ existingUrl: url }));
}

function detailsToForm(details: Record<string, string>): string {
  return Object.entries(details).map(([k, v]) => `${k}: ${v}`).join("\n");
}

function parseDetails(text: string): Record<string, string> {
  const details: Record<string, string> = {};
  text.split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i === -1) return;
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (key && value) details[key] = value;
  });
  return details;
}

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: ResolvedProductFormState) => Promise<void>;
  initial?: AdminProduct | null;
  categories: string[];
}) {
  const [form, setForm] = useState<ProductFormState>(blank);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSlugTouched(!!initial);
    if (initial) {
      setForm({
        name: initial.name,
        slug: initial.slug,
        brand: initial.brand,
        category: initial.category,
        price: String(initial.price),
        stock: String(initial.stock),
        status: initial.status,
        colors: colorsToForm(initial.colors),
        photos: photosToForm(initial.images),
        sizes: initial.sizes.join(", "),
        drop: initial.drop,
        description: initial.description,
        highlights: initial.highlights.join("\n"),
        details: detailsToForm(initial.details),
        shipping: initial.shipping,
        returns: initial.returns,
      });
    } else {
      setForm({ ...blank, category: categories[0] ?? "" });
    }
    setError("");
  }, [initial, open]);

  const updateVariant = (index: number, patch: Partial<VariantForm>) => {
    setForm((f) => ({ ...f, colors: f.colors.map((c, i) => (i === index ? { ...c, ...patch } : c)) }));
  };

  const addVariant = () => {
    setForm((f) => ({ ...f, colors: [...f.colors, { name: "", hex: "#8A8681" }] }));
  };

  const removeVariant = (index: number) => {
    setForm((f) => ({ ...f, colors: f.colors.filter((_, i) => i !== index) }));
  };

  const handleImageChange = (index: number, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Each image must be under 2MB.");
      return;
    }
    setError("");
    updateVariant(index, { file, previewUrl: URL.createObjectURL(file) });
  };

  const addPhotos = (files: FileList | null) => {
    if (!files || !files.length) return;
    const next: PhotoForm[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError("Please choose image files.");
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setError("Each image must be under 2MB.");
        continue;
      }
      next.push({ file, previewUrl: URL.createObjectURL(file) });
    }
    if (next.length) setError("");
    setForm((f) => ({ ...f, photos: [...f.photos, ...next] }));
  };

  const removePhoto = (index: number) => {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.colors.length === 0) {
      setError("Add at least one color variant.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const resolvedColors = await Promise.all(
        form.colors.map(async (c) => {
          let imageUrl = c.existingImageUrl;
          if (c.file) {
            const fd = new FormData();
            fd.set("file", c.file);
            imageUrl = await uploadProductImage(fd);
          }
          return { name: c.name, hex: c.hex, imageUrl };
        })
      );
      const resolvedImages = await Promise.all(
        form.photos.map(async (p) => {
          if (p.file) {
            const fd = new FormData();
            fd.set("file", p.file);
            return uploadProductImage(fd);
          }
          return p.existingUrl!;
        })
      );
      await onSubmit({
        name: form.name,
        slug: form.slug,
        brand: form.brand,
        category: form.category,
        price: form.price,
        stock: form.stock,
        status: form.status,
        colors: resolvedColors,
        images: resolvedImages,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        drop: form.drop,
        description: form.description,
        highlights: form.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
        details: parseDetails(form.details),
        shipping: form.shipping,
        returns: form.returns,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      <p className="font-body text-xs uppercase tracking-widest text-stone">
        {initial ? "Edit Product" : "Add Product"}
      </p>
      <form onSubmit={handleSubmit} className="mt-5 max-h-[70vh] space-y-6 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
            }}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <input
              required
              placeholder="url-slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: slugify(e.target.value) });
              }}
              className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
            />
            <p className="mt-1.5 font-body text-[11px] text-ink/40">/product/{form.slug || "..."}</p>
          </div>
          <input
            required
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            required
            type="number"
            min={0}
            placeholder="Price (USD)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <input
            required
            type="number"
            min={0}
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as AdminProduct["status"] })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
          <input
            placeholder="Drop (e.g. Vol. 01)"
            value={form.drop}
            onChange={(e) => setForm({ ...form, drop: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <input
            placeholder="Sizes, comma separated (blank = one size)"
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none sm:col-span-2"
          />
        </div>

        <div className="space-y-4">
          <p className="font-body text-xs uppercase tracking-widest text-stone">Details</p>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <textarea
            placeholder={"Highlights, one per line\ne.g. 100% merino wool"}
            value={form.highlights}
            onChange={(e) => setForm({ ...form, highlights: e.target.value })}
            rows={4}
            className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <textarea
            placeholder={"Size & Fit, one \"Key: Value\" per line\ne.g. Material: 100% merino wool\nFit: Relaxed, true to size"}
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            rows={4}
            className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <textarea
            placeholder="Shipping"
            value={form.shipping}
            onChange={(e) => setForm({ ...form, shipping: e.target.value })}
            rows={2}
            className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <textarea
            placeholder="Returns"
            value={form.returns}
            onChange={(e) => setForm({ ...form, returns: e.target.value })}
            rows={2}
            className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="font-body text-xs uppercase tracking-widest text-stone">Color Variants</p>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 font-body text-xs uppercase tracking-widest text-cobalt"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Variant
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {form.colors.map((variant, i) => {
              const previewImage = variant.previewUrl ?? variant.existingImageUrl;
              return (
                <div key={i} className="flex items-center gap-3 rounded-sm border border-ink/10 p-3">
                  {previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewImage} alt={variant.name || "Variant"} className="h-14 w-12 flex-shrink-0 rounded-sm object-cover" />
                  ) : (
                    <ProductTile tile={tileFromHex(variant.hex || "#111114")} className="h-14 w-12 flex-shrink-0 rounded-sm" />
                  )}

                  <input
                    required
                    placeholder="Color name"
                    value={variant.name}
                    onChange={(e) => updateVariant(i, { name: e.target.value })}
                    className="min-w-0 flex-1 rounded-sm border border-ink/20 bg-transparent px-3 py-2 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
                  />

                  <input
                    type="color"
                    value={variant.hex}
                    onChange={(e) => updateVariant(i, { hex: e.target.value })}
                    className="h-9 w-9 flex-shrink-0 cursor-pointer rounded-sm border border-ink/20 bg-transparent p-0.5"
                    aria-label="Swatch color"
                  />

                  <label className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-ink/20 px-3 py-2 font-body text-xs uppercase tracking-widest text-ink transition-colors hover:border-ink/50">
                    <ImagePlus className="h-3.5 w-3.5" strokeWidth={2} />
                    <span className="hidden sm:inline">{previewImage ? "Replace" : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>

                  {previewImage && (
                    <button
                      type="button"
                      onClick={() => updateVariant(i, { file: undefined, previewUrl: undefined, existingImageUrl: undefined })}
                      aria-label="Remove image"
                      className="flex-shrink-0 text-ink/40 transition-colors hover:text-red-500"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    aria-label="Remove variant"
                    disabled={form.colors.length <= 1}
                    className="flex-shrink-0 text-ink/40 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-2 font-body text-[11px] text-ink/40">
            PNG or JPG per variant, up to 2MB. Falls back to a generated gradient tile when no image is uploaded.
          </p>
          {error && <p className="mt-1 font-body text-[11px] text-red-500">{error}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="font-body text-xs uppercase tracking-widest text-stone">Product Photos</p>
            <label className="flex cursor-pointer items-center gap-1.5 font-body text-xs uppercase tracking-widest text-cobalt">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Photos
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  addPhotos(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
          </div>

          {form.photos.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {form.photos.map((photo, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-sm border border-ink/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.previewUrl ?? photo.existingUrl} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                    className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-paper opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 font-body text-[11px] text-ink/40">
            General photos shown in the gallery alongside the selected color. PNG or JPG, up to 2MB each.
          </p>
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Saving..." : initial ? "Save Changes" : "Add Product"}
        </Button>
      </form>
    </Modal>
  );
}
