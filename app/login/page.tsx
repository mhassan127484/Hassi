"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

function LoginForm() {
  const router = useRouter();
  const redirectTo = useSearchParams().get("redirect") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sign In" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tightest text-ink">Sign In</h1>
      <p className="mt-2 font-body text-sm text-ink/60">Welcome back to Hassi.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none"
        />
        {error && <p className="font-body text-xs text-red-500">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 font-body text-sm text-ink/60">
        New to Hassi?{" "}
        <Link href="/signup" className="text-cobalt">Create an account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
