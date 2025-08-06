"use client";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import styles from "./Participants.module.css";
import { useParticipants, CreatePayload } from "@/hooks/useParticipants";
import ParticipantsList from "./ParticipantsList";
import ParticipantForm from "./ParticipantForm";

interface Props { auditId: string; }

export default function Participants({ auditId }: Props) {
  const { list, loading, add, update, remove } = useParticipants(auditId);

  const [formOpen, setFormOpen] = useState(false);
  const [editing,   setEditing]  = useState<number | null>(null);
  const [deleteId,  setDeleteId] = useState<number | null>(null);

  const current = editing != null ? list.find(p => p.id === editing) ?? null : null;

  return (
    <div className={styles["participants"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Participantes</h2>
        <button onClick={()=>{ setEditing(null); setFormOpen(true); }} className={styles["add-button"]}>
          <AddIcon sx={{ fontSize:16 }} /> Agregar participante
        </button>
      </div>

      <ParticipantsList
        items={list}
        loading={loading}
        onEdit={p => { setEditing(p.id); setFormOpen(true); }}
        onDelete={id => setDeleteId(id)}
      />

      {/* Formulario alta / edición */}
      <ParticipantForm
        auditId={auditId}
        open={formOpen}
        initial={current}
        onCancel={()=>setFormOpen(false)}
        onSubmit={async (payload) => {
          if (current) {
            await update(current.id, payload as Partial<CreatePayload>);
          } else {
            await add(payload as CreatePayload);
          }
          setFormOpen(false);
        }}
      />

      {/* Diálogo eliminar */}
      {deleteId && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["delete-dialog"]}>
            <div className={styles["delete-header"]}>
              <h3 className={styles["delete-title"]}>Confirmar Eliminación</h3>
            </div>
            <div className={styles["delete-content"]}>
              <p className={styles["delete-message"]}>¿Estás seguro de que deseas eliminar este participante? Esta
                acción no se puede deshacer.</p>
            </div>
            <div className={styles["delete-actions"]}>
              <button onClick={()=>setDeleteId(null)} className={styles["cancel-button"]}>Cancelar</button>
              <button
                onClick={async ()=>{ await remove(deleteId); setDeleteId(null); }}
                className={styles["confirm-delete-button"]}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
