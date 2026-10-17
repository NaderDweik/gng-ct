/*
 * Visitor analytics: PostHog, EU cloud. Started by components/analytics/Analytics.tsx, and only
 * once the visitor accepts analytics in the cookie notice (components/layout/CookieNotice.tsx).
 *
 * Off when NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is empty (it is read from .env.local at build
 * time), and always off under `npm run dev` and on localhost, so test visits never mix with
 * real ones. PostHog itself ignores bots. Loaded only once the page is idle, so it never slows
 * the first screen on phones; events from before that wait in a short queue.
 *
 * Automatic: page views (also in-site navigation), page leaves with time on page and scroll
 * depth ($prev_pageview_duration, $prev_pageview_max_scroll_percentage), clicks, rage clicks,
 * heatmaps, unhandled errors. Session recordings are switched on in PostHog's project settings;
 * typed text is always masked.
 *
 * Named events (every event also carries the page, $pathname). `placement` = where on the page
 * the tapped element sits (components/analytics/Analytics.tsx).
 *   register_cta_click     a link to the register page (placement, plan on the financing cards)
 *   register_started       first tap into the register form (from_page, from_placement)
 *   register_error         form checks failed (fields; from_page, from_placement)
 *   register_sent          the form opened WhatsApp (visit_day, visit_hour, country; from_page, from_placement)
 *                          Never name, phone or message.
 *   whatsapp_click         any WhatsApp link or the home FAQ chat (placement; chalet on the map)
 *   call_click             any phone link (placement)
 *   directions_click       a Google Maps link (placement)
 *   chalet_viewed          a chalet opened on the compound map (chalet, method: map/search/random/list)
 *   chalet_searched        the map's number search (query, found)
 *   chalet_room_viewed     a space in the chalet plan viewer, once per space per visit (room)
 *   nearby_place_viewed    a place on the location page's map (place)
 *   gallery_tab            gallery category switched (tab)
 *   gallery_photo_opened   a photo opened full-screen (photo, tab or source)
 *   video_started          a video starts (video, source_type)
 *   video_progress         25 / 50 / 75 / 100 % watched (video, percent)
 *   faq_opened             an FAQ answer opened (question, placement)
 *   faq_search_no_results  an FAQ search with nothing found (query)
 *   language_switch        AR ⇄ EN (to)
 * Hosts are allowed in the CSP (hosting.config.mjs): eu.i.posthog.com, eu-assets.i.posthog.com.
 */
import type { PostHog } from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "";
const POSTHOG_HOST = "https://eu.i.posthog.com";

export type Props = Record<string, string | number | boolean>;

let posthog: PostHog | null = null;
let state: "idle" | "loading" | "on" | "off" = "idle";
const queue: ((ph: PostHog) => void)[] = [];

function run(fn: (ph: PostHog) => void) {
  if (state === "off") return;
  if (posthog) fn(posthog);
  else if (queue.length < 50) queue.push(fn);
}

/** Sends an event (see the list above). */
export function track(event: string, props?: Props) {
  run((ph) => ph.capture(event, props));
}

/** Reports an error that React caught before it reached the page (app/global-error.tsx). */
export function trackError(error: unknown) {
  run((ph) => ph.captureException(error));
}

/** The visitor turned analytics off (cookie settings): stop capturing and recording. */
export function stopAnalytics() {
  if (posthog) posthog.opt_out_capturing();
  else if (state === "idle") queue.length = 0;
}

export async function startAnalytics() {
  // Turned back on after being turned off this visit.
  if (posthog) {
    posthog.opt_in_capturing();
    return;
  }
  if (state !== "idle") return;
  const allowed =
    !!POSTHOG_KEY &&
    process.env.NODE_ENV === "production" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (!allowed) {
    state = "off";
    queue.length = 0;
    return;
  }
  state = "loading";
  const { default: ph } = await import("posthog-js");
  ph.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Page views on in-site navigation, page leaves with time on page and scroll depth.
    defaults: "2026-08-30",
    person_profiles: "identified_only",
    capture_exceptions: true,
  });
  // PostHog keeps its own opt-out from an earlier visit's decline; the visitor has accepted now.
  if (ph.has_opted_out_capturing()) ph.opt_in_capturing();
  posthog = ph;
  state = "on";
  for (const fn of queue.splice(0)) fn(ph);
}
