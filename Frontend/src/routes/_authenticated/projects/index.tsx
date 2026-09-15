import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/pages/projects/ProjectsPage";

export const Route = createFileRoute("/_authenticated/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — ScopeGuard" },
      { name: "description", content: "All your client projects and their scope status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProjectsPage,
});
