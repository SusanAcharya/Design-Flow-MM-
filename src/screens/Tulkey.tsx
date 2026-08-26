import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "../ds/Icon";
import { tulkeyPrompts } from "../lib/tulkey";
import { useApp } from "../lib/state";

export function TulkeyScreen() {
  const { askTulkey, tulkeyMessages, tulkeyThinking } = useApp();
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const listenTimer = useRef<number>(0);

  const canSend = draft.trim().length > 0 && !tulkeyThinking && !listening;

  useEffect(() => {
    return () => window.clearTimeout(listenTimer.current);
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [tulkeyMessages, tulkeyThinking]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = "0px";
    field.style.height = `${Math.min(field.scrollHeight, 120)}px`;
  }, [draft]);

  const ask = (raw: string) => {
    const text = raw.trim();
    if (!text || tulkeyThinking) return;
    window.clearTimeout(listenTimer.current);
    setListening(false);
    setDraft("");
    askTulkey(text);
  };

  const toggleListen = () => {
    if (tulkeyThinking) return;
    if (listening) {
      window.clearTimeout(listenTimer.current);
      setListening(false);
      return;
    }
    setListening(true);
    fieldRef.current?.blur();
    listenTimer.current = window.setTimeout(() => {
      setListening(false);
      ask("What is EDIS?");
    }, 1600);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(draft);
  };

  return (
    <div className="tulkey-screen">
      <div className="tulkey-thread" ref={threadRef}>
        {tulkeyMessages.length === 0 ? (
          <div className="tulkey-empty">
            <div className="tulkey-empty-mascot">
              <img src={`${import.meta.env.BASE_URL}tulkey-hi.png`} alt="" />
            </div>
            <p className="overline">Tulkey AI</p>
            <h1 className="t-h-xl">Ask about Nepal’s market</h1>
            <p className="t-body-s muted">
              A word, a date, which site does the work. Not a pick.
            </p>
            <div className="tulkey-prompts">
              {tulkeyPrompts.map((prompt) => (
                <button key={prompt} type="button" className="tulkey-prompt" onClick={() => ask(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="tulkey-log">
            {tulkeyMessages.map((message) =>
              message.role === "user" ? (
                <p key={message.id} className="tulkey-bubble user">
                  {message.text}
                </p>
              ) : (
                <article key={message.id} className="tulkey-turn">
                  <span className="tulkey-turn-face">
                    <img src={`${import.meta.env.BASE_URL}tulkey-hi.png`} alt="" />
                  </span>
                  <div className="tulkey-turn-body">
                    <p className="tulkey-bubble tulkey">{message.text}</p>
                  </div>
                </article>
              ),
            )}
            {tulkeyThinking && (
              <article className="tulkey-turn" aria-live="polite" aria-label="Tulkey is writing">
                <span className="tulkey-turn-face">
                  <img src={`${import.meta.env.BASE_URL}tulkey-hi.png`} alt="" />
                </span>
                <p className="tulkey-bubble tulkey typing">
                  <i /><i /><i />
                </p>
              </article>
            )}
          </div>
        )}
      </div>

      <div className="tulkey-dock">
        <form className={`tulkey-composer ${listening ? "listening" : ""}`} onSubmit={onSubmit}>
          <label className="vh" htmlFor="tulkey-ask">Ask Tulkey</label>
          <textarea
            id="tulkey-ask"
            ref={fieldRef}
            rows={1}
            value={listening ? "" : draft}
            placeholder={listening ? "Listening…" : "Ask Tulkey"}
            disabled={listening || tulkeyThinking}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter" || event.shiftKey) return;
              event.preventDefault();
              ask(draft);
            }}
          />
          <button
            type="button"
            className={`tulkey-tool mic ${listening ? "on" : ""}`}
            aria-label={listening ? "Stop listening" : "Voice input"}
            aria-pressed={listening}
            onClick={toggleListen}
          >
            <Icon name="mic" size={18} />
          </button>
          {canSend && (
            <button type="submit" className="tulkey-tool send" aria-label="Send">
              <Icon name="send" size={17} />
            </button>
          )}
        </form>
        <p className="tulkey-note">I explain. I don’t pick stocks.</p>
      </div>
    </div>
  );
}
