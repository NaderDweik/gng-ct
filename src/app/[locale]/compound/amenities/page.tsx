import { setRequestLocale } from "next-intl/server";
import { ServicesPageBody } from "@/features/services/ServicesPageBody";
import type { LocalePageProps } from "@/i18n/types";
import { routeMetadata } from "@/lib/seo";

type Props = LocalePageProps;

export function generateMetadata({ params }: Props) {
  return routeMetadata(params, "/compound/amenities");
}

/*
 * Compound amenities. Not in the navbar; opened from the /compound map. Since Oct 2026
 * (client's request) it shows the services page content («ما بتحتاج إشي من برّا»)
 * instead of the shared-places section, which is kept below, commented out.
 */
export default async function CompoundAmenitiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesPageBody locale={locale} path="/compound/amenities" />;
}

/*
 * Previous content (shared places), commented out Oct 2026. To restore: put this back as
 * the page body and re-import SubpageHeader, PageJsonLd, amenitiesPageCopy,
 * communityPlaces and CommunityMosaic.
 *
 *   const c = amenitiesPageCopy[isAr ? "ar" : "en"];
 *   return (
 *     <>
 *       <PageJsonLd locale={locale} path="/compound/amenities" />
 *       <SubpageHeader tall title={c.compoundCrumb} />
 *       <section id="community" className="ap-section bg-surface-alt">
 *         <div className="container-gc">
 *           <header className="sec-head ap-svc-head">
 *             <div>
 *               <p className="section-eyebrow">{c.communityEyebrow}</p>
 *               <h2 className="section-title mb-0">{c.communityTitle}</h2>
 *             </div>
 *             <p className="section-sub">{c.communityLead}</p>
 *           </header>
 *           <CommunityMosaic places={communityPlaces} isAr={isAr} />
 *         </div>
 *       </section>
 *     </>
 *   );
 */
