"use client";

import {useState, useEffect, useCallback} from "react";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./Participantes.module.css";
import {Auditoria, Participante} from "@/schemas/types";
import { FormModal } from "@/components/common/FormModal";
import { ParticipantesModal } from "./ParticipantesModal";
import { DeleteDialog } from "@/components/common/DeleteDialog";


interface ParticipantsProps {
  auditoria: Auditoria;
}

const participanteVacio: Participante = {
  id_auditoria: '',
  nombre_completo: '',
  cargo: '',
  departamento: '',
  asistio_reunion_inicial: false,
  asistio_reunion_cierre: false,
  fecha_creacion: null,
  fecha_actualizacion: null,
}

export function Participantes({ auditoria }: ParticipantsProps) {
  const [participants, setParticipants] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);

  const loadParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/participantes?auditoriaId=${auditoria.id}`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  }, [auditoria.id]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Participante | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [newParticipant, setNewParticipant] = useState<Participante>(participanteVacio);

  const handleParticipantChange = (changes: Partial<Participante>) => {
    setNewParticipant(prev => ({
      ...prev,
      ...changes
    }));
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const participanteData = {
        ...newParticipant,
        id_auditoria: auditoria.id,
      };
      const response = await fetch('/api/participantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participanteData),
      });
      if (response.ok) {
        await loadParticipants();
        setNewParticipant(participanteVacio);
        setShowAddForm(false);
      } else {
        console.error('Error adding participant');
      }
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  const handleEditParticipant = (item: Participante) => {
    setEditingItem(item);
    setNewParticipant({
      ...participanteVacio,
      ...item
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
          cargoRol: newParticipant.cargo,
          correoElectronico: newParticipant.departamento,
          asistioReunionInicial: newParticipant.asistio_reunion_inicial,
          asistioReunionCierre: newParticipant.asistio_reunion_cierre,
        }),
      });

      if (response.ok) {
        await loadParticipants();
        setNewParticipant(participanteVacio);
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
          await loadParticipants();
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

      <FormModal
        isOpen={showAddForm}
        title="Nuevo participante"
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddParticipant}
        submitButtonText="Agregar participante"
      >
        <ParticipantesModal
          participante={newParticipant}
          onParticipanteChange={handleParticipantChange}
        />
      </FormModal>

      <FormModal
        isOpen={showEditForm}
        title="Editar participante"
        onClose={() => {
          setShowEditForm(false);
          setEditingItem(null);
          setNewParticipant(participanteVacio);
        }}
        onSubmit={handleUpdateParticipant}
        submitButtonText="Actualizar participante"
      >
        <ParticipantesModal
          participante={newParticipant}
          onParticipanteChange={handleParticipantChange}
        />
      </FormModal>

      {showDeleteDialog && (
        <DeleteDialog
          onDelete={confirmDelete}
          onCancel={cancelDelete}
        />
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
          participants.map((participante) => (
            <div key={participante.id} className={styles["participant-card"]}>
              <div className={styles["card-header"]}>
                <div className={styles["participant-info"]}>
                  <h3 className={styles["participant-name"]}>{participante.nombre_completo}</h3>
                  <div className={styles["participant-details"]}>
                    <div className={styles["detail-item"]}>
                      <WorkIcon className={styles["detail-icon"]} />
                      <span className={styles["detail-text"]}>{participante.cargo}</span>
                    </div>
                    <div className={styles["detail-item"]}>
                      <EmailIcon className={styles["detail-icon"]} />
                      <span className={styles["detail-text"]}>{participante.departamento}</span>
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
                        participante.asistio_reunion_inicial ? styles["attended"] : styles["not-attended"]
                      }`}
                    />
                    <span className={styles["attendance-text"]}>
                      Reunión inicial
                    </span>
                  </div>
                  <div className={styles["attendance-item"]}>
                    <CheckCircleIcon 
                      className={`${styles["attendance-icon"]} ${
                        participante.asistio_reunion_cierre ? styles["attended"] : styles["not-attended"]
                      }`}
                    />
                    <span className={styles["attendance-text"]}>
                      Reunión de cierre
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles["card-footer"]}>
                <div className={styles["action-buttons"]}>
                  <button
                    onClick={() => handleEditParticipant(participante)}
                    className={styles["edit-button"]}
                    title="Editar participante"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteParticipant(participante.id || 0)}
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
