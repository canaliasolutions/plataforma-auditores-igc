"use client";

import {useState, useEffect} from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Hallazgos.module.css";
import {Auditoria, Hallazgo} from "@/types/tipos";
import {apartados} from "@/constants/apartados";

interface HallazgosProps {
    auditoria: Auditoria;
}

const hallazgoVacio = {
    evidencia: "",
    descripcion: "",
    clausula: {value: "", label: ""},
    tipo: "OB",
    severidad: "",
    norma: "",
}

export function Hallazgos({auditoria}: HallazgosProps) {
    const [hallazgos, setHallazgos] = useState<Hallazgo[]>([]);
    const [loading, setLoading] = useState(true);

    // Load hallazgos from database
    useEffect(() => {
        cargarHallazgos();
    }, [auditoria.id]);

    const cargarHallazgos = async () => {
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
    };

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<Hallazgo | null>(null);
    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
    const [newNonConformity, setNewNonConformity] = useState(hallazgoVacio);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "mayor":
                return "#f39c12";
            case "menor":
                return "#f1c40f";
            default:
                return "#95a5a6";
        }
    };

    const getSeverityText = (severity: string) => {
        switch (severity) {
            case "mayor":
                return "Mayor";
            case "menor":
                return "Menor";
            default:
                return "Desconocida";
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case "OB":
                return "Observación";
            case "NC":
                return "No conformidad";
            case "OM":
                return "Oportunidad de mejora";
            case "PF":
                return "Punto fuerte";
            default:
                return "Desconocido";
        }
    };

    const handleAddNonConformity = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/hallazgos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    auditoriaId: auditoria.id,
                    evidencia: newNonConformity.evidencia,
                    descripcion: newNonConformity.descripcion,
                    clausula: newNonConformity.clausula,
                    tipo: newNonConformity.tipo,
                    norma: auditoria.norma,
                    severidad: newNonConformity.tipo === "NC" ? newNonConformity.severidad : null,
                    fechaEncontrado: new Date().toISOString().split("T")[0],
                }),
            });

            if (response.ok) {
                await cargarHallazgos(); // Reload the list
                setNewNonConformity(hallazgoVacio);
                setShowAddForm(false);
            } else {
                console.error('Error adding hallazgo');
            }
        } catch (error) {
            console.error('Error adding hallazgo:', error);
        }
    };

    const handleEditNonConformity = (item: Hallazgo) => {
        console.log("editing hallazgo", item);
        setEditingItem(item);
        setNewNonConformity({
            norma: "",
            evidencia: item.evidencia,
            descripcion: item.descripcion,
            clausula: item.clausula,
            tipo: item.tipo,
            severidad: item.severidad || ""
        });
        setShowEditForm(true);
    };

    const handleUpdateNonConformity = async (e: React.FormEvent) => {
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
                    evidencia: newNonConformity.evidencia,
                    descripcion: newNonConformity.descripcion,
                    clausula: newNonConformity.clausula,
                    tipo: newNonConformity.tipo,
                    norma: auditoria.norma,
                    severidad: newNonConformity.tipo === "NC" ? newNonConformity.severidad : null,
                    fechaResuelto: editingItem.fecha_resuelto,
                }),
            });

            if (response.ok) {
                await cargarHallazgos(); // Reload the list
                setNewNonConformity(hallazgoVacio);
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

    return (
        <div className={styles["non-conformities"]}>
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
                            onSubmit={handleAddNonConformity}
                            className={styles["add-form"]}
                        >
                            <div className={styles["form-group"]}>
                                <label className={styles["form-label"]}>Evidencia:</label>
                                <input
                                    type="text"
                                    value={newNonConformity.evidencia}
                                    onChange={(e) =>
                                        setNewNonConformity({
                                            ...newNonConformity,
                                            evidencia: e.target.value,
                                        })
                                    }
                                    className={styles["form-input"]}
                                />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className={styles["form-label"]}>Descripción:</label>
                                <textarea
                                    value={newNonConformity.descripcion}
                                    onChange={(e) =>
                                        setNewNonConformity({
                                            ...newNonConformity,
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
                                        value={newNonConformity.tipo}
                                        onChange={(e) =>
                                            setNewNonConformity({
                                                ...newNonConformity,
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
                                        value={newNonConformity.clausula.value}
                                        onChange={(e) =>
                                            setNewNonConformity({
                                                ...newNonConformity,
                                                clausula: {
                                                    value: e.target.value,
                                                    label: e.target.options[e.target.selectedIndex].text
                                                },
                                            })
                                        }
                                        className={styles["form-select"]}
                                        disabled={newNonConformity.tipo !== "NC"}
                                        required={newNonConformity.tipo === "NC"}
                                    >
                                        {apartados.map((apartado) => <option key={apartado.id}
                                                                             value={String(apartado.id)}>{apartado.clausula}</option>)}
                                    </select>
                                </div>

                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>Severidad:</label>
                                    <select
                                        value={newNonConformity.severidad}
                                        onChange={(e) =>
                                            setNewNonConformity({
                                                ...newNonConformity,
                                                severidad: e.target.value,
                                            })
                                        }
                                        className={styles["form-select"]}
                                        disabled={newNonConformity.tipo !== "NC"}
                                        required={newNonConformity.tipo === "NC"}
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
                                    setNewNonConformity(hallazgoVacio);
                                }}
                                className={styles["close-button"]}
                            >
                                <CloseIcon sx={{fontSize: 20}}/>
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateNonConformity}
                            className={styles["add-form"]}
                        >
                            <div className={styles["form-group"]}>
                                <label className={styles["form-label"]}>Evidencia:</label>
                                <input
                                    type="text"
                                    value={newNonConformity.evidencia}
                                    onChange={(e) =>
                                        setNewNonConformity({
                                            ...newNonConformity,
                                            evidencia: e.target.value,
                                        })
                                    }
                                    className={styles["form-input"]}

                                />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className={styles["form-label"]}>Descripción:</label>
                                <textarea
                                    value={newNonConformity.descripcion}
                                    onChange={(e) =>
                                        setNewNonConformity({
                                            ...newNonConformity,
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
                                        value={newNonConformity.tipo}
                                        onChange={(e) =>
                                            setNewNonConformity({
                                                ...newNonConformity,
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
                                        value={newNonConformity.clausula.value}
                                        onChange={(e) =>
                                            setNewNonConformity({
                                                ...newNonConformity,
                                                clausula: {
                                                    value: e.target.value,
                                                    label: e.target.options[e.target.selectedIndex].text
                                                },
                                            })
                                        }
                                        className={styles["form-select"]}
                                        disabled={newNonConformity.tipo !== "NC"}
                                        required={newNonConformity.tipo === "NC"}
                                    >
                                        {apartados.map((apartado) => <option
                                            key={apartado.id} value={String(apartado.id)}>{apartado.clausula}</option>)}
                                    </select>
                                </div>

                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>Severidad:</label>
                                    <select
                                        value={newNonConformity.severidad}
                                        onChange={(e) =>
                                            setNewNonConformity({
                                                ...newNonConformity,
                                                severidad: e.target.value,
                                            })
                                        }
                                        className={styles["form-select"]}
                                        disabled={newNonConformity.tipo !== "NC"}
                                        required={newNonConformity.tipo === "NC"}
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
                                        setNewNonConformity(hallazgoVacio);
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
                                    <h3 className={styles["conformity-title"]}>{item.evidencia}</h3>
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
