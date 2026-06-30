"use client";

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import { formatINR } from "@/lib/format";

type ReportData = {
  catSales: { name: string; amount: number; pct: number }[];
  split: { b2b: number; b2c: number; b2bPct: number; b2cPct: number };
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <Typography>Loading reports…</Typography>;

  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontSize: 16 }}>
              Category-wise sales
            </Typography>
            <Stack spacing={1.5}>
              {data.catSales.map((c) => (
                <Box key={c.name}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography  sx={{ fontSize: 13 }}>{c.name}</Typography>
                    <Typography  sx={{ fontWeight: 700 }}>{formatINR(c.amount)}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={c.pct} sx={{ height: 8, borderRadius: 1, bgcolor: "#F0EFF2", "& .MuiLinearProgress-bar": { bgcolor: "#8C57FF", borderRadius: 1 } }} />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ mb: 2.5 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontSize: 16 }}>
              Customer-type split
            </Typography>
            <Box sx={{ display: "flex", height: 12, borderRadius: 1, overflow: "hidden" }}>
              <Box sx={{ width: `${data.split.b2bPct}%`, bgcolor: "#8C57FF" }} />
              <Box sx={{ width: `${data.split.b2cPct}%`, bgcolor: "#16B1FF" }} />
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={6}>
                <Typography variant="caption" color="text.secondary">
                  Shop / Business
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  {formatINR(data.split.b2b)}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="caption" color="text.secondary">
                  Individual
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  {formatINR(data.split.b2c)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

import Stack from "@mui/material/Stack";