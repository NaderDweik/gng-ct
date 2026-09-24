/** Home + amenities page — JG-style hover facility cards, Giving City content. */

export type AmenityFeature = {
  id: string;
  icon: "pool" | "security" | "interior" | "kids" | "bbq" | "walls" | "parking" | "green";
  titleAr: string;
  titleEn: string;
  tagsAr: string[];
  tagsEn: string[];
  descAr: string;
  descEn: string;
  /** Gallery still used as hover / mobile background */
  image: string;
};

export const amenitiesIntro = {
  eyebrowAr: "المرافق",
  eyebrowEn: "Amenities",
  titleAr: "عالم خاص، داخل مجتمعك.",
  titleEn: "A private world, inside your community.",
  subAr:
    "من المسبح الخاص في كل وحدة إلى الحراسة على مدار الساعة — صُممت كل مرفق في Giving City بنفس العناية الموجهة للمنازل نفسها.",
  subEn:
    "From the private pool in every unit to 24/7 security — every amenity at Giving City is designed with the same care as the homes themselves.",
} as const;

export const amenityFeatures: AmenityFeature[] = [
  {
    id: "pool",
    icon: "pool",
    titleAr: "مسبح خاص لكل وحدة",
    titleEn: "Private pool per unit",
    tagsAr: ["مساحة الوحدة: ٥٠٠ م²", "مسبح كبير + مسبح أطفال"],
    tagsEn: ["Unit area: 500 m²", "Main pool + kids’ pool"],
    descAr:
      "كل منتجع يتضمن مسبحاً خاصاً ومسبح أطفال — خصوصية كاملة داخل وحدتك، لا مشاركة مع الجيران.",
    descEn:
      "Every resort includes a private main pool and kids’ pool — full privacy inside your unit, never shared with neighbors.",
    image: "/gallery/resortsPics/swimmer-pool-waterfall.png",
  },
  {
    id: "security",
    icon: "security",
    titleAr: "أمن على مدار الساعة",
    titleEn: "24/7 security",
    tagsAr: ["مجتمع مسوّر", "حراسة وكاميرات"],
    tagsEn: ["Gated community", "Guards & cameras"],
    descAr:
      "حراسة أمنية وكاميرات مراقبة على مدار الساعة — مجتمع مغلق يمنحك راحة البال لعائلتك واستثمارك.",
    descEn:
      "Round-the-clock guards and CCTV — a gated community that protects your family and your investment.",
    image: "/gallery/compoundPics/security-guards-patrol-compound-o.png",
  },
  {
    id: "interior",
    icon: "interior",
    titleAr: "تصميم داخلي فاخر",
    titleEn: "Refined interiors",
    tagsAr: ["تشطيبات فاخرة", "مدفأة ومطبخ مجهز"],
    tagsEn: ["Premium finishes", "Fireplace & fitted kitchen"],
    descAr:
      "غرف معيشة دافئة بمدفأة، مطبخ مجهز بالكامل، وغرف نوم تطل على المسبح — تشطيبات فاخرة وضوء طبيعي في كل زاوية.",
    descEn:
      "Warm living rooms with a fireplace, a fully fitted kitchen, and bedrooms that open onto the pool — premium finishes and natural light throughout.",
    image: "/gallery/resortsPics/family-living-room.png",
  },
  {
    id: "kids",
    icon: "kids",
    titleAr: "مناطق الأطفال",
    titleEn: "Children’s areas",
    tagsAr: ["مساحات لعب آمنة"],
    tagsEn: ["Safe play spaces"],
    descAr:
      "مساحات لعب آمنة قريبة من المنازل — راحة للعائلات دون الابتعاد عن خصوصية الوحدة.",
    descEn:
      "Safe play spaces close to home — family comfort without leaving unit privacy behind.",
    image: "/gallery/compoundPics/kids-cycling-community-street.png",
  },
  {
    id: "bbq",
    icon: "bbq",
    titleAr: "برجولات ومناطق BBQ",
    titleEn: "Pergolas & BBQ",
    tagsAr: ["جلسات خارجية", "شواء خاص"],
    tagsEn: ["Outdoor seating", "Private BBQ"],
    descAr:
      "برجولات ومناطق شواء لكل وحدة — أسلوب حياة خارجي فاخر بجانب المسبح والحديقة الخاصة.",
    descEn:
      "Pergolas and BBQ for every unit — outdoor living beside your private pool and garden.",
    image: "/gallery/resortsPics/father-son-bbq-grill.png",
  },
  {
    id: "walls",
    icon: "walls",
    titleAr: "خصوصية تامة",
    titleEn: "Complete privacy",
    tagsAr: ["جدران بارتفاع ٣ أمتار"],
    tagsEn: ["3-meter perimeter walls"],
    descAr:
      "جدران بارتفاع ٣ أمتار حول كل وحدة — خصوصية بصرية وصوتية تجعل منتجعك عالماً خاصاً بك.",
    descEn:
      "Three-meter walls around every unit — visual and acoustic privacy that makes your resort truly yours.",
    image: "/gallery/resortsPics/garden-lounge-kids-swing.png",
  },
  {
    id: "parking",
    icon: "parking",
    titleAr: "مواقف السيارات",
    titleEn: "Parking",
    tagsAr: ["كراج لسيارتين", "مواقف زوار"],
    tagsEn: ["2-car garage", "Visitor parking"],
    descAr:
      "كراج لسيارتين ضمن كل وحدة، مع مواقف مخصصة للزوار داخل المجتمع المسوّر.",
    descEn:
      "A two-car garage in every unit, plus dedicated visitor parking inside the gated community.",
    image: "/gallery/resortsPics/family-arriving-resort-a9-garage.png",
  },
  {
    id: "green",
    icon: "green",
    titleAr: "مساحات خضراء وحدائق",
    titleEn: "Green spaces & gardens",
    tagsAr: ["٥٠٠,٠٠٠ م² إجمالي المشروع", "حدائق منسقة"],
    tagsEn: ["500,000 m² total site", "Landscaped gardens"],
    descAr:
      "حدائق ومساحات خضراء مخدومة عبر المشروع — بيئة خارجية هادئة لجميع الأعمار.",
    descEn:
      "Serviced gardens and green spaces across the project — a calm outdoor setting for every age.",
    image: "/gallery/compoundPics/community-park-families.png",
  },
];
