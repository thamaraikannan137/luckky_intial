import Box from "@mui/material/Box";

type StatusChipProps = {
  label: string;
  bg: string;
  color: string;
};

export default function StatusChip({ label, bg, color }: StatusChipProps) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        whiteSpace: "nowrap",
        fontSize: 11.5,
        fontWeight: 600,
        px: "10px",
        py: "3px",
        borderRadius: "5px",
        bgcolor: bg,
        color,
        lineHeight: 1.4,
      }}
    >
      {label}
    </Box>
  );
}
