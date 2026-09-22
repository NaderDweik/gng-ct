"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { FaqItem } from "@/content/faq";

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="relative h-[18px] w-[18px] shrink-0" aria-hidden>
      <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-brand" />
      <span
        className={`absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-brand transition-all duration-300 ${
          open ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"
        }`}
      />
    </span>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

type Props = {
  items: FaqItem[];
};

export function HomeFaqPreview({ items }: Props) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [open, setOpen] = useState(0);

  return (
    <div className="mb-10 grid items-start gap-9 lg:mb-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-[clamp(40px,6vw,92px)]">
      {/* Intro — sticky on desktop; sits after accordion in DOM for LTR visual order via order */}
      <div className="text-start lg:sticky lg:top-[104px] lg:order-2">
        <p className="section-eyebrow mb-4">
          {isAr ? "الأسئلة الشائعة" : "FAQ"}
        </p>
        <h2 className="section-title mb-4">
          {isAr ? "معلوماتٌ مفيدة." : "Good to know."}
        </h2>
        <p className="max-w-[34ch] text-base font-light leading-relaxed text-neutral-600 md:text-lg">
          {isAr
            ? "إجابات عن أكثر الأسئلة التي نسمعها حول الحياة في Giving City."
            : "Answers to the questions we hear most about life at Giving City."}
        </p>
        <Link
          href="/register"
          className="mt-7 inline-flex items-center gap-[9px] border-b border-brand pb-1 text-[13px] font-medium text-brand transition-all duration-300 hover:gap-[14px] hover:opacity-80"
        >
          {isAr ? "لا يزال لديك سؤال؟ تحدّث إلى فريقنا" : "Still have a question? Talk to our team"}
          <ArrowUpRight className={isAr ? "rotate-180" : ""} />
        </Link>
      </div>

      <div className="w-full lg:order-1">
        <div className="border-t border-black/10">
          {items.map((item, i) => {
            const isOpen = open === i;
            const num = String(i + 1).padStart(2, "0");
            return (
              <div key={i} className="border-b border-black/10">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-[clamp(16px,2vw,28px)] bg-transparent py-[clamp(22px,2.4vw,30px)] text-start transition-colors duration-300 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span
                    className={`shrink-0 font-display text-[clamp(18px,1.6vw,22px)] font-semibold leading-none transition-colors duration-300 ${
                      isOpen ? "text-brand" : "text-[#646c73]"
                    }`}
                  >
                    {num}
                  </span>
                  <span
                    className={`flex-1 text-[clamp(17px,1.5vw,20px)] transition-colors duration-300 ${
                      isOpen ? "text-brand" : "text-[#222]"
                    }`}
                  >
                    {isAr ? item.qAr : item.qEn}
                  </span>
                  <PlusMinus open={isOpen} />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-[clamp(22px,2.4vw,30px)] ps-[clamp(34px,3.6vw,50px)] text-[15.5px] leading-[1.75] text-[#5b6472] md:ps-0 lg:ps-[clamp(34px,3.6vw,50px)]">
                      {isAr ? item.aAr : item.aEn}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-start lg:justify-end">
          <Link
            href="/faq"
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-[#33414b]"
          >
            {isAr ? "اقرأ جميع الأسئلة الشائعة" : "Read all FAQs"}
            <ArrowUpRight className={isAr ? "-rotate-90" : "rotate-45"} />
          </Link>
        </div>
      </div>
    </div>
  );
}
