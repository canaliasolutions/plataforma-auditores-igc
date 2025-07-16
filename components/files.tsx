"use client";

import { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "./Files.module.css";

interface AuditFile {
  id: string;
  name: string;
  type: "document" | "image" | "evidence" | "report";
  size: string;
  uploadDate: string;
  uploadedBy: string;
  description?: string;
}

interface FilesProps {
  auditId: string;
}

export function Files({ auditId }: FilesProps) {
  const [files, setFiles] = useState<AuditFile[]>([
    {
      id: "1",
      name: "Plan_de_Auditoria_ISO27001.pdf",
      type: "document",
      size: "2.5 MB",
      uploadDate: "2024-12-15",
      uploadedBy: "María González",
      description: "Plan detallado de la auditoría ISO 27001",
    },
    {
      id: "2",
      name: "Evidencia_Politicas_Seguridad.docx",
      type: "evidence",
      size: "1.8 MB",
      uploadDate: "2024-12-16",
      uploadedBy: "Carlos Rodríguez",
      description: "Documentación de políticas de seguridad existentes",
    },
    {
      id: "3",
      name: "Fotografias_Sala_Servidores.zip",
      type: "image",
      size: "15.2 MB",
      uploadDate: "2024-12-17",
      uploadedBy: "María González",
      description: "Fotografías de la sala de servidores y controles físicos",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return DescriptionIcon;
      case "image":
        return ImageIcon;
      case "evidence":
        return AssignmentIcon;
      case "report":
        return BarChartIcon;
      default:
        return FolderIcon;
    }
  };

  const getFileTypeText = (type: string) => {
    switch (type) {
      case "document":
        return "Documento";
      case "image":
        return "Imagen";
      case "evidence":
        return "Evidencia";
      case "report":
        return "Reporte";
      default:
        return "Archivo";
    }
  };

  const filteredFiles =
    selectedCategory === "all"
      ? files
      : files.filter((file) => file.type === selectedCategory);

  const handleDownload = (file: AuditFile) => {
    // TODO: Implement actual file download
    console.log("Downloading file:", file.name);
    // For demo purposes, we'll just show an alert
    alert(`Descargando: ${file.name}`);
  };

  const categories = [
    { id: "all", label: "Todos los archivos", icon: FolderIcon },
    { id: "document", label: "Documentos", icon: DescriptionIcon },
    { id: "evidence", label: "Evidencias", icon: AssignmentIcon },
    { id: "image", label: "Imágenes", icon: ImageIcon },
    { id: "report", label: "Reportes", icon: BarChartIcon },
  ];

  return (
    <div className={styles["files-section"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Archivos de la Auditoría</h2>
        <button className={styles["upload-button"]}>
          <UploadIcon sx={{ fontSize: 16, marginRight: 1 }} />
          Subir Archivo
        </button>
      </div>

      <div className={styles["filters"]}>
        <div className={styles["category-filters"]}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles["filter-button"]} ${selectedCategory === category.id ? styles["filter-active"] : ""}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon
                className={styles["filter-icon"]}
                sx={{ fontSize: 16 }}
              />
              <span className={styles["filter-label"]}>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles["files-stats"]}>
        <div className={styles["stat-item"]}>
          <span className={styles["stat-number"]}>{files.length}</span>
          <span className={styles["stat-label"]}>Total de archivos</span>
        </div>
        <div className={styles["stat-item"]}>
          <span className={styles["stat-number"]}>
            {files
              .reduce((acc, file) => acc + parseFloat(file.size), 0)
              .toFixed(1)}{" "}
            MB
          </span>
          <span className={styles["stat-label"]}>Tamaño total</span>
        </div>
      </div>

      <div className={styles["files-list"]}>
        {filteredFiles.length === 0 ? (
          <div className={styles["empty-state"]}>
            <FolderIcon
              className={styles["empty-icon"]}
              sx={{ fontSize: 64 }}
            />
            <h3 className={styles["empty-title"]}>No hay archivos</h3>
            <p className={styles["empty-description"]}>
              {selectedCategory === "all"
                ? "No se han subido archivos para esta auditoría."
                : `No hay archivos de tipo ${getFileTypeText(selectedCategory).toLowerCase()}.`}
            </p>
          </div>
        ) : (
          <div className={styles["files-grid"]}>
            {filteredFiles.map((file) => (
              <div key={file.id} className={styles["file-card"]}>
                <div className={styles["file-header"]}>
                  <div className={styles["file-icon"]}>
                    {(() => {
                      const IconComponent = getFileIcon(file.type);
                      return <IconComponent sx={{ fontSize: 32 }} />;
                    })()}
                  </div>
                  <div className={styles["file-actions"]}>
                    <button
                      onClick={() => handleDownload(file)}
                      className={styles["download-button"]}
                      title="Descargar archivo"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>

                <div className={styles["file-info"]}>
                  <h3 className={styles["file-name"]}>{file.name}</h3>
                  {file.description && (
                    <p className={styles["file-description"]}>
                      {file.description}
                    </p>
                  )}

                  <div className={styles["file-meta"]}>
                    <div className={styles["meta-row"]}>
                      <span className={styles["meta-label"]}>Tipo:</span>
                      <span className={styles["meta-value"]}>
                        {getFileTypeText(file.type)}
                      </span>
                    </div>
                    <div className={styles["meta-row"]}>
                      <span className={styles["meta-label"]}>Tamaño:</span>
                      <span className={styles["meta-value"]}>{file.size}</span>
                    </div>
                    <div className={styles["meta-row"]}>
                      <span className={styles["meta-label"]}>Subido:</span>
                      <span className={styles["meta-value"]}>
                        {new Date(file.uploadDate).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                    <div className={styles["meta-row"]}>
                      <span className={styles["meta-label"]}>Por:</span>
                      <span className={styles["meta-value"]}>
                        {file.uploadedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
