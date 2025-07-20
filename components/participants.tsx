"use client";

import { useState, useEffect } from "react";
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

  // Load participants from database
  useEffect(() => {
    loadParticipants();
  }, [auditId]);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/participantes?auditoriaId=${auditId}`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Participant | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    role: "",
    email: "",
    attendedFirstMeeting: false,
    attendedLastMeeting: false,
  });

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = Date.now().toString();
    const newItem: Participant = {
      id: newId,
      ...newParticipant,
      dateAdded: new Date().toISOString().split("T")[0],
    };

    setParticipants([...participants, newItem]);
    setNewParticipant({
      name: "",
      role: "",
      email: "",
      attendedFirstMeeting: false,
      attendedLastMeeting: false,
    });
    setShowAddForm(false);
  };

  const handleEditParticipant = (item: Participant) => {
    setEditingItem(item);
    setNewParticipant({
      name: item.name,
      role: item.role,
      email: item.email,
      attendedFirstMeeting: item.attendedFirstMeeting,
      attendedLastMeeting: item.attendedLastMeeting,
    });
    setShowEditForm(true);
  };

  const handleUpdateParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedItem: Participant = {
      ...editingItem,
      ...newParticipant,
    };

    setParticipants(
      participants.map((item) =>
        item.id === editingItem.id ? updatedItem : item,
      ),
    );

    setNewParticipant({
      name: "",
      role: "",
      email: "",
      attendedFirstMeeting: false,
      attendedLastMeeting: false,
    });
    setEditingItem(null);
    setShowEditForm(false);
  };

  const handleDeleteParticipant = (id: string) => {
    setDeletingItemId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deletingItemId) {
      setParticipants(
        participants.filter((item) => item.id !== deletingItemId),
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
                  value={newParticipant.name}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                      name: e.target.value,
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
                  value={newParticipant.role}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                      role: e.target.value,
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
                  value={newParticipant.email}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                      email: e.target.value,
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
                      checked={newParticipant.attendedFirstMeeting}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                          attendedFirstMeeting: e.target.checked,
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
                      checked={newParticipant.attendedLastMeeting}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                          attendedLastMeeting: e.target.checked,
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
                    name: "",
                    role: "",
                    email: "",
                    attendedFirstMeeting: false,
                    attendedLastMeeting: false,
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
                  value={newParticipant.name}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                      name: e.target.value,
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
                  value={newParticipant.role}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                      role: e.target.value,
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
                  value={newParticipant.email}
                  onChange={(e) =>
                    setNewParticipant({
                      ...newParticipant,
                      email: e.target.value,
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
                      checked={newParticipant.attendedFirstMeeting}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                          attendedFirstMeeting: e.target.checked,
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
                      checked={newParticipant.attendedLastMeeting}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                          attendedLastMeeting: e.target.checked,
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
                      name: "",
                      role: "",
                      email: "",
                      attendedFirstMeeting: false,
                      attendedLastMeeting: false,
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
              <h3 className={styles["delete-title"]}>Confirmar Eliminación</h3>
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
                  <h3 className={styles["participant-name"]}>{participant.name}</h3>
                  <div className={styles["participant-details"]}>
                    <div className={styles["detail-item"]}>
                      <WorkIcon className={styles["detail-icon"]} />
                      <span className={styles["detail-text"]}>{participant.role}</span>
                    </div>
                    <div className={styles["detail-item"]}>
                      <EmailIcon className={styles["detail-icon"]} />
                      <span className={styles["detail-text"]}>{participant.email}</span>
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
                        participant.attendedFirstMeeting ? styles["attended"] : styles["not-attended"]
                      }`}
                    />
                    <span className={styles["attendance-text"]}>
                      Reunión inicial
                    </span>
                  </div>
                  <div className={styles["attendance-item"]}>
                    <CheckCircleIcon 
                      className={`${styles["attendance-icon"]} ${
                        participant.attendedLastMeeting ? styles["attended"] : styles["not-attended"]
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
                    {new Date(participant.dateAdded).toLocaleDateString("es-ES")}
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
