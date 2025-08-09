"use client";

import {useState, useEffect, useCallback} from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Hallazgos.module.css";
import {Auditoria, Hallazgo} from "@/schemas/types";
import {apartados} from "@/constants/apartados";
import {DeleteDialog} from "@/components/common/DeleteDialog";

interface HallazgosProps {
    auditoria: Auditoria;
}

const hallazgoVacio: Hallazgo = {
    id_auditoria: '',
    proceso: null,
    descripcion: null,
    norma: null,
    id_clausula: null,
    label_clausula: null,
    tipo: null,
    severidad: null,
    estado_abierto: true,
    fecha_creacion: null,
    fecha_actualizacion: null,
};

export function Hallazgos({auditoria}: HallazgosProps) {
    const [hallazgos, setHallazgos] = useState<Hallazgo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<Hallazgo | null>(null);
    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
    const [nuevoHallazgo, setNuevoHallazgo] = useState(hallazgoVacio);

    const cargarHallazgos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/hallazgos?auditoriaId=${auditoria.id}`);
            if (response.ok) {
                const data = await response.json();
                setHallazgos(data);
            }
        } catch (error) {
            console.error('Error loading hallazgos:', error);
        } finally {
            setLoading(false);
        }
    }, [auditoria.id]);

    useEffect(() => {
        cargarHallazgos().then();
    }, [cargarHallazgos]);

    const crearHallazgo = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            nuevoHallazgo.id_auditoria = auditoria.id;
            nuevoHallazgo.norma = auditoria.norma;
            const response = await fetch('/api/hallazgos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoHallazgo),
            });

            if (response.ok) {
                await cargarHallazgos();
                setNuevoHallazgo(hallazgoVacio);
                setShowAddForm(false);
            } else {
                console.error('Error añadiendo hallazgo');
            }
        } catch (error) {
            console.error('Error añadiendo hallazgo:', error);
        }
    };

    const onEditClick = (item: Hallazgo) => {
        setEditingItem(item);
        setNuevoHallazgo({
            norma: "",
            proceso: item.proceso,
            descripcion: item.descripcion,
            clausula: item.clausula,
            tipo: item.tipo,
            severidad: item.severidad || ""
        });
        setShowEditForm(true);
    };

    const editarHallazgo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const response = await fetch('/api/hallazgos', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingItem.id,
                    proceso: nuevoHallazgo.proceso,
                    descripcion: nuevoHallazgo.descripcion,
                    clausula: nuevoHallazgo.clausula,
                    tipo: nuevoHallazgo.tipo,
                    norma: auditoria.norma,
                    severidad: nuevoHallazgo.tipo === "NC" ? nuevoHallazgo.severidad : null,
                    fechaResuelto: editingItem.fecha_resuelto,
                }),
            });

            if (response.ok) {
                await cargarHallazgos(); // Reload the list
                setNuevoHallazgo(hallazgoVacio);
                setEditingItem(null);
                setShowEditForm(false);
            } else {
                console.error('Error updating hallazgo');
            }
        } catch (error) {
            console.error('Error updating hallazgo:', error);
        }
    };

    const handleDeleteNonConformity = (id: number) => {
        setDeletingItemId(id);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (deletingItemId) {
            try {
                const response = await fetch('/api/hallazgos', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id: deletingItemId}),
                });

                if (response.ok) {
                    await cargarHallazgos(); // Reload the list
                } else {
                    console.error('Error deleting hallazgo');
                }
            } catch (error) {
                console.error('Error deleting hallazgo:', error);
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
                    onClick={() => setShowAddForm(true)}
                    className={styles["add-button"]}
                >
                    <AddIcon sx={{fontSize: 16, marginRight: 1}}/>
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
                                <CloseIcon sx={{fontSize: 20}}/>
                            </button>
                        </div>

                        <form
                            onSubmit={crearHallazgo}
                            className={styles["add-form"]}
                        >
                            <div className={styles["form-group"]}>
                                <label className={styles["form-label"]}>Evidencia:</label>
                                <input
                                    type="text"
                                    value={nuevoHallazgo.proceso}
                                    onChange={(e) =>
                                        setNuevoHallazgo({
                                            ...nuevoHallazgo,
                                            proceso: e.target.value,
                                        })
                                    }
                                    className={styles["form-input"]}
                                />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className={styles["form-label"]}>Descripción:</label>
                                <textarea
                                    value={nuevoHallazgo.descripcion}
                                    onChange={(e) =>
                                        setNuevoHallazgo({
                                            ...nuevoHallazgo,
                                            descripcion: e.target.value,
                                        })
                                    }
                                    className={styles["form-textarea"]}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className={styles["form-row"]}>
                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>Tipo:</label>
                                    <select
                                        value={nuevoHallazgo.tipo}
                                        onChange={(e) =>
                                            setNuevoHallazgo({
                                                ...nuevoHallazgo,
                                                tipo: e.target.value,
                                            })
                                        }
                                        className={styles["form-select"]}
                                        required
                                    >
                                        <option value="OB">Observación</option>
                                        <option value="NC">No conformidad</option>
                                        <option value="OM">Oportunidad de mejora</option>
                                        <option value="PF">Punto fuerte</option>
                                    </select>
                                </div>

                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>Cláusula:</label>
                                    <select
                                        value={nuevoHallazgo.clausula.value}
                                        onChange={(e) =>
                                            setNuevoHallazgo({
                                                ...nuevoHallazgo,
                                                clausula: {
                                                    value: e.target.value,
                                                    label: e.target.options[e.target.selectedIndex].text
                                                },
                                            })
                                        }
                                        className={styles["form-select"]}
                                        disabled={nuevoHallazgo.tipo !== "NC"}
                                        required={nuevoHallazgo.tipo === "NC"}
                                    >
                                        {apartados.map((apartado) => <option key={apartado.id}
                                                                             value={String(apartado.id)}>{apartado.clausula}</option>)}
                                    </select>
                                </div>

                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>Severidad:</label>
                                    <select
                                        value={nuevoHallazgo.severidad}
                                        onChange={(e) =>
                                            setNuevoHallazgo({
                                                ...nuevoHallazgo,
                                                severidad: e.target.value,
                                            })
                                        }
                                        className={styles["form-select"]}
                                        disabled={nuevoHallazgo.tipo !== "NC"}
                                        required={nuevoHallazgo.tipo === "NC"}
                                    >
                                        <option value=""></option>
                                        <option value="menor">Menor</option>
                                        <option value="mayor">Mayor</option>
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
                                    setNuevoHallazgo(hallazgoVacio);
                                }}
                                className={styles["close-button"]}
                            >
                                <CloseIcon sx={{fontSize: 20}}/>
                            </button>
                        </div>

                        <form
                            onSubmit={editarHallazgo}
                            className={styles["add-form"]}
                        >
                            <div className={styles["form-group"]}>
                                <label className={styles["form-label"]}>Evidencia:</label>
                                <input
                                    type="text"
                                    value={nuevoHallazgo.proceso}
                                    onChange={(e) =>
                                        setNuevoHallazgo({
                                            ...nuevoHallazgo,
                                            proceso: e.target.value,
                                        })
                                    }
                                    className={styles["form-input"]}

                                />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className={styles["form-label"]}>Descripción:</label>
                                <textarea
                                    value={nuevoHallazgo.descripcion}
                                    onChange={(e) =>
                                        setNuevoHallazgo({
                                            ...nuevoHallazgo,
                                            descripcion: e.target.value,
                                        })
                                    }
                                    className={styles["form-textarea"]}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className={styles["form-row"]}>
                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>Tipo:</label>
                                    <select
                                        value={nuevoHallazgo.tipo}
                                        onChange={(e) =>
                                            setNuevoHallazgo({
                                                ...nuevoHallazgo,
                                                tipo: e.target.value,
                                            })
                                        }
                                        className={styles["form-select"]}
                                        required
                                    >
                                        <option value="OB">Observación</option>
                                        <option value="NC">No conformidad</option>
                                        <option value="OM">Oportunidad de mejora</option>
                                        <option value="PF">Punto fuerte</option>
                                    </select>
                                </div>

                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>Cláusula:</label>
                                    <select
                                        value={nuevoHallazgo.clausula.value}
                                        onChange={(e) =>
                                            setNuevoHallazgo({
                                                ...nuevoHallazgo,
                                                clausula: {
                                                    value: e.target.value,
                                                    label: e.target.options[e.target.selectedIndex].text
                                                },
                                            })
                                        }
                                        className={styles["form-select"]}
                                        disabled={nuevoHallazgo.tipo !== "NC"}
                                        required={nuevoHallazgo.tipo === "NC"}
                                    >
                                        {apartados.map((apartado) => <option
                                            key={apartado.id} value={String(apartado.id)}>{apartado.clausula}</option>)}
                                    </select>
                                </div>

                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>Severidad:</label>
                                    <select
                                        value={nuevoHallazgo.severidad}
                                        onChange={(e) =>
                                            setNuevoHallazgo({
                                                ...nuevoHallazgo,
                                                severidad: e.target.value,
                                            })
                                        }
                                        className={styles["form-select"]}
                                        disabled={nuevoHallazgo.tipo !== "NC"}
                                        required={nuevoHallazgo.tipo === "NC"}
                                    >
                                        <option value=""></option>
                                        <option value="menor">Menor</option>
                                        <option value="mayor">Mayor</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles["form-actions"]}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setEditingItem(null);
                                        setNuevoHallazgo(hallazgoVacio);
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

            {showDeleteDialog && (<DeleteDialog></DeleteDialog>)}

            <div className={styles["conformities-list"]}>
                {hallazgos.length === 0 ? (
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
                    hallazgos.map((item) => (
                        <div key={item.id} className={styles["conformity-card"]}>
                            <div className={styles["card-header"]}>
                                <div className={styles["title-section"]}>
                                    <h3 className={styles["conformity-title"]}>{item.proceso}</h3>
                                    {(item.clausula.label !== "") ?
                                        (<span className={styles["clause-badge"]}>
                                        Cláusula {item.clausula.label}
                                    </span>) : null}
                                </div>
                                <div className={styles["badges"]}>
                  <span className={styles["status-badge"]}>
                    {getTypeText(item.tipo)}
                  </span>
                                    {item.tipo === "NC" && item.severidad && (
                                        <span
                                            className={styles["severity-badge"]}
                                            style={{backgroundColor: getSeverityColor(item.severidad)}}
                                        >
                      {getSeverityText(item.severidad)}
                    </span>
                                    )}
                                </div>
                            </div>

                            <p className={styles["conformity-description"]}>
                                {item.descripcion}
                            </p>

                            <div className={styles["card-footer"]}>
                                <div className={styles["date-section"]}>
                  <span className={styles["date-info"]}>
                    Encontrada el:{" "}
                      {new Date(item.fecha_encontrado).toLocaleDateString("es-ES")}
                  </span>
                                    {item.fecha_resuelto && (
                                        <span className={styles["date-info"]}>
                      Resuelta el:{" "}
                                            {new Date(item.fecha_resuelto).toLocaleDateString("es-ES")}
                    </span>
                                    )}
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
