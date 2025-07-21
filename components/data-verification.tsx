"use client";

import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import EditIcon from "@mui/icons-material/Edit";
import NoteIcon from "@mui/icons-material/Note";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./DataVerification.module.css";

interface DataVerification {
  id?: number;
  auditoria_id: string;
  datos_contacto: string;
  datos_alcance: string;
  datos_facturacion: string;
  comentarios_verificacion: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

interface DataVerificationProps {
  auditId: string;
}

type VerificationOption = "correcto" | "error_detectado" | "cliente_solicita_cambio" | "nota_auditor";

export function DataVerification({ auditId }: DataVerificationProps) {
  const [verification, setVerification] = useState<DataVerification>({
    auditoria_id: auditId,
    datos_contacto: "correcto",
    datos_alcance: "correcto", 
    datos_facturacion: "correcto",
    comentarios_verificacion: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load verification data from database
  useEffect(() => {
    loadVerification();
  }, [auditId]);

  const loadVerification = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/verificacion-datos?auditoriaId=${auditId}`);
      if (response.ok) {
        const data = await response.json();
        setVerification(data);
      }
    } catch (error) {
      console.error('Error loading verification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationChange = (field: keyof DataVerification, value: string) => {
    setVerification(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/verificacion-datos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditoriaId: auditId,
          datosContacto: verification.datos_contacto,
          datosAlcance: verification.datos_alcance,
          datosFacturacion: verification.datos_facturacion,
          comentariosVerificacion: verification.comentarios_verificacion,
        }),
      });

      if (response.ok) {
        const savedData = await response.json();
        setVerification(savedData);
        setHasChanges(false);
      } else {
        console.error('Error saving verification data');
      }
    } catch (error) {
      console.error('Error saving verification data:', error);
    } finally {
      setSaving(false);
    }
  };

  const getOptionLabel = (option: VerificationOption) => {
    switch (option) {
      case "correcto":
        return "Correcto";
      case "error_detectado":
        return "Error detectado";
      case "cliente_solicita_cambio":
        return "Cliente solicita cambio";
      case "nota_auditor":
        return "Nota del auditor";
      default:
        return "Correcto";
    }
  };

  const getOptionIcon = (option: VerificationOption) => {
    switch (option) {
      case "correcto":
        return <CheckCircleIcon className={styles["option-icon-correct"]} />;
      case "error_detectado":
        return <ErrorIcon className={styles["option-icon-error"]} />;
      case "cliente_solicita_cambio":
        return <EditIcon className={styles["option-icon-change"]} />;
      case "nota_auditor":
        return <NoteIcon className={styles["option-icon-note"]} />;
      default:
        return <CheckCircleIcon className={styles["option-icon-correct"]} />;
    }
  };

  const getOptionClass = (option: VerificationOption) => {
    switch (option) {
      case "correcto":
        return styles["option-correct"];
      case "error_detectado":
        return styles["option-error"];
      case "cliente_solicita_cambio":
        return styles["option-change"];
      case "nota_auditor":
        return styles["option-note"];
      default:
        return styles["option-correct"];
    }
  };

  const renderVerificationField = (
    label: string,
    field: keyof DataVerification,
    value: string
  ) => {
    const options: VerificationOption[] = [
      "correcto",
      "error_detectado", 
      "cliente_solicita_cambio",
      "nota_auditor"
    ];

    return (
      <div className={styles["verification-field"]}>
        <h3 className={styles["field-label"]}>{label}</h3>
        <div className={styles["options-grid"]}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles["option-button"]} ${getOptionClass(option)} ${
                value === option ? styles["option-selected"] : ""
              }`}
              onClick={() => handleVerificationChange(field, option)}
            >
              {getOptionIcon(option)}
              <span className={styles["option-text"]}>
                {getOptionLabel(option)}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles["data-verification"]}>
        <div className={styles["loading-state"]}>
          <p>Cargando verificación de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["data-verification"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Verificación de datos</h2>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`${styles["save-button"]} ${
            !hasChanges ? styles["save-button-disabled"] : ""
          }`}
        >
          <SaveIcon sx={{ fontSize: 16, marginRight: 1 }} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <div className={styles["verification-form"]}>
        <div className={styles["verification-intro"]}>
          <p className={styles["intro-text"]}>
            Confirma la exactitud de los siguientes datos seleccionando la opción 
            correspondiente para cada categoría:
          </p>
        </div>

        <div className={styles["verification-fields"]}>
          {renderVerificationField(
            "1. Datos del contacto",
            "datos_contacto",
            verification.datos_contacto
          )}

          {renderVerificationField(
            "2. Datos del alcance",
            "datos_alcance", 
            verification.datos_alcance
          )}

          {renderVerificationField(
            "3. Datos de facturación",
            "datos_facturacion",
            verification.datos_facturacion
          )}
        </div>

        <div className={styles["comments-section"]}>
          <h3 className={styles["comments-label"]}>
            Comentarios adicionales sobre la verificación
          </h3>
          <p className={styles["comments-description"]}>
            Proporciona detalles adicionales sobre cualquier error detectado, 
            cambio solicitado o nota importante:
          </p>
          <textarea
            value={verification.comentarios_verificacion}
            onChange={(e) => 
              handleVerificationChange("comentarios_verificacion", e.target.value)
            }
            placeholder="Escribe aquí los detalles de los errores, cambios solicitados o notas adicionales..."
            className={styles["comments-textarea"]}
            rows={6}
          />
        </div>

        {hasChanges && (
          <div className={styles["changes-notice"]}>
            <p className={styles["changes-text"]}>
              Tienes cambios sin guardar. Haz clic en "Guardar cambios" para confirmar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
