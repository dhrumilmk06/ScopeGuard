import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/AuthCard";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — ScopeGuard" },
      { name: "description", content: "Create a free ScopeGuard account." },
      { property: "og:title", content: "Create your account — ScopeGuard" },
      { property: "og:description", content: "Create a free ScopeGuard account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <AuthCard mode="register" />,
});
