"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type Column<T> = {
  id: string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  flex?: number;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
};

type SortDir = "asc" | "desc";

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  getRowId: (row: T) => string;
  minWidth?: number;
  embedded?: boolean;
  paginate?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  defaultSort?: { id: string; dir: SortDir };
};

function cellValue<T>(row: T, col: Column<T>): string | number {
  if (col.sortValue) return col.sortValue(row);
  const raw = (row as Record<string, unknown>)[col.id];
  if (typeof raw === "string" || typeof raw === "number") return raw;
  return "";
}

function compareValues(a: string | number, b: string | number, dir: SortDir) {
  const mult = dir === "asc" ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return (a - b) * mult;
  return String(a).localeCompare(String(b), undefined, { numeric: true }) * mult;
}

export default function DataTable<T>({
  columns,
  rows,
  onRowClick,
  getRowId,
  minWidth = 600,
  embedded = false,
  paginate = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  defaultSort,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ id: string; dir: SortDir } | null>(defaultSort ?? null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    setPage(0);
  }, [rows.length, sort?.id, sort?.dir, pageSize]);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.id === sort.id);
    if (!col || col.sortable === false) return rows;
    return [...rows].sort((a, b) => compareValues(cellValue(a, col), cellValue(b, col), sort.dir));
  }, [rows, sort, columns]);

  const total = sortedRows.length;
  const pageCount = paginate ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const start = paginate ? safePage * pageSize : 0;
  const end = paginate ? Math.min(start + pageSize, total) : total;
  const visibleRows = paginate ? sortedRows.slice(start, end) : sortedRows;

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const toggleSort = (col: Column<T>) => {
    if (col.sortable === false) return;
    setSort((prev) => {
      if (prev?.id !== col.id) return { id: col.id, dir: "asc" };
      return { id: col.id, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  const headCellSx = {
    fontWeight: 600,
    fontSize: 11.5,
    color: "#6D6B77",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    borderTop: "1px solid #E6E5E8",
    borderBottom: embedded ? "1px solid #E6E5E8" : undefined,
    py: "11px",
    px: "22px",
    bgcolor: "#F6F6F8",
    whiteSpace: "nowrap" as const,
  };

  const bodyCellSx = {
    py: "13px",
    px: "22px",
    borderColor: "#F0EFF2",
    fontSize: 14,
  };

  const showFooter = paginate && total > 0;

  const colSx = (col: Column<T>) => ({
    ...(col.width !== undefined ? { width: col.width } : {}),
    minWidth: col.minWidth,
    overflow: "hidden",
  });

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer sx={{ width: "100%", overflowX: "auto", bgcolor: "transparent", boxShadow: "none" }}>
          <Table size="small" sx={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%", minWidth }}>
            <colgroup>
              {columns.map((col) => (
                <col key={col.id} style={{ width: typeof col.width === "string" ? col.width : col.width ? `${col.width}px` : undefined, minWidth: col.minWidth ? `${col.minWidth}px` : undefined }} />
              ))}
            </colgroup>
            <TableHead>
              <TableRow>
                {columns.map((col) => {
                  const active = sort?.id === col.id;
                  const sortable = col.sortable !== false;
                  return (
                    <TableCell
                      key={col.id}
                      align={col.align ?? "left"}
                      onClick={sortable ? () => toggleSort(col) : undefined}
                      sx={{
                        ...headCellSx,
                        ...colSx(col),
                        cursor: sortable ? "pointer" : "default",
                        userSelect: "none",
                        "&:hover": sortable ? { color: "#8C57FF" } : undefined,
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          color: active ? "#8C57FF" : "inherit",
                        }}
                      >
                        {col.label}
                        {sortable && (
                          <Box component="span" sx={{ display: "inline-flex", opacity: active ? 1 : 0.45, fontSize: 14 }}>
                            {active ? (
                              sort?.dir === "asc" ? (
                                <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                              ) : (
                                <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                              )
                            ) : (
                              <UnfoldMoreIcon sx={{ fontSize: 14 }} />
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} sx={{ ...bodyCellSx, textAlign: "center", color: "#A5A3AE" }}>
                    No rows to display
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    onClick={() => onRowClick?.(row)}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:hover": { bgcolor: "#F8F7FA" },
                      "&:hover .MuiTableCell-root": { bgcolor: "#F8F7FA" },
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align ?? "left"} sx={{ ...bodyCellSx, ...colSx(col) }}>
                        {col.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </TableContainer>

      {showFooter && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            px: "22px",
            py: "12px",
            borderTop: "1px solid #E6E5E8",
            bgcolor: "#FAFAFB",
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#6D6B77" }}>
            Showing {start + 1}–{end} of {total}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Typography sx={{ fontSize: 12.5, color: "#A5A3AE" }}>Rows per page</Typography>
              <Box
                component="select"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                sx={{
                  border: "1px solid #E0DFE4",
                  borderRadius: "6px",
                  px: "8px",
                  py: "4px",
                  fontSize: 13,
                  color: "#241F38",
                  bgcolor: "#fff",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {pageSizeOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Box>
            </Box>

            <Typography sx={{ fontSize: 13, color: "#6D6B77", minWidth: 72, textAlign: "center" }}>
              Page {safePage + 1} of {pageCount}
            </Typography>

            <Box
              component="button"
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              sx={{
                width: 32,
                height: 32,
                border: "1px solid #E0DFE4",
                borderRadius: "7px",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: safePage === 0 ? "default" : "pointer",
                opacity: safePage === 0 ? 0.4 : 1,
                fontFamily: "inherit",
                "&:hover": safePage === 0 ? undefined : { bgcolor: "#F8F7FA", borderColor: "#8C57FF", color: "#8C57FF" },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box
              component="button"
              type="button"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              sx={{
                width: 32,
                height: 32,
                border: "1px solid #E0DFE4",
                borderRadius: "7px",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: safePage >= pageCount - 1 ? "default" : "pointer",
                opacity: safePage >= pageCount - 1 ? 0.4 : 1,
                fontFamily: "inherit",
                "&:hover":
                  safePage >= pageCount - 1
                    ? undefined
                    : { bgcolor: "#F8F7FA", borderColor: "#8C57FF", color: "#8C57FF" },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
