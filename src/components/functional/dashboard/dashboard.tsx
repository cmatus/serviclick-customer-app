/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { Home } from "lucide-react";

import AssistanceCard from "./assistance-card";
import AssistanceDetail from "./assistance-detail";

import { useUI, useInsured } from "@/store/hooks";

import { getFamilyIcon } from "@/utils/family";

const colors = [
  "from-cyan-500 to-blue-600",
  "from-green-500 to-emerald-600",
  "from-pink-500 to-rose-600",
  "from-orange-500 to-red-600",
  "from-purple-500 to-indigo-600",
];

const Dashboard = () => {
  const { uiSetTitle } = useUI();
  const { insuredItem } = useInsured();

  const [isVisible, setIsVisible] = useState(false);

  const [selectedAssistanceId, setSelectedAssistanceId] = useState<
    string | null
  >(null);

  const handleAssistanceClick = (assistanceId: string) => {
    setSelectedAssistanceId(assistanceId);
  };

  const handleBackToDashboard = () => {
    setSelectedAssistanceId(null);
  };

  const getAssistanceDetail = (id: string) => {
    const baseData = insuredItem.products.find((a) => a.product.id === id);

    return {
      name: baseData?.product.name,
      description: baseData?.product.description || "Descripción no disponible",
      price: baseData?.product.price || 0,
      currency: baseData?.product.currency || "CLP",
      frequency: baseData?.product.frequency || "Mensual",
      assistances:
        baseData?.product.assistances.map((assistanceItem) => ({
          id: assistanceItem.id,
          name: assistanceItem.name,
          description: assistanceItem.description,
          limit: assistanceItem.limit,
          usedEvents: `${
            assistanceItem.events === 0 ? "Ilimitados" : assistanceItem.events
          } eventos al año`,
          lack: `${assistanceItem.lack} días carencia`,
        })) || [],
    };
  };

  useEffect(() => {
    uiSetTitle("Dashboard");
    setTimeout(() => {
      setIsVisible(true);
    }, 50);
  }, []);

  if (selectedAssistanceId) {
    const assistanceDetail = getAssistanceDetail(selectedAssistanceId);
    return (
      <AssistanceDetail
        onBack={handleBackToDashboard}
        assistance={{
          name: assistanceDetail.name || "",
          description: assistanceDetail.description,
          price: assistanceDetail.price,
          currency: assistanceDetail.currency || "CLP",
          frequency: assistanceDetail.frequency || "Mensual",
          assistances: assistanceDetail.assistances,
        }}
      />
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 lg:gap-6 p-3 lg:px-4 xl:px-15 page-transition ${
        isVisible ? "page-active" : "page-enter"
      }`}>
      <h1
        className={`text-lg lg:text-2xl font-semibold text-white animate-on-mount ${
          isVisible ? "animate-fade-in-up" : ""
        }`}>
        Tus asistencias
      </h1>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6`}>
        {insuredItem.products.map((assistance, index) => (
          <div
            key={index}
            className={`animate-on-mount ${
              isVisible ? "animate-fade-in-up" : ""
            }`}
            style={{ animationDelay: `${index * 100}ms` }}>
            <AssistanceCard
              assistance={{
                id: assistance.product.id,
                title: assistance.product.name,
                icon: getFamilyIcon(assistance.product.familyId) || Home,
                color: colors[index % colors.length],
                services: assistance.product.assistances.length || 0,
                nextPayment: assistance.product.policy.buy,
                isAvailable: assistance.product.collect.balance === 0,
              }}
              onClick={handleAssistanceClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
