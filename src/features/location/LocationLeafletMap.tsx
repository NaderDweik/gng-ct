"use client";

import { useEffect, useRef, useState } from "react";
import type { FitBoundsOptions, Map as LeafletMap, Marker, Polyline, PolylineOptions, TileLayer } from "leaflet";
import type { NearbyPlace } from "@/content/location";
import { projectCoords } from "@/content/location";
import { GIVING_MARK_SVG } from "@/components/brand/givingMark";
import { palette } from "@/theme/tokens";
import { useTheme } from "@/theme/useTheme";
import "leaflet/dist/leaflet.css";

const tileUrl = (style: "Light" | "Dark", layer: "Base" | "Reference") =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${style}_Gray_${layer}/MapServer/tile/{z}/{y}/{x}`;

type LeafletModule = typeof import("leaflet");
type MapTheme = "light" | "dark";

const tileUrls = (theme: MapTheme) => {
  const style = theme === "dark" ? "Dark" : "Light";
  return [tileUrl(style, "Base"), tileUrl(style, "Reference")];
};

/** Route color follows the theme's `--primary-ink`. */
const routeColor = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--primary-ink").trim() || palette.primary;

let leafletPromise: Promise<LeafletModule> | null = null;

/** Leaflet touches `window` on import, so it's loaded on the client only, once. */
function loadLeaflet(): Promise<LeafletModule> {
  leafletPromise ??= import("leaflet").then((m) => m.default);
  return leafletPromise;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

/** Zero-size anchor at the exact coordinate; label and pin are positioned around it with CSS. */
function projectIcon(L: LeafletModule, label: string, dir: "rtl" | "ltr") {
  return L.divIcon({
    className: "gc-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="gc-marker-anchor">
        <span class="gc-marker-label gc-marker-label--project" dir="${dir}">${escapeHtml(label)}</span>
        <span class="gc-marker-avatar">
          <span class="gc-marker-avatar-pulse"></span>
          <span class="gc-marker-avatar-core">${GIVING_MARK_SVG}</span>
        </span>
      </div>`,
  });
}

function destIcon(L: LeafletModule, name: string, time: string, dir: "rtl" | "ltr") {
  return L.divIcon({
    className: "gc-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="gc-marker-anchor">
        <span class="gc-marker-label gc-marker-label--dest" dir="${dir}">
          <span class="gc-marker-label-name">${escapeHtml(name)}</span>
          <span class="gc-marker-label-time">${escapeHtml(time)}</span>
        </span>
        <span class="gc-marker-dot"></span>
      </div>`,
  });
}

const FIT_OPTIONS: FitBoundsOptions = {
  paddingTopLeft: [70, 90],
  paddingBottomRight: [70, 130],
  animate: true,
  maxZoom: 14,
};

type Props = {
  active: NearbyPlace | null;
  isAr: boolean;
  projectLabel: string;
};

export function LocationLeafletMap({ active, isAr, projectLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeRef = useRef<Polyline | null>(null);
  const destRef = useRef<Marker | null>(null);
  const tilesRef = useRef<TileLayer[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const rafRef = useRef<number | null>(null);
  const alive = useRef(true);
  const [mapReady, setMapReady] = useState(false);
  const dir = isAr ? "rtl" : "ltr";
  const theme = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    alive.current = true;
    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        keyboard: false,
        scrollWheelZoom: false,
      }).setView([projectCoords.lat, projectCoords.lng], 11);

      tilesRef.current = tileUrls(themeRef.current).map((url) =>
        L.tileLayer(url, { maxZoom: 16 }).addTo(map),
      );
      L.control
        .attribution({ position: "topright", prefix: false })
        .addAttribution("Tiles &copy; Esri")
        .addTo(map);

      L.marker([projectCoords.lat, projectCoords.lng], {
        icon: projectIcon(L, projectLabel, dir),
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
      alive.current = false;
      abortRef.current?.abort();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
      routeRef.current = null;
      destRef.current = null;
      tilesRef.current = [];
      setMapReady(false);
    };
  }, [projectLabel, dir]);

  // Theme switch: swap tile styles and recolor the route in place (no map rebuild).
  useEffect(() => {
    if (!mapReady) return;
    tileUrls(theme).forEach((url, i) => tilesRef.current[i]?.setUrl(url));
    routeRef.current?.setStyle({ color: routeColor() });
  }, [theme, mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    abortRef.current?.abort();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    routeRef.current?.remove();
    routeRef.current = null;
    destRef.current?.remove();
    destRef.current = null;

    if (!active) {
      map.setView([projectCoords.lat, projectCoords.lng], 11, { animate: true });
      return;
    }

    destRef.current = L.marker([active.coords.lat, active.coords.lng], {
      icon: destIcon(
        L,
        isAr ? active.nameAr : active.nameEn,
        isAr ? active.timeAr : active.timeEn,
        dir,
      ),
      keyboard: false,
      interactive: false,
      zIndexOffset: 900,
    }).addTo(map);

    const endpoints: [number, number][] = [
      [projectCoords.lat, projectCoords.lng],
      [active.coords.lat, active.coords.lng],
    ];
    map.fitBounds(L.latLngBounds(endpoints), FIT_OPTIONS);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const url = `https://router.project-osrm.org/route/v1/driving/${projectCoords.lng},${projectCoords.lat};${active.coords.lng},${active.coords.lat}?overview=full&geometries=geojson`;

    const lineStyle: PolylineOptions = {
      color: routeColor(),
      weight: 4,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
    };

    fetch(url, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("route failed");
        return r.json();
      })
      .then((data) => {
        if (!alive.current || !mapRef.current) return;
        const coords = data?.routes?.[0]?.geometry?.coordinates as
          | [number, number][]
          | undefined;

        if (!Array.isArray(coords) || coords.length < 2) {
          routeRef.current = L.polyline(endpoints, { ...lineStyle, dashArray: "6 8" }).addTo(map);
          return;
        }

        const latlngs = coords.map(([lng, lat]) => [lat, lng] as [number, number]);
        routeRef.current = L.polyline([], lineStyle).addTo(map);
        map.fitBounds(L.latLngBounds([...latlngs, ...endpoints]), FIT_OPTIONS);

        let i = 0;
        const step = Math.max(1, Math.floor(latlngs.length / 80));
        const draw = () => {
          if (!alive.current || !routeRef.current) return;
          i = Math.min(latlngs.length, i + step);
          routeRef.current.setLatLngs(latlngs.slice(0, i));
          if (i < latlngs.length) rafRef.current = requestAnimationFrame(draw);
        };
        rafRef.current = requestAnimationFrame(draw);
      })
      .catch(() => {
        if (ctrl.signal.aborted || !mapRef.current) return;
        routeRef.current = L.polyline(endpoints, { ...lineStyle, dashArray: "6 8" }).addTo(map);
      });
  }, [active, isAr, dir, mapReady]);

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className="absolute inset-0 z-0 h-full w-full"
      aria-label={isAr ? "خريطة موقع Giving City" : "Giving City location map"}
    />
  );
}
