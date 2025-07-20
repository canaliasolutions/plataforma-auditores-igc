export interface AuditCardType {
    id: number;
    client: {
        name: string;
        logo?: string;
    };
    standard: string;
    startDate: string;
    endDate: string;
    stage: string;
}

export interface Audit {
    id: string;
    client: {
        name: string;
        logo?: string;
    };
    standard: string;
    startDate: string;
    endDate: string;
    stage: string;
    location: string;
    scope: string;
    auditor: string;
    type: string;
}