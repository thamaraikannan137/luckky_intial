"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

type DataCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  noHeaderBorder?: boolean;
};

export default function DataCard({ title, action, children, noHeaderBorder }: DataCardProps) {
  return (
    <Box className="l-panel-card">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "20px",
          pt: "18px",
          pb: "14px",
        }}
      >
        <Typography sx={{ m: 0, fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#241F38" }}>
          {title}
        </Typography>
        {action}
      </Box>
      <Box sx={{ borderTop: noHeaderBorder ? "none" : undefined }}>{children}</Box>
    </Box>
  );
}
