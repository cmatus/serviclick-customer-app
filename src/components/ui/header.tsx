/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Bell } from "lucide-react";
import { useUI } from "@/store/hooks";

const Header = () => {
  const { uiTitle } = useUI();

  return (
    <header className="bg-gray-800 px-6 flex items-center justify-between border-b border-gray-700 w-full h-[80px]">
      <div className={`flex items-center gap-3`}>
        <img
          src="/logo-icon.png"
          alt="Logo"
          className="w-8 h-8 mb-1 lg:hidden xl:hidden"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-white">{uiTitle}</h1>
          <p className="hidden md:block text-gray-400">
            Resumen de tus asistencias y servicios
          </p>
        </div>
      </div>
      <div className="relative">
        <Bell className="w-6 h-6 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"></div>
      </div>
    </header>
  );
};

export default Header;
