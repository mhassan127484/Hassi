import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartLine } from "@/types";

interface CartState {
  items: CartLine[];
  promo: string | null;
  addItem: (line: CartLine) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQty: (productId: string, color: string, size: string, qty: number) => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  clear: () => void;
}

const sameLine = (a: CartLine, productId: string, color: string, size: string) =>
  a.productId === productId && a.color === color && a.size === size;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,
      addItem: (line) => {
        const existing = get().items.find((i) => sameLine(i, line.productId, line.color, line.size));
        if (existing) {
          set({
            items: get().items.map((i) =>
              sameLine(i, line.productId, line.color, line.size) ? { ...i, qty: i.qty + line.qty } : i
            ),
          });
        } else {
          set({ items: [...get().items, line] });
        }
      },
      removeItem: (productId, color, size) => {
        set({ items: get().items.filter((i) => !sameLine(i, productId, color, size)) });
      },
      updateQty: (productId, color, size, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, color, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            sameLine(i, productId, color, size) ? { ...i, qty } : i
          ),
        });
      },
      applyPromo: (code) => {
        const valid = code.trim().toUpperCase() === "HASSI10";
        if (valid) set({ promo: code.trim().toUpperCase() });
        return valid;
      },
      clearPromo: () => set({ promo: null }),
      clear: () => set({ items: [], promo: null }),
    }),
    { name: "hassi-cart", storage: createJSONStorage(() => localStorage) }
  )
);

export function cartSubtotal(items: CartLine[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function cartCount(items: CartLine[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export const PROMO_DISCOUNT_RATE = 0.1;
