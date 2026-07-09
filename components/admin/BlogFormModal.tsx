"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { AdminBlogPost, BlogPostInput, uploadBlogImage } from "@/lib/actions/admin-blog";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export type BlogFormState = {
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  featured: boolean;
  excerpt: string;
  body: string;
  file?: File;
  previewUrl?: string;
  existingImageUrl?: string;
};

const blank: BlogFormState = {
  title: "",
  category: "Style",
  author: "Hassi Studio",
  publishedAt: new Date().toISOString().slice(0, 10),
  featured: false,
  excerpt: "",
  body: "",
};

function toFormState(post: AdminBlogPost): BlogFormState {
  return {
    title: post.title,
    category: post.category,
    author: post.author,
    publishedAt: post.publishedAt,
    featured: post.featured,
    excerpt: post.excerpt,
    body: post.body.join("\n\n"),
    existingImageUrl: post.tileImageUrl,
  };
}

export default function BlogFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: BlogPostInput) => Promise<void>;
  initial?: AdminBlogPost | null;
}) {
  const [form, setForm] = useState<BlogFormState>(blank);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initial ? toFormState(initial) : blank);
    setError("");
  }, [initial, open]);

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
    const paragraphs = form.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    if (!paragraphs.length) {
      setError("Add at least one paragraph of body text.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      let tileImageUrl = form.existingImageUrl;
      if (form.file) {
        const fd = new FormData();
        fd.set("file", form.file);
        tileImageUrl = await uploadBlogImage(fd);
      }
      await onSubmit({
        title: form.title,
        category: form.category,
        author: form.author,
        publishedAt: form.publishedAt,
        featured: form.featured,
        excerpt: form.excerpt,
        body: paragraphs,
        tileImageUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setSubmitting(false);
  };

  const previewImage = form.previewUrl ?? form.existingImageUrl;

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      <p className="font-body text-xs uppercase tracking-widest text-stone">
        {initial ? "Edit Post" : "Add Post"}
      </p>
      <form onSubmit={handleSubmit} className="mt-5 max-h-[70vh] space-y-6 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none sm:col-span-2"
          />
          <input
            required
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <input
            required
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <input
            required
            type="date"
            value={form.publishedAt}
            onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
            className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <label className="flex items-center gap-2 px-1 font-body text-sm text-ink">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 rounded-sm border-ink/30"
            />
            Featured post
          </label>
        </div>

        <textarea
          required
          placeholder="Excerpt — a one or two sentence summary shown on the blog index"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows={2}
          className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
        />

        <textarea
          required
          placeholder="Body — separate paragraphs with a blank line"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          rows={8}
          className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
        />

        <div>
          <p className="font-body text-xs uppercase tracking-widest text-stone">Tile Image</p>
          <div className="mt-3 flex items-center gap-3">
            {previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewImage} alt="" className="h-16 w-24 flex-shrink-0 rounded-sm object-cover" />
            ) : (
              <div className="h-16 w-24 flex-shrink-0 rounded-sm bg-ink/10" />
            )}

            <label className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-ink/20 px-3 py-2 font-body text-xs uppercase tracking-widest text-ink transition-colors hover:border-ink/50">
              <ImagePlus className="h-3.5 w-3.5" strokeWidth={2} />
              {previewImage ? "Replace" : "Upload"}
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
          <p className="mt-2 font-body text-[11px] text-ink/40">
            PNG or JPG, up to 2MB. Falls back to a generated tile when no image is uploaded.
          </p>
          {error && <p className="mt-1 font-body text-[11px] text-red-500">{error}</p>}
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Saving..." : initial ? "Save Changes" : "Add Post"}
        </Button>
      </form>
    </Modal>
  );
}
