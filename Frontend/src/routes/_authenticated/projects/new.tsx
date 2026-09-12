import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { createProject } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/projects/new")({
  head: () => ({
    meta: [
      { title: "New project — ScopeGuard" },
      { name: "description", content: "Create a new client project and lock its scope." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewProject,
});

const schema = z.object({
  title: z.string().min(2, "Give the project a title"),
  client_name: z.string().min(2, "Who is the client?"),
  client_email: z.string().email("Enter a valid email").or(z.literal("")),
  client_phone: z.string().optional(),
});

type Values = z.infer<typeof schema>;

function NewProject() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", client_name: "", client_email: "", client_phone: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: Values) => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("You need to be signed in.");
      return createProject({
        user_id: data.user.id,
        title: values.title,
        client_name: values.client_name,
        client_email: values.client_email || null,
        client_phone: values.client_phone || null,
      });
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
      navigate({ to: "/projects/$id", params: { id: project.id } });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="max-w-xl">
      <PageHeader title="New project" description="You can add deliverables on the next screen." />

      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="space-y-5 rounded-lg border border-border bg-card p-6"
      >
        <div className="space-y-1.5">
          <Label htmlFor="title">Project title</Label>
          <Input id="title" placeholder="Brand website redesign" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client_name">Client name</Label>
          <Input id="client_name" placeholder="Acme Pvt Ltd" {...form.register("client_name")} />
          {form.formState.errors.client_name && (
            <p className="text-xs text-destructive">{form.formState.errors.client_name.message}</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="client_email">Client email</Label>
            <Input
              id="client_email"
              type="email"
              placeholder="ops@acme.com"
              {...form.register("client_email")}
            />
            {form.formState.errors.client_email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.client_email.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client_phone">Client phone</Label>
            <Input id="client_phone" placeholder="+91 98765 43210" {...form.register("client_phone")} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending}>
            Create project
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate({ to: "/projects" })}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
