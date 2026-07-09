import { BlogPost } from "@/types";

const ink: [string, string] = ["#111114", "#2A2A30"];
const cobalt: [string, string] = ["#2B4CF0", "#0B1B4D"];
const clay: [string, string] = ["#C9C2B4", "#8A8681"];
const moss: [string, string] = ["#525F45", "#111114"];
const rust: [string, string] = ["#B5502D", "#2A2A30"];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "how-to-build-a-timeless-wardrobe",
    title: "How to Build a Timeless Wardrobe",
    category: "Style",
    date: "2026-05-13",
    author: "Hassi Studio",
    tile: ink,
    featured: true,
    excerpt:
      "Fewer, better pieces beat a closet full of noise. Here's how we think about building a wardrobe that lasts years, not seasons.",
    body: [
      "A timeless wardrobe isn't about owning less for the sake of it — it's about owning things that keep earning their place. Every piece in a considered rotation should do more than one job: the overcoat that works over a suit and over a hoodie, the trouser that moves from studio to dinner.",
      "Start with fabric, not fit. Fit can be adjusted; a fabric that pills, bags, or fades unevenly cannot be undone. Wool, selvedge denim, and full-grain leather all age toward character rather than away from it — that's the test we build every drop against.",
      "Then build outward from three anchors: a coat, a trouser, and a knit, all in colors that speak to each other. Everything else — accessories, layers, footwear — should be chosen to extend those three, not compete with them.",
      "The result is a wardrobe that photographs the same in year one and year five, because nothing in it was ever a trend to begin with.",
    ],
  },
  {
    id: "2",
    slug: "5-style-tips-for-summer-2026",
    title: "5 Style Tips for Summer 2026",
    category: "Fashion",
    date: "2026-06-02",
    author: "Ayesha M.",
    tile: cobalt,
    excerpt:
      "Lighter fabrics, looser silhouettes, and five ways to keep your rotation sharp through the heat.",
    body: [
      "Summer dressing rewards restraint. Drop the layering logic of winter and let single pieces do the talking — a well-cut linen shirt worn open over a plain tee does more work than three accessories combined.",
      "1. Go up a shade. Sand, bone, and clay reflect heat and light better than black — and they photograph warmer too.",
      "2. Loosen the leg. Wide-leg trousers and relaxed shorts move air; slim fits trap it.",
      "3. One statement accessory, not three. A single cap or tote is a choice; five is clutter.",
      "4. Canvas over leather for footwear when the temperature climbs — it breathes and it's easier to keep clean.",
      "5. Wash less, air more. Linen and cotton knits recover their shape on a hanger in the shade faster than in a machine.",
    ],
  },
  {
    id: "3",
    slug: "the-ultimate-sneaker-guide",
    title: "The Ultimate Sneaker Guide",
    category: "Footwear",
    date: "2026-04-21",
    author: "Danish A.",
    tile: clay,
    excerpt:
      "From low-profile leather to canvas deck shoes — how to pick the right pair for the way you actually move.",
    body: [
      "A good sneaker rotation covers three situations: the everyday low-profile pair that goes with everything, a boot for weather and structure, and a canvas pair for warm months.",
      "Leather sneakers reward a bit of maintenance — a soft brush and a leather protector spray every few weeks keeps the upper from cracking and the color from patchning unevenly.",
      "Fit matters more in low-profile silhouettes than boots — there's less structure to hide a half-size mismatch. When in doubt with our Form Low Sneaker, true to size is the right call.",
    ],
  },
  {
    id: "4",
    slug: "sustainable-fashion-the-future",
    title: "Sustainable Fashion: The Future",
    category: "Sustainability",
    date: "2026-03-11",
    author: "Hassi Studio",
    tile: moss,
    excerpt:
      "Slower production, better materials, and why we make a small number of things instead of chasing every trend.",
    body: [
      "The fastest way to make fashion more sustainable isn't a new fabric — it's making less of it, better. We plan two drops a year instead of fifty-two, which means every piece is designed to be worn for years, not weeks.",
      "Vegetable-tanned leather, recycled nylon shells, and undyed wool all show up across the line not as a marketing layer but because they hold up longer and age with more character than their conventional counterparts.",
      "The most sustainable garment is still the one already in your closet — so our return policy exists to get sizing right the first time, not to encourage over-ordering.",
    ],
  },
  {
    id: "5",
    slug: "behind-the-hassi-brand",
    title: "Behind the Hassi Brand",
    category: "Studio",
    date: "2026-02-04",
    author: "Hassi Studio",
    tile: rust,
    excerpt:
      "Why we started in Karachi, why we chase fewer better pieces, and what Vol. 01 was built to prove.",
    body: [
      "Hassi started as a question: could a small studio out of Karachi make pieces that stood next to anything coming out of Milan or Tokyo, without pretending to be from either place?",
      "Vol. 01 was the answer — eighteen pieces, two seasons of fabric sourcing, and a refusal to ship anything we wouldn't wear ourselves for the next five years.",
      "Every future drop will be smaller than the last season's noise and larger in what it actually replaces in your rotation. That's the whole brand, really.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0];
export const recentPosts = blogPosts.filter((p) => p.id !== featuredPost.id);
