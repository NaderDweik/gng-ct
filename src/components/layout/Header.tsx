"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { site } from "@/content/site";
import { GivingLogo } from "@/components/brand/GivingLogo";
// Light/dark mode disabled: import { ThemeToggle } from "@/components/ui/ThemeToggle";

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

  // Over a hero photo the bar starts transparent; once solid it is the dark brand band.
  // Text is light in both states.
  const solid = scrolled || !isHome || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-line-on-dark bg-secondary shadow-header"
          : "bg-transparent"
      }`}
    >
      <div className="container-gc flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="group flex shrink-0 items-center" aria-label={site.nameEn}>
          <GivingLogo
            variant="light"
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
                  active ? "text-on-dark" : "text-on-dark-muted hover:text-on-dark"
                }`}
              >
                {isAr ? item.labelAr : item.labelEn}
                <span
                  className={`absolute bottom-0 inset-x-0 h-[1.5px] rounded-full transition-transform duration-300 origin-center ${
                    solid ? "bg-primary" : "bg-on-dark"
                  } ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light/dark mode disabled:
          <ThemeToggle className="bg-fill-on-dark text-on-dark hover:bg-white/20" />
          */}
          <Link
            href={pathname}
            locale={isAr ? "en" : "ar"}
            className="rounded-full bg-fill-on-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-dark transition hover:bg-white/20 sm:text-xs"
          >
            {isAr ? "EN" : "عربي"}
          </Link>
          <Link
            href="/register"
            className={`relative hidden isolate overflow-hidden px-5 py-2.5 text-sm font-semibold tracking-[0.18em] uppercase transition min-[1100px]:inline-flex ${
              solid
                ? "border border-primary/25 bg-primary text-on-primary hover:bg-primary-hover"
                : "border border-white/25 bg-transparent text-on-dark hover:bg-fill-on-dark"
            }`}
          >
            {t("register")}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/30 text-on-dark min-[1100px]:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-xl">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line-on-dark bg-secondary min-[1100px]:hidden">
          <div className="container-gc flex max-h-[70vh] flex-col gap-1 overflow-y-auto py-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-1 py-2.5 text-on-dark-muted hover:text-on-dark"
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
              className="px-1 py-2 text-sm font-semibold text-on-dark-subtle hover:text-on-dark"
            >
              {isAr ? "English" : "العربية"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
