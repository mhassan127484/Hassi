"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus, Trash2, X } from "lucide-react";
import {
  getReviewEligibility,
  getMyReviewForProduct,
  submitReview,
  uploadReviewImage,
  removeReview,
  ReviewEligibility,
  MyReview,
} from "@/lib/actions/reviews";
import { useToastStore } from "@/store/toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import StarInput from "@/components/ui/StarInput";
import Stars from "@/components/ui/Stars";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export default function WriteReviewSection({ productSlug }: { productSlug: string }) {
  const router = useRouter();
  const push = useToastStore((s) => s.push);
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null);
  const [myReview, setMyReview] = useState<MyReview | null>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getReviewEligibility(productSlug).then(setEligibility);
  }, [productSlug]);

  useEffect(() => {
    if (eligibility === "already-reviewed") getMyReviewForProduct(productSlug).then(setMyReview);
  }, [eligibility, productSlug]);

  const openModal = () => {
    setRating(5);
    setTitle("");
    setBody("");
    setFile(undefined);
    setPreviewUrl(undefined);
    setError("");
    setOpen(true);
  };

  const handleImageChange = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setError("Image must be under 2MB.");
      return;
    }
    setError("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      let imageUrl: string | undefined;
      if (file) {
        const fd = new FormData();
        fd.set("file", file);
        imageUrl = await uploadReviewImage(fd);
      }
      await submitReview({ productSlug, rating, title, body, imageUrl });
      push("Review submitted — thank you", "success");
      setOpen(false);
      setEligibility("already-reviewed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!myReview) return;
    setDeleting(true);
    try {
      await removeReview(myReview.id, productSlug);
      push("Review deleted");
      setMyReview(null);
      setEligibility("eligible");
      router.refresh();
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to delete review");
    }
    setDeleting(false);
  };

  if (eligibility === null || eligibility === "not-purchased") return null;

  if (eligibility === "signed-out") {
    return (
      <p className="font-body text-sm text-ink/50">
        <Link href="/login" className="text-cobalt hover:underline">
          Sign in
        </Link>{" "}
        to write a review.
      </p>
    );
  }

  if (eligibility === "already-reviewed") {
    return (
      <div className="rounded-sm border border-ink/10 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-stone">Your review</p>
            {myReview && <Stars rating={myReview.rating} className="mt-1.5" />}
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete review"
            className="text-ink/40 transition-colors hover:text-red-500 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        {myReview?.title && <p className="mt-2 font-body text-sm font-medium text-ink">{myReview.title}</p>}
        {myReview?.body && <p className="mt-1 font-body text-sm text-ink/65">{myReview.body}</p>}
        {myReview?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={myReview.imageUrl} alt="" className="mt-3 h-24 w-20 rounded-sm object-cover" />
        )}
      </div>
    );
  }

  return (
    <>
      <Button size="sm" variant="secondary" onClick={openModal}>
        Write a Review
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Write a Review</p>
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

          <div className="flex items-center gap-3">
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-14 w-12 flex-shrink-0 rounded-sm object-cover" />
            )}
            <label className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-ink/20 px-3 py-2 font-body text-xs uppercase tracking-widest text-ink transition-colors hover:border-ink/50">
              <ImagePlus className="h-3.5 w-3.5" strokeWidth={2} />
              {previewUrl ? "Replace Photo" : "Add a Photo"}
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0])} className="hidden" />
            </label>
            {previewUrl && (
              <button
                type="button"
                onClick={() => { setFile(undefined); setPreviewUrl(undefined); }}
                aria-label="Remove photo"
                className="flex-shrink-0 text-ink/40 transition-colors hover:text-red-500"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
          </div>

          {error && <p className="font-body text-[11px] text-red-500">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
