/** Map next-intl locale codes to BCP-47 tags safe for Intl / toLocaleString. */
export function localeTag(locale: string): string {
  return locale === "ar" ? "ar-JO" : "en-US";
}

export function formatNumber(value: number, locale: string): string {
  return value.toLocaleString(localeTag(locale));
}

/** "+962790029928" → "+962 79 002 9928" for display. */
export function displayPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("962") && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return phone;
}
