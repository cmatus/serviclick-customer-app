/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import Badge from "@/components/ui/badge";

type CellType = "text" | "badge";

type BadgeVariant = "default" | "success" | "warning" | "error";

interface DataTableHeader {
  width: string;
  label: string;
  align: "left" | "center" | "right";
  cellType?: CellType;
  cellProps?: {
    variant?: BadgeVariant;
    getVariant?: (value: any) => BadgeVariant;
    [key: string]: any;
  };
}

interface DataTableProps {
  data: {
    header: DataTableHeader[];
    data: Record<string, any>[];
  };
}

const alignClass = {
  left: "text-left justify-start",
  center: "text-center justify-center",
  right: "text-right justify-end",
};

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  // Renderiza la celda según el tipo definido en el header
  const renderCell = (col: DataTableHeader, value: any) => {
    switch (col.cellType) {
      case "badge": {
        let variant: BadgeVariant = "default";
        if (col.cellProps?.getVariant) {
          variant = col.cellProps.getVariant(value);
        } else if (col.cellProps?.variant) {
          variant = col.cellProps.variant;
        }
        return <Badge variant={variant}>{value}</Badge>;
      }
      default:
        return value ?? "-";
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-full bg-[#181e29] rounded-2xl border border-[#232a3a]">
        {/* Header */}
        <div className="flex w-full border-b border-[#232a3a] bg-[#232a3a] rounded-t-2xl">
          {data.header.map((col, idx) => (
            <div
              key={col.label + idx}
              className={`px-4 py-4 font-bold text-[#e6eaf3] uppercase tracking-widest text-xs ${
                alignClass[col.align]
              } flex items-center`}
              style={{ width: col.width, minWidth: col.width }}>
              {col.label}
            </div>
          ))}
        </div>
        {/* Rows */}
        {data.data.length === 0 ? (
          <div className="flex w-full p-8 text-gray-400 text-center justify-center bg-gray-900 rounded-b-2xl">
            Sin datos
          </div>
        ) : (
          data.data.map((row, rowIdx) => {
            const isLast = rowIdx === data.data.length - 1;
            return (
              <div
                key={rowIdx}
                className={`flex w-full border-b border-[#232a3a] transition group ${
                  rowIdx % 2 === 0 ? "bg-[#181e29]" : "bg-[#1b222e]"
                } hover:bg-[#22304a]/60 ${isLast ? "rounded-b-xl" : ""}`}
                style={{ minHeight: 48 }}>
                {data.header.map((col, colIdx) => (
                  <div
                    key={col.label + colIdx}
                    className={`px-4 py-3 text-sm text-[#e6eaf3] ${
                      alignClass[col.align]
                    } flex items-center group-hover:text-cyan-200 transition-colors`}
                    style={{ width: col.width, minWidth: col.width }}>
                    {renderCell(col, row[col.label])}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DataTable;
