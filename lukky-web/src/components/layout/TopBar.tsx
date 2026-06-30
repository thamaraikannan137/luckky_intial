"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

type TopBarProps = {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  search?: string;
  onSearchChange?: (q: string) => void;
  showSearch?: boolean;
};

export default function TopBar({
  title,
  subtitle,
  onMenuClick,
  search = "",
  onSearchChange,
  showSearch = true,
}: TopBarProps) {
  const router = useRouter();

  return (
    <Box
      component="header"
      className="l-top"
      sx={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: "18px",
        px: "26px",
        py: "14px",
        bgcolor: "transparent",
      }}
    >
      <IconButton
        onClick={onMenuClick}
        sx={{ display: { md: "none" }, mr: -1 }}
        aria-label="Open menu"
      >
        <MenuIcon />
      </IconButton>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontWeight: 800,
            fontSize: { xs: 20, md: 23 },
            letterSpacing: "-0.03em",
            color: "#241F38",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 12.5, color: "#8A82A6", mt: "2px" }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1 }} />

      {showSearch && onSearchChange && (
        <Box
          className="l-search"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            bgcolor: "rgba(255,255,255,.75)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,.9)",
            borderRadius: "12px",
            px: "14px",
            py: "10px",
            width: { xs: "100%", md: 262 },
            flexShrink: 0,
            boxShadow: "0 6px 18px rgba(80,60,140,.10)",
          }}
        >
          <SearchIcon sx={{ color: "#A99FC9", fontSize: 17 }} />
          <InputBase
            placeholder="Search customer or phone…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ flex: 1, fontSize: 14, color: "#241F38", "& input::placeholder": { opacity: 1, color: "#A5A3AE" } }}
          />
        </Box>
      )}

      <Box
        component="button"
        className="l-btn-primary"
        onClick={() => router.push("/orders/new")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          px: "20px",
          py: "11px",
          border: "none",
          borderRadius: "12px",
          bgcolor: "#7C3AED",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "0 5px 14px rgba(124,58,237,.30)",
          whiteSpace: "nowrap",
          fontFamily: "inherit",
          flexShrink: 0,
          "&:hover": { bgcolor: "#6D34D0" },
        }}
      >
        <span style={{ fontSize: 17, lineHeight: 1 }}>+</span>
        New Order
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "9px", pl: "6px", flexShrink: 0 }}>
        <Box sx={{ textAlign: "right", lineHeight: 1.2, display: { xs: "none", sm: "block" } }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#241F38" }}>
            Owner
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#8A82A6" }}>
            Full access
          </Typography>
        </Box>
        <Box
          component="button"
          title="Switch role"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid #fff",
            background: "linear-gradient(135deg,#A879FF,#7C3AED)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(124,58,237,.5)",
            fontFamily: "inherit",
            flexShrink: 0,
          }}
        >
          O
        </Box>
      </Box>
    </Box>
  );
}
