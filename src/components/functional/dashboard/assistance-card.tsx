/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { ChevronRight } from "lucide-react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

interface AssistanceCardProps {
  assistance: {
    id: string;
    title: string;
    icon: React.ComponentType<any> | null;
    color: string;
    services: number;
    nextPayment: string;
    isAvailable: boolean;
  };
  onClick?: (assistanceId: string) => void;
}

const AssistanceCard: React.FC<AssistanceCardProps> = ({
  assistance,
  onClick,
}) => {
  const { id, title, icon: Icon, color, nextPayment } = assistance;

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div
                className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {title}
              </h3>
              <p className="text-sm lg:text-base text-gray-400">
                Fecha compra: {nextPayment}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
        </div>
        <div className="flex justify-between gap-2">
          <Badge>{assistance.services} prestaciones</Badge>
          <Badge variant={assistance.isAvailable ? "success" : "error"}>
            {assistance.isAvailable ? "Disponible" : "Con deuda"}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default AssistanceCard;
