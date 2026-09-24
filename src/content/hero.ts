/**
 * Home hero — auto-advancing cinematic stills with one fixed, giant wordmark.
 * Layer order per slide: photo → wordmark → optional `foreground` cut-out, so a
 * slide's subject can stand in front of the letters. A `foreground` is generated
 * from its `background` (scripts/hero-cutout.mjs) — replace them together.
 * Slides without a cut-out show the wordmark in front of the photo.
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
  eyebrowAr: "Giving City · عمّان الكبرى",
  eyebrowEn: "Giving City · Greater Amman",
  ctaPrimaryAr: "استكشف المنتجعات",
  ctaPrimaryEn: "Explore resorts",
  ctaSecondaryAr: "استكشف المرافق",
  ctaSecondaryEn: "Explore amenities",
  primaryHref: "/units",
  secondaryHref: "/amenities",
  /** Time each slide stays up before advancing. */
  intervalMs: 7000,
  slides: [
    {
      // Main slide — the pavilion and pool at golden hour (AI-enhanced render of img_2).
      background: "/gallery/Gemini_Generated_Image_8og1am8og1am8og1.jpg",
      focus: "45% 50%",
      titleAr: ["عيش فوق", "التوقعات"],
      titleEn: ["Live above", "expectations"],
      descAr: "أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة — منتجعات خاصة بسند ملكية مستقل.",
      descEn: "The first and largest fully-serviced chalet city in the region — private resorts with an independent deed.",
    },
    {
      // Palms, pool and pergola.
      background: "/gallery/img_4.jpg",
      focus: "50% 50%",
      titleAr: ["عنوان واحد.", "خصوصية تامة."],
      titleEn: ["One address.", "Complete privacy."],
      descAr: "منتجعات ٥٠٠ م² بسند ملكية مستقل وتصميم إسباني فاخر.",
      descEn: "500 m² private resorts with independent deeds and Spanish design.",
    },
    {
      // The garden swing on the lawn.
      background: "/gallery/img_5.jpg",
      focus: "50% 50%",
      titleAr: ["عالمك الخاص،", "مخدوم بالكامل."],
      titleEn: ["A private world,", "fully serviced."],
      descAr: "مسابح، أمن، ألياف ضوئية، وخطط بدون فوائد — مباشرة مع الشركة.",
      descEn: "Pools, security, fiber, and zero-interest plans — directly with the company.",
    },
  ] satisfies HeroSlide[],
} as const;
