"use client";

import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InventoryIcon from "@mui/icons-material/Inventory";
import BarChartIcon from "@mui/icons-material/BarChart";
import LockIcon from "@mui/icons-material/Lock";
import { NAV_ITEMS } from "@/lib/constants";

const ICONS: Record<string, React.ReactNode> = {
  Dashboard: <DashboardIcon sx={{ fontSize: 22 }} />,
  People: <PeopleIcon sx={{ fontSize: 22 }} />,
  Assignment: <AssignmentIcon sx={{ fontSize: 22 }} />,
  Inventory: <InventoryIcon sx={{ fontSize: 22 }} />,
  BarChart: <BarChartIcon sx={{ fontSize: 22 }} />,
};

type SidebarProps = {
  pendingCount?: number;
  isAdmin?: boolean;
  onNavigate?: () => void;
};

export default function Sidebar({ pendingCount = 0, isAdmin = true, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        px: "14px",
        py: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -70,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle,#7C3AED12,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", px: "10px", pb: "24px", position: "relative" }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "11px",
            background: "linear-gradient(135deg,#A879FF,#7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 19,
            boxShadow: "0 6px 16px rgba(124,58,237,.35)",
            flexShrink: 0,
          }}
        >
          L
        </Box>
        <Box sx={{ lineHeight: 1.05, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#241F38", letterSpacing: "-0.02em" }}>
            Lukky
          </Typography>
          <Typography sx={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#A5A0B8" }}>
            Enterprises
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 700,
          color: "#A5A0B8",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          px: "12px",
          pb: "10px",
          position: "relative",
        }}
      >
        Menu
      </Typography>

      <Box component="nav" sx={{ display: "flex", flexDirection: "column", gap: "5px", position: "relative" }}>
        {NAV_ITEMS.map((item) => {
          const locked = item.adminOnly && !isAdmin;
          const active = isActive(item.href);
          return (
            <Box
              key={item.key}
              component="button"
              className={active ? "l-nav-item l-nav-item--active" : "l-nav-item"}
              onClick={() => {
                if (!locked) {
                  router.push(item.href);
                  onNavigate?.();
                }
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                px: "13px",
                py: "11px",
                borderRadius: "11px",
                border: "none",
                cursor: locked ? "default" : "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: locked ? "#C7C2D6" : active ? "#fff" : "#56516B",
                background: active
                  ? "linear-gradient(100deg,#7C3AED,#6D34D0)"
                  : "transparent",
                boxShadow: active ? "0 5px 14px rgba(124,58,237,.32)" : "none",
                transition: "all .15s",
                textAlign: "left",
                width: "100%",
                "&:hover": {
                  background: locked
                    ? "transparent"
                    : active
                      ? "linear-gradient(100deg,#7C3AED,#6D34D0)"
                      : "#F6F2FF",
                  boxShadow: active ? "0 5px 14px rgba(124,58,237,.32)" : "none",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: 22,
                  height: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  color: "inherit",
                  flexShrink: 0,
                }}
              >
                {ICONS[item.icon]}
              </Box>
              <Box component="span" sx={{ flex: 1 }}>
                {item.label}
              </Box>
              {item.key === "orders" && pendingCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    minWidth: 20,
                    height: 20,
                    px: "6px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: active ? "rgba(255,255,255,.25)" : "#FFE3E4",
                    color: active ? "#fff" : "#FF4C51",
                  }}
                >
                  {pendingCount}
                </Box>
              )}
              {locked && <LockIcon sx={{ fontSize: 14, opacity: 0.5 }} />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
