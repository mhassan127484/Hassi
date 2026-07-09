"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Address, CartLine, Order, OrderStatus } from "@/types";

async function nextOrderNumber(): Promise<string> {
  const admin = createAdminClient();
  const { data } = await admin.from("orders").select("number").order("created_at", { ascending: false }).limit(1);
  const last = data?.[0]?.number;
  const lastNum = last ? parseInt(last.replace(/\D/g, ""), 10) : 123450;
  return `HASSI${(isNaN(lastNum) ? 123450 : lastNum) + 1}`;
}

export async function createOrder(input: {
  items: CartLine[];
  email: string;
  address: Address;
  shippingMethod: "Standard" | "Express";
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}): Promise<{ number: string }> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id ?? null;
  const number = await nextOrderNumber();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      number,
      user_id: userId,
      email: input.email,
      status: "Placed",
      subtotal: input.subtotal,
      shipping: input.shipping,
      discount: input.discount,
      total: input.total,
      shipping_method: input.shippingMethod,
      address: input.address as unknown as Record<string, unknown>,
    })
    .select("id")
    .single();

  if (error || !order) throw error ?? new Error("Failed to create order");

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_slug: item.slug,
      product_name: item.name,
      price: item.price,
      color: item.color,
      color_image_url: null,
      size: item.size,
      qty: item.qty,
    }))
  );
  if (itemsError) throw itemsError;

  return { number };
}

function rowToOrder(order: Record<string, any>, items: Record<string, any>[]): Order {
  return {
    id: order.id,
    number: order.number,
    date: order.created_at,
    status: order.status,
    items: items.map((i) => ({
      productId: i.product_id ?? "",
      slug: i.product_slug,
      name: i.product_name,
      price: Number(i.price),
      color: i.color,
      colorTile: ["#111114", "#2A2A30"],
      size: i.size,
      qty: i.qty,
    })),
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    discount: Number(order.discount),
    total: Number(order.total),
    shippingMethod: order.shipping_method,
    address: order.address,
    email: order.email,
  };
}

/** Guest-safe lookup by exact order number — knowing the number is the access control, same as most storefronts. */
export async function getOrderByNumber(number: string): Promise<Order | null> {
  const clean = number.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("*").ilike("number", clean).maybeSingle();
  if (!order) return null;
  const { data: items } = await admin.from("order_items").select("*").eq("order_id", order.id);
  return rowToOrder(order, items ?? []);
}

export async function getMyOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });
  if (!orders?.length) return [];

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orders.map((o) => o.id));

  return orders.map((o) => rowToOrder(o, (items ?? []).filter((i) => i.order_id === o.id)));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

export async function getAllOrdersForAdmin(): Promise<Order[]> {
  const supabase = createClient();
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (!orders?.length) return [];
  const { data: items } = await supabase.from("order_items").select("*").in("order_id", orders.map((o) => o.id));
  return orders.map((o) => rowToOrder(o, (items ?? []).filter((i) => i.order_id === o.id)));
}
