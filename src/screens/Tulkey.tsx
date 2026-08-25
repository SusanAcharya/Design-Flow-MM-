import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "../ds/Icon";
import { getObjective, getObjectiveByTitle } from "../lib/objectives";
import { useApp } from "../lib/state";

const prompts = [
  "What is a kitta?",
  "How does an IPO application work?",
  "What is a limit order?",
  "Why did a price stop moving?",
];

const voiceSample = "What is EDIS?";

type Bubble = {
  id: number;
  role: "user" | "tulkey";
  text: string;
  sittingId?: string | null;
};

function replyTo(question: string): { text: string; sittingId: string | null } {
  const q = question.trim();
  const sitting = getObjectiveByTitle(q);
  if (sitting) {
    const where = sitting.how.map((step) => step.platform).join(" · ");
    return {
      sittingId: sitting.id,
      text: `${sitting.know[0]}\n\nWhere this actually happens: ${where}.\n\nI explain the words and the platform. I never say what to buy or sell.`,
    };
  }

  const lower = q.toLowerCase();
  if (lower.includes("edis")) {
    return {
      sittingId: "orders",
      text: "After you buy, the kitta still has to move via MeroShare (EDIS) before T+2. Miss that and the exchange can close the trade at a penalty. MoneyMitra does not submit EDIS for you.",
    };
  }
  if (lower.includes("tms")) {
    return {
      sittingId: "orders",
      text: "TMS is your broker’s trading terminal. Live orders are placed there. MoneyMitra can send you to TMS. It never places the order itself.",
    };
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste")) {
    return {
      sittingId: null,
      text: "Namaste. Ask about a word, a date, or which site does the work — MeroShare, C-ASBA, or TMS. I will not pick a stock.",
    };
  }

  return {
    sittingId: null,
    text: "I can unpack a market word, a date, or which platform does the work. Try kitta, IPO, EDIS, a limit order, or the daily circuit. I never recommend a trade.",
  };
}

export function TulkeyScreen() {
  const { go, objectiveId } = useApp();
  const objective = getObjective(objectiveId);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Bubble[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const listenTimer = useRef<number>(0);
  const thinkTimer = useRef<number>(0);
  const nextId = useRef(1);

  const canSend = draft.trim().length > 0 && !thinking && !listening;

  useEffect(() => {
    return () => {
      window.clearTimeout(listenTimer.current);
      window.clearTimeout(thinkTimer.current);
    };
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = "0px";
    field.style.height = `${Math.min(field.scrollHeight, 120)}px`;
  }, [draft]);

  const ask = (raw: string) => {
    const text = raw.trim();
    if (!text || thinking) return;
    window.clearTimeout(listenTimer.current);
    setListening(false);
    setDraft("");
    const userId = nextId.current++;
    setMessages((current) => [...current, { id: userId, role: "user", text }]);
    setThinking(true);
    window.clearTimeout(thinkTimer.current);
    thinkTimer.current = window.setTimeout(() => {
      const answer = replyTo(text);
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "tulkey",
          text: answer.text,
          sittingId: answer.sittingId,
        },
      ]);
      setThinking(false);
    }, 720);
  };

  const toggleListen = () => {
    if (thinking) return;
    if (listening) {
      window.clearTimeout(listenTimer.current);
      setListening(false);
      return;
    }
    setListening(true);
    fieldRef.current?.blur();
    listenTimer.current = window.setTimeout(() => {
      setListening(false);
      ask(voiceSample);
    }, 1600);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(draft);
  };

  return (
    <div className="tulkey-screen">
      <div className="tulkey-top">
        <button type="button" className="tulkey-obj" onClick={() => go("objective")}>
          <span className="tulkey-obj-copy">
            <span className="overline">Tulkey objectives</span>
            <strong>{objective ? objective.title : "Your path"}</strong>
          </span>
          <Icon name="chev" size={15} />
        </button>
      </div>

      <div className="tulkey-thread" ref={threadRef}>
        {messages.length === 0 ? (
          <div className="tulkey-empty">
            <div className="tulkey-empty-mascot">
              <img src={`${import.meta.env.BASE_URL}tulkey-hi.png`} alt="" />
            </div>
            <p className="overline">Tulkey AI</p>
            <h1 className="t-h-xl">Ask about Nepal’s market</h1>
            <p className="t-body-s muted">
              Words, dates, and which platform does the work. Never a stock pick.
            </p>
            <div className="tulkey-prompts">
              {prompts.map((prompt) => (
                <button key={prompt} type="button" className="tulkey-prompt" onClick={() => ask(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="tulkey-log">
            {messages.map((message) =>
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
                    {message.sittingId && (
                      <button
                        type="button"
                        className="tulkey-sitting"
                        onClick={() => go("objective", { objective: message.sittingId ?? undefined })}
                      >
                        Open this sitting
                        <Icon name="chev" size={13} />
                      </button>
                    )}
                  </div>
                </article>
              ),
            )}
            {thinking && (
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
            disabled={listening || thinking}
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
        <p className="tulkey-note">Tulkey explains. It does not recommend trades.</p>
      </div>
    </div>
  );
}
