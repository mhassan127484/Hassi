import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Throws unless the current session belongs to an admin. RLS enforces this too — this just gives a clean error early. */
export async function assertAdmin() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Not signed in");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();
  if (!profile?.is_admin) throw new Error("Not authorized");
}
