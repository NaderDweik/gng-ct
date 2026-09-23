"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { GivingLogo } from "@/components/GivingLogo";

type FooterLink = { href: string; labelAr: string; labelEn: string };

const siteMap: FooterLink[] = [
  { href: "/about", labelAr: "عن المشروع", labelEn: "About the Project" },
  { href: "/units", labelAr: "الوحدات المتاحة", labelEn: "Available Units" },
  { href: "/master-plan", labelAr: "المخطط العام", labelEn: "Master Plan" },
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
];

function SocialIcon({ name }: { name: "instagram" | "facebook" | "whatsapp" }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 8 19.5z" />
      <path d="M9 10c.5 2 2 3.5 4 4l1.2-1.2 2 .8-.4 1.8c-3.6.4-7.8-3.8-7.4-7.4l1.8-.4.8 2z" />
    </svg>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="font-display mb-8 text-base font-bold text-white">{title}</h4>
      {children}
    </div>
  );
}

function LinkList({ items, isAr }: { items: FooterLink[]; isAr: boolean }) {
  return (
    <ul className="space-y-4 text-sm">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="inline-block text-white/80 transition-all duration-300 hover:text-white ltr:hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
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
    <footer className="relative overflow-hidden border-t border-white/10 bg-secondary pb-12 pt-24 text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[250px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[100px]" />

      <div className="container-gc relative z-10">
        <div className="grid gap-12 border-b border-white/10 pb-20 text-start md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="block w-fit transition-transform duration-100 active:scale-[0.98]" aria-label={site.nameEn}>
              <GivingLogo variant="light" className="h-20 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              {isAr
                ? "أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة — منتجعات خاصة بسند ملكية مستقل، داخل مجتمع مسوّر وبتمويل مباشر بدون فوائد."
                : "The region’s first and largest fully-serviced chalet city — private resorts with independent deeds, inside a gated community with zero-interest direct financing."}
            </p>
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:text-white active:scale-95"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title={isAr ? "خريطة الموقع" : "Navigation"}>
            <LinkList items={siteMap} isAr={isAr} />
          </FooterColumn>

          <FooterColumn title={isAr ? "روابط سريعة" : "Quick Links"}>
            <LinkList items={quickLinks} isAr={isAr} />
          </FooterColumn>

          <FooterColumn title={isAr ? "مكتب المبيعات" : "Sales Office"}>
            <address className="space-y-4 text-sm not-italic text-white/70">
              <p>{isAr ? site.locationAr : site.locationEn}</p>
              <p>
                {isAr ? site.hoursAr.weekdays : site.hoursEn.weekdays}
                <br />
                {isAr ? site.hoursAr.saturday : site.hoursEn.saturday}
              </p>
              <div className="space-y-2 pt-2">
                <a
                  href={`tel:${site.phoneAction}`}
                  dir="ltr"
                  className="block w-fit font-bold text-white transition-colors hover:text-white/80"
                >
                  {formatPhone(site.phone)}
                </a>
                <a
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-fit font-bold text-white transition-colors hover:text-white/80"
                >
                  {isAr ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
                </a>
              </div>
            </address>
          </FooterColumn>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 pt-10 text-xs text-white/70 md:flex-row">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-start">
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
              <p>
                © {year} {isAr ? site.nameAr : site.nameEn}.{" "}
                {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
              </p>
              <span className="hidden select-none text-white/10 md:inline">|</span>
              <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-white">
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
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:bg-white/20 hover:text-white active:scale-95"
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
