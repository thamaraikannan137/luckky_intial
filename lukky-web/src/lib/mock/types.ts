export type CustomerType = "B2B" | "B2C";
export type ProductUnit = "per_sqft" | "per_letter" | "per_piece" | "per_design";
export type PaymentType = "advance" | "partial" | "final_balance" | "refund";
export type PaymentMode = "cash" | "upi" | "bank_transfer" | "cheque";

export type Customer = {
  id: string;
  customerCode: string;
  type: CustomerType;
  name: string;
  contactPerson: string | null;
  phone: string;
  address: string | null;
  area: string | null;
  gstin: string | null;
  notes: string | null;
  deletedAt: string | null;
};

export type Product = {
  id: string;
  productCode: string;
  name: string;
  unit: ProductUnit;
  cost: number;
  rate: number;
  stockQty: number;
  lowStockAt: number;
  isActive: boolean;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  categoryName: string;
  description: string | null;
  qty: number;
  rate: number;
  amount: number;
  lineNo: number;
};

export type Payment = {
  id: string;
  paymentCode: string;
  orderId: string;
  type: PaymentType;
  amount: number;
  paymentDate: string;
  mode: PaymentMode;
  referenceNo: string | null;
};

export type Order = {
  id: string;
  orderCode: string;
  customerId: string;
  orderDate: string;
  deliveryDate: string;
  stage: number;
  discountAmount: number;
  internalNotes: string | null;
  status: "active" | "cancelled";
  deletedAt: string | null;
};

export type Sequences = {
  order: number;
  payment: number;
  customerB2B: number;
  customerB2C: number;
  cat: number;
};
