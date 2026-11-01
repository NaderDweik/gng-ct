"use client";

import { useEffect, useRef, useState } from "react";
import { createChat } from "./chat-engine";

/*
 * "Layan", the on-device chat assistant (Arabic). Styles: styles/base/chatbot.css.
 * A floating button on the start side (right in Arabic), away from the WhatsApp button;
 * on phones it rises above the bottom action bar while that bar is showing.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const chat = useRef<ReturnType<typeof createChat> | null>(null);

  useEffect(() => {
    const log = logRef.current!;
    const c = createChat({ log, input: inputRef.current!, send: sendRef.current! });
    chat.current = c;
    const t = setTimeout(() => setHint(false), 7000);
    return () => {
      clearTimeout(t);
      c.dispose();
      log.replaceChildren();
    };
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    setHint(false);
    if (next) {
      void chat.current?.start();
      inputRef.current?.focus();
    }
  };

  return (
    <div className="cb" dir="rtl" lang="ar">
      <div className={`cb-hint${hint && !open ? "" : " is-gone"}`} aria-hidden>
        أهلين! معك ليان، عندك سؤال؟ 👋
      </div>
      <button
        type="button"
        className={`cb-launcher${open ? " is-open" : ""}`}
        aria-label={open ? "أغلق المساعد" : "افتح المساعد"}
        aria-expanded={open}
        aria-controls="cb-panel"
        onClick={toggle}
      >
        <svg className="cb-ico-chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
        <svg className="cb-ico-x" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <section id="cb-panel" className={`cb-panel${open ? " is-open" : ""}`} aria-label="مساعد روح العطاء" aria-hidden={!open} inert={!open}>
        <div className="cb-head">
          <div className="cb-avatar" aria-hidden>
            <span className="cb-avatar-v" />
          </div>
          <div>
            <b>ليان · روح العطاء</b>
            <small>متصلة الآن · ترد خلال ثوانٍ</small>
          </div>
        </div>
        <div className="cb-log" ref={logRef} aria-live="polite" />
        <form
          className="cb-form"
          onSubmit={(e) => {
            e.preventDefault();
            const input = inputRef.current!;
            const text = input.value;
            input.value = "";
            void chat.current?.send(text);
          }}
        >
          <input ref={inputRef} className="cb-input" placeholder="اكتب سؤالك هنا…" autoComplete="off" aria-label="سؤالك" />
          <button ref={sendRef} className="cb-send" aria-label="إرسال">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }} aria-hidden>
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
        <div className="cb-foot">نموذج تجريبي · يعمل بالكامل على جهازك</div>
      </section>
    </div>
  );
}
