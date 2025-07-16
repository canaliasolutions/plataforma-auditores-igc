"use client";

interface AuditCardProps {
  client: {
    name: string;
    logo?: string;
  };
  standard: "ISO 27001" | "ISO 9001" | "ISO 14001";
  dateRange: {
    start: string;
    end: string;
  };
  status?: "scheduled" | "in-progress" | "completed" | "pending";
  onClick?: () => void;
}

export function AuditCard({
  client,
  standard,
  dateRange,
  status = "scheduled",
  onClick,
}: AuditCardProps) {
  const getStandardColor = (std: string) => {
    switch (std) {
      case "ISO 27001":
        return "#e74c3c"; // Red
      case "ISO 9001":
        return "#2ecc71"; // Green
      case "ISO 14001":
        return "#f39c12"; // Orange
      default:
        return "#00609d"; // Primary
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#2ecc71"; // Green
      case "in-progress":
        return "#f39c12"; // Orange
      case "pending":
        return "#e74c3c"; // Red
      default:
        return "#00609d"; // Blue
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completada";
      case "in-progress":
        return "En Proceso";
      case "pending":
        return "Pendiente";
      default:
        return "Programada";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="audit-card" onClick={onClick}>
      <div className="audit-card-header">
        <div className="client-info">
          <div className="client-logo">
            {client.logo ? (
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="logo-image"
              />
            ) : (
              <div className="logo-placeholder">
                {client.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="client-name">{client.name}</h3>
        </div>
        <div
          className="status-badge"
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {getStatusText(status)}
        </div>
      </div>

      <div className="audit-card-body">
        <div className="standard-info">
          <span
            className="standard-badge"
            style={{ backgroundColor: getStandardColor(standard) }}
          >
            {standard}
          </span>
        </div>

        <div className="date-info">
          <div className="date-item">
            <span className="date-label">Inicio:</span>
            <span className="date-value">{formatDate(dateRange.start)}</span>
          </div>
          <div className="date-item">
            <span className="date-label">Fin:</span>
            <span className="date-value">{formatDate(dateRange.end)}</span>
          </div>
        </div>
      </div>

      <div className="audit-card-footer">
        <span className="duration-info">
          Duración:{" "}
          {Math.ceil(
            (new Date(dateRange.end).getTime() -
              new Date(dateRange.start).getTime()) /
              (1000 * 60 * 60 * 24),
          )}{" "}
          días
        </span>
      </div>
    </div>
  );
}
