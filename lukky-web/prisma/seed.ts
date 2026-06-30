import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.documentSequence.createMany({
    data: [
      { docType: "order", lastNumber: 10, fiscalYear: 2026 },
      { docType: "payment", lastNumber: 10, fiscalYear: 2026 },
      { docType: "customer_b2b", lastNumber: 4, fiscalYear: 2026 },
      { docType: "customer_b2c", lastNumber: 4, fiscalYear: 2026 },
    ],
    skipDuplicates: true,
  });

  await prisma.companySettings.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      businessName: "Lukky Enterprises",
      address: "Gandhipuram, Coimbatore – 641012",
      phone: "+91 98430 11225",
      email: "info@lukkyenterprises.in",
      gstin: "33AAAAA0000A1Z5",
    },
    update: {},
  });

  const products = await Promise.all(
    [
      { code: "CAT1", name: "LED Lighting Boards", unit: "per_sqft" as const, cost: 300, rate: 450, stock: 120, low: 40 },
      { code: "CAT2", name: "Titanium Letters", unit: "per_letter" as const, cost: 430, rate: 650, stock: 18, low: 25 },
      { code: "CAT3", name: "Brass Letters", unit: "per_letter" as const, cost: 360, rate: 550, stock: 64, low: 25 },
      { code: "CAT4", name: "Aluminium Letters", unit: "per_letter" as const, cost: 175, rate: 280, stock: 90, low: 25 },
      { code: "CAT5", name: "Sign Boards", unit: "per_sqft" as const, cost: 110, rate: 180, stock: 210, low: 50 },
      { code: "CAT6", name: "CNC Door Designing", unit: "per_design" as const, cost: 2400, rate: 3500, stock: 5, low: 3 },
      { code: "CAT7", name: "God Idols", unit: "per_piece" as const, cost: 1800, rate: 2500, stock: 7, low: 5 },
      { code: "CAT8", name: "Party Flags", unit: "per_piece" as const, cost: 28, rate: 45, stock: 640, low: 100 },
      { code: "CAT9", name: "Rubber Stamp", unit: "per_piece" as const, cost: 150, rate: 250, stock: 22, low: 30 },
      { code: "CAT10", name: "Stone Engraving (Kalvettu)", unit: "per_sqft" as const, cost: 600, rate: 900, stock: 35, low: 20 },
    ].map((p) =>
      prisma.product.upsert({
        where: { productCode: p.code },
        create: {
          productCode: p.code,
          name: p.name,
          unit: p.unit,
          cost: p.cost,
          rate: p.rate,
          stockQty: p.stock,
          lowStockAt: p.low,
        },
        update: {},
      }),
    ),
  );

  const murugan = await prisma.customer.upsert({
    where: { customerCode: "C-1001" },
    create: {
      customerCode: "C-1001",
      type: "B2B",
      name: "Sri Murugan Textiles",
      contactPerson: "Senthil Kumar",
      phone: "+91 98430 22145",
      address: "Gandhipuram, Coimbatore",
      area: "Gandhipuram",
      gstin: "33ABLPS4521R1ZP",
      notes: "Repeat bulk orders, prefers UPI",
    },
    update: {},
  });

  const titanium = products.find((p) => p.productCode === "CAT2")!;
  const signBoards = products.find((p) => p.productCode === "CAT5")!;

  const order = await prisma.order.upsert({
    where: { orderCode: "O-2461" },
    create: {
      orderCode: "O-2461",
      customerId: murugan.id,
      orderDate: new Date("2026-06-10"),
      deliveryDate: new Date("2026-06-28"),
      stage: 2,
      items: {
        create: [
          {
            productId: titanium.id,
            categoryName: "Titanium Letters",
            description: '8" letters, mirror finish — shop fascia',
            qty: 14,
            rate: 650,
            amount: 9100,
            lineNo: 1,
          },
          {
            productId: signBoards.id,
            categoryName: "Sign Boards",
            description: "ACP backing, 4×6 ft",
            qty: 24,
            rate: 180,
            amount: 4320,
            lineNo: 2,
          },
        ],
      },
      payments: {
        create: {
          paymentCode: "P-501",
          type: "advance",
          amount: 6000,
          paymentDate: new Date("2026-06-10"),
          mode: "upi",
        },
      },
    },
    update: {},
    include: { items: true },
  });

  console.log("Seeded:", { products: products.length, order: order.orderCode });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
