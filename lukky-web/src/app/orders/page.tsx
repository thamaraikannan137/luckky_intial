"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FilterChips from "@/components/ui/FilterChips";
import DataTable, { Column } from "@/components/ui/DataTable";
import PageCard from "@/components/ui/PageCard";
import AvatarInitials from "@/components/ui/AvatarInitials";
import StatusChip from "@/components/ui/StatusChip";
import Money from "@/components/ui/Money";
import { CUSTOMER_TYPE_COLORS, STAGE_COLORS, STAGES } from "@/lib/constants";
import { formatDateShort } from "@/lib/format";

type OrderRow = {
  id: string;
  orderCode: string;
  customerName: string;
  customerType: string;
  stage: number;
  total: number;
  balance: number;
  orderDate: string;
  deliveryDate: string;
  overdue: boolean;
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending balance", value: "pending" },
  { label: "In production", value: "production" },
  { label: "Overdue", value: "overdue" },
  { label: "Delivered", value: "delivered" },
];

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState(searchParams.get("filter") ?? "all");

  useEffect(() => {
    fetch(`/api/orders?filter=${filter}`)
      .then((r) => r.json())
      .then(setRows);
  }, [filter]);

  const columns: Column<OrderRow>[] = [
    {
      id: "code",
      label: "Order",
      width: "10%",
      minWidth: 72,
      sortValue: (o) => o.orderCode,
      render: (o) => (
        <Typography  color="secondary.main" sx={{ fontWeight: 600 }}>
          {o.orderCode}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "Customer",
      width: "26%",
      minWidth: 120,
      sortValue: (o) => o.customerName,
      render: (o) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "11px", minWidth: 0 }}>
          <AvatarInitials
            name={o.customerName}
            size={34}
            bg={CUSTOMER_TYPE_COLORS[o.customerType === "B2C" ? "B2C" : "B2B"].bg}
            color={CUSTOMER_TYPE_COLORS[o.customerType === "B2C" ? "B2C" : "B2B"].color}
          />
          <Typography noWrap sx={{ fontWeight: 600, fontSize: 13.5, minWidth: 0 }}>
            {o.customerName}
          </Typography>
        </Box>
      ),
    },
    {
      id: "ordered",
      label: "Ordered",
      width: "10%",
      minWidth: 72,
      sortValue: (o) => o.orderDate,
      render: (o) => (
        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          {formatDateShort(o.orderDate)}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      width: "16%",
      minWidth: 120,
      sortValue: (o) => o.stage,
      render: (o) => {
        const ss = STAGE_COLORS[o.stage] ?? STAGE_COLORS[0];
        return <StatusChip label={STAGES[o.stage]} bg={ss.bg} color={ss.color} />;
      },
    },
    {
      id: "total",
      label: "Total",
      width: "12%",
      minWidth: 85,
      align: "right",
      sortValue: (o) => o.total,
      render: (o) => <Money amount={o.total} fontWeight={600} />,
    },
    {
      id: "balance",
      label: "Balance",
      width: "12%",
      minWidth: 85,
      align: "right",
      sortValue: (o) => o.balance,
      render: (o) =>
        o.balance > 0 ? <Money amount={o.balance} color="#FF4C51" /> : (
          <Typography color="#56CA00"  sx={{ fontWeight: 700 }}>
            Paid
          </Typography>
        ),
    },
    {
      id: "delivery",
      label: "Delivery",
      width: "10%",
      minWidth: 72,
      align: "right",
      sortValue: (o) => o.deliveryDate,
      render: (o) => (
        <Typography  color={o.overdue ? "#FF4C51" : "text.secondary"} sx={{ fontSize: 13 }}>
          {formatDateShort(o.deliveryDate)}
        </Typography>
      ),
    },
  ];

  return (
    <PageCard title="Orders" toolbar={<FilterChips options={FILTERS} value={filter} onChange={setFilter} />}>
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={(r) => router.push(`/orders/${r.id}`)}
        minWidth={860}
        embedded
      />
    </PageCard>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
