import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();
  if (!profile?.is_admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <AdminSidebar />
      </div>
      <div className="flex-1 lg:pl-64">
        <div className="lg:hidden">
          <AdminSidebar />
        </div>
        <main className="px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
