"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  getAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  AdminBlogPost,
  BlogPostInput,
} from "@/lib/actions/admin-blog";
import { useToastStore } from "@/store/toast";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import BlogFormModal from "@/components/admin/BlogFormModal";

export default function AdminBlogPage() {
  const push = useToastStore((s) => s.push);
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);

  const refresh = () => getAdminBlogPosts().then((p) => { setPosts(p); setLoading(false); });

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(
    () => posts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [posts, query]
  );

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: AdminBlogPost) => { setEditing(p); setModalOpen(true); };

  const handleSubmit = async (input: BlogPostInput) => {
    if (editing) {
      await updateBlogPost(editing.id, input);
      push("Post updated", "success");
    } else {
      await createBlogPost(input);
      push("Post added", "success");
    }
    setModalOpen(false);
    refresh();
  };

  const handleDelete = async (p: AdminBlogPost) => {
    await deleteBlogPost(p.id);
    push("Post deleted");
    refresh();
  };

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tightest text-ink">Blog</h1>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Post
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-full border border-ink/20 bg-white py-2.5 pl-11 pr-4 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-ink/10 text-left font-body text-xs uppercase tracking-widest text-stone">
              <th className="p-4">Post</th>
              <th className="p-4">Category</th>
              <th className="p-4">Author</th>
              <th className="p-4">Published</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="flex items-center gap-3 p-4">
                  {p.tileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.tileImageUrl} alt="" className="h-10 w-14 flex-shrink-0 rounded-sm object-cover" />
                  ) : (
                    <div className="h-10 w-14 flex-shrink-0 rounded-sm bg-ink/10" />
                  )}
                  <span className="font-body text-sm text-ink">{p.title}</span>
                </td>
                <td className="p-4 font-body text-sm text-ink/70">{p.category}</td>
                <td className="p-4 font-body text-sm text-ink/70">{p.author}</td>
                <td className="p-4 font-body text-sm text-ink/70">{p.publishedAt}</td>
                <td className="p-4">{p.featured && <Badge tone="cobalt">Featured</Badge>}</td>
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
          <p className="p-8 text-center font-body text-sm text-ink/50">No posts match your search.</p>
        )}
      </div>

      <BlogFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initial={editing} />
    </div>
  );
}
