"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav } from "@/content/nav";
import { site } from "@/content/site";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAr = locale === "ar";

  return (
    <header className="sticky top-0 z-50 border-b border-sand-deep/60 bg-cream/90 backdrop-blur-md">
      <div className="container-gc flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-wide text-navy md:text-xl">
            {isAr ? site.nameAr : site.nameEn}
          </span>
          <span className="text-[0.7rem] text-muted transition group-hover:text-terracotta">
            {isAr ? site.nameEn : site.nameAr}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.slice(0, 8).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-2.5 py-1.5 text-sm transition ${
                  active
                    ? "bg-sand text-navy font-semibold"
                    : "text-muted hover:text-navy"
                }`}
              >
                {isAr ? item.labelAr : item.labelEn}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={pathname}
            locale={isAr ? "en" : "ar"}
            className="hidden rounded border border-sand-deep px-2.5 py-1 text-xs font-semibold text-navy sm:inline-flex"
          >
            {isAr ? "EN" : "عربي"}
          </Link>
          <Link href="/register" className="btn btn-primary !py-2 !px-3 text-sm">
            {t("register")}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-sand-deep text-navy lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-sand-deep bg-cream lg:hidden">
          <div className="container-gc flex max-h-[70vh] flex-col gap-1 overflow-y-auto py-3">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded px-3 py-2 text-navy hover:bg-sand"
              >
                {isAr ? item.labelAr : item.labelEn}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={isAr ? "en" : "ar"}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2 text-sm font-semibold text-terracotta"
            >
              {isAr ? "English" : "العربية"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
