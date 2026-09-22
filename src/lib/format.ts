/** Map next-intl locale codes to BCP-47 tags safe for Intl / toLocaleString. */
export function localeTag(locale: string): string {
  return locale === "ar" ? "ar-JO" : "en-US";
}

export function formatNumber(value: number, locale: string): string {
  return value.toLocaleString(localeTag(locale));
}
