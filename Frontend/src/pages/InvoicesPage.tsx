import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, StatusBadge, EmptyState } from "@/components/PageHeader";
import { createInvoice, listInvoices, listProjects, updateInvoice } from "@/lib/api";
import { formatPaise, rupeesToPaise } from "@/lib/money";

export function InvoicesPage() {
  const queryClient = useQueryClient();
  const invoices = useQuery({ queryKey: ["invoices"], queryFn: listInvoices });
  const projects = useQuery({ queryKey: ["projects"], queryFn: listProjects });

  const [projectId, setProjectId] = useState("");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");

  const create = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error("Pick a project");
      if (!number.trim()) throw new Error("Give the invoice a number");
      return createInvoice({
        project_id: projectId,
        number: number.trim(),
        amount: rupeesToPaise(amount),
        status: "DRAFT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setNumber("");
      setAmount("");
      toast.success("Invoice created");
    },
    onError: (e) => toast.error(e.message),
  });

  const markPaid = useMutation({
    mutationFn: (id: string) =>
      updateInvoice(id, { status: "PAID", paid_at: new Date().toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Marked as paid");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Invoices" description="Amounts are stored to the paisa, shown in INR." />

      <div className="mb-8 rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">New invoice</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {(projects.data ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="number">Number</Label>
            <Input
              id="number"
              placeholder="INV-001"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="25000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={() => create.mutate()} disabled={create.isPending}>
          Create invoice
        </Button>
      </div>

      {(invoices.data ?? []).length === 0 ? (
        <EmptyState
          title="No invoices yet"
          description="Once a change request is approved, raise an invoice so the extra work gets paid."
        />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {(invoices.data ?? []).map((inv) => (
            <li key={inv.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {inv.number} · {formatPaise(Number(inv.amount))}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {inv.projects?.title ?? "Project"} · {inv.projects?.client_name}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={inv.status} />
                {inv.status !== "PAID" && (
                  <Button size="sm" variant="outline" onClick={() => markPaid.mutate(inv.id)}>
                    Mark paid
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
