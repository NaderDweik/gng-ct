/**
 * Giving Compound: visit requests → Google Sheet.
 *
 * Paste into the «كمباوند روح العطاء - طلبات الزيارة» sheet: Extensions → Apps Script, replace
 * everything with this file, Save, then Deploy → New deployment → type "Web app",
 * Execute as: Me, Who has access: Anyone → Deploy. Copy the web app URL (ends in /exec) into
 * src/content/sheets.ts (visitRequestsWebAppUrl).
 * After editing this script later: Deploy → Manage deployments → edit → Version: New version,
 * so the same URL keeps working.
 *
 * The site sends one JSON body per request (see features/register/RegisterForm.tsx):
 * { name, phone, country, day, time, chalet, message, language, page, website }
 */

const SHEET_NAME = "طلبات الزيارة";
const MAX = 600; // longest text kept per field

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    // Bots fill the hidden "website" field; people never see it.
    if (d.website) return reply_("ok");
    if (!d.name || !d.phone) return reply_("missing");

    // Text only: a leading = + - @ would otherwise be read as a formula or a number.
    const clean = (v) => {
      const s = String(v == null ? "" : v).slice(0, MAX).trim();
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
      sheet.appendRow([
        new Date(),
        clean(d.name),
        clean(d.phone),
        clean(d.country),
        clean(d.day),
        clean(d.time),
        clean(d.chalet), // empty unless the visitor came from a chalet on the compound map
        clean(d.message),
        clean(d.language),
        clean(d.page),
        "جديد",
      ]);
    } finally {
      lock.releaseLock();
    }
    return reply_("ok");
  } catch (err) {
    return reply_("error");
  }
}

/** Opening the web app link in a browser just confirms it's running. */
function doGet() {
  return reply_("Giving Compound visit requests: running");
}

function reply_(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}
