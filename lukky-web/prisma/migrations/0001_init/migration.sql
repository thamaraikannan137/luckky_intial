-- Initial schema for Lukky Enterprises (Neon PostgreSQL)
-- Run via: npx prisma migrate dev --name init

CREATE TYPE "UserRole" AS ENUM ('admin', 'staff');
CREATE TYPE "CustomerType" AS ENUM ('B2B', 'B2C');
CREATE TYPE "ProductUnit" AS ENUM ('per_sqft', 'per_letter', 'per_piece', 'per_design');
CREATE TYPE "OrderStatus" AS ENUM ('active', 'cancelled');
CREATE TYPE "PaymentType" AS ENUM ('advance', 'partial', 'final_balance', 'refund');
CREATE TYPE "PaymentMode" AS ENUM ('cash', 'upi', 'bank_transfer', 'cheque');

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'staff',
    "display_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,
    "type" "CustomerType" NOT NULL,
    "name" TEXT NOT NULL,
    "contact_person" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "area" TEXT,
    "gstin" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customers_customer_code_key" ON "customers"("customer_code");
CREATE INDEX "customers_phone_idx" ON "customers"("phone");
CREATE INDEX "customers_name_idx" ON "customers"("name");
CREATE INDEX "customers_type_idx" ON "customers"("type");

CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "ProductUnit" NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "rate" DECIMAL(12,2) NOT NULL,
    "stock_qty" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "low_stock_at" DECIMAL(12,2) NOT NULL DEFAULT 10,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_code" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "order_date" DATE NOT NULL,
    "delivery_date" DATE NOT NULL,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "internal_notes" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'active',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "orders_order_code_key" ON "orders"("order_code");
CREATE INDEX "orders_customer_id_idx" ON "orders"("customer_id");
CREATE INDEX "orders_delivery_date_idx" ON "orders"("delivery_date");
CREATE INDEX "orders_stage_idx" ON "orders"("stage");
CREATE INDEX "orders_order_date_idx" ON "orders"("order_date");

ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT,
    "category_name" TEXT NOT NULL,
    "description" TEXT,
    "qty" DECIMAL(12,2) NOT NULL,
    "rate" DECIMAL(12,2) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "line_no" INTEGER NOT NULL,
    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "payment_code" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_date" DATE NOT NULL,
    "mode" "PaymentMode" NOT NULL,
    "reference_no" TEXT,
    "notes" TEXT,
    "recorded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payments_payment_code_key" ON "payments"("payment_code");
CREATE INDEX "payments_order_id_idx" ON "payments"("order_id");
CREATE INDEX "payments_payment_date_idx" ON "payments"("payment_date");
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "company_settings" (
    "id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "gstin" TEXT,
    "default_gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 18,
    "invoice_prefix" TEXT NOT NULL DEFAULT 'INV',
    "advance_receipt_prefix" TEXT NOT NULL DEFAULT 'AR',
    "invoice_footer_note" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "document_sequences" (
    "id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "prefix" TEXT,
    "last_number" BIGINT NOT NULL DEFAULT 0,
    "fiscal_year" INTEGER NOT NULL,
    CONSTRAINT "document_sequences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_sequences_doc_type_key" ON "document_sequences"("doc_type");
