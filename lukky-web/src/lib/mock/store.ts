import { orderBalance, orderPaid, orderTotal } from "@/lib/orders";
import { daysFromToday, toNumber } from "@/lib/format";
import {
  seedCustomers,
  seedOrderItems,
  seedOrders,
  seedPayments,
  seedProducts,
  seedSequences,
} from "./seed";
import type { Customer, CustomerType, Order, OrderItem, Payment, PaymentMode, PaymentType, Product, ProductUnit, Sequences } from "./types";

type Store = {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  orderItems: OrderItem[];
  payments: Payment[];
  seq: Sequences;
};

const globalStore = globalThis as unknown as { __lukkyMock?: Store };

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function getStore(): Store {
  if (!globalStore.__lukkyMock) {
    globalStore.__lukkyMock = {
      customers: clone(seedCustomers),
      products: clone(seedProducts),
      orders: clone(seedOrders),
      orderItems: clone(seedOrderItems),
      payments: clone(seedPayments),
      seq: { ...seedSequences },
    };
  }
  return globalStore.__lukkyMock;
}

function activeOrders() {
  return getStore().orders.filter((o) => !o.deletedAt && o.status === "active");
}

function itemsFor(orderId: string) {
  return getStore().orderItems.filter((i) => i.orderId === orderId).sort((a, b) => a.lineNo - b.lineNo);
}

function paymentsFor(orderId: string) {
  return getStore().payments.filter((p) => p.orderId === orderId);
}

function customerById(id: string) {
  return getStore().customers.find((c) => c.id === id && !c.deletedAt);
}

function productById(id: string) {
  return getStore().products.find((p) => p.id === id && p.isActive);
}

function orderWithRelations(order: Order) {
  const customer = customerById(order.customerId);
  const items = itemsFor(order.id);
  const payments = paymentsFor(order.id);
  const total = orderTotal(items);
  const paid = orderPaid(payments);
  const balance = orderBalance(items, payments, order.discountAmount);
  return { ...order, customer, items, payments, total, paid, balance };
}

export function nextCode(docType: string): string {
  const s = getStore();
  if (docType === "order") {
    const n = s.seq.order++;
    return `O-${n}`;
  }
  if (docType === "payment") {
    const n = s.seq.payment++;
    return `P-${n}`;
  }
  if (docType === "customer_b2b") {
    const n = s.seq.customerB2B++;
    return `C-${n}`;
  }
  if (docType === "customer_b2c") {
    const n = s.seq.customerB2C++;
    return `C-${n}`;
  }
  const n = s.seq.cat++;
  return `CAT${n}`;
}

export function listCustomers(q = "", type?: string) {
  const s = getStore();
  let rows = s.customers.filter((c) => !c.deletedAt);
  if (type && type !== "all") rows = rows.filter((c) => c.type === type);
  const query = q.toLowerCase().trim();
  if (query) {
    rows = rows.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.replace(/\s/g, "").includes(query.replace(/\s/g, "")) ||
        (c.contactPerson || "").toLowerCase().includes(query),
    );
  }
  return rows
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => {
      const ords = activeOrders().filter((o) => o.customerId === c.id);
      const pending = ords.reduce((sum, o) => {
        const items = itemsFor(o.id);
        const pays = paymentsFor(o.id);
        return sum + Math.max(0, orderBalance(items, pays, o.discountAmount));
      }, 0);
      return {
        id: c.id,
        customerCode: c.customerCode,
        name: c.name,
        type: c.type,
        phone: c.phone,
        contactPerson: c.contactPerson,
        area: c.area,
        orderCount: ords.length,
        pending,
      };
    });
}

export function getCustomer(id: string) {
  const c = customerById(id);
  if (!c) return null;
  const orders = activeOrders()
    .filter((o) => o.customerId === id)
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
    .map((o) => {
      const items = itemsFor(o.id);
      const pays = paymentsFor(o.id);
      return {
        id: o.id,
        orderCode: o.orderCode,
        stage: o.stage,
        total: orderTotal(items),
        balance: orderBalance(items, pays, o.discountAmount),
        itemsSummary: items.map((i) => i.categoryName).slice(0, 2).join(", "),
        orderDate: o.orderDate,
      };
    });
  return { ...c, orders };
}

export function createCustomer(data: {
  type: CustomerType;
  name: string;
  contactPerson?: string;
  phone: string;
  address?: string;
  gstin?: string;
  notes?: string;
}) {
  const s = getStore();
  const isB2B = data.type === "B2B";
  const code = nextCode(isB2B ? "customer_b2b" : "customer_b2c");
  const area = (data.address?.split(",")[0] || data.address || "").trim();
  const customer: Customer = {
    id: code,
    customerCode: code,
    type: data.type,
    name: data.name.trim(),
    contactPerson: isB2B ? data.contactPerson?.trim() || null : null,
    phone: data.phone.trim(),
    address: data.address?.trim() || null,
    area: area || null,
    gstin: isB2B ? data.gstin?.trim() || null : null,
    notes: data.notes?.trim() || null,
    deletedAt: null,
  };
  s.customers.push(customer);
  return customer;
}

export function updateCustomer(
  id: string,
  data: {
    type: CustomerType;
    name: string;
    contactPerson?: string;
    phone: string;
    address?: string;
    gstin?: string;
    notes?: string;
  },
) {
  const s = getStore();
  const idx = s.customers.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const isB2B = data.type === "B2B";
  const area = (data.address?.split(",")[0] || data.address || "").trim();
  s.customers[idx] = {
    ...s.customers[idx],
    type: data.type,
    name: data.name.trim(),
    contactPerson: isB2B ? data.contactPerson?.trim() || null : null,
    phone: data.phone.trim(),
    address: data.address?.trim() || null,
    area: area || null,
    gstin: isB2B ? data.gstin?.trim() || null : null,
    notes: data.notes?.trim() || null,
  };
  return s.customers[idx];
}

export function deleteCustomer(id: string) {
  const c = getStore().customers.find((x) => x.id === id);
  if (!c) return false;
  c.deletedAt = new Date().toISOString();
  return true;
}

function productOrderUsage(productId: string) {
  return getStore().orderItems.filter((i) => i.productId === productId).length;
}

export function listProducts() {
  return getStore()
    .products.filter((p) => p.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({ ...p, orderUsage: productOrderUsage(p.id) }));
}

export function getProduct(id: string) {
  const p = productById(id);
  if (!p) return null;
  return { ...p, orderUsage: productOrderUsage(id) };
}

export function createProduct(data: {
  name: string;
  unit: ProductUnit;
  cost?: number;
  rate: number;
  stockQty?: number;
  lowStockAt?: number;
}) {
  const s = getStore();
  const code = nextCode("cat");
  const product: Product = {
    id: code,
    productCode: code,
    name: data.name.trim(),
    unit: data.unit,
    cost: data.cost ?? 0,
    rate: data.rate,
    stockQty: data.stockQty ?? 0,
    lowStockAt: data.lowStockAt ?? 10,
    isActive: true,
  };
  s.products.push(product);
  return product;
}

export function updateProduct(
  id: string,
  data: {
    name: string;
    unit: ProductUnit;
    cost?: number;
    rate: number;
    stockQty?: number;
    lowStockAt?: number;
  },
) {
  const s = getStore();
  const idx = s.products.findIndex((p) => p.id === id && p.isActive);
  if (idx < 0) return null;
  s.products[idx] = {
    ...s.products[idx],
    name: data.name.trim(),
    unit: data.unit,
    cost: data.cost ?? 0,
    rate: data.rate,
    stockQty: data.stockQty ?? s.products[idx].stockQty,
    lowStockAt: data.lowStockAt ?? s.products[idx].lowStockAt,
  };
  return s.products[idx];
}

export function deleteProduct(id: string) {
  const p = getStore().products.find((x) => x.id === id && x.isActive);
  if (!p) return false;
  p.isActive = false;
  return true;
}

export function listOrders(filter = "all") {
  const sorted = activeOrders().sort((a, b) => b.orderDate.localeCompare(a.orderDate));

  let rows = sorted.map((o) => {
      const customer = customerById(o.customerId);
      const items = itemsFor(o.id);
      const pays = paymentsFor(o.id);
      const total = orderTotal(items);
      const paid = orderPaid(pays);
      const balance = orderBalance(items, pays, o.discountAmount);
      const days = daysFromToday(o.deliveryDate);
      return {
        id: o.id,
        orderCode: o.orderCode,
        customerName: customer?.name ?? "—",
        customerType: customer?.type ?? "B2C",
        stage: o.stage,
        total,
        paid,
        balance,
        orderDate: o.orderDate,
        deliveryDate: o.deliveryDate,
        daysToDelivery: days,
        overdue: o.stage < 4 && days < 0,
      };
    });

  if (filter === "pending") rows = rows.filter((o) => o.balance > 0);
  else if (filter === "production") rows = rows.filter((o) => o.stage >= 1 && o.stage <= 3);
  else if (filter === "delivered") rows = rows.filter((o) => o.stage === 4);
  else if (filter === "overdue") rows = rows.filter((o) => o.overdue);

  return rows;
}

export function getOrder(id: string) {
  const o = activeOrders().find((x) => x.id === id);
  if (!o) return null;
  return orderWithRelations(o);
}

export function createOrder(data: {
  customerId: string;
  orderDate: string;
  deliveryDate: string;
  items: { productId: string; description?: string; qty: number; rate: number }[];
}) {
  const s = getStore();
  const code = nextCode("order");
  const order: Order = {
    id: code,
    orderCode: code,
    customerId: data.customerId,
    orderDate: data.orderDate,
    deliveryDate: data.deliveryDate || data.orderDate,
    stage: 0,
    discountAmount: 0,
    internalNotes: null,
    status: "active",
    deletedAt: null,
  };
  s.orders.unshift(order);
  data.items.forEach((it, idx) => {
    const product = productById(it.productId);
    s.orderItems.push({
      id: `${code}-L${idx + 1}`,
      orderId: code,
      productId: it.productId,
      categoryName: product?.name ?? "Item",
      description: it.description || null,
      qty: it.qty,
      rate: it.rate,
      amount: it.qty * it.rate,
      lineNo: idx + 1,
    });
  });
  return orderWithRelations(order);
}

export function updateOrder(
  id: string,
  patch: {
    stage?: number;
    deliveryDate?: string;
    orderDate?: string;
    customerId?: string;
    internalNotes?: string;
    discountAmount?: number;
    items?: { productId: string; description?: string; qty: number; rate: number }[];
  },
) {
  const s = getStore();
  const o = s.orders.find((x) => x.id === id);
  if (!o || o.deletedAt) return null;
  if (patch.stage !== undefined) o.stage = patch.stage;
  if (patch.deliveryDate) o.deliveryDate = patch.deliveryDate;
  if (patch.orderDate) o.orderDate = patch.orderDate;
  if (patch.customerId) o.customerId = patch.customerId;
  if (patch.internalNotes !== undefined) o.internalNotes = patch.internalNotes;
  if (patch.discountAmount !== undefined) o.discountAmount = patch.discountAmount;
  if (patch.items) {
    s.orderItems = s.orderItems.filter((i) => i.orderId !== id);
    patch.items.forEach((it, idx) => {
      const product = productById(it.productId);
      s.orderItems.push({
        id: `${id}-L${idx + 1}`,
        orderId: id,
        productId: it.productId,
        categoryName: product?.name ?? "Item",
        description: it.description || null,
        qty: it.qty,
        rate: it.rate,
        amount: it.qty * it.rate,
        lineNo: idx + 1,
      });
    });
  }
  return orderWithRelations(o);
}

export function deleteOrder(id: string) {
  const o = getStore().orders.find((x) => x.id === id);
  if (!o) return false;
  o.deletedAt = new Date().toISOString();
  return true;
}

export function createPayment(data: {
  orderId: string;
  type: PaymentType;
  amount: number;
  paymentDate: string;
  mode: PaymentMode;
  referenceNo?: string;
}) {
  const s = getStore();
  const code = nextCode("payment");
  const payment: Payment = {
    id: code,
    paymentCode: code,
    orderId: data.orderId,
    type: data.type,
    amount: data.amount,
    paymentDate: data.paymentDate,
    mode: data.mode,
    referenceNo: data.referenceNo || null,
  };
  s.payments.push(payment);

  const order = s.orders.find((o) => o.id === data.orderId);
  if (order) {
    const items = itemsFor(order.id);
    const pays = paymentsFor(order.id);
    const total = orderTotal(items);
    const paid = orderPaid(pays);
    if (pays.length === 1 && order.stage < 1) order.stage = 1;
    if (paid >= total && order.stage < 4) order.stage = Math.max(order.stage, 3);
  }

  return payment;
}

export function getDashboard() {
  const s = getStore();
  const customers = s.customers.filter((c) => !c.deletedAt);
  const b2b = customers.filter((c) => c.type === "B2B").length;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const summaries = activeOrders().map((o) => {
    const customer = customerById(o.customerId);
    const items = itemsFor(o.id);
    const pays = paymentsFor(o.id);
    const total = orderTotal(items);
    const paid = orderPaid(pays);
    const balance = orderBalance(items, pays, o.discountAmount);
    const days = daysFromToday(o.deliveryDate);
    return {
      id: o.id,
      orderCode: o.orderCode,
      customerName: customer?.name ?? "—",
      customerType: customer?.type ?? "B2B",
      stage: o.stage,
      total,
      paid,
      balance,
      orderDate: o.orderDate,
      deliveryDate: o.deliveryDate,
      daysToDelivery: days,
      delivered: o.stage === 4,
    };
  });

  const paymentsMonth = s.payments.filter((p) => {
    if (p.type === "refund") return false;
    const d = new Date(p.paymentDate);
    return d >= monthStart && d <= monthEnd;
  });

  const ordersMonth = activeOrders().filter((o) => {
    const d = new Date(o.orderDate);
    return d >= monthStart && d <= monthEnd;
  });

  const outstanding = summaries.reduce((sum, o) => sum + Math.max(0, o.balance), 0);
  const pendingCount = summaries.filter((o) => o.balance > 0).length;
  const collectedMonth = paymentsMonth.reduce((sum, p) => sum + toNumber(p.amount), 0);
  const billedMonth = ordersMonth.reduce((sum, o) => sum + orderTotal(itemsFor(o.id)), 0);

  return {
    kpis: {
      outstanding,
      pendingCount,
      collectedMonth,
      ordersMonthCount: ordersMonth.length,
      billedMonth,
      customers: customers.length,
      b2b,
      b2c: customers.length - b2b,
    },
    pendingList: summaries
      .filter((o) => o.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5),
    deliveryList: summaries
      .filter((o) => !o.delivered)
      .sort((a, b) => a.daysToDelivery - b.daysToDelivery)
      .slice(0, 5),
    pendingCount,
  };
}

export function getReports() {
  const catTotals: Record<string, number> = {};
  let b2b = 0;
  let b2c = 0;

  activeOrders().forEach((o) => {
    const customer = customerById(o.customerId);
    const items = itemsFor(o.id);
    const total = orderTotal(items);
    if (customer?.type === "B2B") b2b += total;
    else b2c += total;
    items.forEach((it) => {
      catTotals[it.categoryName] = (catTotals[it.categoryName] || 0) + toNumber(it.amount);
    });
  });

  const catSales = Object.entries(catTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  const max = catSales[0]?.amount ?? 1;
  const tot = b2b + b2c || 1;

  return {
    catSales: catSales.map((c) => ({ ...c, pct: Math.round((c.amount / max) * 100) })),
    split: { b2b, b2c, b2bPct: Math.round((b2b / tot) * 100), b2cPct: Math.round((b2c / tot) * 100) },
  };
}
