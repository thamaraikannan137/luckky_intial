"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [deliveryDate, setDeliveryDate] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ productId: "", description: "", qty: "", rate: "" }]);

  useEffect(() => {
    fetch("/api/customers").then((r) => r.json()).then(setCustomers);
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  const total = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);

  const updateItem = (i: number, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const onProduct = (i: number, productId: string) => {
    const p = products.find((x) => x.id === productId);
    updateItem(i, { productId, rate: p ? String(p.rate) : "" });
  };

  const save = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        orderDate,
        deliveryDate: deliveryDate || orderDate,
        items: items.map((it) => ({ ...it, qty: Number(it.qty), rate: Number(it.rate) })),
      }),
    });
    const order = await res.json();
    router.push(`/orders/${order.id}`);
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/orders")} sx={{ mb: 2, color: "text.secondary" }}>
        Cancel
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

          <Typography sx={{ mt: 3, mb: 1.5, fontWeight: 700 }}>
            Line items
          </Typography>

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
                  <IconButton size="small" color="error" onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}>
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
              <Typography sx={{ fontWeight: 700, fontSize: 25 }}>
                {formatINR(total)}
              </Typography>
            </Box>
            <Button variant="contained" color="secondary" size="large" onClick={save} disabled={!customerId || total <= 0}>
              Create order
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
