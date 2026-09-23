/**
 * Design tokens — the single source of truth for every color on the site.
 *
 * To re-brand, change the values in `palette` below. Everything else
 * (hover states, tints, overlays, shadows, Tailwind utilities, the map route)
 * is derived from these at runtime via CSS custom properties.
 *
 * Tailwind utilities available from these tokens:
 *   bg/text/border-{primary|secondary|accent}, -{primary-hover|primary-soft|
 *   secondary-deep|accent-hover|accent-soft}, bg-surface, bg-surface-alt,
 *   bg-surface-tint, text-ink, text-muted, border-line, bg-overlay, bg-dark,
 *   bg-whatsapp, neutral-{50…950}, shadow-card / shadow-card-lg.
 * `brand` is kept as an alias of `primary` (e.g. `bg-brand`).
 */

export const palette = {
  /** Main brand color — buttons, links, headings accents, active states. */
  primary: "#425563",
  /** Second brand color — deep surfaces: footer, page bands, pricing card. */
  secondary: "#465461",
  /** Highlight color — eyebrows on dark, chips, progress bars, gold details. */
  accent: "#d6c3a3",

  /** Base of all dark overlays / image scrims. */
  overlay: "#12181e",

  white: "#ffffff",
  black: "#000000",

  /** Neutral ramp — backgrounds, borders, body text. */
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

type Neutral = keyof typeof palette.neutral;

const neutralVars = (Object.keys(palette.neutral) as unknown as Neutral[])
  .map((k) => `--neutral-${k}: ${palette.neutral[k]};`)
  .join("\n  ");

/** Raw palette as CSS custom properties, injected into <head> by the root layout. */
export const themeCss = `:root {
  --brand-primary: ${palette.primary};
  --brand-secondary: ${palette.secondary};
  --brand-accent: ${palette.accent};
  --overlay: ${palette.overlay};
  --white: ${palette.white};
  --black: ${palette.black};
  --whatsapp: ${palette.whatsapp};
  ${neutralVars}
}`;
