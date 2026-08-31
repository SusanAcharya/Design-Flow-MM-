import { Children, useEffect, useRef, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { HappenIco } from "../ds/HappenList";
import { BookNudge } from "../ds/BookNudge";
import { AllocStrip, TapeSpark } from "../ds/charts";
import { QuoteList } from "../ds/QuoteList";
import {
  allotments,
  bookHappen,
  ipoPipeline,
  listedQuotes,
  watchlist,
  nepseFor,
  nepseTicksFor,
  portfolio,
  secondaryBook,
  stripAlloc,
} from "../lib/data";
import { bookFor } from "../lib/portfolio";
import { npr, pct } from "../lib/format";
import { curriculum, homeObjectiveId, pathProgress, type Objective } from "../lib/objectives";
import { getExploreTool } from "../lib/explore";
import type { IconName } from "../ds/Icon";
import { useApp } from "../lib/state";
import { mitra } from "../lib/mitra";

type FeedTone = "market" | "book" | "learn" | "news" | "alert" | "ipo" | "move" | "list";

function FeedGroup({
  label,
  hideLabel = false,
  action,
  onAction,
  tone = "list",
  children,
}: {
  label: string;
  hideLabel?: boolean;
  action?: string;
  onAction?: () => void;
  tone?: FeedTone;
  children: ReactNode;
}) {
  const items = Children.toArray(children);
  if (items.length === 0) return null;
  const id = `feed-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section className={`feed-group${hideLabel ? " no-label" : ""}`} data-tone={tone} aria-labelledby={id}>
      {hideLabel ? (
        <h2 id={id} className="vh">{label}</h2>
      ) : (
        <header className="feed-group-head">
          <h2 id={id} className="feed-group-label">{label}</h2>
          {action && (
            <button type="button" className="text-link" onClick={onAction}>{action}</button>
          )}
        </header>
      )}
      <div className="feed-group-body">{items}</div>
    </section>
  );
}

function Breadth({ rose, fell, unchanged }: { rose: number; fell: number; unchanged: number }) {
  const total = rose + fell + unchanged || 1;
  const pctOf = (n: number) => `${(n / total) * 100}%`;
  return (
    <span className="nepse-breadth">
      <span className="nepse-breadth-bar" aria-hidden>
        <i style={{ width: pctOf(rose) }} />
        <b style={{ width: pctOf(fell) }} />
        <em style={{ width: pctOf(unchanged) }} />
      </span>
      <span className="nepse-breadth-legend">
        <span><strong className="c-up">{rose}</strong> rose</span>
        <span><strong className="c-down">{fell}</strong> fell</span>
        <span><strong className="c-muted">{unchanged}</strong> unchanged</span>
      </span>
    </span>
  );
}

/* A sibling of the card, not a child — the card is itself a <button> and a
   nested one would be invalid and would swallow the card's own tap. */
function NepseRefresh() {
  const { dataState, setDataState } = useApp();
  const timer = useRef<number | null>(null);
  const busy = dataState === "refreshing";

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const refresh = () => {
    if (busy) return;
    setDataState("refreshing");
    timer.current = window.setTimeout(() => setDataState("ready"), 1300);
  };

  return (
    <button
      type="button"
      className={`nepse-refresh${busy ? " busy" : ""}`}
      onClick={refresh}
      aria-label={busy ? "Refreshing the index" : "Refresh the index"}
    >
      <Icon name="refresh" size={15} />
    </button>
  );
}

function NepseHero() {
  const { go, session, viewport, trend } = useApp();
  const web = viewport === "web";
  const index = nepseFor(trend);
  const down = index.changePct < 0;
  const spark = nepseTicksFor(trend).prints.map((print) => print.v);

  return (
    <div className="nepse-hero-wrap">
      <button type="button" className={`nepse-hero ${down ? "down" : "up"}`} onClick={() => go("market")}>
      {/* Mitra flies the day's flag — decorative, the figures already say the direction. */}
      <img className="nepse-hero-mitra" src={down ? mitra.flagDown : mitra.flagUp} alt="" />
      <span className="nepse-hero-head">
        <span className="nepse-hero-name">
          NEPSE
          <Icon name="chev" size={14} />
        </span>
        <span className="nepse-hero-when">
          <span className="nepse-hero-stamp">
            <span className="nepse-hero-date">{index.date}</span>
            {session === "closed" ? index.closedAt : index.liveAt}
          </span>
          <span className={`nepse-hero-state ${session}`}>{session === "closed" ? "CLOSED" : "OPEN"}</span>
        </span>
      </span>

      <span className="nepse-hero-line">
        <b className="nepse-hero-value">{npr(index.value, 2)}</b>
        <span className={`nepse-hero-pill ${down ? "down" : "up"}`}>
          {down ? "↓" : "↑"} {pct(index.changePct)}
        </span>
      </span>

      <TapeSpark
        values={spark}
        width={web ? 360 : 320}
        height={web ? 170 : 40}
        positive={!down}
        smooth={false}
      />

      {/* Web has a full column of height to fill. Breadth is the figure the card
          was missing — how many names moved, not just where the index landed.
          Spans, not BreadthBar's divs: this card is a <button>. */}
      {web && <Breadth rose={index.rose} fell={index.fell} unchanged={index.unchanged} />}

      <span className="nepse-meta">
        <span>Turnover <b>{npr(index.turnoverCr, 2)} Cr</b></span>
        <span>Volume <b>{index.volume}</b></span>
      </span>
      </button>
      <NepseRefresh />
    </div>
  );
}

const emptyAlloc = [{ short: "EMPTY", pct: 100, color: "var(--border-strong)" }];

function BookSummary({ empty = false }: { empty?: boolean }) {
  const { go } = useApp();
  /* An empty book has nothing to report — the ghost figures already say so. */
  if (empty) return null;
  return (
    <div className="book-summary">
      <div className="book-summary-head">
        <span className="book-summary-label">What's happening</span>
        <button type="button" className="text-link" onClick={() => go("happening")}>
          See everything ›
        </button>
      </div>
      {bookHappen.map((item) => (
        <button
          key={item.title}
          type="button"
          className="happen-row"
          onClick={() => (item.stock ? go("stock", { stock: item.stock }) : go("happening"))}
        >
          <HappenIco kind={item.kind} />
          <span className="happen-row-copy">
            <strong>{item.title}</strong>
            <small>{item.sub}</small>
          </span>
          <em>{item.context}</em>
        </button>
      ))}
    </div>
  );
}

function BookCard({ empty = false }: { empty?: boolean }) {
  const { stage, go, primaryPortfolioId, setPortfolioId } = useApp();
  const primary = bookFor(primaryPortfolioId);
  const value = empty
    ? 0
    : stage === "value"
      ? portfolio.investorValue
      : stage === "secondary"
        ? secondaryBook.value
        : primary.totals.marketValue;
  const today = empty
    ? 0
    : stage === "value"
      ? portfolio.investorToday
      : stage === "secondary"
        ? secondaryBook.today
        : primary.totals.dayPl;
  const down = today < 0;

  return (
    <div className="book-card">
      <button
        type="button"
        className="book-card-tap"
        onClick={() => {
          setPortfolioId(primaryPortfolioId);
          go("portfolio");
        }}
      >
        <span className="book-card-head">
          <span>Your portfolio</span>
          <span className="book-card-open">Open ›</span>
        </span>
        <span className="book-card-figures">
          <b>Rs {npr(value)}</b>
          <em className={empty || today === 0 ? "muted" : down ? "c-down" : "c-up"}>
            {down ? "−" : "+"}Rs {npr(Math.abs(today))}
          </em>
        </span>
        <AllocStrip rows={empty ? emptyAlloc : stripAlloc(primary.sectors)} legend={false} />
      </button>
      <BookSummary empty={empty} />
    </div>
  );
}

function stepIcon(item: Objective): IconName {
  if (item.doAction === "book") return "wallet";
  if (item.doAction === "watch") return "bookmark";
  if (item.doAction === "market") return "market";
  if (item.doAction === "courses") return "book";
  if (item.doAction === "alerts") return "bell";
  if (item.kind === "overview") return "clipboard";
  return "learn";
}

/**
 * Home's path card. A beginner who hasn't finished a sitting yet gets the whole
 * checklist with Mitra on it; everyone else gets the one-line pill. Either way
 * the arrow switches between the two forms.
 */
function NextStepsCard() {
  const {
    go,
    objectiveId,
    pathFinished,
    hideHomeObjectives,
    stage,
    personaId,
    setupOpen,
    setSetupOpen,
    objectivesCompleted,
    objectivesDone,
  } = useApp();
  const pinned = homeObjectiveId(objectiveId, stage, personaId);
  const { now, total, learned } = pathProgress(pinned, pathFinished, objectivesDone);
  if (hideHomeObjectives || pathFinished || !now) return null;
  const last = total - learned === 1;
  const beginner = personaId === "maya" || personaId === "prakash" || personaId === null;
  const open = setupOpen ?? (beginner && objectivesCompleted === 0);

  if (!open) {
    return (
      <div className="next-steps">
        <button type="button" className="next-steps-main" onClick={() => go("objectives")}>
          <span className="next-steps-n">{learned}/{total}</span>
          <span className="next-steps-copy">
            {last ? `One step left: ${now.title}` : `Next steps: ${now.title}`}
          </span>
        </button>
        <button
          type="button"
          className="next-steps-expand"
          aria-label="Expand next steps"
          aria-expanded={false}
          onClick={() => setSetupOpen(true)}
        >
          <Icon name="chev" size={14} />
        </button>
      </div>
    );
  }

  const preview = [
    now,
    ...curriculum.filter((item) => item.n > now.n && !objectivesDone.includes(item.id)),
  ].slice(0, 3);

  return (
    <section className="setup-card" aria-labelledby="setup-title">
      <header className="setup-head">
        <div className="setup-head-copy">
          <strong id="setup-title">Get set up</strong>
          <small>{learned}/{total}</small>
        </div>
        <button
          type="button"
          className="setup-collapse"
          aria-label="Collapse next steps"
          aria-expanded
          onClick={() => setSetupOpen(false)}
        >
          <Icon name="chev" size={14} />
        </button>
      </header>

      <div className="setup-body">
        <ul className="setup-list">
          {preview.map((item) => {
            const current = item.id === now.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`setup-step${current ? " now" : ""}`}
                  onClick={() => go("objective", { objective: item.id })}
                >
                  <span className={`setup-glyph ${item.kind === "feature" ? "do" : "learn"}`} aria-hidden>
                    <Icon name={stepIcon(item)} size={16} />
                  </span>
                  <span className="setup-step-copy">
                    <strong>{item.title}</strong>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <img className="setup-guide" src={mitra.pointing} alt="" />
      </div>

      <footer className="setup-foot">
        <button type="button" className="text-link" onClick={() => go("objectives")}>
          View all objectives
        </button>
      </footer>
    </section>
  );
}

function HomeTop() {
  const { stage, go, bookNudgeDismissed, hasPortfolio } = useApp();
  /* No book yet, by persona or by the studio switch — Home shows the ghost, not figures. */
  const noBook = !hasPortfolio || stage === "explorer";

  return (
    <div className="home-top">
      <NepseHero />
      {stage === "primary" && hasPortfolio ? (
        <>
          <button type="button" className="book-card" onClick={() => go("portfolio")}>
            <span className="book-card-head">
              <span>IPO pipeline</span>
              <span className="book-card-open">Open ›</span>
            </span>
            <span className="book-card-figures">
              <b>Rs {npr(ipoPipeline.value)}</b>
              <em className="muted">{ipoPipeline.kitta} kitta · {ipoPipeline.count} issues</em>
            </span>
          </button>
          <div className="home-allot">
            {allotments.map((a) => (
              <div key={a.name} className="row">
                <span className={`event-bar ${a.status === "allotted" ? "up" : "warn"}`} />
                <div className="row-main">
                  <p className="t-h-s">
                    {a.status === "allotted" ? "Allotted" : "Still waiting"} · {a.name}
                  </p>
                  <p className="row-sub">
                    {a.status === "allotted" ? `${a.kitta} kitta · check CDSC / MeroShare` : "Result not out yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : noBook ? (
        bookNudgeDismissed ? <BookCard empty /> : null
      ) : (
        <BookCard />
      )}
    </div>
  );
}

function AddPortfolioCta() {
  const { go, bookNudgeDismissed, dismissBookNudge } = useApp();
  if (bookNudgeDismissed) return null;
  return (
    <BookNudge
      onAdd={() => go("holding", { holdingMode: "add" })}
      onDismiss={dismissBookNudge}
    />
  );
}

/** Home mirrors what is pinned on Explore — the first four of that list. The
    web has room, so it runs to eight before it stops. Nothing is hardcoded
    here: unpin a tool on Explore and it leaves this row. */
const jumpLimit = { mobile: 4, web: 8 } as const;

function JumpGrid() {
  const { go, openSheet, homeTools, viewport } = useApp();

  const tiles = homeTools
    .map((id) => getExploreTool(id))
    .filter((tool): tool is NonNullable<ReturnType<typeof getExploreTool>> => Boolean(tool))
    .slice(0, jumpLimit[viewport]);

  const open = (tool: (typeof tiles)[number]) => {
    if (tool.sheet) openSheet(tool.sheet);
    else if (tool.soon) openSheet({ kind: "quick", title: tool.title, body: tool.soon.body });
    else if (tool.handoff) {
      openSheet({
        kind: "quick",
        title: tool.handoff.platform,
        body: tool.handoff.body,
        note: "This opens the named site. MoneyMitra does not log you in.",
      });
    } else if (tool.go) {
      go(tool.go.route, {
        stock: tool.go.stock,
        stockTab: tool.go.stockTab,
        marketTab: tool.go.marketTab,
        marketDesk: tool.go.marketDesk,
        brokerDesk: tool.go.brokerDesk,
        brokerCode: tool.go.brokerCode,
        lesson: tool.go.lesson,
      });
    }
  };

  /* Everything unpinned — the row would be empty, so it points at Explore. */
  if (tiles.length === 0) {
    return (
      <button type="button" className="jump-empty" onClick={() => go("discover")}>
        <span className="jump-glyph" aria-hidden>
          <Icon name="sliders" size={20} />
        </span>
        <span className="jump-empty-copy">
          <strong>Nothing pinned</strong>
          <small>Pick your shortcuts on Explore and they land here.</small>
        </span>
        <Icon name="chev" size={15} />
      </button>
    );
  }

  return (
    <div className="jump-rail" role="list">
      {tiles.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className="jump-tile"
          role="listitem"
          onClick={() => open(tool)}
        >
          <span className="jump-glyph" aria-hidden>
            <Icon name={tool.icon} size={20} />
          </span>
          <small>{tool.short}</small>
        </button>
      ))}
    </div>
  );
}

/* Empty has to read as empty — a mark, the state in words, and one way out.
   No rows and no prices: under a heading that says "Watchlist", anything that
   looks like a listing reads as names you already follow. */
function WatchlistStarter() {
  const { go } = useApp();

  return (
    <div className="watch-zero">
      <span className="watch-zero-mark" aria-hidden>
        <Icon name="bookmark" size={20} />
      </span>
      <p className="watch-zero-lead">Nothing followed yet</p>
      <button type="button" className="text-link watch-zero-more" onClick={() => go("market")}>
        Add to your watchlist ›
      </button>
    </div>
  );
}

function WatchlistPreview() {
  const { go, watchlists } = useApp();
  /* Home mirrors the first list, so an add on the watchlist screen shows here. */
  const symbols = (watchlists[0]?.symbols ?? []).slice(0, 4);
  /* Any listed name can be followed, so resolve the tape first and the seeded
     watchlist second — otherwise a followed name silently vanishes from Home. */
  const rows = symbols
    .map((symbol) => {
      const quote = listedQuotes.find((row) => row.symbol === symbol);
      if (quote) {
        return { symbol: quote.symbol, name: quote.name, price: quote.ltp, changePct: quote.changePct };
      }
      const seeded = watchlist.find((row) => row.symbol === symbol);
      return seeded
        ? { symbol: seeded.symbol, name: seeded.name, price: seeded.price, changePct: seeded.changePct }
        : null;
    })
    .filter((row): row is { symbol: string; name: string; price: number; changePct: number } => Boolean(row));

  /* Nothing followed yet — show real names to follow, not a box describing them. */
  if (rows.length === 0) return <WatchlistStarter />;

  return <QuoteList rows={rows} onRow={(symbol) => go("stock", { stock: symbol })} />;
}

function LearnBoard() {
  const { go } = useApp();

  return (
    <button type="button" className="learn-byte" onClick={() => go("objective", { objective: "share" })}>
      <span className="learn-byte-copy">
        <small>Learn</small>
        <strong>How the share market works</strong>
        <span>60 seconds — kitta, NEPSE, the index</span>
        <em>Watch it ›</em>
      </span>
      <span className="learn-byte-art" aria-hidden>
        <img src={mitra.search} alt="" />
      </span>
    </button>
  );
}

function ConsultCard() {
  const { go } = useApp();

  return (
    <button
      type="button"
      className="consult-card"
      onClick={() => go("subscription", { planPick: "pro", subIntent: "consult" })}
    >
      <span className="consult-faces" aria-hidden>
        <img src={mitra.chart} alt="" />
      </span>
      <span className="consult-copy">
        <small>Quick call</small>
        <strong>Take a consultation</strong>
        <span>Sit with an analyst on a short call. We explain. We don’t place orders.</span>
      </span>
      <span className="consult-go">Book ›</span>
    </button>
  );
}

function HomeFeedStack() {
  const { stage, go, hasPortfolio } = useApp();
  /* The nudge is for an empty book only — never beside a card showing real value. */
  const showAdd = !hasPortfolio || stage === "explorer";

  return (
    <div className="home-you">
      <NextStepsCard />
      <HomeTop />
      {showAdd && <AddPortfolioCta />}
      <FeedGroup label="Jump straight to" tone="book" action="All tools ›" onAction={() => go("discover")}>
        <JumpGrid />
      </FeedGroup>
      <div className="home-split">
        <FeedGroup label="Watchlist" tone="list" action="View full ›" onAction={() => go("watchlist")}>
          <WatchlistPreview />
        </FeedGroup>
        <div className="home-split-side">
          <FeedGroup label="A guide" hideLabel tone="learn">
            <ConsultCard />
          </FeedGroup>
          <FeedGroup label="Learn more" tone="learn">
            <LearnBoard />
          </FeedGroup>
        </div>
      </div>
    </div>
  );
}

export { WatchlistScreen } from "./Watchlist";

export { BrokersScreen } from "./Brokers";

export { BasketsScreen } from "./Baskets";

export function HomeScreen() {
  return (
    <div className="home-screen">
      <HomeFeedStack />
      {/* <p className="disclaimer">Last session’s prints. We don’t place orders.</p> */}
    </div>
  );
}
