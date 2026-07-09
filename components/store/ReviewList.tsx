import { Review } from "@/types";
import Stars from "@/components/ui/Stars";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return <p className="font-body text-sm text-ink/50">No reviews yet.</p>;
  return (
    <div className="divide-y divide-ink/10">
      {reviews.map((r) => (
        <div key={r.id} className="py-6">
          <div className="flex items-center justify-between gap-4">
            <p className="font-body text-sm font-medium text-ink">{r.author}</p>
            <p className="font-body text-xs text-ink/40">
              {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <Stars rating={r.rating} className="mt-2" />
          <p className="mt-2 font-body text-sm font-medium text-ink">{r.title}</p>
          <p className="mt-1 font-body text-sm leading-relaxed text-ink/65">{r.body}</p>
          {r.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.image} alt="" className="mt-3 h-24 w-20 rounded-sm object-cover" />
          )}
        </div>
      ))}
    </div>
  );
}
