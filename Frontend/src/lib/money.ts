/** Money is ALWAYS stored as integer paise. */

export function formatPaise(paise: number | null | undefined): string {
  const value = (paise ?? 0) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

/** Convert a rupee input (string or number) into integer paise. */
export function rupeesToPaise(rupees: string | number): number {
  const n = typeof rupees === "string" ? Number(rupees.replace(/,/g, "")) : rupees;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function paiseToRupees(paise: number | null | undefined): number {
  return (paise ?? 0) / 100;
}
