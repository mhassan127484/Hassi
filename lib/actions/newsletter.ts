"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeToNewsletter(email: string): Promise<{ ok: boolean; alreadySubscribed?: boolean }> {
  const supabase = createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (error) {
    if (error.code === "23505") return { ok: true, alreadySubscribed: true };
    throw error;
  }
  return { ok: true };
}
