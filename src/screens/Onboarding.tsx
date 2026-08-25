import { useState } from "react";
import { Icon } from "../ds/Icon";
import { Button } from "../ds/primitives";
import { personas, type Persona } from "../lib/personas";
import { useApp } from "../lib/state";

export function Onboarding() {
  const { go, lookAround } = useApp();

  return (
    <div className="ob-shell ob-meet">
      <div className="ob-meet-hero">
        <i className="ob-glow" aria-hidden />
        <img src={`${import.meta.env.BASE_URL}tulkey-hi.png`} alt="Tulkey" />
        <p className="overline">MoneyMitra · your guide</p>
        <h1>Namaste. I’m Tulkey.</h1>
        <p className="t-body-m muted">
          I explain Nepal’s market and set up Home around you. I never place an order, and I never tell you what to buy.
        </p>
      </div>

      <div className="ob-steps pad">
        <div className="ob-step">
          <b>1</b>
          <span>Pick who’s closest</span>
        </div>
        <div className="ob-step">
          <b>2</b>
          <span>Enter your Home</span>
        </div>
      </div>

      <p className="pad t-label-s c-muted" style={{ paddingTop: 16, paddingBottom: 8 }}>
        Tap someone to start as them, or continue to read first.
      </p>
      <div className="ob-cast pad">
        {personas.map((persona) => (
          <button
            key={persona.id}
            type="button"
            className={`ob-face ${persona.tone}`}
            onClick={() => go("start", { persona: persona.id })}
          >
            <span className="ob-face-art">
              <img src={persona.img} alt="" />
            </span>
            <strong>{persona.name}</strong>
            <small>{persona.role}</small>
          </button>
        ))}
      </div>

      <div className="ob-foot">
        <Button variant="primary" size="lg" block onClick={() => go("start")}>
          Pick who’s closest
        </Button>
        <Button variant="ghost" size="lg" block onClick={lookAround}>
          I’ll look around first
        </Button>
        <p className="t-body-xs c-muted" style={{ textAlign: "center" }}>
          Prices carry a timestamp. This is not investment advice.
        </p>
      </div>
    </div>
  );
}

export function StartingPoint() {
  const { back, lookAround, onboardingPersona, finishOnboarding } = useApp();
  const [personaId, setPersonaId] = useState<Persona["id"] | null>(onboardingPersona);
  const selected = personas.find((persona) => persona.id === personaId) ?? null;

  const enter = (persona: Persona) => {
    finishOnboarding({
      stage: persona.stage,
      objectiveId: persona.objectiveId,
      personaId: persona.id,
    });
  };

  return (
    <div className="ob-shell">
      <div className="app-bar" style={{ alignItems: "flex-end", paddingBottom: 12, paddingTop: 20 }}>
        <button className="icon-btn" onClick={back} aria-label="Back">
          <Icon name="back" size={19} />
        </button>
        <div style={{ flex: 1 }} />
        <div className="phone-progress" aria-hidden>
          <i className="on" />
          <i className="on" />
        </div>
        <button type="button" className="ob-skip" onClick={lookAround}>
          Skip
        </button>
      </div>

      <PickStep
        selected={selected}
        onPick={(persona) => {
          if (personaId === persona.id) enter(persona);
          else setPersonaId(persona.id);
        }}
        onContinue={() => selected && enter(selected)}
      />
    </div>
  );
}

function PickStep({
  selected,
  onPick,
  onContinue,
}: {
  selected: Persona | null;
  onPick: (persona: Persona) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="pad" style={{ paddingBottom: 10 }}>
        <Chat line={selected ? selected.tulkey : "Who’s closest to you? I’ll show where that puts you, and what MoneyMitra will do."} />
      </div>

      <div className="ob-cast pad" role="listbox" aria-label="Who’s closest to you">
        {personas.map((persona) => {
          const on = selected?.id === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              role="option"
              aria-selected={on}
              className={`ob-face ${persona.tone} ${on ? "on" : ""}`}
              onClick={() => onPick(persona)}
            >
              <span className="ob-face-art">
                <img src={persona.img} alt="" />
              </span>
              <strong>{persona.name}</strong>
              <small>{persona.role}</small>
            </button>
          );
        })}
      </div>

      <div className="ob-guide pad" aria-live="polite">
        {selected ? (
          <article className="ob-guide-card" key={selected.id}>
            <header className="ob-guide-head">
              <span className={`ob-guide-pic ${selected.tone}`}>
                <img src={selected.img} alt="" />
              </span>
              <div>
                <p className="overline">Where you are</p>
                <h2>{selected.name} · {selected.role}</h2>
              </div>
            </header>
            <p className="ob-where">{selected.where}</p>
            <p className="overline" style={{ marginTop: 14 }}>What MoneyMitra gives you</p>
            <ol className="ob-gives">
              {selected.gives.map((item, index) => (
                <li key={item.title}>
                  <span className="ob-gives-n">{index + 1}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </span>
                </li>
              ))}
            </ol>
            <p className="ob-limit">{selected.limit}</p>
          </article>
        ) : (
          <div className="ob-guide-empty">
            <img src={`${import.meta.env.BASE_URL}tulkey-hi.png`} alt="" />
            <p>Tap someone above. This space becomes their place in the market, and what Home will actually do.</p>
          </div>
        )}
      </div>

      <div className="ob-foot">
        <button
          type="button"
          className="btn btn-primary btn-lg btn-block"
          disabled={!selected}
          onClick={onContinue}
        >
          {selected ? `Enter Home as ${selected.name}` : "Tap who you are"}
        </button>
      </div>
    </>
  );
}

function Chat({ line }: { line: string }) {
  return (
    <div className="ob-chat">
      <span className="ob-chat-tulkey">
        <img src={`${import.meta.env.BASE_URL}tulkey-hi.png`} alt="" />
        <i />
      </span>
      <p className="ob-bubble" key={line}>{line}</p>
    </div>
  );
}
