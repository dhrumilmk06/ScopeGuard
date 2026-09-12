import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge } from "@/components/PageHeader";
import { getChangeRequest, updateChangeRequest } from "@/lib/api";
import { formatPaise } from "@/lib/money";

export const Route = createFileRoute("/_authenticated/change-requests/$id")({
  head: () => ({
    meta: [
      { title: "Change request — ScopeGuard" },
      { name: "description", content: "Price impact, timeline impact and the approval trail." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChangeRequestDetail,
});

function ChangeRequestDetail() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["change_requests", "detail", id],
    queryFn: () => getChangeRequest(id),
  });

  const setStatus = useMutation({
    mutationFn: (status: "APPROVED" | "DECLINED" | "PENDING") =>
      updateChangeRequest(id, {
        status,
        approved_at: status === "APPROVED" ? new Date().toISOString() : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["change_requests"] });
      queryClient.invalidateQueries({ queryKey: ["change_requests", "detail", id] });
      toast.success("Change request updated");
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Change request not found.</p>;

  const rows = [
    { label: "Project", value: data.projects?.title ?? "—" },
    { label: "Client", value: data.projects?.client_name ?? "—" },
    { label: "Price impact", value: formatPaise(Number(data.price_impact)) },
    { label: "Timeline impact", value: `${data.days_impact} days` },
    { label: "Raised", value: new Date(data.created_at).toLocaleString("en-IN") },
    { label: "Approver", value: data.approver_name ?? "—" },
    { label: "Approver email", value: data.approver_email ?? "—" },
    {
      label: "Approved at",
      value: data.approved_at ? new Date(data.approved_at).toLocaleString("en-IN") : "—",
    },
    { label: "Approver device", value: data.approver_agent ?? "—" },
    { label: "Decline reason", value: data.decline_reason ?? "—" },
  ];

  return (
    <div>
      <PageHeader
        title={data.title}
        description={data.description ?? undefined}
        action={<StatusBadge status={data.status} />}
      />

      <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-4 px-4 py-3 text-sm">
            <dt className="w-40 shrink-0 text-muted-foreground">{row.label}</dt>
            <dd className="min-w-0 break-words text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      {data.status === "PENDING" && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => setStatus.mutate("APPROVED")}>Mark approved</Button>
          <Button variant="outline" onClick={() => setStatus.mutate("DECLINED")}>
            Mark declined
          </Button>
        </div>
      )}

      <div className="mt-6">
        <Link
          to="/change-requests"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Back to change requests
        </Link>
      </div>
    </div>
  );
}
