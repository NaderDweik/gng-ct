"use client";

import { useEffect, useId, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { applyTheme, hasStoredTheme, switchTheme, useTheme } from "@/theme/useTheme";

type Props = { className?: string };

/**
 * Sun ⇄ moon toggle. The icon state is driven by `[data-theme]` in CSS (see
 * `styles/base/theme-switch.css`), so it is correct on first paint — no
 * hydration flicker — and morphs when the theme changes.
 */
export function ThemeToggle({ className = "" }: Props) {
  const t = useTranslations("common");
  const theme = useTheme();
  const maskId = `theme-toggle-mask-${useId().replace(/:/g, "")}`;
  const isDark = theme === "dark";

  // Follow the OS setting live until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!hasStoredTheme()) applyTheme(mq.matches ? "dark" : "light", { persist: false });
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    switchTheme(isDark ? "light" : "dark", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isDark ? t("themeToLight") : t("themeToDark")}
      title={isDark ? t("themeToLight") : t("themeToDark")}
      className={`theme-toggle ${className}`}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="theme-toggle-icon">
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle className="theme-toggle-bite" cx="17" cy="7" r="6" fill="black" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <circle className="theme-toggle-core" cx="12" cy="12" r="5" fill="currentColor" />
        </g>
        <g className="theme-toggle-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="1.5" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6" y2="6" />
          <line x1="18" y1="18" x2="19.4" y2="19.4" />
          <line x1="4.6" y1="19.4" x2="6" y2="18" />
          <line x1="18" y1="6" x2="19.4" y2="4.6" />
        </g>
      </svg>
    </button>
  );
}
