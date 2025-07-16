"use client";

import { AuditDetail } from "@/components/audit-detail";

interface AuditDetailPageProps {
  params: {
    auditId: string;
  };
}

export default function AuditDetailPage({ params }: AuditDetailPageProps) {
  return <AuditDetail auditId={params.auditId} />;
}
