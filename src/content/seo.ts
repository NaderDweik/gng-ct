/*
 * Search titles + descriptions per route (lib/seo.ts builds the metadata).
 * Titles: ≤ ~60 chars incl. the " | brand" suffix, main keyword first.
 * Descriptions: ~140–160 chars, one concrete fact + a reason to click.
 * Copy rule: no em dashes.
 */

export type SeoRoute =
  | ""
  | "/about"
  | "/gallery"
  | "/services"
  | "/master-plan"
  | "/financing"
  | "/leadership"
  | "/amenities"
  | "/location"
  | "/news"
  | "/faq"
  | "/register"
  | "/units";

type SeoCopy = { titleAr: string; titleEn: string; descAr: string; descEn: string };

export const brandAr = "روح العطاء";
export const brandEn = "Giving Compound";

export const seoPages: Record<SeoRoute, SeoCopy> = {
  "": {
    // Home uses an absolute title (no " | brand" suffix).
    titleAr: "روح العطاء | شاليهات خاصة للبيع في الأردن بمسبح خاص",
    titleEn: "Giving Compound | Private Chalets for Sale in Jordan",
    descAr:
      "أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة قرب عمّان. ٣٦٧+ شاليه خاص بمساحة ٥٠٠ م²، مسبح خاص وسند ملكية مستقل، وتقسيط بدون فوائد.",
    descEn:
      "The first and largest fully-serviced chalet city in the region, near Amman. 367+ private 500 m² chalets with their own pool, an independent deed and 0% installments.",
  },
  "/about": {
    titleAr: "من نحن: شركة العطاء للتطوير والتمويل العمراني",
    titleEn: "About Us: Al-Ataa City Development & Financing",
    descAr:
      "تعرّف على شركة العطاء للتطوير والتمويل العمراني ومشروع روح العطاء: ٥٠٠,٠٠٠ م²، ٣٦٧+ شاليه بتصميم إسباني، وشهادة جودة ISO 9001:2015.",
    descEn:
      "Meet Al-Ataa for City Development & Financing, the developer of Giving Compound: 500,000 m², 367+ Spanish-style chalets and ISO 9001:2015 certified quality.",
  },
  "/gallery": {
    titleAr: "معرض الصور والفيديو: شاليهات روح العطاء",
    titleEn: "Photo & Video Gallery: Chalets in Jordan",
    descAr:
      "صور حقيقية لشاليهات روح العطاء: المسابح الخاصة، الغرف والجاكوزي، الحدائق والمرافق، ومراحل البناء، مع جولة فيديو كاملة داخل الشاليه.",
    descEn:
      "Real photos of Giving Compound: private pools, bedrooms and jacuzzi, gardens, community amenities and construction progress, plus a full video tour of a chalet.",
  },
  "/services": {
    titleAr: "خدماتنا: تطوير، تمويل مباشر وخدمة ما بعد البيع",
    titleEn: "Our Services: Development, Financing & Aftercare",
    descAr:
      "خدمات شركة العطاء لملاك الشاليهات: تطوير وبناء وتشطيب، تمويل مباشر بدون بنك وبدون فوائد، إدارة العقار، ودعم قانوني لاستخراج سند الملكية.",
    descEn:
      "What Al-Ataa does for chalet owners: development and finishing, direct 0% financing with no bank, property management and legal support for your title deed.",
  },
  "/master-plan": {
    titleAr: "المخطط العام: تصميم الشاليه ٥٠٠ م² في روح العطاء",
    titleEn: "Master Plan: The 500 m² Chalet Layout",
    descAr:
      "اطّلع على مخطط شاليه روح العطاء: ٥٠٠ م² بسند مستقل، ٣ غرف نوم، مسبح كبير ومسبح أطفال، جاكوزي، برجولا ومنطقة شواء داخل مجتمع مسوّر.",
    descEn:
      "Explore the Giving Compound chalet plan: 500 m² with its own deed, 3 bedrooms, a main and kids pool, jacuzzi, pergola and BBQ, inside a gated community.",
  },
  "/financing": {
    titleAr: "تقسيط شاليه بدون فوائد وبدون بنك | خطط الدفع",
    titleEn: "Chalet Financing: 0% Interest, No Bank",
    descAr:
      "اشترِ شاليهك مباشرة من الشركة بدون بنك وبدون فوائد: سعر ١٦٨,٠٠٠ دينار، أقساط شهرية ١٪ من السعر، أو خصم ٢٤٪ عند الدفع نقدًا. احسب خطتك الآن.",
    descEn:
      "Buy your chalet directly from the developer with no bank and 0% interest: 168,000 JD, monthly installments of 1% of the price, or 24% off for cash. Plan yours now.",
  },
  "/leadership": {
    titleAr: "الإدارة: د. طارق قازان، مؤسس روح العطاء",
    titleEn: "Leadership: Dr. Tarek Qazan, Founder",
    descAr:
      "تعرّف على د. طارق قازان مؤسس شركة العطاء للتطوير والتمويل العمراني، ورؤيته في بناء أول مدينة شاليهات مخدومة بالكامل في المنطقة.",
    descEn:
      "Meet Dr. Tarek Qazan, founder of Al-Ataa for City Development & Financing, and the principles behind the region's first fully-serviced chalet city.",
  },
  "/amenities": {
    titleAr: "مرافق المشروع: أمن ٢٤/٧، مسابح وحدائق",
    titleEn: "Amenities: 24/7 Security, Pools & Gardens",
    descAr:
      "مرافق مجتمع روح العطاء المسوّر: حراسة وكاميرات على مدار الساعة، إنترنت ألياف ضوئية، مسابح مفلترة، حدائق، ملاعب أطفال ومواقف لكل شاليه.",
    descEn:
      "Inside the gated Giving Compound community: 24/7 guards and cameras, fiber internet, filtered pools, landscaped gardens, kids play areas and parking for every chalet.",
  },
  "/location": {
    titleAr: "الموقع: شاليهات قرب عمّان على طريق سحاب",
    titleEn: "Location: Chalets Near Amman, Jordan",
    descAr:
      "روح العطاء على بُعد ٤١ كم (حوالي ٥٥ دقيقة) من فندق الرويال باتجاه سحاب الحطمية. خريطة تفاعلية، اتجاهات القيادة وأوقات الوصول من عمّان.",
    descEn:
      "Giving Compound is 41 km (about 55 minutes) from Le Royal Hotel towards Sahab Al-Hatmiyeh. Interactive map, driving directions and travel times from Amman.",
  },
  "/news": {
    titleAr: "الأخبار والمقالات: الاستثمار في الشاليهات بالأردن",
    titleEn: "News & Articles: Chalet Investment in Jordan",
    descAr:
      "مقالات وأخبار روح العطاء: الاستثمار العقاري في الشاليهات، خطط الدفع بدون فوائد، جودة البناء ISO، التصميم الإسباني والحياة داخل المجتمع.",
    descEn:
      "Giving Compound news and guides: chalet investment in Jordan, 0% payment plans, ISO build quality, Spanish design and everyday life in the community.",
  },
  "/faq": {
    titleAr: "الأسئلة الشائعة: السعر، التقسيط والتملك",
    titleEn: "FAQ: Price, Installments & Ownership",
    descAr:
      "إجابات واضحة قبل الشراء: سعر الشاليه، خطط التقسيط بدون فوائد، سند الملكية المستقل، مواصفات البناء، الموقع والأمن في روح العطاء.",
    descEn:
      "Clear answers before you buy: chalet price, 0% installment plans, the independent title deed, build specs, location and security at Giving Compound.",
  },
  "/register": {
    titleAr: "سجّل اهتمامك: احجز زيارة أو استشارة تمويل",
    titleEn: "Register Interest: Book a Visit or Financing Call",
    descAr:
      "سجّل اهتمامك بشاليه في روح العطاء واحجز زيارة للموقع أو استشارة تمويل. يرد فريق المبيعات خلال ساعات العمل عبر واتساب أو الهاتف.",
    descEn:
      "Register your interest in a Giving Compound chalet and book a site visit or a financing call. Our sales team replies on WhatsApp or by phone during working hours.",
  },
  "/units": {
    titleAr: "الشاليهات المتاحة للبيع: ٥٠٠ م² بمسبح خاص",
    titleEn: "Chalets for Sale: 500 m² With Private Pool",
    descAr:
      "الشاليهات المتاحة في روح العطاء: ٥٠٠ م² بسند ملكية مستقل، ٣ غرف نوم، مسبح خاص وجاكوزي، بسعر ١٦٨,٠٠٠ دينار مع تقسيط بدون فوائد.",
    descEn:
      "Available chalets at Giving Compound: 500 m² with an independent deed, 3 bedrooms, private pool and jacuzzi, from 168,000 JD with 0% installments.",
  },
};
