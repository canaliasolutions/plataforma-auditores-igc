"use client";
import { useState, useEffect, useCallback } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import styles from "./Hallazgos.module.css";
import { Auditoria, Hallazgo } from "@/types/tipos";
import HallazgoModal from "./HallazgoModal";
import DeleteDialog from "./DeleteDialog";
import HallazgoItem from "./HallazgoItem";

interface Props {
  auditoria: Auditoria;
}

export default function Hallazgos({ auditoria }: Props) {
  const [hallazgos, setHallazgos] = useState<Hallazgo[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------- carga inicial -------- */
  const cargarHallazgos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/hallazgos?auditoriaId=${auditoria.id}`);
      if (res.ok) setHallazgos(await res.json());
    } catch (err) {
      console.error("Error loading hallazgos:", err);
    } finally {
      setLoading(false);
    }
  }, [auditoria.id]);

  useEffect(() => {
    cargarHallazgos();
  }, [cargarHallazgos]);

  /* -------- UI state -------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Hallazgo | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* -------- handlers -------- */
  const handleAddClick = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: Hallazgo) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    try {
      const res = await fetch("/api/hallazgos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });
      if (res.ok) await cargarHallazgos();
      else console.error("Error deleting hallazgo");
    } catch (err) {
      console.error("Error deleting hallazgo:", err);
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  /* -------- render -------- */
  return (
    <div className={styles["non-conformities"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Hallazgos</h2>
        <button onClick={handleAddClick} className={styles["add-button"]}>
          <AddIcon sx={{ fontSize: 16, marginRight: 1 }} />
          Agregar hallazgo
        </button>
      </div>

      {loading ? (
        <p>Cargando hallazgos…</p>
      ) : hallazgos.length === 0 ? (
        <div className={styles["empty-state"]}>
          <CheckCircleIcon className={styles["empty-icon"]} sx={{ fontSize: 64 }} />
          <h3 className={styles["empty-title"]}>No hay hallazgos</h3>
          <p className={styles["empty-description"]}>
            No se han registrado hallazgos para esta auditoría
          </p>
        </div>
      ) : (
        <div className={styles["conformities-list"]}>
          {hallazgos.map((h) => (
            <HallazgoItem key={h.id} item={h} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* --- modales --- */}
      <HallazgoModal
        open={modalOpen}
        auditoria={auditoria}
        initialItem={editingItem}
        onClose={() => setModalOpen(false)}
        onSaved={cargarHallazgos}
      />
      <DeleteDialog
        open={deleteOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
