import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const has = get().slugs.includes(slug);
        set({ slugs: has ? get().slugs.filter((s) => s !== slug) : [...get().slugs, slug] });
      },
      remove: (slug) => set({ slugs: get().slugs.filter((s) => s !== slug) }),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: "hassi-wishlist", storage: createJSONStorage(() => localStorage) }
  )
);
