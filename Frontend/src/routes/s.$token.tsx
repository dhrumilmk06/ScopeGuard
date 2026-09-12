import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/PageHeader";
import { Logo } from "@/components/MarketingHeader";
import { getPublicScope, respondToChangeRequest } from "@/lib/api";
import { formatPaise } from "@/lib/money";

export const Route = createFileRoute("/s/$token")({
  head: () => ({
    meta: [
      { title: "Project scope — ScopeGuard" },
      {
        name: "description",
        content: "Review the agreed deliverables and respond to change requests.",
      },
      { property: "og:title", content: "Project scope — ScopeGuard" },
      { property: "og:description", content: "Review deliverables and approve change requests." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PublicScopePage,
});

function PublicScopePage() {
  const { token } = Route.useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["public_scope", token],
    queryFn: () => getPublicScope(token),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<Record<string, string>>({});

  const respond = useMutation({
    mutationFn: (vars: { crId: string; decision: "APPROVED" | "DECLINED" }) =>
      respondToChangeRequest({
        token,
        changeRequestId: vars.crId,
        decision: vars.decision,
        name,
        email,
        reason: reason[vars.crId] ?? "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public_scope", token] });
      toast.success("Thanks — your response has been recorded.");
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading scope…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-lg font-semibold text-foreground">This scope link isn't available</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The link may have been turned off or is incorrect. Please ask for a fresh link.
          </p>
        </div>
      </div>
    );
  }

  const scopeTotal = data.deliverables.reduce(
    (sum, d) => sum + d.qty * Number(d.unit_price),
    0,
  );
  const approvedExtras = data.change_requests
    .filter((c) => c.status === "APPROVED")
    .reduce((sum, c) => sum + Number(c.price_impact), 0);
  const pending = data.change_requests.filter((c) => c.status === "PENDING");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Logo className="text-sm" />
          <StatusBadge status={data.project.status} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {data.project.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Prepared for {data.project.client_name}</p>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground">What's included</h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <ul className="divide-y divide-border">
              {data.deliverables.map((d) => (
                <li key={d.id} className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    {d.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{d.description}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Qty {d.qty} · {d.used_revisions}/{d.included_revisions} revisions used
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-foreground">
                    {formatPaise(d.qty * Number(d.unit_price))}
                  </span>
                </li>
              ))}
              {data.deliverables.length === 0 && (
                <li className="p-4 text-sm text-muted-foreground">
                  No deliverables have been listed yet.
                </li>
              )}
            </ul>
            <div className="border-t border-border bg-secondary/40 px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agreed scope</span>
                <span className="font-medium text-foreground">{formatPaise(scopeTotal)}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">Approved extras</span>
                <span className="font-medium text-foreground">{formatPaise(approvedExtras)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border pt-2">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-semibold text-foreground">
                  {formatPaise(scopeTotal + approvedExtras)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {pending.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-1 text-sm font-semibold text-foreground">Waiting for your approval</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Add your name and email once, then approve or decline each request.
            </p>
            <div className="mb-4 grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="rname">Your name</Label>
                <Input id="rname" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="remail">Your email</Label>
                <Input
                  id="remail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <ul className="space-y-4">
              {pending.map((c) => (
                <li key={c.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{c.title}</p>
                      {c.description && (
                        <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {formatPaise(Number(c.price_impact))}
                      </p>
                      <p className="text-xs text-muted-foreground">+{c.days_impact} days</p>
                    </div>
                  </div>
                  <Textarea
                    className="mt-3"
                    placeholder="Reason (only needed if you decline)"
                    value={reason[c.id] ?? ""}
                    onChange={(e) => setReason({ ...reason, [c.id]: e.target.value })}
                  />
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      disabled={!name || respond.isPending}
                      onClick={() => respond.mutate({ crId: c.id, decision: "APPROVED" })}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!name || respond.isPending}
                      onClick={() => respond.mutate({ crId: c.id, decision: "DECLINED" })}
                    >
                      Decline
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Change history</h2>
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {data.change_requests.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">No changes requested so far.</li>
            )}
            {data.change_requests.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPaise(Number(c.price_impact))} · +{c.days_impact} days
                    {c.approver_name ? ` · by ${c.approver_name}` : ""}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Scope tracked with ScopeGuard
        </p>
      </main>
    </div>
  );
}
