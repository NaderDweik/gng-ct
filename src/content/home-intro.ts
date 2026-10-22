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
    title: "One Community. 367+ Private Resorts.",
    p1: "Welcome to Giving Compound: the first and largest fully-serviced chalet community in the region, across 500,000 m² in Al Matabba, Sahab.",
    facts: [
      "About 500 m² per chalet",
      "Zero-interest plans, direct",
    ],
    cta: "Explore the Plan",
    alt: "A swimmer in the pool beside the waterfall spout at the Giving Royal clubhouse",
  },
  ar: {
    eyebrow: "عن روح العطاء",
    title: "كمباوند شاليهات Giving",
    p1: "هو أسلوب حياة صُمّم ليجمع الراحة والخصوصية بمكان واحد.",
    facts: [
      "شاليه بمساحة 500 م² تقريبًا",
      "تقسيط مباشر بدون فوائد",
    ],
    cta: "استكشف المخطط",
    alt: "سبّاح في المسبح بجانب شلال الماء في نادي Giving Royal",
  },
} as const;
