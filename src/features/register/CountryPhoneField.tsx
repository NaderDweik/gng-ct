"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { countries, otherCountries, pinnedCountries, type Country, type CountryIso } from "@/content/countries";
import { toLatinDigits } from "@/features/register/leadRules";
import { PHONE_MAX, splitInternational } from "@/features/register/leadRules";

/*
 * Phone number with a country picker (flag + dialling code) at its start. The picker is a
 * listbox under the field; the number stays left to right, in English digits, on Arabic
 * pages too (the client's choice for this field). Pasting a full
 * "+962…" number switches the country and keeps the rest. Styles: styles/sections/register.css.
 * Every country is listed: the pinned ones first, then the rest alphabetically. A search box
 * on top of the list filters by name (Arabic or English), code ("+44", "44") or ISO letters.
 */

/** Flags are static files (public/flags), so only the ones in view are loaded. */
function Flag({ iso }: { iso: CountryIso }) {
  // eslint-disable-next-line @next/next/no-img-element -- tiny SVG, no optimisation needed
  return <img src={`/flags/${iso}.svg`} alt="" className="register-flag" loading="lazy" aria-hidden />;
}

/** Lower case, Latin digits, no Arabic diacritics or hamza variants, for matching. */
const fold = (v: string) =>
  toLatinDigits(v)
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function CountryPhoneField({
  label,
  country,
  phone,
  isAr,
  error,
  errorId,
  onCountry,
  onPhone,
}: {
  label: string;
  country: CountryIso;
  phone: string;
  isAr: boolean;
  error?: string;
  errorId?: string;
  onCountry: (iso: CountryIso) => void;
  onPhone: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(0);
  const [query, setQuery] = useState("");
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const listId = useId();
  const current = countries.find((c) => c.iso === country) ?? countries[0]!;
  const name = (c: Country) => (isAr ? c.ar : c.en);

  // Pinned first, then the rest by name in the page's language; filtered by the search.
  const shown = useMemo(() => {
    const rest = [...otherCountries].sort((a, b) => name(a).localeCompare(name(b), isAr ? "ar" : "en"));
    const all = [...pinnedCountries, ...rest];
    const q = fold(query.trim()).replace(/^\+|^00/, "");
    if (!q) return all;
    return all.filter((c) => fold(`${c.ar} ${c.en}`).includes(q) || c.dial.startsWith(q) || c.iso.toLowerCase() === q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isAr]);

  // Close on a tap outside.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (open) list.current?.children[focus]?.scrollIntoView({ block: "nearest" });
  }, [open, focus]);

  // The search box takes the typing as soon as the list opens.
  useEffect(() => {
    if (open) search.current?.focus({ preventScroll: true });
  }, [open]);

  const show = () => {
    setQuery("");
    const all = [...pinnedCountries, ...[...otherCountries].sort((a, b) => name(a).localeCompare(name(b), isAr ? "ar" : "en"))];
    setFocus(Math.max(0, all.findIndex((c) => c.iso === country)));
    setOpen(true);
  };

  const pick = (iso: CountryIso) => {
    onCountry(iso);
    setOpen(false);
    wrap.current?.querySelector<HTMLInputElement>('input[name="phone"]')?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      wrap.current?.querySelector<HTMLButtonElement>(".register-cc")?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocus((i) => Math.min(shown.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocus((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (shown[focus]) pick(shown[focus]!.iso);
    }
  };

  return (
    <div className="register-field block" ref={wrap}>
      <span id={`${listId}-label`}>{label}</span>
      <div className="register-phone" dir="ltr" aria-invalid={!!error}>
        <button
          type="button"
          role="combobox"
          className="register-cc"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`${isAr ? "رمز الدولة" : "Country code"}: ${name(current)} +${current.dial}`}
          aria-activedescendant={open ? `${listId}-${focus}` : undefined}
          onClick={() => (open ? setOpen(false) : show())}
          onKeyDown={onKey}
        >
          <Flag iso={current.iso} />
          <span className="register-cc-dial">+{current.dial}</span>
          <svg className="register-cc-chev" viewBox="0 0 12 12" aria-hidden>
            <path d="M3 4.5 6 7.5 9 4.5" />
          </svg>
        </button>
        <input
          required
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          maxLength={PHONE_MAX}
          placeholder={current.iso === "JO" ? "79 123 4567" : ""}
          value={phone}
          aria-labelledby={`${listId}-label`}
          aria-invalid={!!error}
          aria-describedby={errorId}
          onChange={(e) => {
            const split = splitInternational(e.target.value, country);
            if (split) {
              onCountry(split.country);
              onPhone(split.rest);
            } else onPhone(e.target.value);
          }}
        />
      </div>

      {open && (
        <div className="register-cc-pop" dir={isAr ? "rtl" : "ltr"}>
          <div className="register-cc-search">
            <svg viewBox="0 0 24 24" aria-hidden>
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              ref={search}
              type="search"
              value={query}
              placeholder={isAr ? "ابحث عن دولة أو رمز" : "Search a country or code"}
              aria-label={isAr ? "ابحث عن دولة" : "Search countries"}
              aria-controls={listId}
              aria-activedescendant={shown[focus] ? `${listId}-${focus}` : undefined}
              autoComplete="off"
              enterKeyHint="done"
              onChange={(e) => {
                setQuery(e.target.value);
                setFocus(0);
              }}
              onKeyDown={onKey}
            />
          </div>
        <ul ref={list} id={listId} role="listbox" className="register-cc-list" aria-labelledby={`${listId}-label`}>
          {shown.length === 0 && <li className="register-cc-empty">{isAr ? "لا توجد نتائج" : "No matches"}</li>}
          {shown.map((c, i) => (
            <li
              key={c.iso}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={c.iso === country}
              className={`register-cc-opt${i === focus ? " is-focus" : ""}`}
              onPointerEnter={() => setFocus(i)}
              onClick={() => pick(c.iso)}
            >
              <Flag iso={c.iso} />
              <span className="register-cc-name">{name(c)}</span>
              <span className="register-cc-code" dir="ltr">+{c.dial}</span>
            </li>
          ))}
        </ul>
        </div>
      )}

      {error && <em id={errorId} className="register-error">{error}</em>}
    </div>
  );
}
