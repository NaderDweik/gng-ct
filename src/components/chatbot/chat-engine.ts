/*
 * Layan's conversation loop (DOM side). The "brain" (search + replies) and its ~13 MB meaning
 * model live in public/chatbot/ as plain browser modules and are only downloaded the first time
 * the visitor opens the chat. Everything runs on the visitor's device; nothing is sent anywhere.
 * Knowledge base: public/chatbot/model/kb.json, rebuilt with `npm run chatbot:kb`.
 */

import { createBooking, type ComposerMode } from "./chat-booking";

const BASE = "/chatbot";
/** How much the trained classifier counts in search (tuned on chatbot-poc/questions-dev.md). */
const CLS_WEIGHT = 0.3;
const PHONE = "0790029928";

type Card = { type: "chalet"; id: string; aspect?: "price" | "where" | "status" | "area" | "features" } | { type: "map" };
type Reply = { parts?: string[]; reply?: string; state?: { chalet?: string }; source?: object; suggestions?: string[]; action?: "book"; card?: Card };
type Brain = { reply: (text: string, state: object) => Reply };
type Loaded = { brain: Brain; starters: string[] };

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
  // The compound map in the chat (chat-map.ts): its own chunk, loaded with the brain.
  let mapMod: Promise<typeof import("./chat-map")> | null = null;
  const loadMap = () => (mapMod ??= import("./chat-map"));
  let state: { chalet?: string } = {};
  let started = false;
  let busy = false;
  let disposed = false;
  let loading: Promise<Loaded> | null = null;
  let progress = 0;

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
      const [{ createEmbedder }, { createSearch }, { createBrain }, { createClassifier, createEnsemble }, vocab, kb, map, members] = await Promise.all([
        load("/lib/embed.mjs"),
        load("/lib/core.mjs"),
        load("/brain.mjs"),
        load("/lib/classify.mjs"),
        fetch(`${BASE}/model/vocab.json`).then((r) => r.json()),
        fetch(`${BASE}/model/kb.json`).then((r) => r.json()),
        loadMap(),
        // The trained classifiers that vote (chatbot-poc/tools/train-classifier.mjs); optional.
        fetch(`${BASE}/model/ensemble.json`)
          .then((r) => (r.ok ? r.json() : { members: [] }))
          .then(({ members }: { members: string[] }) =>
            Promise.all(members.map((n) => Promise.all([fetch(`${BASE}/model/${n}.json`).then((r) => r.json()), fetch(`${BASE}/model/${n}.bin`).then((r) => r.arrayBuffer())]))),
          )
          .catch(() => []),
      ]);
      let embedder = null;
      try {
        embedder = createEmbedder(vocab, await fetchBytes(`${BASE}/model/vectors.bin`, vocab.tokens.length * (vocab.dim + 4)));
      } catch (e) {
        console.warn("Meaning model unavailable, matching by wording only", e);
      }
      progress = 100;
      const voters = embedder ? (members as [object, ArrayBuffer][]).map(([meta, bin]) => createClassifier(meta, bin, embedder)) : [];
      const classifier = voters.length ? createEnsemble(voters) : null;
      return { brain: createBrain(createSearch(kb.docs, embedder, { classifier, clsWeight: CLS_WEIGHT }), { phone: PHONE, starters: kb.starters, chalets: map.chaletIds }), starters: kb.starters };
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
    const ready = loadBrain();
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
      await answer(text);
      if (wasBooking && booking.active) await booking.resume();
    });
  }

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
    if (data.card) await showCard(data.card);
    if (data.action === "book") {
      if (!booking.active) await booking.start(state.chalet);
      return;
    }
    // Mid-booking, no side suggestions: the booking picks up right after.
    if (!booking.active) chips(data.suggestions, data.source ? "قد يهمّك أيضًا" : null);
  }

  /** A chalet's card or the map invite, after a short pause like a person attaching a photo. */
  async function showCard(card: Card) {
    const map = await loadMap();
    await map.ready;
    if (disposed) return;
    const pause = thinking(true);
    await wait(650);
    pause();
    // A follow-up about one thing of the chalet in focus: answered in a line, its card only for «where».
    if (card.type === "chalet" && card.aspect) {
      await typeOut(bubble("bot"), map.chaletLine(card.id, card.aspect, PHONE));
      if (card.aspect !== "where") {
        chips([BOOK_CHIP, `تفاصيل الشاليه ${card.id}`], null);
        return;
      }
    }
    const panel = log.closest<HTMLElement>(".cb-panel") ?? log;
    const act = {
      panel,
      onDetails: (id: string) => void sendQuiet(`تفاصيل الشاليه ${id}`, { type: "chalet", id }),
      onBook: (id?: string) => void book(id),
    };
    log.append(card.type === "chalet" ? map.chaletCard(card.id, act) : map.mapInvite(act));
    scroll();
  }

  /** A chalet picked on the map: posted as the visitor's message, answered with its card. */
  function sendQuiet(text: string, card: Card) {
    return run(async () => {
      log.querySelectorAll(".cb-chips").forEach((c) => c.remove());
      bubble("me").textContent = text;
      if (card.type === "chalet") state = { ...state, chalet: card.id };
      await say(`هاي تفاصيل الشاليه ${card.type === "chalet" ? card.id : ""} 👇`, true);
      await showCard(card);
      chips(["ما المرافق داخل الشاليه؟", BOOK_CHIP], null);
    });
  }

  /** The header's «احجز زيارة» button. */
  async function book(chalet?: string) {
    while (busy && !disposed) await wait(120);
    if (booking.active) return;
    await run(async () => {
      log.querySelectorAll(".cb-chips").forEach((c) => c.remove());
      bubble("me").textContent = chalet ? `بدي أحجز زيارة للشاليه ${chalet}` : "بدي أحجز زيارة";
      await booking.start(chalet);
    });
  }

  return {
    start,
    send,
    book: () => book(),
    setCountry: (iso: string) => booking.setCountry(iso),
    dispose() {
      disposed = true;
    },
  };
}
