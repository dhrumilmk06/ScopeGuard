import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/AuthCard";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — ScopeGuard" },
      { name: "description", content: "Log in to your ScopeGuard account." },
      { property: "og:title", content: "Log in — ScopeGuard" },
      { property: "og:description", content: "Log in to your ScopeGuard account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <AuthCard mode="login" />,
});
