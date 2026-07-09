"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { getMyOrders } from "@/lib/actions/orders";
import { getMyReviews, submitReview, removeReview, MyReview } from "@/lib/actions/reviews";
import { useToastStore } from "@/store/toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import StarInput from "@/components/ui/StarInput";
import Stars from "@/components/ui/Stars";
import EmptyState from "@/components/ui/EmptyState";
import { Order } from "@/types";

export default function ReviewsPage() {
  const push = useToastStore((s) => s.push);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [target, setTarget] = useState<{ slug: string; name: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    const [o, r] = await Promise.all([getMyOrders(), getMyReviews()]);
    setOrders(o);
    setReviews(r);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const reviewedSlugs = useMemo(() => new Set(reviews.map((r) => r.productSlug)), [reviews]);

  const pending = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    orders
      .filter((o) => o.status === "Delivered")
      .flatMap((o) => o.items)
      .forEach((item) => {
        if (!reviewedSlugs.has(item.slug)) map.set(item.slug, { slug: item.slug, name: item.name });
      });
    return Array.from(map.values());
  }, [orders, reviewedSlugs]);

  const openReviewModal = (item: { slug: string; name: string }) => {
    setTarget(item);
    setRating(5);
    setTitle("");
    setBody("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setSubmitting(true);
    try {
      await submitReview({ productSlug: target.slug, rating, title, body });
      push("Review submitted — thank you", "success");
      setTarget(null);
      refresh();
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to submit review");
    }
    setSubmitting(false);
  };

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <div className="space-y-12">
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Pending Reviews</p>
        {pending.length === 0 ? (
          <p className="mt-4 font-body text-sm text-ink/50">Nothing waiting on a review right now.</p>
        ) : (
          <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {pending.map((item) => (
              <div key={item.slug} className="flex items-center justify-between gap-4 py-4">
                <p className="font-body text-sm text-ink">{item.name}</p>
                <Button size="sm" variant="secondary" onClick={() => openReviewModal(item)}>
                  Write a Review
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Your Reviews</p>
        {reviews.length === 0 ? (
          <EmptyState icon={Star} eyebrow="Reviews" title="No reviews yet." description="Reviews you write will show up here." />
        ) : (
          <div className="mt-4 space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-sm border border-ink/10 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-body text-sm font-medium text-ink">{r.productName}</p>
                    <Stars rating={r.rating} className="mt-1.5" />
                  </div>
                  <button onClick={() => removeReview(r.id, r.productSlug).then(refresh)} className="text-ink/40 hover:text-red-500">
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
                {r.title && <p className="mt-3 font-body text-sm font-medium text-ink">{r.title}</p>}
                <p className="mt-1 font-body text-sm leading-relaxed text-ink/65">{r.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!target} onClose={() => setTarget(null)}>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Review — {target?.name}</p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <StarInput value={rating} onChange={setRating} />
          <input
            required
            placeholder="Review title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <textarea
            required
            placeholder="Tell us about your experience"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          />
          <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting..." : "Submit Review"}</Button>
        </form>
      </Modal>
    </div>
  );
}
