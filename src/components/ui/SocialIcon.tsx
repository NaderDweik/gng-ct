/** Instagram / Facebook / WhatsApp line icons (footer links, About social cards). */
export type SocialName = "instagram" | "facebook" | "whatsapp";

export function SocialIcon({ name, size = 18, className }: { name: SocialName; size?: number; className?: string }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 8 19.5z" />
      <path d="M9 10c.5 2 2 3.5 4 4l1.2-1.2 2 .8-.4 1.8c-3.6.4-7.8-3.8-7.4-7.4l1.8-.4.8 2z" />
    </svg>
  );
}
