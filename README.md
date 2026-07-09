# Hassi — Vol. 01

A premium apparel e-commerce **frontend** built with Next.js 14 (App Router), TypeScript, Tailwind CSS and Framer Motion.

## Design language
- **Palette:** cream paper `#F2EEE6`, ink `#111114`, electric cobalt `#2B4CF0`, stone `#8A8681`.
- **Type:** Fraunces (display) + Space Grotesk (body) — bundled via `@fontsource-variable` so there is **no runtime Google Fonts fetch**.
- **Signature moments:** custom blend-mode cursor, magnetic buttons, staggered hero reveal, scroll-triggered product reveals, draggable oversized wordmark, cobalt marquee.
- Fully responsive, keyboard-focusable, and respects `prefers-reduced-motion`.

## Run it
```bash
npm install
npm run dev
# open http://localhost:3000
```

Build for production:
```bash
npm run build && npm start
```

## Structure
```
app/
  layout.tsx            # fonts, cursor, navbar, footer
  page.tsx              # home: hero, featured, manifesto, categories
  shop/page.tsx         # filterable grid
  product/[slug]/page.tsx  # detail + size selector (static params)
  cart/page.tsx         # empty state (Phase 2)
components/              # Hero, Navbar, Footer, ProductCard, Cursor, Magnetic, Marquee...
lib/products.ts         # mock catalog (gradient tiles instead of photos)
types/index.ts
```

## Product tiles
Since there are no image assets yet, products render as abstract gradient tiles derived from each item's `tile: [colorA, colorB]`. Swap `ProductTile` for `next/image` once you have photography.

## Roadmap (Phase 2 — backend)
- Cart state (Zustand or React Context) + persistent bag
- Next.js Route Handlers as a shared REST API for the web store **and** a Flutter client
- Auth + orders (Firebase or a Node/Laravel backend)
- Payments: JazzCash, Easypaisa, Safepay, and Cash on Delivery
- Admin: product CRUD + order management
