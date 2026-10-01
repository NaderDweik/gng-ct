/**
 * Home "About Giving City" intro (features/home/HomeIntro). The photo assembles from five
 * same-size transparent layers (public/home/intro-*-v2.webp, 16:9) stacked back to front.
 */
export const homeIntro = {
  layers: {
    sky: "/home/intro-sky-v2.webp",
    walls: "/home/intro-walls-v2.webp",
    ground: "/home/intro-ground-v2.webp",
    pool: "/home/intro-pool-v2.webp",
    chalet: "/home/intro-chalet-v2.webp",
  },
  /**
   * Seam lines drawn over the finished photo, traced from the layers' alpha (viewBox
   * 0 0 546 307, the frame at 1/5 scale).
   * `chalet`: the chalet's base, left edge to the arch pillar (bridged under the arch),
   * then on along the terrace edge to the right edge.
   * `pool`: the pool's lower edge (mats, coping, lounge platform).
   */
  seams: {
    chalet: "M0 236 L3 234 L17 234 L18 229 L20 228 L50 225 L52 222 L56 221 L76 219 L78 217 L91 215 L101 215 L104 229 L112 229 L115 227 L117 221 L118 199 L197 188 L199 185 L219 186 L241 182 L253 182 L256 181 L257 176 L259 175 L275 173 L431 172.1 L432 179 L462 179 L546 180",
    pool: "M191 205 L194 205 L197 209 L209 209 L210 221 L214 223 L231 239 L239 238 L272 249 L290 253 L334 230 L359 230 L381 217 L382 206 L411 209 L414 212 L419 213 L440 213 L443 218 L447 218 L462 201 L466 187 L468 184 L471 183",
  },
  href: "/units",
  en: {
    eyebrow: "About Giving City",
    title: "One Community. 367 Private Resorts.",
    p1: "Welcome to Giving City, the first and largest fully-serviced chalet city in the region, set across 500,000 m² in Al Matabba, Sahab.",
    p2: "Every resort sits on about 500 m² with its own independent deed, Spanish design and 3-metre privacy walls, inside a gated community with 24/7 security, shared amenities and zero-interest plans direct from the developer.",
    cta: "Explore Resorts",
    alt: "A Giving Royal resort with its private pool at sunset",
  },
  ar: {
    eyebrow: "عن Giving City",
    title: "مجتمع واحد. ٣٦٧ منتجعًا خاصًا.",
    p1: "أهلًا بك في Giving City، أول وأكبر مدينة شاليهات مخدومة بالكامل في المنطقة، على مساحة ٥٠٠,٠٠٠ م² في المطبّة، سحاب.",
    p2: "كل منتجع على مساحة تقارب ٥٠٠ م² بسند ملكية مستقل وتصميم إسباني وجدران خصوصية بارتفاع ٣ أمتار، داخل مجتمع مسوّر بأمن على مدار الساعة ومرافق مشتركة وخطط دفع بدون فوائد مباشرة مع الشركة.",
    cta: "استكشف المنتجعات",
    alt: "منتجع Giving Royal مع مسبحه الخاص عند الغروب",
  },
} as const;
