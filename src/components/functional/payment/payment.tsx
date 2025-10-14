/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

import DataTable from "@/components/ui/data-table";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";

import { useUI, useInsured, usePayment } from "@/store/hooks";

import { getFamilyIcon } from "@/utils/family";

const colors = [
  "from-cyan-500 to-blue-600",
  "from-green-500 to-emerald-600",
  "from-pink-500 to-rose-600",
  "from-orange-500 to-red-600",
  "from-purple-500 to-indigo-600",
];

const Payment = () => {
  const { uiSetTitle } = useUI();
  const { insuredItem } = useInsured();
  const { paymentList, paymentGetByRut } = usePayment();

  const [isVisible, setIsVisible] = useState(false);

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const productos = paymentList.map((item, index) => ({
    id: item.leadId,
    nombre: item.product.name,
    icon: getFamilyIcon(item.product.familyId),
    color: colors[index % colors.length],
    balance: item.collect.balance,
  }));

  const paymentHistoryConfig = {
    header: [
      { width: "40%", label: "Fecha", align: "left" as const },
      { width: "25%", label: "Monto", align: "right" as const },
      {
        width: "35%",
        label: "Estado",
        align: "center" as const,
        cellType: "badge" as const,
        cellProps: {
          getVariant: (value: string) => {
            if (value === "Aprobado") return "success";
            if (value === "Impago") return "error";
            if (value === "1er Fallo") return "warning";
            if (value === "2do Fallo") return "warning";
            if (value === "3er Fallo") return "error";
            return "default";
          },
        },
      },
    ],
  };

  const getPaymentHistory = (productId: string) => {
    const histories = paymentList.reduce<Record<string, any[]>>((acc, item) => {
      acc[item.leadId] = item.payments.map((payment) => ({
        Fecha: payment.date,
        Monto: new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
        }).format(payment.amount),
        Estado: "Aprobado",
      }));
      return acc;
    }, {});

    return (
      histories[productId] || [
        { Fecha: "2025-09-15", Monto: "$0", Estado: "Aprobado" },
      ]
    );
  };

  const getDebtStatus = (productId: string) => {
    const history = getPaymentHistory(productId);

    const pendingPayments = history.filter(
      (payment) => payment.Estado !== "Aprobado"
    );

    if (pendingPayments.length === 0) {
      return { status: "Al día", amount: null, variant: "success" };
    }

    let totalDebt = 0;
    let currency = "CLP";

    pendingPayments.forEach((payment) => {
      // Determinar moneda por el formato del monto
      const isUF = payment.Monto.includes("UF");
      if (isUF) currency = "UF";

      // Extraer número del monto
      const amount = parseFloat(
        payment.Monto.replace(/[^\d.,]/g, "").replace(",", ".")
      );
      totalDebt += amount;
    });

    const formattedAmount =
      currency === "UF"
        ? `${totalDebt.toFixed(1)} UF`
        : new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(totalDebt);

    return {
      status: "Deuda pendiente",
      amount: formattedAmount,
      variant: "error",
    };
  };

  const handleProductClick = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  useEffect(() => {
    uiSetTitle("Historial de Pagos");
    paymentGetByRut(insuredItem.insured?.rut);
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
  }, []);

  return (
    <div
      className={`flex flex-col gap-4 lg:gap-6 p-3 lg:px-4 xl:px-15 page-transition ${
        isVisible ? "page-active" : "page-enter"
      }`}>
      <h1
        className={`text-lg lg:text-2xl font-semibold text-white animate-on-mount ${
          isVisible ? "animate-fade-in-up" : ""
        }`}>
        Resumen de pagos por producto
      </h1>

      <div className="space-y-3">
        {productos.map((producto, index) => {
          const isExpanded = expandedProduct === producto.id;
          const debtInfo = getDebtStatus(producto.id);

          return (
            <div
              key={producto.id}
              className={`bg-[#181e29] rounded-xl border border-[#232a3a] hover:border-[#2a3441] hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer animate-on-mount ${
                isVisible ? "animate-fade-in-up" : ""
              }`}
              style={{ animationDelay: `${(index + 1) * 100}ms` }}>
              <Card>
                <div
                  className="flex items-center justify-between transition-colors duration-200"
                  onClick={() => handleProductClick(producto.id)}>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${producto.color} rounded-xl flex items-center justify-center`}>
                      {producto.icon ? (
                        <producto.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                      ) : null}
                    </div>
                    <div>
                      <div className="text-white font-medium text-lg">
                        {producto.nombre}
                      </div>
                      <div className="flex justify-end items-center gap-2 mt-1">
                        <Badge
                          variant={
                            producto.balance === 0 ? "success" : "error"
                          }>
                          {producto.balance === 0
                            ? "Al día"
                            : "Deuda: " +
                              new Intl.NumberFormat("es-CL", {
                                style: "currency",
                                currency: "CLP",
                              }).format(producto.balance)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 lg:w-6 lg:h-6 text-gray-400 transition-transform duration-300 ease-in-out ${
                      isExpanded ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </div>
              </Card>

              {/* Contenido expandible - Historial de transacciones */}
              <div
                className={`transition-all duration-300 ease-in-out border-t border-[#232a3a] bg-[#141a26] overflow-hidden ${
                  isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="p-4 lg:p-6">
                  <h3 className="text-white font-medium mb-4 text-sm lg:text-base">
                    Últimas 5 transacciones
                  </h3>
                  <div className="rounded-lg overflow-hidden">
                    <DataTable
                      data={{
                        ...paymentHistoryConfig,
                        data: getPaymentHistory(producto.id),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Payment;
