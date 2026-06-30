"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StatusChip from "@/components/ui/StatusChip";
import Money from "@/components/ui/Money";
import DataTable, { Column } from "@/components/ui/DataTable";
import InvoiceModal from "@/components/invoicing/InvoiceModal";
import { STAGES, STAGE_COLORS, PAYMENT_MODES, PAYMENT_TYPES } from "@/lib/constants";
import { formatDate, formatINR } from "@/lib/format";
import { buildInvoiceData, type InvoiceKind } from "@/lib/invoice";

type OrderItem = {
  categoryName: string;
  description: string | null;
  qty: string;
  rate: string;
  amount: string;
  productId?: string | null;
};

type OrderCustomer = {
  id: string;
  name: string;
  type: string;
  phone: string;
  address?: string | null;
  gstin?: string | null;
};

type OrderData = {
  orderCode: string;
  orderDate: string;
  deliveryDate: string;
  stage: number;
  total: number;
  paid: number;
  balance: number;
  customer: OrderCustomer;
  items: OrderItem[];
  payments: { type: string; amount: string; paymentDate: string; mode: string }[];
};

type ProductRow = { id: string; unit: string };

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [productUnits, setProductUnits] = useState<Record<string, string>>({});
  const [payOpen, setPayOpen] = useState(false);
  const [invoiceKind, setInvoiceKind] = useState<InvoiceKind | null>(null);
  const [payForm, setPayForm] = useState({ amount: "", type: "advance", mode: "upi", paymentDate: new Date().toISOString().slice(0, 10) });

  const load = () => fetch(`/api/orders/${id}`).then((r) => r.json()).then(setOrder);

  useEffect(() => {
    load();
    fetch("/api/products")
      .then((r) => r.json())
      .then((products: ProductRow[]) => {
        const map: Record<string, string> = {};
        products.forEach((p) => {
          map[p.id] = p.unit;
        });
        setProductUnits(map);
      });
  }, [id]);

  const invoiceData = useMemo(() => {
    if (!order || !invoiceKind) return null;
    return buildInvoiceData(order, invoiceKind, productUnits as Record<string, "per_sqft" | "per_letter" | "per_piece" | "per_design">);
  }, [order, invoiceKind, productUnits]);

  if (!order) return <Typography>Loading…</Typography>;

  const stage = order.stage;
  const ss = STAGE_COLORS[stage] ?? STAGE_COLORS[0];
  const items = order.items ?? [];
  const payments = order.payments ?? [];
  const { total, paid, balance, customer } = order;

  const itemCols: Column<(typeof items)[0]>[] = [
    {
      id: "item",
      label: "Item",
      sortValue: (it) => it.categoryName,
      render: (it) => (
        <Box>
          <Typography  sx={{ fontWeight: 600 }}>{it.categoryName}</Typography>
          {it.description && (
            <Typography variant="caption" color="text.secondary">
              {it.description}
            </Typography>
          )}
        </Box>
      ),
    },
    { id: "qty", label: "Qty", width: 64, align: "center", sortValue: (it) => Number(it.qty), render: (it) => Number(it.qty) },
    { id: "rate", label: "Rate", width: 90, align: "right", sortValue: (it) => Number(it.rate), render: (it) => formatINR(Number(it.rate)) },
    { id: "amt", label: "Amount", width: 100, align: "right", sortValue: (it) => Number(it.amount), render: (it) => <Money amount={Number(it.amount)} /> },
  ];

  const setStage = async (s: number) => {
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage: s }) });
    load();
  };

  const recordPayment = async () => {
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, ...payForm, amount: Number(payForm.amount) }),
    });
    setPayOpen(false);
    load();
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/orders")} sx={{ mb: 2, color: "text.secondary" }}>
        All orders
      </Button>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 700 }}>
                  {order.orderCode}
                </Typography>
                <StatusChip label={STAGES[stage]} bg={ss.bg} color={ss.color} />
                <Box sx={{ flex: 1 }} />
                <Box
                  component="button"
                  onClick={() => router.push(`/orders/${id}/edit`)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    px: "13px",
                    py: "8px",
                    border: "1px solid #D9D8DE",
                    borderRadius: "8px",
                    bgcolor: "#fff",
                    color: "#6D6B77",
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    "&:hover": { bgcolor: "#F2EBFF", borderColor: "#8C57FF", color: "#8C57FF" },
                  }}
                >
                  Edit order
                </Box>
              </Box>
              <Link component="button" onClick={() => router.push(`/customers/${customer.id}`)} sx={{ fontWeight: 600, mt: 0.5 }}>
                {customer.name}
              </Link>
              <Typography variant="body2" color="text.secondary">
                Ordered {formatDate(order.orderDate)} · Delivery {formatDate(order.deliveryDate)}
              </Typography>

              <Box sx={{ display: "flex", gap: 0.75, mt: 2.5 }}>
                {STAGES.map((name, i) => (
                  <Box key={name} sx={{ flex: 1, cursor: "pointer" }} onClick={() => setStage(i)}>
                    <Box sx={{ height: 5, borderRadius: 1, bgcolor: i <= stage ? "#8C57FF" : "#E6E5E8" }} />
                    <Typography
                      align="center"
                      sx={{ mt: 0.75, fontSize: 10, color: i <= stage ? "#8C57FF" : "#A5A3AE", fontWeight: i === stage ? 700 : 500 }}
                    >
                      {name}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 3 }}>
                <DataTable columns={itemCols} rows={items} getRowId={(it) => `${it.categoryName}-${it.qty}-${it.rate}`} minWidth={400} />
                <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1.5, bgcolor: "#FAFAFB", borderTop: "1px solid #E6E5E8" }}>
                  <Typography  sx={{ fontWeight: 600 }}>Total order amount</Typography>
                  <Money amount={total} fontSize={16} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(47,43,61,.10)", borderRadius: "6px", border: "none" }}>
            <CardContent sx={{ p: "22px", "&:last-child": { pb: "22px" } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ m: 0, fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#241F38" }}>
                  Payments
                </Typography>
                <StatusChip
                  label={balance > 0 ? "Balance due" : "Fully paid"}
                  bg={balance > 0 ? "#FFE3E4" : "#E5F6D8"}
                  color={balance > 0 ? "#FF4C51" : "#56CA00"}
                />
              </Box>

              <Box sx={{ display: "flex", gap: "12px", mt: "16px" }}>
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: "#F6F6F8",
                    borderRadius: "6px",
                    px: "14px",
                    py: "12px",
                  }}
                >
                  <Typography sx={{ display: "block", fontSize: 11.5, color: "#A5A3AE", lineHeight: 1.4 }}>
                    Paid
                  </Typography>
                  <Typography
                    sx={{
                      display: "block",
                      mt: "4px",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#56CA00",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1.2,
                    }}
                  >
                    {formatINR(paid)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: "#F6F6F8",
                    borderRadius: "6px",
                    px: "14px",
                    py: "12px",
                  }}
                >
                  <Typography sx={{ display: "block", fontSize: 11.5, color: "#A5A3AE", lineHeight: 1.4 }}>
                    Balance due
                  </Typography>
                  <Typography
                    sx={{
                      display: "block",
                      mt: "4px",
                      fontWeight: 700,
                      fontSize: 16,
                      color: balance > 0 ? "#FF4C51" : "#56CA00",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1.2,
                    }}
                  >
                    {formatINR(balance)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: "16px", display: "flex", flexDirection: "column" }}>
                {payments.length === 0 ? (
                  <Typography sx={{ py: "14px", textAlign: "center", color: "#A5A3AE", fontSize: 13 }}>
                    No payments recorded yet
                  </Typography>
                ) : (
                  payments.map((p, i) => {
                    const typeLabel = PAYMENT_TYPES.find((t) => t.value === p.type)?.label ?? p.type.replace("_", " ");
                    const icon = (typeLabel[0] || "P").toUpperCase();
                    return (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          py: "11px",
                          borderBottom: "1px solid #F0EFF2",
                        }}
                      >
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            bgcolor: "#E5F6D8",
                            color: "#56CA00",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: "#241F38", lineHeight: 1.3 }}>
                            {typeLabel}
                          </Typography>
                          <Typography sx={{ fontSize: 11.5, color: "#A5A3AE", mt: "2px" }}>
                            {formatDate(p.paymentDate)} · {p.mode}
                          </Typography>
                        </Box>
                        <Money amount={Number(p.amount)} color="#56CA00" fontSize={14} />
                      </Box>
                    );
                  })
                )}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "9px", mt: "18px" }}>
                <Box
                  component="button"
                  className="l-btn-secondary"
                  onClick={() => setPayOpen(true)}
                  sx={{
                    width: "100%",
                    py: "11px",
                    border: "none",
                    borderRadius: "8px",
                    bgcolor: "#8C57FF",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 3px 10px rgba(140,87,255,.4)",
                    fontFamily: "inherit",
                    "&:hover": { bgcolor: "#7E4EE6" },
                  }}
                >
                  + Record payment
                </Box>
                <Box sx={{ display: "flex", gap: "9px" }}>
                  <Box
                    component="button"
                    onClick={() => setInvoiceKind("advance")}
                    sx={{
                      flex: 1,
                      py: "10px",
                      border: "1px solid #D9D8DE",
                      borderRadius: "8px",
                      bgcolor: "#fff",
                      color: "#6D6B77",
                      fontWeight: 600,
                      fontSize: 12.5,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      "&:hover": { bgcolor: "#F8F7FA" },
                    }}
                  >
                    Advance receipt
                  </Box>
                  <Box
                    component="button"
                    onClick={() => setInvoiceKind("final")}
                    sx={{
                      flex: 1,
                      py: "10px",
                      border: "1px solid #D9D8DE",
                      borderRadius: "8px",
                      bgcolor: "#fff",
                      color: "#6D6B77",
                      fontWeight: 600,
                      fontSize: 12.5,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      "&:hover": { bgcolor: "#F8F7FA" },
                    }}
                  >
                    Final invoice
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={payOpen} onClose={() => setPayOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Record payment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Balance due {formatINR(balance)}
            </Typography>
            <TextField label="Amount (₹)" type="number" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
            <TextField select label="Type" value={payForm.type} onChange={(e) => setPayForm({ ...payForm, type: e.target.value })}>
              {PAYMENT_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Mode" value={payForm.mode} onChange={(e) => setPayForm({ ...payForm, mode: e.target.value })}>
              {PAYMENT_MODES.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField type="date" label="Date" value={payForm.paymentDate} onChange={(e) => setPayForm({ ...payForm, paymentDate: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" onClick={() => setPayForm({ ...payForm, amount: String(Math.round(balance / 2)) })}>
                Half
              </Button>
              <Button size="small" variant="outlined" onClick={() => setPayForm({ ...payForm, amount: String(balance) })}>
                Full balance
              </Button>
            </Stack>
            <Button variant="contained" color="secondary" onClick={recordPayment}>
              Save payment
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <InvoiceModal data={invoiceData} onClose={() => setInvoiceKind(null)} />
    </Box>
  );
}
