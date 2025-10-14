import React from "react";
import DataTable from "@/components/ui/data-table";

const exampleData = {
  header: [
    { width: "40%", label: "Servicio", align: "left" as const },
    {
      width: "20%",
      label: "Estado",
      align: "center" as const,
      cellType: "badge" as const,
      cellProps: { variant: "success" as const },
    },
    { width: "20%", label: "Fecha", align: "center" as const },
    {
      width: "20%",
      label: "Pagado",
      align: "center" as const,
      cellType: "badge" as const,
      cellProps: { variant: "success" as const },
    },
  ],
  data: [
    {
      Servicio: "Limpieza",
      Estado: "Completado",
      Fecha: "2025-09-10",
      Pagado: "Sí",
    },
    {
      Servicio: "Mantenimiento",
      Estado: "Pendiente",
      Fecha: "2025-09-12",
      Pagado: "No",
    },
    {
      Servicio: "Reparación",
      Estado: "Completado",
      Fecha: "2025-09-14",
      Pagado: "Sí",
    },
  ],
};

const DataTableDemo = () => {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">
        Ejemplo de DataTable
      </h2>
      <DataTable data={exampleData} />
    </div>
  );
};

export default DataTableDemo;
