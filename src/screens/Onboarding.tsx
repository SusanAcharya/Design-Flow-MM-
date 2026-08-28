import { useState } from "react";
import { Icon } from "../ds/Icon";
import { personas, type Persona } from "../lib/personas";
import { useApp } from "../lib/state";
import { mitra } from "../lib/mitra";

const tulkey = mitra.namaste;

function FaceGrid({
  selectedId,
  onPick,
}: {
  selectedId?: Persona["id"] | null;
  onPick: (persona: Persona) => void;
}) {
  return (
    <div className="ob-cast" role="listbox" aria-label="Who’s closest to you">
      {personas.map((persona) => {
        const on = selectedId === persona.id;
        return (
          <button
            key={persona.id}
            type="button"
            role="option"
            aria-selected={on}
            className={`ob-face ${persona.tone}${on ? " on" : ""}`}
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
  );
}

function PersonaPick({ showBack = false }: { showBack?: boolean }) {
  const { back, lookAround, onboardingPersona, finishOnboarding } = useApp();
  const [personaId, setPersonaId] = useState<Persona["id"]>(onboardingPersona ?? "maya");
  const selected = personas.find((persona) => persona.id === personaId) ?? personas[0];

  const enter = (persona: Persona) => {
    finishOnboarding({
      objectiveId: persona.objectiveId,
      personaId: persona.id,
    });
  };

  return (
    <div className="ob-shell">
      <div className="app-bar ob-pick-bar">
        {showBack ? (
          <button className="icon-btn" onClick={back} aria-label="Back">
            <Icon name="back" size={19} />
          </button>
        ) : (
          <span className="icon-btn ob-pick-spacer" aria-hidden />
        )}
        <p className="ob-pick-kicker">Who’s closest?</p>
        <button type="button" className="ob-skip" onClick={lookAround}>
          Skip
        </button>
      </div>

      <div className="ob-pick">
        <FaceGrid selectedId={personaId} onPick={(persona) => setPersonaId(persona.id)} />
        <div className="ob-pick-if" aria-live="polite">
          <article className="ob-if" key={selected.id}>
            <h2>You’re {selected.name} if…</h2>
            <ul>
              {selected.youIf.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button type="button" className="btn btn-primary btn-lg btn-block ob-if-go" onClick={() => enter(selected)}>
              That’s me
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}

export function Onboarding() {
  const { go, lookAround } = useApp();

  return (
    <div className="ob-shell ob-hello">
      <div className="ob-hello-stage">
        <span className="ob-hello-art">
          <img src={tulkey} alt="" />
        </span>
        <p className="ob-hello-brand">MoneyMitra</p>
        <h1>
          Namaste. I’m <span>Mitra</span>.
        </h1>
        <p className="ob-hello-copy">
Your guide throughout your stock market journey        </p>
      </div>
      <div className="ob-hello-foot">
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => go("start")}>
          Who’s closest?
        </button>
        <button type="button" className="btn btn-ghost btn-lg btn-block" onClick={lookAround}>
          I’ll look around first
        </button>
      </div>
    </div>
  );
}

export function StartingPoint() {
  return <PersonaPick showBack />;
}
