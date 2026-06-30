"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      {message && (
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Box
          component="button"
          onClick={onCancel}
          disabled={loading}
          sx={{
            flex: 1,
            py: "12px",
            border: "1px solid #D9D8DE",
            borderRadius: "8px",
            bgcolor: "#fff",
            color: "#6D6B77",
            fontWeight: 600,
            fontSize: 14,
            cursor: loading ? "default" : "pointer",
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
            "&:hover": { bgcolor: loading ? "#fff" : "#F6F6F8" },
          }}
        >
          Cancel
        </Box>
        <Box
          component="button"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            flex: 1,
            py: "12px",
            border: "none",
            borderRadius: "8px",
            bgcolor: "#FF4C51",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            cursor: loading ? "default" : "pointer",
            fontFamily: "inherit",
            boxShadow: "0 3px 10px rgba(255,76,81,.4)",
            opacity: loading ? 0.6 : 1,
            "&:hover": { bgcolor: loading ? "#FF4C51" : "#E83E43" },
          }}
        >
          {confirmLabel}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
