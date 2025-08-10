export const getSeverityColor = (severity: string) => {
    switch (severity) {
        case "mayor":
            return "#f39c12";
        case "menor":
            return "#f1c40f";
        default:
            return "#95a5a6";
    }
};

export const getTypeText = (type: string | null) => {
    switch (type) {
        case "OB":
            return "Observación";
        case "NC":
            return "No conformidad";
        case "OM":
            return "Oportunidad de mejora";
        case "PF":
            return "Punto fuerte";
        default:
            return "Desconocido";
    }
};