"use client";

import Box from "@mui/material/Box";

type FilterChipsProps = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export default function FilterChips({ options, value, onChange }: FilterChipsProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <Box
            key={opt.value}
            component="button"
            onClick={() => onChange(opt.value)}
            sx={{
              px: "14px",
              py: "6px",
              borderRadius: "6px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${active ? "#8C57FF" : "#E0DFE4"}`,
              bgcolor: active ? "#8C57FF" : "#fff",
              color: active ? "#fff" : "#6D6B77",
              fontFamily: "inherit",
              lineHeight: 1.4,
              "&:hover": {
                borderColor: active ? "#8C57FF" : "#E0DFE4",
                bgcolor: active ? "#8C57FF" : "#fff",
                color: active ? "#fff" : "#6D6B77",
              },
            }}
          >
            {opt.label}
          </Box>
        );
      })}
    </Box>
  );
}
