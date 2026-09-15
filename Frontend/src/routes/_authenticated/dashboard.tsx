import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ScopeGuard" },
      { name: "description", content: "Your projects, pending change requests and invoices." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});
