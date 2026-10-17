"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { availableServices, servicePhotos, servicesCopy, upcomingServices } from "@/content/services";
import { ServicesViewer, type ViewerShot } from "@/features/services/ServicesViewer";

/*
 * /services (styles: styles/sections/services-directory.css): one card with a big
 * photo and the "Available now" list beside it. The list steps through the services
 * slowly on its own (pausing while the pointer is on the card); clicking or tapping a
 * service shows its photo. Below, a dark band that tucks under the card holds what is
 * coming, as a bento of muted tiles.
 */

const STEP_MS = 3500;

/**
 * Bento sizes for the coming-soon grid (columns x rows on the six-column desktop grid);
 * anything not listed is a single cell. This arrangement packs into full rows with no
 * gaps on both the six- and two-column grids (checked in the browser); re-check after
 * changing it, since dense packing depends on the order of the list.
 */
type SoonSize = "xl" | "hero" | "lg" | "wide3" | "wide" | "tall3" | "tall";
const SOON_SIZE: Record<string, SoonSize> = {
  helipad: "xl", // 3 x 3
  schools: "hero", // 3 x 2
  clinic: "lg", // 2 x 2
  equestrian: "lg",
  spa: "lg",
  trips: "wide3", // 3 x 1
  transport: "wide3",
  "beauty-men": "wide3",
  "outdoor-cinema": "wide", // 2 x 1
  "dog-care": "wide",
  football: "wide",
  "bird-park": "wide",
  "beauty-women": "wide",
  emergency: "tall3", // 1 x 3
  bazaar: "tall", // 1 x 2
  "events-hall": "tall",
  restaurant: "tall",
};

export function ServicesDirectory({ locale, stats }: { locale: string; stats?: ReactNode }) {
  const isAr = locale === "ar";
  const copy = servicesCopy[isAr ? "ar" : "en"];

  const shots: ViewerShot[] = availableServices.map((s) => ({
    id: s.id,
    src: servicePhotos[s.id] ?? "",
    en: s.titleEn,
    ar: s.titleAr,
    icon: s.icon,
  }));

  // Coming-soon tiles rise into view as they scroll in; tiles further along a row
  // arrive a beat later (measured, so it holds at every breakpoint).
  const soon = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const tiles = soon.current?.querySelectorAll<HTMLElement>(".svc-tile--soon");
    if (!tiles?.length) return;

    const stagger = () => {
      const list = [...tiles];
      const lefts = [...new Set(list.map((t) => t.offsetLeft))].sort((a, b) => a - b);
      for (const t of list) t.style.setProperty("--col", String(lefts.indexOf(t.offsetLeft)));
    };
    stagger();
    window.addEventListener("resize", stagger);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    tiles.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      window.removeEventListener("resize", stagger);
    };
  }, []);

  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);

  // Phones: scrolling drives the list instead of a timer. The photo pins at the top
  // (services-directory.css) and the service passing just under it becomes active.
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!phone) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const stage = document.querySelector(".svv-stage");
      const items = document.querySelectorAll<HTMLElement>(".svv-item");
      if (!stage || !items.length) return;
      const line = stage.getBoundingClientRect().bottom + 24;
      let idx = 0;
      items.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) idx = i;
      });
      // The list has no spare space under it, so the last services can't reach the line:
      // once the last one is fully on screen, it is the active one.
      const lastEl = items[items.length - 1]!;
      if (lastEl.getBoundingClientRect().bottom <= window.innerHeight - 8) idx = items.length - 1;
      setIndex(idx);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, [phone]);

  /** Phones: tapping a service scrolls it up under the pinned photo (scroll stays in charge). */
  const pick = (i: number) => {
    if (!phone) return setIndex(i);
    const stage = document.querySelector(".svv-stage");
    const item = document.querySelectorAll<HTMLElement>(".svv-item")[i];
    if (!stage || !item) return setIndex(i);
    const line = stage.getBoundingClientRect().bottom + 24;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: window.scrollY + item.getBoundingClientRect().top - line + 4, behavior: still ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (phone || held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % shots.length), STEP_MS);
    return () => clearInterval(t);
  }, [phone, held, index, shots.length]);

  return (
    <>
      <ServicesViewer
        shots={shots}
        index={index}
        onPick={pick}
        onHold={setHeld}
        isAr={isAr}
        title={copy.available}
        sub={copy.availableSub}
      />

      <section className="svc on-dark">
        <div className="container-gc">
          {/* Key figures (from the page) open the dark band, above what's coming. */}
          {stats}
          <div className="svc-soon">
            <header className="svc-head">
              <p className="svc-soon-badge">{copy.upcoming}</p>
              <p className="svc-sub">{copy.upcomingSub}</p>
            </header>
            <ul ref={soon} className="svc-bento">
              {upcomingServices.map((s) => (
                <li key={s.id} className={`svc-tile svc-tile--soon${SOON_SIZE[s.id] ? ` is-${SOON_SIZE[s.id]}` : ""}`}>
                  <span className="svc-tile-title">{isAr ? s.titleAr : s.titleEn}</span>
                </li>
              ))}
            </ul>
            <p className="svc-soon-big" aria-hidden>
              {copy.upcoming}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
