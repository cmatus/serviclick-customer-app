import React from "react";
import { Home, User, CreditCard, DollarSign } from "lucide-react";

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Inicio" },
    { id: "profile", icon: User, label: "Perfil" },
    { id: "payments", icon: CreditCard, label: "Pagos" },
    { id: "refunds", icon: DollarSign, label: "Reembolsos" },
  ];

  return (
    <nav className="lg:hidden bg-gray-800 border-t border-gray-700 lg:relative lg:bg-gray-900 lg:border-t-0 lg:border-b lg:border-gray-700 h-[80px]">
      <div className="max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex justify-around lg:justify-center lg:space-x-8 py-2 lg:py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-2 py-2 lg:py-3 px-3 lg:px-4 rounded-lg transition-colors ${
                  isActive
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                }`}>
                <Icon
                  className={`w-6 h-6 lg:w-5 lg:h-5 ${
                    isActive ? "text-cyan-400" : ""
                  }`}
                />
                <span
                  className={`text-xs lg:text-sm font-medium ${
                    isActive ? "text-cyan-400" : ""
                  }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
