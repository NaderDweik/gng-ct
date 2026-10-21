/**
 * Department heads, shown on /leadership under the founder's principles (client's list,
 * 2026-10-21, in the client's order). No portraits yet: each card shows a person placeholder.
 * `titleAr` / `titleEn` is the short honorific before the name (م. engineer, أ. everyone else,
 * the lawyer included; Eng. / Mr. / Ms. / Atty.), empty where the client gave none.
 * `photo`: a site photo matching the department, shown tinted behind the card.
 */

export type DepartmentHead = {
  titleAr: string;
  nameAr: string;
  departmentAr: string;
  titleEn: string;
  nameEn: string;
  departmentEn: string;
  /** Site photo behind the card, picked to match the department. */
  photo: string;
};

export const departmentHeads: DepartmentHead[] = [
  { titleAr: "م.", nameAr: "لؤي منصور", departmentAr: "قسم إدارة الهندسة", titleEn: "Eng.", nameEn: "Louai Mansour", departmentEn: "Engineering", photo: "/gallery/compoundPics/engineers-site-office.jpg" },
  { titleAr: "أ.", nameAr: "نجيب طارق", departmentAr: "قسم إدارة المبيعات", titleEn: "Mr.", nameEn: "Najeeb Tareq", departmentEn: "Sales", photo: "/gallery/resortsPics/family-entering-resort-front-door.jpg" },
  { titleAr: "أ.", nameAr: "إيمان الصرايرة", departmentAr: "قسم الإدارة المالية", titleEn: "Ms.", nameEn: "Eman Al-Sarayreh", departmentEn: "Finance", photo: "/news/management-centre.webp" },
  { titleAr: "أ.", nameAr: "نور الدين يوسف", departmentAr: "قسم إدارة الخدمات والمرافق", titleEn: "Mr.", nameEn: "Nour Aldeen Yousef", departmentEn: "Services & Facilities", photo: "/news/public-services-centre-front.webp" },
  { titleAr: "أ.", nameAr: "عبدالله نايف", departmentAr: "قسم إدارة الإنشاءات", titleEn: "Mr.", nameEn: "Abdallah Nayef", departmentEn: "Construction", photo: "/gallery/compoundPics/construction-crew-building-walls.jpg" },
  { titleAr: "أ.", nameAr: "أمين عثامنة", departmentAr: "قسم إدارة الصيانة والتشغيل", titleEn: "Mr.", nameEn: "Ameen Athamneh", departmentEn: "Maintenance & Operations", photo: "/news/maintenance-team.webp" },
  { titleAr: "أ.", nameAr: "يوسف النكتلي", departmentAr: "قسم إدارة خدمة العملاء", titleEn: "Mr.", nameEn: "Yousef Al-Naktali", departmentEn: "Customer Service", photo: "/gallery/compoundPics/entrance-fountain-and-gatehouse.jpg" },
  { titleAr: "أ.", nameAr: "محمد الفواز", departmentAr: "قسم الموارد البشرية", titleEn: "Mr.", nameEn: "Mohammad Al-Fawwaz", departmentEn: "Human Resources", photo: "/news/staff-housing.webp" },
  { titleAr: "أ.", nameAr: "حسام عاشور", departmentAr: "قسم إدارة التسويق", titleEn: "Mr.", nameEn: "Hossam Ashour", departmentEn: "Marketing", photo: "/gallery/compoundPics/water-tower-billboard.jpg" },
  { titleAr: "", nameAr: "محمد الدياب", departmentAr: "قسم إدارة العمليات (الأمن)", titleEn: "", nameEn: "Mohammad Al-Diyab", departmentEn: "Operations (Security)", photo: "/gallery/compoundPics/security-guards-patrol-compound-o.jpg" },
  { titleAr: "أ.", nameAr: "عطاالله العضايلة", departmentAr: "قسم إدارة العقود والشؤون القانونية", titleEn: "Atty.", nameEn: "Atallah Al-Adayleh", departmentEn: "Contracts & Legal Affairs", photo: "/news/compound-design.webp" },
  { titleAr: "أ.", nameAr: "إبراهيم عبدالقادر", departmentAr: "قسم إدارة المشتريات", titleEn: "Mr.", nameEn: "Ibraheem Abdelqader", departmentEn: "Procurement", photo: "/gallery/compoundPics/solar-farm-building-store.jpg" },
  { titleAr: "أ.", nameAr: "عبدالرحيم الطيطي", departmentAr: "قسم إدارة العلاقات العامة", titleEn: "Mr.", nameEn: "Abdelraheem Al-Titi", departmentEn: "Public Relations", photo: "/gallery/compoundPics/community-park-families.jpg" },
  { titleAr: "أ.", nameAr: "خالد المساردة", departmentAr: "قسم إدارة شؤون الملاك", titleEn: "Mr.", nameEn: "Khaled Al-Masardeh", departmentEn: "Owners’ Affairs", photo: "/gallery/resortsPics/family-arriving-resort-a9-garage.jpg" },
  { titleAr: "أ.", nameAr: "عبدالقادر محمد", departmentAr: "قسم إدارة الهاوس كيبينج", titleEn: "Mr.", nameEn: "Abdelqader Mohammad", departmentEn: "Housekeeping", photo: "/gallery/compoundPics/housekeeping-team.jpg" },
];
