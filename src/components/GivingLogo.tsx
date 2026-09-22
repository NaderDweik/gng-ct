import Image from "next/image";

type GivingLogoProps = {
  /** `light` = white mark on dark UI. `dark` = black mark on light UI. */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Official Giving Spirit Development logos (PNG).
 */
export function GivingLogo({ variant = "light", className }: GivingLogoProps) {
  const src = variant === "dark" ? "/logo-on-light.png" : "/logo-on-dark.png";

  return (
    <Image
      src={src}
      alt="Giving Spirit Development"
      width={272}
      height={94}
      className={className}
      priority
    />
  );
}
