"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AvatarInitials from "@/components/ui/AvatarInitials";
import StatusChip from "@/components/ui/StatusChip";
import Money from "@/components/ui/Money";
import DataTable, { Column } from "@/components/ui/DataTable";
import { STAGES, STAGE_COLORS } from "@/lib/constants";
import { formatDateShort } from "@/lib/format";

type CustomerDetail = {
  id: string;
  name: string;
  type: string;
  phone: string;
  contactPerson?: string | null;
  address?: string | null;
  gstin?: string | null;
  orders: { id: string; orderCode: string; orderDate: string; itemsSummary: string; stage: number; total: number; balance: number }[];
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);

  useEffect(() => {
    fetch(`/api/customers/${id}`).then((r) => r.json()).then(setCustomer);
  }, [id]);

  if (!customer) return <Typography>Loading…</Typography>;

  const orders = customer.orders ?? [];
  const pending = orders.reduce((s, o) => s + Math.max(0, o.balance), 0);
  const isB2B = customer.type === "B2B";

  const cols: Column<(typeof orders)[0]>[] = [
    { id: "code", label: "Order", width: "10%", minWidth: 72, sortValue: (o) => o.orderCode, render: (o) => o.orderCode },
    {
      id: "ordered",
      label: "Ordered",
      width: "12%",
      minWidth: 72,
      sortValue: (o) => o.orderDate,
      render: (o) => (
        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
          {formatDateShort(o.orderDate)}
        </Typography>
      ),
    },
    { id: "items", label: "Items", width: "30%", minWidth: 120, sortValue: (o) => o.itemsSummary, render: (o) => o.itemsSummary },
    {
      id: "status",
      label: "Status",
      width: "18%",
      minWidth: 120,
      sortValue: (o) => o.stage,
      render: (o) => {
        const ss = STAGE_COLORS[o.stage] ?? STAGE_COLORS[0];
        return <StatusChip label={STAGES[o.stage]} bg={ss.bg} color={ss.color} />;
      },
    },
    { id: "total", label: "Total", width: "15%", minWidth: 90, align: "right", sortValue: (o) => o.total, render: (o) => <Money amount={o.total} fontWeight={600} /> },
    {
      id: "bal",
      label: "Balance",
      width: "15%",
      minWidth: 90,
      align: "right",
      sortValue: (o) => o.balance,
      render: (o) => (o.balance > 0 ? <Money amount={o.balance} color="#FF4C51" /> : <Typography color="#56CA00"  sx={{ fontWeight: 700 }}>Paid</Typography>),
    },
  ];

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/customers")} sx={{ mb: 2, color: "text.secondary" }}>
        All customers
      </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <AvatarInitials
                  name={customer.name as string}
                  size={62}
                  bg={isB2B ? "#EBE1FF" : "#DDF3FF"}
                  color={isB2B ? "#8C57FF" : "#16B1FF"}
                />
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h5"  sx={{ fontWeight: 700 }}>
                      {customer.name}
                    </Typography>
                    <StatusChip label={isB2B ? "Shop / Business" : "Individual"} bg={isB2B ? "#EBE1FF" : "#DDF3FF"} color={isB2B ? "#8C57FF" : "#16B1FF"} />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Phone: {customer.phone}
                  </Typography>
                  {customer.contactPerson && (
                    <Typography variant="body2">Contact: {customer.contactPerson}</Typography>
                  )}
                  {customer.address && <Typography variant="body2">Address: {customer.address}</Typography>}
                  {customer.gstin && <Typography variant="body2">GSTIN: {customer.gstin}</Typography>}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { md: "right" }, pl: { md: 3 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Total pending
              </Typography>
              <Box sx={{ display: "block", mt: 0.5 }}>
                <Money amount={pending} color={pending > 0 ? "#FF4C51" : "#56CA00"} fontSize={22} />
              </Box>
              <Button variant="contained" color="secondary" sx={{ mt: 1.5, display: "block", ml: { md: "auto" } }} onClick={() => router.push("/orders/new")}>
                + New order
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 1.5, fontSize: 16 }}>
        Order history
      </Typography>
      <DataTable columns={cols} rows={orders} getRowId={(o) => o.id} onRowClick={(o) => router.push(`/orders/${o.id}`)} minWidth={640} embedded />
    </Box>
  );
}
