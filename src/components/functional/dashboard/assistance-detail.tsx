import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import DataTableCard from "@/components/ui/data-table-card";
import Card from "@/components/ui/card";

interface assistance {
  name: string;
  description: string;
  limit: string;
  usedEvents: string;
  lack: string;
}

interface AssistanceDetailProps {
  assistance: {
    name: string;
    description: string;
    price: number;
    currency: string;
    frequency: string;
    assistances: assistance[];
  };
  onBack?: () => void;
}

const AssistanceDetail: React.FC<AssistanceDetailProps> = ({
  assistance,
  onBack,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar animación de entrada
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
  }, []);
  const prestacionesCardData = {
    layout: [
      {
        cells: [
          {
            key: "name",
            position: "full-width" as const,
            align: "left" as const,
            highlight: true,
          },
        ],
      },
      {
        cells: [
          {
            key: "description",
            position: "full-width" as const,
            align: "justify" as const,
          },
        ],
      },
      {
        cells: [
          {
            key: "limit",
            position: "left" as const,
            align: "left" as const,
          },
          {
            key: "usedEvents",
            position: "center" as const,
            align: "center" as const,
          },
          {
            key: "lack",
            position: "right" as const,
            align: "right" as const,
          },
        ],
      },
    ],
    data: assistance.assistances,
  };

  const formatPrice = (precio: number, moneda: string) => {
    if (moneda === "UF") {
      return `${precio.toFixed(2)} UF`;
    }
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio);
  };

  const formatFrecuencia = (frecuencia: string) => {
    return frecuencia === "anual" ? "Anual" : "Mensual";
  };

  return (
    <div
      className={`flex flex-col gap-4 lg:gap-6 p-3 lg:px-4 xl:px-15 page-transition ${
        isVisible ? "page-active" : "page-enter"
      }`}>
      <div
        className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-on-mount ${
          isVisible ? "animate-fade-in-up" : ""
        }`}>
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#232a3a] rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-lg lg:text-2xl font-semibold text-white">
              {assistance.name}
            </h1>
          </div>
        </div>
      </div>
      <div
        className={`animate-on-mount ${isVisible ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "100ms" }}>
        <Card>
          <p className="text-[#e6eaf3]/80 text-sm lg:text-base mb-4 leading-relaxed">
            {assistance.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#e6eaf3]/60 uppercase tracking-wide">
                Precio
              </label>
              <div className="text-white text-lg font-semibold">
                {formatPrice(assistance.price, assistance.currency)}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#e6eaf3]/60 uppercase tracking-wide">
                Frecuencia de Pago
              </label>
              <div className="text-white text-lg font-semibold">
                {formatFrecuencia(assistance.frequency)}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div
        className={`animate-on-mount ${isVisible ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "200ms" }}>
        <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">
          Prestaciones Incluidas
        </h2>
        <DataTableCard data={prestacionesCardData} />
      </div>
    </div>
  );
};

export default AssistanceDetail;
