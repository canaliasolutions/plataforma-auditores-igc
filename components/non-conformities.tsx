"use client";

import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./NonConformities.module.css";

interface NonConformity {
  id: string;
  title: string;
  description: string;
  clause: string;
  severity: "minor" | "major" | "critical";
  status: "open" | "resolved" | "pending";
  dateFound: string;
  dateResolved?: string;
}

interface NonConformitiesProps {
  auditId: string;
}

export function NonConformities({ auditId }: NonConformitiesProps) {
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([
    {
      id: "1",
      title: "Falta de política de contraseñas",
      description:
        "No se encontró una política formal de contraseñas que establezca los requisitos mínimos de complejidad.",
      clause: "A.9.4.3",
      severity: "major",
      status: "open",
      dateFound: "2024-12-16",
    },
    {
      id: "2",
      title: "Acceso no autorizado a sala de servidores",
      description:
        "Se observó que la sala de servidores no cuenta con control de acceso biométrico según procedimiento.",
      clause: "A.11.1.1",
      severity: "critical",
      status: "pending",
      dateFound: "2024-12-17",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newNonConformity, setNewNonConformity] = useState({
    title: "",
    description: "",
    clause: "",
    severity: "minor" as const,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#e74c3c";
      case "major":
        return "#f39c12";
      case "minor":
        return "#f1c40f";
      default:
        return "#95a5a6";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "critical":
        return "Crítica";
      case "major":
        return "Mayor";
      case "minor":
        return "Menor";
      default:
        return "Desconocida";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Abierta";
      case "resolved":
        return "Resuelta";
      case "pending":
        return "Pendiente";
      default:
        return "Desconocido";
    }
  };

  const handleAddNonConformity = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = Date.now().toString();
    const newItem: NonConformity = {
      id: newId,
      ...newNonConformity,
      status: "open",
      dateFound: new Date().toISOString().split("T")[0],
    };

    setNonConformities([...nonConformities, newItem]);
    setNewNonConformity({
      title: "",
      description: "",
      clause: "",
      severity: "minor",
    });
    setShowAddForm(false);
  };

  return (
    <div className={styles["non-conformities"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>No Conformidades</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className={styles["add-button"]}
        >
          <AddIcon sx={{ fontSize: 16, marginRight: 1 }} />
          Agregar No Conformidad
        </button>
      </div>

      {showAddForm && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h3 className={styles["modal-title"]}>Nueva No Conformidad</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className={styles["close-button"]}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form
              onSubmit={handleAddNonConformity}
              className={styles["add-form"]}
            >
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Título:</label>
                <input
                  type="text"
                  value={newNonConformity.title}
                  onChange={(e) =>
                    setNewNonConformity({
                      ...newNonConformity,
                      title: e.target.value,
                    })
                  }
                  className={styles["form-input"]}
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Descripción:</label>
                <textarea
                  value={newNonConformity.description}
                  onChange={(e) =>
                    setNewNonConformity({
                      ...newNonConformity,
                      description: e.target.value,
                    })
                  }
                  className={styles["form-textarea"]}
                  rows={4}
                  required
                />
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["form-group"]}>
                  <label className={styles["form-label"]}>Cláusula:</label>
                  <input
                    type="text"
                    value={newNonConformity.clause}
                    onChange={(e) =>
                      setNewNonConformity({
                        ...newNonConformity,
                        clause: e.target.value,
                      })
                    }
                    className={styles["form-input"]}
                    placeholder="ej. A.9.4.3"
                    required
                  />
                </div>

                <div className={styles["form-group"]}>
                  <label className={styles["form-label"]}>Severidad:</label>
                  <select
                    value={newNonConformity.severity}
                    onChange={(e) =>
                      setNewNonConformity({
                        ...newNonConformity,
                        severity: e.target.value as any,
                      })
                    }
                    className={styles["form-select"]}
                  >
                    <option value="minor">Menor</option>
                    <option value="major">Mayor</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
              </div>

              <div className={styles["form-actions"]}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={styles["cancel-button"]}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles["submit-button"]}>
                  Agregar No Conformidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles["conformities-list"]}>
        {nonConformities.length === 0 ? (
          <div className={styles["empty-state"]}>
            <CheckCircleIcon
              className={styles["empty-icon"]}
              sx={{ fontSize: 64 }}
            />
            <h3 className={styles["empty-title"]}>No hay no conformidades</h3>
            <p className={styles["empty-description"]}>
              No se han registrado no conformidades para esta auditoría.
            </p>
          </div>
        ) : (
          nonConformities.map((item) => (
            <div key={item.id} className={styles["conformity-card"]}>
              <div className={styles["card-header"]}>
                <div className={styles["title-section"]}>
                  <h3 className={styles["conformity-title"]}>{item.title}</h3>
                  <span className={styles["clause-badge"]}>
                    Cláusula {item.clause}
                  </span>
                </div>
                <div className={styles["badges"]}>
                  <span
                    className={styles["severity-badge"]}
                    style={{ backgroundColor: getSeverityColor(item.severity) }}
                  >
                    {getSeverityText(item.severity)}
                  </span>
                  <span className={styles["status-badge"]}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>

              <p className={styles["conformity-description"]}>
                {item.description}
              </p>

              <div className={styles["card-footer"]}>
                <span className={styles["date-info"]}>
                  Encontrada el:{" "}
                  {new Date(item.dateFound).toLocaleDateString("es-ES")}
                </span>
                {item.dateResolved && (
                  <span className={styles["date-info"]}>
                    Resuelta el:{" "}
                    {new Date(item.dateResolved).toLocaleDateString("es-ES")}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
