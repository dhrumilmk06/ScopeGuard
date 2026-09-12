import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingFooter, MarketingHeader } from "@/components/MarketingHeader";

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
  component: Pricing,
});

const plans = [
  {
    name: "Free",
    price: "₹0",
    cadence: "forever",
    description: "Try the whole flow on a single live project.",
    features: [
      "1 active project",
      "Shareable scope page",
      "Unlimited change requests",
      "Manual invoices",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    cadence: "per month",
    description: "For freelancers running several clients at once.",
    features: [
      "Unlimited projects",
      "Client approval trail with IP and device",
      "Invoice numbering and payment links",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Studio",
    price: "₹1,499",
    cadence: "per month",
    description: "Small teams sharing clients and scope templates.",
    features: ["Everything in Pro", "Up to 5 seats", "Shared templates", "Consolidated billing"],
    cta: "Talk to us",
    highlight: false,
  },
];

function Pricing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Pricing that pays for itself with one change request
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          All prices in INR. Money in ScopeGuard is always tracked to the paisa.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-lg border bg-card p-6 ${
                plan.highlight ? "border-foreground shadow-sm" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">{plan.name}</h2>
                {plan.highlight && (
                  <span className="rounded-full bg-[oklch(0.627_0.194_149.214)]/10 px-2 py-0.5 text-xs font-medium text-[oklch(0.5_0.16_149)]">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-4 text-3xl font-bold text-foreground">{plan.price}</p>
              <p className="text-sm text-muted-foreground">{plan.cadence}</p>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-foreground">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[oklch(0.627_0.194_149.214)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6" variant={plan.highlight ? "default" : "outline"} asChild>
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
