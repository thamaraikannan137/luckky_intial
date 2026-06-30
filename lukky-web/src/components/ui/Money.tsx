import Typography from "@mui/material/Typography";
import { formatINR } from "@/lib/format";

type MoneyProps = {
  amount: number;
  color?: string;
  fontWeight?: number;
  fontSize?: number | string;
};

export default function Money({ amount, color, fontWeight = 700, fontSize = 14 }: MoneyProps) {
  return (
    <Typography
      component="span"
      variant="inherit"
      sx={{
        color,
        fontWeight,
        fontSize,
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1.2,
      }}
    >
      {formatINR(amount)}
    </Typography>
  );
}
