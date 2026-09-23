import { setRequestLocale } from "next-intl/server";
import { UnitsPlans } from "@/features/units/UnitsPlans";
import { unitsCopy } from "@/content/units";
import type { LocalePageProps } from "@/i18n/types";

type Props = LocalePageProps;

export default async function UnitsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const copy = isAr ? unitsCopy.ar : unitsCopy.en;

  return (
    <>
      {/* JG-style slate title band */}
      <section className="relative overflow-hidden border-b border-secondary-light bg-secondary pt-32 pb-6 md:pt-44 md:pb-8 xl:pt-[11.5rem] xl:pb-10">
        <div className="mx-auto w-[min(92rem,calc(100%-3rem))] px-6 text-center">
          <span className="mb-3 block text-[10px] font-bold tracking-[0.24em] text-on-dark-muted uppercase">
            {copy.eyebrow}
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-on-dark md:text-6xl">
            {copy.title}
          </h1>
        </div>
      </section>

      <UnitsPlans />
    </>
  );
}
