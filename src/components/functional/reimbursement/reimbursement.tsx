/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { Plus, ChevronRight } from "lucide-react";

import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";

import ReimbursementDetail from "./reimbursement-detail";

import { useUI, useTicket, useInsured } from "@/store/hooks";

const Reimbursement = () => {
  const { uiSetTitle } = useUI();
  const {
    ticketReimbursementGetByRut,
    ticketReimbursementGetById,
    ticketReset,
    ticketList,
    ticketItem,
  } = useTicket();
  const { insuredItem } = useInsured();

  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [isEditing, setIsEditing] = useState(false);
  const [reimbursementData, setReimbursementData] = useState<any>({
    layout: [
      {
        cells: [
          {
            key: "productName",
            position: "left" as const,
            align: "left" as const,
            highlight: true,
          },
          {
            key: "amount",
            position: "right" as const,
            align: "right" as const,
          },
        ],
      },
      {
        cells: [
          {
            key: "date",
            position: "left" as const,
            align: "left" as const,
          },
          {
            key: "status",
            position: "right" as const,
            align: "right" as const,
            cellType: "badge" as const,
            cellProps: {
              getVariant: (value: string) => {
                if (value === "Aprobado") return "success";
                if (value === "Rechazado") return "error";
                if (value === "En revisión") return "warning";
                if (value === "Pendiente") return "default";
                return "default";
              },
            },
          },
        ],
      },
    ],
    data: [],
  });

  const handleNewReimbursement = () => {
    ticketReset();
    setIsEditing(true);
    setCurrentView("detail");
  };

  const handleReimbursementClick = (reimbursementData: any) => {
    setIsEditing(true);
    ticketReimbursementGetById(reimbursementData.id);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    ticketReset();
    setIsEditing(false);
  };

  const handleSave = (data: any) => {
    console.log("Guardar reembolso:", data);
    // Aquí iría la lógica para guardar el reembolso
    handleBackToList();
  };

  useEffect(() => {
    uiSetTitle("Reembolsos");
    ticketReimbursementGetByRut(insuredItem.insured.rut);
  }, []);

  useEffect(() => {
    if (ticketList.length > 0) {
      setReimbursementData({
        ...reimbursementData,
        data: ticketList.map((item) => ({
          id: item.ticketId,
          productName: item.product.name,
          amount: new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(item.amount),
          date: item.date,
          status: item.status,
        })),
      });
    }
  }, [ticketList]);

  useEffect(() => {
    if (ticketItem.ticketId && isEditing) {
      setIsEditing(false);
      setCurrentView("detail");
    }
  }, [ticketItem, isEditing]);

  if (currentView === "detail" && ticketItem) {
    return (
      <ReimbursementDetail
        reimbursement={ticketItem.ticketId ? ticketItem : undefined}
        onBack={handleBackToList}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6 p-3 lg:px-4 xl:px-15">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-lg lg:text-2xl font-semibold text-white">
          Reembolsos solicitados
        </h1>
        {reimbursementData.data.length > 0 && (
          <button
            onClick={handleNewReimbursement}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm lg:text-base">
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            Nuevo Reembolso
          </button>
        )}
      </div>
      <div>
        {reimbursementData.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-[#232a3a] rounded-full p-6 mb-4">
              <svg
                className="w-16 h-16 text-[#e6eaf3]/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">
              No hay reembolsos registrados
            </h3>
            <p className="text-[#e6eaf3]/60 text-sm text-center mb-6">
              Aún no has solicitado ningún reembolso. Haz clic en el botón
              &quot;Nuevo Reembolso&quot; para comenzar.
            </p>
            <button
              onClick={handleNewReimbursement}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
              <Plus className="w-5 h-5" />
              Solicitar Primer Reembolso
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {reimbursementData.data.map((reimbursement: any, index: number) => {
              const getVariant = (value: string) => {
                if (value === "Aprobado") return "success";
                if (value === "Rechazado") return "error";
                if (value === "En revisión") return "warning";
                if (value === "Pendiente") return "default";
                return "default";
              };
              return (
                <Card key={index}>
                  <div
                    className="flex items-center justify-between"
                    onClick={() => handleReimbursementClick(reimbursement)}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-white font-medium text-sm">
                          {reimbursement.productName}
                        </div>
                        <div className="text-[#e6eaf3]/80 text-sm">
                          {reimbursement.amount}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-[#e6eaf3]/80 text-sm">
                          {reimbursement.date}
                        </div>
                        <Badge
                          variant={getVariant(reimbursement.status) as any}>
                          {reimbursement.status}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 ml-4 transition-colors" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reimbursement;
