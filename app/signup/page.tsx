"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session) {
      router.push("/account");
      router.refresh();
    } else {
      setNeedsConfirmation(true);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="mx-auto max-w-sm px-6 pb-24 pt-28 text-center md:px-10 md:pt-36">
        <h1 className="font-display text-3xl font-semibold tracking-tightest text-ink">Check your email</h1>
        <p className="mt-3 font-body text-sm text-ink/60">
          We sent a confirmation link to {email}. Click it, then sign in.
        </p>
        <Button href="/login" className="mt-8">Go to Sign In</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Create Account" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tightest text-ink">Create Account</h1>
      <p className="mt-2 font-body text-sm text-ink/60">Join the list, track orders, save your wishlist.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none"
        />
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
          minLength={6}
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink/60 focus:outline-none"
        />
        {error && <p className="font-body text-xs text-red-500">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 font-body text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="text-cobalt">Sign in</Link>
      </p>
    </div>
  );
}
