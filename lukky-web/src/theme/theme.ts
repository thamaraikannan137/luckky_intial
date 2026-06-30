"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#7C3AED", dark: "#6D34D0", light: "#A879FF" },
    secondary: { main: "#8C57FF" },
    success: { main: "#56CA00" },
    warning: { main: "#D99800" },
    error: { main: "#FF4C51" },
    background: { default: "#F7F7FB", paper: "#FFFFFF" },
    text: { primary: "#241F38", secondary: "#8A82A6" },
    divider: "#ECEAF3",
    action: {
      hover: "#F8F7FA",
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Public Sans", system-ui, sans-serif',
    fontSize: 14,
    body1: { fontSize: 14, lineHeight: 1.5 },
    body2: { fontSize: 13, lineHeight: 1.5 },
    caption: { fontSize: 12, lineHeight: 1.4 },
    h1: { fontWeight: 800, letterSpacing: "-0.03em", fontSize: "1.625rem" },
    h2: { fontWeight: 700, fontSize: "1.375rem" },
    h3: { fontWeight: 700, fontSize: "1.125rem" },
    h4: { fontWeight: 600, fontSize: "1rem" },
    h5: { fontWeight: 600, fontSize: "0.9375rem" },
    h6: { fontWeight: 600, fontSize: "0.875rem" },
    button: { textTransform: "none", fontWeight: 600, fontSize: 14 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "none",
          "&.MuiButton-containedPrimary:hover": {
            backgroundColor: "#6D34D0",
            boxShadow: "0 5px 14px rgba(124,58,237,.30)",
          },
          "&.MuiButton-containedSecondary:hover": {
            backgroundColor: "#7E4EE6",
            boxShadow: "0 3px 10px rgba(140,87,255,.4)",
          },
          "&.MuiButton-containedError:hover": {
            backgroundColor: "#E83E43",
            boxShadow: "0 3px 10px rgba(255,76,81,.4)",
          },
          "&.MuiButton-outlined:hover": {
            backgroundColor: "#F8F7FA",
            borderColor: "#D9D8DE",
          },
          "&.MuiButton-text:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#F8F7FA",
          },
          "&:hover > .MuiTableCell-root": {
            backgroundColor: "#F8F7FA",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          "&:hover": {
            color: "#8C57FF",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #EEEAFA",
          boxShadow: "0 10px 30px rgba(80,60,140,.07)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: "1px solid #ECEAF3" },
      },
    },
  },
});
