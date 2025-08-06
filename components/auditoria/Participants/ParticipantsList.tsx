import PersonIcon from "@mui/icons-material/Person";
import styles from "./Participants.module.css";
import ParticipantCard from "./ParticipantCard";
import { Participant } from "@/hooks/useParticipants";

interface Props {
    items: Participant[];
    loading: boolean;
    onEdit: (p: Participant) => void;
    onDelete: (id: number) => void;
}

export default function ParticipantsList({ items, loading, onEdit, onDelete }: Props) {
    if (loading) return <p className={styles["loading-state"]}>Cargando participantes…</p>;

    if (items.length === 0)
        return (
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
        );

    return (
        <div className={styles["participants-list"]}>
            {items.map(p => (
                <ParticipantCard key={p.id} item={p} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}
