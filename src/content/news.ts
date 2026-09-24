export type Article = {
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  bodyAr: string[];
  bodyEn: string[];
  keywords: string[];
  date: string;
  /** Cover photo for the card and article header. */
  image: string;
};

export const articles: Article[] = [
  {
    slug: "first-chalet-city-middle-east",
    image: "/gallery/compoundPics/entrance-fountain-and-gatehouse.png",
    titleAr: "لماذا Giving City هي أول مدينة شاليهات متكاملة في الشرق الأوسط؟",
    titleEn: "Why Giving City is the first integrated chalet city in the Middle East",
    excerptAr: "٣٦٧+ منتجع خاص على ٥٠٠,٠٠٠ م² بتصميم إسباني وشهادة ISO.",
    excerptEn: "367+ private resorts on 500,000 m² with Spanish design and ISO certification.",
    date: "2026-01-15",
    keywords: ["شاليهات أردن", "مدينة شاليهات", "منتجعات خاصة أردن"],
    bodyAr: [
      "Giving City ليست فندقًا ولا مجمعًا سياحيًا تقليديًا — بل مجتمع منتجعات سكنية مسوّر يملك فيه المشتري وحدته بسند مستقل.",
      "يمتد المشروع على نحو ٥٠٠,٠٠٠ متر مربع ويضم أكثر من ٣٦٧ منتجعًا خاصًا بتصميم إسباني وخصوصية كاملة عبر جدران بارتفاع ٣ أمتار.",
      "الحصول على شهادة ISO 9001:2015 يعكس التزام شركة العطاء بجودة البناء والتشطيب وفق معايير دولية.",
    ],
    bodyEn: [
      "Giving City is not a hotel — it is a gated residential resort community where buyers own their unit with an independent deed.",
      "The project spans about 500,000 m² with 367+ private Spanish-style resorts and 3-meter privacy walls.",
      "ISO 9001:2015 certification reflects Al-Ataa’s commitment to international construction quality.",
    ],
  },
  {
    slug: "chalet-investment-2026",
    image: "/gallery/resortsPics/swimmer-pool-waterfall.png",
    titleAr: "٥ أسباب تجعل الاستثمار العقاري في الشاليهات خيارًا ذكيًا في ٢٠٢٦",
    titleEn: "5 reasons chalet investment is smart in 2026",
    excerptAr: "عائد الإجازات، ندرة المنتجعات الخاصة، وخطط دفع بدون فوائد.",
    excerptEn: "Vacation yield, scarce private resorts, and zero-interest plans.",
    date: "2026-02-01",
    keywords: ["استثمار عقاري أردن", "شراء شاليه", "عائد استثمار عقاري"],
    bodyAr: [
      "الطلب على الوحدات الخاصة ذات الخصوصية الكاملة في الأردن يتزايد مع بحث العائلات عن ملاذ قريب من عمّان.",
      "Giving City تجمع بين الملكية التامة ومرافق مخدومة بالكامل، مما يدعم التأجير الموسمي أو الاستخدام العائلي.",
      "خطط الدفع المباشرة بدون فوائد تقلل تكلفة الدخول مقارنة بالقروض البنكية التقليدية.",
    ],
    bodyEn: [
      "Demand for private, fully private units near Amman continues to grow among Jordanian families.",
      "Giving City combines outright ownership with fully serviced amenities — strong for seasonal rental or family use.",
      "Direct zero-interest plans lower entry cost versus traditional bank mortgages.",
    ],
  },
  {
    slug: "inside-500sqm-chalet",
    image: "/gallery/resortsPics/family-living-room.png",
    titleAr: "جولة داخل شاليه Giving City — ٥٠٠ م² من الخصوصية والرفاهية",
    titleEn: "Inside a Giving City chalet — 500 m² of privacy and luxury",
    excerptAr: "٣ غرف، مسبحان، جاكوزي، برجولا، وكراج لسيارتين.",
    excerptEn: "3 bedrooms, two pools, jacuzzi, pergola, and a 2-car garage.",
    date: "2026-02-20",
    keywords: ["شاليه خاص أردن", "مواصفات شاليه", "شاليه مع مسبح خاص"],
    bodyAr: [
      "كل وحدة بمساحة ٥٠٠ م² تضم ثلاث غرف نوم منها غرفة ماستر، حمامين، جاكوزي خاص، صالة واسعة ومطبخًا مجهزًا.",
      "في الخارج: مسبح كبير ومسبح أطفال، منطقة شواء، برجولا، وساحات حجر طبيعي خلف جدران خصوصية بارتفاع ٣ أمتار.",
      "الكراج يتسع لسيارتين، مع أنظمة تكييف وإنترنت ألياف وستلايت جاهزة للسكن.",
    ],
    bodyEn: [
      "Each 500 m² unit includes three bedrooms (master), two baths, a private jacuzzi, living room, and equipped kitchen.",
      "Outdoors: main and kids’ pools, BBQ, pergola, and stone courtyards behind 3-meter privacy walls.",
      "A 2-car garage plus AC, fiber, and satellite make the unit move-in ready.",
    ],
  },
  {
    slug: "iso-9001-quality",
    image: "/gallery/resortsPics/bathroom-jacuzzi-tub.png",
    titleAr: "شهادة ISO 9001:2015 — ماذا تعني لجودة بيتك؟",
    titleEn: "ISO 9001:2015 — what it means for your home’s quality",
    excerptAr: "نظام إدارة جودة دولي يغطي البناء والتشطيب ورضا العميل.",
    excerptEn: "An international QMS covering construction, finishing, and customer confidence.",
    date: "2026-03-05",
    keywords: ["ISO 9001 عقاري", "جودة بناء أردن", "معايير بناء"],
    bodyAr: [
      "ISO 9001:2015 إطار عالمي لإدارة الجودة يضمن توثيق العمليات والتحسين المستمر.",
      "في Giving City يعني ذلك رقابة أوضح على المواد، مراحل التنفيذ، وخدمة ما بعد البيع.",
      "للمشتري، الشهادة إشارة ثقة بأن المشروع يُدار بمعايير قابلة للتدقيق وليس وعودًا تسويقية فقط.",
    ],
    bodyEn: [
      "ISO 9001:2015 is a global quality-management framework focused on documented processes and continuous improvement.",
      "At Giving City it means clearer control over materials, construction stages, and after-sale service.",
      "For buyers, it signals auditable standards — not marketing claims alone.",
    ],
  },
  {
    slug: "flexible-payment-plans",
    image: "/gallery/resortsPics/family-breakfast-poolside-table.png",
    titleAr: "خطط الدفع المرنة — كيف تملك شاليهك بدون فوائد",
    titleEn: "Flexible payment plans — own your chalet with zero interest",
    excerptAr: "٣ خطط استلام وخصم نقدي ١٥٪ مباشرة مع الشركة.",
    excerptEn: "Three move-in plans and a 15% cash discount — direct with the company.",
    date: "2026-03-18",
    keywords: ["تقسيط شاليه أردن", "شراء بدون فوائد", "خطة دفع عقاري"],
    bodyAr: [
      "السعر الأساسي ١٦٨,٠٠٠ دينار، مع خصم ١٥٪ عند الدفع النقدي ليصبح ١٤٢,٨٠٠ دينار.",
      "خطط التقسيط: ٣٥٪ لعام ٢٠٢٥، ٢٥٪ لعام ٢٠٢٦، أو ١٥٪ لعام ٢٠٢٧ — والأقساط تبدأ من ١,٠٠٠ دينار شهريًا بدون فوائد.",
      "التعامل مباشر مع الشركة بدون بنك وسيط، ما يبسّط الإجراءات ويحافظ على الشفافية.",
    ],
    bodyEn: [
      "Base price is 168,000 JD; cash buyers save 15% at 142,800 JD.",
      "Installment plans: 35% for 2025, 25% for 2026, or 15% for 2027 — monthly from 1,000 JD with zero interest.",
      "Dealing directly with the company (no bank) keeps the process simple and transparent.",
    ],
  },
  {
    slug: "spanish-design",
    image: "/gallery/compoundPics/reception-building.png",
    titleAr: "التصميم الإسباني في Giving City — لماذا هذا الطراز؟",
    titleEn: "Spanish design at Giving City — why this style?",
    excerptAr: "طابع متوسطي دافئ وعزل واجهات يناسب مناخ الأردن.",
    excerptEn: "Warm Mediterranean character and facade insulation suited to Jordan’s climate.",
    date: "2026-04-02",
    keywords: ["تصميم إسباني", "عمارة متوسطية", "شاليهات فاخرة"],
    bodyAr: [
      "الطراز الإسباني يمنح الواجهات دفئًا بصريًا وارتباطًا بأسلوب حياة هادئ وعائلي.",
      "العزل الإسباني للواجهات مع جدران الثيرموستون يدعم الراحة الحرارية طوال العام.",
      "النتيجة: منتجعات تبدو فاخرة وتعمل بكفاءة في بيئة الأردن.",
    ],
    bodyEn: [
      "Spanish styling brings visual warmth and a calm, family-oriented lifestyle feel.",
      "Spanish facade insulation plus thermostone walls support year-round comfort.",
      "The result: resorts that look luxurious and perform well in Jordan’s climate.",
    ],
  },
  {
    slug: "life-in-community",
    image: "/gallery/compoundPics/kids-cycling-community-street.png",
    titleAr: "الحياة داخل مجتمع Giving City — أمن، مرافق، وجيران",
    titleEn: "Life inside Giving City — security, amenities, neighbors",
    excerptAr: "مجتمع مسوّر بمرافق مخدومة وخصوصية لكل عائلة.",
    excerptEn: "A gated, serviced community with privacy for every family.",
    date: "2026-04-20",
    keywords: ["مجتمع سكني أردن", "شاليهات مخدومة", "حياة مجتمعية"],
    bodyAr: [
      "الأمن على مدار الساعة والكاميرات والجدران الخاصة تخلق بيئة مطمئنة للعائلات.",
      "المرافق المشتركة — من المساحات الخضراء إلى البنية التحتية الرقمية — تجعل الحياة اليومية أسهل.",
      "في الوقت نفسه تبقى كل وحدة مستقلة بخصوصيتها الكاملة واستثمارها الخاص.",
    ],
    bodyEn: [
      "24/7 security, cameras, and privacy walls create a reassuring family environment.",
      "Shared amenities — from green spaces to digital infrastructure — ease daily life.",
      "Meanwhile each unit stays independent with full privacy and its own investment value.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
