type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-sand-deep bg-[linear-gradient(135deg,var(--sand)_0%,var(--cream)_45%,color-mix(in_srgb,var(--olive)_12%,white)_100%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--gold) 25%, transparent), transparent 40%), radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--terracotta) 18%, transparent), transparent 35%)",
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
