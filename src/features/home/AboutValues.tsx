import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";

/*
 * Who we are, our vision, and the founder's message. Shown on the home page and on
 * /about; the copy lives in messages/*.json under "about". Motion: the cards ride the
 * site scroll reveal, then inside each the rule draws, the icon pops and the copy
 * follows, and a large faded copy of the icon settles into the top corner; hover fills
 * the card from below (styles/sections/about.css).
 */

type ValueIcon = "who" | "vision" | "message";

function Icon({ name, size = 26 }: { name: ValueIcon; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "who")
    return (
      <svg {...p}>
        <path d="M3 21h18M5 21V8l5-4 5 4v13M15 21v-9h4v9" />
        <path d="M8.5 11h3M8.5 15h3" />
      </svg>
    );
  if (name === "vision")
    return (
      <svg {...p}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      <path d="M9 12h.01M12 12h.01M15 12h.01" />
    </svg>
  );
}

export async function AboutValues({ locale, className = "" }: { locale: string; className?: string }) {
  const t = await getTranslations({ locale, namespace: "about" });
  const isAr = locale === "ar";

  return (
    <section className={`about-values section border-t border-line bg-surface ${className}`}>
      <div className="container-gc grid gap-6 md:grid-cols-3">
        {(["who", "vision"] as const).map((key) => (
          <div key={key} className="av-col">
            <span className="av-mark" aria-hidden>
              <Icon name={key} size={170} />
            </span>
            <span className="av-icon">
              <Icon name={key} />
            </span>
            <h2 className="av-title">{t(`${key}Title`)}</h2>
            <p className="av-body">{t(key)}</p>
          </div>
        ))}
        <figure className="av-col av-col--quote">
          <span className="av-mark av-mark--quote" aria-hidden>
            {isAr ? "«" : "“"}
          </span>
          <span className="av-icon">
            <Icon name="message" />
          </span>
          <h2 className="av-title">{t("messageTitle")}</h2>
          <blockquote className="av-body">{isAr ? `«${t("message")}»` : `“${t("message")}”`}</blockquote>
          <figcaption className="av-sign">{isAr ? site.contact : site.contactEn}</figcaption>
        </figure>
      </div>
    </section>
  );
}
