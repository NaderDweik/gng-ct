/** Single-resort property map currently stands in as the master-plan visual. */
export const masterPlanMapSrc = "/plans/property-map.png";
/** Intrinsic size of the map (for layout + spot coordinates). */
export const masterPlanMapSize = { width: 952, height: 1024 } as const;

export const masterPlanCopy = {
  ar: {
    eyebrow: "المخطط العام",
    title: "٥٠٠ م² من المنتجع الخاص، مخطّطة بعناية.",
    lead: "داخلٌ مدروس، ومسبح في قلب الساحة، ومعيشة خارجية، وخصوصية تامة — داخل مجتمع مسوّر.",
    mapAlt: "مخطط المنتجع الخاص — الطابق والموقع",
    explorerEyebrow: "استكشف المخطط",
    explorerTitle: "كل ركن، في مكانه.",
    explorerHint: "مرّر فوق أي مساحة في المخطط، أو اضغط على رقمها.",
    caption: "مخطط وحدة المنتجع · ٥٠٠ م² · سند ملكية مستقل",
    reset: "عرض المخطط كاملًا",
  },
  en: {
    eyebrow: "Master plan",
    title: "500 m² of private resort, planned to the metre.",
    lead: "Considered interiors, a pool at the heart of the courtyard, outdoor living and complete privacy — inside a gated community.",
    mapAlt: "Private resort property map — floor plan and site",
    explorerEyebrow: "Explore the plan",
    explorerTitle: "Every corner, in its place.",
    explorerHint: "Hover any space on the plan, or tap its number.",
    caption: "Resort unit plan · 500 m² · independent deed",
    reset: "Show the whole plan",
  },
} as const;

/**
 * A highlighted area as a rectangle in the map image's own pixels
 * (`masterPlanMapSize`), measured from its walls / edges — so the highlight
 * frames the space exactly.
 */
export type PlanArea = { x: number; y: number; w: number; h: number };

export type PlanItem = {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  /** One or two areas on the map (both light up together). */
  areas: [PlanArea] | [PlanArea, PlanArea];
};

export type PlanZone = { id: string; titleAr: string; titleEn: string; items: PlanItem[] };

export const masterPlanZones: PlanZone[] = [
  {
    id: "interiors",
    titleAr: "الداخل",
    titleEn: "Interiors",
    items: [
      {
        id: "living",
        titleAr: "غرفة المعيشة",
        titleEn: "Living room",
        bodyAr: "معيشة مفتوحة في قلب البيت، بين جناحي غرف النوم.",
        bodyEn: "Open living at the heart of the house, between the two bedroom wings.",
        areas: [{ x: 330, y: 195, w: 190, h: 262 }],
      },
      {
        id: "kitchen",
        titleAr: "المطبخ",
        titleEn: "Kitchen",
        bodyAr: "مطبخ مجهز بالكامل ينفتح على غرفة المعيشة.",
        bodyEn: "A fully equipped kitchen opening straight onto the living room.",
        areas: [{ x: 330, y: 117, w: 190, h: 78 }],
      },
      {
        id: "master",
        titleAr: "الجناح الرئيسي",
        titleEn: "Master suite",
        bodyAr: "غرفة النوم الرئيسية مع شرفتها المطلة على المسبح.",
        bodyEn: "The master bedroom, with its own terrace looking onto the pool.",
        areas: [{ x: 120, y: 305, w: 210, h: 153 }],
      },
      {
        id: "bedrooms",
        titleAr: "غرفتا نوم",
        titleEn: "Two bedrooms",
        bodyAr: "غرفتان إضافيتان في الجناح الآخر من البيت.",
        bodyEn: "Two further bedrooms in the opposite wing of the house.",
        areas: [
          { x: 520, y: 117, w: 180, h: 193 },
          { x: 520, y: 310, w: 180, h: 148 },
        ],
      },
      {
        id: "baths",
        titleAr: "الحمامات والجاكوزي",
        titleEn: "Bathrooms & jacuzzi",
        bodyAr: "حمامان بتشطيبات إيطالية، وجاكوزي خاص.",
        bodyEn: "Two bathrooms with Italian finishes, and a private jacuzzi.",
        areas: [
          { x: 120, y: 117, w: 210, h: 188 },
          { x: 700, y: 142, w: 82, h: 270 },
        ],
      },
    ],
  },
  {
    id: "outdoors",
    titleAr: "الخارج",
    titleEn: "Outdoors",
    items: [
      {
        id: "pool",
        titleAr: "المسبح الخاص",
        titleEn: "Private pool",
        bodyAr: "المسبح الرئيسي في قلب الساحة، محاط بالحجر.",
        bodyEn: "The main pool at the centre of the courtyard, framed in stone.",
        areas: [{ x: 182, y: 590, w: 465, h: 205 }],
      },
      {
        id: "lounge",
        titleAr: "جلسة خارجية",
        titleEn: "Outdoor lounge",
        bodyAr: "جلسة واسعة بجانب المسبح للأمسيات.",
        bodyEn: "A generous poolside lounge for long evenings.",
        areas: [{ x: 720, y: 596, w: 147, h: 194 }],
      },
      {
        id: "terraces",
        titleAr: "شرفات مظللة",
        titleEn: "Covered terraces",
        bodyAr: "جلسات مظللة أمام كل جناح.",
        bodyEn: "Shaded seating in front of each bedroom wing.",
        areas: [
          { x: 100, y: 458, w: 230, h: 57 },
          { x: 520, y: 458, w: 200, h: 57 },
        ],
      },
      {
        id: "bbq",
        titleAr: "الشواء والطعام",
        titleEn: "BBQ & dining",
        bodyAr: "طاولة لثمانية أشخاص بجانب الشواء.",
        bodyEn: "Outdoor dining for eight, right beside the grill.",
        areas: [{ x: 0, y: 568, w: 135, h: 167 }],
      },
      {
        id: "garden-dining",
        titleAr: "طعام في الحديقة",
        titleEn: "Garden dining",
        bodyAr: "طاولة ثانية على جهة الحديقة قرب المطبخ.",
        bodyEn: "A second table on the garden side, just off the kitchen.",
        areas: [{ x: 428, y: 28, w: 86, h: 82 }],
      },
      {
        id: "kids",
        titleAr: "ملعب الأطفال",
        titleEn: "Kids’ play lawn",
        bodyAr: "عشب ومنزلق للأطفال على مرأى من المسبح.",
        bodyEn: "A lawn and slide for the kids, in sight of the pool.",
        areas: [{ x: 218, y: 845, w: 334, h: 147 }],
      },
      {
        id: "chess",
        titleAr: "شطرنج عملاق",
        titleEn: "Giant chess",
        bodyAr: "رقعة شطرنج أرضية للعائلة والضيوف.",
        bodyEn: "A garden chessboard for family and guests.",
        areas: [{ x: 552, y: 844, w: 214, h: 148 }],
      },
      {
        id: "gardens",
        titleAr: "حدائق خاصة",
        titleEn: "Private gardens",
        bodyAr: "مسطحات خضراء على جانبي البيت.",
        bodyEn: "Lawns on both sides of the house.",
        areas: [
          { x: 12, y: 68, w: 106, h: 342 },
          { x: 782, y: 68, w: 113, h: 342 },
        ],
      },
    ],
  },
  {
    id: "privacy",
    titleAr: "الخصوصية والمواقف",
    titleEn: "Privacy & parking",
    items: [
      {
        id: "parking",
        titleAr: "موقف لسيارتين",
        titleEn: "Two-car parking",
        bodyAr: "موقفان داخل حدود الوحدة، خلف جدران الخصوصية بارتفاع ٣ أمتار.",
        bodyEn: "Two bays inside the unit boundary, behind 3-metre privacy walls.",
        areas: [
          { x: 0, y: 810, w: 148, h: 190 },
          { x: 767, y: 810, w: 185, h: 190 },
        ],
      },
    ],
  },
];
