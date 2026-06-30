"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterChips from "@/components/ui/FilterChips";
import DataTable, { Column } from "@/components/ui/DataTable";
import PageCard from "@/components/ui/PageCard";
import AvatarInitials from "@/components/ui/AvatarInitials";
import Money from "@/components/ui/Money";
import StatusChip from "@/components/ui/StatusChip";
import TableActionButton from "@/components/ui/TableActionButton";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { CUSTOMER_TYPE_COLORS } from "@/lib/constants";

type CustomerRow = {
  id: string;
  customerCode: string;
  name: string;
  type: string;
  phone: string;
  contactPerson: string | null;
  area: string | null;
  orderCount: number;
  pending: number;
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Shop / Business", value: "B2B" },
  { label: "Individual", value: "B2C" },
];

function CustomersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "B2B",
    name: "",
    contactPerson: "",
    phone: "",
    address: "",
    gstin: "",
    notes: "",
  });

  const q = searchParams.get("q") ?? "";

  const load = () => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("type", filter);
    if (q) params.set("q", q);
    fetch(`/api/customers?${params}`)
      .then((r) => r.json())
      .then(setRows);
  };

  useEffect(load, [filter, q]);

  const openAdd = () => {
    setEditId(null);
    setForm({ type: "B2B", name: "", contactPerson: "", phone: "", address: "", gstin: "", notes: "" });
    setModalOpen(true);
  };

  const openEdit = (row: CustomerRow) => {
    setEditId(row.id);
    fetch(`/api/customers/${row.id}`)
      .then((r) => r.json())
      .then((c) => {
        setForm({
          type: c.type,
          name: c.name,
          contactPerson: c.contactPerson || "",
          phone: c.phone,
          address: c.address || "",
          gstin: c.gstin || "",
          notes: c.notes || "",
        });
        setModalOpen(true);
      });
  };

  const save = async () => {
    const url = editId ? `/api/customers/${editId}` : "/api/customers";
    const method = editId ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setModalOpen(false);
    load();
  };

  const columns: Column<CustomerRow>[] = [
    {
      id: "name",
      label: "Customer",
      width: "32%",
      minWidth: 160,
      sortValue: (c) => c.name,
      render: (c) => {
        const tag = CUSTOMER_TYPE_COLORS[c.type === "B2C" ? "B2C" : "B2B"];
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: "11px", minWidth: 0 }}>
            <AvatarInitials name={c.name} size={38} bg={tag.bg} color={tag.color} />
            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography noWrap sx={{ fontWeight: 600, fontSize: 14, color: "#241F38" }}>
                {c.name}
              </Typography>
              <Typography noWrap sx={{ fontSize: 12, color: "#A5A3AE" }}>
                {c.contactPerson || c.area || c.customerCode}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: "type",
      label: "Type",
      width: "14%",
      minWidth: 110,
      sortValue: (c) => c.type,
      render: (c) => {
        const tag = CUSTOMER_TYPE_COLORS[c.type === "B2C" ? "B2C" : "B2B"];
        return <StatusChip label={tag.label} bg={tag.bg} color={tag.color} />;
      },
    },
    {
      id: "phone",
      label: "Phone",
      width: "19%",
      minWidth: 150,
      sortValue: (c) => c.phone,
      render: (c) => (
        <Typography noWrap sx={{ fontSize: 13.5, color: "#6D6B77", fontVariantNumeric: "tabular-nums" }}>
          {c.phone}
        </Typography>
      ),
    },
    { id: "orders", label: "Orders", width: "10%", minWidth: 72, align: "center", sortValue: (c) => c.orderCount, render: (c) => c.orderCount },
    {
      id: "pending",
      label: "Pending",
      width: "15%",
      minWidth: 100,
      align: "right",
      sortValue: (c) => c.pending,
      render: (c) => (c.pending > 0 ? <Money amount={c.pending} color="#FF4C51" /> : "—"),
    },
    {
      id: "actions",
      label: "Actions",
      width: "10%",
      minWidth: 84,
      align: "center",
      sortable: false,
      render: (c) => (
        <Box onClick={(e) => e.stopPropagation()} sx={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          <TableActionButton variant="edit" title="Edit" onClick={() => openEdit(c)}>
            <EditIcon fontSize="small" />
          </TableActionButton>
          <TableActionButton variant="delete" title="Delete" onClick={() => setDeleteId(c.id)}>
            <DeleteIcon fontSize="small" />
          </TableActionButton>
        </Box>
      ),
    },
  ];

  return (
    <>
    <PageCard
      title="Customers"
      toolbar={<FilterChips options={FILTERS} value={filter} onChange={setFilter} />}
      trailing={
        <Typography sx={{ fontSize: 13, color: "#A5A3AE" }}>
          {rows.length} customer{rows.length !== 1 ? "s" : ""}
          {q ? ` matching "${q}"` : ""}
        </Typography>
      }
      action={
        <Box
          component="button"
          onClick={openAdd}
          className="l-btn-secondary"
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
          Add customer
        </Box>
      }
    >
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        onRowClick={(r) => router.push(`/customers/${r.id}`)}
        minWidth={820}
        embedded
      />
    </PageCard>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit customer" : "Add customer"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <ToggleButtonGroup
              exclusive
              value={form.type}
              onChange={(_, v) => v && setForm({ ...form, type: v })}
              fullWidth
              size="small"
            >
              <ToggleButton value="B2B">Shop / Business</ToggleButton>
              <ToggleButton value="B2C">Individual</ToggleButton>
            </ToggleButtonGroup>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            {form.type === "B2B" && (
              <TextField label="Contact person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            )}
            <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <TextField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} multiline />
            {form.type === "B2B" && (
              <TextField label="GSTIN" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
            )}
            <TextField label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} multiline />
            <Button variant="contained" color="secondary" onClick={save}>
              {editId ? "Save changes" : "Save customer"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete customer?"
        message="This will soft-delete the customer record."
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          await fetch(`/api/customers/${deleteId}`, { method: "DELETE" });
          setDeleteId(null);
          load();
        }}
      />
    </>
  );
}

export default function CustomersPage() {
  return (
    <Suspense>
      <CustomersContent />
    </Suspense>
  );
}
