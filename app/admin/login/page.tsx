"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !data.user) {
      setSubmitting(false);
      setError(signInError?.message ?? "Invalid email or password.");
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", data.user.id).maybeSingle();
    if (!profile?.is_admin) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError("This account doesn't have admin access.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="text-center font-display text-3xl font-semibold tracking-tightest text-paper">
          Hassi<span className="text-cobalt">.</span>
        </p>
        <p className="mt-2 text-center font-body text-xs uppercase tracking-widest text-paper/40">Admin Panel</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-paper/50">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-sm border border-paper/20 bg-transparent px-4 py-3 font-body text-sm text-paper placeholder:text-paper/30 focus:border-paper/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-paper/50">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-sm border border-paper/20 bg-transparent px-4 py-3 font-body text-sm text-paper placeholder:text-paper/30 focus:border-paper/50 focus:outline-none"
            />
          </div>
          {error && <p className="font-body text-xs text-red-400">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full !bg-cobalt hover:!bg-paper hover:!text-ink">
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
