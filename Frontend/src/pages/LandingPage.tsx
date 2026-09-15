import { Link } from "@tanstack/react-router";
import { FileSignature, GitPullRequestArrow, ReceiptIndianRupee, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingFooter, MarketingHeader } from "@/components/MarketingHeader";

const features = [
  {
    icon: FileSignature,
    title: "A scope your client can see",
    body: "Every project gets a clean, shareable scope page listing deliverables, quantities, prices and included revisions.",
  },
  {
    icon: GitPullRequestArrow,
    title: "Changes approved in writing",
    body: "Out-of-scope asks become change requests with a price and timeline impact. Clients approve or decline on the record.",
  },
  {
    icon: ReceiptIndianRupee,
    title: "Bill the extras",
    body: "Approved changes roll straight into an invoice, so the work you did outside the contract actually gets paid.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:pt-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              For freelancers and small studios
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Stop scope creep before it costs you.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              ScopeGuard turns "just one small change" into a priced, approved, invoiceable change
              request — with a shareable scope page your client can check any time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/register">Start free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["No credit card", "Unlimited scope pages on Pro", "Made for INR billing"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="size-4 text-[oklch(0.627_0.194_149.214)]" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </section>

        <section className="border-y border-border/70 bg-card">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title}>
                <f.icon className="size-6 text-foreground" />
                <h2 className="mt-4 text-base font-semibold text-foreground">{f.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="rounded-lg border border-border bg-card p-8 sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Your next "quick favour" should come with a price tag.
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Set up your first project in a couple of minutes and send the scope link to your
              client today.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/register">Create your first project</Link>
            </Button>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
