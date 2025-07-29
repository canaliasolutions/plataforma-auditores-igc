import {Client} from 'fm-data-api-client';
import {Auditoria, Hallazgo, Objeto, ResumenAuditoria} from "@/types/tipos";
import {fakeAudits} from "@/lib/fake-data";
import {
    conclusionesQueries,
    eficaciaQueries,
    hallazgosQueries,
    participantesQueries,
    verificacionDatosQueries
} from "@/lib/database";
import {normas} from "@/constants/normas";

const informesClient = new Client(process.env.FM_HOST, process.env.FM_INFORMES_DB, process.env.FM_USERNAME, process.env.FM_PWD);

export async function getAudits(auditorEmail: string): Promise<ResumenAuditoria[]> {
    let audits: ResumenAuditoria[] = [];
    const layout = informesClient.layout('PlataformaAuditorias');
    let records;
    try {
        records = await layout.find(
            {
                "Login_Auditores ::Correo": `==${auditorEmail}`,
                "Estado": 3
            }
        );
    } catch (e) {
        console.warn("Using fake records, failed fetch from filemaker: ",e);
        records = {data: fakeAudits};
    }
    const auditsRawData = records.data.map((item: Objeto) => item.fieldData);
    auditsRawData.forEach((auditRawItem: Objeto) => {
        const auditoria: ResumenAuditoria = {
            id: '',
            fechaInicio: '',
            fechaFinal: '',
            cliente: { nombre: '', logo: undefined},
            norma: '',
            etapa: '',
        };
        auditoria.id = auditRawItem['ID Auditoria'];
        auditoria.fechaInicio = auditRawItem['Fecha Inicio Auditoria'];
        auditoria.fechaFinal = auditRawItem['Fecha Fin Auditoria'];
        auditoria.cliente = {
            nombre: auditRawItem['Clientes 2::clienteNombre'],
            logo: undefined
        };
        auditoria.norma = auditRawItem['Norma2'];
        auditoria.etapa = auditRawItem['Etapa'];
        audits.push(auditoria);
    });
    audits = sortByDate(audits);
    return audits;
}

export async function getAuditById(auditId: string, auditorEmail: string): Promise<Auditoria | null> {
    const layout = informesClient.layout('PlataformaAuditorias');
    let records;
    try {
        records = await layout.find(
            {
                "ID Auditoria": `==${auditId}`,
                "Login_Auditores ::Correo": `==${auditorEmail}`,
                "Estado": 3
            }
        );
    } catch (e) {
        console.warn("Failed fetch from Filemaker: ", e);
      return {
        id: auditId,
        fechaInicio: "1/11/2025",
        fechaFinal: "2/11/2025",
        cliente: {
          nombre: "test",
          logo: undefined
        },
        norma: "iso 123",
        etapa: "renovacion",
        alcance: "alcance test",
        ubicacion: "ubicacion test",
        tipo: "in situ",
        nombreAuditor: "test auditor",
        correoAuditor: "test@correo.com"
      }
    }
    if (records.data.length === 0) {
        return null;
    }
    const auditRawItem = records.data[0].fieldData;
    return {
        id: auditId,
        fechaInicio: auditRawItem['Fecha Inicio Auditoria'],
        fechaFinal: auditRawItem['Fecha Fin Auditoria'],
        cliente: {
            nombre: auditRawItem['Clientes 2::clienteNombre'],
            logo: undefined
        },
        norma: auditRawItem['Norma2'].trim(),
        etapa: auditRawItem['Etapa'],
        alcance: auditRawItem['Expedientes 2::Alcance'],
        ubicacion: auditRawItem['Centros_auditados_CPDs_Sitios'],
        tipo: auditRawItem['Tipo'],
        nombreAuditor: auditRawItem['Auditor_Jefe'],
        correoAuditor: auditorEmail
    };
}

async function getAuditor(email: string) {
    const auditorLayout = informesClient.layout('Auditores');
    let records;
    try {
        records = await auditorLayout.find(
            {
                "Correo": `==${email}`,
            }
        );
        if (records.data.length === 0) {
            throw new Error(`No existe auditor con el correo ${email} en el layout Auditores`);
        }
    } catch (e) {
        console.error("Error en Filemaker: ", e);
        return null
    }
    return records.data[0].fieldData;

}

export async function subirInforme(auditoria: Auditoria) {
    const layout = informesClient.layout('Informe');
    const auditor = await getAuditor(auditoria.correoAuditor)
    let informeResponse;
    let informe;
    try {
        const verificacionDatos = verificacionDatosQueries.getByAuditId.get(auditoria.id);
        const conclusiones = conclusionesQueries.getByAuditId.get(auditoria.id);
        const eficacia = eficaciaQueries.getByAuditId.get(auditoria.id);
        informe = {
            "IDf Auditor": auditor["ID Auditor"],
            "IDf Auditoria": Number(auditoria.id),
            "verificado_contacto": verificacionDatos.datos_contacto,
            "verificado_alcance": verificacionDatos.datos_alcance,
            "verificado_facturacion": verificacionDatos.datos_facturacion,
            "notas_verificacion": verificacionDatos.comentarios_verificacion,
            "Objetivos cumplidos": conclusiones.objetivos_cumplidos,
            "Motivos Desviacion Plan": conclusiones.desviacion_plan,
            "Cumple requisitos": conclusiones.sistema_cumple_norma,
            "metodo_AOL_medio": auditoria.tipo == "A distancia" ? eficacia.medio_utilizado : "",
            "metodo_AOL_efectivo": auditoria.tipo == "A distancia" ? eficacia.medio_efectivo : "",
            "metodo_AOL_INCONV_detalles": auditoria.tipo == "A distancia" ? eficacia.tipos_inconvenientes : "",
            "metodo_AOL_tecnicas": auditoria.tipo == "A distancia" ? eficacia.tecnicas_utilizadas : "",
            "metodo_AIS_tecnicas": auditoria.tipo == "In Situ" ? eficacia.tecnicas_utilizadas : "",
        }
        console.log("Subiendo informe: ", informe);
        informeResponse = await layout.create(informe);
    } catch (error) {
        console.error(`Error al subir informe ${informe}:`, error);
        throw error;
    }
    const informeId = await getInformeId(informeResponse.recordId);
    await subirHallazgos(auditoria, informeId, Number(auditor["ID Auditor"]));
    await subirParticipantes(auditoria, informeId);

}

async function subirHallazgos(auditoria: Auditoria, informeId: string, idAuditor: number): Promise<void> {
    const layout = informesClient.layout('Hallazgos');
    try {
        const hallazgosRaw = hallazgosQueries.getAll.all(auditoria.id);
        const hallazgos: Hallazgo[] = hallazgosRaw.map(
            (row: { clausula_id: string; clausula_label: string; [key: string]: unknown }) => {
                const { clausula_id, clausula_label, ...hallazgo } = row;
                return {
                    ...hallazgo,
                    clausula: {
                        value: clausula_id || '',
                        label: clausula_label || ''
                    }
                };
            }
        );
        for (const [index, hallazgo] of hallazgos.entries()) {
            const hallazgoFM = {
                "Apartado": hallazgo.clausula.value != '0' ? Number(hallazgo.clausula.value) : '',
                "auditor": idAuditor,
                "Descripcion": hallazgo.descripcion,
                "Evidencias": hallazgo.evidencia,
                "IDf auditoria": Number(hallazgo.auditoria_id),
                "IDf Informe": informeId,
                "Magnitud": hallazgo.severidad ? hallazgo.severidad : '',
                "norma": Number(normas.find(norma => norma.nombre === hallazgo.norma)?.id),
                "Orden": index+1,
                "Tipo": hallazgo.tipo,
            }
            console.log("Subiendo hallazgo: ", hallazgoFM)
            await layout.create(hallazgoFM);
        }
    } catch (error) {
        console.error("Error submitting hallazgos:", error);
        throw error;
    }
}

async function subirParticipantes(auditoria: Auditoria, informeId: string) {
    const layout = informesClient.layout('Participantes');
    try {
        const participantes = participantesQueries.getAll.all(auditoria.id);
        for (const participante of participantes) {
            const participanteFM = {
                "Nombre": participante.nombre_completo,
                "Cargo": participante.cargo_rol,
                "Correo": participante.correo_electronico,
                "Final": participante.asistio_reunion_cierre,
                "Inicial": participante.asistio_reunion_inicial,
                "IDf Auditoria": auditoria.id,
                "IDf Informe": informeId,
            }
            console.log("Subiendo participante: ", participanteFM);
            await layout.create(participanteFM);
        }
    } catch (error) {
        console.error("Error al subir participantes:", error);
        throw error;
    }
}

async function getInformeId(recordId: string): Promise<string> {
    const layout = informesClient.layout('Informe');
    let records;
    try {
        records = await layout.get(recordId);
    } catch (e) {
        console.error(e);
        throw new Error(`Error obteniendo el ID de informe de filemaker: ${e}`);
    }
    return records.data[0].fieldData.ClavePrincipal;


}

function sortByDate(audits: ResumenAuditoria[]): ResumenAuditoria[] {
    return audits.sort((a, b) => {
        const dateA = new Date(a.fechaInicio);
        const dateB = new Date(b.fechaInicio);
        return dateA.getTime() - dateB.getTime();
    });
}