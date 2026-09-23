"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { faqCategories } from "@/content/faq";
import { site } from "@/content/site";
import { formatNumber } from "@/lib/format";

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="faq-toggle" data-open={open} aria-hidden>
      <span />
      <span />
    </span>
  );
}

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("962") && d.length === 12
    ? `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`
    : phone;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

export function FaqExplorer() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const tc = useTranslations("common");
  const n = (v: number) => formatNumber(v, locale);
  const pad = (v: number) => n(v).padStart(2, isAr ? "٠" : "0");

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(`${faqCategories[0]?.id}-0`);
  const [active, setActive] = useState(faqCategories[0]?.id ?? "");

  const groups = useMemo(() => {
    const q = normalize(query.trim());
    return faqCategories
      .map((cat) => ({
        ...cat,
        items: cat.items
          .map((item, i) => ({ ...item, key: `${cat.id}-${i}` }))
          .filter((item) => {
            if (!q) return true;
            const hay = normalize(isAr ? `${item.qAr} ${item.aAr}` : `${item.qEn} ${item.aEn}`);
            return hay.includes(q);
          }),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [query, isAr]);

  const total = faqCategories.reduce((sum, c) => sum + c.items.length, 0);
  const shown = groups.reduce((sum, c) => sum + c.items.length, 0);

  useEffect(() => {
    const els = groups
      .map((g) => document.getElementById(`faq-${g.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("faq-", ""));
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  const jump = (id: string) => {
    setActive(id);
    document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
      <aside className="space-y-5 lg:sticky lg:top-28">
        <label className="faq-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAr ? "ابحث في الأسئلة…" : "Search questions…"}
            aria-label={isAr ? "ابحث في الأسئلة" : "Search questions"}
          />
        </label>

        <nav aria-label={isAr ? "أقسام الأسئلة" : "FAQ sections"} className="faq-nav">
          {faqCategories.map((cat) => {
            const count = groups.find((g) => g.id === cat.id)?.items.length ?? 0;
            const disabled = count === 0;
            return (
              <button
                key={cat.id}
                type="button"
                disabled={disabled}
                onClick={() => jump(cat.id)}
                className={`faq-nav-item ${active === cat.id && !disabled ? "is-active" : ""}`}
              >
                <span>{isAr ? cat.titleAr : cat.titleEn}</span>
                <span className="faq-nav-count">{n(count)}</span>
              </button>
            );
          })}
        </nav>

        <div className="faq-help hidden lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            {isAr ? "لم تجد إجابتك؟" : "Didn't find it?"}
          </p>
          <p className="font-display mt-2 text-xl font-bold text-on-dark">
            {isAr ? "تحدّث مع فريق المبيعات." : "Talk to our sales team."}
          </p>
          <p className="mt-2 text-sm text-on-dark-muted">{tc("responseTime")}</p>
          <div className="mt-5 space-y-2">
            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="faq-help-btn faq-help-btn--solid">
              {tc("whatsapp")}
            </a>
            <a href={`tel:${site.phoneAction}`} className="faq-help-btn" dir="ltr">
              {formatPhone(site.phone)}
            </a>
          </div>
        </div>
      </aside>

      <div>
        <p className="mb-6 text-sm text-muted" aria-live="polite">
          {query
            ? isAr
              ? `${n(shown)} نتيجة من أصل ${n(total)} سؤالًا`
              : `${shown} of ${total} questions`
            : isAr
              ? `${n(total)} سؤالًا في ${n(faqCategories.length)} أقسام`
              : `${total} questions across ${faqCategories.length} sections`}
        </p>

        {groups.length === 0 ? (
          <div className="border border-dashed border-line bg-surface p-10 text-center">
            <p className="font-display text-xl font-bold text-ink">
              {isAr ? "لا توجد نتائج." : "No results."}
            </p>
            <p className="mt-2 text-sm text-muted">
              {isAr ? "جرّب كلمة أخرى، أو اسألنا مباشرة عبر واتساب." : "Try another word, or ask us directly on WhatsApp."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setQuery("")} className="btn btn-ghost-dark">
                {isAr ? "مسح البحث" : "Clear search"}
              </button>
              <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {tc("whatsapp")}
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map((cat, ci) => (
              <section key={cat.id} id={`faq-${cat.id}`} className="scroll-mt-28">
                <div className="mb-4 flex items-baseline gap-4">
                  <span className="font-display text-sm font-bold text-accent-ink tabular-nums">{pad(ci + 1)}</span>
                  <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
                    {isAr ? cat.titleAr : cat.titleEn}
                  </h2>
                </div>
                <div className="border-t border-line">
                  {cat.items.map((item, i) => {
                    const isOpen = open === item.key;
                    return (
                      <div key={item.key} className={`faq-row ${isOpen ? "is-open" : ""}`}>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`${item.key}-a`}
                          onClick={() => setOpen(isOpen ? null : item.key)}
                          className="faq-q"
                        >
                          <span className="faq-num">{pad(i + 1)}</span>
                          <span className="flex-1">{isAr ? item.qAr : item.qEn}</span>
                          <PlusMinus open={isOpen} />
                        </button>
                        <div id={`${item.key}-a`} role="region" className="faq-a">
                          <div>
                            <p>{isAr ? item.aAr : item.aEn}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="faq-help mt-14 lg:hidden">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            {isAr ? "لم تجد إجابتك؟" : "Didn't find it?"}
          </p>
          <p className="font-display mt-2 text-xl font-bold text-on-dark">
            {isAr ? "تحدّث مع فريق المبيعات." : "Talk to our sales team."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" className="faq-help-btn faq-help-btn--solid">
              {tc("whatsapp")}
            </a>
            <Link href="/register" className="faq-help-btn">
              {tc("register")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
