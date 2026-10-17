/**
 * The two Google Sheets the site talks to. Both links are public by design (a published
 * sheet and a web app endpoint), so they live here rather than in an env file. Leave a link
 * empty and that part simply keeps working the old way.
 *
 * 1. Chalets sheet ("Giving Compound - Chalets"): File → Share → Publish to web → the
 *    "Chalets" tab → CSV. The /compound map reads it on every visit (lib/chaletsSheet.ts);
 *    without it, the built-in data is used (content/chalet-availability.ts, chalet-areas.ts).
 * 2. Visit requests sheet ("Giving Compound - Visit requests"): the Apps Script web app in
 *    scripts/google-sheets/visit-requests.gs, deployed from that sheet. The register form
 *    sends every request there (as well as opening WhatsApp).
 */
export const chaletsSheetCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSnA-cKTLYs2yoOSLe9XXyX3w0_gRaOQM7R07LmduQK0hqA-fXACDUHLUbWXWOOm2JaXTVAd8abOdRR/pub?gid=747430111&output=csv";

export const visitRequestsWebAppUrl =
  "https://script.google.com/macros/s/AKfycbxUEwhZ3_ARAVk1Z9-h8JCmtIiROynpR4zM5v8-VfM-J6UwmE5HMkNHsjf1mY0xsVETYw/exec";
