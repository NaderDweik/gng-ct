"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AE, AU, BH, CA, DE, EG, FR, GB, IQ, JO, KW, LB, NL, OM, PS, QA, SA, SE, SY, TR, US } from "country-flag-icons/react/3x2";
import { countries, type CountryIso } from "@/content/countries";
import { PHONE_MAX, splitInternational } from "@/features/register/leadRules";

/*
 * Phone number with a country picker (flag + dialling code) at its start. The picker is a
 * listbox under the field; the number stays left to right, in English digits, on Arabic
 * pages too (the client's choice for this field). Pasting a full
 * "+962…" number switches the country and keeps the rest. Styles: styles/sections/register.css.
 */

// Named imports only, so the bundle carries just these flags.
const FLAGS = { AE, AU, BH, CA, DE, EG, FR, GB, IQ, JO, KW, LB, NL, OM, PS, QA, SA, SE, SY, TR, US } satisfies Record<CountryIso, unknown>;

function Flag({ iso }: { iso: CountryIso }) {
  const F = FLAGS[iso];
  return <F className="register-flag" aria-hidden />;
}

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
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const listId = useId();
  const current = countries.find((c) => c.iso === country) ?? countries[0]!;
  const name = (c: (typeof countries)[number]) => (isAr ? c.ar : c.en);

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

  const show = () => {
    setFocus(Math.max(0, countries.findIndex((c) => c.iso === country)));
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
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocus((i) => Math.min(countries.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocus((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(countries[focus]!.iso);
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
        <ul ref={list} id={listId} role="listbox" className="register-cc-list" dir={isAr ? "rtl" : "ltr"} aria-labelledby={`${listId}-label`}>
          {countries.map((c, i) => (
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
      )}

      {error && <em id={errorId} className="register-error">{error}</em>}
    </div>
  );
}
