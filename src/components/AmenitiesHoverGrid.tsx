import Image from "next/image";
import type { AmenityFeature } from "@/content/amenities";

function AmenityIcon({
  name,
  className,
}: {
  name: AmenityFeature["icon"];
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "pool":
      return (
        <svg {...common}>
          <path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" />
          <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" />
          <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" />
        </svg>
      );
    case "security":
      return (
        <svg {...common}>
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V7l-8-4Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "fiber":
      return (
        <svg {...common}>
          <path d="M5 12a7 7 0 0 1 14 0" />
          <path d="M8.5 12a3.5 3.5 0 0 1 7 0" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
          <path d="M12 13v7" />
        </svg>
      );
    case "kids":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 10h.01M15 10h.01" />
          <path d="M8.5 15a4.5 4.5 0 0 0 7 0" />
        </svg>
      );
    case "bbq":
      return (
        <svg {...common}>
          <path d="M8 14c0 2 1.8 4 4 4s4-2 4-4" />
          <path d="M6 14h12" />
          <path d="M9 10c.5-2 1.5-4 3-5 1.5 1 2.5 3 3 5" />
          <path d="M10 18v3M14 18v3" />
        </svg>
      );
    case "walls":
      return (
        <svg {...common}>
          <path d="M4 20V8l8-4 8 4v12" />
          <path d="M4 12h16M12 4v16" />
        </svg>
      );
    case "parking":
      return (
        <svg {...common}>
          <path d="M5 17h14v-5l-2-4H7l-2 4z" />
          <circle cx="7.5" cy="17.5" r="1.5" />
          <circle cx="16.5" cy="17.5" r="1.5" />
          <path d="M7 8h10" />
        </svg>
      );
    case "green":
      return (
        <svg {...common}>
          <path d="M12 21V11" />
          <path d="M12 11c-3-1-5-3.5-5-7 4 0 5 3 5 7Z" />
          <path d="M12 11c3-1 5-3.5 5-7-4 0-5 3-5 7Z" />
        </svg>
      );
  }
}

type Props = {
  items: AmenityFeature[];
  isAr: boolean;
};

export function AmenitiesHoverGrid({ items, isAr }: Props) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden border border-neutral-200/60 bg-neutral-200/60 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="group relative flex h-full min-h-[340px] cursor-default select-none flex-col justify-between overflow-hidden bg-white p-7 transition-colors duration-500 md:min-h-[360px] md:p-8"
        >
          <div className="pointer-events-none absolute inset-0 z-0 max-sm:scale-100 max-sm:opacity-100 sm:scale-[1.05] sm:opacity-0 sm:transition-all sm:duration-700 sm:ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:scale-100 sm:group-hover:opacity-100">
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#465461]/95 via-[#465461]/80 to-[#465461]/55 transition-opacity duration-500 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between items-start">
            <div className="w-full">
              <div className="mb-5">
                <AmenityIcon
                  name={item.icon}
                  className="h-9 w-9 text-[#465461] transition-colors duration-300 group-hover:text-white max-sm:text-white"
                />
              </div>
              <h3 className="font-display mb-3 text-xl font-semibold leading-tight text-[#465461] transition-colors duration-300 group-hover:text-white max-sm:text-white md:text-2xl">
                {isAr ? item.titleAr : item.titleEn}
              </h3>
              {(isAr ? item.tagsAr : item.tagsEn).length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-1.5">
                  {(isAr ? item.tagsAr : item.tagsEn).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#465461] transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white max-sm:bg-white/20 max-sm:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-auto w-full text-sm leading-relaxed text-neutral-600 transition-colors duration-300 group-hover:text-white/90 max-sm:text-white/90">
              {isAr ? item.descAr : item.descEn}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
