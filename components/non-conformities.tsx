"use client";

import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./NonConformities.module.css";

interface NonConformity {
  id: number;
  auditoria_id: string;
  titulo: string;
  descripcion: string;
  clausula: string;
  severidad: "menor" | "mayor" | "critica";
  estado: "abierto" | "resuelto" | "pendiente";
  fecha_encontrado: string;
  fecha_resuelto?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

interface NonConformitiesProps {
  auditId: string;
}

export function NonConformities({ auditId }: NonConformitiesProps) {
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load hallazgos from database
  useEffect(() => {
    loadHallazgos();
  }, [auditId]);

  const loadHallazgos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hallazgos?auditoriaId=${auditId}`);
      if (response.ok) {
        const data = await response.json();
        setNonConformities(data);
      }
    } catch (error) {
      console.error('Error loading hallazgos:', error);
    } finally {
      setLoading(false);
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<NonConformity | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [newNonConformity, setNewNonConformity] = useState({
    titulo: "",
    descripcion: "",
    clausula: "",
    severidad: "menor" as const,
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

  const handleEditNonConformity = (item: NonConformity) => {
    setEditingItem(item);
    setNewNonConformity({
      title: item.title,
      description: item.description,
      clause: item.clause,
      severity: item.severity,
    });
    setShowEditForm(true);
  };

  const handleUpdateNonConformity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedItem: NonConformity = {
      ...editingItem,
      ...newNonConformity,
    };

    setNonConformities(
      nonConformities.map((item) =>
        item.id === editingItem.id ? updatedItem : item,
      ),
    );

    setNewNonConformity({
      title: "",
      description: "",
      clause: "",
      severity: "minor",
    });
    setEditingItem(null);
    setShowEditForm(false);
  };

  const handleDeleteNonConformity = (id: string) => {
    setDeletingItemId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deletingItemId) {
      setNonConformities(
        nonConformities.filter((item) => item.id !== deletingItemId),
      );
    }
    setDeletingItemId(null);
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setDeletingItemId(null);
    setShowDeleteDialog(false);
  };

  return (
    <div className={styles["non-conformities"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Hallazgos</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className={styles["add-button"]}
        >
          <AddIcon sx={{ fontSize: 16, marginRight: 1 }} />
          Agregar hallazgo
        </button>
      </div>

      {showAddForm && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h3 className={styles["modal-title"]}>Nuevo hallazgo</h3>
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
                  Agregar hallazgo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingItem && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h3 className={styles["modal-title"]}>Editar hallazgo</h3>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingItem(null);
                  setNewNonConformity({
                    title: "",
                    description: "",
                    clause: "",
                    severity: "minor",
                  });
                }}
                className={styles["close-button"]}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateNonConformity}
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
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingItem(null);
                    setNewNonConformity({
                      title: "",
                      description: "",
                      clause: "",
                      severity: "minor",
                    });
                  }}
                  className={styles["cancel-button"]}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles["submit-button"]}>
                  Actualizar hallazgo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["delete-dialog"]}>
            <div className={styles["delete-header"]}>
              <h3 className={styles["delete-title"]}>Confirmar Eliminación</h3>
            </div>

            <div className={styles["delete-content"]}>
              <p className={styles["delete-message"]}>
                ¿Estás seguro de que deseas eliminar este hallazgo? Esta
                acción no se puede deshacer.
              </p>
            </div>

            <div className={styles["delete-actions"]}>
              <button
                onClick={cancelDelete}
                className={styles["cancel-button"]}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className={styles["confirm-delete-button"]}
              >
                Eliminar
              </button>
            </div>
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
            <h3 className={styles["empty-title"]}>No hay hallazgos</h3>
            <p className={styles["empty-description"]}>
              No se han registrado hallazgos para esta auditoría.
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
                <div className={styles["date-section"]}>
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
                <div className={styles["action-buttons"]}>
                  <button
                    onClick={() => handleEditNonConformity(item)}
                    className={styles["edit-button"]}
                    title="Editar hallazgo"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteNonConformity(item.id)}
                    className={styles["delete-button"]}
                    title="Eliminar hallazgo"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
