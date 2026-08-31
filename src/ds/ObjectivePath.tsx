import { useState, type ReactNode } from "react";
import { getObjective, homeObjectiveId, pathProgress, type Objective } from "../lib/objectives";
import { useApp } from "../lib/state";

function Check({ on, now }: { on?: boolean; now?: boolean }) {
  return <i className={`path-check ${on ? "on" : ""} ${now ? "now" : ""}`} aria-hidden />;
}

function QuietRow({
  item,
  status,
}: {
  item: Objective;
  status: "learned" | "now" | "left";
}) {
  const { go, route, viewingObjectiveId, setViewingObjectiveId } = useApp();
  const active = viewingObjectiveId === item.id && route === "objective";
  const open = () => {
    if (route === "objective") setViewingObjectiveId(item.id);
    else go("objective", { objective: item.id });
  };
  return (
    <button
      type="button"
      className={`obj-quiet ${status} ${active ? "on" : ""}`}
      onClick={open}
    >
      <Check on={status === "learned"} now={status === "now"} />
      <span>
        <strong>{item.title}</strong>
        <small>{status === "learned" ? "Done" : item.duration}</small>
      </span>
    </button>
  );
}

function Fold({
  label,
  count,
  defaultOpen = false,
  children,
}: {
  label: string;
  count: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (count === 0) return null;
  return (
    <div className="obj-fold">
      <button
        type="button"
        className={`obj-fold-toggle${open ? " open" : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{label}</span>
        <em>{count}</em>
        <i aria-hidden />
      </button>
      {open && <div className="obj-fold-list">{children}</div>}
    </div>
  );
}

export function ObjectivePath() {
  const { go, route, objectiveId, pathFinished, objectivesDone, setViewingObjectiveId, stage, personaId, viewport } = useApp();
  const pinned = homeObjectiveId(objectiveId, stage, personaId);
  const { done, now, later, learned, total } = pathProgress(pinned, pathFinished, objectivesDone);
  const current = now ?? getObjective(pinned);
  const next = later[0] ?? null;
  const rest = later.slice(1);

  const open = (id: string) => {
    if (route === "objective") setViewingObjectiveId(id);
    else go("objective", { objective: id });
  };

  if (!current && !pathFinished) return null;

  return (
    <section className="obj-track">
      <p className="obj-track-count">
        {pathFinished ? `${total} of ${total} done` : `${learned} of ${total} done`}
      </p>

      {pathFinished ? (
        <div className="obj-now rest">
          <span className="obj-now-kicker">Path complete</span>
          <strong>That’s the last sitting on this path.</strong>
          <small>Open a completed one if you want to watch it again.</small>
        </div>
      ) : current ? (
        <button type="button" className="obj-now" onClick={() => open(current.id)}>
          <span className="obj-now-kicker">
            Now · {current.n}/{total} · {current.duration}
          </span>
          <strong>{current.title}</strong>
          <small>{current.cardSub}</small>
          <em>{current.feature?.ctaLabel ?? (current.kind === "overview" ? "Read" : "Watch")} ›</em>
        </button>
      ) : null}

      {next && (
        <button type="button" className="obj-next" onClick={() => open(next.id)}>
          <span className="obj-next-kicker">Next</span>
          <strong>{next.title}</strong>
          <em>Preview ›</em>
        </button>
      )}

      <Fold label="completed" count={done.length}>
        {done.map((item) => (
          <QuietRow key={item.id} item={item} status="learned" />
        ))}
      </Fold>

      <Fold label="later" count={rest.length} defaultOpen={viewport === "web"}>
        {rest.map((item) => (
          <QuietRow key={item.id} item={item} status="left" />
        ))}
      </Fold>
    </section>
  );
}
