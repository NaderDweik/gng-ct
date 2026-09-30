/**
 * Design tokens — the single source of truth for every color on the site.
 *
 * Three layers:
 *   1. `palette` — raw brand + neutral hex values. Re-brand here.
 *   2. `theme`   — semantic roles (surface, ink, line, …). Components only
 *      ever talk to these roles. There is no dark mode: the page is white and
 *      the chrome (header, page headers, footer) uses `secondary`.
 *   3. `src/styles/base/theme.css` — derived mixes (hover, soft tints, on-dark
 *      alphas) + the Tailwind utilities that expose all of the above.
 *
 * Semantic Tailwind utilities — prefer these over raw palette steps:
 *   brand:   bg-{primary|secondary|accent} (fills; put
 *            text-on-primary on bg-primary, never white),
 *            text/border-{primary-ink|secondary-ink|accent-ink} (brand color as
 *            text or lines on light surfaces),
 *            -primary-hover, -primary-soft, -secondary-deep, -secondary-light,
 *            -accent-hover, -accent-soft
 *   themed:  bg-surface / -surface-alt / -surface-tint, text-ink, text-muted,
 *            text-subtle, border-line, border-line-strong
 *   on dark: bg-overlay, bg-dark, text-on-dark / -on-dark-muted /
 *            -on-dark-subtle, border-line-on-dark, bg-fill-on-dark
 *   fixed:   bg-fill-light / -fill-light-hover + text-ink-on-light — white
 *            buttons that sit on dark bands
 *   state:   outline-focus-ring
 *   misc:    bg-whatsapp, shadow-card / shadow-card-lg
 * Raw `neutral-{50…950}` / `white` / `black` exist but are a last resort.
 */

export const palette = {
  /** Giving Spirit green — fills: buttons, active states, bands. Labels on it use `--on-primary`. */
  primary: "#2abba3",
  /** Base dark — footer, deep bands, pricing card, dark-theme page background. */
  secondary: "#181818",
  /** Supporting green — eyebrows on dark, chips, progress bars, highlight details. */
  accent: "#05ab7d",
  /** Deeper supporting greens — brand text on light fills (≥4.5:1 on white) and dark detail. */
  primaryDeep: "#018860",
  primaryDarkest: "#035f46",

  /** Base of all dark overlays / image scrims. */
  overlay: "#181818",

  white: "#ffffff",
  black: "#000000",

  /** Neutral ramp — light-theme backgrounds, borders, body text. */
  neutral: {
    50: "#f7f7f7",
    100: "#f2f4f3",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#181818",
    950: "#0f0f0f",
  },

  // Light/dark mode disabled. Dark-theme surfaces, built up from `secondary`:
  // night: {
  //   surface: "#181818",
  //   surfaceAlt: "#1e1e1e",
  //   surfaceTint: "#252525",
  //   line: "#2e2e2e",
  //   lineStrong: "#3b3b3b",
  //   ink: "#ffffff",
  //   muted: "#b3b3b3",
  //   subtle: "#8f8f8f",
  //   primaryInk: "#2abba3",
  //   secondaryInk: "#e6e6e6",
  // },

  /** Day / Night sky switch (home "A day at Giving City"). Illustrative, fixed. */
  sky: {
    day: "#7cc8f2",
    dayDeep: "#3f97d6",
    night: "#1d2b57",
    nightDeep: "#0b1330",
    sun: "#ffd23f",
    sunEdge: "#f5a623",
    moon: "#eef1f6",
    crater: "#c9ced9",
  },

  /** Third-party brand colors that must not follow the theme. */
  whatsapp: "#25d366",

  /** Official logo-mark artwork (GivingLogo, map pin). Fixed — does not follow the theme. */
  logo: {
    deep: "#035f46",
    mid: "#018860",
    light: "#05ab7d",
    teal: "#2abba3",
  },
} as const;

type SemanticTheme = {
  surface: string;
  surfaceAlt: string;
  surfaceTint: string;
  ink: string;
  muted: string;
  subtle: string;
  line: string;
  lineStrong: string;
  primaryInk: string;
  secondaryInk: string;
  accentInk: string;
  shadowColor: string;
};

/**
 * Semantic roles. One theme only: white page, with the dark brand color on the
 * chrome (header, page headers, footer). Values are CSS expressions over the palette vars.
 */
export const theme: SemanticTheme = {
  surface: "var(--white)",
  surfaceAlt: "var(--neutral-50)",
  surfaceTint: "var(--neutral-100)",
  ink: "var(--neutral-900)",
  muted: "var(--neutral-600)",
  subtle: "var(--neutral-500)",
  line: "var(--neutral-200)",
  lineStrong: "var(--neutral-300)",
  /* #2abba3 is 2.4:1 on white — brand text on light surfaces uses the deeper greens. */
  primaryInk: "var(--brand-primary-deep)",
  secondaryInk: "var(--brand-secondary)",
  accentInk: "var(--brand-primary-darkest)",
  shadowColor: "var(--brand-secondary)",
};

type Neutral = keyof typeof palette.neutral;

const neutralVars = (Object.keys(palette.neutral) as unknown as Neutral[])
  .map((k) => `--neutral-${k}: ${palette.neutral[k]};`)
  .join("\n  ");

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function semanticVars(t: SemanticTheme): string {
  return Object.entries(t)
    .map(([k, v]) => `--${kebab(k)}: ${v};`)
    .join("\n  ");
}

/** Palette + semantic roles as CSS, injected into <head> by the locale layout. */
export const themeCss = `:root {
  color-scheme: light;
  --brand-primary: ${palette.primary};
  --brand-secondary: ${palette.secondary};
  --brand-accent: ${palette.accent};
  --brand-primary-deep: ${palette.primaryDeep};
  --brand-primary-darkest: ${palette.primaryDarkest};
  --overlay: ${palette.overlay};
  --white: ${palette.white};
  --black: ${palette.black};
  --whatsapp: ${palette.whatsapp};
  ${Object.entries(palette.sky).map(([k, v]) => `--sky-${kebab(k)}: ${v};`).join("\n  ")}
  ${neutralVars}
  ${semanticVars(theme)}
}`;

/*
 * ── Light/dark mode (disabled) ──────────────────────────────────────────────
 * To restore: uncomment `night` in the palette and the block below, change
 * `themeCss` to emit `theme` under `:root, [data-theme="light"]` and `themeDark`
 * under `[data-theme="dark"]` + `@media (prefers-color-scheme: dark)
 * :root:not([data-theme="light"])`, then uncomment useTheme.ts, ThemeToggle.tsx,
 * the theme-switch.css import, the init script in the locale layout, the toggle
 * in Header and the tile swap in LocationLeafletMap.
 *
 * export type ThemeName = "light" | "dark";
 *
 * export const themeDark: SemanticTheme = {
 *   surface: palette.night.surface,
 *   surfaceAlt: palette.night.surfaceAlt,
 *   surfaceTint: palette.night.surfaceTint,
 *   ink: palette.night.ink,
 *   muted: palette.night.muted,
 *   subtle: palette.night.subtle,
 *   line: palette.night.line,
 *   lineStrong: palette.night.lineStrong,
 *   primaryInk: palette.night.primaryInk,
 *   secondaryInk: palette.night.secondaryInk,
 *   accentInk: "var(--brand-accent)",
 *   shadowColor: "var(--black)",
 * };
 *
 * // localStorage key holding an explicit user choice ("light" | "dark").
 * export const THEME_STORAGE_KEY = "gc-theme";
 *
 * // Runs in <head> before first paint: stored choice, else OS preference.
 * export const themeInitScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t);d.style.colorScheme=t}catch(e){}})();`;
 */
