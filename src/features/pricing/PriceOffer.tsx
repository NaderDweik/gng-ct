import { Link } from "@/i18n/navigation";
import { basePriceJd, cashDiscountPct, cashPriceJd, monthlyJd, monthlyPct } from "@/content/pricing";
import { formatNumber } from "@/lib/format";
import { CountUp } from "@/components/ui/CountUp";

/*
 * The offer, plainly (styles: styles/sections/financing.css → .po-*).
 * One price for every chalet · two ways to pay · the down-payment note.
 * No toggles, no dates — the figures count up once as the block comes into
 * view (CountUp reserves their final width, so nothing shifts).
 */

type Props = { locale: string; jd: string };

export function PriceOffer({ locale, jd }: Props) {
  const isAr = locale === "ar";
  const n = (v: number) => formatNumber(v, locale);
  const pctSign = isAr ? "٪" : "%";

  return (
    <div className="po">
      <div className="po-price">
        <p className="po-kicker">{isAr ? "كافة الشاليهات بسعر واحد" : "Every chalet, one price"}</p>
        <p className="po-price-value">
          <CountUp value={basePriceJd} locale={locale} duration={1800} />
          <span className="po-unit">{jd}</span>
        </p>
      </div>

      <article className="po-way">
        <p className="po-kicker">{isAr ? "بالتقسيط" : "In installments"}</p>
        <p className="po-big">
          <CountUp value={monthlyPct} locale={locale} suffix={pctSign} delay={250} duration={1200} />{" "}
          <span className="po-big-word">{isAr ? "شهريًا" : "a month"}</span>
        </p>
        <p className="po-line">
          {isAr ? "أي " : "That is "}
          <b>
            <CountUp value={monthlyJd} locale={locale} delay={400} duration={1600} /> {jd}
          </b>
          {isAr ? " في الشهر" : " per month"}
        </p>
        <Link href="/register?plan=installments" className="plan-card-cta">
          {isAr ? "اختر التقسيط" : "Choose installments"}
          <span className="arrow" aria-hidden />
        </Link>
      </article>

      <article className="po-way po-way--cash">
        <p className="po-kicker">{isAr ? "كاش" : "In cash"}</p>
        <p className="po-big">
          {isAr ? (
            <>
              <span className="po-big-word">خصم</span> <CountUp value={cashDiscountPct} locale={locale} suffix={pctSign} delay={550} duration={1400} />
            </>
          ) : (
            <>
              <CountUp value={cashDiscountPct} locale={locale} suffix={pctSign} delay={550} duration={1400} /> <span className="po-big-word">off</span>
            </>
          )}
        </p>
        <p className="po-line">
          {isAr ? "تدفع " : "You pay "}
          <b>
            <CountUp value={cashPriceJd} locale={locale} delay={700} duration={1800} /> {jd}
          </b>
          {isAr ? " بدلًا من " : " instead of "}
          <s className="tabular-nums">{n(basePriceJd)}</s>
        </p>
        <Link href="/register?plan=cash" className="plan-card-cta plan-card-cta--light">
          {isAr ? "اختر الكاش" : "Choose cash"}
          <span className="arrow" aria-hidden />
        </Link>
      </article>

      <p className="po-note">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5.5M12 7.6v.1" />
        </svg>
        <span>
          <b>{isAr ? "الدفعة الأولى: " : "Down payment: "}</b>
          {isAr
            ? "بعض الشاليهات بدفعة أولى وبعضها بدون دفعة — حسب الشاليه الذي تختاره."
            : "some chalets come with a down payment and some without — it depends on the chalet you choose."}
        </span>
      </p>
    </div>
  );
}
