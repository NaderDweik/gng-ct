"use client";

import type { MouseEvent, ReactNode } from "react";
import { getPathname, usePathname } from "@/i18n/navigation";
import { useSwitchLocale } from "@/i18n/useSwitchLocale";

type Props = {
  className?: string;
  onSwitch?: () => void;
  /** Label override; defaults to the other language's name. */
  children?: (target: "ar" | "en") => ReactNode;
};

/**
 * The language toggle. A real link (works without JS, carries hreflang), but a
 * plain click runs the animated in-place switch (useSwitchLocale).
 */
export function LocaleSwitch({ className, onSwitch, children }: Props) {
  const pathname = usePathname();
  const { target, switchLocale, prefetch } = useSwitchLocale();
  const href = getPathname({ href: pathname, locale: target, forcePrefix: true });

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onSwitch?.();
    switchLocale();
  };

  return (
    <a
      href={href}
      hrefLang={target}
      lang={target}
      className={className}
      onClick={onClick}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
    >
      {children ? children(target) : target === "en" ? "EN" : "عربي"}
    </a>
  );
}
