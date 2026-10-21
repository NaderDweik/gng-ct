/** `id` names the home concierge's visual answer (features/faq/HomeFaqChat.tsx). */
export type FaqItem = { id?: string; qAr: string; aAr: string; qEn: string; aEn: string };
export type FaqCategory = {
  id: string;
  titleAr: string;
  titleEn: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "compound",
    titleAr: "عن الكمباوند",
    titleEn: "The Compound",
    items: [
      {
        qAr: "ما هو كمباوند شاليهات روح العطاء، وما الذي يميّزه عن الكمباوندات العقارية الأخرى؟",
        aAr: "هو مفهوم متكامل لكمباوند شاليهات يجمع بين التملك الخاص والاستجمام والخصوصية ضمن بيئة منظمة. ويتميّز بتوفير شاليهات مستقلة ومرافق وخدمات مشتركة، ليمنح المالك تجربة تتجاوز امتلاك شاليه تقليدي.",
        qEn: "What is the Giving chalet compound, and what sets it apart from other compounds?",
        aEn: "A complete chalet-compound concept that brings together private ownership, leisure and privacy in an organised setting. Independent chalets come with shared facilities and services, giving owners far more than a traditional chalet.",
      },
      {
        id: "where",
        qAr: "أين يقع كمباوند شاليهات روح العطاء وما أبرز مميزات موقعه؟",
        aAr: "يقع الكمباوند بالقرب من جامعة ابن سينا والمطار، في موقع يجمع بين سهولة الوصول والهدوء والخصوصية، بعيداً عن الازدحام وبمناخ معتدل وجميل.",
        qEn: "Where is the Giving compound, and what makes the location special?",
        aEn: "Near Ibn Sina University and the airport: easy to reach, yet quiet and private, away from the crowds, with a mild, pleasant climate.",
      },
    ],
  },
  {
    id: "chalet",
    titleAr: "عن الشاليه",
    titleEn: "The Chalet",
    items: [
      {
        id: "size",
        qAr: "ما مساحة الأرض والبناء لكل شاليه، وما أبرز مواصفاته؟",
        aAr: "تبلغ مساحة الأرض للشاليه في النموذج الحالي 500 متر مربع، ومساحة البناء 120 متراً مربعاً بما يعادل 180 متراً بناء دوبلكس. ويتميّز الشاليه بتصميم من طابق واحد يضم 3 غرف نوم ماستر وأربعة حمامات ومطبخاً، بالإضافة إلى مسبح خاص ومساحات خارجية.",
        qEn: "What are the land and built areas of each chalet, and its main specs?",
        aEn: "In the current model, each chalet sits on 500 m² of land, with 120 m² built (equivalent to 180 m² of duplex build). It is single-storey, with 3 master bedrooms, four bathrooms and a kitchen, plus a private pool and outdoor spaces.",
      },
      {
        qAr: "ما المرافق الخاصة المتوفرة في كل شاليه؟",
        aAr: "يضم الشاليه مسبحاً خاصاً بمساحة 5 × 10 أمتار، ومساحة مخصصة للأطفال، بالإضافة إلى مكان للجاكوزي وموقفين للسيارات وبرغولا وباربيكيو.",
        qEn: "What private facilities does each chalet have?",
        aEn: "A private 5 × 10 m pool, a dedicated kids' area, a jacuzzi spot, two parking spaces, a pergola and a barbecue.",
      },
      {
        qAr: "ما المرافق والخدمات المتوفرة داخل الكمباوند؟",
        aAr: "يضم الكمباوند مجموعة من المرافق والخدمات، تشمل الأمن والحراسة، ومركز الصيانة، وخدمات التدبير المنزلي للعناية بالشاليهات، وسوبر ماركت، ومصلى، وملاعب، وحدائق ومساحات خضراء مشتركة.",
        qEn: "What facilities and services are inside the compound?",
        aEn: "Security and guards, a maintenance centre, housekeeping for the chalets, a supermarket, a prayer room, sports courts, and shared gardens and green spaces.",
      },
      {
        qAr: "كيف يتم توفير الخصوصية والأمن داخل الكمباوند؟",
        aAr: "تم تصميم الشاليهات بما يراعي خصوصية المالكين، من خلال توزيع الشاليهات والمساحات الخارجية والأسوار التي تصل إلى نحو 3 أمتار وفق المخطط المعتمد. كما يتضمن الكمباوند نظاماً أمنياً يشمل الحراسة على مدار الساعة وتنظيم الدخول والخروج.",
        qEn: "How are privacy and security handled in the compound?",
        aEn: "The chalets are laid out with owners' privacy in mind: the placement of chalets and outdoor spaces, and walls of about 3 metres as per the approved plan. The compound also has a security system with round-the-clock guards and controlled entry and exit.",
      },
    ],
  },
  {
    id: "visit",
    titleAr: "المعاينة والحجز",
    titleEn: "Viewing & Booking",
    items: [
      {
        id: "visit",
        qAr: "كيف يمكنني حجز موعد لمعاينة الكمباوند؟",
        aAr: "يمكنك التواصل مع فريق خدمة العملاء لتحديد موعد مسبق للمعاينة، حيث يتم تنسيق الزيارة واستقبالك في نقطة الاستقبال المحددة، ثم مرافقتك في جولة للتعرف على الشاليهات والمرافق والخدمات.",
        qEn: "How do I book a visit to the compound?",
        aEn: "Contact our customer service team to book a viewing in advance. We arrange the visit, welcome you at the designated reception point, then take you on a tour of the chalets, facilities and services.",
      },
      {
        qAr: "هل يمكنني إجراء معاينة افتراضية للكمباوند عبر مكالمة فيديو؟",
        aAr: "نعم، يمكنك التنسيق مع فريق خدمة العملاء لإجراء معاينة افتراضية عبر مكالمة فيديو، والتعرف على الشاليه والكمباوند من خلال جولة مباشرة مع الموظف المختص.",
        qEn: "Can I view the compound virtually over a video call?",
        aEn: "Yes. Arrange it with our customer service team and get a live video tour of the chalet and the compound with one of our specialists.",
      },
    ],
  },
  {
    id: "pricing",
    titleAr: "الأسعار والتمويل",
    titleEn: "Prices & Financing",
    items: [
      {
        id: "price",
        qAr: "كيف يمكنني معرفة أسعار الشاليهات المتوفرة؟",
        aAr: "تختلف الأسعار بحسب الشاليه والمرحلة والعروض المعتمدة. ويمكنك التواصل مع فريق الشركة للحصول على الأسعار الرسمية الحالية والتفاصيل المتعلقة بالشاليه الذي ترغب بشرائه.",
        qEn: "How can I find out chalet prices?",
        aEn: "Prices vary by chalet, phase and current offers. Contact our team for the official current prices and the details of the chalet you're interested in.",
      },
      {
        id: "plans",
        qAr: "هل تتوفر خيارات تقسيط لشراء الشاليه؟",
        aAr: "نعم، تتوفر خيارات سداد مرنة من الشركة مباشرة.",
        qEn: "Are installments or bank financing available?",
        aEn: "Yes. Payment options are available under the company's approved terms and offers, and mortgage financing can also be explored through banks or suitable financing institutions.",
      },
      {
        qAr: "ما الإجراءات والمستندات المطلوبة لتملك الشاليه؟",
        aAr: "المستندات المطلوبة هي: إثبات شخصي، ونكتفي بالتنازل والرهن.",
        qEn: "What documents are needed for financing approval?",
        aEn: "Your ID or passport, proof of income, a commercial registration and a trade licence.",
      },
      {
        qAr: "هل توجد رسوم إضافية أو رسوم صيانة وخدمات دورية؟",
        aAr: "توجد رسوم مرتبطة بإدارة وصيانة وتشغيل المرافق والخدمات المشتركة، ويتم توضيح قيمتها وآلية احتسابها وفق النظام والعقد المعتمد. كما يتم توضيح أي رسوم مرتبطة بالشراء أو التسجيل قبل إتمام عملية الشراء.",
        qEn: "Are there extra fees, or regular maintenance and service fees?",
        aEn: "Yes, there are fees for managing, maintaining and running the shared facilities and services; their amount and how they're calculated are set out in the approved regulations and contract. Any purchase or registration fees are made clear before the purchase is completed.",
      },
    ],
  },
  {
    id: "ownership",
    titleAr: "الملكية والإجراءات",
    titleEn: "Ownership & Process",
    items: [
      {
        id: "registration",
        qAr: "هل يتم تسجيل الشاليه باسم المشتري، وما إجراءات نقل الملكية؟",
        aAr: "يتم تنظيم نقل الملكية باسم المشتري وفق الإجراءات القانونية المعتمدة، وإصدار قوشان باسم المشتري من دائرة الأراضي.",
        qEn: "Is the chalet registered in the buyer's name, and how is ownership transferred?",
        aEn: "Ownership is transferred to the buyer's name through the approved legal procedures, and all ownership documents and contracts are explained before the purchase is completed.",
      },
      {
        id: "steps",
        qAr: "ما الخطوات التي يمر بها العميل من اختيار الشاليه حتى إتمام عملية الشراء؟",
        aAr: "تبدأ الإجراءات بحجز موعد لمعاينة الشاليه من خلال مهندس المشروع، ثم الاجتماع مع المسؤول المالي لاختيار الشاليه.",
        qEn: "What are the steps from choosing a chalet to completing the purchase?",
        aEn: "First, book a viewing, then visit the site and see the chalet for yourself. After the viewing, you apply for installment approval, which is issued within 3 working days. Once approved, an appointment is set at the Department of Lands to complete the transfer of ownership to your name.",
      },
      {
        id: "handover",
        qAr: "متى يتم تسليم الشاليه، وهل الشاليهات جاهزة للاستلام؟",
        aAr: "يوجد شاليهات جاهزة للتسليم الفوري، أو شاليهات تحت التنفيذ.",
        qEn: "When is the chalet handed over, and are chalets ready now?",
        aEn: "Yes, there are chalets ready for handover at Giving now. Handover dates depend on the down payment and financing approval, and some chalets can be handed over immediately, subject to the approved terms and conditions.",
      },
    ],
  },
  {
    id: "invest",
    titleAr: "الاستثمار",
    titleEn: "Investment",
    items: [
      {
        qAr: "هل يمكن للمالك تأجير الشاليه والاستفادة منه كاستثمار؟",
        aAr: "نعم، يمكنك تأجير شاليهك من خلال إدارة الكمباوند.",
        qEn: "Can owners rent out their chalet as an investment?",
        aEn: "Yes. Some chalets are set up for investment and rental use, depending on the chalet and the approved operating system.",
      },
    ],
  },
];

const byId = (id: string) => faqCategories.flatMap((c) => c.items).find((it) => it.id === id)!;

/** Curated home FAQ preview (5 items). */
export const homeFaqPreview: FaqItem[] = [
  byId("where"),
  byId("size"),
  byId("registration"),
  byId("plans"),
  byId("handover"),
];
