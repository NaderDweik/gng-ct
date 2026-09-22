export type FaqItem = { qAr: string; aAr: string; qEn: string; aEn: string };
export type FaqCategory = {
  id: string;
  titleAr: string;
  titleEn: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "purchase",
    titleAr: "الشراء والتملك",
    titleEn: "Purchase & Ownership",
    items: [
      {
        qAr: "ما هو سعر الشاليه في Giving City؟",
        aAr: "سعر الوحدة الواحدة ١٦٨,٠٠٠ دينار أردني. يتوفر خصم ١٥٪ عند الدفع نقدًا (١٤٢,٨٠٠ دينار).",
        qEn: "What is the chalet price at Giving City?",
        aEn: "One unit is 168,000 JD. A 15% cash discount brings it to 142,800 JD.",
      },
      {
        qAr: "هل أحصل على سند ملكية مستقل؟",
        aAr: "نعم، كل وحدة لها سند ملكية مستقل (طابو) بمساحة ٥٠٠ م² باسم المشتري.",
        qEn: "Do I get an independent ownership deed?",
        aEn: "Yes. Every unit has an independent deed (tabou) for 500 m² in the buyer’s name.",
      },
      {
        qAr: "هل يوجد فوائد على التقسيط؟",
        aAr: "لا، جميع خطط الدفع بدون فوائد ومباشرة مع الشركة بدون تدخل بنكي.",
        qEn: "Is there interest on installments?",
        aEn: "No. All plans are zero-interest and direct with the company — no bank.",
      },
      {
        qAr: "ما هي خطط الدفع المتاحة؟",
        aAr: "ثلاث خطط: دفعة أولى ٣٥٪ مع استلام فوري (٢٠٢٥)، أو ٢٥٪ مع استلام ٢٠٢٦، أو ١٥٪ مع استلام ٢٠٢٧. الأقساط الشهرية تبدأ من ١,٠٠٠ دينار.",
        qEn: "What payment plans are available?",
        aEn: "Three plans: 35% down with 2025 move-in, 25% with 2026, or 15% with 2027. Monthly from 1,000 JD.",
      },
      {
        qAr: "هل يمكنني إعادة بيع الوحدة؟",
        aAr: "نعم، بما أنك تملك سند ملكية مستقل، يمكنك البيع أو التأجير بحرية.",
        qEn: "Can I resell the unit?",
        aEn: "Yes. With an independent deed you may sell or rent freely.",
      },
    ],
  },
  {
    id: "specs",
    titleAr: "المواصفات والجودة",
    titleEn: "Specs & Quality",
    items: [
      {
        qAr: "ما هي مساحة الشاليه؟",
        aAr: "٥٠٠ م² تشمل ٣ غرف نوم (منها ماستر)، حمامين، جاكوزي خاص، صالة واسعة، مطبخ مجهز، مسبح كبير + مسبح أطفال، كراج لسيارتين، منطقة BBQ وبرجولا.",
        qEn: "What is the chalet size?",
        aEn: "500 m² with 3 bedrooms (master), 2 baths, jacuzzi, living room, kitchen, main + kids pools, 2-car garage, BBQ and pergola.",
      },
      {
        qAr: "ما معنى شهادة ISO 9001:2015؟",
        aAr: "هي شهادة دولية لنظام إدارة الجودة، تضمن أن جميع مراحل البناء والتشطيب تتم وفق معايير عالمية موحدة.",
        qEn: "What does ISO 9001:2015 mean?",
        aEn: "An international quality-management certification ensuring construction and finishing follow global standards.",
      },
      {
        qAr: "ما هي مواد البناء المستخدمة؟",
        aAr: "أساسات خرسانية مسلحة وفق كود البناء الأردني، جدران ثيرموستون للعزل، بورسلان فاخر مع إضاءة LED، دهانات Super Crown/Jotun، أدوات صحية إيطالية، واجهات بعزل إسباني.",
        qEn: "What materials are used?",
        aEn: "Jordan-code reinforced concrete, thermostone walls, luxury porcelain with LED, Super Crown/Jotun paints, Italian fixtures, Spanish-insulated facades.",
      },
    ],
  },
  {
    id: "location",
    titleAr: "الموقع والمرافق",
    titleEn: "Location & Amenities",
    items: [
      {
        qAr: "أين يقع مشروع Giving City؟",
        aAr: "يبعد ٣٩ كم من فندق الرويال باتجاه سحاب الحطمية، بالقرب من عمّان.",
        qEn: "Where is Giving City located?",
        aEn: "39 km from the Royal Hotel towards Sahab Al-Hatmiyeh, near Amman.",
      },
      {
        qAr: "ما هي المرافق المتوفرة داخل المشروع؟",
        aAr: "مجتمع مسوّر بحراسة أمنية على مدار الساعة، كاميرات مراقبة، إنترنت ألياف ضوئية، أنظمة تكييف وستلايت، أنظمة مياه بمضخات أوتوماتيكية، فلترة مسابح متطورة، مساحات خضراء وحدائق.",
        qEn: "What amenities exist on site?",
        aEn: "Gated 24/7 security, cameras, fiber internet, AC and satellite, automatic water pumps, pool filtration, green spaces and gardens.",
      },
      {
        qAr: "هل يوجد حراسة أمنية؟",
        aAr: "نعم، المشروع مغلق (gated community) مع حراسة أمنية وكاميرات مراقبة على مدار الساعة، وجدران بارتفاع ٣ أمتار لكل وحدة.",
        qEn: "Is there security?",
        aEn: "Yes — gated community with 24/7 guards and cameras, plus 3-meter privacy walls per unit.",
      },
    ],
  },
  {
    id: "contact",
    titleAr: "التواصل",
    titleEn: "Contact",
    items: [
      {
        qAr: "كيف أتواصل مع فريق المبيعات؟",
        aAr: "عبر الواتساب أو الاتصال على الرقم +٩٦٢٧٩٠٠٢٩٩٢٨، أو زيارة مكتبنا أيام الأحد–الخميس (٩ صباحًا – ٧ مساءً) والسبت (١٠ صباحًا – ٤ مساءً).",
        qEn: "How do I reach sales?",
        aEn: "WhatsApp or call +962790029928, or visit Sun–Thu 9–7 and Sat 10–4.",
      },
      {
        qAr: "هل يمكنني زيارة الموقع؟",
        aAr: "بالتأكيد! يمكنك زيارة مكتبنا للاطلاع على المخططات والتفاصيل، أو ترتيب زيارة للموقع مباشرة.",
        qEn: "Can I visit the site?",
        aEn: "Absolutely. Visit our office for plans and details, or arrange a direct site visit.",
      },
    ],
  },
];

/** Curated home FAQ preview — JG-style numbered accordion (5 items). */
export const homeFaqPreview: FaqItem[] = [
  faqCategories[2].items[0], // where
  faqCategories[0].items[0], // price
  faqCategories[0].items[1], // deed
  faqCategories[0].items[2], // interest
  faqCategories[0].items[3], // payment plans
];
