
import {Navbar} from "@/components/navbar";
import { AuditCard } from "@/components/audit-card";
import { placeholderAccount } from "@/lib/auth-server"
import AssignmentIcon from "@mui/icons-material/Assignment";
import styles from "@/components/Dashboard.module.css";
import {getAudits} from "@/lib/filemaker";



export default async function AuditoriasPage() {
    const audits = await getAudits("jorge.achurra@certificacionglobal.com");
  //const { accounts } = useMsal();
  //const router = useRouter();

  // useEffect(() => {
  //   // If user is not authenticated, redirect to login
  //   if (accounts.length === 0) {
  //     router.push("/login");
  //   }
  // }, [accounts, router]);

  // Don't render dashboard if not authenticated
  // if (accounts.length === 0) {
  //   return (
  //     <div className="loading-container">
  //       <div className="loading-spinner">Redirecting to login...</div>
  //     </div>
  //   );
  // }


  return (
      <div>
          <Navbar
              account={placeholderAccount}
          />
        <main>
          <div className={styles.dashboard}>
            <div className={styles["dashboard-header"]}>
              <h1 className={styles["dashboard-title"]}>Lista de auditorías</h1>
              <p className={styles["dashboard-subtitle"]}>
                Gestiona y supervisa todas las auditorías programadas
              </p>
            </div>

            <div className={styles["dashboard-content"]}>
              {audits.length === 0 ? (
                  <div className={styles["empty-state"]}>
                    <AssignmentIcon
                        className={styles["empty-icon"]}
                        sx={{fontSize: 64}}
                    />
                    <h3 className={styles["empty-title"]}>
                      No se encontraron auditorías
                    </h3>
                    <p className={styles["empty-description"]}>
                      No hay auditorías programadas
                    </p>
                  </div>
              ) : (
                  <div className={styles["audit-grid"]}>
                    {audits.map((audit) => (
                        <AuditCard
                            key={audit.id}
                            audit={audit}
                        />
                    ))}
                  </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
}
