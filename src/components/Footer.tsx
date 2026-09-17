"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { footerNav } from "@/content/nav";
import { site } from "@/content/site";

export function Footer() {
  const t = useTranslations("common");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <footer className="border-t border-sand-deep bg-navy text-sand">
      <div className="container-gc grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="text-2xl font-bold text-cream">
            {isAr ? site.nameAr : site.nameEn}
          </p>
          <p className="mt-2 text-sm text-sand-deep">
            {isAr ? site.companyAr : site.companyEn}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-sand-deep">
            {isAr ? site.taglineAr : site.taglineEn}
          </p>
          <p className="mt-3 text-xs text-gold">{site.iso}</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-gold">
            {isAr ? "روابط" : "Links"}
          </p>
          <ul className="space-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-cream">
                  {isAr ? item.labelAr : item.labelEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-gold">
            {isAr ? "تواصل" : "Contact"}
          </p>
          <ul className="space-y-2 text-sm text-sand-deep">
            <li>
              <a href={`tel:${site.phone}`} className="hover:text-cream">
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream"
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
                className="me-3 hover:text-cream"
              >
                Instagram
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-sand-deep">
        © {new Date().getFullYear()} {isAr ? site.companyAr : site.companyEn}
      </div>
    </footer>
  );
}
