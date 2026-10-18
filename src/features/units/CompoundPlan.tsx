"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { compoundPlanSize as PLAN, compoundUnits, type CompoundUnit } from "@/content/compound-units";
import { compoundCopy } from "@/content/units";
import { useChaletData } from "@/lib/chaletsSheet";
import { AvailableIcon, ChaletListings, UnavailableIcon } from "@/features/units/ChaletListings";
import { track } from "@/lib/analytics";
import { useSoftSnap } from "@/lib/useSoftSnap";

/*
 * /compound: the compound plan explorer, filling the screen under the page header (styles: styles/sections/compound-plan.css;
 * data: content/compound-units.ts). Page header + map share one screen (no scroll needed):
 *   - the plan fills the stage; a blurred copy of it fills any letterbox around it;
 *   - every chalet's number tag is a button: tap one and the map flies to it, drops a pin
 *     and opens its details in the "Available chalets" sheet (ChaletListings);
 *   - "Pick one for me" flies to a random chalet, for visitors who just want to wander;
 *   - "Step inside a chalet" leads to /chalet (rooms, interiors, the chalet plan); it's the
 *     first row of the available-chalets list;
 *   - zoom: buttons, double-click, pinch, the wheel (once the map is settled), ctrl+wheel; drag to pan. A small map in
 *     the corner shows where you are once zoomed in.
 *   - availability (content/chalet-availability.ts): chalets on sale are tinted green with a
 *     check badge and listed in "Available chalets" (ChaletListings: folded, it sits where the
 *     "step inside" pill was): a bottom sheet on phones, a drawer on the end edge from tablet
 *     up, with the chalet's details saying "Available" (with "Register interest") or
 *     "Unavailable" (with a way back to the list).
 *
 * Geometry: the canvas is the plan "contained" in the stage (scale 1); the view is a
 * translate + scale on top of that. Phones (portrait) open at "cover" so the plan fills
 * the screen, and a horizontal drag pans while a vertical swipe still scrolls the page.
 */

const RATIO = PLAN.width / PLAN.height;
const MAX_ZOOM = 9;
const FOCUS_ZOOM_DESKTOP = 3.4;
const FOCUS_ZOOM_PHONE = 4.5;
const DRAG_THRESHOLD = 5;
/** Share of the plan image (from the top) that holds the drawing; below it is faded ground. */
const DRAWN_H = 0.96;
/** A tap this close (px) to a chalet's tag picks it: tags are small at the opening zoom. */
const TAP_RADIUS = 26;

type View = { s: number; x: number; y: number };
type Box = { w: number; h: number };

const normalize = (q: string) => q.toUpperCase().replace(/[\s-]+/g, "");
const isPhone = (b: Box) => b.w < 768;

export function CompoundPlan({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const copy = compoundCopy[isAr ? "ar" : "en"];

  const stageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Scrolling near the map settles it in the screen under the nav (every width).
  useSoftSnap(stageRef, 0);
  const [box, setBox] = useState<Box | null>(null);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  // Each chalet's status and details: built in, or from the client's Chalets sheet (lib/chaletsSheet.ts).
  const chalets = useChaletData();
  const isChaletAvailable = chalets.isAvailable;
  const availableUnits = compoundUnits.filter((u) => isChaletAvailable(u.id));
  // "Available chalets" sheet (ChaletListings) and the chalet whose details it shows.
  const [shopOpen, setShopOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const viewRef = useRef(view);
  viewRef.current = view;
  const boxRef = useRef(box);
  boxRef.current = box;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ moved: number; pinch?: { d: number; s: number } }>({ moved: 0 });

  const selected = compoundUnits.find((u) => u.id === selectedId) ?? null;
  const hovered = compoundUnits.find((u) => u.id === hoverId) ?? null;
  // The tooltip is one element that glides between chalets: it keeps the last position
  // while fading out, and a short grace period stops it blinking between neighbours.
  const lastHover = useRef<CompoundUnit | null>(null);
  if (hovered) lastHover.current = hovered;
  const tip = hovered ?? lastHover.current;
  const tipOn = Boolean(hovered && hovered.id !== selectedId);
  const leaveTimer = useRef<number | undefined>(undefined);
  const hoverEnter = (id: string) => {
    window.clearTimeout(leaveTimer.current);
    setHoverId(id);
  };
  const hoverLeave = (id: string) => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setHoverId((h) => (h === id ? null : h)), 140);
  };
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  /** The plan contained in the stage, at scale 1. */
  const base = (b: Box) => {
    const cw = Math.min(b.w, b.h * RATIO);
    return { cw, ch: cw / RATIO };
  };

  const clamp = useCallback((v: View, b: Box | null = boxRef.current): View => {
    if (!b) return v;
    const { cw, ch } = base(b);
    const s = Math.min(MAX_ZOOM, Math.max(1, v.s));
    const sw = cw * s;
    const sh = ch * s;
    return {
      s,
      x: sw <= b.w ? (b.w - sw) / 2 : Math.min(0, Math.max(b.w - sw, v.x)),
      y: sh <= b.h ? (b.h - sh) / 2 : Math.min(0, Math.max(b.h - sh, v.y)),
    };
  }, []);

  /** The opening view: the whole drawing as large as fits on wide screens (the faded ground
   *  below it may run off the bottom), the plan filling the screen on phones. */
  const homeView = useCallback(
    (b: Box): View => {
      const { cw, ch } = base(b);
      if (b.w < b.h) {
        const s = Math.max(b.w / cw, b.h / ch);
        return clamp({ s, x: (b.w - cw * s) / 2, y: (b.h - ch * s) / 2 }, b);
      }
      const s = Math.min(b.w / cw, b.h / (ch * DRAWN_H));
      return clamp({ s, x: (b.w - cw * s) / 2, y: (b.h - ch * s * DRAWN_H) / 2 }, b);
    },
    [clamp],
  );

  // Measure the stage; first measure sets the opening view and starts the entrance.
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const b = { w: r.width, h: r.height };
      const first = !boxRef.current;
      boxRef.current = b;
      setBox(b);
      setView((v) => (first ? homeView(b) : clamp(v, b)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const t = requestAnimationFrame(() => setReady(true));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(t);
    };
  }, [clamp, homeView]);

  /** Zoom to `s`, keeping stage point (px, py) still. */
  const zoomAt = useCallback(
    (s: number, px: number, py: number) => {
      const v = viewRef.current;
      const k = Math.min(MAX_ZOOM, Math.max(1, s)) / v.s;
      setView(clamp({ s: v.s * k, x: px - (px - v.x) * k, y: py - (py - v.y) * k }));
    },
    [clamp],
  );

  const zoomBy = (factor: number) => {
    const b = boxRef.current;
    if (b) zoomAt(viewRef.current.s * factor, b.w / 2, b.h / 2);
  };

  /** Fly to a chalet, centring it in the part of the stage the card doesn't cover. */
  const flyTo = useCallback(
    (u: CompoundUnit) => {
      const b = boxRef.current;
      if (!b) return;
      const { cw, ch } = base(b);
      const phone = isPhone(b);
      const s = Math.max(viewRef.current.s, phone ? FOCUS_ZOOM_PHONE : FOCUS_ZOOM_DESKTOP);
      // Card: a side panel on the end edge from tablet up; on phones a bottom sheet, with
      // the intro shrunk to its search bar above.
      // The details open beside it: a drawer on the end edge (26rem), or on phones a sheet
      // over the lower 62% of the map.
      const cardW = phone ? 0 : 26 * 16 + 20;
      const top = phone ? 80 : 0;
      const bottom = phone ? b.h * 0.62 : 0;
      const cx = isAr ? cardW + (b.w - cardW) / 2 : (b.w - cardW) / 2;
      const cy = top + (b.h - top - bottom) / 2;
      setView(clamp({ s, x: cx - (u.x / 100) * cw * s, y: cy - (u.y / 100) * ch * s }));
    },
    [clamp, isAr],
  );

  const pick = useCallback(
    (u: CompoundUnit, selectionMethod: "map" | "search" | "random" | "list") => {
      // Every chalet opens in the sheet's details view, however it was picked.
      setShopOpen(true);
      setDetailId(u.id);
      setSelectedId(u.id);
      setNotFound(false);
      flyTo(u);
      track("chalet_viewed", { chalet: u.id, method: selectionMethod });
    },
    [flyTo],
  );

  const surprise = () => {
    const pool = compoundUnits.filter((u) => u.id !== selectedId);
    pick(pool[Math.floor(Math.random() * pool.length)]!, "random");
  };

  /** Open or close the sheet; it always opens on the list. */
  const openShop = useCallback((open: boolean) => {
    setShopOpen(open);
    setDetailId(null);
    setSelectedId(null);
  }, []);

  /** A chalet's details in the sheet (the map flies to it), or back to the list. */
  const showDetail = (u: CompoundUnit | null) => {
    setDetailId(u?.id ?? null);
    if (u) pick(u, "list");
    else setSelectedId(null);
  };

  const goHome = () => {
    const b = boxRef.current;
    if (b) setView(homeView(b));
  };

  // Ctrl/⌘ + wheel and trackpad pinch (sent as ctrl+wheel) always zoom. A plain wheel over
  // the map never scrolls the page once the map is (nearly) in place under the fixed nav:
  // settled, it zooms, and at the zoom limits it simply stops; still a little off (within
  // the soft snap's pull), the first wheel finishes the glide into place. Further away the
  // wheel scrolls the page as usual, so the map can be reached; to leave it, scroll over
  // the site nav or the page header.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const r = el.getBoundingClientRect();
      const at = (s: number) => zoomAt(s, e.clientX - r.left, e.clientY - r.top);
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        at(viewRef.current.s * Math.exp(-e.deltaY * 0.01));
        return;
      }
      const b = boxRef.current;
      if (!b || isPhone(b) || e.deltaY === 0) return;
      const off = r.top - 5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (Math.abs(off) > window.innerHeight / 3) return;
      e.preventDefault();
      if (Math.abs(off) > 2) {
        window.scrollBy({ top: off, behavior: "smooth" });
        return;
      }
      // One mouse-wheel notch (~100) ≈ ×1.28; trackpad scrolls send small steps, so they glide.
      const dy = Math.max(-100, Math.min(100, e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY));
      at(Math.max(homeView(b).s, viewRef.current.s * Math.exp(-dy * 0.0025)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt, homeView]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") openShop(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openShop]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current.moved = 0;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinch = { d: Math.hypot(a!.x - b!.x, a!.y - b!.y), s: viewRef.current.s };
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    const pinch = gesture.current.pinch;
    if (pinch && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const r = e.currentTarget.getBoundingClientRect();
      zoomAt((pinch.s * Math.hypot(a!.x - b!.x, a!.y - b!.y)) / pinch.d, (a!.x + b!.x) / 2 - r.left, (a!.y + b!.y) / 2 - r.top);
      gesture.current.moved = Infinity;
      return;
    }
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    gesture.current.moved += Math.abs(dx) + Math.abs(dy);
    if (gesture.current.moved > DRAG_THRESHOLD) {
      if (!dragging) {
        setDragging(true);
        setHoverId(null);
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      setView((v) => clamp({ ...v, x: v.x + dx, y: v.y + dy }));
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current.pinch = undefined;
    if (pointers.current.size === 0) setDragging(false);
  };

  /** A tap between tags picks the nearest chalet within a finger's width. */
  const onStageClick = (e: MouseEvent<HTMLDivElement>) => {
    const b = boxRef.current;
    if (!b || gesture.current.moved > DRAG_THRESHOLD) return;
    if ((e.target as HTMLElement).closest(".cx-spot")) return;
    const r = e.currentTarget.getBoundingClientRect();
    const { cw, ch } = base(b);
    const { s, x, y } = viewRef.current;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    let best: CompoundUnit | null = null;
    let bestD = TAP_RADIUS;
    for (const u of compoundUnits) {
      const d = Math.hypot(x + (u.x / 100) * cw * s - px, y + (u.y / 100) * ch * s - py);
      if (d < bestD) {
        bestD = d;
        best = u;
      }
    }
    if (best) pick(best, "map");
  };

  const onDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const s = viewRef.current.s;
    zoomAt(s >= MAX_ZOOM - 0.01 ? 1 : s * 2, e.clientX - r.left, e.clientY - r.top);
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = normalize(query);
    if (!q) return;
    const starts = compoundUnits.filter((u) => u.id.startsWith(q));
    const hit = compoundUnits.find((u) => u.id === q) ?? (starts.length === 1 ? starts[0] : undefined);
    track("chalet_searched", { query: q.slice(0, 12), found: !!hit });
    if (hit) {
      pick(hit, "search");
      inputRef.current?.blur();
    } else {
      setNotFound(true);
    }
  };

  const { cw, ch } = box ? base(box) : { cw: 0, ch: 0 };
  const home = box ? homeView(box) : view;
  const atHome = Math.abs(view.s - home.s) < 0.01 && Math.abs(view.x - home.x) < 1 && Math.abs(view.y - home.y) < 1;
  // The "drag / zoom" hint goes for good once the visitor first zooms (any way).
  const [hintDone, setHintDone] = useState(false);
  const zoomed = box !== null && Math.abs(view.s - home.s) >= 0.01;
  useEffect(() => {
    if (zoomed) setHintDone(true);
  }, [zoomed]);
  // Zoomed past "the whole plan is on screen": show where you are.
  const showMini = box && !atHome ? cw * view.s > box.w + 2 || ch * view.s > box.h + 2 : false;
  const panX = box ? cw * view.s > box.w + 2 : false;
  const panY = box ? ch * view.s > box.h + 2 : false;
  // The browser picks a sharper file as the visitor zooms in.
  const sizes = box ? `${Math.ceil(cw * view.s)}px` : "100vw";

  const mini = box && {
    left: Math.max(0, -view.x / (cw * view.s)) * 100,
    top: Math.max(0, -view.y / (ch * view.s)) * 100,
    width: Math.min(1, box.w / (cw * view.s)) * 100,
    height: Math.min(1, box.h / (ch * view.s)) * 100,
  };

  const onMini = (e: PointerEvent<HTMLButtonElement>) => {
    const b = boxRef.current;
    if (!b) return;
    const r = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    const s = viewRef.current.s;
    setView(clamp({ s, x: b.w / 2 - fx * cw * s, y: b.h / 2 - fy * ch * s }));
  };


  return (
    <section
      className={`cx${shopOpen ? " has-shop" : ""}${atHome ? "" : " is-zoomed"}${ready ? " is-ready" : ""}${hintDone ? " hint-done" : ""}`}
      aria-label={copy.label}
    >
      <div
        ref={stageRef}
        className={`cx-stage${panX ? " can-pan-x" : ""}${panY ? " can-pan-y" : ""}${dragging ? " is-dragging" : ""}`}
        dir="ltr"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onStageClick}
        onDoubleClick={onDoubleClick}
      >
        <Image
          className="cx-backdrop"
          src="/plans/compound/compound-map-v3-1600.webp"
          alt=""
          fill
          sizes="40vw"
          aria-hidden
          priority
        />
        <div
          className="cx-canvas"
          style={
            {
              width: cw || undefined,
              height: ch || undefined,
              "--x": `${view.x}px`,
              "--y": `${view.y}px`,
              "--s": view.s,
            } as CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- srcset must follow the zoom, not the layout box */}
          <img
            className="cx-img"
            src="/plans/compound/compound-map-v3-2800.webp"
            srcSet="/plans/compound/compound-map-v3-1600.webp 1600w, /plans/compound/compound-map-v3-2800.webp 2800w, /plans/compound/compound-map-v3-4000.webp 4000w"
            sizes={sizes}
            width={PLAN.width}
            height={PLAN.height}
            alt={copy.planAlt}
            draggable={false}
            fetchPriority="high"
          />
          {compoundUnits.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`cx-spot${u.id === selectedId ? " is-selected" : ""}${isChaletAvailable(u.id) ? " is-available" : ""}${u.id === hoverId ? " is-hover" : ""}`}
              style={
                u.plot
                  ? { left: `${u.plot.x}%`, top: `${u.plot.y}%`, width: `${u.plot.w}%`, height: `${u.plot.h}%` }
                  : { left: `${u.x}%`, top: `${u.y}%`, width: `${u.w + 0.6}%`, height: `${u.h + 0.8}%` }
              }
              aria-label={`${copy.chalet} ${u.id}, ${isChaletAvailable(u.id) ? copy.available : copy.unavailable}`}
              aria-pressed={u.id === selectedId}
              onClick={() => {
                if (gesture.current.moved > DRAG_THRESHOLD) return;
                pick(u, "map");
              }}
              onPointerEnter={(e) => e.pointerType === "mouse" && !dragging && hoverEnter(u.id)}
              onPointerLeave={() => hoverLeave(u.id)}
            />
          ))}
          {/* Counter-scaled (CSS) so they keep one size at any zoom, and move with the canvas. */}
          {availableUnits.map((u) => (
            <span
              key={u.id}
              className={`cx-avail${u.id === hoverId ? " is-hover" : ""}${u.id === selectedId ? " is-hidden" : ""}`}
              style={{ left: `${u.x}%`, top: `${u.y - u.h / 2}%` }}
              aria-hidden
            >
              <AvailableIcon />
            </span>
          ))}
          {tip && (
            <span className={`cx-tip${tipOn ? " is-on" : ""}`} style={{ left: `${tip.x}%`, top: `${tip.y}%` }} aria-hidden>
              <span className="cx-tip-body">
                <span className="cx-tip-label">{copy.chalet}</span>
                <span className="cx-tip-id" key={tip.id}>
                  {tip.id}
                </span>
              </span>
            </span>
          )}
          {selected && (
            <span
              className={`cx-pin ${isChaletAvailable(selected.id) ? "is-available" : "is-unavailable"}`}
              key={selected.id}
              style={{ left: `${selected.x}%`, top: `${selected.y}%` }}
              aria-hidden
            >
              <span className="cx-pin-head">
                {isChaletAvailable(selected.id) ? <AvailableIcon /> : <UnavailableIcon />}
                {selected.id}
              </span>
            </span>
          )}
        </div>

      </div>

      {/* ── Overlays ── */}
      <div className="cx-intro">
        <form className="cx-search" role="search" onSubmit={onSearch}>
          <label htmlFor="cx-q" className="sr-only">
            {copy.searchLabel}
          </label>
          <svg viewBox="0 0 24 24" aria-hidden className="cx-search-icon">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            ref={inputRef}
            id="cx-q"
            type="search"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            enterKeyHint="go"
            placeholder={copy.searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setNotFound(false);
            }}
            aria-describedby={notFound ? "cx-q-err" : undefined}
            aria-invalid={notFound || undefined}
          />
          <button type="submit">{copy.go}</button>
        </form>
        {notFound && (
          <p id="cx-q-err" className="cx-error" role="alert">
            {copy.notFound}
          </p>
        )}
        <button type="button" className="cx-surprise" onClick={surprise}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
            <circle cx="8.5" cy="8.5" r="1.3" />
            <circle cx="15.5" cy="15.5" r="1.3" />
            <circle cx="12" cy="12" r="1.3" />
          </svg>
          {copy.surprise}
        </button>
      </div>

      <div className="cx-zoom">
        <button type="button" onClick={() => zoomBy(1.7)} disabled={view.s >= MAX_ZOOM} aria-label={copy.zoomIn}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.7)} disabled={view.s <= 1} aria-label={copy.zoomOut}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 12h14" />
          </svg>
        </button>
        <button type="button" onClick={goHome} disabled={atHome} aria-label={copy.fit}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>

      {mini && (
        <button
          type="button"
          className={`cx-mini${showMini ? " is-on" : ""}`}
          onPointerDown={onMini}
          tabIndex={-1}
          aria-hidden
          dir="ltr"
        >
          <Image src="/plans/compound/compound-map-v3-1600.webp" alt="" fill sizes="180px" />
          <span
            className="cx-mini-view"
            style={{ left: `${mini.left}%`, top: `${mini.top}%`, width: `${mini.width}%`, height: `${mini.height}%` }}
          />
        </button>
      )}

      <p className="cx-hint" aria-hidden>
        {box && !isPhone(box) ? copy.hintWheel : copy.hint}
      </p>

      <ChaletListings
        units={availableUnits}
        all={compoundUnits}
        isAvailable={isChaletAvailable}
        info={chalets.info}
        copy={copy}
        locale={locale}
        open={shopOpen}
        detailId={detailId}
        hoverId={hoverId}
        onOpen={openShop}
        onDetail={showDetail}
        onHover={(id) => (id ? hoverEnter(id) : hoverId && hoverLeave(hoverId))}
      />

    </section>
  );
}
