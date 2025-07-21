"use client";

import { useState, useEffect } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SaveIcon from "@mui/icons-material/Save";
import { Audit } from "@/types/audit";
import styles from "./Eficacia.module.css";

interface EficaciaData {
  id?: number;
  auditoria_id: string;
  tipo_auditoria: string;
  medio_utilizado: string;
  otro_medio: string;
  medio_efectivo: string;
  inconvenientes_presentados: string;
  tipos_inconvenientes: string;
  otros_inconvenientes: string;
  tecnicas_utilizadas: string;
  otras_tecnicas: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

interface EficaciaProps {
  auditId: string;
  audit: Audit | null;
}

export function Eficacia({ auditId, audit }: EficaciaProps) {
  const [eficaciaData, setEficaciaData] = useState<EficaciaData>({
    auditoria_id: auditId,
    tipo_auditoria: audit?.type || 'in_situ',
    medio_utilizado: '',
    otro_medio: '',
    medio_efectivo: '',
    inconvenientes_presentados: '',
    tipos_inconvenientes: '',
    otros_inconvenientes: '',
    tecnicas_utilizadas: '',
    otras_tecnicas: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load eficacia data from database
  useEffect(() => {
    loadEficacia();
  }, [auditId]);

  const loadEficacia = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/eficacia?auditoriaId=${auditId}`);
      if (response.ok) {
        const data = await response.json();
        // Pre-fill audit type from audit data if not already set
        setEficaciaData({
          ...data,
          tipo_auditoria: data.tipo_auditoria || audit?.type || 'in_situ'
        });
      }
    } catch (error) {
      console.error('Error loading eficacia data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (field: keyof EficaciaData, value: string) => {
    setEficaciaData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleMultipleChoice = (field: keyof EficaciaData, option: string, isChecked: boolean) => {
    const currentValues = eficaciaData[field] as string;
    const valuesArray = currentValues ? currentValues.split(',').map(v => v.trim()) : [];
    
    let newValues: string[];
    if (isChecked) {
      newValues = [...valuesArray, option];
    } else {
      newValues = valuesArray.filter(v => v !== option);
    }
    
    handleDataChange(field, newValues.join(', '));
  };

  const isOptionSelected = (field: keyof EficaciaData, option: string): boolean => {
    const currentValues = eficaciaData[field] as string;
    if (!currentValues) return false;
    return currentValues.split(',').map(v => v.trim()).includes(option);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/eficacia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditoriaId: auditId,
          tipoAuditoria: eficaciaData.tipo_auditoria,
          medioUtilizado: eficaciaData.medio_utilizado,
          otroMedio: eficaciaData.otro_medio,
          medioEfectivo: eficaciaData.medio_efectivo,
          inconvenientesPresentados: eficaciaData.inconvenientes_presentados,
          tiposInconvenientes: eficaciaData.tipos_inconvenientes,
          otrosInconvenientes: eficaciaData.otros_inconvenientes,
          tecnicasUtilizadas: eficaciaData.tecnicas_utilizadas,
          otrasTecnicas: eficaciaData.otras_tecnicas,
        }),
      });

      if (response.ok) {
        const savedData = await response.json();
        setEficaciaData(savedData);
        setHasChanges(false);
      } else {
        console.error('Error saving eficacia data');
      }
    } catch (error) {
      console.error('Error saving eficacia data:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles["eficacia"]}>
        <div className={styles["loading-state"]}>
          <p>Cargando datos de eficacia...</p>
        </div>
      </div>
    );
  }

  const isRemoteAudit = eficaciaData.tipo_auditoria === 'a distancia';

  return (
    <div className={styles["eficacia"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Eficacia</h2>
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

      {hasChanges && (
        <div className={styles["changes-notice"]}>
          <p className={styles["changes-text"]}>
            Tienes cambios sin guardar. Haz clic en "Guardar cambios" para confirmar.
          </p>
        </div>
      )}

      <div className={styles["eficacia-content"]}>
        {/* Audit Type Question */}
        <div className={styles["question-section"]}>
          <h3 className={styles["question-title"]}>
            Tipo de auditoría
          </h3>
          <div className={styles["audit-type-display"]}>
            <div className={`${styles["type-indicator"]} ${
              eficaciaData.tipo_auditoria === 'in_situ' ? styles["type-active"] : ''
            }`}>
              {eficaciaData.tipo_auditoria === 'in_situ' ? 
                <RadioButtonCheckedIcon className={styles["radio-icon"]} /> : 
                <RadioButtonUncheckedIcon className={styles["radio-icon"]} />
              }
              <span>In situ</span>
            </div>
            <div className={`${styles["type-indicator"]} ${
              eficaciaData.tipo_auditoria === 'a distancia' ? styles["type-active"] : ''
            }`}>
              {eficaciaData.tipo_auditoria === 'a distancia' ? 
                <RadioButtonCheckedIcon className={styles["radio-icon"]} /> : 
                <RadioButtonUncheckedIcon className={styles["radio-icon"]} />
              }
              <span>A distancia</span>
            </div>
          </div>
          <p className={styles["info-text"]}>
            Tipo de auditoría determinado automáticamente según los datos del proyecto.
          </p>
        </div>

        {/* Remote Audit Questions */}
        {isRemoteAudit && (
          <div className={styles["remote-questions"]}>
            {/* Question 1: Medium Used */}
            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                1. ¿Qué medio se utilizó en la auditoría?
              </h3>
              <div className={styles["radio-options"]}>
                {['Google Meets', 'Zoom', 'Teams', 'Skype', 'Otro'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles["radio-button"]} ${
                      eficaciaData.medio_utilizado === option ? styles["radio-selected"] : ""
                    }`}
                    onClick={() => handleDataChange("medio_utilizado", option)}
                  >
                    {eficaciaData.medio_utilizado === option ? 
                      <RadioButtonCheckedIcon className={styles["radio-icon"]} /> : 
                      <RadioButtonUncheckedIcon className={styles["radio-icon"]} />
                    }
                    <span>{option}</span>
                  </button>
                ))}
              </div>
              {eficaciaData.medio_utilizado === 'Otro' && (
                <div className={styles["other-input-section"]}>
                  <label className={styles["input-label"]}>Especifique cuál:</label>
                  <input
                    type="text"
                    value={eficaciaData.otro_medio}
                    onChange={(e) => handleDataChange("otro_medio", e.target.value)}
                    placeholder="Indique el medio utilizado"
                    className={styles["text-input"]}
                  />
                </div>
              )}
            </div>

            {/* Question 2: Medium Effectiveness */}
            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                2. ¿El medio ha sido efectivo para el logro de los objetivos de la auditoría?
              </h3>
              <div className={styles["radio-options"]}>
                {['si', 'no'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles["radio-button"]} ${
                      eficaciaData.medio_efectivo === option ? styles["radio-selected"] : ""
                    }`}
                    onClick={() => handleDataChange("medio_efectivo", option)}
                  >
                    {eficaciaData.medio_efectivo === option ? 
                      <RadioButtonCheckedIcon className={styles["radio-icon"]} /> : 
                      <RadioButtonUncheckedIcon className={styles["radio-icon"]} />
                    }
                    <span>{option === 'si' ? 'Sí' : 'No'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Issues Presented */}
            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                3. ¿Se han presentado inconvenientes o contratiempos durante la auditoría?
              </h3>
              <div className={styles["radio-options"]}>
                {['si', 'no'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles["radio-button"]} ${
                      eficaciaData.inconvenientes_presentados === option ? styles["radio-selected"] : ""
                    }`}
                    onClick={() => handleDataChange("inconvenientes_presentados", option)}
                  >
                    {eficaciaData.inconvenientes_presentados === option ? 
                      <RadioButtonCheckedIcon className={styles["radio-icon"]} /> : 
                      <RadioButtonUncheckedIcon className={styles["radio-icon"]} />
                    }
                    <span>{option === 'si' ? 'Sí' : 'No'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Types of Issues (conditional) */}
            {eficaciaData.inconvenientes_presentados === 'si' && (
              <div className={styles["question-section"]}>
                <h3 className={styles["question-title"]}>
                  4. ¿En caso tal, cuáles?
                </h3>
                <p className={styles["question-subtitle"]}>Seleccione todas las opciones que apliquen:</p>
                <div className={styles["checkbox-options"]}>
                  {[
                    'interlocutores no disponibles',
                    'información documentada no disponible en formato digital',
                    'cuestiones relacionadas con la confidencialidad de la información',
                    'dificultades para la observación de las actividades técnicas',
                    'otro'
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles["checkbox-button"]} ${
                        isOptionSelected("tipos_inconvenientes", option) ? styles["checkbox-selected"] : ""
                      }`}
                      onClick={() => handleMultipleChoice("tipos_inconvenientes", option, !isOptionSelected("tipos_inconvenientes", option))}
                    >
                      {isOptionSelected("tipos_inconvenientes", option) ? 
                        <CheckBoxIcon className={styles["checkbox-icon"]} /> : 
                        <CheckBoxOutlineBlankIcon className={styles["checkbox-icon"]} />
                      }
                      <span className={styles["option-text"]}>{option}</span>
                    </button>
                  ))}
                </div>
                {isOptionSelected("tipos_inconvenientes", "otro") && (
                  <div className={styles["other-input-section"]}>
                    <label className={styles["input-label"]}>Especifique cuál:</label>
                    <input
                      type="text"
                      value={eficaciaData.otros_inconvenientes}
                      onChange={(e) => handleDataChange("otros_inconvenientes", e.target.value)}
                      placeholder="Indique otros inconvenientes"
                      className={styles["text-input"]}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Question 5: Techniques Used */}
            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                5. Indique las técnicas utilizadas para la recopilación y verificación de las evidencias
              </h3>
              <p className={styles["question-subtitle"]}>Seleccione todas las opciones que apliquen:</p>
              <div className={styles["checkbox-options"]}>
                {[
                  'entrevistas por video conferencia',
                  'recorrido por las instalaciones por video conferencia',
                  'observación de procesos y actividades por video conferencia',
                  'revisión documental',
                  'revisión de registros online y en pantalla',
                  'acceso a plataformas o a repositorios de archivos informáticos',
                  'grabaciones de actividades técnicas',
                  'intercambio de fotografias',
                  'otro'
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles["checkbox-button"]} ${
                      isOptionSelected("tecnicas_utilizadas", option) ? styles["checkbox-selected"] : ""
                    }`}
                    onClick={() => handleMultipleChoice("tecnicas_utilizadas", option, !isOptionSelected("tecnicas_utilizadas", option))}
                  >
                    {isOptionSelected("tecnicas_utilizadas", option) ? 
                      <CheckBoxIcon className={styles["checkbox-icon"]} /> : 
                      <CheckBoxOutlineBlankIcon className={styles["checkbox-icon"]} />
                    }
                    <span className={styles["option-text"]}>{option}</span>
                  </button>
                ))}
              </div>
              {isOptionSelected("tecnicas_utilizadas", "otro") && (
                <div className={styles["other-input-section"]}>
                  <label className={styles["input-label"]}>Especifique cuál:</label>
                  <input
                    type="text"
                    value={eficaciaData.otras_tecnicas}
                    onChange={(e) => handleDataChange("otras_tecnicas", e.target.value)}
                    placeholder="Indique otras técnicas utilizadas"
                    className={styles["text-input"]}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* In-situ message */}
        {!isRemoteAudit && (
          <div className={styles["in-situ-message"]}>
            <p className={styles["message-text"]}>
              Para auditorías realizadas in situ, no se requieren datos adicionales de eficacia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
