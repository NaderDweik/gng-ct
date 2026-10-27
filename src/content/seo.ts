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
  | "/leadership"
  | "/chalet/amenities"
  | "/compound/amenities"
  | "/location"
  | "/news"
  | "/faq"
  | "/register"
  | "/chalet"
  | "/compound"
  | "/privacy"
  | "/terms"
  | "/cookies";

type SeoCopy = { titleAr: string; titleEn: string; descAr: string; descEn: string };

export const brandAr = "روح العطاء";
export const brandEn = "Giving Compound";

export const seoPages: Record<SeoRoute, SeoCopy> = {
  "": {
    // Home uses an absolute title (no " | brand" suffix).
    titleAr: "روح العطاء | شاليهات خاصة للبيع في الأردن بمسبح خاص",
    titleEn: "Giving Compound | Private Chalets for Sale in Jordan",
    descAr:
      "أول وأكبر كمباوند شاليهات مخدوم بالكامل في المنطقة قرب عمّان. 367+ شاليه خاص بمساحة 500 م² ومسبح خاص، وتقسيط بدون فوائد.",
    descEn:
      "The first and largest fully-serviced chalet city in the region, near Amman. 367+ private 500 m² chalets with their own pool and 0% installments.",
  },
  "/about": {
    titleAr: "من نحن: شركة العطاء للتطوير العقاري",
    titleEn: "About Us: Al-Ataa City Development",
    descAr:
      "تعرّف على شركة العطاء للتطوير العقاري وكمباوند روح العطاء: 500,000 م²، 367+ شاليه بتصميم إسباني، وشهادة جودة ISO 9001:2015.",
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
    titleEn: "Compound Services & Aftercare in Jordan",
    descAr:
      "خدمات شركة العطاء للتطوير العقاري لملاك الشاليهات: تطوير وبناء وتشطيب، تمويل مباشر بدون بنك وبدون فوائد، إدارة العقار، ودعم قانوني لنقل الملكية.",
    descEn:
      "What Al-Ataa does for chalet owners: development and finishing, direct 0% financing with no bank, property management and legal support for the ownership transfer.",
  },
  "/leadership": {
    titleAr: "الإدارة: د. طارق قازان، مؤسس روح العطاء",
    titleEn: "Leadership: Dr. Tarek Qazan, Founder",
    descAr:
      "تعرّف على د. طارق قازان مؤسس شركة العطاء للتطوير العقاري، ورؤيته في بناء أول كمباوند شاليهات مخدوم بالكامل في المنطقة.",
    descEn:
      "Meet Dr. Tarek Qazan, founder of Al-Ataa for City Development & Financing, and the principles behind the region's first fully-serviced chalet city.",
  },
  "/chalet/amenities": {
    titleAr: "مرافق الشاليه: مسبح خاص، جاكوزي وحديقة",
    titleEn: "Chalet Amenities: Private Pool, Jacuzzi & Garden",
    descAr:
      "ما في كل شاليه بمساحة 500 م² في روح العطاء: مسبح خاص ومسبح أطفال، جاكوزي، برغولة وشواء، حدائق، وموقف لسيارتين خلف أسوار بارتفاع 3 م.",
    descEn:
      "What every 500 m² chalet at Giving Compound has: a private pool and kids pool, jacuzzi, pergola and BBQ, gardens and a 2-car garage behind 3 m walls.",
  },
  "/compound/amenities": {
    titleAr: "مرافق الكمباوند: أمن 24/7، مسابح وحدائق",
    titleEn: "Amenities: 24/7 Security, Pools & Gardens",
    descAr:
      "مرافق كمباوند روح العطاء المسوّر: حراسة وكاميرات على مدار الساعة، إنترنت ألياف ضوئية، مسابح مفلترة، حدائق، ملاعب أطفال ومواقف لكل شاليه.",
    descEn:
      "Inside gated Giving Compound: 24/7 guards and cameras, fiber internet, filtered pools, landscaped gardens, kids play areas and parking per chalet.",
  },
  "/location": {
    titleAr: "الموقع: شاليهات قرب عمّان على طريق سحاب",
    titleEn: "Location: Chalets Near Amman, Jordan",
    descAr:
      "روح العطاء في المطبّة، حوالي 42 دقيقة من الدوار السابع باتجاه سحاب الحطمية. خريطة تفاعلية، اتجاهات القيادة وأوقات الوصول من عمّان.",
    descEn:
      "Giving Compound is in Al Matabba, about 42 minutes from Amman's 7th Circle towards Sahab Al-Hatmiyeh. Interactive map, driving directions and travel times from Amman.",
  },
  "/news": {
    titleAr: "الأخبار والمقالات: الاستثمار في الشاليهات بالأردن",
    titleEn: "News: Chalet Investment in Jordan",
    descAr:
      "مقالات وأخبار روح العطاء: الاستثمار العقاري في الشاليهات، خطط الدفع بدون فوائد، جودة البناء ISO، التصميم الإسباني والحياة داخل الكمباوند.",
    descEn:
      "Giving Compound news and guides: chalet investment in Jordan, 0% payment plans, ISO build quality, Spanish design and everyday life in the community.",
  },
  "/faq": {
    titleAr: "الأسئلة الشائعة: السعر، التقسيط والتملك",
    titleEn: "FAQ: Price, Installments & Ownership",
    descAr:
      "إجابات واضحة قبل الشراء: سعر الشاليه، خطط التقسيط بدون فوائد، مواصفات البناء، الموقع والأمن في روح العطاء.",
    descEn:
      "Clear answers before you buy: chalet price, 0% installment plans, build specs, location and security at Giving Compound.",
  },
  "/register": {
    titleAr: "احجز زيارتك لمكتب المبيعات",
    titleEn: "Book a Sales Office Visit",
    descAr:
      "احجز موعد زيارتك لمكتب مبيعات روح العطاء في الكمباوند، من السبت إلى الخميس بين 10 صباحًا و6 مساءً، ونؤكد موعدك عبر واتساب.",
    descEn:
      "Book a visit to the Giving Compound sales office at the compound, Saturday to Thursday between 10 am and 6 pm. We confirm your visit on WhatsApp.",
  },
  "/chalet": {
    titleAr: "الشاليه: تصميم 500 م² في روح العطاء",
    titleEn: "The Chalet: Inside the 500 m² Layout",
    descAr:
      "اطّلع على مخطط شاليه روح العطاء: 500 م²، 3 غرف نوم، مسبح كبير ومسبح أطفال، جاكوزي، برجولا ومنطقة شواء داخل كمباوند مسوّر.",
    descEn:
      "Explore the Giving Compound chalet plan: 500 m², 3 bedrooms, a main and kids pool, jacuzzi, pergola and BBQ, inside a gated community.",
  },
  "/compound": {
    titleAr: "الكمباوند: الشاليهات المتاحة للبيع بمسبح خاص",
    titleEn: "The Compound: Chalets With Private Pools",
    descAr:
      "شاليهات روح العطاء على خريطة الكمباوند: 500 م²، 3 غرف نوم، مسبح خاص وجاكوزي، بسعر 168,000 دينار مع تقسيط بدون فوائد.",
    descEn:
      "Find your chalet on the Giving Compound map: 500 m², 3 bedrooms, private pool and jacuzzi, from 168,000 JD at 0% interest.",
  },
  "/privacy": {
    titleAr: "سياسة الخصوصية",
    titleEn: "Privacy Policy",
    descAr: "كيف تجمع شركة العطاء للتطوير العقاري معلوماتك عند تسجيل اهتمامك بشاليه في روح العطاء، ولماذا تستخدمها، وكيف تحميها، وحقوقك.",
    descEn: "How Al-Ataa collects, uses and protects your information when you register interest in a Giving Compound chalet, who receives it, and your rights.",
  },
  "/terms": {
    titleAr: "شروط الاستخدام",
    titleEn: "Terms of Use",
    descAr: "الشروط التي تنطبق عند استخدام موقع روح العطاء: المعلومات المعروضة، وتسجيل الاهتمام، والملكية الفكرية، والقانون الأردني الحاكم.",
    descEn: "The terms for using the Giving Compound website: the information shown, registering your interest, intellectual property and Jordanian governing law.",
  },
  "/cookies": {
    titleAr: "سياسة ملفات تعريف الارتباط",
    titleEn: "Cookie Policy",
    descAr: "ملفات تعريف الارتباط التي يستخدمها موقع روح العطاء: الضرورية منها، والخاصة بالتحليلات بموافقتك فقط، وكيف تغيّر اختيارك في أي وقت.",
    descEn: "The cookies the Giving Compound website uses: strictly necessary ones, analytics only with your consent, and how to change your choice at any time.",
  },
};
