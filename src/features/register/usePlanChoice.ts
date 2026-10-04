"use client";

import { useEffect, useState } from "react";
import { toPlanChoice, type PlanChoice } from "@/content/pricing";

/**
 * The plan picked on the plans / financing cards, read from `?plan=` after
 * mount (keeps /register statically rendered — no useSearchParams needed).
 */
export function usePlanChoice(): PlanChoice | null {
  const [choice, setChoice] = useState<PlanChoice | null>(null);
  useEffect(() => {
    setChoice(toPlanChoice(new URLSearchParams(window.location.search).get("plan")));
  }, []);
  return choice;
}
