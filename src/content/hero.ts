/**
 * Home hero — auto-advancing cinematic stills with one fixed, giant wordmark.
 * Layer order per slide: photo → wordmark → optional `foreground` cut-out, so a
 * slide's subject can stand in front of the letters. A `foreground` is generated
 * from its `background` (scripts/hero-cutout.mjs) — replace them together.
 * Slides without a cut-out show the wordmark in front of the photo.
 * Backgrounds are 3840 px wide (public/hero/*-4k.jpg): the gallery originals are
 * 1672 px, so they were upscaled 4× with Real-ESRGAN (x4plus) and resized to 4K,
 * which keeps the hero sharp on retina and 4K screens. Redo this for a new photo
 * unless it is already ~3840 px wide.
 */
export type HeroSlide = {
  background: string;
  foreground?: string;
  /** Keeps the subject in frame when `object-cover` crops (portrait phones). */
  focus: string;
  titleAr: readonly string[];
  titleEn: readonly string[];
  descAr: string;
  descEn: string; // test
};

export const heroLayered = {
  wordmarkAr: "",
  wordmarkEn: "",
  eyebrowAr: "Giving Compound · عمّان الكبرى",
  eyebrowEn: "Giving Compound · Greater Amman",
  ctaPrimaryAr: "استكشف الشاليهات",
  ctaPrimaryEn: "Explore resorts",
  ctaSecondaryAr: "استكشف المرافق",
  ctaSecondaryEn: "Explore amenities",
  primaryHref: "/units",
  secondaryHref: "/amenities",
  /** Time each slide stays up before advancing. */
  intervalMs: 7000,
  slides: [
    {
      // Main slide — the entrance: carved fountain, palms and the "giving" gatehouse at sunset.
      background: "/hero/entrance-fountain-and-gatehouse-4k.jpg",
      focus: "60% 55%",
      titleAr: ["عيش فوق", "التوقعات"],
      titleEn: ["Live Above", "Expectations"],
      descAr: "أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة. شاليهات خاصة بسند ملكية مستقل.",
      descEn: "The first and largest fully-serviced chalet city in the region. Private resorts with an independent deed.",
    },
    {
      // Quad bike in front of the Giving Royal clubhouse.
      background: "/hero/quad-bike-royal-clubhouse-4k.jpg",
      focus: "40% 55%",
      titleAr: ["عنوان واحد.", "خصوصية تامة."],
      titleEn: ["One Address.", "Complete Privacy."],
      descAr: "شاليهات ٥٠٠ م² بسند ملكية مستقل وتصميم إسباني فاخر.",
      descEn: "500 m² private resorts with independent deeds and Spanish design.",
    },
    {
      // Giant chess over the pool at the Giving Royal clubhouse.
      background: "/hero/giant-chess-poolside-royal-4k.jpg",
      focus: "50% 60%",
      titleAr: ["عالمك الخاص،", "مخدوم بالكامل."],
      titleEn: ["A Private World,", "Fully Serviced."],
      descAr: "مسابح، أمن، ألياف ضوئية، وخطط بدون فوائد، مباشرة مع الشركة.",
      descEn: "Pools, security, fiber, and zero-interest plans, directly with the company.",
    },
  ] satisfies HeroSlide[],
} as const;
