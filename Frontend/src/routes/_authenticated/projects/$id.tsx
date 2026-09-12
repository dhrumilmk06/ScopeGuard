import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, StatusBadge, EmptyState } from "@/components/PageHeader";
import {
  createChangeRequest,
  createDeliverable,
  deleteDeliverable,
  getProject,
  listDeliverables,
  listProjectChangeRequests,
  updateProject,
} from "@/lib/api";
import { formatPaise, paiseToRupees, rupeesToPaise } from "@/lib/money";

export const Route = createFileRoute("/_authenticated/projects/$id")({
  head: () => ({
    meta: [
      { title: "Project — ScopeGuard" },
      { name: "description", content: "Deliverables, change requests and the client scope link." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const project = useQuery({ queryKey: ["projects", id], queryFn: () => getProject(id) });
  const deliverables = useQuery({
    queryKey: ["deliverables", id],
    queryFn: () => listDeliverables(id),
  });
  const changeRequests = useQuery({
    queryKey: ["change_requests", id],
    queryFn: () => listProjectChangeRequests(id),
  });

  const [d, setD] = useState({
    name: "",
    description: "",
    qty: "1",
    unit_price: "",
    included_revisions: "2",
  });
  const [cr, setCr] = useState({ title: "", description: "", price_impact: "", days_impact: "0" });

  const addDeliverable = useMutation({
    mutationFn: async () => {
      if (!d.name.trim()) throw new Error("Name the deliverable");
      return createDeliverable({
        project_id: id,
        name: d.name.trim(),
        description: d.description || null,
        qty: Number(d.qty) || 1,
        unit_price: rupeesToPaise(d.unit_price),
        included_revisions: Number(d.included_revisions) || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverables", id] });
      setD({ name: "", description: "", qty: "1", unit_price: "", included_revisions: "2" });
      toast.success("Deliverable added");
    },
    onError: (e) => toast.error(e.message),
  });

  const removeDeliverable = useMutation({
    mutationFn: (deliverableId: string) => deleteDeliverable(deliverableId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deliverables", id] }),
    onError: (e) => toast.error(e.message),
  });

  const addChangeRequest = useMutation({
    mutationFn: async () => {
      if (!cr.title.trim()) throw new Error("Describe the change in a title");
      return createChangeRequest({
        project_id: id,
        title: cr.title.trim(),
        description: cr.description || null,
        price_impact: rupeesToPaise(cr.price_impact),
        days_impact: Number(cr.days_impact) || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["change_requests", id] });
      queryClient.invalidateQueries({ queryKey: ["change_requests"] });
      setCr({ title: "", description: "", price_impact: "", days_impact: "0" });
      toast.success("Change request sent for approval");
    },
    onError: (e) => toast.error(e.message),
  });

  const togglePublic = useMutation({
    mutationFn: (is_public: boolean) => updateProject(id, { is_public }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects", id] }),
    onError: (e) => toast.error(e.message),
  });

  if (project.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!project.data) return <p className="text-sm text-muted-foreground">Project not found.</p>;

  const p = project.data;
  const items = deliverables.data ?? [];
  const scopeTotal = items.reduce((sum, i) => sum + i.qty * Number(i.unit_price), 0);
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/s/${p.share_token}` : "";

  return (
    <div>
      <PageHeader
        title={p.title}
        description={`${p.client_name}${p.client_email ? ` · ${p.client_email}` : ""}`}
        action={<StatusBadge status={p.status} />}
      />

      <div className="mb-6 rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Client scope link</p>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view the scope and respond to change requests.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Public</span>
            <Switch
              checked={p.is_public}
              onCheckedChange={(v) => togglePublic.mutate(v)}
              aria-label="Make scope page public"
            />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Input readOnly value={shareUrl} className="font-mono text-xs" />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link copied");
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="deliverables">
        <TabsList>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="changes">Change requests</TabsTrigger>
        </TabsList>

        <TabsContent value="deliverables" className="mt-4 space-y-6">
          {items.length === 0 ? (
            <EmptyState
              title="No deliverables yet"
              description="List exactly what is included — that is what makes anything else out of scope."
            />
          ) : (
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        Qty {item.qty} · {formatPaise(Number(item.unit_price))} each ·{" "}
                        {item.used_revisions}/{item.included_revisions} revisions used
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-medium text-foreground">
                        {formatPaise(item.qty * Number(item.unit_price))}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDeliverable.mutate(item.id)}
                      >
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-border bg-secondary/40 px-4 py-3">
                <span className="text-sm font-medium text-foreground">Scope total</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatPaise(scopeTotal)}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">Add deliverable</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="dname">Name</Label>
                <Input
                  id="dname"
                  placeholder="Homepage design"
                  value={d.name}
                  onChange={(e) => setD({ ...d, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="ddesc">Description</Label>
                <Textarea
                  id="ddesc"
                  placeholder="What exactly is included"
                  value={d.description}
                  onChange={(e) => setD({ ...d, description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dqty">Quantity</Label>
                <Input
                  id="dqty"
                  type="number"
                  min="1"
                  value={d.qty}
                  onChange={(e) => setD({ ...d, qty: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dprice">Unit price (₹)</Label>
                <Input
                  id="dprice"
                  type="number"
                  step="0.01"
                  value={d.unit_price}
                  onChange={(e) => setD({ ...d, unit_price: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="drev">Included revisions</Label>
                <Input
                  id="drev"
                  type="number"
                  min="0"
                  value={d.included_revisions}
                  onChange={(e) => setD({ ...d, included_revisions: e.target.value })}
                />
              </div>
            </div>
            <Button
              className="mt-4"
              onClick={() => addDeliverable.mutate()}
              disabled={addDeliverable.isPending}
            >
              Add deliverable
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="changes" className="mt-4 space-y-6">
          {(changeRequests.data ?? []).length === 0 ? (
            <EmptyState
              title="No change requests"
              description="When the client asks for something outside the list above, raise it here with a price."
            />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
              {(changeRequests.data ?? []).map((c) => (
                <li key={c.id}>
                  <Link
                    to="/change-requests/$id"
                    params={{ id: c.id }}
                    className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPaise(Number(c.price_impact))} · +{c.days_impact} days
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground">New change request</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="ctitle">Title</Label>
                <Input
                  id="ctitle"
                  placeholder="Extra landing page variant"
                  value={cr.title}
                  onChange={(e) => setCr({ ...cr, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cdesc">Description</Label>
                <Textarea
                  id="cdesc"
                  placeholder="What the client asked for and why it is out of scope"
                  value={cr.description}
                  onChange={(e) => setCr({ ...cr, description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cprice">Price impact (₹)</Label>
                <Input
                  id="cprice"
                  type="number"
                  step="0.01"
                  value={cr.price_impact}
                  onChange={(e) => setCr({ ...cr, price_impact: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cdays">Timeline impact (days)</Label>
                <Input
                  id="cdays"
                  type="number"
                  min="0"
                  value={cr.days_impact}
                  onChange={(e) => setCr({ ...cr, days_impact: e.target.value })}
                />
              </div>
            </div>
            <Button
              className="mt-4"
              onClick={() => addChangeRequest.mutate()}
              disabled={addChangeRequest.isPending}
            >
              Send for approval
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Current scope total {formatPaise(scopeTotal)} (₹
              {paiseToRupees(scopeTotal).toLocaleString("en-IN")})
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
