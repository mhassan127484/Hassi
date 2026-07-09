/** Hand-written to match supabase/schema.sql. Regenerate with the Supabase CLI once the project is live if the schema drifts. */

type Table<Row, Insert, Update> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
};

type CategoryRow = {
  id: string;
  name: string;
  blurb: string;
  tile_hex: string;
  created_at: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  sizes: string[];
  stock: number;
  rating: number;
  review_count: number;
  drop_name: string;
  description: string;
  highlights: string[];
  details: Record<string, string>;
  shipping: string;
  returns: string;
  tags: string[];
  status: "Active" | "Draft" | "Archived";
  created_at: string;
};

type ProductColorRow = {
  id: string;
  product_id: string;
  name: string;
  hex: string;
  image_url: string | null;
  sort_order: number;
};

type ProductImageRow = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};

type ReviewRow = {
  id: string;
  product_id: string;
  user_id: string | null;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
};

type AddressRow = {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
};

type OrderRow = {
  id: string;
  number: string;
  user_id: string | null;
  email: string;
  status: "Placed" | "Confirmed" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shipping_method: string;
  address: Record<string, unknown>;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_slug: string;
  product_name: string;
  price: number;
  color: string;
  color_image_url: string | null;
  size: string;
  qty: number;
};

type ReturnRequestRow = {
  id: string;
  user_id: string;
  order_number: string;
  item_name: string;
  reason: string;
  status: "Requested" | "Approved" | "Rejected";
  created_at: string;
};

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  author: string;
  published_at: string;
  tile_image_url: string | null;
  featured: boolean;
};

type NewsletterRow = {
  id: string;
  email: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        ProfileRow,
        { id: string; full_name?: string | null; phone?: string | null; is_admin?: boolean },
        { full_name?: string | null; phone?: string | null; is_admin?: boolean }
      >;
      categories: Table<CategoryRow, Partial<CategoryRow> & { name: string }, Partial<CategoryRow>>;
      products: Table<
        ProductRow,
        Partial<ProductRow> & { slug: string; name: string; price: number; category: string },
        Partial<ProductRow>
      >;
      product_colors: Table<ProductColorRow, Partial<ProductColorRow> & { product_id: string; name: string }, Partial<ProductColorRow>>;
      product_images: Table<ProductImageRow, Partial<ProductImageRow> & { product_id: string; image_url: string }, Partial<ProductImageRow>>;
      reviews: Table<
        ReviewRow,
        Partial<ReviewRow> & { product_id: string; author_name: string; rating: number },
        Partial<ReviewRow>
      >;
      addresses: Table<
        AddressRow,
        Partial<AddressRow> & { user_id: string; full_name: string; address: string; city: string; state: string; zip: string; phone: string },
        Partial<AddressRow>
      >;
      orders: Table<
        OrderRow,
        Partial<OrderRow> & { number: string; email: string; subtotal: number; total: number; address: Record<string, unknown> },
        Partial<OrderRow>
      >;
      order_items: Table<
        OrderItemRow,
        Partial<OrderItemRow> & { order_id: string; product_slug: string; product_name: string; price: number; color: string; size: string },
        Partial<OrderItemRow>
      >;
      return_requests: Table<
        ReturnRequestRow,
        Partial<ReturnRequestRow> & { user_id: string; order_number: string; item_name: string; reason: string },
        Partial<ReturnRequestRow>
      >;
      blog_posts: Table<BlogPostRow, Partial<BlogPostRow> & { slug: string; title: string; category: string }, Partial<BlogPostRow>>;
      newsletter_subscribers: Table<NewsletterRow, { email: string }, Partial<NewsletterRow>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
