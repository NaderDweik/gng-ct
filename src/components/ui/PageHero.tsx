type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
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
