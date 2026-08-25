import { getObjective, pathProgress, type Objective } from "../lib/objectives";
import { useApp } from "../lib/state";

function Check({ on, now }: { on?: boolean; now?: boolean }) {
  return <i className={`path-check ${on ? "on" : ""} ${now ? "now" : ""}`} aria-hidden />;
}

function ModuleRow({
  item,
  status,
}: {
  item: Objective;
  status: "learned" | "now" | "left";
}) {
  const { go, route, viewingObjectiveId, setViewingObjectiveId } = useApp();
  const label = status === "learned" ? "Learned" : status === "now" ? "Now" : "Left";
  const active = viewingObjectiveId === item.id && route === "objective";
  const open = () => {
    if (route === "objective") setViewingObjectiveId(item.id);
    else go("objective", { objective: item.id });
  };
  return (
    <button
      type="button"
      className={`path-row path-row-${status} ${active ? "on" : ""}`}
      onClick={open}
    >
      <Check on={status === "learned"} now={status === "now"} />
      <div className="row-main">
        <p className="t-label-s c-muted">
          {label} · {item.duration}
        </p>
        <p className="t-h-s">{item.title}</p>
        <p className="row-sub">{item.cardSub}</p>
      </div>
    </button>
  );
}

export function ObjectivePath({ hideNow = false }: { hideNow?: boolean }) {
  const { go, route, objectiveId, pathFinished, setViewingObjectiveId } = useApp();
  const { done, now, later, learned, total } = pathProgress(objectiveId, pathFinished);
  const current = now ?? getObjective(objectiveId);

  const open = (id: string) => {
    if (route === "objective") setViewingObjectiveId(id);
    else go("objective", { objective: id });
  };

  if (!current && !pathFinished && later.length === 0) {
    return null;
  }

  return (
    <section className="objective-path">
      <div className="path-head">
        <span className="overline">Your path</span>
        <span className="t-mono-s c-muted">
          {pathFinished ? `${total} / ${total}` : `${learned} / ${total} learned`}
        </span>
      </div>

      {!hideNow && current ? (
        <button type="button" className="path-now" onClick={() => open(current.id)}>
          <p className="overline">Now · {current.duration} sitting</p>
          <strong>{current.title}</strong>
          <small>{current.tulkeyLine}</small>
        </button>
      ) : !hideNow && pathFinished ? (
        <p className="t-body-s muted" style={{ margin: "4px 0 8px" }}>
          You finished this path. Open any module below to watch it again.
        </p>
      ) : !hideNow ? (
        <p className="t-body-s muted" style={{ margin: "4px 0 8px" }}>
          No sitting pinned. Open a module if a word comes up.
        </p>
      ) : null}

      {done.length > 0 && (
        <div className="path-group">
          <p className="overline">Learned</p>
          {done.map((item) => (
            <ModuleRow key={item.id} item={item} status="learned" />
          ))}
        </div>
      )}

      {(current || later.length > 0) && (
        <div className="path-group">
          <p className="overline">Left</p>
          {current && <ModuleRow item={current} status="now" />}
          {later.map((item) => (
            <ModuleRow key={item.id} item={item} status="left" />
          ))}
        </div>
      )}
    </section>
  );
}
