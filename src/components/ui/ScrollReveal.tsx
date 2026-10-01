"use client";

import { useEffect } from "react";

/*
 * Section-by-section scroll reveal (styles: styles/base/motion.css, `.rv`).
 * For every matching section, the direct children of its content container rise in as
 * the section enters the viewport; section heads and card grids are split so their
 * pieces cascade one after another. Classes are only added on the client, so the page
 * is fully visible without JS; reduced motion skips it entirely.
 */

/** Wrappers whose children should cascade individually rather than as one block. */
const SPLIT = [".sec-head", ".brands", ".np-grid", ".amg", ".gd-bento", ".hi-copy"];
const MAX_STAGGER = 8;

export function ScrollReveal({ sections = "main > section:not(:first-child)" }: { sections?: string }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(sections));

    const itemsOf = (section: HTMLElement) => {
      const root = section.querySelector<HTMLElement>(".container-gc") ?? section;
      const out: HTMLElement[] = [];
      const walk = (el: HTMLElement) => {
        if (SPLIT.some((s) => el.matches(s)) && el.children.length) {
          Array.from(el.children).forEach((c) => walk(c as HTMLElement));
        } else {
          out.push(el);
        }
      };
      Array.from(root.children).forEach((c) => walk(c as HTMLElement));
      return out;
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("rv-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((section) => {
      // Already on screen at load: leave it alone (no hide-then-show flash).
      if (section.getBoundingClientRect().top < innerHeight * 0.9) return;
      itemsOf(section).forEach((el, i) => {
        el.classList.add("rv");
        el.style.setProperty("--rv-i", String(Math.min(i, MAX_STAGGER)));
      });
      section.classList.add("rv-section");
      io.observe(section);
    });

    return () => io.disconnect();
  }, [sections]);

  return null;
}
