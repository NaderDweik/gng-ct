/** Single-resort property map currently stands in as the master-plan visual. */
export const masterPlanMapSrc = "/plans/property-map.png";
/** Intrinsic size of the map (for layout + spot coordinates). */
export const masterPlanMapSize = { width: 952, height: 1024 } as const;

export const masterPlanCopy = {
  ar: {
    eyebrow: "المخطط",
    title: "٥٠٠ م² من الشاليه الخاص، مخطّطة بعناية.",
    lead: "داخلٌ مدروس، ومسبح في قلب الساحة، ومعيشة خارجية، وخصوصية تامة، داخل كمباوند مسوّر.",
    mapAlt: "مخطط الشاليه الخاص: الطابق والموقع",
    explorerEyebrow: "استكشف المخطط",
    explorerTitle: "",
    explorerHint: "مرّر فوق أي مساحة في المخطط، أو اخترها من القائمة.",
    caption: "مخطط وحدة الشاليه · ٥٠٠ م²",
    reset: "عرض المخطط كاملًا",
    turnHover: "الآن دورك: اكتشف المخطط",
    turnTap: "الآن دورك: المس أي مساحة",
    turnSub: "كل مساحة تُضاء وتحكي قصتها.",
    dims: "٥٠٠ م² · شاليه خاص",
  },
  en: {
    eyebrow: "The plan",
    title: "500 m² of private resort, planned to the metre.",
    lead: "Considered interiors, a pool at the heart of the courtyard, outdoor living and complete privacy, inside a gated community.",
    mapAlt: "Private resort property map: floor plan and site",
    explorerEyebrow: "Explore the plan",
    explorerTitle: "Chalet",
    explorerHint: "Hover any space on the plan, or pick one from the list.",
    caption: "Resort unit plan · 500 m²",
    reset: "Show the whole plan",
    turnHover: "Now it’s your turn: discover the plan",
    turnTap: "Now it’s your turn: tap any space",
    turnSub: "Every space lights up and tells its story.",
    dims: "500 m² · private resort",
  },
} as const;

/**
 * A highlighted area as a rectangle in the map image's own pixels
 * (`masterPlanMapSize`), measured from its walls / edges — so the highlight
 * frames the space exactly.
 */
export type PlanArea = {
  x: number;
  y: number;
  w: number;
  h: number;
  /**
   * Walkthrough clip(s) of this room, by the sender's number (`public/chalet-video/clip-NN.mp4`,
   * see `chaletVideoSrc`). Several clips play one after another. Rooms sharing a clip light up
   * together while it plays.
   */
  clips?: readonly string[];
};

export type PlanItem = {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  /** The rooms of this space on the map; the current room is outlined, the others of the
   *  same space show their colour. */
  areas: readonly PlanArea[];
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
        areas: [{ x: 330, y: 195, w: 190, h: 262, clips: ["12"] }],
      },
      {
        id: "kitchen",
        titleAr: "المطبخ",
        titleEn: "Kitchen",
        bodyAr: "مطبخ مجهز بالكامل ينفتح على غرفة المعيشة.",
        bodyEn: "A fully equipped kitchen opening straight onto the living room.",
        areas: [{ x: 330, y: 117, w: 190, h: 78, clips: ["15"] }],
      },
      {
        id: "master",
        titleAr: "الجناح الرئيسي",
        titleEn: "Master suite",
        bodyAr: "غرفة النوم الرئيسية مع شرفتها المطلة على المسبح.",
        bodyEn: "The master bedroom, with its own terrace looking onto the pool.",
        areas: [{ x: 120, y: 305, w: 210, h: 153, clips: ["11"] }],
      },
      {
        id: "bedrooms",
        titleAr: "غرفتا نوم",
        titleEn: "Two bedrooms",
        bodyAr: "غرفتان إضافيتان في الجناح الآخر من البيت.",
        bodyEn: "Two further bedrooms in the opposite wing of the house.",
        areas: [
          { x: 520, y: 117, w: 180, h: 193, clips: ["14"] },
          { x: 520, y: 310, w: 180, h: 148, clips: ["13"] },
        ],
      },
      {
        id: "baths",
        titleAr: "الحمامات والجاكوزي",
        titleEn: "Bathrooms & jacuzzi",
        bodyAr: "حمامان بتشطيبات إيطالية، وجاكوزي خاص.",
        bodyEn: "Two bathrooms with Italian finishes, and a private jacuzzi.",
        areas: [
          // West block: the jacuzzi room (with the shower and toilet under it), then the two
          // rooms beside it (top: toilet and basin, bottom: the vanity).
          { x: 120, y: 117, w: 106, h: 188, clips: ["16"] },
          { x: 226, y: 117, w: 104, h: 110, clips: ["17"] },
          { x: 226, y: 227, w: 104, h: 78, clips: ["16"] },
          // East column: the two bedroom bathrooms, upper and lower.
          { x: 700, y: 142, w: 82, h: 135, clips: ["18"] },
          { x: 700, y: 277, w: 82, h: 135, clips: ["19"] },
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
        areas: [{ x: 182, y: 590, w: 465, h: 205, clips: ["06", "x64", "x78"] }],
      },
      {
        id: "lounge",
        titleAr: "جلسة خارجية",
        titleEn: "Outdoor lounge",
        bodyAr: "جلسة واسعة بجانب المسبح للأمسيات.",
        bodyEn: "A generous poolside lounge for long evenings.",
        areas: [{ x: 720, y: 596, w: 147, h: 194, clips: ["05"] }],
      },
      {
        id: "terraces",
        titleAr: "شرفات مظللة",
        titleEn: "Covered terraces",
        bodyAr: "جلسات مظللة أمام كل جناح.",
        bodyEn: "Shaded seating in front of each bedroom wing.",
        areas: [
          { x: 100, y: 458, w: 230, h: 57, clips: ["x80"] },
          { x: 520, y: 458, w: 200, h: 57, clips: ["x80"] },
        ],
      },
      {
        id: "bbq",
        titleAr: "الشواء والطعام",
        titleEn: "BBQ & dining",
        bodyAr: "طاولة لثمانية أشخاص بجانب الشواء.",
        bodyEn: "Outdoor dining for eight, right beside the grill.",
        areas: [{ x: 0, y: 568, w: 135, h: 167, clips: ["07"] }],
      },
      {
        id: "garden-dining",
        titleAr: "طعام في الحديقة",
        titleEn: "Garden dining",
        bodyAr: "طاولة ثانية على جهة الحديقة قرب المطبخ.",
        bodyEn: "A second table on the garden side, just off the kitchen.",
        areas: [{ x: 428, y: 28, w: 86, h: 82, clips: ["10"] }],
      },
      {
        id: "kids",
        titleAr: "مساحة خاصة",
        titleEn: "Private area",
        bodyAr: "مساحة مظللة لك ولضيوفك بجانب المسبح، للجلسات والأمسيات.",
        bodyEn: "A shaded space beside the pool for you and your guests, for gatherings and evenings.",
        areas: [{ x: 218, y: 845, w: 334, h: 147, clips: ["04"] }],
      },
      {
        id: "chess",
        titleAr: "شطرنج عملاق",
        titleEn: "Giant chess",
        bodyAr: "رقعة شطرنج أرضية للعائلة والضيوف.",
        bodyEn: "A garden chessboard for family and guests.",
        areas: [{ x: 552, y: 844, w: 214, h: 148, clips: ["20"] }],
      },
      {
        id: "gardens",
        titleAr: "حدائق خاصة",
        titleEn: "Private gardens",
        bodyAr: "مسطحات خضراء على جانبي البيت.",
        bodyEn: "Lawns on both sides of the house.",
        areas: [
          { x: 12, y: 68, w: 106, h: 342, clips: ["08"] },
          { x: 782, y: 68, w: 113, h: 342, clips: ["09"] },
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
          { x: 0, y: 810, w: 148, h: 190, clips: ["02"] },
          { x: 767, y: 810, w: 185, h: 190, clips: ["03"] },
        ],
      },
    ],
  },
];

/**
 * /units "plan with features" section (features/units/UnitPlanFeatures): the explorer's
 * plan with these room tiles beside it. Tiles reuse the explorer items above by id.
 */
/** Two columns of seven: every explorer item, grouped under the `unitPlanPanel` labels. */
export const unitPlanColumns = [
  [
    { label: "inside", ids: ["living", "kitchen", "master", "bedrooms", "baths"] },
    { label: "terraces", ids: ["gardens"] },
  ],
  [{ label: "outside", ids: ["pool", "lounge", "bbq", "garden-dining", "kids", "chess", "parking"] }],
] as const;

/** /units plan section: column labels for the room tiles and the facts bar under them. */
export const unitPlanPanel = {
  en: {
    inside: "Inside the house",
    terraces: "Terraces & gardens",
    outside: "Outdoors",
    facts: [
      { label: "Plot", value: "500 m²" },
      { label: "Price from", value: "168,000 JD" },
      { label: "Handover", value: "Per chalet" },
    ],
    cta: "Register interest",
  },
  ar: {
    inside: "داخل المنزل",
    terraces: "الشرفات والحدائق",
    outside: "المساحات الخارجية",
    facts: [
      { label: "المساحة", value: "٥٠٠ م²" },
      { label: "السعر يبدأ من", value: "١٦٨,٠٠٠ د.أ" },
      { label: "التسليم", value: "حسب الشاليه" },
    ],
    cta: "سجل اهتمامك",
  },
  href: "/register",
} as const;

/** /master-plan room viewer: a photo for each plan space (real resort photos; terraces
 *  and kids' area have no dedicated shot yet, so they borrow the closest scene). */
const R = "/gallery/resortsPics";
export const planItemPhotos: Record<string, string> = {
  living: `${R}/family-living-room.jpg`,
  kitchen: `${R}/kitchen-and-laundry.jpg`,
  master: `${R}/master-bedroom-pool-view.jpg`,
  bedrooms: `${R}/twin-bedroom-pool-view.jpg`,
  baths: `${R}/bathroom-jacuzzi-tub.jpg`,
  terraces: `${R}/pool-and-tent-pavilion-hd.jpg`,
  gardens: `${R}/garden-lounge-kids-swing.jpg`,
  pool: `${R}/swimmer-pool-waterfall.jpg`,
  lounge: `${R}/family-lounge-under-pergola.jpg`,
  bbq: `${R}/father-son-bbq-grill.jpg`,
  "garden-dining": `${R}/family-breakfast-poolside-table.jpg`,
  kids: `${R}/foosball-kids-pool.jpg`,
  chess: `${R}/giant-chess-poolside-royal.jpg`,
  parking: `${R}/family-arriving-resort-a9-garage.jpg`,
};

/**
 * The client's walkthrough videos (received 2026-10-19), numbered 1 to 20 by the sender against
 * a hand-marked copy of the plan; x64, x78 and x80 are unnumbered extras. 4K originals stay in
 * Downloads; `public/chalet-video/clip-NN.mp4` (1440 wide) and `clip-NN-720.mp4` (960 wide,
 * phones) are muted H.264 renditions. Which clip belongs to which room is on the room itself
 * (`PlanArea.clips` above). Clip 01 (the chalet's front from the street) has no room yet.
 */
/** Public path of one encoded clip; `small` picks the 720p rendition (phones). */
export const chaletVideoSrc = (clip: string, small: boolean) =>
  `/chalet-video/clip-${clip}${small ? "-720" : ""}.mp4`;

/** A space's clips in room order, each once (rooms may share one). */
export function planItemClips(item: PlanItem): string[] {
  const out: string[] = [];
  for (const a of item.areas) for (const c of a.clips ?? []) if (!out.includes(c)) out.push(c);
  return out;
}

/** The line-drawing plan shown in the room viewer: the same drawing as the colour map at
 *  the same proportions, so `PlanArea` rectangles map onto it by percentage. */
export const unitPlanLineSrc = "/plans/unit-plan.webp";

export function planItem(id: string): PlanItem | undefined {
  for (const zone of masterPlanZones) {
    const hit = zone.items.find((it) => it.id === id);
    if (hit) return hit;
  }
  return undefined;
}
