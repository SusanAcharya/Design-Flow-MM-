import { Children, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { HappenIco } from "../ds/HappenList";
import { BookNudge } from "../ds/BookNudge";
import { AllocStrip, TapeSpark } from "../ds/charts";
import { QuoteList } from "../ds/QuoteList";
import {
  allotments,
  bookHappen,
  ipoPipeline,
  watchlist,
  nepse,
  nepseSessionTicks,
  portfolio,
  secondaryBook,
  stripAlloc,
} from "../lib/data";
import { bookFor } from "../lib/portfolio";
import { npr, pct } from "../lib/format";
import { curriculum, homeObjectiveId, pathProgress, type Objective } from "../lib/objectives";
import { getExploreTool } from "../lib/explore";
import type { IconName } from "../ds/Icon";
import type { Route } from "../lib/types";
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

function NepseHero() {
  const { go, session, viewport } = useApp();
  const web = viewport === "web";
  const down = nepse.changePct < 0;
  const spark = nepseSessionTicks.prints.map((print) => print.v);

  return (
    <button type="button" className={`nepse-hero ${down ? "down" : "up"}`} onClick={() => go("market")}>
      <span className="nepse-hero-head">
        <span className="nepse-hero-name">
          NEPSE
          <Icon name="chev" size={14} />
        </span>
        <span className="nepse-hero-when">
          {nepse.date} · {session === "closed" ? nepse.closedAt : nepse.liveAt}
          <span className={`nepse-hero-state ${session}`}>{session === "closed" ? "CLOSED" : "OPEN"}</span>
        </span>
      </span>

      <span className="nepse-hero-line">
        <b className="nepse-hero-value">{npr(nepse.value, 2)}</b>
        <span className={`nepse-hero-pill ${down ? "down" : "up"}`}>
          {down ? "↓" : "↑"} {pct(nepse.changePct)}
        </span>
      </span>

      <TapeSpark
        values={spark}
        width={web ? 460 : 320}
        height={web ? 72 : 40}
        positive={!down}
        smooth={false}
      />

      <span className="nepse-meta">
        <span>Turnover <b>{npr(nepse.turnoverCr, 2)} Cr</b></span>
        <span>Volume <b>{nepse.volume}</b></span>
      </span>
    </button>
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
  if (item.doAction === "watch") return "star";
  if (item.doAction === "market") return "market";
  if (item.doAction === "basket") return "pie";
  if (item.doAction === "broker") return "building";
  if (item.id === "terms") return "book";
  return "learn";
}

/**
 * Home's path card. A beginner who hasn't finished a sitting yet gets the whole
 * checklist with Tulkey on it; everyone else gets the one-line pill. Either way
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
                  <span className={`setup-glyph ${item.kind}`} aria-hidden>
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

/** Six places people ask for by name, straight off Home. */
const jumpTiles: { id: string; label: string; icon: IconName; tool?: string; route?: Route; brokerDesk?: "hub" | "analysis" }[] = [
  { id: "alerts", label: "Alerts", icon: "bell", route: "alerts" },
  { id: "baskets", label: "Baskets", icon: "pie", route: "baskets" },
  { id: "brokers", label: "Brokers", icon: "building", route: "brokers", brokerDesk: "analysis" },
  { id: "ai-zone", label: "AI Zone", icon: "tulkey", route: "ai" },
  { id: "mf-holdings", label: "MF Holdings", icon: "coins", tool: "mutual-funds" },
];

function JumpGrid() {
  const { go, openSheet, homeTools } = useApp();

  /* The five that ship, plus anything added from Explore. */
  const tiles = [
    ...jumpTiles,
    ...homeTools
      .map((id) => getExploreTool(id))
      .filter((tool) => Boolean(tool))
      .map((tool) => ({
        id: tool!.id,
        label: tool!.short,
        icon: tool!.icon,
        tool: tool!.id,
        route: undefined,
        brokerDesk: undefined,
      })),
  ];

  const open = (tile: (typeof jumpTiles)[number]) => {
    if (tile.route) {
      go(tile.route, tile.brokerDesk ? { brokerDesk: tile.brokerDesk } : undefined);
      return;
    }
    const tool = tile.tool ? getExploreTool(tile.tool) : null;
    if (!tool) return;
    if (tool.sheet) openSheet(tool.sheet);
    else if (tool.soon) openSheet({ kind: "quick", title: tool.title, body: tool.soon.body });
    else if (tool.go) go(tool.go.route, { marketTab: tool.go.marketTab, lesson: tool.go.lesson, marketDesk: tool.go.marketDesk, brokerDesk: tool.go.brokerDesk });
  };

  return (
    <div className="jump-rail" role="list">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          type="button"
          className="jump-tile"
          role="listitem"
          onClick={() => open(tile)}
        >
          <span className="jump-glyph" aria-hidden>
            <Icon name={tile.icon} size={20} />
          </span>
          <small>{tile.label}</small>
        </button>
      ))}
    </div>
  );
}

function WatchlistPreview() {
  const { go, watchlists } = useApp();
  /* Home mirrors the first list, so an add on the watchlist screen shows here. */
  const symbols = (watchlists[0]?.symbols ?? []).slice(0, 4);
  const rows = symbols
    .map((symbol) => watchlist.find((row) => row.symbol === symbol))
    .filter((row): row is (typeof watchlist)[number] => Boolean(row));

  return (
    <QuoteList
      rows={rows.map((row) => ({
        symbol: row.symbol,
        name: row.name,
        price: row.price,
        changePct: row.changePct,
      }))}
      onRow={(symbol) => go("stock", { stock: symbol })}
    />
  );
}

function LearnBoard() {
  const { go } = useApp();

  return (
    <button type="button" className="learn-byte" onClick={() => go("objective", { objective: "terms" })}>
      <span className="learn-byte-copy">
        <small>Learn</small>
        <strong>The words you’ll keep seeing</strong>
        <span>90 seconds — kitta, LTP, book close</span>
        <em>Read it ›</em>
      </span>
      <span className="learn-byte-art" aria-hidden>
        <img src={mitra.search} alt="" />
      </span>
    </button>
  );
}

function ConsultCard() {
  const { openSheet } = useApp();

  return (
    <button
      type="button"
      className="consult-card"
      onClick={() => openSheet({
        kind: "quick",
        title: "Book a quick call",
        body: "An analyst sits with you on a short call. They walk a name through. They never place an order.",
        note: "This prototype doesn’t book the slot yet.",
      })}
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
