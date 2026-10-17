"use client";

import { useEffect, useRef, useState } from "react";
import type { FitBoundsOptions, Map as LeafletMap, Marker, Polyline, TileLayer } from "leaflet";
import type { NearbyPlace } from "@/content/location";
import { projectCoords } from "@/content/location";
import { placeRoutes } from "@/content/location-routes";
import { palette } from "@/theme/tokens";
import "leaflet/dist/leaflet.css";

const tileUrl = (style: "Light" | "Dark", layer: "Base" | "Reference") =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${style}_Gray_${layer}/MapServer/tile/{z}/{y}/{x}`;

type LeafletModule = typeof import("leaflet");
const tileUrls = () => [tileUrl("Light", "Base"), tileUrl("Light", "Reference")];
// Light/dark mode disabled. With it on, tiles followed the theme:
// const tileUrls = (theme: "light" | "dark") => {
//   const style = theme === "dark" ? "Dark" : "Light";
//   return [tileUrl(style, "Base"), tileUrl(style, "Reference")];
// };
// ...and inside the component:
// const theme = useTheme(); // from "@/theme/useTheme"
// useEffect(() => {
//   if (!mapReady) return;
//   tileUrls(theme).forEach((url, i) => tilesRef.current[i]?.setUrl(url));
//   routeRef.current?.setStyle({ color: routeColor() });
// }, [theme, mapReady]);

let leafletPromise: Promise<LeafletModule> | null = null;

/** Leaflet touches `window` on import, so it's loaded on the client only, once. */
function loadLeaflet(): Promise<LeafletModule> {
  leafletPromise ??= import("leaflet").then((m) => m.default);
  return leafletPromise;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

/** Zero-size anchor at the exact coordinate; the pin is positioned around it with CSS. */
function projectIcon(L: LeafletModule) {
  return L.divIcon({
    className: "gc-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="gc-marker-anchor">
        <span class="gc-marker-avatar">
          <span class="gc-marker-avatar-pulse"></span>
          <span class="gc-marker-avatar-core"><span class="gc-marker-spin"></span></span>
        </span>
      </div>`,
  });
}

function destIcon(L: LeafletModule, name: string, time: string, dir: "rtl" | "ltr") {
  return L.divIcon({
    className: "gc-marker gc-marker--dest",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="gc-marker-anchor">
        <span class="gc-marker-label gc-marker-label--dest" dir="${dir}">
          <span class="gc-marker-label-name">${escapeHtml(name)}</span>
          ${time ? `<span class="gc-marker-label-time">${escapeHtml(time)}</span>` : ""}
        </span>
        <span class="gc-marker-dot"></span>
      </div>`,
  });
}

/** Route color = `--primary-ink`. */
const routeColor = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--primary-ink").trim() || palette.primary;

/** The road draws from the place to the compound over this long, once the map has settled. */
const DRAW_MS = 1600;
/** Pin pop-in, then the road starts. */
const PIN_LEAD_MS = 380;
/** The outgoing place fades for this long (matches .gc-leaving in location-map.css). */
const LEAVE_MS = 450;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const FIT_OPTIONS: FitBoundsOptions = {
  // Room for the pin labels (they run ~220px sideways) and the place card at the foot.
  paddingTopLeft: [150, 90],
  paddingBottomRight: [150, 140],
  animate: true,
  maxZoom: 14,
};

/** Phones: the map is narrow, so the side room for labels would zoom it far out; keep a
 *  little at the sides, room at the top for the label, and at the foot for the card. */
const FIT_OPTIONS_PHONE: FitBoundsOptions = {
  paddingTopLeft: [28, 70],
  paddingBottomRight: [28, 230],
  animate: true,
  maxZoom: 14,
};

const fitOptions = () => (window.matchMedia("(max-width: 767px)").matches ? FIT_OPTIONS_PHONE : FIT_OPTIONS);

type Props = {
  active: NearbyPlace | null;
  isAr: boolean;
};

/** One place on the map at a time: its pin pops in, then its road draws to the compound. */
type Shown = { marker: Marker; casing: Polyline; line: Polyline };

export function LocationLeafletMap({ active, isAr }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const shownRef = useRef<Shown | null>(null);
  const tilesRef = useRef<TileLayer[]>([]);
  const [mapReady, setMapReady] = useState(false);
  /** Near the viewport: only then are Leaflet and the tiles fetched (the home
   *  page shows the map far below the hero; loading it up front slowed phones). */
  const [near, setNear] = useState(false);
  /** On screen: only then does the first place pop in and draw (so it isn't missed). */
  const [seen, setSeen] = useState(false);
  const dir = isAr ? "rtl" : "ltr";

  useEffect(() => {
    const el = containerRef.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  useEffect(() => {
    if (!near) return;
    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        keyboard: false,
        scrollWheelZoom: false,
      }).setView([projectCoords.lat, projectCoords.lng], 11);

      tilesRef.current = tileUrls().map((url) =>
        L.tileLayer(url, { maxZoom: 16 }).addTo(map),
      );
      L.control
        .attribution({ position: "topright", prefix: false })
        .addAttribution("Tiles &copy; Esri")
        .addTo(map);

      L.marker([projectCoords.lat, projectCoords.lng], {
        icon: projectIcon(L),
        keyboard: false,
        interactive: false,
        zIndexOffset: 1000,
      }).addTo(map);

      leafletRef.current = L;
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      shownRef.current = null;
      tilesRef.current = [];
      setMapReady(false);
    };
  }, [near]);

  useEffect(() => {
    if (!mapReady || !seen || !active) return;
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let raf = 0;
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    // The outgoing place fades out, then leaves the map.
    const prev = shownRef.current;
    shownRef.current = null;
    if (prev) {
      const els = [prev.marker.getElement(), prev.casing.getElement(), prev.line.getElement()];
      els.forEach((el) => el?.classList.add("gc-leaving"));
      const drop = () => [prev.marker, prev.casing, prev.line].forEach((layer) => layer.remove());
      if (still) drop();
      else window.setTimeout(drop, LEAVE_MS);
    }

    const route: [number, number][] = placeRoutes[active.id] ?? [
      [active.coords.lat, active.coords.lng],
      [projectCoords.lat, projectCoords.lng],
    ];
    const color = routeColor();
    const casing = L.polyline([], {
      color: "#ffffff",
      weight: 8,
      opacity: 0.85,
      lineCap: "round",
      lineJoin: "round",
      interactive: false,
      className: "gc-route-casing",
    }).addTo(map);
    const line = L.polyline([], {
      color,
      weight: 4,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
      interactive: false,
      className: "gc-route",
    }).addTo(map);
    const marker = L.marker([active.coords.lat, active.coords.lng], {
      icon: destIcon(L, isAr ? active.nameAr : active.nameEn, isAr ? active.distanceAr : active.distanceEn, dir),
      keyboard: false,
      interactive: false,
      zIndexOffset: 900,
    });
    const shown: Shown = { marker, casing, line };
    shownRef.current = shown;

    // Frame the whole road, then: pin pops in, the road draws from the place to the V.
    map.fitBounds(L.latLngBounds([...route, [projectCoords.lat, projectCoords.lng]]), {
      ...fitOptions(),
      animate: !still,
      duration: 0.9,
    });

    const setRoute = (pts: [number, number][]) => {
      casing.setLatLngs(pts);
      line.setLatLngs(pts);
    };

    const draw = () => {
      if (shownRef.current !== shown) return;
      if (still) {
        setRoute(route);
        return;
      }
      const cum = [0];
      for (let k = 1; k < route.length; k++) cum.push(cum[k - 1]! + map.distance(route[k - 1]!, route[k]!));
      const total = cum[cum.length - 1] || 1;
      const t0 = performance.now();
      let seg = 1;
      const tick = (now: number) => {
        if (shownRef.current !== shown) return;
        const p = Math.min(1, (now - t0) / DRAW_MS);
        const d = easeInOut(p) * total;
        while (seg < cum.length - 1 && cum[seg]! < d) seg++;
        const a = route[seg - 1]!;
        const b = route[seg]!;
        const f = Math.min(1, Math.max(0, (d - cum[seg - 1]!) / (cum[seg]! - cum[seg - 1]! || 1)));
        setRoute([...route.slice(0, seg), [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]]);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const pop = () => {
      if (shownRef.current !== shown) return;
      marker.addTo(map);
      later(draw, still ? 0 : PIN_LEAD_MS);
    };
    // Wait for the camera to settle (moveend), with a fallback when the view doesn't move.
    let popped = false;
    const onSettled = () => {
      if (popped) return;
      popped = true;
      pop();
    };
    if (still) onSettled();
    else {
      map.once("moveend", onSettled);
      later(onSettled, 1100);
    }

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      map.off("moveend", onSettled);
    };
  }, [active, isAr, dir, mapReady, seen]);

  return (
    <div
      ref={containerRef}
      dir="ltr"
      role="region"
      className="absolute inset-0 z-0 h-full w-full"
      aria-label={isAr ? "خريطة موقع روح العطاء" : "Giving Compound location map"}
    />
  );
}
