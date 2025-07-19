
import { Navbar } from "@/components/navbar";
import { AuditDetail } from "@/components/audit-detail";
import { placeholderAccount } from "@/lib/auth-server"
import { getAuditById } from "@/lib/filemaker";

interface AuditDetailPageProps {
  params: {
    auditId: string;
  };
}

export default async function AuditDetailPage({ params }: AuditDetailPageProps) {
  const user = {email: "jorge.achurra@certificacionglobal.com"}
  const audit = await getAuditById(params.auditId, user.email);

  // const isAuthenticated = useIsAuthenticated();
  // const { accounts } = useMsal();
  // const [account, setAccount] = useState<AccountInfo | null>(null);
  //
  // useEffect(() => {
  //   if (isAuthenticated && accounts.length > 0) {
  //     setAccount(accounts[0]);
  //   }
  // }, [isAuthenticated, accounts]);
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <Navbar account={placeholderAccount} activeTab="auditorias" />
        {audit ? <AuditDetail audit={audit} /> : "No audit"}
    </div>
  );
}
