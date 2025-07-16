"use client";

import { useState } from "react";
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
        return "📄";
      case "image":
        return "🖼️";
      case "evidence":
        return "📋";
      case "report":
        return "📊";
      default:
        return "📁";
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
    { id: "all", label: "Todos los archivos", icon: "📁" },
    { id: "document", label: "Documentos", icon: "📄" },
    { id: "evidence", label: "Evidencias", icon: "📋" },
    { id: "image", label: "Imágenes", icon: "🖼️" },
    { id: "report", label: "Reportes", icon: "📊" },
  ];

  return (
    <div className={styles["files-section"]}>
      <div className={styles["section-header"]}>
        <h2 className={styles["section-title"]}>Archivos de la Auditoría</h2>
        <button className={styles["upload-button"]}>📤 Subir Archivo</button>
      </div>

      <div className={styles["filters"]}>
        <div className={styles["category-filters"]}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles["filter-button"]} ${selectedCategory === category.id ? styles["filter-active"] : ""}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className={styles["filter-icon"]}>{category.icon}</span>
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
            <div className={styles["empty-icon"]}>📁</div>
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
                    {getFileIcon(file.type)}
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
