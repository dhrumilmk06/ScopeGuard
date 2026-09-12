import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge, EmptyState } from "@/components/PageHeader";
import { listProjects } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — ScopeGuard" },
      { name: "description", content: "All your client projects and their scope status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["projects"], queryFn: listProjects });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Every project has its own scope page you can share with the client."
        action={
          <Button asChild>
            <Link to="/projects/new">New project</Link>
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Start with a title, your client's details and the deliverables you agreed on."
          action={
            <Button asChild>
              <Link to="/projects/new">Create project</Link>
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {(data ?? []).map((p) => (
            <li key={p.id}>
              <Link
                to="/projects/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.client_name}
                    {p.client_email ? ` · ${p.client_email}` : ""}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
