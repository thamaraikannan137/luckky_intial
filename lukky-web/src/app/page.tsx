"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import KpiCard from "@/components/ui/KpiCard";
import DataCard from "@/components/ui/DataCard";
import AvatarInitials from "@/components/ui/AvatarInitials";
import StatusChip from "@/components/ui/StatusChip";
import Money from "@/components/ui/Money";
import { CUSTOMER_TYPE_COLORS, STAGE_COLORS, STAGES } from "@/lib/constants";
import { formatINR, formatDateShort, deliveryLabel } from "@/lib/format";

type DashboardData = {
  kpis: {
    outstanding: number;
    pendingCount: number;
    collectedMonth: number;
    ordersMonthCount: number;
    billedMonth: number;
    customers: number;
    b2b: number;
    b2c: number;
  };
  pendingList: {
    id: string;
    orderCode: string;
    orderDate: string;
    customerName: string;
    customerType: string;
    stage: number;
    balance: number;
  }[];
  deliveryList: {
    id: string;
    orderCode: string;
    customerName: string;
    deliveryDate: string;
    daysToDelivery: number;
  }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <Typography sx={{ color: "#8A82A6" }}>Loading dashboard…</Typography>;
  }

  const { kpis, pendingList, deliveryList } = data;
  const month = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <Box>
      <Box className="l-kpi-grid">
        <KpiCard
          label="Outstanding balance"
          value={formatINR(kpis.outstanding)}
          sub={`${kpis.pendingCount} orders with balance`}
          icon={<AccountBalanceWalletIcon />}
        />
        <KpiCard
          label="Collected this month"
          value={formatINR(kpis.collectedMonth)}
          sub={month}
          icon={<PaymentsIcon />}
        />
        <KpiCard
          label="Orders this month"
          value={String(kpis.ordersMonthCount)}
          sub={`${formatINR(kpis.billedMonth)} billed`}
          icon={<ShoppingCartIcon />}
        />
        <KpiCard
          label="Active customers"
          value={String(kpis.customers)}
          sub={`${kpis.b2b} shops · ${kpis.b2c} individual`}
          icon={<PeopleIcon />}
        />
      </Box>

      <Box className="l-grid2">
        <DataCard
          title="Pending balances"
          action={
            <Link
              component="button"
              onClick={() => router.push("/orders?filter=pending")}
              sx={{ fontSize: 13, color: "#8C57FF", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}
            >
              View all
            </Link>
          }
        >
          <Box sx={{ overflowX: "auto" }}>
            <Box sx={{ minWidth: 440 }}>
              <Box
                sx={{
                  display: "flex",
                  px: "20px",
                  py: "9px",
                  bgcolor: "#F6F6F8",
                  borderTop: "1px solid #E6E5E8",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6D6B77",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                <Box sx={{ flex: 1 }}>Customer</Box>
                <Box sx={{ width: 120 }}>Status</Box>
                <Box sx={{ width: 110, textAlign: "right" }}>Balance</Box>
              </Box>
              {pendingList.map((o) => {
                const ss = STAGE_COLORS[o.stage] ?? STAGE_COLORS[0];
                const tag = CUSTOMER_TYPE_COLORS[o.customerType === "B2C" ? "B2C" : "B2B"];
                return (
                  <Box
                    key={o.id}
                    onClick={() => router.push(`/orders/${o.id}`)}
                    className="l-row-hover"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      px: "20px",
                      py: "11px",
                      borderTop: "1px solid #F0EFF2",
                      cursor: "pointer",
                    }}
                  >
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: "11px", minWidth: 0 }}>
                      <AvatarInitials name={o.customerName} size={34} bg={tag.bg} color={tag.color} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{ fontWeight: 600, fontSize: 13.5, color: "#241F38" }}
                        >
                          {o.customerName}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: "#A5A3AE" }}>
                          {o.orderCode} · {formatDateShort(o.orderDate)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ width: 120, flexShrink: 0 }}>
                      <StatusChip label={STAGES[o.stage]} bg={ss.bg} color={ss.color} />
                    </Box>
                    <Box sx={{ width: 110, textAlign: "right", flexShrink: 0 }}>
                      <Money amount={o.balance} color="#FF4C51" fontSize={14} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </DataCard>

        <DataCard title="Upcoming deliveries" noHeaderBorder>
          <Box sx={{ borderTop: "1px solid #E6E5E8" }}>
            {deliveryList.map((o) => {
              const due = deliveryLabel(o.daysToDelivery);
              const overdue = o.daysToDelivery < 0;
              const soon = o.daysToDelivery >= 0 && o.daysToDelivery <= 3;
              const dotBg = overdue ? "#FFE7E7" : soon ? "#FFF1D6" : "#E9F8DA";
              const dotColor = overdue ? "#FF4C51" : soon ? "#D99800" : "#56CA00";
              return (
                <Box
                  key={o.id}
                  onClick={() => router.push(`/orders/${o.id}`)}
                  className="l-row-hover"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    px: "20px",
                    py: "11px",
                    borderTop: "1px solid #F0EFF2",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "8px",
                      bgcolor: dotBg,
                      color: dotColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {overdue ? (
                      <AccessTimeIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <LocalShippingIcon sx={{ fontSize: 18 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 600, fontSize: 13.5, color: "#241F38" }}>
                      {o.customerName}
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#A5A3AE" }}>
                      {o.orderCode} · {formatDateShort(o.deliveryDate)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: due.color,
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                      fontSize: 12.5,
                      flexShrink: 0,
                    }}
                  >
                    {due.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </DataCard>
      </Box>
    </Box>
  );
}
