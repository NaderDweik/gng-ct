type GivingLogoProps = {
  /** `light` = white wordmark (dark backgrounds). `dark` = black wordmark (light backgrounds). */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Official Giving Spirit Development mark (user-traced SVG).
 */
export function GivingLogo({ variant = "light", className }: GivingLogoProps) {
  const src = variant === "dark" ? "/logo-dark.svg" : "/logo.svg";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Giving Spirit Development"
      className={className}
      width={700}
      height={340}
      decoding="async"
    />
  );
}
