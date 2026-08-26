import { ObjectivePath } from "../ds/ObjectivePath";
import { Badge, Button, Overline } from "../ds/primitives";
import { Icon } from "../ds/Icon";
import { getObjective, homeObjectiveId, pathProgress } from "../lib/objectives";
import { useApp } from "../lib/state";
import { useEffect, useRef } from "react";

function VideoPlaceholder({ label, duration }: { label: string; duration: string }) {
  return (
    <button type="button" className="video-well" aria-label={`Play video: ${label}`}>
      <div className="video-well-play" aria-hidden>
        <span />
      </div>
      <p className="overline">Video</p>
      <p className="t-label-m">{label}</p>
      <p className="t-body-xs muted">{duration} · placeholder</p>
    </button>
  );
}

export function ObjectiveScreen() {
  const { back, go, objectiveId, viewingObjectiveId, pathFinished, completeObjective, hideHomeObjectives, setHideHomeObjectives, viewport, stage, personaId } = useApp();
  const topRef = useRef<HTMLDivElement>(null);
  const pinned = homeObjectiveId(objectiveId, stage, personaId);
  const id = viewingObjectiveId ?? pinned;
  const o = getObjective(id);
  const progress = pathProgress(pinned, pathFinished);

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const scroller = el.closest(".app-scroll");
    if (scroller instanceof HTMLElement) scroller.scrollTo({ top: 0 });
  }, [id]);

  if (!o) {
    return (
      <div>
        {viewport === "mobile" && (
          <div className="app-bar">
            <button className="icon-btn" onClick={back} aria-label="Back"><Icon name="back" /></button>
            <h1>Your objective</h1>
          </div>
        )}
        <div className="pad stack" style={{ gap: 12, paddingTop: 12 }}>
          {viewport === "web" && <button className="text-link" onClick={back}>‹ Home</button>}
          <p className="t-h-l">Your path</p>
          <p className="t-body-m muted">No sitting is pinned. Open a module below for the video and the short notes.</p>
        </div>
        <div className="pad" style={{ paddingBottom: 28 }}>
          <ObjectivePath />
        </div>
      </div>
    );
  }

  const isNow = progress.now?.id === o.id;
  const isLearned = progress.done.some((item) => item.id === o.id) || pathFinished;
  const isLater = !isNow && !isLearned;
  const isDo = o.kind === "do";

  const startDo = () => {
    if (o.doAction === "book") go("holding", { holdingMode: "add" });
    else if (o.doAction === "alert") go("alerts");
    else if (o.doAction === "watch") go("watchlist");
  };

  return (
    <div className="objective-page">
      {viewport === "mobile" && (
        <div className="app-bar">
          <button className="icon-btn" onClick={back} aria-label="Back"><Icon name="back" /></button>
          <h1>Your objective</h1>
        </div>
      )}

      <div ref={topRef} className="pad stack" style={{ gap: 10, paddingBottom: 8 }}>
        {viewport === "web" && (
          <button className="text-link" onClick={back}>‹ Path</button>
        )}
        <div className="obj-hero-meta">
          <Badge tone="accent">{o.level}</Badge>
          <span className="chip">{o.duration}</span>
          {isLearned && <span className="chip">Done</span>}
          {isNow && <span className="chip chip-on">{isDo ? "Your move" : "Now"}</span>}
          {isLater && <span className="chip">Later on this path</span>}
        </div>
        <h2 className="t-h-xl">{o.title}</h2>
        <p className="t-body-m muted">{o.cardSub}</p>
      </div>

      <div className="pad" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <VideoPlaceholder label={o.videoLabel} duration={o.duration} />
        <p className="t-body-s muted" style={{ marginTop: 12 }}>{o.tulkeyLine}</p>
      </div>

      <div className="pad stack" style={{ gap: 8, paddingTop: 16 }}>
        <Overline>What you should know</Overline>
        {o.know.map((item, i) => (
          <div key={item} className="know-row">
            <span className="know-n">{i + 1}</span>
            <p className="t-body-s">{item}</p>
          </div>
        ))}
      </div>

      <div className="pad stack" style={{ gap: 8, paddingTop: 20 }}>
        <Overline>How this actually happens</Overline>
        <p className="t-body-xs muted">We explain the step. The named platform is where it is done.</p>
        {o.how.map((h) => (
          <div key={h.step} className="know-row">
            <span className="ico-soft"><Icon name="ext" size={16} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="t-body-s">{h.step}</p>
              <span className="chip" style={{ marginTop: 8 }}>{h.platform}</span>
            </div>
          </div>
        ))}
      </div>

      {isLater && progress.now && (
        <p className="pad t-body-xs muted" style={{ paddingTop: 16 }}>
          Your current sitting is “{progress.now.title}”. This module comes after that.
        </p>
      )}

      {isNow && progress.later[0] && (
        <p className="pad t-body-s muted" style={{ paddingTop: 16 }}>
          Next: {progress.later[0].title}
        </p>
      )}

      <div className="pad" style={{ paddingTop: 12, paddingBottom: 28 }}>
        <div className="card warn">
          <span className="ico-warn"><Icon name="shield" size={18} /></span>
          <div>
            <p className="t-h-s" style={{ color: "var(--warn-text)" }}>Not a pick — just the words</p>
            <p className="t-body-xs muted" style={{ marginTop: 4 }}>
              We don’t tell you what to buy or sell. Tulkey explains the words, the dates, and which site does the work.
            </p>
          </div>
        </div>
        <div className="stack" style={{ gap: 10, marginTop: 16 }}>
          {isNow && o.kind === "learn" && (
            <Button variant="primary" size="lg" block onClick={() => completeObjective()}>
              Mark as done
            </Button>
          )}
          {isNow && isDo && (
            <>
              <Button variant="primary" size="lg" block onClick={startDo}>
                {o.cta ?? "Open"}
              </Button>
              <p className="t-body-xs muted" style={{ textAlign: "center" }}>
                Completes when you actually {o.doAction === "book" ? "save the holding" : o.doAction === "alert" ? "save the alert" : "add the name"} — not from this screen.
              </p>
            </>
          )}
          <Button variant={isNow ? "secondary" : "primary"} size="lg" block onClick={back}>
            Back to Home
          </Button>
          {!hideHomeObjectives && (
            <button
              type="button"
              className="text-link"
              style={{ alignSelf: "center" }}
              onClick={() => {
                setHideHomeObjectives(true);
                go("home");
              }}
            >
              Don’t show me the objectives
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ObjectivesScreen() {
  const { back, viewport, hideHomeObjectives, setHideHomeObjectives } = useApp();

  return (
    <div className="obj-page">
      {viewport === "mobile" && (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={back} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>Objectives</h1>
        </div>
      )}
      <div className="pad stack" style={{ gap: 6, paddingTop: 12 }}>
        {viewport === "web" && (
          <button type="button" className="text-link" onClick={back}>‹ Home</button>
        )}
        <p className="t-h-l">Your path</p>
        <p className="t-body-s muted">One sitting at a time. The rest stays folded.</p>
      </div>
      <div className="pad" style={{ paddingBottom: 12 }}>
        <ObjectivePath />
      </div>
      <div className="pad" style={{ paddingBottom: 28 }}>
        {hideHomeObjectives ? (
          <p className="t-body-s muted">
            Next steps is off Home.{" "}
            <button type="button" className="text-link" onClick={() => setHideHomeObjectives(false)}>
              Show it again
            </button>
          </p>
        ) : (
          <button
            type="button"
            className="text-link"
            onClick={() => setHideHomeObjectives(true)}
          >
            Don’t show me the objectives
          </button>
        )}
      </div>
    </div>
  );
}
