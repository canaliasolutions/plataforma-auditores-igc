"use client";

import { AuditCard } from "./audit-card";

// Mock data for demonstration
const mockAudits = [
  {
    id: 1,
    client: {
      name: "Banco Nacional de México",
      logo: null,
    },
    standard: "ISO 27001" as const,
    dateRange: {
      start: "2024-12-15",
      end: "2024-12-20",
    },
    status: "scheduled" as const,
  },
  {
    id: 2,
    client: {
      name: "Grupo Industrial Saltillo",
      logo: null,
    },
    standard: "ISO 9001" as const,
    dateRange: {
      start: "2024-12-10",
      end: "2024-12-18",
    },
    status: "in-progress" as const,
  },
  {
    id: 3,
    client: {
      name: "CEMEX",
      logo: null,
    },
    standard: "ISO 14001" as const,
    dateRange: {
      start: "2024-12-22",
      end: "2024-12-28",
    },
    status: "pending" as const,
  },
  {
    id: 4,
    client: {
      name: "Telefónica México",
      logo: null,
    },
    standard: "ISO 27001" as const,
    dateRange: {
      start: "2024-11-15",
      end: "2024-11-22",
    },
    status: "completed" as const,
  },
  {
    id: 5,
    client: {
      name: "Grupo Bimbo",
      logo: null,
    },
    standard: "ISO 9001" as const,
    dateRange: {
      start: "2024-12-25",
      end: "2025-01-05",
    },
    status: "scheduled" as const,
  },
  {
    id: 6,
    client: {
      name: "Petróleos Mexicanos",
      logo: null,
    },
    standard: "ISO 14001" as const,
    dateRange: {
      start: "2025-01-08",
      end: "2025-01-15",
    },
    status: "scheduled" as const,
  },
];

interface DashboardProps {
  searchTerm?: string;
  filterStatus?: string;
  filterStandard?: string;
}

export function Dashboard({
  searchTerm = "",
  filterStatus = "",
  filterStandard = "",
}: DashboardProps) {
  const filteredAudits = mockAudits.filter((audit) => {
    const matchesSearch = audit.client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || audit.status === filterStatus;
    const matchesStandard =
      !filterStandard || audit.standard === filterStandard;

    return matchesSearch && matchesStatus && matchesStandard;
  });

  const handleAuditClick = (auditId: number) => {
    console.log(`Clicked audit ${auditId}`);
    // TODO: Navigate to audit details page
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Auditorías</h1>
        <p className="dashboard-subtitle">
          Gestiona y supervisa todas las auditorías programadas
        </p>
      </div>

      <div className="dashboard-filters">
        <div className="filter-group">
          <input
            type="search"
            placeholder="Buscar por cliente..."
            className="search-input"
            defaultValue={searchTerm}
          />
        </div>

        <div className="filter-group">
          <select className="filter-select" defaultValue={filterStatus}>
            <option value="">Todos los estados</option>
            <option value="scheduled">Programadas</option>
            <option value="in-progress">En Proceso</option>
            <option value="completed">Completadas</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>

        <div className="filter-group">
          <select className="filter-select" defaultValue={filterStandard}>
            <option value="">Todas las normas</option>
            <option value="ISO 27001">ISO 27001</option>
            <option value="ISO 9001">ISO 9001</option>
            <option value="ISO 14001">ISO 14001</option>
          </select>
        </div>

        <button className="add-audit-btn">+ Nueva Auditoría</button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">
            {mockAudits.filter((a) => a.status === "scheduled").length}
          </div>
          <div className="stat-label">Programadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {mockAudits.filter((a) => a.status === "in-progress").length}
          </div>
          <div className="stat-label">En Proceso</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {mockAudits.filter((a) => a.status === "completed").length}
          </div>
          <div className="stat-label">Completadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {mockAudits.filter((a) => a.status === "pending").length}
          </div>
          <div className="stat-label">Pendientes</div>
        </div>
      </div>

      <div className="dashboard-content">
        {filteredAudits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No se encontraron auditorías</h3>
            <p className="empty-description">
              No hay auditorías que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="audit-grid">
            {filteredAudits.map((audit) => (
              <AuditCard
                key={audit.id}
                client={audit.client}
                standard={audit.standard}
                dateRange={audit.dateRange}
                status={audit.status}
                onClick={() => handleAuditClick(audit.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
