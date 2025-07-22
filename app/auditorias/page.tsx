
import { AuditCard } from "@/components/auditorias/audit-card";
import AssignmentIcon from "@mui/icons-material/Assignment";
import styles from "@/components/auditorias/Dashboard.module.css";
import {getAudits} from "@/lib/filemaker";



export default async function AuditoriasPage() {
    const audits = await getAudits("jorge.achurra@certificacionglobal.com");

  return (
      <div>
        <main>
          <div className={styles.dashboard}>
            <div className={styles["dashboard-header"]}>
              <h1 className={styles["dashboard-title"]}>Lista de auditorías</h1>
              <p className={styles["dashboard-subtitle"]}>
                Gestiona y supervisa todas tus auditorías programadas
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
