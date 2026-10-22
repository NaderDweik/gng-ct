/**
 * Department heads, shown on /leadership under the founder's principles (client's list,
 * 2026-10-21, in the client's order). Each card shows the name and department only.
 * `titleAr` / `titleEn` is the short honorific before the name (م. engineer, أ. everyone else,
 * the lawyer included; Eng. / Mr. / Ms. / Atty.), empty where the client gave none.
 */

export type DepartmentHead = {
  titleAr: string;
  nameAr: string;
  departmentAr: string;
  titleEn: string;
  nameEn: string;
  departmentEn: string;
};

export const departmentHeads: DepartmentHead[] = [
  { titleAr: "م.", nameAr: "لؤي منصور", departmentAr: "قسم إدارة الهندسة", titleEn: "Eng.", nameEn: "Louai Mansour", departmentEn: "Engineering" },
  { titleAr: "أ.", nameAr: "نجيب طارق", departmentAr: "قسم إدارة المبيعات", titleEn: "Mr.", nameEn: "Najeeb Tareq", departmentEn: "Sales" },
  { titleAr: "أ.", nameAr: "إيمان الصرايرة", departmentAr: "قسم الإدارة المالية", titleEn: "Ms.", nameEn: "Eman Al-Sarayreh", departmentEn: "Finance" },
  { titleAr: "أ.", nameAr: "نور الدين يوسف", departmentAr: "قسم إدارة الخدمات والمرافق", titleEn: "Mr.", nameEn: "Nour Aldeen Yousef", departmentEn: "Services & Facilities" },
  { titleAr: "أ.", nameAr: "عبدالله نايف", departmentAr: "قسم إدارة الإنشاءات", titleEn: "Mr.", nameEn: "Abdallah Nayef", departmentEn: "Construction" },
  { titleAr: "أ.", nameAr: "أمين عثامنة", departmentAr: "قسم إدارة الصيانة والتشغيل", titleEn: "Mr.", nameEn: "Ameen Athamneh", departmentEn: "Maintenance & Operations" },
  { titleAr: "أ.", nameAr: "يوسف النكتلي", departmentAr: "قسم إدارة خدمة العملاء", titleEn: "Mr.", nameEn: "Yousef Al-Naktali", departmentEn: "Customer Service" },
  { titleAr: "أ.", nameAr: "محمد الفواز", departmentAr: "قسم الموارد البشرية", titleEn: "Mr.", nameEn: "Mohammad Al-Fawwaz", departmentEn: "Human Resources" },
  { titleAr: "أ.", nameAr: "حسام عاشور", departmentAr: "قسم إدارة التسويق", titleEn: "Mr.", nameEn: "Hossam Ashour", departmentEn: "Marketing" },
  { titleAr: "", nameAr: "محمد الدياب", departmentAr: "قسم إدارة العمليات (الأمن)", titleEn: "", nameEn: "Mohammad Al-Diyab", departmentEn: "Operations (Security)" },
  { titleAr: "أ.", nameAr: "عطاالله العضايلة", departmentAr: "قسم إدارة العقود والشؤون القانونية", titleEn: "Atty.", nameEn: "Atallah Al-Adayleh", departmentEn: "Contracts & Legal Affairs" },
  { titleAr: "أ.", nameAr: "إبراهيم عبدالقادر", departmentAr: "قسم إدارة المشتريات", titleEn: "Mr.", nameEn: "Ibraheem Abdelqader", departmentEn: "Procurement" },
  { titleAr: "أ.", nameAr: "عبدالرحيم الطيطي", departmentAr: "قسم إدارة العلاقات العامة", titleEn: "Mr.", nameEn: "Abdelraheem Al-Titi", departmentEn: "Public Relations" },
  { titleAr: "أ.", nameAr: "خالد المساردة", departmentAr: "قسم إدارة شؤون الملاك", titleEn: "Mr.", nameEn: "Khaled Al-Masardeh", departmentEn: "Owners’ Affairs" },
  { titleAr: "أ.", nameAr: "عبدالقادر محمد", departmentAr: "قسم إدارة الهاوس كيبينج", titleEn: "Mr.", nameEn: "Abdelqader Mohammad", departmentEn: "Housekeeping" },
];
