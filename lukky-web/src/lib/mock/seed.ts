import type { Customer, Order, OrderItem, Payment, Product, Sequences } from "./types";

const I = (cat: string, desc: string, qty: number, rate: number) => ({
  categoryName: cat,
  description: desc,
  qty,
  rate,
  amount: qty * rate,
});

export const seedCustomers: Customer[] = [
  { id: "C-1001", customerCode: "C-1001", type: "B2B", name: "Sri Murugan Textiles", contactPerson: "Senthil Kumar", phone: "+91 98430 22145", address: "Gandhipuram, Coimbatore", area: "Gandhipuram", gstin: "33ABLPS4521R1ZP", notes: "Repeat bulk orders, prefers UPI", deletedAt: null },
  { id: "C-1002", customerCode: "C-1002", type: "B2B", name: "Annapoorna Sweets & Snacks", contactPerson: "Rajesh Babu", phone: "+91 90031 55218", address: "Town Hall, Coimbatore", area: "Town Hall", gstin: "33AAEPA8842K1Z9", notes: "", deletedAt: null },
  { id: "C-1003", customerCode: "C-1003", type: "B2B", name: "RKV Hardware & Paints", contactPerson: "Vetrivel M", phone: "+91 99947 88210", address: "Mettupalayam Road, Coimbatore", area: "Mettupalayam Rd", gstin: "", notes: "GST pending", deletedAt: null },
  { id: "C-1004", customerCode: "C-1004", type: "B2B", name: "Lakshmi Jewellers", contactPerson: "Bala Subramaniam", phone: "+91 98942 31100", address: "Oppanakara St, Coimbatore", area: "Oppanakara St", gstin: "33AALFL2210M1Z4", notes: "Premium finish only", deletedAt: null },
  { id: "C-2001", customerCode: "C-2001", type: "B2C", name: "Karthik Raman", contactPerson: null, phone: "+91 99435 67012", address: "R.S. Puram, Coimbatore", area: "R.S. Puram", gstin: null, notes: "", deletedAt: null },
  { id: "C-2002", customerCode: "C-2002", type: "B2C", name: "Priya Dharshini", contactPerson: null, phone: "+91 73975 14260", address: "Saibaba Colony, Coimbatore", area: "Saibaba Colony", gstin: null, notes: "God idol for housewarming", deletedAt: null },
  { id: "C-2003", customerCode: "C-2003", type: "B2C", name: "Mohammed Irfan", contactPerson: null, phone: "+91 96265 33891", address: "Ukkadam, Coimbatore", area: "Ukkadam", gstin: null, notes: "", deletedAt: null },
  { id: "C-2004", customerCode: "C-2004", type: "B2C", name: "Deepa Lakshmi", contactPerson: null, phone: "+91 90420 78451", address: "Singanallur, Coimbatore", area: "Singanallur", gstin: null, notes: "", deletedAt: null },
];

export const seedProducts: Product[] = [
  { id: "CAT1", productCode: "CAT1", name: "LED Lighting Boards", unit: "per_sqft", cost: 300, rate: 450, stockQty: 120, lowStockAt: 40, isActive: true },
  { id: "CAT2", productCode: "CAT2", name: "Titanium Letters", unit: "per_letter", cost: 430, rate: 650, stockQty: 18, lowStockAt: 25, isActive: true },
  { id: "CAT3", productCode: "CAT3", name: "Brass Letters", unit: "per_letter", cost: 360, rate: 550, stockQty: 64, lowStockAt: 25, isActive: true },
  { id: "CAT4", productCode: "CAT4", name: "Aluminium Letters", unit: "per_letter", cost: 175, rate: 280, stockQty: 90, lowStockAt: 25, isActive: true },
  { id: "CAT5", productCode: "CAT5", name: "Sign Boards", unit: "per_sqft", cost: 110, rate: 180, stockQty: 210, lowStockAt: 50, isActive: true },
  { id: "CAT6", productCode: "CAT6", name: "CNC Door Designing", unit: "per_design", cost: 2400, rate: 3500, stockQty: 5, lowStockAt: 3, isActive: true },
  { id: "CAT7", productCode: "CAT7", name: "God Idols", unit: "per_piece", cost: 1800, rate: 2500, stockQty: 7, lowStockAt: 5, isActive: true },
  { id: "CAT8", productCode: "CAT8", name: "Party Flags", unit: "per_piece", cost: 28, rate: 45, stockQty: 640, lowStockAt: 100, isActive: true },
  { id: "CAT9", productCode: "CAT9", name: "Rubber Stamp", unit: "per_piece", cost: 150, rate: 250, stockQty: 22, lowStockAt: 30, isActive: true },
  { id: "CAT10", productCode: "CAT10", name: "Stone Engraving (Kalvettu)", unit: "per_sqft", cost: 600, rate: 900, stockQty: 35, lowStockAt: 20, isActive: true },
];

const orderDefs: { id: string; customerId: string; orderDate: string; deliveryDate: string; stage: number; items: ReturnType<typeof I>[] }[] = [
  { id: "O-2461", customerId: "C-1001", orderDate: "2026-06-10", deliveryDate: "2026-06-28", stage: 2, items: [I("Titanium Letters", '8" letters, mirror finish — shop fascia', 14, 650), I("Sign Boards", "ACP backing, 4×6 ft", 24, 180)] },
  { id: "O-2462", customerId: "C-1002", orderDate: "2026-06-18", deliveryDate: "2026-07-03", stage: 3, items: [I("LED Lighting Boards", "Glow sign, double-sided, 8×4 ft", 32, 450)] },
  { id: "O-2463", customerId: "C-2001", orderDate: "2026-06-22", deliveryDate: "2026-06-29", stage: 4, items: [I("Rubber Stamp", "Self-inking round + 2 address stamps", 3, 250)] },
  { id: "O-2464", customerId: "C-1003", orderDate: "2026-06-20", deliveryDate: "2026-07-08", stage: 1, items: [I("Aluminium Letters", '6" letters, powder-coated black', 22, 280), I("Sign Boards", "Flex print, 3×4 ft", 12, 180)] },
  { id: "O-2465", customerId: "C-1004", orderDate: "2026-06-12", deliveryDate: "2026-06-24", stage: 4, items: [I("Brass Letters", 'Polished brass, 5" — counter signage', 18, 550), I("CNC Door Designing", "Teak pattern, main entrance", 1, 3500)] },
  { id: "O-2466", customerId: "C-2002", orderDate: "2026-06-26", deliveryDate: "2026-07-05", stage: 0, items: [I("God Idols", "Panchaloha Ganesha, 12 inch", 1, 2500)] },
  { id: "O-2467", customerId: "C-2003", orderDate: "2026-06-15", deliveryDate: "2026-06-27", stage: 2, items: [I("Stone Engraving (Kalvettu)", "Black granite, name + date", 6, 900)] },
  { id: "O-2468", customerId: "C-1002", orderDate: "2026-05-28", deliveryDate: "2026-06-14", stage: 4, items: [I("Party Flags", "Festival bunting, printed both sides", 200, 45)] },
  { id: "O-2469", customerId: "C-1001", orderDate: "2026-06-28", deliveryDate: "2026-07-12", stage: 1, items: [I("LED Lighting Boards", "Branch board, 6×3 ft", 18, 450), I("Titanium Letters", 'Rose-gold, 6" letters', 8, 650)] },
  { id: "O-2470", customerId: "C-2004", orderDate: "2026-06-29", deliveryDate: "2026-07-02", stage: 0, items: [I("Sign Boards", "Name board, 2×4 ft acrylic", 8, 180)] },
];

export const seedOrders: Order[] = orderDefs.map((o) => ({
  id: o.id,
  orderCode: o.id,
  customerId: o.customerId,
  orderDate: o.orderDate,
  deliveryDate: o.deliveryDate,
  stage: o.stage,
  discountAmount: 0,
  internalNotes: null,
  status: "active" as const,
  deletedAt: null,
}));

export const seedOrderItems: OrderItem[] = orderDefs.flatMap((o) =>
  o.items.map((it, idx) => {
    const product = seedProducts.find((p) => p.name === it.categoryName);
    return {
      id: `${o.id}-L${idx + 1}`,
      orderId: o.id,
      productId: product?.id ?? null,
      categoryName: it.categoryName,
      description: it.description,
      qty: it.qty,
      rate: it.rate,
      amount: it.amount,
      lineNo: idx + 1,
    };
  }),
);

export const seedPayments: Payment[] = [
  { id: "P-501", paymentCode: "P-501", orderId: "O-2461", type: "advance", amount: 6000, paymentDate: "2026-06-10", mode: "upi", referenceNo: null },
  { id: "P-502", paymentCode: "P-502", orderId: "O-2462", type: "advance", amount: 7000, paymentDate: "2026-06-18", mode: "cash", referenceNo: null },
  { id: "P-503", paymentCode: "P-503", orderId: "O-2462", type: "partial", amount: 4000, paymentDate: "2026-06-25", mode: "upi", referenceNo: null },
  { id: "P-504", paymentCode: "P-504", orderId: "O-2463", type: "final_balance", amount: 750, paymentDate: "2026-06-29", mode: "cash", referenceNo: null },
  { id: "P-505", paymentCode: "P-505", orderId: "O-2464", type: "advance", amount: 3000, paymentDate: "2026-06-20", mode: "bank_transfer", referenceNo: null },
  { id: "P-506", paymentCode: "P-506", orderId: "O-2465", type: "advance", amount: 6000, paymentDate: "2026-06-12", mode: "upi", referenceNo: null },
  { id: "P-507", paymentCode: "P-507", orderId: "O-2465", type: "final_balance", amount: 7400, paymentDate: "2026-06-24", mode: "bank_transfer", referenceNo: null },
  { id: "P-508", paymentCode: "P-508", orderId: "O-2467", type: "advance", amount: 2500, paymentDate: "2026-06-15", mode: "cash", referenceNo: null },
  { id: "P-509", paymentCode: "P-509", orderId: "O-2468", type: "advance", amount: 4000, paymentDate: "2026-05-28", mode: "cash", referenceNo: null },
  { id: "P-510", paymentCode: "P-510", orderId: "O-2468", type: "final_balance", amount: 5000, paymentDate: "2026-06-12", mode: "upi", referenceNo: null },
  { id: "P-511", paymentCode: "P-511", orderId: "O-2469", type: "advance", amount: 5000, paymentDate: "2026-06-28", mode: "upi", referenceNo: null },
];

export const seedSequences: Sequences = {
  order: 2471,
  payment: 512,
  customerB2B: 1005,
  customerB2C: 2005,
  cat: 11,
};
