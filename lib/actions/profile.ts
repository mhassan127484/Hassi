"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { User } from "@/types";

export async function getMyProfile(): Promise<User | null> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userData.user.id).maybeSingle();

  return {
    name: profile?.full_name || userData.user.email?.split("@")[0] || "Customer",
    email: userData.user.email ?? "",
    phone: profile?.phone ?? undefined,
  };
}

export async function updateProfile(input: { name: string; email: string; phone?: string }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: input.name, phone: input.phone })
    .eq("id", userData.user.id);
  if (profileError) throw profileError;

  if (input.email !== userData.user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email: input.email });
    if (emailError) throw emailError;
  }

  revalidatePath("/account/profile");
}
