"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { site } from "@/content/site";
import { GivingLogo } from "@/components/GivingLogo";

const primaryNav = [
  { href: "/about", labelAr: "من نحن", labelEn: "About" },
  { href: "/gallery", labelAr: "المعرض", labelEn: "Gallery" },
  { href: "/units", labelAr: "الوحدات المتاحة", labelEn: "Units" },
  { href: "/amenities", labelAr: "المرافق", labelEn: "Amenities" },
  { href: "/financing", labelAr: "التمويل", labelEn: "Financing" },
] as const;

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAr = locale === "ar";
  const isHome =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/register" ||
    pathname === "/gallery";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome || open;
  const ink = solid ? "text-brand" : "text-white";
  const muted = solid ? "text-muted" : "text-white/80";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-line bg-white/95 backdrop-blur-md shadow-header"
          : "bg-transparent"
      }`}
    >
      <div className="container-gc flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="group flex shrink-0 items-center" aria-label={site.nameEn}>
          <GivingLogo
            variant={solid ? "dark" : "light"}
            className="h-10 w-auto max-w-[160px] object-contain object-left md:h-12 md:max-w-[200px]"
          />
        </Link>

        <nav className="hidden items-center gap-7 min-[1100px]:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative py-1 text-sm font-medium transition ${
                  active ? ink : muted
                } hover:opacity-100`}
              >
                {isAr ? item.labelAr : item.labelEn}
                <span
                  className={`absolute bottom-0 inset-x-0 h-[1.5px] rounded-full transition-transform duration-300 origin-center ${
                    solid ? "bg-brand" : "bg-white"
                  } ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={pathname}
            locale={isAr ? "en" : "ar"}
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition sm:text-xs ${
              solid
                ? "bg-surface-alt text-brand"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isAr ? "EN" : "عربي"}
          </Link>
          <Link
            href="/register"
            className={`relative hidden isolate overflow-hidden px-5 py-2.5 text-sm font-semibold tracking-[0.18em] uppercase transition min-[1100px]:inline-flex ${
              solid
                ? "border border-brand/25 bg-brand text-white hover:bg-brand/90"
                : "border border-white/25 bg-transparent text-white hover:bg-white/10"
            }`}
          >
            {t("register")}
          </Link>
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center border min-[1100px]:hidden ${
              solid ? "border-line text-brand" : "border-white/30 text-white"
            }`}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white min-[1100px]:hidden">
          <div className="container-gc flex max-h-[70vh] flex-col gap-1 overflow-y-auto py-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-1 py-2.5 text-brand hover:text-accent-hover"
              >
                {isAr ? item.labelAr : item.labelEn}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2"
            >
              {t("register")}
            </Link>
            <Link
              href={pathname}
              locale={isAr ? "en" : "ar"}
              onClick={() => setOpen(false)}
              className="px-1 py-2 text-sm font-semibold text-muted"
            >
              {isAr ? "English" : "العربية"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
