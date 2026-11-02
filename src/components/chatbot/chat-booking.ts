/*
 * Booking a visit without leaving the chat. Layan asks for the same things as the /register
 * form, one at a time: name → phone (with country code) → day → hour → an optional note →
 * a review card → «احجز عبر واتساب». It uses the form's own rules, slots and sending
 * (features/register/*), so a request from the chat reaches the team exactly like one from
 * the form: a row in the visit requests sheet and a WhatsApp message.
 *
 * Questions typed mid-booking are answered as usual, then the booking picks up where it was.
 */

import { defaultCountry } from "@/content/countries";
import { visitHours, visitSlotsCopy } from "@/content/visit-slots";
import { MESSAGE_MAX, NAME_MAX, PHONE_MAX, cleanName, normalizePhone, splitInternational, validateLead } from "@/features/register/leadRules";
import { dayLabel, hourLabel, upcomingDays, type VisitDay } from "@/features/register/VisitPicker";
import { saveVisitRequest, visitWhatsAppUrl, type VisitRequest } from "@/features/register/visitRequest";
import { track } from "@/lib/analytics";
import { localeTag } from "@/lib/format";

type Step = "name" | "phone" | "day" | "hour" | "note" | "review" | "done";

export type BookingCtx = {
  log: HTMLElement;
  input: HTMLInputElement;
  form: HTMLFormElement;
  bar: HTMLElement;
  say: (text: string, quick?: boolean) => Promise<void>;
  me: (text: string) => void;
  scroll: () => void;
  /** Runs `fn` while the composer is locked (one thing at a time). */
  run: (fn: () => Promise<void>) => Promise<void>;
  onEnd: () => void;
  /** Composer mode, so ChatWidget shows the country picker for the phone. */
  setMode: (mode: ComposerMode) => void;
  /** Show this country in the picker (a pasted +966… number switches it). */
  showCountry: (iso: string) => void;
};

export type ComposerMode = "chat" | "name" | "phone" | "note";

const AR = "ar";
// Same date wording as the /register form (Latin digits, Levantine month names).
const TAG = localeTag(AR);
const copy = visitSlotsCopy.ar;
const CANCEL = /^(الغاء|إلغاء|الغي|ألغي|الغيه|ألغيه|بلاش|بطلت|مش حابب|cancel)/i;
const STEPS: { label: string; of: Step[] }[] = [
  { label: "الاسم", of: ["name"] },
  { label: "الهاتف", of: ["phone"] },
  { label: "الموعد", of: ["day", "hour", "note"] },
  { label: "التأكيد", of: ["review", "done"] },
];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

const svg = {
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  pen: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .15 5.35.15 11.9c0 2.1.55 4.15 1.6 5.95L0 24l6.3-1.65a11.86 11.86 0 0 0 5.75 1.45h.01c6.55 0 11.9-5.35 11.9-11.9 0-3.18-1.24-6.17-3.46-8.4Zm-8.45 18.25h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.74.98 1-3.64-.24-.37a9.84 9.84 0 0 1-1.5-5.24c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.96 2.88a9.8 9.8 0 0 1 2.88 6.97c0 5.43-4.42 9.85-9.85 9.85Zm5.72-7.37c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.51-1.55-.93-.83-1.55-1.85-1.73-2.16-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.44.2 1.98.12.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.12-.29-.2-.6-.36Z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
};

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export function createBooking(ctx: BookingCtx) {
  const { log, input, form, bar } = ctx;
  let r: VisitRequest = blank();
  let step: Step | null = null;
  // Changing one answer from the review card goes straight back to the review.
  let editing = false;
  let days: VisitDay[] = [];

  function blank(): VisitRequest {
    return { name: "", country: defaultCountry, phone: "", day: null, hour: null, message: "" };
  }

  /* ---------- Composer: the text box changes with the question ---------- */
  // The country code picker is the /register one (useCountryPicker), shown by ChatWidget
  // while the composer is in "phone" mode.
  const DEFAULT_PH = input.placeholder;

  function setCountry(iso: string) {
    r.country = iso;
    ctx.showCountry(iso);
  }

  function composer(mode: ComposerMode) {
    form.dataset.mode = mode;
    ctx.setMode(mode);
    input.dir = mode === "phone" ? "ltr" : "rtl";
    input.inputMode = mode === "phone" ? "tel" : "text";
    input.autocomplete = mode === "name" ? "name" : mode === "phone" ? "tel-national" : "off";
    input.maxLength = mode === "name" ? NAME_MAX : mode === "phone" ? PHONE_MAX : mode === "note" ? MESSAGE_MAX : 300;
    input.placeholder = { chat: DEFAULT_PH, name: "اسمك الكامل", phone: "79 123 4567", note: "اكتب ملاحظتك هنا…" }[mode];
  }

  /* ---------- Progress strip under the header ---------- */
  function renderBar() {
    if (!step) {
      bar.classList.remove("is-on");
      return;
    }
    const at = STEPS.findIndex((s) => s.of.includes(step!));
    bar.classList.add("is-on");
    bar.replaceChildren();
    const top = el("div", "cb-bar-top");
    const title = el("span", "cb-bar-title");
    title.innerHTML = `${svg.cal}<span>حجز زيارة</span>`;
    const stop = el("button", "cb-bar-cancel", step === "done" ? "إغلاق" : "إلغاء");
    stop.type = "button";
    stop.onclick = () => void ctx.run(() => (step === "done" ? end() : cancel()));
    top.append(title, stop);
    const track = el("ol", "cb-bar-steps");
    STEPS.forEach((s, i) => {
      const li = el("li", i < at || step === "done" ? "is-done" : i === at ? "is-now" : "", s.label);
      if (i === at && step !== "done") li.setAttribute("aria-current", "step");
      track.append(li);
    });
    bar.append(top, track);
  }

  function lock(card: HTMLElement) {
    card.classList.add("is-done");
    card.querySelectorAll("button").forEach((b) => (b.disabled = true));
  }

  /* ---------- Steps ---------- */
  async function go(next: Step) {
    step = next;
    renderBar();
    composer(next === "name" ? "name" : next === "phone" ? "phone" : next === "note" ? "note" : "chat");
    if (next === "name") await ctx.say(pick(["تمام! خلّينا نبدأ 😊 شو الاسم الكريم؟", "يا هلا! بس بدي كم معلومة بسيطة 🌿 شو اسمك الكامل؟"]));
    else if (next === "phone") {
      const first = r.name.split(" ")[0];
      await ctx.say(editing ? "اكتب الرقم الجديد 📱" : `أهلين ${first} 🌿 شو رقم تلفونك؟ عشان الفريق يأكد معك الموعد.`);
      if (!editing) await ctx.say("إذا رقمك من برّا الأردن، غيّر رمز الدولة من جنب الخانة 👇", true);
    } else if (next === "day") {
      await ctx.say(editing ? "اختار اليوم اللي بناسبك 📅" : "حلو! أي يوم بناسبك للزيارة؟ 📅");
      dayPicker();
    } else if (next === "hour") {
      await ctx.say(`وأي ساعة يوم ${r.day!.date.toLocaleDateString(TAG, { weekday: "long" })}؟ ⏰`, true);
      hourPicker();
    } else if (next === "note") {
      await ctx.say("حابب تضيف ملاحظة للفريق؟ مثلًا عدد الأشخاص أو شاليه معيّن (اختياري) ✍️");
      const box = el("div", "cb-chips cb-chips-row");
      const skip = el("button", undefined, "بدون ملاحظات");
      skip.type = "button";
      skip.onclick = () =>
        void ctx.run(async () => {
          box.remove();
          ctx.me("بدون ملاحظات");
          r.message = "";
          await go("review");
        });
      box.append(skip);
      log.append(box);
      ctx.scroll();
    } else if (next === "review") {
      editing = false;
      await ctx.say(pick(["تمام، هاي تفاصيل زيارتك 👇 تأكد منها واضغط «احجز عبر واتساب».", "ممتاز! راجع التفاصيل 👇 وإذا كلّه تمام اضغط «احجز عبر واتساب»."]));
      review();
    }
    if (next === "name" || next === "phone" || next === "note") input.focus();
  }

  function dayPicker() {
    days = upcomingDays();
    const card = el("div", "cb-card cb-pick");
    const row = el("div", "cb-days");
    row.setAttribute("role", "group");
    row.setAttribute("aria-label", "يوم الزيارة");
    for (const d of days) {
      const b = el("button", `cb-day${d.closed ? " is-booked" : ""}${r.day?.key === d.key ? " is-active" : ""}`);
      b.type = "button";
      b.disabled = d.closed;
      b.append(
        el("span", "cb-day-name", d.date.toLocaleDateString(TAG, { weekday: "long" })),
        el("span", "cb-day-date", d.date.toLocaleDateString(TAG, { day: "numeric", month: "long" })),
      );
      if (d.closed) b.append(el("span", "cb-day-status", copy.booked));
      b.onclick = () =>
        void ctx.run(async () => {
          b.classList.add("is-active");
          lock(card);
          ctx.me(dayLabel(d.date, AR));
          r.day = d;
          if (r.hour !== null && d.booked.includes(r.hour)) r.hour = null;
          await go("hour");
        });
      row.append(b);
    }
    card.append(row);
    log.append(card);
    ctx.scroll();
  }

  function hourPicker() {
    const d = r.day!;
    const card = el("div", "cb-card cb-pick");
    const grid = el("div", "cb-hours");
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", "ساعة الزيارة");
    for (const h of visitHours) {
      const booked = d.booked.includes(h);
      const b = el("button", `cb-hour${booked ? " is-booked" : ""}`);
      b.type = "button";
      b.disabled = booked;
      b.append(el("span", "cb-hour-time", hourLabel(h, AR)), el("span", "cb-hour-status", booked ? copy.booked : copy.available));
      b.onclick = () =>
        void ctx.run(async () => {
          b.classList.add("is-active");
          lock(card);
          ctx.me(hourLabel(h, AR));
          r.hour = h;
          await go(editing ? "review" : "note");
        });
      grid.append(b);
    }
    card.append(grid);
    log.append(card);
    ctx.scroll();
  }

  function review() {
    const card = el("div", "cb-card cb-review");
    const head = el("div", "cb-review-head");
    head.innerHTML = `${svg.cal}<span>تفاصيل زيارتك</span>`;
    const full = normalizePhone(r.country, r.phone);
    const rows: [string, string, Step, boolean?][] = [
      ["الاسم", r.name, "name"],
      ["الهاتف", full ? `+${full}` : r.phone, "phone", true],
      ["الموعد", `${dayLabel(r.day!.date, AR)}، ${hourLabel(r.hour!, AR)}`, "day"],
      ...(r.message ? ([["ملاحظتك", r.message, "note"]] as [string, string, Step][]) : []),
    ];
    const dl = el("dl", "cb-review-rows");
    for (const [k, v, s, ltr] of rows) {
      const row = el("div", "cb-review-row");
      const dd = el("dd", undefined, v);
      if (ltr) dd.dir = "ltr";
      const edit = el("button", "cb-edit");
      edit.type = "button";
      edit.innerHTML = `${svg.pen}<span>تعديل</span>`;
      edit.setAttribute("aria-label", `تعديل ${k}`);
      edit.onclick = () =>
        void ctx.run(async () => {
          lock(card);
          card.classList.add("is-stale");
          editing = true;
          ctx.me(`بدي أعدّل ${k === "الموعد" ? "الموعد" : k}`);
          await go(s);
        });
      row.append(el("dt", undefined, k), dd, edit);
      dl.append(row);
    }
    const place = el("p", "cb-review-place", r.chalet ? `📍 الشاليه ${r.chalet} · كمباوند شاليهات روح العطاء، عمّان` : "📍 كمباوند شاليهات روح العطاء، عمّان");
    const confirm = el("button", "cb-confirm");
    confirm.type = "button";
    confirm.innerHTML = `${svg.wa}<span>احجز عبر واتساب</span>`;
    // window.open must run inside the tap itself, or the browser blocks it.
    confirm.onclick = () => {
      if (step !== "review") return;
      const url = visitWhatsAppUrl(r, AR);
      window.open(url, "_blank", "noopener,noreferrer");
      saveVisitRequest(r, { locale: AR, page: `المساعد (ليان) ${location.pathname}` });
      track("register_sent", {
        visit_day: r.day?.key ?? "",
        visit_hour: r.hour ?? -1,
        country: r.country,
        chalet: r.chalet ?? "",
        from_page: location.pathname,
        from_placement: "chatbot",
      });
      lock(card);
      void ctx.run(() => done(url));
    };
    const lang = document.documentElement.lang === "en" ? "/en" : "";
    const consent = el("p", "cb-consent");
    consent.innerHTML = `بالضغط على «احجز عبر واتساب» فإنك توافق على <a href="${lang}/privacy">سياسة الخصوصية</a> و<a href="${lang}/terms">شروط الاستخدام</a>.`;
    card.append(head, dl, place, confirm, consent);
    log.append(card);
    ctx.scroll();
  }

  async function done(url: string) {
    step = "done";
    renderBar();
    composer("chat");
    const card = el("div", "cb-card cb-done");
    const tick = el("span", "cb-done-tick");
    tick.innerHTML = svg.check;
    const open = el("a", "cb-done-link", "لم يفتح واتساب؟ افتحه من هنا");
    open.href = url;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    card.append(tick, el("b", undefined, "طلبك جاهز!"), el("p", undefined, "رسالتك جاهزة في واتساب، اضغط «إرسال» هناك ليوصل طلبك للفريق."), open);
    log.append(card);
    ctx.scroll();
    const when = `${dayLabel(r.day!.date, AR)} الساعة ${hourLabel(r.hour!, AR)}`;
    await ctx.say(`بنستناك ${when} 🌿 الفريق رح يتواصل معك ليأكد الموعد.`);
    await ctx.say("وإذا عندك أي سؤال ثاني، أنا هون 😊", true);
    end(false);
  }

  async function cancel() {
    step = null;
    editing = false;
    renderBar();
    composer("chat");
    log.querySelectorAll(".cb-pick:not(.is-done), .cb-review:not(.is-done), .cb-chips-row").forEach((c) =>
      c.classList.contains("cb-chips-row") ? c.remove() : lock(c as HTMLElement),
    );
    await ctx.say(pick(["ولا يهمك، ألغيت الحجز 🌿", "تمام، وقفنا الحجز 👌"]));
    await ctx.say("إذا حبيت تحجز بأي وقت، بس احكيلي «احجز زيارة» 😊", true);
    ctx.onEnd();
  }

  async function end(resetBar = true) {
    step = null;
    if (resetBar) renderBar();
    else setTimeout(renderBar, 2400);
    composer("chat");
    ctx.onEnd();
  }

  return {
    get active() {
      return step !== null && step !== "done";
    },

    /** `chalet`: the chalet the visitor was looking at, carried into the request. */
    async start(chalet?: string) {
      r = { ...blank(), name: r.name, phone: r.phone, country: r.country, chalet: chalet ?? null };
      ctx.showCountry(r.country);
      editing = false;
      track("register_started", { from_page: location.pathname, from_placement: "chatbot" });
      // Known from an earlier booking in this chat: skip straight to the day.
      await go(r.name ? (r.phone ? "day" : "phone") : "name");
    },

    /** Text typed while booking. Returns false when it's a question for the normal chat. */
    async onText(text: string): Promise<boolean> {
      if (CANCEL.test(text.trim())) {
        await cancel();
        return true;
      }
      if (step === "name") {
        const err = validateLead({ name: text, country: r.country, phone: "0", slot: "x", message: "" }, AR).name;
        if (err) {
          await ctx.say(pick(["سامحني، بدي الاسم بالأحرف بس 🙏 شو اسمك الكامل؟", "ممكن تكتبلي اسمك بالأحرف؟ 🙏"]));
          return true;
        }
        r.name = cleanName(text);
        await go(editing ? "review" : "phone");
        return true;
      }
      if (step === "phone") {
        const split = splitInternational(text, r.country);
        let raw = text;
        if (split) {
          setCountry(split.country);
          raw = split.rest;
        }
        if (raw.length > PHONE_MAX || !normalizePhone(r.country, raw)) {
          await ctx.say(
            r.country === "JO"
              ? "الرقم مش مزبوط 🙏 اكتبه هيك مثلًا: 0791234567"
              : "الرقم مش مزبوط 🙏 تأكد منه ومن رمز الدولة، وجرّب مرة ثانية.",
          );
          return true;
        }
        r.phone = raw;
        await go(editing ? "review" : "day");
        return true;
      }
      if (step === "note") {
        const err = validateLead({ name: "اسم", country: "JO", phone: "791234567", slot: "x", message: text }, AR).message;
        if (err) {
          await ctx.say(err);
          return true;
        }
        log.querySelectorAll(".cb-chips-row").forEach((c) => c.remove());
        r.message = text.trim();
        await go("review");
        return true;
      }
      return false;
    },

    /** After answering a question mid-booking: show the current step again. */
    async resume() {
      if (!step || step === "done") return;
      await ctx.say(pick(["نكمّل الحجز؟ 👇", "يلا نكمّل حجز الزيارة 👇"]), true);
      editing = editing && step !== "review";
      const s = step;
      if (s === "day") dayPicker();
      else if (s === "hour") hourPicker();
      else if (s === "review") review();
      else await go(s);
    },

    async cancel() {
      if (step) await cancel();
    },

    /** Chosen in the country picker. */
    setCountry(iso: string) {
      r.country = iso;
    },
  };
}
