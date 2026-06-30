import Box from "@mui/material/Box";
import { ReactNode } from "react";

type TableActionButtonProps = {
  variant: "edit" | "delete";
  title: string;
  onClick: () => void;
  children: ReactNode;
};

const VARIANTS = {
  edit: {
    color: "#6D6B77",
    border: "#EAE9ED",
    hoverBg: "#F2EBFF",
    hoverBorder: "#8C57FF",
    hoverColor: "#8C57FF",
  },
  delete: {
    color: "#FF4C51",
    border: "#EAE9ED",
    hoverBg: "#FFE7E7",
    hoverBorder: "#FF4C51",
    hoverColor: "#FF4C51",
  },
} as const;

export default function TableActionButton({ variant, title, onClick, children }: TableActionButtonProps) {
  const v = VARIANTS[variant];

  return (
    <Box
      component="button"
      type="button"
      title={title}
      onClick={onClick}
      sx={{
        width: 30,
        height: 30,
        border: `1px solid ${v.border}`,
        bgcolor: "#fff",
        borderRadius: "7px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: v.color,
        p: 0,
        fontFamily: "inherit",
        verticalAlign: "middle",
        "&:hover": {
          bgcolor: v.hoverBg,
          borderColor: v.hoverBorder,
          color: v.hoverColor,
        },
        "& svg": { fontSize: 16 },
      }}
    >
      {children}
    </Box>
  );
}
