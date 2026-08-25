import { Icon } from "./Icon";
import { getObjective, nextOnPath } from "../lib/objectives";
import { useApp } from "../lib/state";

export function ObjectiveHero({ compact = false }: { compact?: boolean }) {
  const { go, objectiveId } = useApp();
  const o = getObjective(objectiveId);

  if (!o) {
    return (
      <button type="button" className={`objective-strip ${compact ? "compact" : ""}`} onClick={() => go("learn")}>
        <span className="objective-orb"><Icon name="learn" size={16} /></span>
        <span className="objective-copy">
          <span className="overline">Tulkey · Learn when needed</span>
          <strong>No objective assigned</strong>
        </span>
        <Icon name="chev" size={15} />
      </button>
    );
  }

  const next = nextOnPath(o.id);

  return (
    <button type="button" className={`objective-strip ${compact ? "compact" : ""}`} onClick={() => go("objective")}>
      <span className="objective-tulkey">
        <img src="/tulkey-hi.png" alt="" />
        <i />
      </span>
      <span className="objective-copy">
        <span className="overline">Your objective · {o.duration}</span>
        <strong>{o.title}</strong>
        {!compact && <small>{next ? `Next: ${next.title}` : o.level}</small>}
      </span>
      <span className="objective-progress" aria-hidden>
        <i style={{ width: `${Math.min(100, (o.n / 7) * 100)}%` }} />
      </span>
      <Icon name="chev" size={15} />
    </button>
  );
}
