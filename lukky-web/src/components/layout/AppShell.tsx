"use client";

import { useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const DRAWER_WIDTH = 248;

const PAGE_META: Record<string, { title: string; subtitle?: string }> = {
  "/": {
    title: "Dashboard",
    subtitle: `Today is ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
  },
  "/customers": { title: "Customers", subtitle: "Manage shop & individual customers" },
  "/orders": { title: "Orders", subtitle: "All jobs, statuses & balances" },
  "/orders/new": { title: "New Order", subtitle: "Create a custom job" },
  "/products": { title: "Products", subtitle: "Categories & reference rates" },
  "/reports": { title: "Reports", subtitle: "Business insights" },
};

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const meta = (() => {
    if (pathname.endsWith("/edit") && pathname.startsWith("/orders/")) {
      return { title: "Edit Order", subtitle: "Update job details & line items" };
    }
    return (
      Object.entries(PAGE_META)
        .sort(([a], [b]) => b.length - a.length)
        .find(([path]) => (path === "/" ? pathname === "/" : pathname.startsWith(path)))?.[1] ??
      PAGE_META["/"]
    );
  })();

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setPendingCount(d.pendingCount ?? 0))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    if (search.trim()) {
      router.push(`/customers?q=${encodeURIComponent(search.trim())}`);
    }
  }, [search, router]);

  const drawer = <Sidebar pendingCount={pendingCount} onNavigate={() => setMobileOpen(false)} />;

  const drawerPaperSx = {
    width: DRAWER_WIDTH,
    boxSizing: "border-box" as const,
    bgcolor: "#fff",
    borderRight: "1px solid #ECEAF3",
    overflow: "hidden",
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "radial-gradient(900px 480px at 82% -10%, #F0ECFB 0%, rgba(240,236,251,0) 60%), #F7F7FB",
        color: "#241F38",
      }}
    >
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: 0 }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": drawerPaperSx,
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { ...drawerPaperSx, position: "relative" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileOpen(true)}
          search={search}
          onSearchChange={setSearch}
          showSearch={!pathname.includes("/orders/new") && !pathname.endsWith("/edit")}
        />
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: "26px",
            pt: "8px",
            pb: "40px",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
