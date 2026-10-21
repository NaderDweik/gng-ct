export type NavItem = {
  href: string;
  labelAr: string;
  labelEn: string;
};

export const mainNav: NavItem[] = [
  { href: "/", labelAr: "الرئيسية", labelEn: "Home" },
  { href: "/about", labelAr: "من نحن", labelEn: "About" },
  { href: "/gallery", labelAr: "الصور", labelEn: "Gallery" },
  { href: "/services", labelAr: "خدماتنا", labelEn: "Services" },
  { href: "/chalet", labelAr: "الشاليه", labelEn: "Chalet" },
  { href: "/leadership", labelAr: "الإدارة", labelEn: "Leadership" },
  { href: "/location", labelAr: "الخريطة", labelEn: "Location" },
  { href: "/news", labelAr: "الأخبار", labelEn: "News" },
  { href: "/faq", labelAr: "الأسئلة الشائعة", labelEn: "FAQ" },
  { href: "/compound", labelAr: "الكمباوند", labelEn: "Compound" },
  { href: "/register", labelAr: "احجز زيارتك", labelEn: "Register" },
];

export const footerNav: NavItem[] = [
  { href: "/about", labelAr: "من نحن", labelEn: "About" },
  { href: "/gallery", labelAr: "الصور", labelEn: "Gallery" },
  { href: "/faq", labelAr: "الأسئلة الشائعة", labelEn: "FAQ" },
  { href: "/register", labelAr: "احجز زيارتك", labelEn: "Register" },
];
