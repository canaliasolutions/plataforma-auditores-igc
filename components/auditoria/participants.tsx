"use client";

import {useState, useEffect, useCallback} from "react";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./Participants.module.css";

interface Participant {
  id: number;
  auditoria_id: string;
  nombre_completo: string;
  cargo_rol: string;
  correo_electronico: string;
  asistio_reunion_inicial: number;
  asistio_reunion_cierre: number;
  fecha_agregado: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

interface ParticipantsProps {
  auditId: string;
}

export function Participants({ auditId }: ParticipantsProps) {
    const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadParticipants = useCallback(async () => {
    try {
      setLoading(true); // setLoading is a stable function reference
      const response = await fetch(`/api/participantes?auditoriaId=${auditId}`); // auditId is a dependency
      if (response.ok) {
        const data = await response.json();
        setParticipants(data); // setParticipants is a stable function reference
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  }, [auditId]);

  // Load participants from database
  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<Participant | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [newParticipant, setNewParticipant] = useState({
    nombre_completo: "",
    cargo_rol: "",
    correo_electronico: "",
    asistio_reunion_inicial: false,
    asistio_reunion_cierre: false,
  });

    const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/participantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditoriaId: auditId,
          nombreCompleto: newParticipant.nombre_completo,
          cargoRol: newParticipant.cargo_rol,
          correoElectronico: newParticipant.correo_electronico,
          asistioReunionInicial: newParticipant.asistio_reunion_inicial,
          asistioReunionCierre: newParticipant.asistio_reunion_cierre,
          fechaAgregado: new Date().toISOString().split("T")[0],
        }),
      });

      if (response.ok) {
        await loadParticipants(); // Reload the list
        setNewParticipant({
          nombre_completo: "",
          cargo_rol: "",
          correo_electronico: "",
          asistio_reunion_inicial: false,
          asistio_reunion_cierre: false,
        });
        setShowAddForm(false);
      } else {
        console.error('Error adding participant');
      }
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

    const handleEditParticipant = (item: Participant) => {
    setEditingItem(item);
    setNewParticipant({
      nombre_completo: item.nombre_completo,
      cargo_rol: item.cargo_rol,
      correo_electronico: item.correo_electronico,
      asistio_reunion_inicial: Boolean(item.asistio_reunion_inicial),
      asistio_reunion_cierre: Boolean(item.asistio_reunion_cierre),
    });
    setShowEditForm(true);
  };

    const handleUpdateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const response = await fetch('/api/participantes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingItem.id,
          nombreCompleto: newParticipant.nombre_completo,
          cargoRol: newParticipant.cargo_rol,
          correoElectronico: newParticipant.correo_electronico,
          asistioReunionInicial: newParticipant.asistio_reunion_inicial,
          asistioReunionCierre: newParticipant.asistio_reunion_cierre,
        }),
      });

      if (response.ok) {
        await loadParticipants(); // Reload the list
        setNewParticipant({
          nombre_completo: "",
          cargo_rol: "",
          correo_electronico: "",
          asistio_reunion_inicial: false,
          asistio_reunion_cierre: false,
        });
        setEditingItem(null);
        setShowEditForm(false);
      } else {
        console.error('Error updating participant');
      }
    } catch (error) {
      console.error('Error updating participant:', error);
    }
  };

    const handleDeleteParticipant = (id: number) => {
    setDeletingItemId(id);
    setShowDeleteDialog(true);
  };

    const confirmDelete = async () => {
    if (deletingItemId) {
      try {
        const response = await fetch('/api/participantes', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: deletingItemId }),
        });

        if (response.ok) {
          await loadParticipants(); // Reload the list
        } else {
          console.error('Error deleting participant');
        }
      } catch (error) {
        console.error('Error deleting participant:', error);
      }
    }
    setDeletingItemId(null);
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setDeletingItemId(null);
    setShowDeleteDialog(false);
  };

  if (loading) {
    return (
        <div className={styles["participants"]}>
          <div className={styles["loading-state"]}>
            <p>Cargando participantes...</p>
          </div>
        </div>
    );
  }

  return (
    <div className={styles["participants"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Participantes</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className={styles["add-button"]}
        >
          <AddIcon sx={{ fontSize: 16, marginRight: 1 }} />
          Agregar participante
        </button>
      </div>

      {showAddForm && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-header"]}>
              <h3 className={styles["modal-title"]}>Nuevo participante</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className={styles["close-button"]}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form
              onSubmit={handleAddParticipant}
              className={styles["add-form"]}
            >
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Nombre completo:</label>
                <input
                  type="text"
                                    value={newParticipant.nombre_completo}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                                            nombre_completo: e.target.value,
                    })
                  }
                  className={styles["form-input"]}
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Cargo/Rol:</label>
                <input
                  type="text"
                                    value={newParticipant.cargo_rol}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                                            cargo_rol: e.target.value,
                    })
                  }
                  className={styles["form-input"]}
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Correo electrónico:</label>
                <input
                  type="email"
                                    value={newParticipant.correo_electronico}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                                            correo_electronico: e.target.value,
                    })
                  }
                  className={styles["form-input"]}
                  required
                />
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["checkbox-group"]}>
                  <label className={styles["checkbox-label"]}>
                    <input
                      type="checkbox"
                                            checked={newParticipant.asistio_reunion_inicial}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                                                  asistio_reunion_inicial: e.target.checked,
                        })
                      }
                      className={styles["checkbox"]}
                    />
                    Asistió a la reunión inicial
                  </label>
                </div>

                <div className={styles["checkbox-group"]}>
                  <label className={styles["checkbox-label"]}>
                    <input
                      type="checkbox"
                                            checked={newParticipant.asistio_reunion_cierre}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                                                  asistio_reunion_cierre: e.target.checked,
                        })
                      }
                      className={styles["checkbox"]}
                    />
                    Asistió a la reunión de cierre
                  </label>
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
                  Agregar participante
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
              <h3 className={styles["modal-title"]}>Editar participante</h3>
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingItem(null);
                                    setNewParticipant({
                    nombre_completo: "",
                    cargo_rol: "",
                    correo_electronico: "",
                    asistio_reunion_inicial: false,
                    asistio_reunion_cierre: false,
                  });
                }}
                className={styles["close-button"]}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateParticipant}
              className={styles["add-form"]}
            >
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Nombre completo:</label>
                <input
                  type="text"
                                    value={newParticipant.nombre_completo}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                                            nombre_completo: e.target.value,
                    })
                  }
                  className={styles["form-input"]}
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Cargo/Rol:</label>
                <input
                  type="text"
                                    value={newParticipant.cargo_rol}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                                            cargo_rol: e.target.value,
                    })
                  }
                  className={styles["form-input"]}
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]}>Correo electrónico:</label>
                <input
                  type="email"
                                    value={newParticipant.correo_electronico}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                                            correo_electronico: e.target.value,
                    })
                  }
                  className={styles["form-input"]}
                  required
                />
              </div>

              <div className={styles["form-row"]}>
                <div className={styles["checkbox-group"]}>
                  <label className={styles["checkbox-label"]}>
                    <input
                      type="checkbox"
                                            checked={newParticipant.asistio_reunion_inicial}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                                                  asistio_reunion_inicial: e.target.checked,
                        })
                      }
                      className={styles["checkbox"]}
                    />
                    Asistió a la reunión inicial
                  </label>
                </div>

                <div className={styles["checkbox-group"]}>
                  <label className={styles["checkbox-label"]}>
                    <input
                      type="checkbox"
                                            checked={newParticipant.asistio_reunion_cierre}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                                                  asistio_reunion_cierre: e.target.checked,
                        })
                      }
                      className={styles["checkbox"]}
                    />
                    Asistió a la reunión de cierre
                  </label>
                </div>
              </div>

              <div className={styles["form-actions"]}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingItem(null);
                    setNewParticipant({
                      nombre_completo: "",
                      cargo_rol: "",
                      correo_electronico: "",
                      asistio_reunion_inicial: false,
                      asistio_reunion_cierre: false,
                    });
                  }}
                  className={styles["cancel-button"]}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles["submit-button"]}>
                  Actualizar participante
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
              <h3 className={styles["delete-title"]}>Confirmar eliminación</h3>
            </div>

            <div className={styles["delete-content"]}>
              <p className={styles["delete-message"]}>
                ¿Estás seguro de que deseas eliminar este participante? Esta
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

      <div className={styles["participants-list"]}>
        {participants.length === 0 ? (
          <div className={styles["empty-state"]}>
            <PersonIcon
              className={styles["empty-icon"]}
              sx={{ fontSize: 64 }}
            />
            <h3 className={styles["empty-title"]}>No hay participantes</h3>
            <p className={styles["empty-description"]}>
              No se han registrado participantes para esta auditoría.
            </p>
          </div>
        ) : (
          participants.map((participant) => (
            <div key={participant.id} className={styles["participant-card"]}>
              <div className={styles["card-header"]}>
                <div className={styles["participant-info"]}>
                              <h3 className={styles["participant-name"]}>{participant.nombre_completo}</h3>
                  <div className={styles["participant-details"]}>
                    <div className={styles["detail-item"]}>
                      <WorkIcon className={styles["detail-icon"]} />
                                            <span className={styles["detail-text"]}>{participant.cargo_rol}</span>
                    </div>
                    <div className={styles["detail-item"]}>
                      <EmailIcon className={styles["detail-icon"]} />
                                            <span className={styles["detail-text"]}>{participant.correo_electronico}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles["attendance-section"]}>
                <h4 className={styles["attendance-title"]}>Asistencia a reuniones</h4>
                <div className={styles["attendance-items"]}>
                  <div className={styles["attendance-item"]}>
                    <CheckCircleIcon 
                      className={`${styles["attendance-icon"]} ${
                                                participant.asistio_reunion_inicial ? styles["attended"] : styles["not-attended"]
                      }`}
                    />
                    <span className={styles["attendance-text"]}>
                      Reunión inicial
                    </span>
                  </div>
                  <div className={styles["attendance-item"]}>
                    <CheckCircleIcon 
                      className={`${styles["attendance-icon"]} ${
                                                participant.asistio_reunion_cierre ? styles["attended"] : styles["not-attended"]
                      }`}
                    />
                    <span className={styles["attendance-text"]}>
                      Reunión de cierre
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles["card-footer"]}>
                <div className={styles["date-section"]}>
                  <span className={styles["date-info"]}>
                    Agregado el:{" "}
                                        {new Date(participant.fecha_agregado).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <div className={styles["action-buttons"]}>
                  <button
                    onClick={() => handleEditParticipant(participant)}
                    className={styles["edit-button"]}
                    title="Editar participante"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteParticipant(participant.id)}
                    className={styles["delete-button"]}
                    title="Eliminar participante"
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
