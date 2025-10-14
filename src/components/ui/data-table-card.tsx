/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Badge from "@/components/ui/badge";

import Card from "@/components/ui/card";

type CellType = "text" | "badge";
type BadgeVariant = "default" | "success" | "warning" | "error";
type CellPosition = "left" | "center" | "right" | "full-width";
type CellAlign = "left" | "center" | "right" | "justify";

interface CellLayout {
  key: string;
  position: CellPosition;
  align?: CellAlign;
  cellType?: CellType;
  cellProps?: {
    variant?: BadgeVariant;
    getVariant?: (value: any) => BadgeVariant;
    [key: string]: any;
  };
  label?: string;
  className?: string;
  highlight?: boolean; // Nueva propiedad para resaltar texto
}

interface RowLayout {
  cells: CellLayout[];
  flexRow?: boolean; // Nueva propiedad para usar flex justify-between
}

interface DataTableCardProps {
  data: {
    layout: RowLayout[];
    data: Record<string, any>[];
  };
  className?: string;
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const DataTableCard: React.FC<DataTableCardProps> = ({
  data,
  className = "",
}) => {
  const renderCell = (cell: CellLayout, value: any) => {
    const content = (() => {
      switch (cell.cellType) {
        case "badge": {
          let variant: BadgeVariant = "default";
          if (cell.cellProps?.getVariant) {
            variant = cell.cellProps.getVariant(value);
          } else if (cell.cellProps?.variant) {
            variant = cell.cellProps.variant;
          }
          return <Badge variant={variant}>{value}</Badge>;
        }
        default:
          return value ?? "-";
      }
    })();

    const cellAlign = cell.align || "left";
    const isFullWidth = cell.position === "full-width";

    return (
      <div
        key={cell.key}
        className={`${isFullWidth ? "col-span-full" : "flex-1"} ${
          alignClass[cellAlign]
        } ${cell.className || ""}`}>
        {cell.label && (
          <div className="text-xs text-[#e6eaf3]/60 font-medium mb-1 uppercase tracking-wide">
            {cell.label}
          </div>
        )}
        <div
          className={`$${
            cell.highlight
              ? "text-white font-medium text-sm leading-5"
              : "text-[#e6eaf3]/80 text-sm"
          } break-words`}>
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {data.data.map((row, rowIdx) => (
        <Card key={rowIdx}>
          {data.layout.map((layoutRow, layoutIdx) => (
            <div
              key={layoutIdx}
              className={`${
                layoutRow.flexRow
                  ? "flex justify-between items-center"
                  : "grid grid-cols-12 gap-3"
              } ${layoutIdx > 0 ? "mt-2" : ""}`}>
              {layoutRow.cells.map((cell) => {
                if (layoutRow.flexRow) {
                  return (
                    <div
                      key={cell.key}
                      className={alignClass[cell.align || "left"]}>
                      {renderCell(cell, row[cell.key])}
                    </div>
                  );
                }

                const colSpan =
                  cell.position === "full-width"
                    ? "col-span-12"
                    : cell.position === "left"
                    ? "col-span-4"
                    : cell.position === "center"
                    ? "col-span-4 col-start-5"
                    : "col-span-4 col-start-9";

                return (
                  <div key={cell.key} className={colSpan}>
                    {renderCell(cell, row[cell.key])}
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default DataTableCard;
