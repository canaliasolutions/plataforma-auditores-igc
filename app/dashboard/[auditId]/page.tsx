"use client";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { AuditDetail } from "@/components/audit-detail";

interface AuditDetailPageProps {
  params: {
    auditId: string;
  };
}

export default function AuditDetailPage({ params }: AuditDetailPageProps) {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const [account, setAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [isAuthenticated, accounts]);

  if (!isAuthenticated || !account) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}
      >
        <div
          style={{ fontSize: "16px", color: "#7f8c8d", textAlign: "center" }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <Navbar account={account} activeTab="auditorias" />
      <AuditDetail auditId={params.auditId} />
    </div>
  );
}
