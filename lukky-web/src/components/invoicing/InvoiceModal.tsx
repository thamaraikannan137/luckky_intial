"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { InvoiceData } from "@/lib/invoice";
import { COMPANY } from "@/lib/constants";

type InvoiceModalProps = {
  data: InvoiceData | null;
  onClose: () => void;
};

export default function InvoiceModal({ data, onClose }: InvoiceModalProps) {
  if (!data) return null;

  const print = () => window.print();

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(47,43,61,.55)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 1300,
        overflow: "auto",
        p: "34px 20px",
      }}
    >
      <Box onClick={(e) => e.stopPropagation()} sx={{ width: 640, maxWidth: "96vw" }}>
        <Box
          className="invoice-toolbar"
          sx={{ display: "flex", justifyContent: "flex-end", gap: "9px", mb: "12px" }}
        >
          <Box
            component="button"
            onClick={print}
            sx={{
              px: "18px",
              py: "10px",
              border: "none",
              borderRadius: "8px",
              bgcolor: "#fff",
              color: "#2F2B3D",
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,.18)",
              fontFamily: "inherit",
            }}
          >
            Print / Save PDF
          </Box>
          <Box
            component="button"
            onClick={onClose}
            sx={{
              px: "16px",
              py: "10px",
              border: "none",
              borderRadius: "8px",
              bgcolor: "#8C57FF",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Close
          </Box>
        </Box>

        <Box
          id="invoice-paper"
          sx={{
            bgcolor: "#fff",
            borderRadius: "8px",
            p: "42px 44px",
            boxShadow: "0 12px 40px rgba(47,43,61,.35)",
            color: "#2F2B3D",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "2px solid #2F2B3D",
              pb: "20px",
            }}
          >
            <Box sx={{ display: "flex", gap: "13px", alignItems: "center" }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "10px",
                  background: "linear-gradient(72deg,#8C57FF,#A379FF)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 23,
                  color: "#fff",
                }}
              >
                L
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 21, lineHeight: 1.2 }}>
                  {COMPANY.name}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: "#6D6B77", lineHeight: 1.5, mt: "2px" }}>
                  {COMPANY.tagline}
                  <br />
                  {COMPANY.addressLine} · {COMPANY.phone}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: data.titleColor }}>
                {data.docTitle}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6D6B77", mt: "3px" }}>
                No. {data.docNo}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6D6B77" }}>{data.dateFmt}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: "22px" }}>
            <Box>
              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#A5A3AE",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Bill To
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 15, mt: "5px" }}>{data.customerName}</Typography>
              <Typography sx={{ fontSize: 12.5, color: "#6D6B77", lineHeight: 1.5, mt: "2px" }}>
                {data.customerAddress}
                {data.customerAddress && data.customerPhone ? <br /> : null}
                {data.customerPhone}
              </Typography>
              {data.hasGst && (
                <Typography sx={{ fontSize: 12, color: "#6D6B77", mt: "3px" }}>
                  GSTIN: {data.customerGst}
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#A5A3AE",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Order
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 14, mt: "5px" }}>{data.orderId}</Typography>
              <Typography sx={{ fontSize: 12, color: "#6D6B77" }}>Delivery: {data.deliveryFmt}</Typography>
            </Box>
          </Box>

          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", mt: "22px", fontSize: 12.5 }}>
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: "#F6F6F8" }}>
                {["Description", "Qty", "Rate", "Amount"].map((h, i) => (
                  <Box
                    key={h}
                    component="th"
                    sx={{
                      textAlign: i === 0 ? "left" : i === 1 ? "center" : "right",
                      px: i === 0 || i === 3 ? "12px" : "8px",
                      py: "10px",
                      fontSize: 10.5,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#A5A3AE",
                      borderBottom: "1px solid #E6E5E8",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {data.items.map((it, i) => (
                <Box component="tr" key={i}>
                  <Box
                    component="td"
                    sx={{ px: "12px", py: "11px", borderBottom: "1px solid #F0EFF2", verticalAlign: "top" }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 12.5 }}>{it.category}</Typography>
                    {it.description && (
                      <Typography sx={{ fontSize: 11.5, color: "#A5A3AE" }}>{it.description}</Typography>
                    )}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      textAlign: "center",
                      px: "8px",
                      py: "11px",
                      borderBottom: "1px solid #F0EFF2",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {it.qtyLabel}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      textAlign: "right",
                      px: "8px",
                      py: "11px",
                      borderBottom: "1px solid #F0EFF2",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {it.rateFmt}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      textAlign: "right",
                      px: "12px",
                      py: "11px",
                      borderBottom: "1px solid #F0EFF2",
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {it.amountFmt}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "16px" }}>
            <Box sx={{ width: 280 }}>
              {data.hasGst && (
                <Box>
                  {[
                    ["Taxable value", data.taxableFmt],
                    ["CGST @ 9%", data.cgstFmt],
                    ["SGST @ 9%", data.sgstFmt],
                  ].map(([label, val]) => (
                    <Box
                      key={label}
                      sx={{ display: "flex", justifyContent: "space-between", py: "5px", fontSize: 13 }}
                    >
                      <Typography component="span" sx={{ color: "#6D6B77", fontSize: 13 }}>
                        {label}
                      </Typography>
                      <Typography component="span" sx={{ fontVariantNumeric: "tabular-nums", fontSize: 13 }}>
                        {val}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: "10px",
                  borderTop: "1.5px solid #2F2B3D",
                  mt: "5px",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <span>Total</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{data.totalFmt}</span>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", py: "5px", fontSize: 13 }}>
                <Typography component="span" sx={{ color: "#56CA00", fontSize: 13 }}>
                  Paid
                </Typography>
                <Typography component="span" sx={{ color: "#56CA00", fontVariantNumeric: "tabular-nums", fontSize: 13 }}>
                  {data.paidFmt}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: "9px",
                  px: "12px",
                  mt: "6px",
                  bgcolor: data.balBg,
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: 15,
                  color: data.balColor,
                }}
              >
                <span>{data.balLabel}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{data.balanceFmt}</span>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: "34px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Typography sx={{ fontSize: 11, color: "#A5A3AE", maxWidth: 300, lineHeight: 1.6 }}>
              {data.footNote}
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 150,
                  borderTop: "1px solid #C9C7D0",
                  pt: "6px",
                  fontSize: 11.5,
                  color: "#6D6B77",
                }}
              >
                Authorised Signatory
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
