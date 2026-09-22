/** Home + amenities page — JG-style hover facility cards, Giving City content. */

export type AmenityFeature = {
  id: string;
  icon: "pool" | "security" | "fiber" | "kids" | "bbq" | "walls" | "parking" | "green";
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
    image: "/gallery/img_29.jpg",
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
    image: "/gallery/img_3.jpg",
  },
  {
    id: "fiber",
    icon: "fiber",
    titleAr: "إنترنت ألياف ضوئية",
    titleEn: "Fiber internet",
    tagsAr: ["ألياف ضوئية", "ستلايت وتكييف"],
    tagsEn: ["Fiber optic", "Satellite & AC"],
    descAr:
      "بنية تحتية رقمية مكتملة — إنترنت ألياف، أنظمة ستلايت، وتكييف جاهز لكل وحدة.",
    descEn:
      "Complete digital infrastructure — fiber internet, satellite systems, and AC ready in every unit.",
    image: "/gallery/img_31.jpg",
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
    image: "/gallery/img_33.jpg",
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
    image: "/gallery/img_35.jpg",
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
    image: "/gallery/img_5.jpg",
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
    image: "/gallery/img_7.jpg",
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
    image: "/gallery/img_37.jpg",
  },
];
