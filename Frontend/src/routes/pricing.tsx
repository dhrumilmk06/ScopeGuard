import { createFileRoute } from "@tanstack/react-router";
import { PricingPage } from "@/pages/PricingPage";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ScopeGuard" },
      {
        name: "description",
        content:
          "Simple ScopeGuard pricing for freelancers: a free plan for your first project and a Pro plan for unlimited scope pages and invoices.",
      },
      { property: "og:title", content: "Pricing — ScopeGuard" },
      { property: "og:description", content: "Free to start. Pro at ₹499 per month." },
    ],
  }),
  component: PricingPage,
});
