import { curriculum, getObjective, homeObjectiveId, nextOnPath } from "../lib/objectives";
import { useApp } from "../lib/state";
import { mitra } from "../lib/mitra";

const tulkey = mitra.pointing;

export function ObjectiveHero({ compact = false }: { compact?: boolean }) {
  const { go, objectiveId, stage, personaId } = useApp();
  const o = getObjective(homeObjectiveId(objectiveId, stage, personaId));

  if (!o) {
    return (
      <button type="button" className="tulkey-card empty" onClick={() => go("learn")}>
        <span className="tulkey-card-mascot">
          <img src={tulkey} alt="" />
        </span>
        <span className="tulkey-card-copy">
          <span className="tulkey-card-kicker">Mitra</span>
          <strong>Nothing pinned</strong>
          <small>If a word comes up, I’m in the tab.</small>
        </span>
      </button>
    );
  }

  const next = nextOnPath(o.id);

  return (
    <button
      type="button"
      className={`tulkey-card${compact ? " compact" : ""}`}
      onClick={() => go("objective")}
    >
      <span className="tulkey-card-mascot">
        <img src={tulkey} alt="" />
      </span>
      <span className="tulkey-card-copy">
        <span className="tulkey-card-kicker">
          {compact ? o.duration : `A tiny lesson · ${o.duration}`}
        </span>
        <strong>{o.title}</strong>
        <small>{compact ? (next ? `Next: ${next.title}` : o.tulkeyLine) : o.tulkeyLine}</small>
      </span>
      <span className="tulkey-card-bar" aria-hidden>
        <i style={{ width: `${Math.min(100, (o.n / curriculum.length) * 100)}%` }} />
      </span>
    </button>
  );
}
