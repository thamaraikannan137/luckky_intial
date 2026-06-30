export const STAGES = [
  "Quoted",
  "Advance Received",
  "In Production",
  "Ready for Delivery",
  "Delivered",
] as const;

export const CUSTOMER_TYPE_COLORS = {
  B2B: { bg: "#EBE1FF", color: "#8C57FF", label: "Shop / Business" },
  B2C: { bg: "#DDF3FF", color: "#16B1FF", label: "Individual" },
} as const;

export const STAGE_COLORS: Record<number, { bg: string; color: string }> = {
  0: { bg: "#ECECED", color: "#8A8D93" },
  1: { bg: "#DDF3FF", color: "#16B1FF" },
  2: { bg: "#FFF1D6", color: "#D99800" },
  3: { bg: "#EBE1FF", color: "#8C57FF" },
  4: { bg: "#E5F6D8", color: "#56CA00" },
};

export const NAV_ITEMS: {
  key: string;
  label: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
}[] = [
  { key: "dashboard", label: "Dashboard", href: "/", icon: "Dashboard" },
  { key: "customers", label: "Customers", href: "/customers", icon: "People" },
  { key: "orders", label: "Orders", href: "/orders", icon: "Assignment" },
  { key: "products", label: "Products", href: "/products", icon: "Inventory" },
  { key: "reports", label: "Reports", href: "/reports", icon: "BarChart", adminOnly: true },
];

export const PRODUCT_UNITS = [
  { value: "per_sqft", label: "Per sq.ft" },
  { value: "per_letter", label: "Per letter" },
  { value: "per_piece", label: "Per piece" },
  { value: "per_design", label: "Per design" },
] as const;

export const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
] as const;

export const PAYMENT_TYPES = [
  { value: "advance", label: "Advance" },
  { value: "partial", label: "Partial" },
  { value: "final_balance", label: "Final Balance" },
] as const;

export const COMPANY = {
  name: "Lukky Enterprises",
  tagline: "Custom Signage & Fabrication",
  addressLine: "Gandhipuram, Coimbatore – 641012",
  phone: "+91 98430 11225",
} as const;

export const DEFAULT_GST_RATE = 18;
