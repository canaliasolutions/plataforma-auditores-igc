"use client";

import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./ActividadesIntegradas.module.css";
import { BotonRadio } from "@/components/common/BotonRadio";
import { ActividadesIntegradasType } from "@/schemas/types";

interface ActividadesIntegradasProps {
  auditoria_id: string;
}

const camposActividades = [
  {
    campo: "unica_revision_todos_requerimientos",
    texto: "¿Realiza una única revisión por la dirección que contempla todos los elementos de entrada requeridos por cada sistema de gestión?",
  },
  {
    campo: "auditorias_internas_integradas",
    texto: "¿Programa, planifica y realiza las auditorías internas de cada sistema de gestión en auditorías\n" +
        "integradas?",
  },
  {
    campo: "politica_unica_sistema_integrado",
    texto: "¿Integra las políticas de cada sistema de gestión en una política única de sistema integrado de\n" +
        "gestión?",
  },
  {
    campo: "gestion_ambiental_integrada",
    texto: "¿La gestión ambiental se encuentra integrada en la gestión estratégica de la organización?",
  },
  {
    campo: "mapa_procesos_integrados",
    texto: "¿Desarrolla un mapa o caracterización de procesos que integra los diferentes sistemas de gestión, los procesos de gestión estratégicos, los procesos operativos o claves y los procesos de apoyo, los de seguimiento y medición y sus interrelaciones?",
  },
  {
    campo: "identificacion_contexto_considera_ambiente_calidad",
    texto: "¿En la identificación del contexto y de las partes interesadas se consideran requisitos y expectativas ambientales y de calidad?",
  },
  {
    campo: "unica_sistematica_riesgos_oportunidades",
    texto: "¿Se dispone de una única sistemática para la identificación, evaluación y seguimientos de los riesgos y oportunidades?",
  },
  {
    campo: "informacion_documentada_unica_requisitos_comunes",
    texto: "¿Integra la información documentada de los diferentes sistemas de gestión en una documentación única que contemplan los requisitos comunes de los sistemas de gestión que se aplican?",
  },
  {
    campo: "acciones_de_mejora_integradas",
    texto: "¿Realiza bajo un enfoque integrado las acciones de mejora (acciones correctivas; ¿medición y mejora continua), teniendo en cuenta los requisitos de cada sistema de gestión?",
  },
  {
    campo: "planificacion_objetivos_indicadores_integrados",
    texto: "¿Dispone de un enfoque integrado para la planificación, con objetivos e indicadores integrados teniendo en cuenta los requisitos de cada sistema de gestión?",
  },
  {
    campo: "actividades_responsabilidades_integradas",
    texto: "¿Las actividades y responsabilidades pertinentes a los productos o servicios han sido definido de forma integrada en las funciones del personal y se tiene una única función para asumir las\n" +
        "responsabilidades inherentes a los sistemas de gestión que aplican?",
  },
] as const;

const actividadesIntegradasVacio: ActividadesIntegradasType = {
  id: 0,
  id_auditoria: "",
  unica_revision_todos_requerimientos: false,
  auditorias_internas_integradas: false,
  politica_unica_sistema_integrado: false,
  gestion_ambiental_integrada: false,
  mapa_procesos_integrados: false,
  identificacion_contexto_considera_ambiente_calidad: false,
  unica_sistematica_riesgos_oportunidades: false,
  informacion_documentada_unica_requisitos_comunes: false,
  acciones_de_mejora_integradas: false,
  planificacion_objetivos_indicadores_integrados: false,
  actividades_responsabilidades_integradas: false,
  fecha_creacion: null,
  fecha_actualizacion: null,
};

export function ActividadesIntegradas({ auditoria_id }: ActividadesIntegradasProps) {
  const [actividadesIntegradas, setActividadesIntegradas] = useState<ActividadesIntegradasType>(actividadesIntegradasVacio);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [hayCambios, setHayCambios] = useState(false);

  useEffect(() => {
    const cargarActividadesIntegradas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/actividades-integradas?auditoriaId=${auditoria_id}`);
        if (response.ok) {
          const body = await response.json();
          if (body.length > 0) {
            setActividadesIntegradas(body[0]);
          } else {
            setActividadesIntegradas({ ...actividadesIntegradasVacio, id_auditoria: auditoria_id });
            setHayCambios(true);
          }
        }
      } catch (error) {
        console.error("Error cargando actividades integradas:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarActividadesIntegradas();
  }, [auditoria_id]);

  const handleSelect = (campo: keyof ActividadesIntegradasType, valor: boolean) => {
    if (actividadesIntegradas[campo] === valor) return;
    setActividadesIntegradas(prev => ({
      ...prev,
      [campo]: valor,
    }));
    setHayCambios(true);
  };

  const handleSave = async () => {
    setGuardando(true);
    try {
      const datos = { ...actividadesIntegradas, id_auditoria: auditoria_id };
      const response = await fetch('/api/actividades-integradas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (!response.ok) throw new Error(response.statusText);
      setHayCambios(false);
    } catch (error) {
      console.error("Error guardando informe actividades integradas:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className={styles["data-verification"]}>
        <div className={styles["loading-state"]}>
          <p>Cargando actividades integradas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["data-verification"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Actividades que se realizan de forma integrada</h2>
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
        {camposActividades.map(({ campo, texto }) => (
          <div key={campo} className={styles["verification-field"]}>
            <h3 className={styles["field-label"]}>{texto}</h3>
            <div className={styles["options-grid"]}>
              <BotonRadio
                selected={actividadesIntegradas[campo]}
                onClick={() => handleSelect(campo, true)}
                icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
                classNm="option-correct"
                variant="correcto"
              >
                Sí
              </BotonRadio>
              <BotonRadio
                selected={!actividadesIntegradas[campo]}
                onClick={() => handleSelect(campo, false)}
                icon={<CancelIcon className={styles["option-icon-error"]} />}
                classNm="option-error"
                variant="error"
              >
                No
              </BotonRadio>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

