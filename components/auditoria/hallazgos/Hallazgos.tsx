"use client";

import {useState, useEffect, useCallback} from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import styles from "./Hallazgos.module.css";
import {Auditoria, Hallazgo} from "@/schemas/types";
import {DeleteDialog} from "@/components/common/DeleteDialog";
import {getSeverityColor} from "@/components/auditoria/hallazgos/HallazgosHelper";
import { HallazgoModal } from "./HallazgoModal";

interface HallazgosProps {
    auditoria: Auditoria;
}

const hallazgoVacio: Hallazgo = {
    id: undefined,
    id_auditoria: '',
    proceso: '',
    descripcion: null,
    norma: '',
    id_clausula: null,
    label_clausula: null,
    tipo: '',
    severidad: null,
    estado_abierto: true,
    fecha_creacion: null,
    fecha_actualizacion: null,
};

export function Hallazgos({auditoria}: HallazgosProps) {
    const [uiState, setUiState] = useState({
        hallazgos: [] as Hallazgo[],
        loading: true,
        showAddForm: false,
        showEditForm: false,
        showDeleteDialog: false,
        editingItem: null as Hallazgo | null,
        deletingItemId: null as number | null,
        nuevoHallazgo: hallazgoVacio,
    });

    const handleHallazgoChange = (changes: Partial<Hallazgo>) => {
        setUiState(prev => ({
            ...prev,
            nuevoHallazgo: {
                ...prev.nuevoHallazgo,
                ...changes
            }
        }));
    };

    const cargarHallazgos = useCallback(async () => {
        try {
            setUiState(prev => ({ ...prev, loading: true }));
            const response = await fetch(`/api/hallazgos?auditoriaId=${auditoria.id}`);
            if (response.ok) {
                const data = await response.json();
                setUiState(prev => ({ ...prev, hallazgos: data, loading: false }));
            }
        } catch (error) {
            console.error('Error loading hallazgos:', error);
            setUiState(prev => ({ ...prev, loading: false }));
        }
    }, [auditoria.id]);

    useEffect(() => {
        cargarHallazgos().then();

    }, [cargarHallazgos]);

    const crearHallazgo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const hallazgoData = {
                ...uiState.nuevoHallazgo,
                id_auditoria: auditoria.id,
                norma: auditoria.norma,
            };
            const response = await fetch('/api/hallazgos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(hallazgoData),
            });

            if (response.ok) {
                await cargarHallazgos();
                setUiState(prev => ({
                    ...prev,
                    nuevoHallazgo: hallazgoVacio,
                    showAddForm: false
                }));
            } else {
                console.error('Error añadiendo hallazgo');
            }
        } catch (error) {
            console.error('Error añadiendo hallazgo:', error);
        }
    };

    const onEditClick = (item: Hallazgo) => {
        setUiState(prev => ({
            ...prev,
            editingItem: item,
            nuevoHallazgo: {
                ...hallazgoVacio,
                ...item
            },
            showEditForm: true
        }));
    };

    const editarHallazgo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uiState.editingItem) return;

        try {
            uiState.nuevoHallazgo.id = uiState.editingItem.id;
            const response = await fetch('/api/hallazgos', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uiState.nuevoHallazgo),
            });

            if (response.ok) {
                await cargarHallazgos();
                setUiState(prev => ({
                    ...prev,
                    nuevoHallazgo: hallazgoVacio,
                    editingItem: null,
                    showEditForm: false
                }));
            } else {
                console.error('Error updating hallazgo');
            }
        } catch (error) {
            console.error('Error updating hallazgo:', error);
        }
    };

    const handleDeleteNonConformity = (id: number) => {
        setUiState(prev => ({
            ...prev,
            deletingItemId: id,
            showDeleteDialog: true
        }));
    };

    const confirmDelete = async () => {
        if (uiState.deletingItemId) {
            try {
                const response = await fetch('/api/hallazgos', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: uiState.deletingItemId}),
                });

                if (response.ok) {
                    await cargarHallazgos();
                } else {
                    console.error('Error deleting hallazgo');
                }
            } catch (error) {
                console.error('Error deleting hallazgo:', error);
            }
        }
        setUiState(prev => ({
            ...prev,
            deletingItemId: null,
            showDeleteDialog: false
        }));
    };

    const cancelDelete = () => {
        setUiState(prev => ({
            ...prev,
            deletingItemId: null,
            showDeleteDialog: false
        }));
    };

    if (uiState.loading) {
        return (
            <div className={styles["hallazgos"]}>
                <div className={styles["loading-state"]}>
                    <p>Cargando hallazgos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles["hallazgos"]}>
            <div className={styles["section-header"]}>
                <h2 className={styles["section-title"]}>Hallazgos</h2>
                <button
                    onClick={() => setUiState(prev => ({ ...prev, showAddForm: true }))}
                    className={styles["add-button"]}
                >
                    <AddIcon sx={{fontSize: 16, marginRight: 1}}/>
                    Agregar hallazgo
                </button>
            </div>

            <HallazgoModal
                isOpen={uiState.showAddForm}
                title="Nuevo hallazgo"
                hallazgo={uiState.nuevoHallazgo}
                submitButtonText="Agregar hallazgo"
                onClose={() => setUiState(prev => ({ ...prev, showAddForm: false }))}
                onSubmit={crearHallazgo}
                onHallazgoChange={handleHallazgoChange}
            />

            <HallazgoModal
                isOpen={uiState.showEditForm}
                title="Editar hallazgo"
                hallazgo={uiState.nuevoHallazgo}
                submitButtonText="Actualizar hallazgo"
                onClose={() => setUiState(prev => ({
                    ...prev,
                    showEditForm: false,
                    editingItem: null,
                    nuevoHallazgo: hallazgoVacio
                }))}
                onSubmit={editarHallazgo}
                onHallazgoChange={handleHallazgoChange}
            />

            {uiState.showDeleteDialog && (
                <DeleteDialog
                    onDelete={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            <div className={styles["conformities-list"]}>
                {(uiState.hallazgos.length === 0) || (!Array.isArray(uiState.hallazgos)) ? (
                    <div className={styles["empty-state"]}>
                        <CheckCircleIcon
                            className={styles["empty-icon"]}
                            sx={{fontSize: 64}}
                        />
                        <h3 className={styles["empty-title"]}>No hay hallazgos</h3>
                        <p className={styles["empty-description"]}>
                            No se han registrado hallazgos para esta auditoría
                        </p>
                    </div>
                ) : (
                    uiState.hallazgos.map((item) => (
                        <div key={item.id} className={styles["conformity-card"]}>
                            <div className={styles["card-header"]}>
                                <div className={styles["title-section"]}>
                                    <h3 className={styles["conformity-title"]}>{item.proceso}</h3>
                                </div>
                                <div className={styles["badges"]}>
                                    <span className={styles["status-badge"]}>
                                        {item.tipo}
                                    </span>
                                    {(item.label_clausula!) ?
                                        (<span className={styles["status-badge"]}>
                                            Requisito {item.label_clausula}
                                        </span>) : null}
                                    {item.tipo === "No conformidad" && item.severidad && (
                                        <span
                                            className={styles["severity-badge"]}
                                            style={{backgroundColor: getSeverityColor(item.severidad)}}
                                        >
                                            {item.severidad}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className={styles["conformity-description"]}>
                                {item.descripcion}
                            </p>

                            <div className={styles["card-footer"]}>
                                <div className={styles["date-section"]}>
                                </div>
                                <div className={styles["action-buttons"]}>
                                    <button
                                        onClick={() => onEditClick(item)}
                                        className={styles["edit-button"]}
                                        title="Editar hallazgo"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNonConformity(item.id || 0)}
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
