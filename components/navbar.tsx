"use client";

import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";

interface NavbarProps {
  account: AccountInfo;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Navbar({
  account,
  activeTab = "auditorias",
  onTabChange,
}: NavbarProps) {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  const tabs = [
    { id: "auditorias", label: "Auditorías" },
    { id: "clients", label: "Clientes" },
    { id: "reports", label: "Reportes" },
    { id: "settings", label: "Configuración" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="brand-title">Sistema de Auditorías</h1>
        </div>

        <div className="navbar-menu">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "nav-tab-active" : ""}`}
              onClick={() => onTabChange?.(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">
              {account.name ? account.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{account.name || "Usuario"}</span>
              <span className="user-email">{account.username}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
