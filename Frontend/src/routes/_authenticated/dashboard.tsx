import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge, EmptyState } from "@/components/PageHeader";
import { listProjects, listChangeRequests, listInvoices } from "@/lib/api";
import { formatPaise } from "@/lib/money";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ScopeGuard" },
      { name: "description", content: "Your projects, pending change requests and invoices." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const projects = useQuery({ queryKey: ["projects"], queryFn: listProjects });
  const changeRequests = useQuery({ queryKey: ["change_requests"], queryFn: listChangeRequests });
  const invoices = useQuery({ queryKey: ["invoices"], queryFn: listInvoices });

  const pending = (changeRequests.data ?? []).filter((c) => c.status === "PENDING");
  const approvedValue = (changeRequests.data ?? [])
    .filter((c) => c.status === "APPROVED")
    .reduce((sum, c) => sum + Number(c.price_impact), 0);
  const unpaid = (invoices.data ?? [])
    .filter((i) => i.status !== "PAID")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const stats = [
    { label: "Active projects", value: String((projects.data ?? []).length) },
    { label: "Pending change requests", value: String(pending.length) },
    { label: "Approved scope value", value: formatPaise(approvedValue) },
    { label: "Unpaid invoices", value: formatPaise(unpaid) },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Where your scope stands right now."
        action={
          <Button asChild>
            <Link to="/projects/new">New project</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Pending approvals</h2>
        {pending.length === 0 ? (
          <EmptyState
            title="Nothing waiting on your client"
            description="Change requests you send for approval will show up here until the client responds."
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {pending.map((cr) => (
              <li key={cr.id}>
                <Link
                  to="/change-requests/$id"
                  params={{ id: cr.id }}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{cr.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {cr.projects?.title ?? "Project"} · {cr.projects?.client_name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {formatPaise(Number(cr.price_impact))}
                    </span>
                    <StatusBadge status={cr.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Recent projects</h2>
        {(projects.data ?? []).length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create a project, add your deliverables, and share the scope link with your client."
            action={
              <Button asChild>
                <Link to="/projects/new">Create project</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {(projects.data ?? []).slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link
                  to="/projects/$id"
                  params={{ id: p.id }}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.client_name}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
