"use client";

import { useState, useEffect } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "@/components/auditoria/Conclusiones.module.css";
import { BotonRadio } from "@/components/common/BotonRadio";
import { Conclusion } from "@/schemas/types";

interface ConclusionesAuditoriaProps {
  auditoria_id: string;
}

const conclusionesVacio: Conclusion = {
  id: 0,
  id_auditoria: "",
  objetivos_auditoria_no_cumplidos: null,
  sistema_no_cumple_norma: null,
  auditor_jefe_recomienda_certificacion_inicial: false,
  auditor_jefe_recomienda_mantenimiento: false,
  auditor_jefe_recomienda_levantar_suspension: false,
  auditor_jefe_recomienda_renovacion: false,
  auditor_jefe_recomienda_ampliar_alcance: false,
  auditor_jefe_recomienda_reduccion_alcance: false,
  auditor_jefe_recomienda_restaurar_certificacion: false,
  distancia_medio_fue_efectivo: false,
  distancia_medio_utilizado_google_meets: false,
  distancia_medio_utilizado_zoom: false,
  distancia_medio_utilizado_teams: false,
  distancia_medio_utilizado_otro: null,
  distancia_inconveniente_interlocutor_no_disponible: false,
  distancia_inconveniente_informacion_documentada_no_disponible: false,
  distancia_inconveniente_confidencialidad_informacion: false,
  distancia_inconveniente_observacion_actividades_tecnicas: false,
  distancia_inconveniente_otro: null,
  distancia_tecnica_video_conferencia: false,
  distancia_tecnica_revision_asincrona: false,
  distancia_tecnica_revision_sincrona: false,
  distancia_tecnica_video_recorrido: false,
  distancia_tecnica_video_procesos: false,
  distancia_tecnica_plataformas_archivos: false,
  distancia_tecnica_grabaciones: false,
  distancia_tecnica_fotografias: false,
  distancia_tecnica_otro: null,
  presencial_tecnica_entrevistas: false,
  presencial_tecnica_revision_registros: false,
  presencial_tecnica_recorrido: false,
  presencial_tecnica_observacion_procesos: false,
  presencial_tecnica_observacion_actividades: false,
  presencial_tecnica_otro: null,
  fecha_creacion: null,
  fecha_actualizacion: null,
};

export function ConclusionesAuditoria({ auditoria_id }: ConclusionesAuditoriaProps) {
  const [conclusiones, setConclusiones] = useState<Conclusion>(conclusionesVacio);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [hayCambios, setHayCambios] = useState(false);

  useEffect(() => {
    const cargarConclusiones = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/conclusiones?auditoriaId=${auditoria_id}`);
        if (response.ok) {
          const body = await response.json();
          if (body.length > 0) {
            setConclusiones(body[0]);
          } else {
            setConclusiones({ ...conclusionesVacio, id_auditoria: auditoria_id });
            setHayCambios(true);
          }
        }
      } catch (error) {
        console.error("Error cargando conclusiones:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarConclusiones();
  }, [auditoria_id]);

  const handleRadio = (campo: keyof Conclusion, valor: boolean) => {
    if (conclusiones[campo] === valor) return;
    setConclusiones(prev => ({
      ...prev,
      [campo]: valor,
    }));
    setHayCambios(true);
  };

  const handleInput = (campo: keyof Conclusion, valor: string) => {
    setConclusiones(prev => ({
      ...prev,
      [campo]: valor,
    }));
    setHayCambios(true);
  };

  const handleSave = async () => {
    setGuardando(true);
    try {
      const datos = { ...conclusiones, id_auditoria: auditoria_id };
      const response = await fetch('/api/conclusiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(response.statusText);
      setHayCambios(false);
    } catch (error) {
      console.error("Error guardando conclusiones:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className={styles["data-verification"]}>
        <div className={styles["loading-state"]}>
          <p>Cargando conclusiones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["data-verification"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Conclusiones de la Auditoría</h2>
        <button
          onClick={handleSave}
          disabled={!hayCambios || guardando}
          className={`${styles["save-button"]} ${!hayCambios ? styles["save-button-disabled"] : ""}`}
        >
          <SaveIcon sx={{ fontSize: 16, marginRight: 1 }} />
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {hayCambios && (
        <div className={styles["changes-notice"]}>
          <p className={styles["changes-text"]}>
            Tienes cambios sin guardar. Haz clic en &#34;Guardar cambios&#34; para confirmar.
          </p>
        </div>
      )}

      <div className={styles["verification-fields"]}>
        {/* 1. Objetivos de auditoría */}
        <div className={styles["verification-field"]}>
          <h3 className={styles["field-label"]}>
            ¿Se ha cumplido con la totalidad de los objetivos de auditoría establecidos en el apartado 2 del presente informe?
          </h3>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={!conclusiones.objetivos_auditoria_no_cumplidos}
              onClick={() => handleInput("objetivos_auditoria_no_cumplidos", null)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Sí
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.objetivos_auditoria_no_cumplidos}
              onClick={() => handleInput("objetivos_auditoria_no_cumplidos", "")}
              icon={<CancelIcon className={styles["option-icon-error"]} />}
              classNm="option-error"
              variant="error"
            >
              No, explique:
            </BotonRadio>
          </div>
          {!!conclusiones.objetivos_auditoria_no_cumplidos && (
            <textarea
              className={styles["comments-textarea"]}
              placeholder="Explique por qué no se cumplieron los objetivos"
              value={conclusiones.objetivos_auditoria_no_cumplidos || ""}
              onChange={e => handleInput("objetivos_auditoria_no_cumplidos", e.target.value)}
            />
          )}
        </div>

        {/* 2. Cumplimiento del sistema */}
        <div className={styles["verification-field"]}>
          <h3 className={styles["field-label"]}>
            ¿El sistema integrado de gestión cumple con los requisitos de las normas UNE-EN ISO 9001:2015/UNE-EN ISO 14001:2015 y con los criterios de auditoría y se considera que se encuentra eficazmente implantado?
          </h3>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={!conclusiones.sistema_no_cumple_norma}
              onClick={() => handleInput("sistema_no_cumple_norma", null)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Sí
            </BotonRadio>
            <BotonRadio
              selected={conclusiones.sistema_no_cumple_norma === "excepciones"}
              onClick={() => handleInput("sistema_no_cumple_norma", "excepciones")}
              icon={<CheckCircleIcon className={styles["option-icon-change"]} />}
              classNm="option-change"
              variant="cambio"
            >
              Sí, a excepción de las no conformidades descritas en el presente informe
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.sistema_no_cumple_norma && conclusiones.sistema_no_cumple_norma !== "excepciones"}
              onClick={() => handleInput("sistema_no_cumple_norma", "")}
              icon={<CancelIcon className={styles["option-icon-error"]} />}
              classNm="option-error"
              variant="error"
            >
              No, explique:
            </BotonRadio>
          </div>
          {!!conclusiones.sistema_no_cumple_norma && conclusiones.sistema_no_cumple_norma !== "excepciones" && (
            <textarea
              className={styles["comments-textarea"]}
              placeholder="Explique por qué el sistema no cumple"
              value={conclusiones.sistema_no_cumple_norma || ""}
              onChange={e => handleInput("sistema_no_cumple_norma", e.target.value)}
            />
          )}
        </div>

        {/* 3. Recomendaciones del auditor jefe */}
        <div className={styles["verification-field"]}>
          <h3 className={styles["field-label"]}>El auditor jefe recomienda:</h3>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={!!conclusiones.auditor_jefe_recomienda_certificacion_inicial}
              onClick={() => handleRadio("auditor_jefe_recomienda_certificacion_inicial", !conclusiones.auditor_jefe_recomienda_certificacion_inicial)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              La certificación inicial
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.auditor_jefe_recomienda_mantenimiento}
              onClick={() => handleRadio("auditor_jefe_recomienda_mantenimiento", !conclusiones.auditor_jefe_recomienda_mantenimiento)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              El mantenimiento
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.auditor_jefe_recomienda_levantar_suspension}
              onClick={() => handleRadio("auditor_jefe_recomienda_levantar_suspension", !conclusiones.auditor_jefe_recomienda_levantar_suspension)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              El levantamiento de la suspensión
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.auditor_jefe_recomienda_renovacion}
              onClick={() => handleRadio("auditor_jefe_recomienda_renovacion", !conclusiones.auditor_jefe_recomienda_renovacion)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              La renovación
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.auditor_jefe_recomienda_ampliar_alcance}
              onClick={() => handleRadio("auditor_jefe_recomienda_ampliar_alcance", !conclusiones.auditor_jefe_recomienda_ampliar_alcance)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              La ampliación de alcance
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.auditor_jefe_recomienda_reduccion_alcance}
              onClick={() => handleRadio("auditor_jefe_recomienda_reduccion_alcance", !conclusiones.auditor_jefe_recomienda_reduccion_alcance)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              La reducción de alcance
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.auditor_jefe_recomienda_restaurar_certificacion}
              onClick={() => handleRadio("auditor_jefe_recomienda_restaurar_certificacion", !conclusiones.auditor_jefe_recomienda_restaurar_certificacion)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              La restauración de la certificación
            </BotonRadio>
          </div>
        </div>

        {/* 4. Auditorías a distancia */}
        <div className={styles["verification-field"]}>
          <h3 className={styles["field-label"]}>AUDITORÍAS A DISTANCIA</h3>
          <div className={styles["subfield-label"]}>¿El medio utilizado ha sido efectivo para el logro de los objetivos de la auditoría?</div>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={!!conclusiones.distancia_medio_fue_efectivo}
              onClick={() => handleRadio("distancia_medio_fue_efectivo", true)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Sí
            </BotonRadio>
            <BotonRadio
              selected={conclusiones.distancia_medio_fue_efectivo === false}
              onClick={() => handleRadio("distancia_medio_fue_efectivo", false)}
              icon={<CancelIcon className={styles["option-icon-error"]} />}
              classNm="option-error"
              variant="error"
            >
              No
            </BotonRadio>
          </div>
          <div className={styles["subfield-label"]}>En el caso de que se haya realizado la auditoría a distancia Indicar el medio utilizado:</div>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={!!conclusiones.distancia_medio_utilizado_google_meets}
              onClick={() => handleRadio("distancia_medio_utilizado_google_meets", !conclusiones.distancia_medio_utilizado_google_meets)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Google Meets
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_medio_utilizado_zoom}
              onClick={() => handleRadio("distancia_medio_utilizado_zoom", !conclusiones.distancia_medio_utilizado_zoom)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Zoom
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_medio_utilizado_teams}
              onClick={() => handleRadio("distancia_medio_utilizado_teams", !conclusiones.distancia_medio_utilizado_teams)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Microsoft Teams
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_medio_utilizado_otro}
              onClick={() => handleInput("distancia_medio_utilizado_otro", conclusiones.distancia_medio_utilizado_otro ? null : "")}
              icon={<CheckCircleIcon className={styles["option-icon-note"]} />}
              classNm="option-note"
              variant="nota"
            >
              Otro (indicar)
            </BotonRadio>
          </div>
          {!!conclusiones.distancia_medio_utilizado_otro && (
            <textarea
              className={styles["comments-textarea"]}
              placeholder="Indique el medio utilizado"
              value={conclusiones.distancia_medio_utilizado_otro || ""}
              onChange={e => handleInput("distancia_medio_utilizado_otro", e.target.value)}
            />
          )}

          <div className={styles["subfield-label"]}>¿Se han presentado inconvenientes o contratiempos durante la auditoría?</div>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={
                !!conclusiones.distancia_inconveniente_interlocutor_no_disponible ||
                !!conclusiones.distancia_inconveniente_informacion_documentada_no_disponible ||
                !!conclusiones.distancia_inconveniente_confidencialidad_informacion ||
                !!conclusiones.distancia_inconveniente_observacion_actividades_tecnicas ||
                !!conclusiones.distancia_inconveniente_otro
              }
              onClick={() => {
                handleRadio("distancia_inconveniente_interlocutor_no_disponible", !conclusiones.distancia_inconveniente_interlocutor_no_disponible);
              }}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Sí
            </BotonRadio>
            <BotonRadio
              selected={
                !conclusiones.distancia_inconveniente_interlocutor_no_disponible &&
                !conclusiones.distancia_inconveniente_informacion_documentada_no_disponible &&
                !conclusiones.distancia_inconveniente_confidencialidad_informacion &&
                !conclusiones.distancia_inconveniente_observacion_actividades_tecnicas &&
                !conclusiones.distancia_inconveniente_otro
              }
              onClick={() => {
                handleRadio("distancia_inconveniente_interlocutor_no_disponible", false);
                handleRadio("distancia_inconveniente_informacion_documentada_no_disponible", false);
                handleRadio("distancia_inconveniente_confidencialidad_informacion", false);
                handleRadio("distancia_inconveniente_observacion_actividades_tecnicas", false);
                handleInput("distancia_inconveniente_otro", null);
              }}
              icon={<CancelIcon className={styles["option-icon-error"]} />}
              classNm="option-error"
              variant="error"
            >
              No
            </BotonRadio>
          </div>
          {(!!conclusiones.distancia_inconveniente_interlocutor_no_disponible ||
            !!conclusiones.distancia_inconveniente_informacion_documentada_no_disponible ||
            !!conclusiones.distancia_inconveniente_confidencialidad_informacion ||
            !!conclusiones.distancia_inconveniente_observacion_actividades_tecnicas ||
            !!conclusiones.distancia_inconveniente_otro) && (
            <>
              <div className={styles["subfield-label"]}>Si la respuesta fue sí, indique el motivo:</div>
              <div className={styles["options-grid"]}>
                <BotonRadio
                  selected={!!conclusiones.distancia_inconveniente_interlocutor_no_disponible}
                  onClick={() => handleRadio("distancia_inconveniente_interlocutor_no_disponible", !conclusiones.distancia_inconveniente_interlocutor_no_disponible)}
                  icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
                  classNm="option-correct"
                  variant="correcto"
                >
                  Interlocutores no disponibles
                </BotonRadio>
                <BotonRadio
                  selected={!!conclusiones.distancia_inconveniente_informacion_documentada_no_disponible}
                  onClick={() => handleRadio("distancia_inconveniente_informacion_documentada_no_disponible", !conclusiones.distancia_inconveniente_informacion_documentada_no_disponible)}
                  icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
                  classNm="option-correct"
                  variant="correcto"
                >
                  Información documentada no disponible
                </BotonRadio>
                <BotonRadio
                  selected={!!conclusiones.distancia_inconveniente_confidencialidad_informacion}
                  onClick={() => handleRadio("distancia_inconveniente_confidencialidad_informacion", !conclusiones.distancia_inconveniente_confidencialidad_informacion)}
                  icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
                  classNm="option-correct"
                  variant="correcto"
                >
                  Cuestiones relacionadas con la confidencialidad de la información
                </BotonRadio>
                <BotonRadio
                  selected={!!conclusiones.distancia_inconveniente_observacion_actividades_tecnicas}
                  onClick={() => handleRadio("distancia_inconveniente_observacion_actividades_tecnicas", !conclusiones.distancia_inconveniente_observacion_actividades_tecnicas)}
                  icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
                  classNm="option-correct"
                  variant="correcto"
                >
                  Dificultades para la observación de las actividades técnicas
                </BotonRadio>
                <BotonRadio
                  selected={!!conclusiones.distancia_inconveniente_otro}
                  onClick={() => handleInput("distancia_inconveniente_otro", conclusiones.distancia_inconveniente_otro ? null : "")}
                  icon={<CheckCircleIcon className={styles["option-icon-note"]} />}
                  classNm="option-note"
                  variant="nota"
                >
                  Otro (indicar)
                </BotonRadio>
              </div>
              {!!conclusiones.distancia_inconveniente_otro && (
                <textarea
                  className={styles["comments-textarea"]}
                  placeholder="Indique el motivo"
                  value={conclusiones.distancia_inconveniente_otro || ""}
                  onChange={e => handleInput("distancia_inconveniente_otro", e.target.value)}
                />
              )}
            </>
          )}

          <div className={styles["subfield-label"]}>Indicar las técnicas utilizadas para la recopilación y verificación de las evidencias</div>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_video_conferencia}
              onClick={() => handleRadio("distancia_tecnica_video_conferencia", !conclusiones.distancia_tecnica_video_conferencia)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Video conferencia – Entrevistas en remoto con Responsables, Trabajadores, etc.
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_revision_asincrona}
              onClick={() => handleRadio("distancia_tecnica_revision_asincrona", !conclusiones.distancia_tecnica_revision_asincrona)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Revisión documental (no en tiempo real)
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_revision_sincrona}
              onClick={() => handleRadio("distancia_tecnica_revision_sincrona", !conclusiones.distancia_tecnica_revision_sincrona)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Revisión de registros “online” y en pantalla
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_video_recorrido}
              onClick={() => handleRadio("distancia_tecnica_video_recorrido", !conclusiones.distancia_tecnica_video_recorrido)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Video conferencia con recorrido por las instalaciones
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_video_procesos}
              onClick={() => handleRadio("distancia_tecnica_video_procesos", !conclusiones.distancia_tecnica_video_procesos)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Video conferencia para observar procesos y/o actividades
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_plataformas_archivos}
              onClick={() => handleRadio("distancia_tecnica_plataformas_archivos", !conclusiones.distancia_tecnica_plataformas_archivos)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Acceso a plataformas o a repositorio de archivos informáticos
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_grabaciones}
              onClick={() => handleRadio("distancia_tecnica_grabaciones", !conclusiones.distancia_tecnica_grabaciones)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Grabaciones de actividades técnicas
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_fotografias}
              onClick={() => handleRadio("distancia_tecnica_fotografias", !conclusiones.distancia_tecnica_fotografias)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Intercambio de fotografías
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.distancia_tecnica_otro}
              onClick={() => handleInput("distancia_tecnica_otro", conclusiones.distancia_tecnica_otro ? null : "")}
              icon={<CheckCircleIcon className={styles["option-icon-note"]} />}
              classNm="option-note"
              variant="nota"
            >
              Otro (indicar)
            </BotonRadio>
          </div>
          {!!conclusiones.distancia_tecnica_otro && (
            <textarea
              className={styles["comments-textarea"]}
              placeholder="Indique otra técnica utilizada"
              value={conclusiones.distancia_tecnica_otro || ""}
              onChange={e => handleInput("distancia_tecnica_otro", e.target.value)}
            />
          )}
        </div>

        {/* 5. Auditorías en sitio */}
        <div className={styles["verification-field"]}>
          <h3 className={styles["field-label"]}>AUDITORÍAS EN SITIO</h3>
          <div className={styles["subfield-label"]}>Indique las técnicas utilizadas para la recopilación y verificación de las evidencias</div>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={!!conclusiones.presencial_tecnica_entrevistas}
              onClick={() => handleRadio("presencial_tecnica_entrevistas", !conclusiones.presencial_tecnica_entrevistas)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Entrevistas con Responsables, Trabajadores, etc.
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.presencial_tecnica_revision_registros}
              onClick={() => handleRadio("presencial_tecnica_revision_registros", !conclusiones.presencial_tecnica_revision_registros)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Revisión de registros
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.presencial_tecnica_recorrido}
              onClick={() => handleRadio("presencial_tecnica_recorrido", !conclusiones.presencial_tecnica_recorrido)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Recorrido por las instalaciones
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.presencial_tecnica_observacion_procesos}
              onClick={() => handleRadio("presencial_tecnica_observacion_procesos", !conclusiones.presencial_tecnica_observacion_procesos)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Observación en sitio de procesos y/o actividades
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.presencial_tecnica_observacion_actividades}
              onClick={() => handleRadio("presencial_tecnica_observacion_actividades", !conclusiones.presencial_tecnica_observacion_actividades)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Observación en sitio de actividades técnicas
            </BotonRadio>
            <BotonRadio
              selected={!!conclusiones.presencial_tecnica_otro}
              onClick={() => handleInput("presencial_tecnica_otro", conclusiones.presencial_tecnica_otro ? null : "")}
              icon={<CheckCircleIcon className={styles["option-icon-note"]} />}
              classNm="option-note"
              variant="nota"
            >
              Otro (indicar)
            </BotonRadio>
          </div>
          {!!conclusiones.presencial_tecnica_otro && (
            <textarea
              className={styles["comments-textarea"]}
              placeholder="Indique otra técnica utilizada"
              value={conclusiones.presencial_tecnica_otro || ""}
              onChange={e => handleInput("presencial_tecnica_otro", e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

