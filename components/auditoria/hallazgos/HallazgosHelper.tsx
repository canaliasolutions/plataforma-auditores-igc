export const getSeverityColor = (severity: string) => {
    switch (severity) {
        case "Mayor":
            return "#f39c12";
        case "Menor":
            return "#f1c40f";
        default:
            return "#95a5a6";
    }
};