
import DetalleAuditoria from "@/components/auditoria/DetalleAuditoria";
import { getAuditById } from "@/lib/filemaker";

interface AuditDetailPageProps {
  params: Promise<{
    auditId: string;
  }>;
}

export default async function AuditDetailPage({ params }: AuditDetailPageProps) {
  const user = {email: "jorge.achurra@certificacionglobal.com"}
  const audit = await getAuditById((await params).auditId, user.email);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
        {audit ? <DetalleAuditoria key={audit.id} auditoria={audit} /> : "No audit"}
    </div>
  );
}
