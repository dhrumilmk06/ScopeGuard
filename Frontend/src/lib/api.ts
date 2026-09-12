import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type Deliverable = Tables<"deliverables">;
export type ChangeRequest = Tables<"change_requests">;
export type Invoice = Tables<"invoices">;

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

/* ---------- projects ---------- */

export async function listProjects(): Promise<Project[]> {
  return unwrap(
    await supabase.from("projects").select("*").order("created_at", { ascending: false }),
  );
}

export async function getProject(id: string): Promise<Project> {
  return unwrap(await supabase.from("projects").select("*").eq("id", id).single());
}

export async function createProject(input: TablesInsert<"projects">): Promise<Project> {
  return unwrap(await supabase.from("projects").insert(input).select("*").single());
}

export async function updateProject(id: string, patch: TablesUpdate<"projects">) {
  return unwrap(await supabase.from("projects").update(patch).eq("id", id).select("*").single());
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------- deliverables ---------- */

export async function listDeliverables(projectId: string): Promise<Deliverable[]> {
  return unwrap(
    await supabase
      .from("deliverables")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true }),
  );
}

export async function createDeliverable(input: TablesInsert<"deliverables">) {
  return unwrap(await supabase.from("deliverables").insert(input).select("*").single());
}

export async function updateDeliverable(id: string, patch: TablesUpdate<"deliverables">) {
  return unwrap(
    await supabase.from("deliverables").update(patch).eq("id", id).select("*").single(),
  );
}

export async function deleteDeliverable(id: string) {
  const { error } = await supabase.from("deliverables").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------- change requests ---------- */

export type ChangeRequestWithProject = ChangeRequest & {
  projects: { title: string; client_name: string } | null;
};

export async function listChangeRequests(): Promise<ChangeRequestWithProject[]> {
  return unwrap(
    await supabase
      .from("change_requests")
      .select("*, projects(title, client_name)")
      .order("created_at", { ascending: false }),
  );
}

export async function listProjectChangeRequests(projectId: string): Promise<ChangeRequest[]> {
  return unwrap(
    await supabase
      .from("change_requests")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  );
}

export async function getChangeRequest(id: string): Promise<ChangeRequestWithProject> {
  return unwrap(
    await supabase
      .from("change_requests")
      .select("*, projects(title, client_name)")
      .eq("id", id)
      .single(),
  );
}

export async function createChangeRequest(input: TablesInsert<"change_requests">) {
  return unwrap(await supabase.from("change_requests").insert(input).select("*").single());
}

export async function updateChangeRequest(id: string, patch: TablesUpdate<"change_requests">) {
  return unwrap(
    await supabase.from("change_requests").update(patch).eq("id", id).select("*").single(),
  );
}

/* ---------- invoices ---------- */

export type InvoiceWithProject = Invoice & {
  projects: { title: string; client_name: string } | null;
};

export async function listInvoices(): Promise<InvoiceWithProject[]> {
  return unwrap(
    await supabase
      .from("invoices")
      .select("*, projects(title, client_name)")
      .order("created_at", { ascending: false }),
  );
}

export async function createInvoice(input: TablesInsert<"invoices">) {
  return unwrap(await supabase.from("invoices").insert(input).select("*").single());
}

export async function updateInvoice(id: string, patch: TablesUpdate<"invoices">) {
  return unwrap(await supabase.from("invoices").update(patch).eq("id", id).select("*").single());
}

/* ---------- public scope page ---------- */

export type PublicScope = {
  project: {
    id: string;
    title: string;
    client_name: string;
    status: string;
    created_at: string;
    share_token: string;
  };
  deliverables: Array<{
    id: string;
    name: string;
    description: string | null;
    qty: number;
    unit_price: number;
    included_revisions: number;
    used_revisions: number;
  }>;
  change_requests: Array<{
    id: string;
    title: string;
    description: string | null;
    price_impact: number;
    days_impact: number;
    status: string;
    created_at: string;
    approver_name: string | null;
    approved_at: string | null;
    decline_reason: string | null;
  }>;
};

export async function getPublicScope(token: string): Promise<PublicScope | null> {
  const { data, error } = await supabase.rpc("get_public_scope", { p_token: token });
  if (error) throw new Error(error.message);
  return (data as unknown as PublicScope) ?? null;
}

export async function respondToChangeRequest(params: {
  token: string;
  changeRequestId: string;
  decision: "APPROVED" | "DECLINED";
  name?: string;
  email?: string;
  reason?: string;
}) {
  const { error } = await supabase.rpc("respond_change_request", {
    p_token: params.token,
    p_change_request_id: params.changeRequestId,
    p_decision: params.decision,
    p_name: params.name ?? "",
    p_email: params.email ?? "",
    p_reason: params.reason ?? "",
    p_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  });
  if (error) throw new Error(error.message);
}
