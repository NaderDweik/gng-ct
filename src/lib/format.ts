/** Map next-intl locale codes to BCP-47 tags safe for Intl / toLocaleString. */
export function localeTag(locale: string): string {
  return locale === "ar" ? "ar-JO-u-nu-latn" : "en-US";
}

export function formatNumber(value: number, locale: string): string {
  return value.toLocaleString(localeTag(locale));
}

/** For display: a mobile "+962790029928" → "+962 79 002 9928", a landline "+96262220757" → "+962 6 222 0757". */
export function displayPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("962") && d.length === 12) return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  if (d.startsWith("962") && d.length === 11) return `+${d.slice(0, 3)} ${d.slice(3, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  return phone;
}
