import Typography, { TypographyProps } from "@mui/material/Typography";

type TextProps = TypographyProps & {
  fontWeight?: number;
  fontSize?: number | string;
};

/** Typography wrapper — MUI v9 moved fontWeight/fontSize to sx */
export default function Text({ fontWeight, fontSize, sx, ...props }: TextProps) {
  return <Typography {...props} sx={{ fontWeight, fontSize, ...sx }} />;
}
