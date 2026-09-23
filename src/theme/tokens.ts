/**
 * Design tokens — the single source of truth for every color on the site.
 *
 * Three layers:
 *   1. `palette` — raw brand + neutral hex values. Re-brand here.
 *   2. `themes`  — semantic roles (surface, ink, line, …) for `light` and
 *      `dark`. Components only ever talk to these roles, so they theme for free.
 *   3. `src/styles/base/theme.css` — derived mixes (hover, soft tints, on-dark
 *      alphas) + the Tailwind utilities that expose all of the above.
 *
 * Semantic Tailwind utilities — prefer these over raw palette steps:
 *   brand:   bg-{primary|secondary|accent} (fills — same in both themes),
 *            text/border-{primary-ink|secondary-ink|accent-ink} (brand color as
 *            text or lines on themed surfaces — lightens in dark),
 *            -primary-hover, -primary-soft, -secondary-deep, -secondary-light,
 *            -accent-hover, -accent-soft
 *   themed:  bg-surface / -surface-alt / -surface-tint, text-ink, text-muted,
 *            text-subtle, border-line, border-line-strong
 *   on dark: bg-overlay, bg-dark, text-on-dark / -on-dark-muted /
 *            -on-dark-subtle, border-line-on-dark, bg-fill-on-dark
 *   fixed:   bg-fill-light / -fill-light-hover + text-ink-on-light — white
 *            buttons that sit on dark bands and stay white in both themes
 *   state:   outline-focus-ring
 *   misc:    bg-whatsapp, shadow-card / shadow-card-lg
 * Raw `neutral-{50…950}` / `white` / `black` exist but are a last resort.
 */

export const palette = {
  /** Main brand color — buttons, links, headings accents, active states. */
  primary: "#425563",
  /** Second brand color — deep surfaces: footer, page bands, pricing card. */
  secondary: "#2f3d48",
  /** Highlight color — eyebrows on dark, chips, progress bars, gold details. */
  accent: "#d6c3a3",

  /** Base of all dark overlays / image scrims. */
  overlay: "#12181e",

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
    900: "#171717",
    950: "#0a0a0a",
  },

  /** Slate-tinted night ramp (from `overlay`) — dark-theme surfaces and text. */
  night: {
    surface: "#0f1418",
    surfaceAlt: "#141a1f",
    surfaceTint: "#192026",
    line: "#29333b",
    lineStrong: "#36424c",
    ink: "#e9edf0",
    muted: "#a8b3bc",
    subtle: "#86929c",
    /** `primary` / `secondary` lifted for text on night surfaces (≥7:1). */
    primaryInk: "#9eb4c5",
    secondaryInk: "#c3cfd8",
  },

  /** Third-party brand colors that must not follow the theme. */
  whatsapp: "#25d366",

  /** Official logo-mark artwork (GivingLogo, map pin). Fixed — does not follow the theme. */
  logo: {
    deep: "#076533",
    mid: "#058945",
    light: "#40B97E",
    teal: "#25BDAD",
  },
} as const;

export type ThemeName = "light" | "dark";

type SemanticTheme = {
  colorScheme: ThemeName;
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

/** Semantic roles per theme. Values are CSS expressions over the raw palette vars. */
export const themes: Record<ThemeName, SemanticTheme> = {
  light: {
    colorScheme: "light",
    surface: "var(--white)",
    surfaceAlt: "var(--neutral-50)",
    surfaceTint: "var(--neutral-100)",
    ink: "var(--neutral-900)",
    muted: "var(--neutral-600)",
    subtle: "var(--neutral-500)",
    line: "var(--neutral-200)",
    lineStrong: "var(--neutral-300)",
    primaryInk: "var(--brand-primary)",
    secondaryInk: "var(--brand-secondary)",
    /* Gold dark enough for text on light surfaces (≥4.5:1 on white). */
    accentInk: "color-mix(in srgb, var(--brand-accent) 58%, var(--black))",
    shadowColor: "var(--brand-primary)",
  },
  dark: {
    colorScheme: "dark",
    surface: palette.night.surface,
    surfaceAlt: palette.night.surfaceAlt,
    surfaceTint: palette.night.surfaceTint,
    ink: palette.night.ink,
    muted: palette.night.muted,
    subtle: palette.night.subtle,
    line: palette.night.line,
    lineStrong: palette.night.lineStrong,
    primaryInk: palette.night.primaryInk,
    secondaryInk: palette.night.secondaryInk,
    accentInk: "var(--brand-accent)",
    shadowColor: "var(--black)",
  },
};

/** localStorage key holding an explicit user choice ("light" | "dark"). */
export const THEME_STORAGE_KEY = "gc-theme";

type Neutral = keyof typeof palette.neutral;

const neutralVars = (Object.keys(palette.neutral) as unknown as Neutral[])
  .map((k) => `--neutral-${k}: ${palette.neutral[k]};`)
  .join("\n  ");

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function semanticVars(t: SemanticTheme): string {
  return Object.entries(t)
    .map(([k, v]) => (k === "colorScheme" ? `color-scheme: ${v};` : `--${kebab(k)}: ${v};`))
    .join("\n  ");
}

/**
 * Palette + both themes as CSS, injected into <head> by the locale layout.
 * `data-theme` on <html> (set pre-paint by `themeInitScript`) wins; without JS
 * the OS preference is used.
 */
export const themeCss = `:root {
  --brand-primary: ${palette.primary};
  --brand-secondary: ${palette.secondary};
  --brand-accent: ${palette.accent};
  --overlay: ${palette.overlay};
  --white: ${palette.white};
  --black: ${palette.black};
  --whatsapp: ${palette.whatsapp};
  ${neutralVars}
}
:root, [data-theme="light"] {
  ${semanticVars(themes.light)}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
  ${semanticVars(themes.dark)}
  }
}
[data-theme="dark"] {
  ${semanticVars(themes.dark)}
}`;

/**
 * Runs in <head> before first paint: stored choice → else OS preference.
 * Prevents a light flash for dark-theme visitors.
 */
export const themeInitScript = `(function(){try{var d=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t);d.style.colorScheme=t}catch(e){}})();`;
