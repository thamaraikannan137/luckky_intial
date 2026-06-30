import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
};

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Box sx={{ py: 6, textAlign: "center" }}>
      {icon && <Box sx={{ fontSize: 40, mb: 1 }}>{icon}</Box>}
      <Typography  sx={{ fontWeight: 600 }}>{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
