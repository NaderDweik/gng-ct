export const pricingPlans = [
  {
    id: "immediate",
    moveIn: 2025,
    downPct: 35,
    downJd: 59000,
    monthlyFromJd: 1000,
    interest: false,
    labelAr: "استلام فوري",
    labelEn: "Immediate",
  },
  {
    id: "midterm",
    moveIn: 2026,
    downPct: 25,
    downJd: 42000,
    monthlyFromJd: 1000,
    interest: false,
    labelAr: "متوسط الأجل",
    labelEn: "Mid-term",
  },
  {
    id: "future",
    moveIn: 2027,
    downPct: 15,
    downJd: 25000,
    monthlyFromJd: 1000,
    interest: false,
    labelAr: "مستقبلي",
    labelEn: "Future",
  },
] as const;

export const basePriceJd = 168000;
export const cashPriceJd = 142800;
export const cashDiscountPct = 15;
