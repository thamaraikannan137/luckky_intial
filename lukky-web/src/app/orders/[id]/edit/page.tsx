"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatINR } from "@/lib/format";

type Customer = { id: string; name: string; type: string };
type Product = { id: string; name: string; rate: string };
type LineItem = { productId: string; description: string; qty: string; rate: string };

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/customers").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
      fetch(`/api/orders/${id}`).then((r) => r.json()),
    ]).then(([custs, prods, order]) => {
      if (order.error) {
        router.push("/orders");
        return;
      }
      setCustomers(custs);
      setProducts(prods);
      setCustomerId(order.customerId);
      setOrderDate(order.orderDate?.slice(0, 10) ?? "");
      setDeliveryDate(order.deliveryDate?.slice(0, 10) ?? "");
      setItems(
        (order.items ?? []).map((it: { productId: string | null; description: string | null; qty: string | number; rate: string | number }) => ({
          productId: it.productId ?? "",
          description: it.description ?? "",
          qty: String(it.qty),
          rate: String(it.rate),
        })),
      );
      setLoading(false);
    });
  }, [id, router]);

  const total = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);

  const updateItem = (i: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const onProduct = (i: number, productId: string) => {
    const p = products.find((x) => x.id === productId);
    updateItem(i, { productId, rate: p ? String(p.rate) : "" });
  };

  const save = async () => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        orderDate,
        deliveryDate: deliveryDate || orderDate,
        items: items.map((it) => ({ ...it, qty: Number(it.qty), rate: Number(it.rate) })),
      }),
    });
    router.push(`/orders/${id}`);
  };

  if (loading) return <Typography sx={{ color: "#8A82A6" }}>Loading order…</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(`/orders/${id}`)} sx={{ mb: 2, color: "text.secondary" }}>
        Back to order
      </Button>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField select fullWidth label="Customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name} ({c.type === "B2B" ? "Shop" : "Individual"})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth type="date" label="Order date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth type="date" label="Expected delivery" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
          </Grid>

          <Typography sx={{ mt: 3, mb: 1.5, fontWeight: 700 }}>Line items</Typography>

          <Stack spacing={1.5}>
            {items.map((it, i) => (
              <Grid container spacing={1} key={i} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField select fullWidth size="small" label="Product" value={it.productId} onChange={(e) => onProduct(i, e.target.value)}>
                    {products.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField fullWidth size="small" label="Description" value={it.description} onChange={(e) => updateItem(i, { description: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField fullWidth size="small" label="Qty" type="number" value={it.qty} onChange={(e) => updateItem(i, { qty: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField fullWidth size="small" label="Rate" type="number" value={it.rate} onChange={(e) => updateItem(i, { rate: e.target.value })} />
                </Grid>
                <Grid size={{ xs: 10, sm: 1.5 }}>
                  <Typography align="right" sx={{ fontWeight: 600, fontSize: 13 }}>
                    {formatINR((Number(it.qty) || 0) * (Number(it.rate) || 0))}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2, sm: 0.5 }}>
                  <IconButton size="small" color="error" onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))} disabled={items.length <= 1}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Stack>

          <Button startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setItems([...items, { productId: "", description: "", qty: "", rate: "" }])}>
            Add line item
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, pt: 2, borderTop: "1px solid #E6E5E8" }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total order amount
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 22 }}>
                {formatINR(total)}
              </Typography>
            </Box>
            <Button variant="contained" color="secondary" size="large" onClick={save} disabled={!customerId || total <= 0 || items.length === 0}>
              Save changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
