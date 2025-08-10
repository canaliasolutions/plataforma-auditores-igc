
import DetalleAuditoria from "@/components/auditoria/DetalleAuditoria";
import { getAuditById } from "@/lib/filemaker";

interface AuditDetailPageProps {
  params: Promise<{
    auditId: string;
  }>;
}

export default async function AuditDetailPage({ params }: AuditDetailPageProps) {
  const user = {email: "jorge.achurra@certificacionglobal.com"}
  let audit;
  try {
    audit = await getAuditById((await params).auditId, user.email);
  } catch {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "20px" }}>
        <h1>Error al cargar la auditoría. Por favor, recarga la pagina</h1>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
        {audit ? <DetalleAuditoria key={audit.id} auditoria={audit} /> : "No audit"}
    </div>
  );
}
