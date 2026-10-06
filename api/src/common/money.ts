export const koboToNaira = (kobo: number) => Math.round(kobo) / 100;
export const nairaToKobo = (naira: number) => Math.round(naira * 100);

export function formatNaira(kobo: number): string {
  return `₦${koboToNaira(kobo).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
}
