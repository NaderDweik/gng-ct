"use client";

import { useEffect, useState } from "react";
import { chaletListings, featureEn, isChaletAvailable, type ChaletFeature } from "@/content/chalet-availability";
import { chaletArea } from "@/content/chalet-areas";
import { chaletsSheetCsvUrl } from "@/content/sheets";

/*
 * Each chalet's details for the /compound map: the built-in data, overridden by the client's
 * published Chalets sheet when its link is set (content/sheets.ts). The sheet is read once per
 * visit, in the browser; if it can't be reached, the built-in data stays.
 * Sheet columns, by their Arabic headers (the English ones also work): الشاليه, الحالة
 * (متاح / غير متاح), المساحة (م²), غرف النوم, مسبح خاص وجاكوزي (نعم / لا), الوصف (عربي),
 * الوصف (إنجليزي), السعر كاش (دينار), المميزات, المميزات (إنجليزي). Features are one per
 * line (or separated by «،»); English ones missing from the sheet come from the known list.
 */

export type ChaletInfo = {
  available: boolean;
  area?: number;
  bedrooms: number;
  pool: boolean;
  descAr?: string;
  descEn?: string;
  /** Cash price in JD. */
  priceJd?: number;
  features: ChaletFeature[];
};

type Row = Partial<ChaletInfo>;

const builtIn = (id: string): ChaletInfo => ({
  available: isChaletAvailable(id),
  area: chaletListings[id]?.area ?? chaletArea(id),
  bedrooms: 3,
  pool: true,
  priceJd: chaletListings[id]?.priceJd,
  features: chaletListings[id]?.features ?? [],
});

const lines = (v: string | undefined) =>
  (v ?? "")
    .split(/\n|،|,/)
    .map((x) => x.trim())
    .filter(Boolean);

/** A small CSV reader: quoted fields, doubled quotes, commas and line breaks inside quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

/** نعم / Yes → true, لا / No → false, empty → no change. */
const yes = (v: string | undefined) => (v ? !/^(no|false|0|لا)$/i.test(v.trim()) : undefined);
const num = (v: string | undefined) => {
  const n = Number((v ?? "").replace(/[^\d.]/g, ""));
  return v && n > 0 ? n : undefined;
};

function readSheet(text: string): Map<string, Row> {
  const [head, ...rows] = parseCsv(text);
  const map = new Map<string, Row>();
  if (!head) return map;
  const col = (...names: string[]) =>
    head.findIndex((h) => names.some((n) => h.trim().toLowerCase() === n.toLowerCase()));
  const c = {
    id: col("الشاليه", "Chalet"),
    status: col("الحالة", "Status"),
    area: col("المساحة (م²)", "Area (m²)"),
    bedrooms: col("غرف النوم", "Bedrooms"),
    pool: col("مسبح خاص وجاكوزي", "Private pool & jacuzzi"),
    descAr: col("الوصف (عربي)", "Description (Arabic)"),
    descEn: col("الوصف (إنجليزي)", "Description (English)"),
    price: col("السعر كاش (دينار)", "Cash price (JD)"),
    featAr: col("المميزات", "Features (Arabic)"),
    featEn: col("المميزات (إنجليزي)", "Features (English)"),
  };
  if (c.id < 0) return map;
  const at = (r: string[], i: number) => (i >= 0 ? r[i]?.trim() : undefined);
  for (const r of rows) {
    const id = at(r, c.id)?.toUpperCase().replace(/\s+/g, "");
    if (!id) continue;
    const status = at(r, c.status);
    map.set(id, {
      available: status ? status === "متاح" || /^available$/i.test(status) : undefined,
      area: num(at(r, c.area)),
      bedrooms: num(at(r, c.bedrooms)),
      pool: yes(at(r, c.pool)),
      descAr: at(r, c.descAr) || undefined,
      descEn: at(r, c.descEn) || undefined,
      priceJd: num(at(r, c.price)),
      features: (() => {
        if (c.featAr < 0) return undefined;
        const en = lines(at(r, c.featEn));
        return lines(at(r, c.featAr)).map((ar, i) => ({ ar, en: en[i] || featureEn(ar) || ar }));
      })(),
    });
  }
  return map;
}

/** Everything the map needs about a chalet, with the sheet's values once they've loaded. */
export function useChaletData() {
  const [sheet, setSheet] = useState<Map<string, Row> | null>(null);

  useEffect(() => {
    if (!chaletsSheetCsvUrl) return;
    let alive = true;
    const load = () =>
      fetch(chaletsSheetCsvUrl, { cache: "no-store" }).then((r) =>
        r.ok ? r.text() : Promise.reject(new Error(String(r.status))),
      );
    // Google now and then bounces a request to its sign-in page; one retry gets through.
    load()
      .catch(() => new Promise((ok) => setTimeout(ok, 1500)).then(load))
      .then((t) => alive && setSheet(readSheet(t)))
      .catch(() => {
        // Sheet unreachable: the built-in data stays.
      });
    return () => {
      alive = false;
    };
  }, []);

  const info = (id: string): ChaletInfo => {
    const base = builtIn(id);
    const row = sheet?.get(id);
    if (!row) return base;
    return {
      available: row.available ?? base.available,
      area: row.area ?? base.area,
      bedrooms: row.bedrooms ?? base.bedrooms,
      pool: row.pool ?? base.pool,
      descAr: row.descAr,
      descEn: row.descEn,
      priceJd: row.priceJd ?? base.priceJd,
      features: row.features ?? base.features,
    };
  };

  return { info, isAvailable: (id: string) => info(id).available, loaded: sheet !== null };
}
