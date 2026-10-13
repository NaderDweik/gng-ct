"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { GivingLogo } from "@/components/brand/GivingLogo";
import { SocialIcon } from "@/components/ui/SocialIcon";

type FooterLink = { href: string; labelAr: string; labelEn: string };

const siteMap: FooterLink[] = [
  { href: "/about", labelAr: "عن المشروع", labelEn: "About the Project" },
  { href: "/compound", labelAr: "الكمباوند", labelEn: "Compound" },
  { href: "/chalet", labelAr: "الشاليه", labelEn: "Chalet" },
  { href: "/amenities", labelAr: "مرافق المشروع", labelEn: "Amenities & Lifestyle" },
  { href: "/services", labelAr: "خدماتنا", labelEn: "Our Services" },
  { href: "/financing", labelAr: "حلول التمويل", labelEn: "Financing Solutions" },
  { href: "/gallery", labelAr: "معرض الصور", labelEn: "Gallery" },
];

const quickLinks: FooterLink[] = [
  { href: "/location", labelAr: "الموقع الجغرافي", labelEn: "Location" },
  { href: "/news", labelAr: "الأخبار والمقالات", labelEn: "Insights & News" },
  { href: "/faq", labelAr: "الأسئلة الشائعة", labelEn: "FAQs" },
  { href: "/leadership", labelAr: "الإدارة", labelEn: "Leadership" },
  { href: "/register", labelAr: "سجل اهتمامك", labelEn: "Register Interest" },
  { href: "/privacy", labelAr: "سياسة الخصوصية", labelEn: "Privacy Policy" },
  { href: "/terms", labelAr: "شروط الاستخدام", labelEn: "Terms of Use" },
  { href: "/cookies", labelAr: "سياسة ملفات تعريف الارتباط", labelEn: "Cookie Policy" },
];

function FooterColumn({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 pt-2 md:col-span-1 md:pt-0" : undefined}>
      {/* Phones: a proper section heading (larger, a short green rule under it). */}
      <h2 className="font-display mb-4 text-lg font-bold text-on-dark after:mx-auto after:mt-2.5 after:block after:h-0.5 after:w-8 after:bg-primary after:content-[''] md:mb-3 md:text-base md:after:hidden lg:mb-8">
        {title}
      </h2>
      {children}
    </div>
  );
}

function LinkList({ items, isAr }: { items: FooterLink[]; isAr: boolean }) {
  return (
    <ul className="text-sm lg:space-y-4">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="inline-block py-2 md:py-2.5 text-on-dark-muted transition-all lg:py-0 duration-300 hover:text-on-dark ltr:hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
          >
            {isAr ? item.labelAr : item.labelEn}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("962") && d.length === 12
    ? `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`
    : phone;
}

export function Footer() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const year = new Date().getFullYear();

  const socials = [
    { name: "instagram" as const, href: site.social.instagram, label: "Instagram" },
    { name: "facebook" as const, href: site.social.facebook, label: "Facebook" },
    { name: "whatsapp" as const, href: site.whatsappUrl, label: "WhatsApp" },
  ];

  return (
    <footer className="cv-defer cv-defer--footer relative overflow-hidden border-t border-line-on-dark bg-secondary pb-12 pt-16 text-on-dark md:pt-24">
      <div className="container-gc relative z-10">
        {/* Phones: everything centred; from md up, aligned to the start as before. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 border-b border-line-on-dark pb-11 text-center md:gap-12 md:pb-20 md:text-start lg:grid-cols-4">
          <div className="col-span-2 space-y-6 pb-4 md:col-span-1 md:pb-0">
            <Link href="/" className="mx-auto block w-fit transition-transform duration-100 active:scale-[0.98] md:mx-0" aria-label={site.nameEn}>
              <GivingLogo variant="light" className="h-16 w-auto md:h-20" />
            </Link>
            <p className="text-sm leading-relaxed text-on-dark-muted">
              {isAr
                ? "أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة. شاليهات خاصة بسند ملكية مستقل، داخل مجتمع مسوّر وبتمويل مباشر بدون فوائد."
                : "The region’s first and largest fully-serviced chalet city. Private resorts with independent deeds, inside a gated community with zero-interest direct financing."}
            </p>
            <div className="flex justify-center gap-4 md:justify-start">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-fill-on-dark text-on-dark-muted shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:text-on-dark active:scale-95"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn wide title={isAr ? "خريطة الموقع" : "Navigation"}>
            <LinkList items={siteMap} isAr={isAr} />
          </FooterColumn>

          <FooterColumn wide title={isAr ? "روابط سريعة" : "Quick Links"}>
            <LinkList items={quickLinks} isAr={isAr} />
          </FooterColumn>

          <FooterColumn wide title={isAr ? "مكتب المبيعات" : "Sales Office"}>
            <address className="space-y-4 text-sm not-italic text-on-dark-muted">
              <p>{isAr ? site.salesOfficeAr : site.salesOfficeEn}</p>
              {/* Phones: number and WhatsApp on one line, a small rule between them, each with
                  its icon; from md up, stacked text links as before. */}
              <div className="flex items-center justify-center gap-3.5 pt-2 md:block lg:space-y-2">
                <a
                  href={`tel:${site.phoneAction}`}
                  aria-label={`${isAr ? "اتصل بنا" : "Call us"} ${formatPhone(site.phone)}`}
                  className="flex w-fit items-center gap-1.5 py-2 font-bold text-on-dark transition-colors hover:text-on-dark-muted md:block lg:py-0"
                >
                  <svg className="h-3.5 w-3.5 shrink-0 text-primary md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
                  </svg>
                  <span dir="ltr">{formatPhone(site.phone)}</span>
                </a>
                <span className="h-4 w-px bg-white/25 md:hidden" aria-hidden />
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-1.5 py-2 font-bold text-on-dark transition-colors hover:text-on-dark-muted md:block lg:py-0"
                >
                  <svg className="h-3.5 w-3.5 shrink-0 text-whatsapp md:hidden" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .15 5.35.15 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.3-1.65a11.86 11.86 0 0 0 5.75 1.45h.01c6.55 0 11.9-5.35 11.9-11.9 0-3.18-1.24-6.17-3.46-8.4ZM12.05 21.75h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.74.98 1-3.64-.24-.37a9.84 9.84 0 0 1-1.5-5.24c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.96 2.88a9.8 9.8 0 0 1 2.88 6.97c0 5.43-4.42 9.85-9.85 9.85Zm5.72-7.37c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.51-1.55-.93-.83-1.55-1.85-1.73-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.44.2 1.98.12.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.12-.29-.2-.6-.36Z" />
                  </svg>
                  <span className="md:hidden">{isAr ? "واتساب" : "WhatsApp"}</span>
                  <span className="hidden md:inline">{isAr ? "تواصل عبر واتساب" : "Chat on WhatsApp"}</span>
                </a>
              </div>
            </address>
          </FooterColumn>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 pt-10 text-xs text-on-dark-muted md:flex-row">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-start">
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
              <p>
                © {year} {isAr ? site.nameAr : site.nameEn}.{" "}
                {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
              </p>
              <span className="hidden select-none text-line-on-dark md:inline">|</span>
              <span className="rounded border border-white/20 bg-fill-on-dark px-2 py-0.5 text-(length:--fs-caption) text-on-dark">
                {site.iso}
              </span>
            </div>
            <p className="max-w-xl leading-relaxed">
              {isAr ? site.companyAr : site.companyEn}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={isAr ? "الرجوع لأعلى الصفحة" : "Back to top"}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 text-on-dark-muted transition-all duration-300 hover:bg-white/20 hover:text-on-dark active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
