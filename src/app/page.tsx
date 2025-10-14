/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState } from "react";

import Sidebar from "@/components/ui/sidebar";
import BottomNavigation from "@/components/ui/bottom-navigation";
import Header from "@/components/ui/header";
import Dashboard from "@/components/functional/dashboard/dashboard";
import Payment from "@/components/functional/payment/payment";
import Profile from "@/components/functional/profile/profile";
import Reimbursement from "@/components/functional/reimbursement/reimbursement";
import Login from "@/components/functional/login/login";

import { useUI, useAuth } from "@/store/hooks";

export default function Home() {
  const { uiSetTitle } = useUI();
  const { authUser } = useAuth();

  const [currentView, setCurrentView] = useState("dashboard");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewChange = (newView: string) => {
    if (newView === currentView) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(newView);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const renderCurrentView = () => {
    if (!authUser.id) {
      return <Login />;
    }
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile />;
      case "payments":
        return <Payment />;
      case "refunds":
        return <Reimbursement />;
      default:
        return <div>Dashboard</div>;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-900 text-white font-sans w-full overflow-hidden">
      {authUser.id ? (
        <div className={`flex w-full h-full`}>
          <Sidebar currentView={currentView} onViewChange={handleViewChange} />
          <div
            className={`flex flex-col w-full lg:w-[calc(100%-320px)] h-full`}>
            <Header />
            <div
              className={`h-[calc(100%-160px)] lg:h-[calc(100%-80px)] overflow-hidden overflow-y-auto smooth-scroll page-transition ${
                isTransitioning ? "page-exit" : "page-active"
              }`}>
              {renderCurrentView()}
            </div>
            <BottomNavigation
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}
