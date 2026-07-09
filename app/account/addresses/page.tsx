"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { getMyAddresses, addAddress, removeAddress, setDefaultAddress, SavedAddress } from "@/lib/actions/addresses";
import { useToastStore } from "@/store/toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

const emptyForm = {
  label: "",
  fullName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
};

export default function AddressesPage() {
  const push = useToastStore((s) => s.push);
  const [addresses, setAddresses] = useState<SavedAddress[] | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const refresh = () => getMyAddresses().then(setAddresses);

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addAddress(form);
      push("Address added", "success");
      setForm(emptyForm);
      setOpen(false);
      refresh();
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to add address");
    }
    setSaving(false);
  };

  if (addresses === null) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-body text-xs uppercase tracking-widest text-stone">{addresses.length} saved</p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2} /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} eyebrow="Addresses" title="No addresses saved." description="Add an address to speed up checkout." />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="relative rounded-sm border border-ink/10 p-5">
              <div className="flex items-center justify-between">
                <p className="font-body text-sm font-medium text-ink">{a.label}</p>
                {a.isDefault && <Badge tone="outline">Default</Badge>}
              </div>
              <div className="mt-2 font-body text-sm leading-relaxed text-ink/60">
                <p>{a.fullName}</p>
                <p>{a.address}</p>
                <p>{a.city}, {a.state} {a.zip}</p>
                <p>{a.country}</p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                {!a.isDefault && (
                  <button onClick={() => setDefaultAddress(a.id).then(refresh)} className="font-body text-xs uppercase tracking-widest text-cobalt">
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => { removeAddress(a.id).then(refresh); push("Address removed"); }}
                  className="flex items-center gap-1 font-body text-xs uppercase tracking-widest text-ink/40 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={2} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <p className="font-body text-xs uppercase tracking-widest text-stone">New Address</p>
        <form onSubmit={handleAdd} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input required placeholder="Label (e.g. Home)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="sm:col-span-2 rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none" />
          <input required placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="sm:col-span-2 rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none" />
          <input required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="sm:col-span-2 rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none" />
          <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none" />
          <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none" />
          <input required placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none" />
          <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none" />
          <Button type="submit" disabled={saving} className="sm:col-span-2 mt-2">{saving ? "Saving..." : "Save Address"}</Button>
        </form>
      </Modal>
    </div>
  );
}
