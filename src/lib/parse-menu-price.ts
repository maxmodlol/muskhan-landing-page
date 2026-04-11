/**
 * Extracts a numeric amount from menu price labels like "85 ₪", "195 شيكل", or "١٩٠ ₪".
 */
const EASTERN_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function normalizeToWesternDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (ch) => {
    const i = EASTERN_DIGITS.indexOf(ch);
    return i >= 0 ? String(i) : ch;
  });
}

export function parseMenuPriceToNumber(raw: string): number {
  if (!raw || typeof raw !== "string") return 0;
  const normalized = normalizeToWesternDigits(raw.trim());
  const match = normalized.match(/\d+(?:[.,]\d+)?/);
  if (!match) return 0;
  const n = parseFloat(match[0].replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
