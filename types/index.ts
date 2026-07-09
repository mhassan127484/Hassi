export type Category =
  | "Outerwear"
  | "Knitwear"
  | "Denim"
  | "Accessories"
  | "Footwear"
  | "Bags";

export type Tag = "new" | "bestseller" | "low-stock";

export interface ProductColor {
  name: string;
  hex: string;
  /** two hex stops used to render the abstract product tile for this colorway */
  tile: [string, string];
  /** data URL of an admin-uploaded photo for this variant; falls back to the gradient tile when absent */
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  colors: ProductColor[];
  /** general product photos shown in the gallery alongside the active colorway, not tied to a specific color */
  images: string[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  drop: string;
  description: string;
  highlights: string[];
  details: Record<string, string>;
  shipping: string;
  returns: string;
  tags: Tag[];
  reviews: Review[];
  featured?: boolean;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  color: string;
  colorTile: [string, string];
  size: string;
  qty: number;
}

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface Address {
  fullName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  items: CartLine[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingMethod: "Standard" | "Express";
  address: Address;
  email: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  date: string;
  author: string;
  tile: [string, string];
  image?: string;
  featured?: boolean;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
}

export interface AdminProduct extends Product {
  status: "Active" | "Draft" | "Archived";
}
