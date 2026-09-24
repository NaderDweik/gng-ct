import Image from "next/image";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  /** Full-bleed photo behind the title — same treatment as the gallery hero. */
  image?: string;
  /** Keeps the subject in frame when `object-cover` crops. */
  focus?: string;
};

export function PageHero({ title, subtitle, image, focus }: PageHeroProps) {
  if (image) {
    return (
      <section className="gal-hero on-dark">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="gal-hero-img"
          style={focus ? { objectPosition: focus } : undefined}
        />
        <div className="gal-hero-shade" aria-hidden />
        <div className="container-gc relative z-[1] flex min-h-[min(56svh,500px)] flex-col justify-end pb-12 pt-28 md:pb-16 md:pt-32">
          <h1 className="section-title reveal mb-0 max-w-3xl">{title}</h1>
          {subtitle ? (
            <p className="gal-hero-lead reveal max-w-2xl" style={{ animationDelay: "80ms" }}>
              {subtitle}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-line bg-surface-alt pt-24 md:pt-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--brand-accent) 28%, transparent), transparent 42%), radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--brand-primary) 12%, transparent), transparent 40%)",
        }}
      />
      <div className="container-gc relative py-16 md:py-20">
        <h1 className="section-title reveal max-w-3xl">{title}</h1>
        {subtitle ? (
          <p className="section-sub reveal" style={{ animationDelay: "80ms" }}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
