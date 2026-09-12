import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    APPROVED: "bg-[oklch(0.627_0.194_149.214)]/10 text-[oklch(0.48_0.15_149)]",
    PAID: "bg-[oklch(0.627_0.194_149.214)]/10 text-[oklch(0.48_0.15_149)]",
    ACTIVE: "bg-[oklch(0.627_0.194_149.214)]/10 text-[oklch(0.48_0.15_149)]",
    PENDING: "bg-amber-100 text-amber-800",
    SENT: "bg-amber-100 text-amber-800",
    DECLINED: "bg-destructive/10 text-destructive",
    DRAFT: "bg-secondary text-muted-foreground",
    COMPLETED: "bg-secondary text-muted-foreground",
    ARCHIVED: "bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        tone[status] ?? "bg-secondary text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
