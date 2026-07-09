"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, Search } from "lucide-react";
import { getAdminReviews, deleteReviewAsAdmin, AdminReview } from "@/lib/actions/admin-reviews";
import { useToastStore } from "@/store/toast";
import Stars from "@/components/ui/Stars";

export default function AdminReviewsPage() {
  const push = useToastStore((s) => s.push);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const refresh = () => getAdminReviews().then((r) => { setReviews(r); setLoading(false); });

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(
    () =>
      reviews.filter(
        (r) =>
          r.productName.toLowerCase().includes(query.toLowerCase()) ||
          r.author.toLowerCase().includes(query.toLowerCase()) ||
          r.title.toLowerCase().includes(query.toLowerCase())
      ),
    [reviews, query]
  );

  const handleDelete = async (r: AdminReview) => {
    try {
      await deleteReviewAsAdmin(r.id, r.productId, r.productSlug);
      push("Review deleted");
      refresh();
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tightest text-ink">Reviews</h1>

      <div className="mt-6 relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by product, author, or title..."
          className="w-full rounded-full border border-ink/20 bg-white py-2.5 pl-11 pr-4 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/50 focus:outline-none"
        />
      </div>

      <div className="mt-6 divide-y divide-ink/10 rounded-sm border border-ink/10 bg-white">
        {filtered.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 p-5">
            <div className="flex gap-4">
              {r.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.imageUrl} alt="" className="h-16 w-14 flex-shrink-0 rounded-sm object-cover" />
              )}
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-stone">{r.productName}</p>
                <div className="mt-1 flex items-center gap-3">
                  <p className="font-body text-sm font-medium text-ink">{r.author}</p>
                  <Stars rating={r.rating} />
                </div>
                {r.title && <p className="mt-2 font-body text-sm font-medium text-ink">{r.title}</p>}
                <p className="mt-1 max-w-xl font-body text-sm text-ink/65">{r.body}</p>
                <p className="mt-2 font-body text-[11px] text-ink/40">
                  {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(r)} className="flex-shrink-0 text-ink/50 hover:text-red-500">
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="p-8 text-center font-body text-sm text-ink/50">No reviews match your search.</p>
        )}
      </div>
    </div>
  );
}
