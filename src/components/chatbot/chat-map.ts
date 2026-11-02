/*
 * The compound map inside Layan's chat (styles: styles/base/chatbot.css, "Map" block).
 *   - chaletCard: one chalet («شو تفاصيل A9»). A window on the compound plan that glides in from
 *     the whole compound to the chalet and drops a pin on it, then its status, facts and features
 *     (the same data as the /compound map: content/chalet-availability.ts + the Chalets sheet).
 *   - mapInvite: «see the chalets on the map», after a price question or when asked for the map.
 *     The available chalets light up one after another on a thumbnail of the plan.
 *   - openViewer: the whole plan in a sheet over the chat. Drag, pinch, double-tap or wheel to
 *     zoom; tap a chalet for its summary, then its full card in the chat or a visit booking.
 * Loaded on demand (chat-engine.ts), so the plan data never weighs on pages where the chat
 * stays closed.
 */

import { compoundPlanSize as PLAN, compoundUnits, type CompoundUnit } from "@/content/compound-units";
import { chaletInfo, loadChaletSheet, type ChaletInfo } from "@/lib/chaletsSheet";
import { track } from "@/lib/analytics";

const RATIO = PLAN.width / PLAN.height;
const THUMB = "/plans/compound/compound-map-v3-1600.webp";
const FULL = "/plans/compound/compound-map-v3-2800.webp";
/** Card window zoom on the chalet. */
const CARD_ZOOM = 5.2;
const MAX_ZOOM = 9;
const FOCUS_ZOOM = 4.2;
/** A tap this close (px) to a chalet's tag picks it. */
const TAP_RADIUS = 24;

export const chaletIds = compoundUnits.map((u) => u.id);
const unitOf = (id: string) => compoundUnits.find((u) => u.id === id) ?? null;
const compoundOf = (id: string) => id.match(/^[A-Z]+/)?.[0] ?? id;
const nf = new Intl.NumberFormat("ar-JO-u-nu-latn");

let sheet: Awaited<ReturnType<typeof loadChaletSheet>> = null;
/** The client's Chalets sheet (status, area, features, instalment), loaded in the background. */
export const ready = loadChaletSheet().then((m) => (sheet = m));
const info = (id: string): ChaletInfo => chaletInfo(id, sheet);
const available = () => compoundUnits.filter((u) => info(u.id).available);

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

const ICON = {
  check: '<svg viewBox="0 0 16 16" aria-hidden><circle cx="8" cy="8" r="7"/><path d="m4.8 8.2 2.1 2.1 4.3-4.4"/></svg>',
  lock: '<svg viewBox="0 0 16 16" aria-hidden><circle cx="8" cy="8" r="7"/><rect x="5.3" y="7.4" width="5.4" height="4" rx="0.8"/><path d="M6.4 7.4V6.2a1.6 1.6 0 0 1 3.2 0v1.2"/></svg>',
  expand: '<svg viewBox="0 0 24 24" aria-hidden><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden><path d="M6 6l12 12M18 6 6 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" aria-hidden><path d="M5 12h14"/></svg>',
  fit: '<svg viewBox="0 0 24 24" aria-hidden><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z"/><path d="M9 4v13M15 6.5v13"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden><path d="M15 6l-6 6 6 6"/></svg>',
};

/** «500 م²», «3 غرف نوم», «مسبح خاص وجاكوزي». */
function facts(c: ChaletInfo) {
  const beds = c.bedrooms === 1 ? "غرفة نوم واحدة" : c.bedrooms === 2 ? "غرفتا نوم" : `${nf.format(c.bedrooms)} غرف نوم`;
  return [...(c.area ? [`${nf.format(c.area)} م²`] : []), beds, ...(c.pool ? ["مسبح خاص وجاكوزي"] : [])];
}

function status(c: ChaletInfo) {
  const p = el("span", `cbm-status ${c.available ? "is-on" : "is-off"}`);
  p.innerHTML = `${c.available ? ICON.check : ICON.lock}<span>${c.available ? "متاح" : "غير متاح حاليًا"}</span>`;
  return p;
}

/** A window on the plan, centred on (x, y) % at `zoom`. Starts on the whole compound and glides in. */
function planWindow(u: CompoundUnit | null, cls: string) {
  const win = el("div", `cbm-win ${cls}`);
  // The plan and anything placed on it (dots) move together.
  const plan = el("div", "cbm-win-img");
  const img = el("img");
  img.src = THUMB;
  img.alt = "";
  img.decoding = "async";
  img.draggable = false;
  plan.append(img);
  win.append(plan);
  if (u) {
    const pin = el("span", "cbm-pin");
    pin.innerHTML = `<i></i><b dir="ltr">${u.id}</b>`;
    win.append(pin);
    const go = () => {
      win.style.setProperty("--cbm-x", String(u.x));
      win.style.setProperty("--cbm-y", String(u.y));
      win.style.setProperty("--cbm-z", String(CARD_ZOOM));
      win.classList.add("is-in");
    };
    if (reduced()) go();
    else {
      const fly = () => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(go, 250)));
      if (img.complete) fly();
      else img.addEventListener("load", fly, { once: true });
    }
  }
  return win;
}

export type MapActions = {
  /** Show a chalet's full card in the chat (from the viewer). */
  onDetails: (id: string) => void;
  /** Book a visit, for this chalet when given. */
  onBook: (id?: string) => void;
  /** The chat panel, which the viewer covers. */
  panel: HTMLElement;
};

/** One chalet's card for the chat log. */
export function chaletCard(id: string, act: MapActions) {
  const u = unitOf(id);
  const c = info(id);
  const card = el("article", "cb-card cbm-card");
  card.setAttribute("aria-label", `الشاليه ${id}`);

  const open = el("button", "cbm-open");
  open.type = "button";
  open.setAttribute("aria-label", `افتح خريطة الكمباوند على الشاليه ${id}`);
  open.append(planWindow(u, "cbm-win--card"));
  const hint = el("span", "cbm-hint");
  hint.innerHTML = `${ICON.expand}<span>افتح الخريطة</span>`;
  open.append(hint);
  open.onclick = () => openViewer(act, id);

  const body = el("div", "cbm-body");
  const head = el("div", "cbm-head");
  const title = el("h3", "cbm-title");
  title.innerHTML = `شاليه <span dir="ltr">${id}</span>`;
  head.append(title, status(c));
  const where = el("p", "cbm-where", `كمباوند ${compoundOf(id)} · روح العطاء`);
  const list = el("ul", "cbm-facts");
  for (const f of facts(c)) list.append(el("li", "", f));
  body.append(head, where, list);

  if (c.available && c.priceJd) {
    const price = el("p", "cbm-price");
    price.innerHTML = `<span>القسط الشهري</span><strong>${nf.format(c.priceJd)} دينار</strong>`;
    body.append(price);
  }
  if (c.available && c.features.length) {
    const feats = el("ul", "cbm-feats");
    for (const f of c.features) feats.append(el("li", "", f.ar));
    body.append(feats);
  }
  const desc = c.available ? c.descAr : "هذا الشاليه مش متاح حاليًا، بس في شاليهات متاحة قريبة منه، شوفها على الخريطة.";
  if (desc) body.append(el("p", "cbm-desc", desc));

  const actions = el("div", "cbm-actions");
  const book = el("button", "cbm-btn cbm-btn--main", c.available ? "احجز زيارة لهالشاليه" : "احجز زيارة");
  book.type = "button";
  book.onclick = () => act.onBook(c.available ? id : undefined);
  const map = el("button", "cbm-btn cbm-btn--ghost");
  map.type = "button";
  map.innerHTML = `${ICON.map}<span>${c.available ? "شوف حوله" : "الشاليهات المتاحة"}</span>`;
  map.onclick = () => openViewer(act, c.available ? id : undefined);
  actions.append(book, map);
  body.append(actions);

  card.append(open, body);
  track("chatbot_chalet_card", { chalet: id, available: c.available });
  return card;
}

/** «See the chalets on the map»: a thumbnail of the plan where the available ones light up. */
export function mapInvite(act: MapActions) {
  const card = el("button", "cb-card cbm-invite");
  card.type = "button";
  const win = planWindow(null, "cbm-win--invite");
  const plan = win.querySelector(".cbm-win-img")!;
  const units = available();
  units.forEach((u, i) => {
    const dot = el("i", "cbm-dot");
    dot.style.left = `${u.x}%`;
    dot.style.top = `${u.y}%`;
    dot.style.animationDelay = `${0.35 + i * 0.045}s`;
    plan.append(dot);
  });
  const text = el("span", "cbm-invite-text");
  text.innerHTML = `<b>خريطة الكمباوند</b><small>${units.length ? `${nf.format(units.length)} شاليه متاح · اضغط وتصفّح` : "اضغط وتصفّح الشاليهات"}</small>`;
  const go = el("span", "cbm-invite-go");
  go.innerHTML = ICON.arrow;
  const bar = el("span", "cbm-invite-bar");
  bar.append(el("span", "cbm-invite-ic"), text, go);
  bar.querySelector(".cbm-invite-ic")!.innerHTML = ICON.map;
  card.append(win, bar);
  card.onclick = () => openViewer(act);
  return card;
}

/* ---------- The viewer: the whole plan over the chat ---------- */

type View = { s: number; x: number; y: number };

export function openViewer(act: MapActions, focusId?: string) {
  act.panel.querySelector(".cbm-viewer")?.remove();
  track("chatbot_map_open", { chalet: focusId ?? "" });

  const root = el("div", "cbm-viewer");
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", "خريطة الكمباوند");
  const head = el("div", "cbm-v-head");
  const htxt = el("div", "cbm-v-title");
  const units = available();
  htxt.innerHTML = `<b>خريطة الكمباوند</b><small><i class="cbm-legend"></i>${nf.format(units.length)} شاليه متاح</small>`;
  const close = el("button", "cbm-v-close");
  close.type = "button";
  close.setAttribute("aria-label", "إغلاق الخريطة");
  close.innerHTML = ICON.close;
  head.append(htxt, close);

  const stage = el("div", "cbm-stage");
  const layer = el("div", "cbm-layer");
  const img = el("img", "cbm-plan");
  img.src = FULL;
  img.alt = "مخطط كمباوند روح العطاء";
  img.draggable = false;
  img.decoding = "async";
  layer.append(img);

  // Available chalets: a dot each. The chosen chalet: a pin with its number.
  const dots = new Map<string, HTMLButtonElement>();
  for (const u of units) {
    const d = el("button", "cbm-mark");
    d.type = "button";
    d.style.left = `${u.x}%`;
    d.style.top = `${u.y}%`;
    d.setAttribute("aria-label", `الشاليه ${u.id}، متاح`);
    d.onclick = (e) => {
      e.stopPropagation();
      select(u.id, true);
    };
    dots.set(u.id, d);
    layer.append(d);
  }
  const pin = el("span", "cbm-pin cbm-pin--big");
  pin.innerHTML = '<i></i><b dir="ltr"></b>';
  layer.append(pin);
  stage.append(layer);

  const tools = el("div", "cbm-tools");
  const tool = (icon: string, label: string, fn: () => void) => {
    const b = el("button", "cbm-tool");
    b.type = "button";
    b.innerHTML = icon;
    b.setAttribute("aria-label", label);
    b.onclick = fn;
    tools.append(b);
  };
  tool(ICON.plus, "تكبير", () => zoomAt(view.s * 1.8));
  tool(ICON.minus, "تصغير", () => zoomAt(view.s / 1.8));
  tool(ICON.fit, "عرض الخريطة كاملة", () => animate(home()));
  const hint = el("div", "cbm-v-hint", "اسحب للتنقّل · كبّر بإصبعين · اضغط على أي شاليه");
  stage.append(tools, hint);

  const sheetEl = el("div", "cbm-v-sheet");
  root.append(head, stage, sheetEl);
  act.panel.append(root);
  requestAnimationFrame(() => root.classList.add("is-open"));

  /* Geometry: the plan "covers" the stage at scale 1 (the panel is tall, the plan wide). */
  let box = { w: stage.clientWidth, h: stage.clientHeight };
  const base = () => {
    const ch = Math.max(box.h, box.w / RATIO);
    return { cw: ch * RATIO, ch };
  };
  const clamp = (v: View): View => {
    const { cw, ch } = base();
    const s = Math.min(MAX_ZOOM, Math.max(1, v.s));
    return {
      s,
      x: Math.min(0, Math.max(box.w - cw * s, v.x)),
      y: Math.min(0, Math.max(box.h - ch * s, v.y)),
    };
  };
  const home = (): View => {
    const { cw, ch } = base();
    return clamp({ s: 1, x: (box.w - cw) / 2, y: (box.h - ch) / 2 });
  };
  const centreOn = (u: CompoundUnit, s: number): View => {
    const { cw, ch } = base();
    // The summary sheet floats over the bottom of the map: centre the chalet in what's left.
    const sheetH = sheetEl.classList.contains("is-on") ? Math.min(box.h * 0.6, sheetEl.getBoundingClientRect().height) : 0;
    return clamp({ s, x: box.w / 2 - (u.x / 100) * cw * s, y: (box.h - sheetH) / 2 - (u.y / 100) * ch * s });
  };

  let view = home();
  function paint() {
    const { cw, ch } = base();
    layer.style.width = `${cw}px`;
    layer.style.height = `${ch}px`;
    layer.style.transform = `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`;
    layer.style.setProperty("--s", String(view.s));
  }
  function animate(v: View) {
    view = clamp(v);
    layer.classList.toggle("is-flying", !reduced());
    paint();
  }
  layer.addEventListener("transitionend", () => layer.classList.remove("is-flying"));
  function zoomAt(s: number, px = box.w / 2, py = box.h / 2) {
    const k = Math.min(MAX_ZOOM, Math.max(1, s)) / view.s;
    animate({ s: view.s * k, x: px - (px - view.x) * k, y: py - (py - view.y) * k });
  }
  paint();

  /* Selecting a chalet: pin, fly, summary sheet. */
  function select(id: string, fly: boolean) {
    const u = unitOf(id);
    if (!u) return;
    dots.forEach((d, k) => d.classList.toggle("is-sel", k === id));
    pin.style.left = `${u.x}%`;
    pin.style.top = `${u.y}%`;
    pin.querySelector("b")!.textContent = id;
    pin.classList.remove("is-on");
    void pin.offsetWidth;
    pin.classList.add("is-on");
    renderSheet(id);
    if (fly) animate(centreOn(u, Math.max(view.s, FOCUS_ZOOM)));
    hint.classList.add("is-gone");
  }

  function renderSheet(id: string) {
    const c = info(id);
    sheetEl.replaceChildren();
    const top = el("div", "cbm-s-top");
    const t = el("div", "cbm-s-title");
    t.innerHTML = `<b>شاليه <span dir="ltr">${id}</span></b><small>كمباوند ${compoundOf(id)}</small>`;
    top.append(t, status(c));
    const list = el("ul", "cbm-facts");
    for (const f of facts(c)) list.append(el("li", "", f));
    const actions = el("div", "cbm-actions");
    const more = el("button", "cbm-btn cbm-btn--ghost", "كل التفاصيل");
    more.type = "button";
    more.onclick = () => {
      shut();
      act.onDetails(id);
    };
    const book = el("button", "cbm-btn cbm-btn--main", c.available ? "احجز زيارة" : "شاليه متاح قريب");
    book.type = "button";
    book.onclick = () => {
      if (c.available) {
        shut();
        act.onBook(id);
        return;
      }
      // Unavailable: hop to the nearest available chalet.
      const u = unitOf(id)!;
      const near = available().sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y))[0];
      if (near) select(near.id, true);
    };
    actions.append(book, more);
    sheetEl.append(top, list, actions);
    sheetEl.classList.add("is-on");
  }

  /* Gestures: drag to pan, two fingers to pinch, double-tap or wheel to zoom, tap to pick. */
  const pts = new Map<number, { x: number; y: number }>();
  let moved = 0;
  let pinch: { d: number; s: number } | null = null;
  let lastTap = 0;
  const local = (e: { clientX: number; clientY: number }) => {
    const r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  stage.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).closest(".cbm-tool")) return;
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, local(e));
    layer.classList.remove("is-flying");
    moved = 0;
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: view.s };
    }
  });
  stage.addEventListener("pointermove", (e) => {
    const prev = pts.get(e.pointerId);
    if (!prev) return;
    const p = local(e);
    pts.set(e.pointerId, p);
    if (pts.size === 2 && pinch) {
      const [a, b] = [...pts.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const s = Math.min(MAX_ZOOM, Math.max(1, (pinch.s * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.d));
      const k = s / view.s;
      view = clamp({ s, x: mid.x - (mid.x - view.x) * k, y: mid.y - (mid.y - view.y) * k });
      moved += 10;
    } else if (pts.size === 1) {
      moved += Math.abs(p.x - prev.x) + Math.abs(p.y - prev.y);
      view = clamp({ ...view, x: view.x + p.x - prev.x, y: view.y + p.y - prev.y });
    }
    paint();
    if (moved > 6) hint.classList.add("is-gone");
  });
  const up = (e: PointerEvent) => {
    const p = pts.get(e.pointerId);
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (!p || moved > 6 || pts.size) return;
    // A tap: double-tap zooms; a single tap picks the nearest chalet within reach.
    const now = Date.now();
    if (now - lastTap < 300) {
      lastTap = 0;
      zoomAt(view.s * 2, p.x, p.y);
      return;
    }
    lastTap = now;
    const { cw, ch } = base();
    let best: CompoundUnit | null = null;
    let bestD = TAP_RADIUS;
    for (const u of compoundUnits) {
      const d = Math.hypot(view.x + (u.x / 100) * cw * view.s - p.x, view.y + (u.y / 100) * ch * view.s - p.y);
      if (d < bestD) {
        best = u;
        bestD = d;
      }
    }
    if (best) select(best.id, view.s < 2.5);
  };
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", (e) => {
    pts.delete(e.pointerId);
    pinch = null;
  });
  stage.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const p = local(e);
      const k = Math.exp(-e.deltaY * 0.0022);
      const s = Math.min(MAX_ZOOM, Math.max(1, view.s * k));
      const kk = s / view.s;
      view = clamp({ s, x: p.x - (p.x - view.x) * kk, y: p.y - (p.y - view.y) * kk });
      layer.classList.remove("is-flying");
      paint();
    },
    { passive: false },
  );

  const ro = new ResizeObserver(() => {
    box = { w: stage.clientWidth, h: stage.clientHeight };
    view = clamp(view);
    paint();
  });
  ro.observe(stage);

  const onKey = (e: KeyboardEvent) => e.key === "Escape" && shut();
  document.addEventListener("keydown", onKey);
  function shut() {
    ro.disconnect();
    document.removeEventListener("keydown", onKey);
    root.classList.remove("is-open");
    root.classList.add("is-closing");
    setTimeout(() => root.remove(), reduced() ? 0 : 380);
  }
  close.onclick = shut;
  // Keyboard users land on «close»; no focus ring for a tap.
  close.focus({ preventScroll: true, focusVisible: false } as FocusOptions);

  // Opened on a chalet: glide from the whole compound to it.
  if (focusId) {
    const start = () => setTimeout(() => select(focusId, true), reduced() ? 0 : 320);
    if (img.complete) start();
    else img.addEventListener("load", start, { once: true });
  }
}
