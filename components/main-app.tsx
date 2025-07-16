"use client";

import { useState } from "react";
import { AccountInfo } from "@azure/msal-browser";
import { Navbar } from "./navbar";
import { Dashboard } from "./dashboard";

interface MainAppProps {
  account: AccountInfo;
}

export function MainApp({ account }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("auditorias");

  const renderContent = () => {
    switch (activeTab) {
      case "auditorias":
        return <Dashboard />;
      case "clients":
        return (
          <div className="page-placeholder">
            <h2>Gestión de Clientes</h2>
            <p>Módulo en desarrollo...</p>
          </div>
        );
      case "reports":
        return (
          <div className="page-placeholder">
            <h2>Reportes y Estadísticas</h2>
            <p>Módulo en desarrollo...</p>
          </div>
        );
      case "settings":
        return (
          <div className="page-placeholder">
            <h2>Configuración del Sistema</h2>
            <p>Módulo en desarrollo...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="main-app">
      <Navbar
        account={account}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}
