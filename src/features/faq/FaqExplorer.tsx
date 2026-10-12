"use client";

import { StickyBar, StickyPills } from "@/components/ui/StickyBar";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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
  const pad = (v: number) => n(v).padStart(isAr ? 0 : 2, "0");

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

  /** While a tapped section scrolls into view, the scroll-spy stays quiet (the pill glides
      straight to the tapped chip instead of chasing every section passed on the way). */
  const jumping = useRef<number | undefined>(undefined);

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
        if (visible[0] && jumping.current === undefined) setActive(visible[0].target.id.replace("faq-", ""));
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  // Phones: one green pill glides (and resizes) to the active section chip (faq.css).
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const el = nav.querySelector<HTMLElement>(".faq-nav-item.is-active");
      setPill(el ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [active, groups]);

  // Phones: the chips are one sideways row (faq.css); keep the active one in view,
  // centred, as the questions scroll by. (Desktop's column never scrolls sideways.)
  useEffect(() => {
    const nav = navRef.current;
    const el = nav?.querySelector<HTMLElement>(".faq-nav-item.is-active");
    if (!nav || !el || nav.scrollWidth <= nav.clientWidth) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    nav.scrollTo({ left: el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2, behavior: still ? "auto" : "smooth" });
  }, [active]);

  const jump = (id: string) => {
    setActive(id);
    window.clearTimeout(jumping.current);
    jumping.current = window.setTimeout(() => {
      jumping.current = undefined;
    }, 1200);
    // Land the section under the fixed header, and under the compact bar on phones.
    const el = document.getElementById(`faq-${id}`);
    if (!el) return;
    const phone = matchMedia("(max-width: 767px)").matches;
    const header = document.querySelector<HTMLElement>("header")?.offsetHeight ?? 64;
    const bar = document.querySelector<HTMLElement>(".sticky-bar")?.offsetHeight ?? 0;
    // Desktop keeps its 7rem gap (the section's scroll-mt-28).
    const offset = phone ? header + bar + 12 : parseFloat(getComputedStyle(el).scrollMarginTop) || 112;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Phones: once the search and section chips scroll away, a compact bar with both slides
  // in under the header (components/ui/StickyBar).
  const asideRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchField = (
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
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
      <aside ref={asideRef} className="space-y-5 lg:sticky lg:top-28">
        <StickyBar anchor={asideRef} until={listRef} label={isAr ? "البحث والأقسام" : "Search and sections"}>
          {searchField}
          <StickyPills
            active={active}
            onPick={jump}
            items={faqCategories.map((cat) => {
              const count = groups.find((g) => g.id === cat.id)?.items.length ?? 0;
              return { id: cat.id, label: isAr ? cat.titleAr : cat.titleEn, count: n(count), disabled: count === 0 };
            })}
          />
        </StickyBar>
        {searchField}

        <nav ref={navRef} aria-label={isAr ? "أقسام الأسئلة" : "FAQ sections"} className="faq-nav">
          {pill && (
            <span
              className="faq-nav-pill"
              style={{ "--x": `${pill.x}px`, "--y": `${pill.y}px`, width: pill.w, height: pill.h } as CSSProperties}
              aria-hidden
            />
          )}
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
          <p className="text-(length:--fs-caption) font-bold uppercase tracking-[0.2em] text-accent">
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

      <div ref={listRef}>
        <p className="mb-6 text-sm text-muted max-md:text-center" aria-live="polite">
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
                  <h2 className="font-display text-(length:--fs-h3) font-bold text-ink">
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

        <div className="faq-help faq-help--end mt-14 lg:hidden">
          <p className="text-(length:--fs-caption) font-bold uppercase tracking-[0.2em] text-accent">
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
