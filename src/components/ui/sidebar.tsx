/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Home, CreditCard, DollarSign, User } from "lucide-react";

import { useAuth } from "@/store/hooks";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { authUser } = useAuth();

  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "profile", icon: User, label: "Perfil" },
    { id: "payments", icon: CreditCard, label: "Historial de Pagos" },
    { id: "refunds", icon: DollarSign, label: "Reembolsos" },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[320px] lg:bg-gray-800 lg:border-r lg:border-gray-700 lg:h-screen lg:left-0 lg:top-0">
      <div className="flex items-center justify-center p-6 border-b border-gray-700 h-[80px] gap-2">
        <img src="/logo-icon.png" alt="Logo" className="w-8 h-8" />
        <span className={`text-2xl font-bold`}>ServiClick</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}>
              <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : ""}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-6 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <div className="w-full h-full aspect-square rounded-full overflow-hidden flex items-center justify-center bg-white/10">
              <User className="w-7 h-7 text-gray-900" />
            </div>
          </div>
          <div>
            <h2
              className="text-md font-semibold text-white max-w-[200px] truncate"
              title={`${authUser.insured.name} ${authUser.insured.paternalLastname}`}>
              {authUser.insured.name} {authUser.insured.paternalLastname}
            </h2>
            <p
              className="text-sm text-gray-400 max-w-[200px] truncate"
              title={authUser.insured.email}>
              {authUser.insured.email.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
