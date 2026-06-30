import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

type PageCardProps = {
  title: string;
  toolbar?: ReactNode;
  trailing?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

export default function PageCard({ title, toolbar, trailing, action, children }: PageCardProps) {
  return (
    <Box className="l-page-card">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          px: "22px",
          py: "18px",
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            m: 0,
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "-0.01em",
            color: "#241F38",
            mr: "6px",
          }}
        >
          {title}
        </Typography>
        {toolbar}
        <Box sx={{ flex: 1 }} />
        {trailing}
        {action}
      </Box>
      {children}
    </Box>
  );
}
