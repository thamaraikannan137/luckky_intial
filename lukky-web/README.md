# Lukky Enterprises — Next.js + MUI

Management system using **in-memory mock data** (no database required).

## Run

```bash
cd lukky-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Mock data

All API routes read/write from `src/lib/mock/store.ts`, seeded from the original v3 prototype:

- 8 customers, 10 products, 10 orders, 11 payments
- Includes **Sri Murugan Textiles / O-2461** (overdue delivery example)
- Changes persist until the dev server restarts

## Switch to Neon later

Prisma schema remains in `prisma/`. To use Neon:

1. Set `DATABASE_URL` in `.env`
2. Run `npx prisma migrate dev`
3. Point API routes back to `@/lib/db` instead of `@/lib/mock/store`

## Reusable components

| Component | Use |
|-----------|-----|
| `AppShell` | Responsive shell (drawer on mobile, sidebar on desktop) |
| `KpiCard` | Dashboard metrics |
| `DataTable` | Generic typed table |
| `DataCard` | Card with title + action |
| `StatusChip` | Pipeline / type badges |
| `AvatarInitials` | Customer avatars |
| `Money` | INR formatting |
| `FilterChips` | List filters |
| `ConfirmDialog` | Delete confirmations |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed demo data |
