import {Client} from 'fm-data-api-client';
import {Audit, AuditCardType, Hallazgo} from "@/types/audit";
import {fakeAudits} from "@/lib/fake-data";

// const revisionesClient = new Client(process.env.FM_HOST,  process.env.FM_REVISIONES_DB, process.env.FM_USERNAME, process.env.FM_PWD);
const informesClient = new Client(process.env.FM_HOST, process.env.FM_INFORMES_DB, process.env.FM_USERNAME, process.env.FM_PWD);

export async function getAudits(auditorEmail: string): Promise<AuditCardType[]> {
    let audits: Audit[] = [];
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
    const auditsRawData = records.data.map(item => item.fieldData);
    auditsRawData.forEach((auditRawItem, index) => {
        const audit = {};
        audit['id'] = auditRawItem['ID Auditoria'];
        audit['startDate'] = auditRawItem['Fecha Inicio Auditoria'];
        audit['endDate'] = auditRawItem['Fecha Fin Auditoria'];
        audit['client'] = {
            name: auditRawItem['Clientes 2::clienteNombre'],
            logo: undefined
        };
        audit['standard'] = auditRawItem['Norma2'];
        audit['stage'] = auditRawItem['Etapa'];
        audits.push(audit);
    });
    audits = sortByDate(audits);
    return audits;
}

export async function getAuditById(auditId: string, auditorEmail: string): Promise<Audit | null> {
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
        startDate: "1/11/2025",
        endDate: "2/11/2025",
        client: {
          name: "test",
          logo: undefined
        },
        standard: "iso 123",
        stage: "renovacion",
        scope: "alcance test",
        location: "ubicacion test",
        type: "in situ",
        auditor: "test auditor",
        }
    }
    if (records.data.length === 0) {
        return null;
    }
    const auditRawItem = records.data[0].fieldData;
    return {
        id: auditId,
        startDate: auditRawItem['Fecha Inicio Auditoria'],
        endDate: auditRawItem['Fecha Fin Auditoria'],
        client: {
            name: auditRawItem['Clientes 2::clienteNombre'],
            logo: undefined
        },
        standard: auditRawItem['Norma2'],
        stage: auditRawItem['Etapa'],
        scope: auditRawItem['Expedientes 2::Alcance'],
        location: auditRawItem['Centros_auditados_CPDs_Sitios'],
        type: auditRawItem['Tipo'],
        auditor: auditRawItem['Auditor_Jefe'],
    };
}

function submitInforme(informe: Informe) {

}

async function submitHallazho(hallazgos: Hallazgo[]): Promise<void> {
    const layout = informesClient.layout('Hallazgos');
    try {
        for (const hallazgo of hallazgos) {
            await layout.create({
                "auditoria_id": hallazgo.auditoria_id,
                "evidencia": hallazgo.evidencia,
                "descripcion": hallazgo.descripcion,
                "clausula": hallazgo.clausula,
                "type": hallazgo.type,
                "severidad": hallazgo.severidad,
                "fecha_encontrado": hallazgo.fecha_encontrado,
                "fecha_resuelto": hallazgo.fecha_resuelto || null
            });
        }
    } catch (error) {
        console.error("Error submitting hallazgos:", error);
        throw error;
    }
}

function sortByDate(audits: Audit[]): Audit[] {
    return audits.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
    });
}