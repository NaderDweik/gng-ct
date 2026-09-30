/**
 * Home "piece by piece" section (features/home/SceneExplode.tsx).
 * The hero's pavilion photo is cut into its objects (scripts/segment-scene.py →
 * public/scene/royal/*.webp + scene-royal.geometry.json). On scroll the pieces
 * lift off the photo, stand up on the resort plan like an architect's model,
 * then the camera swings overhead and they fold into their spaces, which are
 * called out with drawn leader lines. Re-run the script if the photo changes.
 *
 * All plan coordinates are in the plan image's own pixels (masterPlanMapSize).
 */
import geometry from "./scene-royal.geometry.json";
import { masterPlanMapSize, masterPlanMapSrc, type PlanArea } from "./master-plan";

export type ScenePieceId = keyof typeof geometry.pieces;
type Pt = readonly [x: number, y: number];

/** Model view: where a cut-out stands on the plan — bottom-centre (u, v) and width, plan px. */
export type SceneStand = { u: number; v: number; w: number };

export type SceneZone = {
  id: string;
  /** Cut-outs that fold into this space (and pop back up when it's picked). */
  pieces: readonly ScenePieceId[];
  rects: readonly PlanArea[];
  /** Where the leader line leaves the space. */
  dot: Pt;
  /** Label anchor: desktop labels sit beside the plan, phone labels above / below it. */
  desk: Pt;
  mob: Pt;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
};

const stands: Record<ScenePieceId, SceneStand> = {
  pavilion: { u: 355, v: 470, w: 470 },
  canopy: { u: 660, v: 452, w: 250 },
  "sofa-left": { u: 215, v: 518, w: 190 },
  "sofa-right": { u: 620, v: 518, w: 175 },
  pool: { u: 415, v: 792, w: 430 },
  lounge: { u: 793, v: 772, w: 165 },
  cabana: { u: 68, v: 705, w: 128 },
  firepit: { u: 84, v: 742, w: 72 },
};

const zones = [
  {
    id: "living",
    pieces: ["pavilion", "canopy"],
    rects: [{ x: 100, y: 117, w: 682, h: 341 }],
    dot: [690, 250],
    desk: [1070, 190],
    mob: [250, -78],
    titleAr: "معيشة بواجهات زجاجية",
    titleEn: "Glass-walled living",
    descAr: "واجهات زجاجية من الأرض للسقف تفتح المعيشة على المسبح، تحت مظلة معمارية.",
    descEn: "Floor-to-ceiling glass opens the living spaces onto the pool, under a sculpted canopy.",
  },
  {
    id: "terraces",
    pieces: ["sofa-left", "sofa-right"],
    rects: [
      { x: 100, y: 458, w: 230, h: 57 },
      { x: 520, y: 458, w: 200, h: 57 },
    ],
    dot: [215, 487],
    desk: [-118, 420],
    mob: [715, -78],
    titleAr: "جلسات خارجية",
    titleEn: "Outdoor living",
    descAr: "أرائك مريحة على شرفات مظللة أمام كل جناح.",
    descEn: "Deep sofas on shaded terraces in front of each wing.",
  },
  {
    id: "bbq",
    pieces: ["cabana", "firepit"],
    rects: [{ x: 0, y: 568, w: 135, h: 167 }],
    dot: [68, 650],
    desk: [-118, 650],
    mob: [95, 1102],
    titleAr: "برجولا وركن النار",
    titleEn: "Pergola & fire",
    descAr: "جلسة مظللة تحت البرجولا، وركن للنار والشواء للأمسيات.",
    descEn: "Shaded seating under the pergola, and a fire and grill corner for evenings.",
  },
  {
    id: "pool",
    pieces: ["pool"],
    rects: [{ x: 182, y: 590, w: 465, h: 205 }],
    dot: [300, 760],
    desk: [-118, 880],
    mob: [440, 1102],
    titleAr: "مسبح خاص",
    titleEn: "Private pool",
    descAr: "مسبح رئيسي بنظام فلترة في قلب الساحة، ومسبح للأطفال في كل وحدة.",
    descEn: "A main pool with filtration at the heart of the courtyard, plus a kids' pool in every unit.",
  },
  {
    id: "lounge",
    pieces: ["lounge"],
    rects: [{ x: 720, y: 596, w: 147, h: 194 }],
    dot: [793, 693],
    desk: [1070, 693],
    mob: [820, 1102],
    titleAr: "جلسة بجانب الماء",
    titleEn: "Poolside lounge",
    descAr: "جلسة مدمجة على بُعد خطوات من الماء.",
    descEn: "Built-in seating, steps from the water.",
  },
] as const satisfies readonly SceneZone[];

export const sceneRoyal = {
  /** Same file (and sizes/quality) as hero slide 1, so the plate comes from cache. */
  plate: "/gallery/Gemini_Generated_Image_8og1am8og1am8og1.jpg",
  pieceDir: "/scene/royal",
  width: geometry.width,
  height: geometry.height,
  pieces: geometry.pieces,
  plan: { src: masterPlanMapSrc, ...masterPlanMapSize },
  stands,
  zones,
  copy: {
    en: {
      eyebrow: "One resort, piece by piece.",
      title: "Every piece, in its place.",
      hint: "Scroll to take it apart",
      tapHint: "Tap a space to read about it",
      planAlt: "Private resort plan, seen from above",
    },
    ar: {
      eyebrow: "منتجع واحد، قطعةً قطعة.",
      title: "كل قطعة، في مكانها.",
      hint: "مرّر لتفكيك المشهد",
      tapHint: "اضغط على أي مساحة لتقرأ عنها",
      planAlt: "مخطط المنتجع الخاص من الأعلى",
    },
  },
} as const;
