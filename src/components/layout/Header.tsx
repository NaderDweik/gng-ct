"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { site } from "@/content/site";
import { GivingLogo } from "@/components/brand/GivingLogo";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
// Light/dark mode disabled: import { ThemeToggle } from "@/components/ui/ThemeToggle";

const primaryNav = [
  { href: "/about", labelAr: "من نحن", labelEn: "About" },
  { href: "/gallery", labelAr: "المعرض", labelEn: "Gallery" },
  { href: "/units", labelAr: "الوحدات المتاحة", labelEn: "Units" },
  { href: "/master-plan", labelAr: "المخطط العام", labelEn: "Master Plan" },
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
  // Every page opens on a dark band (home hero or SubpageHeader) except these light-topped ones,
  // which need the solid bar from the start.
  const lightTop = pathname.startsWith("/news/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Full-screen mobile menu: lock page scroll behind it, close on Escape and on navigation.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  // Over a hero photo the bar starts transparent; once solid it is the dark brand band.
  // Text is light in both states.
  const solid = scrolled || lightTop || open;

  return (
    <header
      /* Pages opened from the header always start at the top (components/layout/ScrollMemory). */
      data-scroll-fresh
      className={`fixed inset-x-0 top-0 transition-all duration-300 ${open ? "z-[60]" : "z-50"} ${
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

        <nav className="ms-auto me-4 hidden items-center gap-7 min-[1100px]:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative py-1 text-[15px] font-medium transition ${
                  active ? "text-on-dark" : "text-on-dark-muted hover:text-on-dark"
                }`}
              >
                {isAr ? item.labelAr : item.labelEn}
                <span
                  className={`absolute bottom-0 inset-x-0 h-[1.5px] rounded-full bg-primary transition-transform duration-300 origin-center ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
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
            href="/register"
            className={`nav-cta relative hidden isolate overflow-hidden px-5 py-2.5 text-sm font-semibold tracking-[0.18em] uppercase transition min-[1100px]:inline-flex ${
              solid
                ? "nav-cta--solid border border-white/30 bg-primary/75 text-on-dark backdrop-blur-sm hover:bg-primary/90"
                : "nav-glass text-on-dark"
            }`}
          >
            {t("register")}
          </Link>
          <LocaleSwitch className={`lang-square${solid ? "" : " nav-glass"}`}>
            {(target) => (
              <>
                <span className="sr-only">{target === "ar" ? "العربية" : "English"}</span>
                <span aria-hidden className={target === "ar" ? "lang-square-ar" : undefined}>
                  {target === "ar" ? "ع" : "EN"}
                </span>
              </>
            )}
          </LocaleSwitch>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/30 text-on-dark min-[1100px]:hidden"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile menu: slides in from the burger's side and covers the whole screen. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-0 z-10 flex h-dvh flex-col bg-secondary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-[1100px]:hidden ${
          open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="container-gc flex h-16 shrink-0 items-center justify-end md:h-20">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-white/30 text-on-dark"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-2 overflow-y-auto px-6 text-center">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`font-display py-2 text-2xl font-semibold transition ${
                  active ? "text-on-dark" : "text-on-dark-muted hover:text-on-dark"
                }`}
              >
                {isAr ? item.labelAr : item.labelEn}
              </Link>
            );
          })}
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-6 min-w-[200px]"
          >
            {t("register")}
          </Link>
          <LocaleSwitch
            onSwitch={() => setOpen(false)}
            className="mt-2 px-1 py-2 text-sm font-semibold text-on-dark-subtle hover:text-on-dark"
          >
            {(target) => (target === "en" ? "English" : "العربية")}
          </LocaleSwitch>
        </nav>

        <div className="flex shrink-0 justify-center pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
          <GivingLogo variant="light" className="h-12 w-auto max-w-[180px]" />
        </div>
      </div>
    </header>
  );
}
