import { toNumber } from "./format";

type AmountRow = { amount: number | string | { toString(): string } };
type PaymentRow = AmountRow & { type: string };

export function orderTotal(items: AmountRow[]): number {
  return items.reduce((s, i) => s + toNumber(i.amount), 0);
}

export function orderPaid(payments: PaymentRow[]): number {
  return payments
    .filter((p) => p.type !== "refund")
    .reduce((s, p) => s + toNumber(p.amount), 0);
}

export function orderBalance(items: AmountRow[], payments: PaymentRow[], discount = 0): number {
  return orderTotal(items) - discount - orderPaid(payments);
}
