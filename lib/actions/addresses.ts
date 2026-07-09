"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Address } from "@/types";

export type SavedAddress = Address & { id: string; label: string; isDefault?: boolean };

export async function getMyAddresses(): Promise<SavedAddress[]> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at");

  return (data ?? []).map((a) => ({
    id: a.id,
    label: a.label,
    isDefault: a.is_default,
    fullName: a.full_name,
    address: a.address,
    apartment: a.apartment ?? undefined,
    city: a.city,
    state: a.state,
    zip: a.zip,
    country: a.country,
    phone: a.phone,
  }));
}

export async function addAddress(input: Omit<SavedAddress, "id" | "isDefault">) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in");

  const { error } = await supabase.from("addresses").insert({
    user_id: userData.user.id,
    label: input.label,
    full_name: input.fullName,
    address: input.address,
    apartment: input.apartment,
    city: input.city,
    state: input.state,
    zip: input.zip,
    country: input.country,
    phone: input.phone,
  });
  if (error) throw error;
  revalidatePath("/account/addresses");
}

export async function removeAddress(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(id: string) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in");

  await supabase.from("addresses").update({ is_default: false }).eq("user_id", userData.user.id);
  const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
  if (error) throw error;
  revalidatePath("/account/addresses");
}
