export const koboToNaira = (kobo) => Math.round(kobo) / 100;
export const nairaToKobo = (naira) => Math.round(naira * 100);
export function formatNaira(kobo) {
    return `₦${koboToNaira(kobo).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
}
//# sourceMappingURL=money.js.map