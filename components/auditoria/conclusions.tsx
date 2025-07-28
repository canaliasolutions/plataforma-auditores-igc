"use client";

import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";
import SaveIcon from "@mui/icons-material/Save";
import { Auditoria } from "@/types/tipos";
import { OptionButton } from "./option-button";
import styles from "./Conclusions.module.css";

interface Conclusions {
  id?: number;
  auditoria_id: string;
  objetivos_cumplidos: string;
  desviacion_plan: string;
  sistema_cumple_norma: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

interface ConclusionsProps {
  auditId: string;
  auditoria: Auditoria | null;
}

export function Conclusions({ auditId, auditoria }: ConclusionsProps) {
  const [conclusions, setConclusions] = useState<Conclusions>({
    auditoria_id: auditId,
    objetivos_cumplidos: "si",
    desviacion_plan: "",
    sistema_cumple_norma: "si"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load conclusions data from database
  useEffect(() => {
    loadConclusions();
  }, [auditId]);

  const loadConclusions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/conclusiones?auditoriaId=${auditId}`);
      if (response.ok) {
        const data = await response.json();
        setConclusions(data);
      }
    } catch (error) {
      console.error('Error loading conclusions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConclusionChange = (field: keyof Conclusions, value: string) => {
    setConclusions(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/conclusiones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditoriaId: auditId,
          objetivosCumplidos: conclusions.objetivos_cumplidos,
          desviacionPlan: conclusions.desviacion_plan,
          sistemaCumpleNorma: conclusions.sistema_cumple_norma,
        }),
      });

      if (response.ok) {
        const savedData = await response.json();
        setConclusions(savedData);
        setHasChanges(false);
      } else {
        console.error('Error saving conclusions');
      }
    } catch (error) {
      console.error('Error saving conclusions:', error);
    } finally {
      setSaving(false);
    }
  };

  const getOptionIcon = (option: string) => {
    switch (option) {
      case "si":
        return <CheckCircleIcon className={styles["option-icon"]} />;
      case "no":
        return <CancelIcon className={styles["option-icon"]} />;
      case "si_excepto_hallazgos":
        return <WarningIcon className={styles["option-icon"]} />;
      default:
        return <CheckCircleIcon className={styles["option-icon"]} />;
    }
  };

  if (loading) {
    return (
      <div className={styles["conclusions"]}>
        <div className={styles["loading-state"]}>
          <p>Cargando conclusiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["conclusions"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Conclusiones</h2>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`${styles["save-button"]} ${
            !hasChanges ? styles["save-button-disabled"] : ""
          }`}
        >
          <SaveIcon sx={{ fontSize: 16, marginRight: 1 }} />
          {saving ? "Guardando..." : "Guardar conclusiones"}
        </button>
      </div>

      {hasChanges && (
        <div className={styles["changes-notice"]}>
          <p className={styles["changes-text"]}>
            Tienes cambios sin guardar. Haz clic en &#34;Guardar conclusiones&#34; para confirmar.
          </p>
        </div>
      )}

      <div className={styles["conclusions-content"]}>
        {/* First Question: Objectives Compliance */}
        <div className={styles["question-section"]}>
          <h3 className={styles["question-title"]}>
            1. ¿Se ha cumplido con la totalidad de los objetivos de auditoría establecidos 
            en el apartado 2 del presente informe?
          </h3>
          
          <div className={styles["options-grid"]}>
            <OptionButton
              selected={conclusions.objetivos_cumplidos === "si"}
              onClick={() => handleConclusionChange("objetivos_cumplidos", "si")}
              icon={getOptionIcon("si")}
              variant="correct"
            >
              Sí
            </OptionButton>

            <OptionButton
              selected={conclusions.objetivos_cumplidos === "no"}
              onClick={() => handleConclusionChange("objetivos_cumplidos", "no")}
              icon={getOptionIcon("no")}
              variant="error"
            >
              No
            </OptionButton>
          </div>

          {conclusions.objetivos_cumplidos === "no" && (
            <div className={styles["deviation-section"]}>
              <label className={styles["deviation-label"]}>
                Explique cómo y por qué la auditoría se desvió del plan:
              </label>
              <textarea
                value={conclusions.desviacion_plan}
                onChange={(e) => 
                  handleConclusionChange("desviacion_plan", e.target.value)
                }
                placeholder="Describa las razones por las cuales no se cumplieron todos los objetivos de auditoría y cómo se desvió del plan original..."
                className={styles["deviation-textarea"]}
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Second Question: Management System Compliance */}
        <div className={styles["question-section"]}>
          <h3 className={styles["question-title"]}>
            2. ¿El Sistema de gestión cumple con los requisitos de la norma{" "}
            <strong>{auditoria?.norma || "[norma]"}</strong> y con los criterios de
            auditoría (requisitos legales y reglamentarios, requisitos del cliente 
            y de otras partes interesadas, requisitos de la propia organización) y 
            se considera que se encuentra eficazmente implantado?
          </h3>
          
          <div className={styles["options-grid"]}>
            <OptionButton
              selected={conclusions.sistema_cumple_norma === "si"}
              onClick={() => handleConclusionChange("sistema_cumple_norma", "si")}
              icon={getOptionIcon("si")}
              variant="correct"
            >
              Sí
            </OptionButton>

            <OptionButton
              selected={conclusions.sistema_cumple_norma === "si_excepto_hallazgos"}
              onClick={() => handleConclusionChange("sistema_cumple_norma", "si_excepto_hallazgos")}
              icon={getOptionIcon("si_excepto_hallazgos")}
              variant="warning"
            >
              Sí, salvo por los hallazgos
            </OptionButton>

            <OptionButton
              selected={conclusions.sistema_cumple_norma === "no"}
              onClick={() => handleConclusionChange("sistema_cumple_norma", "no")}
              icon={getOptionIcon("no")}
              variant="error"
            >
              No
            </OptionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
