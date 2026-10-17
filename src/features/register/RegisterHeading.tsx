"use client";

import { useEffect, useState } from "react";
import { compoundUnits } from "@/content/compound-units";

/**
 * The chalet a visitor came from on the compound map ("Register interest" on a chalet links
 * to /register?chalet=D24). Read in the browser (the page is static); only real chalet
 * numbers are kept.
 */
export function useChaletParam() {
  const [chalet, setChalet] = useState<string | null>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("chalet")?.toUpperCase();
    if (id && compoundUnits.some((u) => u.id === id)) setChalet(id);
  }, []);
  return chalet;
}

/** The form panel's title: "Choose your visit time", plus "– Chalet D24" when one was picked. */
export function RegisterHeading({ isAr }: { isAr: boolean }) {
  const chalet = useChaletParam();
  return (
    <h2 className="font-display text-xl font-bold text-on-dark md:text-2xl">
      {isAr ? "اختر موعد زيارتك" : "Choose your visit time"}
      {chalet ? (
        <>
          {" – "}
          {isAr ? "شاليه" : "Chalet"} <span dir="ltr">{chalet}</span>
        </>
      ) : (
        "."
      )}
    </h2>
  );
}
