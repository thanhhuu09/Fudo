// /lib/formatNumber.ts
export function formatNumber(
  value: number,
  locales: string = "en-US",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locales, options).format(value);
}
