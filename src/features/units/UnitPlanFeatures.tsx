import { RoomViewer } from "@/features/master-plan/RoomViewer";

/*
 * /master-plan: the room viewer edge to edge, straight under the page header (which
 * carries the "Every corner, in its place." title): a photo of each space beside the line
 * plan with that space outlined; arrows step through them.
 */

export function UnitPlanFeatures({ locale }: { locale: string }) {
  return (
    <section aria-label={locale === "ar" ? "مخطط الشاليه" : "Chalet plan"}>
      <RoomViewer locale={locale} />
    </section>
  );
}
