const DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

/** Renders Western digits in a string as Eastern Arabic numerals. */
export function toEasternArabicNumerals(value: string | number): string {
  return String(value).replace(/\d/g, (d) => DIGITS[Number(d)] ?? d);
}
