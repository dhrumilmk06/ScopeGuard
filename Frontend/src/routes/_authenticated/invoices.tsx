import { createFileRoute } from "@tanstack/react-router";
import { InvoicesPage } from "@/pages/InvoicesPage";

export const Route = createFileRoute("/_authenticated/invoices")({
  head: () => ({
    meta: [
      { title: "Invoices — ScopeGuard" },
      { name: "description", content: "Raise and track invoices for scoped and extra work." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InvoicesPage,
});
