/**
 * Home "inside your chalet" cards + the amenities page chapters. Everything here is
 * inside the chalet's own walls (the unit plan, content/master-plan.ts); shared
 * compound places and services live on /amenities and /services.
 */

export type AmenityFeature = {
  id: string;
  icon: "pool" | "jacuzzi" | "interior" | "kids" | "bbq" | "walls" | "parking" | "green";
  titleAr: string;
  titleEn: string;
  tagsAr: string[];
  tagsEn: string[];
  /** Full description — the /amenities page. */
  descAr: string;
  descEn: string;
  /** One short, scannable line — the home page cards. */
  shortAr: string;
  shortEn: string;
  /** Gallery still used as hover / mobile background */
  image: string;
};

export const amenitiesIntro = {
  eyebrowAr: "المرافق",
  eyebrowEn: "Amenities",
  titleAr: "عالمك الخاص، داخل شاليهك.",
  titleEn: "Your own world, inside your chalet.",
  subAr: "كل ما تحتاجه العائلة خلف جدران شاليهك، لك وحدك.",
  subEn: "Everything a family needs behind your chalet’s own walls, yours alone.",
} as const;

export const amenityFeatures: AmenityFeature[] = [
  {
    id: "pool",
    icon: "pool",
    shortAr: "مسبح رئيسي ومسبح أطفال في كل وحدة.",
    shortEn: "A main pool and kids’ pool in every unit.",
    titleAr: "مسبح خاص لكل وحدة",
    titleEn: "Private pool per unit",
    tagsAr: ["مساحة الوحدة: ٥٠٠ م²", "مسبح كبير + مسبح أطفال"],
    tagsEn: ["Unit area: 500 m²", "Main pool + kids’ pool"],
    descAr:
      "كل شاليه يتضمن مسبحاً خاصاً ومسبح أطفال. خصوصية كاملة داخل وحدتك، لا مشاركة مع الجيران.",
    descEn:
      "Every resort includes a private main pool and kids’ pool. Full privacy inside your unit, never shared with neighbors.",
    image: "/gallery/resortsPics/swimmer-pool-waterfall.png",
  },
  {
    id: "interior",
    icon: "interior",
    shortAr: "مدفأة ومطبخ مجهّز وغرف تطل على المسبح.",
    shortEn: "A fireplace, fitted kitchen, rooms onto the pool.",
    titleAr: "تصميم داخلي فاخر",
    titleEn: "Refined interiors",
    tagsAr: ["تشطيبات فاخرة", "مدفأة ومطبخ مجهز"],
    tagsEn: ["Premium finishes", "Fireplace & fitted kitchen"],
    descAr:
      "غرف معيشة دافئة بمدفأة، مطبخ مجهز بالكامل، وغرف نوم تطل على المسبح. تشطيبات فاخرة وضوء طبيعي في كل زاوية.",
    descEn:
      "Warm living rooms with a fireplace, a fully fitted kitchen, and bedrooms that open onto the pool. Premium finishes and natural light throughout.",
    image: "/gallery/resortsPics/family-living-room.png",
  },
  {
    id: "jacuzzi",
    icon: "jacuzzi",
    shortAr: "جاكوزي خاص وحمامات بتشطيبات إيطالية.",
    shortEn: "A private jacuzzi and Italian-finish baths.",
    titleAr: "جاكوزي وحمامات فاخرة",
    titleEn: "Jacuzzi & fine bathrooms",
    tagsAr: ["جاكوزي خاص", "تشطيبات إيطالية"],
    tagsEn: ["Private jacuzzi", "Italian finishes"],
    descAr:
      "جاكوزي خاص في الجناح الرئيسي، وحمامات بتشطيبات إيطالية، لاسترخاء دون مغادرة البيت.",
    descEn:
      "A private jacuzzi in the master suite and bathrooms with Italian finishes: unwind without leaving home.",
    image: "/gallery/resortsPics/bathroom-jacuzzi-tub.png",
  },
  {
    id: "bbq",
    icon: "bbq",
    shortAr: "برجولا وشواء خاص بجانب مسبحك.",
    shortEn: "Your own pergola and grill, by the pool.",
    titleAr: "برجولات ومناطق BBQ",
    titleEn: "Pergolas & BBQ",
    tagsAr: ["جلسات خارجية", "شواء خاص"],
    tagsEn: ["Outdoor seating", "Private BBQ"],
    descAr:
      "برجولا وشواء خاص وطاولة لثمانية أشخاص بجانب مسبحك، أسلوب حياة خارجي داخل شاليهك.",
    descEn:
      "Your own pergola, grill and a table for eight beside your pool: outdoor living inside your chalet.",
    image: "/gallery/resortsPics/father-son-bbq-grill.png",
  },
  {
    id: "kids",
    icon: "kids",
    shortAr: "عشب ومنزلق للأطفال على مرأى من المسبح.",
    shortEn: "A lawn and slide for the kids, in sight of the pool.",
    titleAr: "ركن أطفال خاص",
    titleEn: "Kids’ own corner",
    tagsAr: ["عشب ومنزلق", "شطرنج عملاق"],
    tagsEn: ["Lawn & slide", "Giant chess"],
    descAr:
      "ملعب عشب بمنزلق ورقعة شطرنج عملاقة داخل شاليهك، يلعب فيها الأطفال وأنت تراهم من المسبح.",
    descEn:
      "A lawn with a slide and a giant chessboard inside your chalet, where the kids play in sight of the pool.",
    image: "/gallery/resortsPics/foosball-kids-pool.png",
  },
  {
    id: "green",
    icon: "green",
    shortAr: "مسطحات خضراء على جانبي البيت.",
    shortEn: "Lawns on both sides of the house.",
    titleAr: "حديقة خاصة",
    titleEn: "Private garden",
    tagsAr: ["على جانبي البيت", "جلسات وأرجوحة"],
    tagsEn: ["Both sides of the house", "Seating & swing"],
    descAr:
      "مسطحات خضراء على جانبي البيت بجلسات وأرجوحة، حديقتك أنت داخل حدود الشاليه.",
    descEn:
      "Lawns on both sides of the house with seating and a swing: your own garden, inside the chalet’s boundary.",
    image: "/gallery/resortsPics/garden-lounge-kids-swing.png",
  },
  {
    id: "walls",
    icon: "walls",
    shortAr: "جدران بارتفاع ٣ أمتار حول كل وحدة.",
    shortEn: "3-metre walls around every unit.",
    titleAr: "خصوصية تامة",
    titleEn: "Complete privacy",
    tagsAr: ["جدران بارتفاع ٣ أمتار"],
    tagsEn: ["3-meter perimeter walls"],
    descAr:
      "جدران بارتفاع ٣ أمتار حول كل وحدة: خصوصية بصرية وصوتية تجعل شاليهك عالماً خاصاً بك.",
    descEn:
      "Three-meter walls around every unit: visual and acoustic privacy that makes your resort truly yours.",
    image: "/gallery/resortsPics/family-entering-resort-front-door.png",
  },
  {
    id: "parking",
    icon: "parking",
    shortAr: "كراج لسيارتين داخل حدود الشاليه.",
    shortEn: "A 2-car garage inside the chalet’s walls.",
    titleAr: "مواقف السيارات",
    titleEn: "Parking",
    tagsAr: ["كراج لسيارتين", "داخل الأسوار"],
    tagsEn: ["2-car garage", "Inside the walls"],
    descAr:
      "كراج لسيارتين ضمن حدود الشاليه، خلف جدران الخصوصية، تصل منه إلى بيتك مباشرة.",
    descEn:
      "A two-car garage within the chalet’s boundary, behind the privacy walls, straight to your front door.",
    image: "/gallery/resortsPics/family-arriving-resort-a9-garage.png",
  },
];
