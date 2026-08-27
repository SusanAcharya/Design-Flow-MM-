import { ObjectivePath } from "../ds/ObjectivePath";
import { Badge, Button, Overline } from "../ds/primitives";
import { Icon } from "../ds/Icon";
import { getObjective, homeObjectiveId, pathProgress } from "../lib/objectives";
import { getPersona, personas } from "../lib/personas";
import { useApp } from "../lib/state";
import { useEffect, useRef } from "react";
import type { Route } from "../lib/types";

const tulkeyFace = `${import.meta.env.BASE_URL}tulkey-hi.png`;
const guideFace = `${import.meta.env.BASE_URL}characters/setup-guide.png`;

/** One line from the teacher, when the page already carries the lesson. */
function TulkeyAside({ line }: { line: string }) {
  return (
    <p className="obj-aside">
      <img src={tulkeyFace} alt="" />
      <span>{line}</span>
    </p>
  );
}

/** Where to go when one sitting is not enough. */
function MoreWays() {
  const { go, openSheet } = useApp();
  const guide = personas.find((p) => p.id === "prakash") ?? personas[0];

  return (
    <section className="obj-more">
      <Overline>More ways to learn</Overline>
      <button type="button" className="obj-more-row" onClick={() => go("learn")}>
        <span className="ico-soft learn" aria-hidden><Icon name="learn" size={18} /></span>
        <span className="obj-more-copy">
          <strong>Courses</strong>
        </span>
        <Icon name="chev" size={15} />
      </button>
      <button
        type="button"
        className="obj-more-row"
        onClick={() => go("lesson", { lesson: "What is a kitta?" })}
      >
        <span className="ico-soft" aria-hidden><Icon name="book" size={18} /></span>
        <span className="obj-more-copy">
          <strong>Gyan</strong>
        </span>
        <Icon name="chev" size={15} />
      </button>
      <button
        type="button"
        className="obj-more-row"
        onClick={() =>
          openSheet({
            kind: "quick",
            title: "Book a quick call",
            body: "An analyst sits with you on a short call. They walk a name through, in your language. They never place an order.",
            note: "This prototype doesn’t book the slot yet.",
          })
        }
      >
        <span className="obj-more-faces" aria-hidden>
          <img src={tulkeyFace} alt="" />
          <img src={guide.img} alt="" />
        </span>
        <span className="obj-more-copy">
          <strong>Take a consultation</strong>
        </span>
        <Icon name="chev" size={15} />
      </button>
    </section>
  );
}

function HideObjectivesHint({ afterHide }: { afterHide?: () => void }) {
  const { hideHomeObjectives, setHideHomeObjectives } = useApp();
  const hidden = hideHomeObjectives;
  return (
    <button
      type="button"
      className="obj-hide-row"
      onClick={() => {
        setHideHomeObjectives(!hidden);
        if (!hidden) afterHide?.();
      }}
    >
      <span className="ico-soft" aria-hidden><Icon name="clipboard" size={16} /></span>
      <span className="obj-hide-copy">
        <strong>{hidden ? "Objectives are hidden" : "Objectives on Home"}</strong>
        <small>{hidden ? "Nothing shows on Home" : "The path shows on Home"}</small>
      </span>
      <em>{hidden ? "Show" : "Hide"}</em>
    </button>
  );
}

/* Progress belongs beside the path on web, not buried above the list. */
function PathProgress({ learned, total }: { learned: number; total: number }) {
  const pct = total ? Math.round((learned / total) * 100) : 0;
  return (
    <section className="obj-progress">
      <p>
        <strong>{learned} of {total}</strong>
        <small>sittings done</small>
      </p>
      <span className="obj-progress-bar" aria-hidden>
        <i style={{ width: `${pct}%` }} />
      </span>
    </section>
  );
}

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

/** Sits under the video: the page where you can see the lesson for yourself. */
function LessonCta({ line, ctaLabel, route }: { line: string; ctaLabel: string; route: Route }) {
  const { go } = useApp();
  return (
    <section className="obj-cta">
      <strong>{line}</strong>
      <Button variant="primary" size="sm" onClick={() => go(route)}>
        {ctaLabel}
      </Button>
    </section>
  );
}

/** The whole path, one tap away from any sitting. */
function AllObjectives({ learned, total }: { learned: number; total: number }) {
  const { go } = useApp();
  return (
    <button type="button" className="obj-all" onClick={() => go("objectives")}>
      <span className="obj-all-copy">
        <strong>All objectives</strong>
        <small>{learned} of {total} done</small>
      </span>
      <Icon name="chev" size={15} />
    </button>
  );
}

export function ObjectiveScreen() {
  const {
    back,
    go,
    objectiveId,
    viewingObjectiveId,
    pathFinished,
    objectivesDone,
    completeObjective,
    viewport,
    stage,
    personaId,
  } = useApp();
  const topRef = useRef<HTMLDivElement>(null);
  const pinned = homeObjectiveId(objectiveId, stage, personaId);
  const id = viewingObjectiveId ?? pinned;
  const o = getObjective(id);
  const progress = pathProgress(pinned, pathFinished, objectivesDone);

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
          {viewport === "web" && <button className="text-link web-back" onClick={back}>‹ Home</button>}
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
  const isLearned = objectivesDone.includes(o.id) || progress.done.some((item) => item.id === o.id) || pathFinished;
  const isLater = !isNow && !isLearned;
  const isFeature = o.kind === "feature";

  return (
    <div className="objective-page">
      {viewport === "mobile" && (
        <div className="app-bar">
          <button className="icon-btn" onClick={back} aria-label="Back"><Icon name="back" /></button>
          <h1>Your objective</h1>
        </div>
      )}

      <div ref={topRef} className="pad" style={{ paddingBottom: 8 }}>
        {viewport === "web" && (
          <button className="text-link web-back" onClick={back}>‹ Path</button>
        )}
        <div className="obj-hero">
          <div className="obj-hero-copy">
            <div className="obj-hero-meta">
              <Badge tone="accent">{o.level}</Badge>
              {!isFeature && <span className="chip">{o.duration}</span>}
              {isLearned && <span className="chip">Done</span>}
              {isNow && <span className="chip chip-on">{isFeature ? "Your move" : "Now"}</span>}
              {isLater && <span className="chip">Later on this path</span>}
            </div>
            <h2 className="t-h-xl">{o.title}</h2>
            <p className="t-body-m muted">{o.cardSub}</p>
          </div>
          <img className="obj-hero-guide" src={guideFace} alt="" />
        </div>
      </div>

      <div className="obj-body">
        <div className="obj-main">
          {o.kind === "learn" ? (
            <>
              <div className="pad" style={{ paddingTop: 4, paddingBottom: 12 }}>
                <VideoPlaceholder label={o.videoLabel ?? o.title} duration={o.duration} />
                <ul className="obj-recap">
                  {o.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              {o.lessonCta && (
                <div className="pad" style={{ paddingBottom: 12 }}>
                  <LessonCta {...o.lessonCta} />
                </div>
              )}
              <div className="pad" style={{ paddingBottom: 12 }}>
                <AllObjectives learned={progress.learned} total={progress.total} />
              </div>
            </>
          ) : (
            <>
              <div className="pad" style={{ paddingTop: 2 }}>
                <ul className="obj-recap plain">
                  {o.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              {o.feature && (
                <div className="pad" style={{ paddingTop: 12 }}>
                  <section className="obj-cta feature">
                    <Button
                      variant="primary"
                      size="md"
                      block
                      onClick={() => o.feature && go(o.feature.route)}
                    >
                      {o.feature.ctaLabel}
                    </Button>
                    <small>{isLearned ? "Already done — open it again any time." : o.feature.doneWhen}</small>
                  </section>
                </div>
              )}
              <div className="pad" style={{ paddingTop: 12 }}>
                <AllObjectives learned={progress.learned} total={progress.total} />
              </div>
            </>
          )}
        </div>

        <div className="obj-side">
          {isFeature && (
            <div className="pad" style={{ paddingTop: 4, paddingBottom: 8 }}>
              <TulkeyAside line={o.tulkeyLine} />
            </div>
          )}

          {isNow && progress.later[0] && (
            <p className="pad t-body-xs muted">Next: {progress.later[0].title}</p>
          )}

          {isNow && o.kind === "learn" && (
            <div className="pad" style={{ paddingTop: 10 }}>
              <section className="obj-act">
                <Button variant="primary" size="lg" block onClick={() => completeObjective()}>
                  I’ve watched it
                </Button>
                <button type="button" className="text-link obj-act-back" onClick={back}>
                  Back to Home
                </button>
              </section>
            </div>
          )}

          <div className="pad" style={{ paddingTop: 16 }}>
            <MoreWays />
          </div>

          <div className="pad" style={{ paddingTop: 14, paddingBottom: 28 }}>
            <HideObjectivesHint afterHide={() => go("home")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ObjectivesScreen() {
  const {
    back,
    viewport,
    objectiveId,
    pathFinished,
    objectivesDone,
    stage,
    personaId,
  } = useApp();
  const persona = getPersona(personaId);
  const { learned, total } = pathProgress(
    homeObjectiveId(objectiveId, stage, personaId),
    pathFinished,
    objectivesDone,
  );

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
      <div className="pad" style={{ paddingTop: 12 }}>
        {viewport === "web" && (
          <button type="button" className="text-link web-back" onClick={back}>‹ Home</button>
        )}
        <div className="obj-face">
          <div className="obj-face-copy">
            <span className="obj-face-kicker">Your path</span>
            <strong>
              {learned === 0
                ? "Let’s start at the beginning"
                : `${total - learned} ${total - learned === 1 ? "sitting" : "sittings"} left`}
            </strong>
            <small>
              {persona
                ? `Built for where ${persona.name} is starting. Watch first, then use the app — nothing to buy.`
                : "Watch first, then use the app. Nothing to buy, nothing to decide today."}
            </small>
          </div>
          <img className="obj-face-guide" src={guideFace} alt="" />
        </div>
      </div>
      <div className="obj-body">
        <div className="obj-main">
          <div className="pad" style={{ paddingBottom: 12 }}>
            <ObjectivePath />
          </div>
        </div>
        <div className="obj-side">
          <div className="pad" style={{ paddingBottom: 18 }}>
            <PathProgress learned={pathFinished ? total : learned} total={total} />
          </div>
          <div className="pad" style={{ paddingBottom: 18 }}>
            <MoreWays />
          </div>
          <div className="pad" style={{ paddingBottom: 28 }}>
            <HideObjectivesHint />
          </div>
        </div>
      </div>
    </div>
  );
}
