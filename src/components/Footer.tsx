"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { footerNav } from "@/content/nav";
import { site } from "@/content/site";
import { GivingLogo } from "@/components/GivingLogo";

export function Footer() {
  const t = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <footer className="border-t border-white/10 bg-dark text-neutral-300">
      <div className="container-gc grid gap-12 py-16 md:grid-cols-3">
        <div>
          <GivingLogo variant="light" className="h-14 w-auto max-w-[240px] object-contain object-left" />
          <p className="mt-5 text-sm leading-relaxed text-neutral-400">
            {isAr ? site.companyAr : site.companyEn}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            {isAr ? site.taglineAr : site.taglineEn}
          </p>
          <p className="mt-4 text-xs tracking-[0.18em] uppercase text-accent">
            {site.iso}
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold tracking-[0.2em] uppercase text-accent">
            {isAr ? "تنقل" : "Navigation"}
          </p>
          <ul className="space-y-2.5 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white transition">
                  {isAr ? item.labelAr : item.labelEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold tracking-[0.2em] uppercase text-accent">
            {isAr ? "تواصل" : "Office"}
          </p>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li>
              <a href={`tel:${site.phoneAction}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {t("whatsapp")}
              </a>
            </li>
            <li>{isAr ? site.hoursAr.weekdays : site.hoursEn.weekdays}</li>
            <li>{isAr ? site.hoursAr.saturday : site.hoursEn.saturday}</li>
            <li className="pt-2">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="me-4 hover:text-white"
              >
                Instagram
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {isAr ? site.companyAr : site.companyEn}
      </div>
    </footer>
  );
}
