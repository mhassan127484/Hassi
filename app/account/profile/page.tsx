"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "@/lib/actions/profile";
import { useToastStore } from "@/store/toast";
import Button from "@/components/ui/Button";
import { User } from "@/types";

export default function ProfilePage() {
  const push = useToastStore((s) => s.push);
  const [form, setForm] = useState<User>({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then((profile) => {
      if (profile) setForm(profile);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: form.name, email: form.email, phone: form.phone });
      push("Profile updated", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label className="font-body text-xs uppercase tracking-widest text-stone">Full Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
        />
      </div>
      <div>
        <label className="font-body text-xs uppercase tracking-widest text-stone">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
        />
        <p className="mt-1 font-body text-[11px] text-ink/40">Changing this sends a confirmation link to the new address.</p>
      </div>
      <div>
        <label className="font-body text-xs uppercase tracking-widest text-stone">Phone</label>
        <input
          value={form.phone ?? ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mt-2 w-full rounded-sm border border-ink/20 bg-transparent px-4 py-3 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
        />
      </div>
      <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
    </form>
  );
}
