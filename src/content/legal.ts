/**
 * Privacy policy and terms (app/[locale]/privacy, app/[locale]/terms). DRAFT: written from
 * what the site actually does (the register form → WhatsApp via Meta, Cloudflare bot check,
 * PostHog analytics); the visible copy names no tools or vendors, by request; have it reviewed by the company's legal counsel before launch, and update
 * `updated` whenever the text changes. No em dashes in the copy.
 */
import { site } from "@/content/site";

export type LegalSection = { heading: string; body: string[] };
export type LegalDoc = { title: string; lead: string; sections: LegalSection[] };

export const legalUpdated = "2026-10-13";

const phone = site.phone.replace(/^\+962(\d{2})(\d{3})(\d{4})$/, "+962 $1 $2 $3");

export const privacyPolicy: Record<"ar" | "en", LegalDoc> = {
  en: {
    title: "Privacy Policy",
    lead: `How ${site.companyEn} collects, uses and protects your personal data, in line with Jordan's Personal Data Protection Law No. 24 of 2023.`,
    sections: [
      {
        heading: "Who we are",
        body: [
          `This website belongs to ${site.companyEn}, the developer of ${site.nameEn} (the "Company", "we"). We are the controller of the personal data you share with us here, and we are responsible for it under Jordan's Personal Data Protection Law No. 24 of 2023 and the regulations and instructions issued under it.`,
        ],
      },
      {
        heading: "What we collect",
        body: [
          "When you register your interest: your name, your phone number, the options you choose (for example a site visit or a financing call), your preferred contact time and any message you add.",
          "When you browse: technical information your browser sends, such as your IP address, device and browser type, and the pages you visit.",
          "If you accept analytics cookies: how you use the site, such as the pages you view, what you click and how you scroll, including recordings of your visit (session recordings). Anything you type into form fields is hidden in these recordings.",
          "If you answer a short survey or leave feedback on the site: your answers.",
          "We do not ask for sensitive personal data (such as health, religious beliefs or financial position) on this website. Please do not include it in your message.",
        ],
      },
      {
        heading: "Why we use it, and on what basis",
        body: [
          "To pass your enquiry to our sales team and contact you about it by WhatsApp or phone, arrange visits and financing calls, and answer your questions about our chalets. Basis: your consent, given when you submit the form.",
          "To analyse how visitors use the site, gather insights and feedback, and improve its pages, content and search visibility (SEO). Basis: your consent, given in the cookie notice.",
          "To protect the site and the form from spam, fraud and abuse, and to meet our legal obligations. Basis: these are needed to run the site safely and as the law requires.",
          "We use your data only for these purposes. If we ever want to use it for a new purpose, we will ask for your consent again first.",
          "We never sell or rent your personal data to third parties, and we do not pass it to others for their own marketing.",
        ],
      },
      {
        heading: "Who receives it",
        body: [
          "Our sales team, who follow up on your enquiry.",
          "Trusted service providers that run parts of the site on our behalf: a messaging provider that delivers your enquiry to our team, a security provider that protects the site and the form, an analytics provider for visit analytics, session recordings and surveys, and our hosting provider. They may use your data only to provide their service to us, under the same protection duties as ours.",
          "Competent public authorities, only where the law requires it.",
          "We keep a record of the data we share with these recipients and why.",
        ],
      },
      {
        heading: "Transfers outside Jordan",
        body: [
          "Some of our service providers store or process data on servers outside Jordan, where the level of data protection may differ from, or be lower than, Jordanian law. We choose providers with strong security and privacy commitments.",
          "By submitting the form or accepting analytics cookies, you consent to this transfer after being informed of it. You can withdraw that consent at any time (see Your rights).",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Enquiries from the register form: up to 24 months from our last contact with you, so we can follow up on your interest. If you become a buyer, we keep what is needed for your purchase for as long as your contract and the law require.",
          "Analytics data and survey answers: up to 24 months. Session recordings: up to 90 days.",
          "Security records (such as IP addresses used to stop spam): up to 30 days.",
          "When a period ends, or sooner if you withdraw your consent or ask us to, we delete your data or anonymise it so it can no longer identify you, unless the law requires us to keep it longer.",
        ],
      },
      {
        heading: "Cookies and analytics",
        body: [
          "The site uses only what it strictly needs to work and stay secure. With your permission, given in the cookie notice, it also uses analytics cookies to measure visits and record sessions, which help us understand how the site is used and improve it.",
          "Analytics and session recordings stay off until you accept, and stay off if you decline. You can also block or delete cookies in your browser settings; the site will still work.",
          "Our Cookie Policy explains each type of cookie in detail.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Under Jordanian law you have the right to: know what personal data we hold about you and get a copy of it; correct, update or complete it; restrict how we process it; have it erased or anonymised; object to its processing, including profiling; withdraw your consent at any time; and be told of any breach affecting your data.",
          "Withdrawing your consent does not affect processing that took place before you withdrew it. Exercising your rights is free of charge.",
          "We will reply to your request within 30 days. We may ask you to confirm your identity first, to protect your data.",
          "If you are not satisfied with our reply, you can complain to the Personal Data Protection Unit at the Ministry of Digital Economy and Entrepreneurship.",
          "If you live outside Jordan, for example in another Gulf country, the data protection law where you live may give you additional rights, and we will respect them.",
        ],
      },
      {
        heading: "How we protect it",
        body: [
          "We use technical and organisational measures to keep your data confidential, accurate and secure, including encrypted connections (HTTPS), access limited to staff who need it, and spam and abuse protection on our forms.",
          "If a serious breach could cause you significant harm, we will notify you within 24 hours of discovering it, with steps to protect yourself, and notify the Personal Data Protection Unit within 72 hours, as the law requires.",
        ],
      },
      {
        heading: "Children",
        body: [
          "This website is meant for adults (18 and over). We do not knowingly collect personal data from anyone under 18 without the consent of a parent or legal guardian. If you believe a minor has sent us their data, contact us and we will delete it.",
        ],
      },
      {
        heading: "Contact us",
        body: [
          `For any privacy request or question, call or message us on WhatsApp at ${phone}, or visit our sales office: ${site.salesOfficeEn}, Amman, Jordan.`,
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "We may update this policy. The date at the top of the page shows when it last changed. If a change affects how we use data you have already given us, we will ask for your consent again where the law requires it.",
          "This policy is published in Arabic and English. If the two differ, the Arabic version prevails.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة الخصوصية",
    lead: `كيف تجمع ${site.companyAr} بياناتك الشخصية وتستخدمها وتحميها، وفق قانون حماية البيانات الشخصية الأردني رقم (24) لسنة 2023.`,
    sections: [
      {
        heading: "من نحن",
        body: [
          `هذا الموقع مملوك لـ${site.companyAr}، الشركة المطوّرة لمشروع ${site.nameAr} ("الشركة" أو "نحن"). ونحن المسؤول عن البيانات الشخصية التي تشاركها معنا هنا، وفق قانون حماية البيانات الشخصية الأردني رقم (24) لسنة 2023 والأنظمة والتعليمات الصادرة بموجبه.`,
        ],
      },
      {
        heading: "ما الذي نجمعه",
        body: [
          "عند تسجيل اهتمامك: اسمك، ورقم هاتفك، والخيارات التي تحددها (مثل زيارة الموقع أو استشارة التمويل)، والوقت المفضّل للتواصل، وأي رسالة تضيفها.",
          "عند تصفحك للموقع: معلومات تقنية يرسلها متصفحك، مثل عنوان IP ونوع الجهاز والمتصفح والصفحات التي تزورها.",
          "إذا وافقت على ملفات تعريف الارتباط الخاصة بالتحليلات: طريقة استخدامك للموقع، مثل الصفحات التي تشاهدها وما تضغط عليه وكيف تتنقل فيها، بما في ذلك تسجيلات لزيارتك (تسجيل الجلسات). ويُخفى أي نص تكتبه في حقول النماذج في هذه التسجيلات.",
          "إذا أجبت عن استبيان قصير أو تركت ملاحظاتك على الموقع: إجاباتك.",
          "لا نطلب على هذا الموقع أي بيانات شخصية حساسة (مثل الحالة الصحية أو المعتقدات الدينية أو الوضع المالي)، ونرجو عدم تضمينها في رسالتك.",
        ],
      },
      {
        heading: "لماذا نستخدمها وعلى أي أساس",
        body: [
          "لإيصال طلبك إلى فريق المبيعات والتواصل معك بخصوصه عبر واتساب أو الهاتف، وترتيب الزيارات واستشارات التمويل، والإجابة عن أسئلتك حول الشاليهات. الأساس: موافقتك التي تقدّمها عند إرسال النموذج.",
          "لتحليل طريقة استخدام الزوار للموقع، وجمع الملاحظات والرؤى، وتحسين صفحاته ومحتواه وظهوره في محركات البحث. الأساس: موافقتك التي تقدّمها في إشعار ملفات تعريف الارتباط.",
          "لحماية الموقع والنموذج من الرسائل المزعجة والاحتيال وإساءة الاستخدام، والوفاء بالتزاماتنا القانونية. الأساس: ضرورة تشغيل الموقع بأمان ووفق ما يفرضه القانون.",
          "نستخدم بياناتك لهذه الأغراض فقط، وإذا أردنا استخدامها لغرض جديد فسنطلب موافقتك مجددًا أولًا.",
          "لا نبيع بياناتك الشخصية ولا نؤجّرها لأي طرف ثالث، ولا نسلّمها لغيرنا لأغراضه التسويقية.",
        ],
      },
      {
        heading: "من يطّلع عليها",
        body: [
          "فريق المبيعات لدينا، لمتابعة طلبك.",
          "مزوّدو خدمات موثوقون يشغّلون أجزاء من الموقع نيابة عنا: مزوّد خدمة مراسلة يوصل طلبك إلى فريقنا، ومزوّد خدمة أمان يحمي الموقع والنموذج، ومزوّد تحليلات لتحليل الزيارات وتسجيل الجلسات والاستبيانات، ومزوّد الاستضافة. ولا يحق لهم استخدام بياناتك إلا لتقديم خدماتهم لنا، ويخضعون لواجبات الحماية ذاتها المترتبة علينا.",
          "الجهات الرسمية المختصة، فقط عندما يفرض القانون ذلك.",
          "نحتفظ بسجل للبيانات التي نشاركها مع هذه الجهات والغرض منها.",
        ],
      },
      {
        heading: "نقل البيانات خارج الأردن",
        body: [
          "يخزّن بعض مزوّدي الخدمات لدينا البيانات أو يعالجونها على خوادم خارج الأردن، حيث قد يختلف مستوى حماية البيانات عن مستواه في القانون الأردني أو يقل عنه. ونختار مزوّدين لديهم التزامات قوية بالأمان والخصوصية.",
          "بإرسالك للنموذج أو موافقتك على ملفات تعريف الارتباط الخاصة بالتحليلات، فإنك توافق على هذا النقل بعد إعلامك به، ويمكنك سحب هذه الموافقة في أي وقت (انظر حقوقك).",
        ],
      },
      {
        heading: "مدة الاحتفاظ بها",
        body: [
          "طلبات نموذج تسجيل الاهتمام: حتى 24 شهرًا من آخر تواصل بيننا، لنتمكن من متابعة اهتمامك. وإذا أصبحت مشتريًا، نحتفظ بما يلزم لعملية الشراء طوال المدة التي يتطلبها عقدك والقانون.",
          "بيانات التحليلات وإجابات الاستبيانات: حتى 24 شهرًا. تسجيلات الجلسات: حتى 90 يومًا.",
          "سجلات الأمان (مثل عناوين IP المستخدمة لمنع الرسائل المزعجة): حتى 30 يومًا.",
          "عند انتهاء المدة، أو قبل ذلك إذا سحبت موافقتك أو طلبت منا، نحذف بياناتك أو نُخفي هويتها بحيث لا يمكن أن تدل عليك، ما لم يُلزمنا القانون بالاحتفاظ بها مدة أطول.",
        ],
      },
      {
        heading: "ملفات تعريف الارتباط والتحليلات",
        body: [
          "يستخدم الموقع ما يحتاجه فقط ليعمل ويبقى آمنًا. وبموافقتك عبر إشعار ملفات تعريف الارتباط، يستخدم أيضًا ملفات تعريف الارتباط الخاصة بالتحليلات لقياس الزيارات وتسجيل الجلسات، مما يساعدنا على فهم طريقة استخدام الموقع وتحسينه.",
          "تبقى التحليلات وتسجيل الجلسات متوقفة إلى أن توافق، وتبقى متوقفة إذا رفضت. ويمكنك أيضًا حظر ملفات تعريف الارتباط أو حذفها من إعدادات متصفحك، وسيبقى الموقع يعمل.",
          "تشرح سياسة ملفات تعريف الارتباط كل نوع منها بالتفصيل.",
        ],
      },
      {
        heading: "حقوقك",
        body: [
          "يحق لك بموجب القانون الأردني: معرفة البيانات الشخصية التي نحتفظ بها عنك والحصول على نسخة منها، وتصحيحها أو تحديثها أو استكمالها، وتقييد معالجتها، ومحوها أو إخفاء هويتها، والاعتراض على معالجتها بما في ذلك التنميط، وسحب موافقتك في أي وقت، وإعلامك بأي اختراق يمس بياناتك.",
          "لا يؤثر سحب موافقتك على المعالجة التي تمت قبل سحبها، وممارسة حقوقك مجانية.",
          "سنرد على طلبك خلال 30 يومًا، وقد نطلب منك تأكيد هويتك أولًا لحماية بياناتك.",
          "إذا لم تكن راضيًا عن ردّنا، يمكنك تقديم شكوى إلى وحدة حماية البيانات الشخصية في وزارة الاقتصاد الرقمي والريادة.",
          "إذا كنت مقيمًا خارج الأردن، في إحدى دول الخليج مثلًا، فقد يمنحك قانون حماية البيانات في بلدك حقوقًا إضافية، وسنحترمها.",
        ],
      },
      {
        heading: "كيف نحميها",
        body: [
          "نتخذ تدابير تقنية وتنظيمية للحفاظ على سرية بياناتك ودقتها وأمانها، منها الاتصال المشفّر (HTTPS)، وحصر الاطلاع عليها بالموظفين الذين يحتاجونها، وحماية نماذجنا من الرسائل المزعجة وإساءة الاستخدام.",
          "إذا وقع اختراق جسيم قد يُلحق بك ضررًا كبيرًا، فسنُعلمك خلال 24 ساعة من اكتشافه مع الخطوات اللازمة لحماية نفسك، ونُعلم وحدة حماية البيانات الشخصية خلال 72 ساعة، كما يفرض القانون.",
        ],
      },
      {
        heading: "الأطفال",
        body: [
          "هذا الموقع موجّه للبالغين (18 عامًا فأكثر). ولا نجمع عن قصد بيانات شخصية من أي شخص دون 18 عامًا دون موافقة أحد الوالدين أو الولي الشرعي. وإذا اعتقدت أن قاصرًا أرسل إلينا بياناته، تواصل معنا وسنحذفها.",
        ],
      },
      {
        heading: "تواصل معنا",
        body: [
          `لأي طلب أو استفسار يتعلق بالخصوصية، اتصل بنا أو راسلنا عبر واتساب على الرقم ${phone}، أو زر مكتب المبيعات: ${site.salesOfficeAr}، عمّان، الأردن.`,
        ],
      },
      {
        heading: "التعديلات على هذه السياسة",
        body: [
          "قد نحدّث هذه السياسة من وقت لآخر، ويوضح التاريخ أعلى الصفحة موعد آخر تعديل. وإذا أثّر تعديلٌ على طريقة استخدامنا لبيانات قدّمتها لنا سابقًا، فسنطلب موافقتك مجددًا حيث يفرض القانون ذلك.",
          "تُنشر هذه السياسة باللغتين العربية والإنجليزية، وفي حال وجود اختلاف بينهما يُعتمد النص العربي.",
        ],
      },
    ],
  },
};

export const termsOfUse: Record<"ar" | "en", LegalDoc> = {
  en: {
    title: "Terms of Use",
    lead: `The terms that apply when you use the ${site.nameEn} website.`,
    sections: [
      {
        heading: "About this website",
        body: [
          `This website is run by ${site.companyEn} to present ${site.nameEn} and let you register your interest. By using it, you accept these terms and our Privacy Policy.`,
          "You must be 18 or older to register your interest.",
        ],
      },
      {
        heading: "Information on the site",
        body: [
          "Prices, payment plans, availability, areas, plans, photos and renderings are shown for general information and may change without notice. Some images are illustrative.",
          "Nothing on the website is a binding offer. The terms of any purchase are those of the signed sale contract.",
        ],
      },
      {
        heading: "Registering your interest",
        body: [
          "Registering your interest does not reserve a chalet or create any obligation for you or for us. Please give accurate contact details so we can reach you.",
          "By submitting the form, you agree to be contacted by WhatsApp or phone about your enquiry, as described in our Privacy Policy.",
        ],
      },
      {
        heading: "Use of the website",
        body: [
          "Please do not misuse the site: for example, by submitting false or automated requests, trying to break its security, or copying its content for commercial use.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          `The content of this website, including text, photos, plans, the logo and the design, belongs to ${site.companyEn} or its licensors and may not be reused without written permission.`,
        ],
      },
      {
        heading: "Links to other services",
        body: [
          "The site links to services run by others, such as messaging, video, map and social media services. Their own terms and privacy policies apply when you use them.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "We work to keep the website accurate and available, but we cannot guarantee it will always be error-free or uninterrupted. To the extent the law allows, we are not liable for losses arising from using the website or relying on its general information.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the Hashemite Kingdom of Jordan, and the courts of Amman have jurisdiction over any dispute arising from them.",
          "These terms are published in Arabic and English. If the two differ, the Arabic version prevails.",
        ],
      },
      {
        heading: "Changes and contact",
        body: [
          `We may update these terms; the date at the top shows when they last changed. Questions: call or WhatsApp ${phone}.`,
        ],
      },
    ],
  },
  ar: {
    title: "شروط الاستخدام",
    lead: `الشروط التي تنطبق عند استخدامك لموقع ${site.nameAr}.`,
    sections: [
      {
        heading: "عن هذا الموقع",
        body: [
          `تدير ${site.companyAr} هذا الموقع لعرض مشروع ${site.nameAr} وتمكينك من تسجيل اهتمامك. باستخدامك للموقع فإنك توافق على هذه الشروط وعلى سياسة الخصوصية.`,
          "يجب أن يكون عمرك 18 عامًا فأكثر لتسجيل اهتمامك.",
        ],
      },
      {
        heading: "المعلومات على الموقع",
        body: [
          "الأسعار وخطط الدفع والتوفر والمساحات والمخططات والصور والتصاميم معروضة لأغراض المعلومات العامة، وقد تتغير دون إشعار مسبق. وبعض الصور توضيحية.",
          "لا يُعدّ أي محتوى على الموقع عرضًا ملزمًا، وتحكم شروطُ عقد البيع الموقّع أيَّ عملية شراء.",
        ],
      },
      {
        heading: "تسجيل الاهتمام",
        body: [
          "تسجيل اهتمامك لا يعني حجز شاليه ولا ينشئ أي التزام عليك أو علينا. يرجى إدخال بيانات تواصل صحيحة لنتمكن من الوصول إليك.",
          "بإرسالك للنموذج، فإنك توافق على أن نتواصل معك عبر واتساب أو الهاتف بخصوص طلبك، كما توضح سياسة الخصوصية.",
        ],
      },
      {
        heading: "استخدام الموقع",
        body: [
          "يرجى عدم إساءة استخدام الموقع، مثل إرسال طلبات غير صحيحة أو آلية، أو محاولة اختراق أمانه، أو نسخ محتواه لأغراض تجارية.",
        ],
      },
      {
        heading: "الملكية الفكرية",
        body: [
          `محتوى هذا الموقع، بما فيه النصوص والصور والمخططات والشعار والتصميم، مملوك لـ${site.companyAr} أو للجهات المرخِّصة لها، ولا يجوز إعادة استخدامه دون إذن خطي.`,
        ],
      },
      {
        heading: "الروابط إلى خدمات أخرى",
        body: [
          "يحتوي الموقع على روابط لخدمات تديرها جهات أخرى، مثل خدمات المراسلة والفيديو والخرائط ومواقع التواصل الاجتماعي، وتنطبق شروطها وسياسات الخصوصية الخاصة بها عند استخدامها.",
        ],
      },
      {
        heading: "المسؤولية",
        body: [
          "نحرص على أن يبقى الموقع دقيقًا ومتاحًا، لكن لا يمكننا ضمان خلوّه الدائم من الأخطاء أو الانقطاع. وفي الحدود التي يسمح بها القانون، لا نتحمل المسؤولية عن أي خسارة تنتج عن استخدام الموقع أو الاعتماد على معلوماته العامة.",
        ],
      },
      {
        heading: "القانون الحاكم",
        body: [
          "تخضع هذه الشروط لقوانين المملكة الأردنية الهاشمية، وتختص محاكم عمّان بالنظر في أي نزاع ينشأ عنها.",
          "تُنشر هذه الشروط باللغتين العربية والإنجليزية، وفي حال وجود اختلاف بينهما يُعتمد النص العربي.",
        ],
      },
      {
        heading: "التعديلات والتواصل",
        body: [
          `قد نحدّث هذه الشروط، ويوضح التاريخ أعلى الصفحة موعد آخر تعديل. للاستفسار: اتصل أو راسلنا عبر واتساب على ${phone}.`,
        ],
      },
    ],
  },
};

export const cookiePolicy: Record<"ar" | "en", LegalDoc> = {
  en: {
    title: "Cookie Policy",
    lead: "Which cookies and similar technologies this website uses, why, and how you can choose.",
    sections: [
      {
        heading: "What cookies are",
        body: [
          "Cookies are small files a website stores in your browser. Similar technologies, such as your browser's local storage, work in the same way. We call them all \"cookies\" in this policy.",
        ],
      },
      {
        heading: "Strictly necessary cookies",
        body: [
          "These keep the site working and secure, so they do not need your consent: remembering your language, remembering your cookie choice, and protecting the site and the register form from spam and abuse.",
          "They do not track you across other websites and are kept only as long as they are needed (your cookie choice is remembered for up to 12 months).",
        ],
      },
      {
        heading: "Analytics cookies (only with your consent)",
        body: [
          "If you press Accept in the cookie notice, we use analytics cookies to understand how visitors use the site: the pages viewed, clicks and scrolling, time on page, and recordings of visits (session recordings) in which anything typed into form fields is hidden. We also use them for short surveys and feedback.",
          "This helps us improve the site's pages, content and search visibility. Analytics data is kept for up to 24 months and session recordings for up to 90 days.",
          "If you do not accept, analytics cookies stay off.",
        ],
      },
      {
        heading: "No advertising cookies",
        body: [
          "We do not use advertising or cross-site tracking cookies, and we never sell your data.",
        ],
      },
      {
        heading: "Content from other services",
        body: [
          "Some pages show content from other services, such as videos and maps. When that content loads or plays, those services may set their own cookies under their own policies.",
        ],
      },
      {
        heading: "Changing your choice",
        body: [
          "You can change your choice at any time in the cookie settings on this page, by switching analytics on or off. You can also block or delete cookies in your browser settings. The site still works without analytics cookies.",
        ],
      },
      {
        heading: "More information",
        body: [
          "For how we handle personal data in general, including your rights and how to contact us, see our Privacy Policy. We may update this policy; the date at the top shows when it last changed. This policy is published in Arabic and English; if the two differ, the Arabic version prevails.",
        ],
      },
    ],
  },
  ar: {
    title: "سياسة ملفات تعريف الارتباط",
    lead: "ملفات تعريف الارتباط والتقنيات المشابهة التي يستخدمها هذا الموقع، ولماذا، وكيف يمكنك الاختيار.",
    sections: [
      {
        heading: "ما هي ملفات تعريف الارتباط",
        body: [
          "ملفات تعريف الارتباط ملفات صغيرة يخزّنها الموقع في متصفحك، وتعمل التقنيات المشابهة، مثل التخزين المحلي في متصفحك، بالطريقة ذاتها. ونسمّيها جميعًا \"ملفات تعريف الارتباط\" في هذه السياسة.",
        ],
      },
      {
        heading: "ملفات تعريف الارتباط الضرورية",
        body: [
          "تُبقي هذه الملفات الموقع يعمل بأمان، لذلك لا تحتاج إلى موافقتك: تذكّر لغتك، وتذكّر اختيارك بشأن ملفات تعريف الارتباط، وحماية الموقع ونموذج التسجيل من الرسائل المزعجة وإساءة الاستخدام.",
          "لا تتبّعك هذه الملفات عبر المواقع الأخرى، ولا نحتفظ بها إلا للمدة اللازمة (يُحفظ اختيارك بشأن ملفات تعريف الارتباط حتى 12 شهرًا).",
        ],
      },
      {
        heading: "ملفات تعريف الارتباط الخاصة بالتحليلات (بموافقتك فقط)",
        body: [
          "إذا ضغطت «موافق» في إشعار ملفات تعريف الارتباط، نستخدم ملفات تعريف الارتباط الخاصة بالتحليلات لفهم طريقة استخدام الزوار للموقع: الصفحات التي تُشاهَد، والنقرات والتمرير، والوقت في كل صفحة، وتسجيلات الزيارات (تسجيل الجلسات) التي يُخفى فيها أي نص يُكتب في حقول النماذج. ونستخدمها أيضًا للاستبيانات القصيرة والملاحظات.",
          "يساعدنا ذلك على تحسين صفحات الموقع ومحتواه وظهوره في محركات البحث. ونحتفظ ببيانات التحليلات حتى 24 شهرًا، وبتسجيلات الجلسات حتى 90 يومًا.",
          "إذا لم توافق، تبقى ملفات تعريف الارتباط الخاصة بالتحليلات متوقفة.",
        ],
      },
      {
        heading: "لا ملفات تعريف ارتباط إعلانية",
        body: ["لا نستخدم ملفات تعريف ارتباط إعلانية أو للتتبّع عبر المواقع، ولا نبيع بياناتك أبدًا."],
      },
      {
        heading: "محتوى من خدمات أخرى",
        body: [
          "تعرض بعض الصفحات محتوى من خدمات أخرى، مثل مقاطع الفيديو والخرائط. وعند تحميل هذا المحتوى أو تشغيله، قد تضع تلك الخدمات ملفات تعريف الارتباط الخاصة بها وفق سياساتها.",
        ],
      },
      {
        heading: "تغيير اختيارك",
        body: [
          "يمكنك تغيير اختيارك في أي وقت من خلال إعدادات ملفات تعريف الارتباط في هذه الصفحة، بتشغيل التحليلات أو إيقافها. ويمكنك أيضًا حظر ملفات تعريف الارتباط أو حذفها من إعدادات متصفحك، وسيبقى الموقع يعمل دون ملفات تعريف الارتباط الخاصة بالتحليلات.",
        ],
      },
      {
        heading: "مزيد من المعلومات",
        body: [
          "لمعرفة كيفية تعاملنا مع البيانات الشخصية عمومًا، بما في ذلك حقوقك وطرق التواصل معنا، راجع سياسة الخصوصية. وقد نحدّث هذه السياسة، ويوضح التاريخ أعلى الصفحة موعد آخر تعديل. وتُنشر هذه السياسة باللغتين العربية والإنجليزية، وفي حال وجود اختلاف بينهما يُعتمد النص العربي.",
        ],
      },
    ],
  },
};
