export function formatDate(d: any): string {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString();
}

export function formatNumber(n: any): string {
  if (typeof n !== "number") return String(n);
  return n.toLocaleString();
}

export function formatCurrency(n: any, currency = "USD"): string {
  if (typeof n !== "number") return String(n);
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    n
  );
}
