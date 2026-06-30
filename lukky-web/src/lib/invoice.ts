import { DEFAULT_GST_RATE } from "@/lib/constants";
import { formatDate, formatINR, toNumber } from "@/lib/format";

export type InvoiceKind = "advance" | "final";

export type InvoiceItem = {
  category: string;
  description: string;
  qtyLabel: string;
  rateFmt: string;
  amountFmt: string;
};

export type InvoiceData = {
  kind: InvoiceKind;
  docTitle: string;
  titleColor: string;
  docNo: string;
  dateFmt: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  hasGst: boolean;
  customerGst: string;
  orderId: string;
  deliveryFmt: string;
  items: InvoiceItem[];
  taxableFmt: string;
  cgstFmt: string;
  sgstFmt: string;
  totalFmt: string;
  paidFmt: string;
  balanceFmt: string;
  balLabel: string;
  balBg: string;
  balColor: string;
  footNote: string;
};

type ProductUnit = "per_sqft" | "per_letter" | "per_piece" | "per_design";

type OrderForInvoice = {
  orderCode: string;
  deliveryDate: string;
  total: number;
  paid: number;
  balance: number;
  customer?: {
    name: string;
    type: string;
    address?: string | null;
    phone: string;
    gstin?: string | null;
  } | null;
  items: {
    categoryName: string;
    description?: string | null;
    qty: number | string;
    rate: number | string;
    amount: number | string;
    productId?: string | null;
  }[];
};

function qtyLabel(qty: number, unit?: ProductUnit): string {
  if (unit === "per_sqft") return `${qty} sqft`;
  if (unit === "per_letter") return `${qty} ltr`;
  return String(qty);
}

export function buildInvoiceData(
  order: OrderForInvoice,
  kind: InvoiceKind,
  productUnits: Record<string, ProductUnit> = {},
): InvoiceData {
  const isAdvance = kind === "advance";
  const c = order.customer;
  const hasGst = c?.type === "B2B" && !!c.gstin;
  const total = toNumber(order.total);
  const paid = toNumber(order.paid);
  const balance = toNumber(order.balance);
  const taxable = hasGst ? total / (1 + DEFAULT_GST_RATE / 100) : total;
  const gstEach = hasGst ? (total - taxable) / 2 : 0;
  const orderNo = order.orderCode.replace("O-", "");

  return {
    kind,
    docTitle: isAdvance ? "ADVANCE RECEIPT" : "TAX INVOICE",
    titleColor: isAdvance ? "#D99800" : "#8C57FF",
    docNo: `${isAdvance ? "AR" : "INV"}-${orderNo}`,
    dateFmt: formatDate(new Date()),
    customerName: c?.name ?? "—",
    customerAddress: c?.address ?? "",
    customerPhone: c?.phone ?? "",
    hasGst,
    customerGst: c?.gstin ?? "",
    orderId: order.orderCode,
    deliveryFmt: formatDate(order.deliveryDate),
    items: order.items.map((it) => {
      const qty = toNumber(it.qty);
      const unit = it.productId ? productUnits[it.productId] : undefined;
      return {
        category: it.categoryName,
        description: it.description ?? "",
        qtyLabel: qtyLabel(qty, unit),
        rateFmt: formatINR(toNumber(it.rate)),
        amountFmt: formatINR(toNumber(it.amount)),
      };
    }),
    taxableFmt: formatINR(taxable),
    cgstFmt: formatINR(gstEach),
    sgstFmt: formatINR(gstEach),
    totalFmt: formatINR(total),
    paidFmt: formatINR(paid),
    balanceFmt: formatINR(balance),
    balLabel: balance > 0 ? "Balance Due" : "Paid in Full",
    balBg: balance > 0 ? "#FFE3E4" : "#E5F6D8",
    balColor: balance > 0 ? "#FF4C51" : "#56CA00",
    footNote: isAdvance
      ? "Advance received against the above order. Balance payable on delivery. Goods are custom-made and non-refundable."
      : "Thank you for your business. Goods once delivered will not be taken back. Subject to Coimbatore jurisdiction.",
  };
}
