"use client";

import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./VerificacionDatos.module.css";
import {BotonRadio} from "@/components/common/BotonRadio";
import { VerificacionDatos } from "@/schemas/types";
import {TextInput} from "@/components/common/TextInput";

interface DataVerificationProps {
  auditoria_id: string;
}

type camposCorregibles =
    "ruc"
    | "centros_incluidos_alcance"
    | "direccion_principal"
    | "nombre_organizacion"
    | "persona_contacto_cargo"
    | "persona_contacto_correo"
    | "persona_contacto_nombre"
    | "persona_firma_marca_cargo"
    | "persona_firma_marca_nombre"
    | "telefono";

const datosAVerificar: {texto: string, campo: camposCorregibles}[] = [
  {
    texto: "Nombre de la organización:",
    campo: "nombre_organizacion",
  },
  {
    texto: "CIF/RUC:",
    campo: "ruc",
  },
  {
    texto: "Teléfono:",
    campo: "telefono",
  },
  {
    texto: "Dirección principal:",
    campo: "direccion_principal",
  },
  {
    texto: "Centros incluidos en el alcance:",
    campo: "centros_incluidos_alcance",
  },
  {
    texto: "Nombre de la persona de contacto:",
    campo: "persona_contacto_nombre",
  },
  {
    texto: "Cargo de la persona de contacto:",
    campo: "persona_contacto_cargo",
  },
  {
    texto: "Correo de la persona de contacto:",
    campo: "persona_contacto_correo",
  },
  {
    texto: "Nombre de persona que firma el contrato de uso de marca:",
    campo: "persona_firma_marca_nombre",
  },
  {
    texto: "Cargo de persona que firma el contrato de uso de marca:",
    campo: "persona_firma_marca_cargo",
  },
];

  const vetificacionDatosVacio: VerificacionDatos = {
  id: 0,
  id_auditoria: "",
  ruc: null,
  centros_incluidos_alcance: null,
  direccion_principal: null,
  exclusion_7152: false,
  exclusion_83: false,
  exclusion_851f: false,
  exclusion_853: false,
  exclusion_855: false,
  fecha_actualizacion: null,
  fecha_creacion: null,
  nombre_organizacion: null,
  numero_empleados_emplazamiento_json: null,
  persona_contacto_cargo: null,
  persona_contacto_correo: null,
  persona_contacto_nombre: null,
  persona_firma_marca_cargo: null,
  persona_firma_marca_nombre: null,
  telefono: null,
}

const inicializarBooleanosVerificacion = (data: VerificacionDatos) => {
  const initialState = {} as Record<keyof camposCorregibles, boolean>;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      initialState[key as keyof camposCorregibles] =
          data[key as keyof VerificacionDatos] === null ||
          data[key as keyof VerificacionDatos] === "";
    }
  }
  return initialState;
};

export function DataVerification({ auditoria_id }: DataVerificationProps) {
  const [verificacion, setVerificacion] = useState<VerificacionDatos>(vetificacionDatosVacio);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [hayCambios, setHayCambios] = useState(false);
  const [verificacionBooleanos, setVerificacionBooleanos] = useState(inicializarBooleanosVerificacion(vetificacionDatosVacio));

  useEffect(() => {
    const loadVerification = async () => {
      let datos = vetificacionDatosVacio;
      try {
        setLoading(true);
        const response = await fetch(`/api/verificacion-datos?auditoriaId=${auditoria_id}`);
        if (response.ok) {
          datos = await response.json();
        }
      } catch (error) {
        console.error('Error cargando datos de verificacion:', error);
      } finally {
        setVerificacion(datos);
        setVerificacionBooleanos(inicializarBooleanosVerificacion(datos));
        setLoading(false);
      }
    };
    loadVerification();

  }, [auditoria_id]);

  const handleButtonClick = (campo: keyof VerificacionDatos, esCorrecto: boolean) => {
    setVerificacionBooleanos((prevState) => {
        if( prevState[campo] === esCorrecto) {
          return prevState;
        }
        setHayCambios(true);
        return {
      ...prevState,
      [campo]: esCorrecto,
    }});
  };

  const handleTextChange = (campo: keyof VerificacionDatos, value: string) => {
    setHayCambios(true);
    setVerificacion({
      ...verificacion,
      [campo]: value,
    });
  };

  const handleSave = async () => {
    setGuardando(true);
    try {
        const verificacionDatos: VerificacionDatos = {
            ...verificacion,
            id_auditoria: auditoria_id,
        };
      datosAVerificar.forEach(item => {
        const campo = item.campo;
        if (verificacionBooleanos[campo]) {
          verificacionDatos[campo] = null;
        }
      });
      const response = await fetch('/api/verificacion-datos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificacionDatos),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error saving verification data:', error);
    } finally {
      setGuardando(false);
      setHayCambios(false);
    }
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
          disabled={!hayCambios || guardando}
          className={`${styles["save-button"]} ${
            !hayCambios ? styles["save-button-disabled"] : ""
          }`}
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
        {datosAVerificar.map((item, key) => (
            <div key={key} className={styles["verification-field"]}>
              <h3 className={styles["field-label"]}>{item.texto}</h3>
              <div className={styles["options-grid"]}>
                <BotonRadio
                    selected={verificacionBooleanos[item.campo]}
                    onClick={() => handleButtonClick(item.campo, true)}
                    icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
                    classNm="option-correct"
                    variant="correcto"
                >
                  Es correcto
                </BotonRadio>
                <BotonRadio
                    selected={!verificacionBooleanos[item.campo]}
                    onClick={() => handleButtonClick(item.campo, false)}
                    icon={<EditIcon className={styles["option-icon-change"]} />}
                    classNm="option-change"
                    variant="warning"
                >
                  Necesita corrección
                </BotonRadio>
                <TextInput
                    value={verificacion[item.campo] as string || ""}
                    onChange={(e) => handleTextChange(item.campo, e.target.value)}
                    label={"Escribe aquí el dato corregido"}
                    disabled={verificacionBooleanos[item.campo]}
                    placeholder={"Dato corregido"}
                />
              </div>
            </div>
        ))}
        <div className={styles["verification-field"]}>
          <h3 className={styles["field-label"]}>Exclusiones</h3>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={verificacion.exclusion_7152}
              onClick={() => handleButtonClick("exclusion_7152", true)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Excluido 7152
            </BotonRadio>
            <BotonRadio
              selected={!verificacion.exclusion_7152}
              onClick={() => handleButtonClick("exclusion_7152", false)}
              icon={<EditIcon className={styles["option-icon-change"]} />}
              classNm="option-change"
              variant="warning"
            >
              No excluido 7152
            </BotonRadio>
          </div>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={verificacion.exclusion_83}
              onClick={() => handleButtonClick("exclusion_83", true)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Excluido 83
            </BotonRadio>
            <BotonRadio
              selected={!verificacion.exclusion_83}
              onClick={() => handleButtonClick("exclusion_83", false)}
              icon={<EditIcon className={styles["option-icon-change"]} />}
              classNm="option-change"
              variant="warning"
            >
              No excluido 83
            </BotonRadio>
          </div>
          <div className={styles["options-grid"]}>
            <BotonRadio
              selected={verificacion.exclusion_851f}
              onClick={() => handleButtonClick("exclusion_851f", true)}
              icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
              classNm="option-correct"
              variant="correcto"
            >
              Excluido 851f
            </BotonRadio>
            <BotonRadio
              selected={!verificacion.exclusion_851f}
              onClick={() => handleButtonClick("exclusion", false)}
              icon={<EditIcon className={styles["option-icon-change"]} />}
              classNm="option-change"
              variant="warning"
            >
              No excluido 851f
            </BotonRadio>
          </div>
        </div>
      </div>
    </div>
  );
}
