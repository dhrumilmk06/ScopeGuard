import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/SettingsPage";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ScopeGuard" },
      { name: "description", content: "Manage your ScopeGuard profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});
