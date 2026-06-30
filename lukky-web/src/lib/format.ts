export function toNumber(value: { toString(): string } | number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return Number(value.toString()) || 0;
}

export function formatINR(amount: number): string {
  const neg = amount < 0;
  const n = Math.round(Math.abs(amount));
  const s = String(n);
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const formatted = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return `${neg ? "-" : ""}₹${formatted}`;
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateShort(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function daysFromToday(d: Date | string): number {
  const date = typeof d === "string" ? new Date(d) : d;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function deliveryLabel(days: number): { label: string; color: string } {
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, color: "#FF4C51" };
  if (days === 0) return { label: "Today", color: "#D99800" };
  if (days <= 3) return { label: `in ${days}d`, color: "#D99800" };
  return { label: `in ${days}d`, color: "#6D6B77" };
}
