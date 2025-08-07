"use client";

import { useState, useEffect } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SaveIcon from "@mui/icons-material/Save";
import { Auditoria } from "@/types/tipos";
import { OptionButton } from "./option-button";
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
  tecnicas_insitu_utilizadas: string;
  otras_tecnicas: string;
  otras_tecnicas_insitu: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

interface EficaciaProps {
  auditId: string;
  auditoria: Auditoria | null;
}

export function Eficacia({ auditId, auditoria }: EficaciaProps) {
  const [eficaciaData, setEficaciaData] = useState<EficaciaData>({
    auditoria_id: auditId,
    tipo_auditoria: auditoria?.tipo || 'in_situ',
    medio_utilizado: '',
    otro_medio: '',
    medio_efectivo: '',
    inconvenientes_presentados: '',
    tipos_inconvenientes: '',
    otros_inconvenientes: '',
    tecnicas_utilizadas: '',
    tecnicas_insitu_utilizadas: '',
    otras_tecnicas: '',
    otras_tecnicas_insitu: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load eficacia data from database
  useEffect(() => {
    const loadEficacia = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/eficacia?auditoriaId=${auditId}`);
        if (response.ok) {
          const data = await response.json();
          // Pre-fill audit type from audit data if not already set
          setEficaciaData({
            ...data,
            tipo_auditoria: data.tipo_auditoria || 'in_situ'
          });
        }
      } catch (error) {
        console.error('Error loading eficacia data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEficacia();
  }, [auditId]);

  const handleDataChange = (field: keyof EficaciaData, value: string) => {
    setEficaciaData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleMultipleChoice = (field: keyof EficaciaData, option: string, isChecked: boolean) => {
    const currentValues = eficaciaData[field] as string;
    const valuesArray = currentValues ? currentValues.split(' \\r').map(v => v.trim()) : [];
    
    let newValues: string[];
    if (isChecked) {
      newValues = [...valuesArray, option];
    } else {
      newValues = valuesArray.filter(v => v !== option);
    }
    
    handleDataChange(field, newValues.join(' \\r'));
  };

  const isOptionSelected = (field: keyof EficaciaData, option: string): boolean => {
    const currentValues = eficaciaData[field] as string;
    if (!currentValues) return false;
    return currentValues.split(' \\r').map(v => v.trim()).includes(option);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const eficaciaBody = eficaciaData;
      eficaciaBody.auditoria_id = auditId;
      const response = await fetch('/api/eficacia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({eficacia: eficaciaBody}),
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
  const isInSituAudit = eficaciaData.tipo_auditoria === 'in_situ';

  return (
    <div className={styles["eficacia"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Eficacia del método de auditoría</h2>
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
            Tienes cambios sin guardar. Haz clic en &#34;Guardar cambios&#34; para confirmar.
          </p>
        </div>
      )}

      <div className={styles["eficacia-content"]}>
        {/* Audit Type Question - Now Selectable */}
        <div className={styles["question-section"]}>
          <h3 className={styles["question-title"]}>
            Tipo de auditoría
          </h3>
          <div className={styles["options-grid"]}>
            <OptionButton
              selected={eficaciaData.tipo_auditoria === 'in_situ'}
              onClick={() => handleDataChange("tipo_auditoria", "in_situ")}
              icon={eficaciaData.tipo_auditoria === 'in_situ' ?
                <RadioButtonCheckedIcon /> :
                <RadioButtonUncheckedIcon />
              }
            >
              In situ
            </OptionButton>
            <OptionButton
              selected={eficaciaData.tipo_auditoria === 'a distancia'}
              onClick={() => handleDataChange("tipo_auditoria", "a distancia")}
              icon={eficaciaData.tipo_auditoria === 'a distancia' ?
                <RadioButtonCheckedIcon /> :
                <RadioButtonUncheckedIcon />
              }
            >
              A distancia
            </OptionButton>
          </div>
        </div>

        {isInSituAudit && (
          <div className={styles["in-situ-questions"]}>
            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                Indique las técnicas utilizadas para la recopilación y verificación de las evidencias
              </h3>
              <p className={styles["question-subtitle"]}>Seleccione todas las opciones que apliquen:</p>
              <div className={styles["checkbox-options"]}>
                {[
                  'Entrevistas con responsables, trabajadores, personal',
                  'Revisión de registros',
                  'Recorrido por las instalaciones',
                  'Observación en sitio de procesos y actividades',
                  'Observación en sitio de actividades técnicas',
                  'Otro'
                ].map((option, index) => (
                  <button
                    key={index}
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
              {isOptionSelected("tecnicas_utilizadas", "Otro") && (
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

        {isRemoteAudit && (
          <div className={styles["remote-questions"]}>
            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                ¿Qué medio se utilizó en la auditoría?
              </h3>
              <div className={styles["options-grid"]}>
                {['Google Meets', 'Zoom', 'Teams', 'Correo electrónico', 'Otro medio'].map((option) => (
                  <OptionButton
                    key={option}
                    selected={eficaciaData.medio_utilizado === option}
                    onClick={() => handleDataChange("medio_utilizado", option)}
                    icon={eficaciaData.medio_utilizado === option ?
                      <RadioButtonCheckedIcon /> :
                      <RadioButtonUncheckedIcon />
                    }
                  >
                    {option}
                  </OptionButton>
                ))}
              </div>
              {eficaciaData.medio_utilizado === 'Otro medio' && (
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

            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                ¿El medio ha sido efectivo para el logro de los objetivos de la auditoría?
              </h3>
              <div className={styles["options-grid"]}>
                {['si', 'no'].map((option) => (
                  <OptionButton
                    key={option}
                    selected={eficaciaData.medio_efectivo === option}
                    onClick={() => handleDataChange("medio_efectivo", option)}
                    icon={eficaciaData.medio_efectivo === option ?
                      <RadioButtonCheckedIcon /> :
                      <RadioButtonUncheckedIcon />
                    }
                    variant={option === 'si' ? 'correct' : 'error'}
                  >
                    {option === 'si' ? 'Sí' : 'No'}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                ¿Se han presentado inconvenientes o contratiempos durante la auditoría?
              </h3>
              <div className={styles["options-grid"]}>
                {['si', 'no'].map((option) => (
                  <OptionButton
                    key={option}
                    selected={eficaciaData.inconvenientes_presentados === option}
                    onClick={() => handleDataChange("inconvenientes_presentados", option)}
                    icon={eficaciaData.inconvenientes_presentados === option ?
                      <RadioButtonCheckedIcon /> :
                      <RadioButtonUncheckedIcon />
                    }
                    variant={option === 'si' ? 'warning' : 'correct'}
                  >
                    {option === 'si' ? 'Sí' : 'No'}
                  </OptionButton>
                ))}
              </div>
            </div>

            {/* Question 4: Types of Issues (conditional) */}
            {eficaciaData.inconvenientes_presentados === 'si' && (
              <div className={styles["question-section"]}>
                <h3 className={styles["question-title"]}>
                  ¿En caso tal, cuáles?
                </h3>
                <p className={styles["question-subtitle"]}>Seleccione todas las opciones que apliquen:</p>
                <div className={styles["checkbox-options"]}>
                  {[
                    'Interlocutores no disponibles',
                    'Información documentada no disponible en formato digital',
                    'Cuestiones relacionadas con la confidencialidad de la información',
                    'Dificultades para la observación de las actividades técnicas',
                    'Otro inconveniente'
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
                {isOptionSelected("tipos_inconvenientes", "Otro inconveniente") && (
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

            <div className={styles["question-section"]}>
              <h3 className={styles["question-title"]}>
                Indique las técnicas utilizadas para la recopilación y verificación de las evidencias
              </h3>
              <p className={styles["question-subtitle"]}>Seleccione todas las opciones que apliquen:</p>
              <div className={styles["checkbox-options"]}>
                {[
                  'Entrevistas por video conferencia',
                  'Recorrido por las instalaciones por video conferencia',
                  'Observación de procesos y actividades por video conferencia',
                  'Revisión documental',
                  'Revisión de registros online y en pantalla',
                  'Acceso a plataformas o a repositorios de archivos informáticos',
                  'Grabaciones de actividades técnicas',
                  'Intercambio de fotografias',
                  'Otra técnica'
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
              {isOptionSelected("tecnicas_insitu_utilizadas", "Otra técnica") && (
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
      </div>
    </div>
  );
}
