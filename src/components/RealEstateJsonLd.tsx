import { site } from "@/content/site";

export function RealEstateJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: "Giving City Resort Unit",
    description: site.taglineEn,
    url: site.siteUrl,
    image: `${site.siteUrl}/hero/hero.jpg`,
    offers: {
      "@type": "Offer",
      price: site.stats.basePriceJd,
      priceCurrency: "JOD",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "JO",
      addressRegion: "Amman",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.coordinates.lat,
      longitude: site.coordinates.lng,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
