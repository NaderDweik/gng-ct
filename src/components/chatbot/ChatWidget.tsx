"use client";

import { useEffect, useRef, useState } from "react";
import { defaultCountry } from "@/content/countries";
import { useCountryPicker } from "@/features/register/CountryPhoneField";
import type { ComposerMode } from "./chat-booking";
import { createChat } from "./chat-engine";

/*
 * "Layan", the on-device chat assistant (Arabic). Styles: styles/base/chatbot.css.
 * A floating button on the start side (right in Arabic), away from the WhatsApp button;
 * on phones it rises above the bottom action bar while that bar is showing.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);
  // Booking (chat-booking.ts): the composer asks for a phone number with a country code.
  const [mode, setMode] = useState<ComposerMode>("chat");
  const [country, setCountry] = useState(defaultCountry);
  const picker = useCountryPicker({
    country,
    isAr: true,
    onCountry: (iso) => {
      setCountry(iso);
      chat.current?.setCountry(iso);
    },
    afterPick: () => inputRef.current?.focus(),
    popClassName: "cb-cc-pop",
  });
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chat = useRef<ReturnType<typeof createChat> | null>(null);

  useEffect(() => {
    const log = logRef.current!;
    const c = createChat({ log, input: inputRef.current!, send: sendRef.current!, form: formRef.current!, bar: barRef.current!, setMode, showCountry: setCountry });
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
          <div className="cb-who">
            <b>ليان · روح العطاء</b>
            <small>متصلة الآن · ترد خلال ثوانٍ</small>
          </div>
          <button type="button" className="cb-book" onClick={() => void chat.current?.book()}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
              <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
            </svg>
            احجز زيارة
          </button>
        </div>
        <div className="cb-bar" ref={barRef} aria-live="polite" />
        <div className="cb-log" ref={logRef} aria-live="polite" />
        <form
          ref={formRef}
          data-mode="chat"
          className="cb-form"
          onSubmit={(e) => {
            e.preventDefault();
            const input = inputRef.current!;
            const text = input.value;
            input.value = "";
            void chat.current?.send(text);
          }}
        >
          {picker.pop}
          <input ref={inputRef} className="cb-input" placeholder="اكتب سؤالك هنا…" autoComplete="off" aria-label="سؤالك" />
          {mode === "phone" && <div className="cb-cc">{picker.button}</div>}
          <button ref={sendRef} className="cb-send" aria-label="إرسال">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }} aria-hidden>
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </section>
    </div>
  );
}
