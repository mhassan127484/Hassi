"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ReturnRequest {
  id: string;
  orderNumber: string;
  itemName: string;
  reason: string;
  status: "Requested" | "Approved" | "Rejected";
  date: string;
}

export async function getMyReturnRequests(): Promise<ReturnRequest[]> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data } = await supabase
    .from("return_requests")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => ({
    id: r.id,
    orderNumber: r.order_number,
    itemName: r.item_name,
    reason: r.reason,
    status: r.status,
    date: r.created_at,
  }));
}

export async function requestReturn(input: { orderNumber: string; itemName: string; reason: string }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in");

  const { error } = await supabase.from("return_requests").insert({
    user_id: userData.user.id,
    order_number: input.orderNumber,
    item_name: input.itemName,
    reason: input.reason,
  });
  if (error) throw error;
  revalidatePath("/account/returns");
}
