import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, StatusBadge, EmptyState } from "@/components/PageHeader";
import { listChangeRequests } from "@/lib/api";
import { formatPaise } from "@/lib/money";

export const Route = createFileRoute("/_authenticated/change-requests/")({
  head: () => ({
    meta: [
      { title: "Change requests — ScopeGuard" },
      { name: "description", content: "Every out-of-scope request and where it stands." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChangeRequestsPage,
});

function ChangeRequestsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["change_requests"],
    queryFn: listChangeRequests,
  });

  return (
    <div>
      <PageHeader
        title="Change requests"
        description="Priced, timestamped and answered by the client in writing."
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          title="No change requests yet"
          description="Raise one from inside a project the moment a client asks for something extra."
        />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {(data ?? []).map((c) => (
            <li key={c.id}>
              <Link
                to="/change-requests/$id"
                params={{ id: c.id }}
                className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.projects?.title ?? "Project"} · {formatPaise(Number(c.price_impact))} · +
                    {c.days_impact} days
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
