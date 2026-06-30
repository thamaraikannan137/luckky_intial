import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

type KpiCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  valueColor?: string;
};

export default function KpiCard({ label, value, sub, icon, valueColor }: KpiCardProps) {
  return (
    <Box className="l-kpi-card">
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 12.5, color: "#8A82A6", fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography
          component="div"
          sx={{
            fontWeight: 800,
            fontSize: { xs: 22, sm: 24, md: 27 },
            color: valueColor ?? "#241F38",
            mt: "8px",
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.15,
          }}
        >
          {value}
        </Typography>
        {sub && (
          <Typography sx={{ fontSize: 12, color: "#A29BBC", mt: "5px" }}>
            {sub}
          </Typography>
        )}
      </Box>
      {icon && (
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "13px",
            bgcolor: "#F1ECFF",
            color: "#7C3AED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            "& svg": { fontSize: 22 },
          }}
        >
          {icon}
        </Box>
      )}
    </Box>
  );
}
