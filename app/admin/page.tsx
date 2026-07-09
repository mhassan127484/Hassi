import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminIndexPage() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();
  redirect(profile?.is_admin ? "/admin/dashboard" : "/admin/login");
}
