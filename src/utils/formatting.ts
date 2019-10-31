// formatBytes(12345, 2) => "12,34 kb"
function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const result = "" + parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    return result.replace(".", ",");
}

// Eksempel: formatCurrency(12345) => 12.345
function formatCurrency(amount: number, decimals: number = 0): string {
    return new Intl.NumberFormat('de-DE').format(amount);
}

export { formatBytes, formatCurrency };

