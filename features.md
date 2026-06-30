# Lukky Enterprises Management System v3 — Feature Analysis

> **Source:** `Lukky Enterprises System v3.dc.html`  
> **Business:** Signage, lettering, CNC, engraving & custom fabrication (Coimbatore)  
> **Stack:** Single-page DC (Declarative Component) app — React logic, in-memory state, no backend

---

## Highlighted UI: Upcoming Deliveries (Dashboard)

The element you selected is a row in the **Upcoming deliveries** panel on the Dashboard.

| Field | Example (selected row) |
|-------|------------------------|
| Customer | Sri Murugan Textiles |
| Order ID | O-2461 |
| Delivery date | 28 Jun |
| Status label | **2d overdue** (red) |
| Stage | In Production (stage 2) |
| Balance | ₹7,420 outstanding (₹13,420 total − ₹6,000 advance) |

### Row behaviour

- **Click** → opens Order detail for that order
- **Icon** — clock (red) when overdue; truck when on track
- **Colour coding**
  - Red (`#FF4C51`) — overdue (`daysToDelivery < 0`)
  - Amber (`#D99800`) — due within 3 days
  - Green (`#56CA00`) — more than 3 days out
- **Sort** — nearest delivery first (overdue at top)
- **Filter** — non-delivered orders only (`stage !== 4`)
- **Limit** — top 5 shown on dashboard

### Due-label logic

```
overdue  → "{n}d overdue"
today    → "Today"
future   → "in {n}d"
```

Reference date in demo: **30 Jun 2026** (`NOW = new Date(2026, 5, 30)`).

---

## Application Shell

| Feature | Description |
|---------|-------------|
| Sidebar navigation | Dashboard, Customers, Orders, Products, Reports |
| Global search | Search by customer name, phone, or contact person → jumps to Customers |
| New Order CTA | Header button to create a job from any screen |
| Role switch | Toggle **Owner (admin)** ↔ **Counter Staff** |
| Responsive layout | Collapsible sidebar labels, stacked grids on tablet/mobile |
| Print support | Invoice/receipt print via `@media print` |

---

## Dashboard

### KPI cards (4)

1. **Outstanding balance** — sum of unpaid order balances + count of orders with balance
2. **Collected this month** — payments received in current calendar month
3. **Orders this month** — count + total billed value
4. **Active customers** — total count split B2B shops vs B2C individuals

### Pending balances table

- Top 5 orders with balance > 0, sorted highest balance first
- Columns: Customer (avatar + name), Status badge, Balance (₹)
- **View all** → Orders screen

### Upcoming deliveries panel

- Described above (highlighted component)

---

## Customers

### List view

| Feature | Details |
|---------|---------|
| Filters | All · Shop/Business (B2B) · Individual (B2C) |
| Columns | Customer, Type, Phone, Orders count, Pending ₹, Actions |
| Search | Name, phone, contact person (via global search) |
| CRUD | Add, Edit, Delete (with cascade warning) |

### Customer types

- **B2B (Shop/Business)** — contact person, GSTIN, area from address
- **B2C (Individual)** — name, phone, address, notes

### Customer detail

- Profile card: phone, contact, address, GSTIN, notes, total pending
- Actions: New order, Edit, Delete
- **Order history** table: order ID, items summary, status, total, balance

### ID sequencing

- B2B: `C-1001`, `C-1002`, …
- B2C: `C-2001`, `C-2002`, …

---

## Orders

### List view

| Filter | Shows |
|--------|-------|
| All | Every order |
| Pending balance | `balance > 0` |
| In production | Stages 1–3 |
| Delivered | Stage 4 |

Columns: Order ID, Customer, Status, Total, Balance, Delivery date (red if overdue).

### Order pipeline (5 stages)

| # | Stage | Colour |
|---|-------|--------|
| 0 | Quoted | Grey |
| 1 | Advance Received | Blue |
| 2 | In Production | Amber |
| 3 | Ready for Delivery | Purple |
| 4 | Delivered | Green |

- Click any stage bar to update status manually
- Recording first payment auto-advances to stage 1 if still Quoted
- Full payment auto-advances to at least stage 3 (Ready for Delivery)

### New order form

- Customer picker, order date, expected delivery date
- Line items: product category, description, qty, rate (auto-filled from product)
- Add/remove line items; inline **Add product** from category dropdown
- Live total; validation requires customer + ≥1 valid line item
- New orders start at stage 0 (Quoted); ID format `O-2461`, …

### Order detail

- Pipeline tracker, line-item breakdown, payment summary
- **Record payment** modal
- **Advance receipt** / **Final invoice** (printable)
- Link to customer profile; delete order (removes payments too)

---

## Payments

| Field | Options |
|-------|---------|
| Type | Advance · Partial · Final Balance |
| Mode | Cash · UPI · Bank Transfer · Cheque |
| Date | Date picker |
| Quick amounts | Half balance · Full balance · ₹5,000 |

- Auto-suggests payment type based on existing payments
- IDs: `P-501`, `P-502`, …
- Stage side-effects on save (see pipeline above)

---

## Products / Categories

Pre-loaded categories (signage & fabrication):

- LED Lighting Boards, Titanium Letters, Brass Letters, Aluminium Letters
- Sign Boards, CNC Door Designing, God Idols, Party Flags
- Rubber Stamp, Stone Engraving (Kalvettu)

### Product fields

| Field | Purpose |
|-------|---------|
| Name | Category label on orders |
| Unit | per sq.ft · per letter · per piece · per design |
| Cost / Rate | Purchase vs sale price; margin % calculated |
| Stock | Quantity on hand |
| Low threshold | Triggers Low/Out badges |

### Stock badges

- **In stock** (green) — above low threshold
- **Low** (amber) — at or below `lowAt`
- **Out** (red) — stock ≤ 0

### Usage tracking

- Counts how many existing orders reference each product (delete warns if in use)

---

## Invoicing

Two document types per order:

| Type | Title | Doc no. |
|------|-------|---------|
| Advance | ADVANCE RECEIPT | `AR-{orderNo}` |
| Final | TAX INVOICE | `INV-{orderNo}` |

- B2B customers with GST → 18% GST split (CGST 9% + SGST 9%)
- Shows line items, taxable value, paid, balance due
- Print-friendly layout (`window.print()`)
- Footer legal notes differ by document type

---

## Reports (Owner only)

Staff role sees locked screen with prompt to switch role.

| Report | Content |
|--------|---------|
| Category-wise sales | Bar chart by revenue per product category |
| Customer-type split | B2B vs B2C revenue bar + amounts |
| This month | Billed, Collected, Outstanding, Order count |

---

## Role-Based Access

| Capability | Owner | Counter Staff |
|------------|-------|---------------|
| Dashboard | ✓ | ✓ |
| Customers | ✓ | ✓ |
| Orders | ✓ | ✓ |
| Products | ✓ | ✓ |
| Reports | ✓ | ✗ (locked) |
| Orders nav badge | Pending balance count | Same |

---

## Data Model (in-memory)

```
Customer  { id, name, type, contact, phone, address, area, gst, notes }
Category  { id, name, unit, cost, rate, stock, lowAt }
Order     { id, customerId, orderDate, deliveryDate, stage, items[] }
OrderItem { category, description, qty, rate, amount }
Payment   { id, orderId, type, amount, date, mode }
```

### Sample order O-2461 (highlighted row)

```json
{
  "id": "O-2461",
  "customerId": "C-1001",
  "customer": "Sri Murugan Textiles",
  "orderDate": "2026-06-10",
  "deliveryDate": "2026-06-28",
  "stage": 2,
  "items": [
    { "category": "Titanium Letters", "qty": 14, "rate": 650 },
    { "category": "Sign Boards", "qty": 24, "rate": 180 }
  ],
  "total": 13420,
  "paid": 6000,
  "balance": 7420,
  "daysOverdue": 2
}
```

---

## UI / UX Patterns

- **Currency** — Indian numbering (`₹1,23,456`) via `inr()` helper
- **Dates** — `10 Jun 2026` (full) / `28 Jun` (short)
- **Avatars** — initials from customer/product name
- **Type tags** — purple (B2B Shop) / blue (B2C Individual)
- **Modals** — payment, customer, product, confirm-delete, invoice
- **Hover states** — row highlight, button colour shifts
- **Confirm delete** — warns about cascading order/payment removal

---

## Technical Notes

- Built with **DCLogic** component class + `renderVals()` data binding
- State is **client-only** — refreshes reset all data
- No API, auth, or persistence layer in current prototype
- `support.js` provides DC runtime
- Preview dimensions: 1280×820

---

## Missing Features (Gap Analysis)

Features that are **absent**, **incomplete**, or **UI-only** in the current v3 prototype.

### Critical — production blockers

| Missing | Current state |
|---------|---------------|
| **Data persistence** | All data in memory; page refresh wipes everything |
| **Real authentication** | Role toggle only (Owner ↔ Staff); no login, passwords, or sessions |
| **Live system date** | `NOW` hardcoded to 30 Jun 2026 — overdue/KPIs don’t use real today |
| **Backend / API** | No server, database, or sync between devices |

### Orders & deliveries

| Missing | Current state |
|---------|---------------|
| **Edit existing orders** | Create + delete only; no way to change items, qty, rate, or dates after save |
| **Overdue filter** | Orders list has All / Pending / In production / Delivered — no Overdue tab |
| **“View all” on deliveries** | Pending balances has “View all”; Upcoming deliveries does not |
| **Delivery calendar** | No month/week view of due dates |
| **Delivery alerts** | No SMS, WhatsApp, or in-app notifications for overdue (e.g. O-2461) |
| **Auto “Delivered” stage** | Stage 4 is manual only; delivery date passing does nothing |
| **Order notes / attachments** | No internal notes, design files, or photos on jobs |
| **Duplicate order** | No “copy from previous order” |
| **Order cancellation** | Only hard delete (removes payments too) |
| **Discounts** | No line-item or order-level discount |

### Payments & invoicing

| Missing | Current state |
|---------|---------------|
| **Edit / delete payments** | Record only; mistakes can’t be corrected without deleting the order |
| **Overpayment guard** | Payment save accepts any amount > 0; no cap at balance due |
| **Payment reminders** | No nudge for high balance near delivery |
| **Quote document** | Stage “Quoted” exists but no printable quotation PDF |
| **Credit note / refund** | No refund or reversal flow |
| **Configurable GST** | Fixed 18% inclusive; no rate settings |
| **HSN / SAC codes** | Not on invoice line items |
| **Company GSTIN on invoice** | Customer GST shown; business GSTIN not on header |
| **Sequential invoice series** | Doc no. tied to order ID (`INV-2461`), not a separate counter |

### Inventory & products

| Missing | Current state |
|---------|---------------|
| **Stock deduction** | Stock tracked in UI but never reduced when orders are created or produced |
| **Low-stock dashboard alert** | Low/Out badges on Products page only — not on Dashboard |
| **Edit low-stock threshold** | `lowAt` exists in data but **not in Add/Edit product modal** (defaults to 10 on create) |
| **Stock movement history** | No log of adjustments, purchases, or usage |
| **Purchase / supplier module** | No vendors, POs, or inward stock |

### Search, lists & UX

| Missing | Current state |
|---------|---------------|
| **Search orders** | Global search is customers-only (name, phone, contact) |
| **Search products** | No product search |
| **Table sorting** | Lists use fixed sort; user can’t sort columns |
| **Pagination** | Dashboard capped at top 5; full lists grow unbounded |
| **Empty states** | No “no overdue deliveries” / “no pending balance” messages |
| **KPI drill-down** | KPI cards are display-only; not clickable |

### Reports & analytics

| Missing | Current state |
|---------|---------------|
| **Date range picker** | “This month” locked to June 2026 |
| **Profit / margin report** | Revenue only; cost/margin from products not rolled up |
| **Customer-wise sales** | No per-customer revenue ranking |
| **Payment ledger** | No cash-book or payment history export |
| **Export** | No CSV / Excel / PDF export from Reports |
| **Staff-safe reports** | Staff blocked from Reports only; can still see purchase prices & margins on Products |

### Access control (RBAC gaps)

| Missing | Current state |
|---------|---------------|
| **Granular permissions** | Staff can delete customers, orders, products — same as Owner except Reports |
| **Audit trail** | No log of who changed stage, recorded payment, or edited records |
| **Settings page** | No admin config for company details, tax, invoice footer, etc. |

### Settings & operations

| Missing | Business need |
|---------|---------------|
| **Company profile editor** | Invoice header address/phone are hardcoded HTML |
| **Backup / restore** | No data export/import |
| **Multi-branch** | Single shop only |
| **Employee / workshop assignment** | No “who is working on this job” |
| **Expense tracking** | No rent, materials, salary, or petty cash |
| **UPI / bank reference** | Payment mode stored but no txn ID or receipt upload |

---

### Partially implemented (looks complete but isn’t)

1. **Stock management** — UI badges work; stock never changes with orders  
2. **Role-based access** — Reports locked for Staff; everything else is open  
3. **Upcoming deliveries** — Overdue styling works; no “View all” or dedicated overdue view  
4. **GST invoicing** — Works for B2B with GSTIN; no HSN, company GSTIN, or IGST  
5. **Order pipeline** — Manual stage clicks; payment auto-advances stage but delivery doesn’t  

---

### Priority order (recommended build sequence)

1. Persistence + real date  
2. Edit orders + edit/delete payments  
3. Overdue filter + “View all deliveries”  
4. Stock deduction + low-stock threshold in product form  
5. Search orders by ID / customer  
6. Real auth + tighter Staff permissions  
7. Reports date range + export  
8. Notifications (WhatsApp/SMS) for overdue jobs  

---

## Suggested Enhancements (not yet implemented)

See **Missing Features** above for the full gap list. Highest-impact quick wins:

1. **Persistence** — database or localStorage  
2. **Delivery alerts** — SMS/WhatsApp for overdue orders like O-2461  
3. **Dashboard drill-down** — “View all” on Upcoming deliveries  
4. **Overdue filter** on Orders list  
5. **Edit existing orders** — line items and dates after creation  
6. **Stock deduction** — auto-reduce inventory when order moves to production  
7. **Multi-user auth** — real Owner/Staff login instead of role toggle  
8. **Export** — CSV/PDF for reports and customer statements  
9. **Delivery calendar** — month view of all due dates  
10. **Payment reminders** — nudge customers with high balance near delivery
