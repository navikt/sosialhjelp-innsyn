// formatBytes(12345, 2) => "12,34 kb"
function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return "0 bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const result = "" + parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    return result.replace(".", ",");
}

// Eksempel: formatCurrency(12345) => 12.345
function formatCurrency(amount: number, language: string): string {
    return new Intl.NumberFormat(language).format(amount);
}

// Eksempel: "2019-08-01" => "01. august 2019"
function formatDato(isoDate: string, language: string) {
    const dato: Date = new Date(isoDate);
    const formatter = new Intl.DateTimeFormat(language, {day: "numeric", month: "long", year: "numeric"});
    return formatter.format(dato).replace(/([0-9]) /, "$1. ");
}
// Eksempel "2022-04-11" => "11. april"
export function getDayAndMonth(isoDate: string, language: string) {
    const dato: Date = new Date(isoDate);
    const formatter = new Intl.DateTimeFormat(language, {day: "numeric", month: "long"});
    return formatter.format(dato).replace(/([0-9]) /, "$1. ");
}

export function dateToDDMMYYYY(language: string, dato: Date) {
    return new Intl.DateTimeFormat(language, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(dato);
}

export {formatBytes, formatCurrency, formatDato};
