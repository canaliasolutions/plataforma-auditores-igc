import {Client} from 'fm-data-api-client';
import {Audit, AuditCard, cardAudit} from "@/types/audit";
import {fakeAudits} from "@/lib/fake-data";

// const revisionesClient = new Client(process.env.FM_HOST,  process.env.FM_REVISIONES_DB, process.env.FM_USERNAME, process.env.FM_PWD);
const informesClient = new Client(process.env.FM_HOST, process.env.FM_INFORMES_DB, process.env.FM_USERNAME, process.env.FM_PWD);

export async function getAudits(auditorEmail: string): Promise<AuditCard[]> {
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
    console.info('Fetched audits: ', audits);
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
        throw new Error("Error en el servidor al tratar de obtener auditoría");
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

function sortByDate(audits: Audit[]): Audit[] {
    return audits.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
    });
}