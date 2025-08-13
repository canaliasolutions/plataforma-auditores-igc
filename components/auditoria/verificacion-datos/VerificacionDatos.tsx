"use client";

import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./VerificacionDatos.module.css";
import {BotonRadio} from "@/components/common/BotonRadio";
import { VerificacionDatosType } from "@/schemas/types";
import {TextInput} from "@/components/common/TextInput";

interface DataVerificationProps {
  auditoria_id: string;
}

type CamposTexto =
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

type CamposExclusiones =
      "exclusion_7152"
    | "exclusion_83"
    | "exclusion_851f"
    | "exclusion_853"
    | "exclusion_855";

type Campos = CamposTexto | CamposExclusiones;
const datosAVerificar: {texto: string, campo: CamposTexto}[] = [
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

const exclusiones9001: {texto: string, campo: CamposExclusiones}[] = [
  {
    texto: "7.1.5.2 Trazabilidad de las mediciones",
    campo: "exclusion_7152"
  },
  {
    texto: "8.3 Diseño y Desarrollo",
    campo: "exclusion_83"
  },
  {
    texto: "8.5.1 f) Validación y revalidación de los procesos",
    campo: "exclusion_851f"
  },
  {
    texto: "8.5.3 Propiedad perteneciente al cliente",
    campo: "exclusion_853"
  },
  {
    texto: "8.5.5 Actividades posteriores a la entrega",
    campo: "exclusion_855"
  },
]

  const vetificacionDatosVacio: VerificacionDatosType = {
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

const inicializarBooleanosVerificacion = (data: VerificacionDatosType) => {
  const initialState = {} as Record<Campos, boolean>;
  datosAVerificar.forEach((item) => {
    const campo = item.campo;
    initialState[campo] = data[campo] === null || data[campo] === "";
  });

  exclusiones9001.forEach((item) => {
    const campo = item.campo;
    initialState[campo] = !data[campo];
  });
  return initialState;
};

export function VerificacionDatos({ auditoria_id }: DataVerificationProps) {
  const [verificacion, setVerificacion] = useState<VerificacionDatosType>(vetificacionDatosVacio);
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
          const body = await response.json();
          if (body.length == 0) {
            setHayCambios(true);
          } else {
            datos = body[0] as VerificacionDatosType;
          }
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

  const onCampoTextoButtonClick = (campo: Campos, esCorrecto: boolean) => {
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

  const onExclusionButtonClick = (campo: CamposExclusiones, seExcluye: boolean) => {
    setVerificacion((prevState) => {
      if( prevState[campo] === seExcluye) {
        return prevState;
      }
      setHayCambios(true);
      return {
        ...prevState,
        [campo]: seExcluye,
      };
    });
  }

  const handleTextChange = (campo: CamposTexto, value: string) => {
    setHayCambios(true);
    setVerificacion({
      ...verificacion,
      [campo]: value,
    });
  };

  const handleSave = async () => {
    setGuardando(true);
    try {
        const verificacionDatos: VerificacionDatosType = {
            ...verificacion,
            id_auditoria: auditoria_id,
        };
      datosAVerificar.forEach(item => {
        const campo: CamposTexto = item.campo;
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
                    onClick={() => onCampoTextoButtonClick(item.campo, true)}
                    icon={<CheckCircleIcon className={styles["option-icon-correct"]} />}
                    classNm="option-correct"
                    variant="correcto"
                >
                  Es correcto
                </BotonRadio>
                <BotonRadio
                    selected={!verificacionBooleanos[item.campo]}
                    onClick={() => onCampoTextoButtonClick(item.campo, false)}
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
          <h3 className={styles["field-label"]}>Exclusiones (ISO 9001)</h3>
          {exclusiones9001.map((item, key) => (
              <div key={key} className={styles["verification-field"]}>
                <h5 className={styles["subfield-label"]}>{item.texto}
                </h5>
                <div className={styles["options-grid"]}>
                  <BotonRadio
                      selected={!verificacion[item.campo]}
                      onClick={() => onExclusionButtonClick(item.campo, false)}
                      icon={<CheckCircleIcon className={styles["option-icon-correct"]}/>}
                      classNm="option-correct"
                      variant="correcto"
                  >
                    Se incluye en la auditoría
                  </BotonRadio>
                  <BotonRadio
                      selected={verificacion[item.campo]}
                      onClick={() => onExclusionButtonClick(item.campo, true)}
                      icon={<CancelIcon className={styles["option-icon-error"]}/>}
                      classNm="option-change"
                      variant="warning"
                  >
                    Se excluye de la auditoría
                  </BotonRadio>
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
}
