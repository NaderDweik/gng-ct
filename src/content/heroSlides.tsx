import type { HeroSlide } from "@/components/HeroCarousel";

/** Top-tier Giving City stills — aerial, exterior, amenity — JG-style 3-slide hero. */
export const heroSlides: HeroSlide[] = [
  {
    src: "/hero/slide-1.jpg",
    badgeEn: "Giving City · Greater Amman",
    badgeAr: "Giving City · عمّان الكبرى",
    titleEn: (
      <>
        Live Above <br className="hidden md:block" /> Expectations
      </>
    ),
    titleAr: (
      <>
        عيش فوق <br className="hidden md:block" /> التوقعات
      </>
    ),
    descEn: "The first and largest fully-serviced chalet city in the region.",
    descAr: "أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة.",
    ctaPrimaryEn: "Explore Resorts",
    ctaPrimaryAr: "استكشف المنتجعات",
    ctaSecondaryEn: "Explore Amenities",
    ctaSecondaryAr: "استكشف المرافق",
    primaryHref: "/units",
    secondaryHref: "/amenities",
  },
  {
    src: "/hero/slide-2.jpg",
    badgeEn: "Giving City · Greater Amman",
    badgeAr: "Giving City · عمّان الكبرى",
    titleEn: (
      <>
        One Address. <br className="hidden md:block" /> Complete Privacy.
      </>
    ),
    titleAr: (
      <>
        عنوان واحد. <br className="hidden md:block" /> خصوصية تامة.
      </>
    ),
    descEn: "500 m² private resorts with independent deeds and Spanish design.",
    descAr: "منتجعات ٥٠٠ م² بسند ملكية مستقل وتصميم إسباني فاخر.",
    ctaPrimaryEn: "Explore Resorts",
    ctaPrimaryAr: "استكشف المنتجعات",
    ctaSecondaryEn: "Explore Amenities",
    ctaSecondaryAr: "استكشف المرافق",
    primaryHref: "/units",
    secondaryHref: "/amenities",
  },
  {
    src: "/hero/slide-3.jpg",
    badgeEn: "Giving City · Greater Amman",
    badgeAr: "Giving City · عمّان الكبرى",
    titleEn: (
      <>
        A Private World, <br className="hidden md:block" /> Fully Serviced.
      </>
    ),
    titleAr: (
      <>
        عالمك الخاص، <br className="hidden md:block" /> مخدوم بالكامل.
      </>
    ),
    descEn: "Pools, security, fiber, and zero-interest plans — directly with the company.",
    descAr: "مسابح، أمن، ألياف ضوئية، وخطط بدون فوائد — مباشرة مع الشركة.",
    ctaPrimaryEn: "Explore Resorts",
    ctaPrimaryAr: "استكشف المنتجعات",
    ctaSecondaryEn: "Explore Amenities",
    ctaSecondaryAr: "استكشف المرافق",
    primaryHref: "/units",
    secondaryHref: "/financing",
  },
];
