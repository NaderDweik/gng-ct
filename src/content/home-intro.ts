/**
 * Home "About Giving Compound" intro (features/home/HomeIntro): one photo that unveils
 * once in view. The photo is 3200 px wide (upscaled 4× with Real-ESRGAN from the
 * 1672 px gallery original, then resized) so it stays sharp on retina screens.
 */
export const homeIntro = {
  image: "/home/intro-swimmer-pool-waterfall.jpg",
  /** The 3:2 frame trims the 16:9 photo's sides; this keeps the swimmer in. */
  focus: "80% 50%",
  href: "/units",
  en: {
    eyebrow: "About Giving Compound",
    title: "One Community. 367 Private Resorts.",
    p1: "Welcome to Giving Compound: the first and largest fully-serviced chalet community in the region, across 500,000 m² in Al Matabba, Sahab.",
    facts: [
      "About 500 m² per chalet",
      "Independent title deed",
      "Spanish-style design",
      "3-metre privacy walls",
      "Gated, 24/7 security",
      "Zero-interest plans, direct",
    ],
    cta: "Explore Resorts",
    alt: "A swimmer in the pool beside the waterfall spout at the Giving Royal clubhouse",
  },
  ar: {
    eyebrow: "عن Giving Compound",
    title: "مجتمع واحد. ٣٦٧ شاليهًا خاصًا.",
    p1: "أهلًا بك في Giving Compound: أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة، على مساحة ٥٠٠,٠٠٠ م² في المطبّة، سحاب.",
    facts: [
      "شاليه بمساحة ٥٠٠ م² تقريبًا",
      "سند ملكية مستقل",
      "تصميم إسباني",
      "جدران خصوصية بارتفاع ٣ أمتار",
      "مجتمع مسوّر بأمن دائم",
      "تقسيط مباشر بدون فوائد",
    ],
    cta: "استكشف الشاليهات",
    alt: "سبّاح في المسبح بجانب شلال الماء في نادي Giving Royal",
  },
} as const;
