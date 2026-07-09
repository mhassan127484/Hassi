"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { getMyOrders } from "@/lib/actions/orders";
import { getMyReturnRequests, requestReturn, ReturnRequest } from "@/lib/actions/returns";
import { useToastStore } from "@/store/toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { Order } from "@/types";

const REASONS = ["Wrong size", "Changed my mind", "Item damaged", "Not as described", "Other"];

export default function ReturnsPage() {
  const push = useToastStore((s) => s.push);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [target, setTarget] = useState<{ orderNumber: string; itemName: string } | null>(null);
  const [reason, setReason] = useState(REASONS[0]);
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    const [o, r] = await Promise.all([getMyOrders(), getMyReturnRequests()]);
    setOrders(o);
    setRequests(r);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const eligible = useMemo(
    () =>
      orders
        .filter((o) => o.status === "Delivered")
        .flatMap((o) => o.items.map((item) => ({ orderNumber: o.number, itemName: item.name }))),
    [orders]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setSubmitting(true);
    try {
      await requestReturn({ orderNumber: target.orderNumber, itemName: target.itemName, reason });
      push("Return request submitted", "success");
      setTarget(null);
      refresh();
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to submit request");
    }
    setSubmitting(false);
  };

  if (loading) return <p className="font-body text-sm text-ink/50">Loading...</p>;

  return (
    <div className="space-y-12">
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Eligible for Return</p>
        {eligible.length === 0 ? (
          <p className="mt-4 font-body text-sm text-ink/50">No delivered items are currently eligible for return.</p>
        ) : (
          <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {eligible.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-body text-sm text-ink">{item.itemName}</p>
                  <p className="font-body text-xs text-ink/50">Order #{item.orderNumber}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => { setTarget(item); setReason(REASONS[0]); }}>
                  Request Return
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Return Requests</p>
        {requests.length === 0 ? (
          <EmptyState icon={RotateCcw} eyebrow="Returns" title="No return requests." description="Requests you submit will appear here." />
        ) : (
          <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-body text-sm text-ink">{r.itemName}</p>
                  <p className="font-body text-xs text-ink/50">Order #{r.orderNumber} · {r.reason}</p>
                </div>
                <Badge tone={r.status === "Requested" ? "stone" : "outline"}>{r.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!target} onClose={() => setTarget(null)}>
        <p className="font-body text-xs uppercase tracking-widest text-stone">Return — {target?.itemName}</p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-sm border border-ink/20 bg-transparent px-4 py-2.5 font-body text-sm text-ink focus:border-ink/60 focus:outline-none"
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting..." : "Submit Request"}</Button>
        </form>
      </Modal>
    </div>
  );
}
