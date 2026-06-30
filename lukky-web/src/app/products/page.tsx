"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable, { Column } from "@/components/ui/DataTable";
import PageCard from "@/components/ui/PageCard";
import AvatarInitials from "@/components/ui/AvatarInitials";
import Money from "@/components/ui/Money";
import TableActionButton from "@/components/ui/TableActionButton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { PRODUCT_UNITS } from "@/lib/constants";
import { formatINR, toNumber } from "@/lib/format";

type ProductRow = {
  id: string;
  name: string;
  unit: string;
  cost: string | number;
  rate: string | number;
  stockQty: string | number;
  lowStockAt: string | number;
  orderUsage?: number;
};

const EMPTY_FORM = { name: "", unit: "per_piece", cost: "", rate: "", stockQty: "", lowStockAt: "10" };

export default function ProductsPage() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = () => fetch("/api/products").then((r) => r.json()).then(setRows);

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (row: ProductRow) => {
    setEditId(row.id);
    setForm({
      name: row.name,
      unit: row.unit,
      cost: String(toNumber(row.cost)),
      rate: String(toNumber(row.rate)),
      stockQty: String(toNumber(row.stockQty)),
      lowStockAt: String(toNumber(row.lowStockAt)),
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      name: form.name,
      unit: form.unit,
      cost: Number(form.cost) || 0,
      rate: Number(form.rate),
      stockQty: Number(form.stockQty) || 0,
      lowStockAt: Number(form.lowStockAt) || 10,
    };
    const url = editId ? `/api/products/${editId}` : "/api/products";
    const method = editId ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setOpen(false);
    load();
  };

  const unitLabel = (u: string) => PRODUCT_UNITS.find((x) => x.value === u)?.label ?? u;

  const columns: Column<ProductRow>[] = [
    {
      id: "name",
      label: "Product",
      width: "32%",
      minWidth: 160,
      sortValue: (r) => r.name,
      render: (r) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "11px", minWidth: 0 }}>
          <AvatarInitials name={r.name} square />
          <Typography noWrap sx={{ fontWeight: 600, minWidth: 0 }}>
            {r.name}
          </Typography>
        </Box>
      ),
    },
    { id: "unit", label: "Pricing basis", width: "12%", minWidth: 100, sortValue: (r) => unitLabel(r.unit), render: (r) => unitLabel(r.unit) },
    { id: "cost", label: "Purchase", width: "11%", minWidth: 90, align: "right", sortValue: (r) => toNumber(r.cost), render: (r) => (toNumber(r.cost) > 0 ? formatINR(toNumber(r.cost)) : "—") },
    { id: "rate", label: "Sale price", width: "11%", minWidth: 90, align: "right", sortValue: (r) => toNumber(r.rate), render: (r) => <Money amount={toNumber(r.rate)} /> },
    {
      id: "margin",
      label: "Margin",
      width: "11%",
      minWidth: 90,
      align: "right",
      sortValue: (r) => toNumber(r.rate) - toNumber(r.cost),
      render: (r) => {
        const m = toNumber(r.rate) - toNumber(r.cost);
        const pct = toNumber(r.rate) > 0 ? Math.round((m / toNumber(r.rate)) * 100) : 0;
        return (
          <Typography sx={{ fontSize: 13 }}>
            <Money amount={m} color="#56CA00" fontWeight={600} />{" "}
            <Typography component="span" variant="caption" color="text.secondary">
              {pct}%
            </Typography>
          </Typography>
        );
      },
    },
    {
      id: "stock",
      label: "In stock",
      width: "11%",
      minWidth: 100,
      align: "right",
      sortValue: (r) => toNumber(r.stockQty),
      render: (r) => {
        const stock = toNumber(r.stockQty);
        const low = toNumber(r.lowStockAt);
        const out = stock <= 0;
        const lowStock = stock <= low;
        return (
          <Typography color={out ? "#FF4C51" : lowStock ? "#D99800" : "text.primary"} sx={{ fontWeight: 600 }}>
            {stock} {out ? "(Out)" : lowStock ? "(Low)" : ""}
          </Typography>
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      width: "10%",
      minWidth: 84,
      align: "center",
      sortable: false,
      render: (r) => (
        <Box onClick={(e) => e.stopPropagation()} sx={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          <TableActionButton variant="edit" title="Edit" onClick={() => openEdit(r)}>
            <EditIcon fontSize="small" />
          </TableActionButton>
          <TableActionButton variant="delete" title="Delete" onClick={() => setDeleteTarget(r)}>
            <DeleteIcon fontSize="small" />
          </TableActionButton>
        </Box>
      ),
    },
  ];

  const deleteMessage = deleteTarget
    ? (deleteTarget.orderUsage ?? 0) > 0
      ? `This product appears on ${deleteTarget.orderUsage} order line(s). It will be removed from the catalog; existing orders keep their saved item names.`
      : "This will remove the product from your catalog."
    : undefined;

  return (
    <>
      <PageCard
        title="Products"
        action={
          <Box
            component="button"
            className="l-btn-secondary"
            onClick={openAdd}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              px: "16px",
              py: "9px",
              border: "none",
              borderRadius: "8px",
              bgcolor: "#8C57FF",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(140,87,255,.4)",
              fontFamily: "inherit",
              "&:hover": { bgcolor: "#7E4EE6" },
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            Add product
          </Box>
        }
      >
        <DataTable columns={columns} rows={rows} getRowId={(r) => r.id} minWidth={980} embedded />
      </PageCard>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit product" : "Add product"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <TextField select label="Pricing basis" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              {PRODUCT_UNITS.map((u) => (
                <MenuItem key={u.value} value={u.value}>
                  {u.label}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth label="Purchase price" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
              <TextField fullWidth label="Sale price" type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} required />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField fullWidth label="Stock quantity" type="number" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: e.target.value })} />
              <TextField fullWidth label="Low stock at" type="number" value={form.lowStockAt} onChange={(e) => setForm({ ...form, lowStockAt: e.target.value })} />
            </Stack>
            <Button variant="contained" color="secondary" onClick={save} disabled={!form.name.trim() || !form.rate}>
              {editId ? "Save changes" : "Save product"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        message={deleteMessage}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
          setDeleteTarget(null);
          load();
        }}
      />
    </>
  );
}
