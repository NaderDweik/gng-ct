/*
 * Layan's conversation loop (DOM side).
 *
 * Replies come from the AI (POST /api/chat, chatbot-server/handler.ts): Claude, writing from
 * the site's own content, streamed in and typed into chat bubbles (a blank line starts a new
 * bubble). If the AI can't be reached, the on-device bot answers instead: its "brain" and
 * ~13 MB meaning model (public/chatbot/) are only downloaded when that happens.
 * Knowledge for both: `npm run chatbot:kb`.
 */

import { createBooking, type ComposerMode } from "./chat-booking";

const BASE = "/chatbot";
const PHONE = "0790029928";

type Reply = { parts?: string[]; reply?: string; state?: object; source?: object; suggestions?: string[]; action?: "book" };
type Brain = { reply: (text: string, state: object) => Reply };
type Loaded = { brain: Brain; starters: string[] };
type Turn = { role: "user" | "assistant"; content: string };
type AiEvent = { t?: string; book?: boolean; suggest?: string[]; done?: boolean; error?: string };

export type ChatEls = {
  log: HTMLElement;
  input: HTMLInputElement;
  send: HTMLButtonElement;
  form: HTMLFormElement;
  /** The booking progress strip under the header (chat-booking.ts). */
  bar: HTMLElement;
  setMode: (mode: ComposerMode) => void;
  showCountry: (iso: string) => void;
};

/** Starter chip that opens the in-chat booking (the brain sends «احجز» to it). */
const BOOK_CHIP = "📅 احجز زيارة";

// Loaded from public/, not bundled: the bundler must leave these imports alone.
const load = (path: string) => import(/* webpackIgnore: true */ /* turbopackIgnore: true */ `${BASE}${path}`);

export function createChat({ log, input, send: sendBtn, form, bar, setMode, showCountry }: ChatEls) {
  let state: object = {};
  let started = false;
  let busy = false;
  let disposed = false;
  let loading: Promise<Loaded> | null = null;
  let kbLoading: Promise<{ starters: string[]; docs: unknown[] }> | null = null;
  let progress = 0;
  // The conversation so far, sent to the AI with each question.
  const history: Turn[] = [];

  const loadKb = () => (kbLoading ??= fetch(`${BASE}/model/kb.json`).then((r) => r.json()));

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const scroll = () => (log.scrollTop = log.scrollHeight);

  async function fetchBytes(url: string, total: number) {
    const res = await fetch(url);
    if (!res.ok || !res.body) throw new Error(url);
    const reader = res.body.getReader();
    const out = new Uint8Array(total);
    let at = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      out.set(value, at);
      at += value.length;
      progress = Math.min(99, Math.round((100 * at) / total));
    }
    return out.buffer;
  }

  function loadBrain() {
    return (loading ??= (async () => {
      const [{ createEmbedder }, { createSearch }, { createBrain }, vocab, kb] = await Promise.all([
        load("/lib/embed.mjs"),
        load("/lib/core.mjs"),
        load("/brain.mjs"),
        fetch(`${BASE}/model/vocab.json`).then((r) => r.json()),
        loadKb(),
      ]);
      let embedder = null;
      try {
        embedder = createEmbedder(vocab, await fetchBytes(`${BASE}/model/vectors.bin`, vocab.tokens.length * (vocab.dim + 4)));
      } catch (e) {
        console.warn("Meaning model unavailable, matching by wording only", e);
      }
      progress = 100;
      return { brain: createBrain(createSearch(kb.docs, embedder), { phone: PHONE, starters: kb.starters }), starters: kb.starters };
    })());
  }

  function bubble(cls: "bot" | "me") {
    const el = document.createElement("div");
    el.className = `cb-msg cb-${cls}`;
    log.append(el);
    scroll();
    return el;
  }

  // Reveal the reply word by word so it reads like it's being written.
  async function typeOut(el: HTMLElement, text: string) {
    const words = text.split(/(\s+)/);
    for (let i = 0; i < words.length; i++) {
      if (disposed) return;
      el.textContent += words[i];
      if (i % 2 === 0) {
        scroll();
        await wait(18 + Math.random() * 30);
      }
    }
  }

  function chips(list: string[] | undefined, label: string | null) {
    if (!list?.length || disposed) return;
    const box = document.createElement("div");
    box.className = "cb-chips";
    if (label) {
      const s = document.createElement("small");
      s.textContent = label;
      box.append(s);
    }
    for (const q of list) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = q;
      if (q === BOOK_CHIP) b.dataset.kind = "action";
      b.onclick = () => {
        box.remove();
        void send(q);
      };
      box.append(b);
    }
    log.append(box);
    scroll();
  }

  function thinking(quiet?: boolean) {
    const el = bubble("bot");
    const dots = '<span class="cb-dots"><i></i><i></i><i></i></span>';
    if (quiet) {
      el.innerHTML = `<span class="cb-thinking">${dots}</span>`;
      return () => el.remove();
    }
    el.innerHTML = `<span class="cb-thinking">${dots}<span class="cb-t">ليان تكتب…</span></span>`;
    const steps = ["ليان تكتب…", "تتأكد من المعلومة…", "تكتب…"];
    const t = el.querySelector<HTMLElement>(".cb-t")!;
    // First open on a slow connection: show the model download instead.
    let i = 0;
    const timer = setInterval(
      () => (t.textContent = loading && progress < 100 ? `ليان تجهّز نفسها… ${progress}%` : steps[Math.floor(++i / 3) % steps.length]),
      300,
    );
    return () => {
      clearInterval(timer);
      el.remove();
    };
  }

  async function start() {
    if (started) return;
    started = true;
    // Starter questions only (kb.json); the on-device bot itself loads only if the AI is down.
    const ready = loadKb();
    await run(async () => {
      const stop = thinking();
      await wait(700);
      stop();
      await typeOut(bubble("bot"), "أهلين فيك بروح العطاء 👋");
      const pause = thinking(true);
      await wait(800);
      pause();
      await typeOut(bubble("bot"), "معك ليان 😊 اسألني عن أي إشي: الشاليهات، الخدمات، الموقع، أو التقسيط. وبقدر أحجزلك زيارة من هون كمان.");
    });
    try {
      const { starters } = await ready;
      if (!booking.active && !log.querySelector(".cb-me")) chips([BOOK_CHIP, ...starters], "أسئلة شائعة");
    } catch (e) {
      console.error(e);
    }
  }

  /** One thing at a time: the composer is locked while Layan is writing. */
  async function run(fn: () => Promise<void>) {
    if (busy || disposed) return;
    busy = true;
    sendBtn.disabled = true;
    try {
      await fn();
    } finally {
      busy = false;
      sendBtn.disabled = false;
      if (!disposed && matchMedia("(hover: hover)").matches) input.focus({ preventScroll: true });
    }
  }

  async function say(text: string, quick?: boolean) {
    if (disposed) return;
    const pause = thinking(true);
    await wait(quick ? 450 : 750);
    pause();
    await typeOut(bubble("bot"), text);
  }

  const booking = createBooking({
    log,
    input,
    form,
    bar,
    say,
    me: (text) => (bubble("me").textContent = text),
    scroll,
    run,
    onEnd: () => {},
    setMode,
    showCountry,
  });

  function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    return run(async () => {
      log.querySelectorAll(".cb-chips").forEach((c) => c.remove());
      bubble("me").textContent = text;
      // Mid-booking, the text box answers the current question (name, phone, note).
      const wasBooking = booking.active;
      if (wasBooking && (await booking.onText(text))) return;
      // The «احجز زيارة» chip opens the booking straight away.
      if (text === BOOK_CHIP && !wasBooking) {
        await startBooking();
        return;
      }
      if (!(await aiAnswer(text))) await answer(text);
      if (wasBooking && booking.active) await booking.resume();
    });
  }

  async function startBooking() {
    history.push({ role: "assistant", content: "(فتحت للزائر نموذج حجز زيارة داخل المحادثة.)" });
    await booking.start();
  }

  /* ---------- AI replies ---------- */

  const tidy = (s: string) =>
    s
      .replace(/\*\*|__/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/^\s*[-*]\s+/gm, "• ")
      .trim();

  /** Types streamed text into bubbles at a reading pace that catches up when text piles up.
   *  A blank line closes the bubble; the next one follows a short typing pause. */
  function typist(onFirst: () => void) {
    let queue = "";
    let full = "";
    let ended = false;
    let running = false;
    let el: HTMLElement | null = null;
    let finish!: () => void;
    const done = new Promise<void>((r) => (finish = r));

    async function pump() {
      if (running) return;
      running = true;
      while (!disposed && (queue.length || !ended)) {
        if (!queue.length || (!ended && /^\n?$/.test(queue))) {
          await wait(30);
          continue;
        }
        const brk = queue.match(/^\s*\n\s*\n\s*/);
        if (brk) {
          queue = queue.slice(brk[0].length);
          if (el) {
            el.textContent = tidy(el.textContent ?? "");
            el = null;
            const pause = thinking(true);
            await wait(420);
            pause();
          }
          continue;
        }
        const next = queue.search(/\n\s*\n/);
        let take = Math.max(2, Math.ceil(queue.length / 18));
        if (next > 0) take = Math.min(take, next);
        // Hold a lone trailing newline back: it may be the start of a bubble break.
        if (!ended && next < 0 && queue.endsWith("\n") && take >= queue.length) take = queue.length - 1;
        let chunk = queue.slice(0, take);
        queue = queue.slice(take);
        if (!el) {
          chunk = chunk.replace(/^\s+/, "");
          if (!chunk) continue;
          onFirst();
          el = bubble("bot");
        }
        el.textContent += chunk;
        scroll();
        await wait(22);
      }
      if (el) el.textContent = tidy(el.textContent ?? "");
      running = false;
      finish();
    }

    return {
      push(t: string) {
        queue += t;
        full += t;
        void pump();
      },
      end() {
        ended = true;
        void pump();
        return done;
      },
      get text() {
        return tidy(full);
      },
    };
  }

  /** Asks the AI. False when it couldn't answer at all (then the on-device bot does). */
  async function aiAnswer(text: string): Promise<boolean> {
    history.push({ role: "user", content: text });
    const stop = thinking();
    let thinkingShown = true;
    const unthink = () => {
      if (thinkingShown) stop();
      thinkingShown = false;
    };
    const fail = () => {
      unthink();
      history.pop();
      return false;
    };

    let res: Response;
    try {
      res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-16) }),
        signal: AbortSignal.timeout(40_000),
      });
    } catch {
      return fail();
    }
    if (!res.ok || !res.body) return fail();

    const out = typist(unthink);
    let book = false;
    let suggest: string[] | undefined;
    let error = "";
    try {
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done || disposed) break;
        buf += value;
        let at: number;
        while ((at = buf.indexOf("\n\n")) >= 0) {
          const line = buf.slice(0, at).trim();
          buf = buf.slice(at + 2);
          if (!line.startsWith("data:")) continue;
          const ev = JSON.parse(line.slice(5)) as AiEvent;
          if (ev.t) out.push(ev.t);
          if (ev.book) book = true;
          if (ev.suggest) suggest = ev.suggest;
          if (ev.error) error = ev.error;
        }
      }
    } catch {
      error = error || "stream";
    }

    // Nothing written yet: let the on-device bot answer instead.
    if (error && !out.text && !book) {
      await out.end();
      return fail();
    }
    if (error) out.push(`\n\nسامحني، انقطع معي الاتصال 🙏 إذا ما وصلك الجواب كامل، اسألني مرة ثانية.`);
    await out.end();
    unthink();
    history.push({ role: "assistant", content: out.text || "…" });

    if (book && !booking.active) await startBooking();
    else if (!booking.active) chips(suggest, "قد يهمّك أيضًا");
    return true;
  }

  /* ---------- On-device fallback ---------- */

  async function answer(text: string) {
    const stop = thinking();
    const t0 = Date.now();
    let data: Reply;
    try {
      const { brain } = await loadBrain();
      data = brain.reply(text, state);
    } catch (e) {
      console.error(e);
      data = { parts: [`سامحني، صار عندي خلل بسيط 🙏 جرّب مرة ثانية، أو احكي مع الفريق على ${PHONE}.`] };
    }
    state = data.state || {};
    const parts = data.parts || [data.reply ?? ""];
    // Read the question, think a moment (longer for longer answers), then reply.
    await wait(Math.max(0, Math.min(900 + parts.join("").length * 3, 2200) - (Date.now() - t0)));
    stop();
    // Several short messages with a typing pause between them, like a person writing.
    for (let i = 0; i < parts.length; i++) {
      if (disposed) return;
      if (i) {
        const pause = thinking(true);
        await wait(500 + Math.min(parts[i].length * 6, 1100));
        pause();
      }
      await typeOut(bubble("bot"), parts[i]);
    }
    history.push({ role: "user", content: text }, { role: "assistant", content: parts.join("\n\n") });
    if (data.action === "book") {
      if (!booking.active) await startBooking();
      return;
    }
    // Mid-booking, no side suggestions: the booking picks up right after.
    if (!booking.active) chips(data.suggestions, data.source ? "قد يهمّك أيضًا" : null);
  }

  /** The header's «احجز زيارة» button. */
  async function book() {
    while (busy && !disposed) await wait(120);
    if (booking.active) return;
    await run(async () => {
      log.querySelectorAll(".cb-chips").forEach((c) => c.remove());
      bubble("me").textContent = "بدي أحجز زيارة";
      history.push({ role: "user", content: "بدي أحجز زيارة" });
      await startBooking();
    });
  }

  return {
    start,
    send,
    book,
    setCountry: (iso: string) => booking.setCountry(iso),
    dispose() {
      disposed = true;
    },
  };
}
