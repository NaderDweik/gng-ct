/**
 * Home "About Giving Compound" intro (features/home/HomeIntro): one photo that unveils
 * once in view. The photo is 3200 px wide (upscaled 4× with Real-ESRGAN from the
 * 1672 px gallery original, then resized) so it stays sharp on retina screens.
 */
export const homeIntro = {
  image: "/home/intro-swimmer-pool-waterfall.jpg",
  /** The 3:2 frame trims the 16:9 photo's sides; this keeps the swimmer in. */
  focus: "80% 50%",
  href: "/chalet",
  en: {
    eyebrow: "About Giving Compound",
    title: "One Community. 367 Private Resorts.",
    p1: "Welcome to Giving Compound: the first and largest fully-serviced chalet community in the region, across 500,000 m² in Al Matabba, Sahab.",
    facts: [
      "About 500 m² per chalet",
      "Independent title deed",
      "Zero-interest plans, direct",
    ],
    cta: "Explore the Plan",
    alt: "A swimmer in the pool beside the waterfall spout at the Giving Royal clubhouse",
  },
  ar: {
    eyebrow: "عن روح العطاء",
    title: "كمباوند واحد. ٣٦٧ شاليهًا خاصًا.",
    p1: "أهلًا بك في روح العطاء: أول وأكبر كمباوند شاليهات مخدوم بالكامل في المنطقة، على مساحة ٥٠٠,٠٠٠ م² في المطبّة، سحاب.",
    facts: [
      "شاليه بمساحة ٥٠٠ م² تقريبًا",
      "سند ملكية مستقل",
      "تقسيط مباشر بدون فوائد",
    ],
    cta: "استكشف المخطط",
    alt: "سبّاح في المسبح بجانب شلال الماء في نادي Giving Royal",
  },
} as const;
