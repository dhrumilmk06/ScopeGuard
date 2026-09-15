import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/pages/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScopeGuard — Scope creep protection for freelancers" },
      {
        name: "description",
        content:
          "Lock your scope, get every change request approved in writing, and bill the extras. ScopeGuard keeps freelance projects inside their boundaries.",
      },
      { property: "og:title", content: "ScopeGuard — Scope creep protection for freelancers" },
      {
        property: "og:description",
        content: "Lock your scope, approve changes in writing, bill the extras.",
      },
    ],
  }),
  component: LandingPage,
});
