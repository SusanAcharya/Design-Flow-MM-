import { Children, useState, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { HappenIco } from "../ds/HappenList";
import { BookNudge } from "../ds/BookNudge";
import {
  Button,
  Chip,
  Delta,
  SearchField,
  SectionHead,
} from "../ds/primitives";
import { AllocStrip, TapeSpark } from "../ds/charts";
import { QuoteList } from "../ds/QuoteList";
import {
  allotments,
  basketCatalog,
  bookHappen,
  brokerHighlights,
  brokerTable,
  ipoPipeline,
  namesOnWatchList,
  nepse,
  nepseSession,
  portfolio,
  secondaryBook,
  watchlist,
  watchLists,
  stripAlloc,
} from "../lib/data";
import { bookFor } from "../lib/portfolio";
import { npr, pct } from "../lib/format";
import { isBaseHome } from "../lib/stage";
import { homeObjectiveId, pathProgress } from "../lib/objectives";
import { personas } from "../lib/personas";
import { useApp } from "../lib/state";

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
  const { go } = useApp();
  const down = nepse.changePct < 0;
  const spark = nepseSession.prints.map((print) => print.v);

  return (
    <button type="button" className={`nepse-hero ${down ? "down" : "up"}`} onClick={() => go("market")}>
      <span className="nepse-hero-line">
        <span className="nepse-hero-kicker">NEPSE</span>
        <b className="nepse-hero-value">{npr(nepse.value, 2)}</b>
        <TapeSpark values={spark} width={140} height={28} positive={!down} />
        <em className={down ? "c-down" : "c-up"}>{pct(nepse.changePct)}</em>
      </span>
      <span className="nepse-meta">
        Turnover <b>{npr(nepse.turnoverCr, 2)} Cr</b>
        <i />
        Volume <b>{nepse.volume}</b>
      </span>
    </button>
  );
}

const emptyAlloc = [{ short: "EMPTY", pct: 100, color: "var(--border-strong)" }];

function BookSummary({ empty = false }: { empty?: boolean }) {
  return (
    <span className="book-summary">
      <span className="book-summary-label">What's happening</span>
      {empty ? (
        <span className="book-summary-empty">Nothing moved in your book yet. Add kitta and this fills in.</span>
      ) : (
        bookHappen.map((item) => (
          <span key={item.title} className="happen-row">
            <HappenIco kind={item.kind} />
            <span className="happen-row-copy">
              <strong>{item.title}</strong>
              <small>{item.sub}</small>
            </span>
            <em>{item.context}</em>
          </span>
        ))
      )}
    </span>
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
    <button
      type="button"
      className="book-card"
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
      <BookSummary empty={empty} />
    </button>
  );
}

function NextStepsCard() {
  const { go, objectiveId, pathFinished, hideHomeObjectives, stage, personaId } = useApp();
  const pinned = homeObjectiveId(objectiveId, stage, personaId);
  const { now, total, learned } = pathProgress(pinned, pathFinished);
  if (hideHomeObjectives || pathFinished || !now) return null;
  const last = total - learned === 1;

  return (
    <button type="button" className="next-steps" onClick={() => go("objectives")}>
      <span className="next-steps-n">{now.n}/{total}</span>
      <span className="next-steps-copy">
        {last ? `One step left: ${now.title}` : `Next steps: ${now.title}`}
      </span>
      <span className="next-steps-go">{last ? "Finish" : "Open"} ›</span>
    </button>
  );
}

function HomeTop() {
  const { stage, go, bookNudgeDismissed } = useApp();

  return (
    <div className="home-top">
      <NepseHero />
      {stage === "primary" ? (
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
      ) : stage === "explorer" ? (
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

const featuredBasketIds = ["hydro-b", "banks-b", "sip", "earn", "stars", "list", "leaders", "mom", "large", "exdate"];
const basketShort: Record<string, string> = {
  "hydro-b": "Hydro",
  "banks-b": "Banks",
  sip: "SIP",
  earn: "Earnings",
  stars: "Stars",
  list: "Listings",
  leaders: "Leaders",
  mom: "Momentum",
  large: "Large",
  exdate: "Ex-date",
};

function BasketMark({ id }: { id: string }) {
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}baskets/${id}.svg`;
  if (failed) {
    return (
      <span className="basket-cover" aria-hidden>
        <img src={`${import.meta.env.BASE_URL}baskets/default.svg`} alt="" />
      </span>
    );
  }
  return (
    <span className="basket-cover" aria-hidden>
      <img src={src} alt="" onError={() => setFailed(true)} />
    </span>
  );
}

function FreeBasketsRail() {
  const { openSheet } = useApp();
  const rows = featuredBasketIds
    .map((id) => basketCatalog.find((item) => item.id === id))
    .filter((item): item is (typeof basketCatalog)[number] => Boolean(item));

  return (
    <div className="broker-icon-rail" role="list">
      {rows.map((basket) => (
        <button
          key={basket.id}
          type="button"
          className="broker-icon"
          role="listitem"
          aria-label={basket.title}
          onClick={() => openSheet({
            kind: "quick",
            title: basket.title,
            body: "This group reuses today’s prints with the same dates and definitions. Opening it does not buy kitta, and it is not a recommendation.",
            note: "Compare on Market if you want the underlying names.",
          })}
        >
          <BasketMark id={basket.id} />
          <small>{basketShort[basket.id] ?? basket.title.split(" ")[0]}</small>
        </button>
      ))}
    </div>
  );
}

function WatchlistPreview() {
  const { go } = useApp();
  const rows = namesOnWatchList("main").slice(0, 4);

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
  const tulkey = `${import.meta.env.BASE_URL}tulkey-hi.png`;
  const sita = personas.find((p) => p.id === "sita") ?? personas[0];

  return (
    <button type="button" className="learn-byte" onClick={() => go("objective", { objective: "read" })}>
      <span className="learn-byte-copy">
        <small>Learn</small>
        <strong>What book close actually means</strong>
        <span>90 seconds, with your own holding</span>
        <em>Read it ›</em>
      </span>
      <span className="learn-byte-art" aria-hidden>
        <img src={sita.img} alt="" />
        <img src={tulkey} alt="" />
      </span>
    </button>
  );
}

function ConsultCard() {
  const { openSheet } = useApp();
  const guide = personas.find((p) => p.id === "prakash") ?? personas[0];
  const tulkey = `${import.meta.env.BASE_URL}tulkey-hi.png`;

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
        <img src={tulkey} alt="" />
        <img src={guide.img} alt="" />
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
  const { stage, go } = useApp();
  const base = isBaseHome(stage);
  const showAdd = base || stage === "explorer";

  return (
    <div className="home-you">
      <NextStepsCard />
      <HomeTop />
      {showAdd && <AddPortfolioCta />}
      <FeedGroup label="Top free baskets" tone="book" action="All ›" onAction={() => go("baskets")}>
        <FreeBasketsRail />
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

function PageFrame({ title, children }: { title: string; children: ReactNode }) {
  const { back, viewport } = useApp();
  return (
    <div>
      {viewport === "mobile" && (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={back} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>{title}</h1>
        </div>
      )}
      {viewport === "web" && (
        <div className="pad" style={{ paddingTop: 12, paddingBottom: 4 }}>
          <button type="button" className="text-link" onClick={back}>‹ Home</button>
        </div>
      )}
      {children}
    </div>
  );
}

export function WatchlistScreen() {
  const { go, addToWatchlist, watchlistAdds, flash } = useApp();
  const [listId, setListId] = useState(watchLists[0].id);
  const [query, setQuery] = useState("");
  const active = watchLists.find((list) => list.id === listId) ?? watchLists[0];
  const extras = listId === "main"
    ? watchlistAdds.flatMap((symbol) => {
        const row = watchlist.find((item) => item.symbol === symbol);
        if (!row || active.symbols.includes(symbol)) return [];
        return [row];
      })
    : [];
  const rows = [...namesOnWatchList(active.id), ...extras].filter((row) => {
    const hay = `${row.symbol} ${row.name}`.toLowerCase();
    return hay.includes(query.trim().toLowerCase());
  });
  const suggestions = watchlist.filter((row) =>
    !active.symbols.includes(row.symbol) && !watchlistAdds.includes(row.symbol),
  );

  return (
    <PageFrame title="Watchlist">
    <div className="home-you tab-feed">
      <FeedGroup label="Your lists" tone="list">
        <div className="cluster">
          <div className="feed-kicker">
            <div>
              <p className="t-h-s">{active.label}</p>
              <p className="t-body-s muted">{active.blurb}</p>
            </div>
            <span className="t-body-xs muted">{rows.length} names</span>
          </div>
          <div className="mover-pills" role="tablist" aria-label="Watchlists">
            {watchLists.map((list) => (
              <Chip key={list.id} selected={listId === list.id} onClick={() => setListId(list.id)}>
                {list.label}
              </Chip>
            ))}
          </div>
          <SearchField placeholder="Search this list" value={query} onChange={setQuery} />
        </div>
      </FeedGroup>
      <FeedGroup label="On this list" tone="move">
        {rows.length > 0 ? (
          <QuoteList
            rows={rows.map((row) => ({
              symbol: row.symbol,
              name: row.name,
              price: row.price,
              changePct: row.changePct,
            }))}
            onRow={(symbol) => go("stock", { stock: symbol })}
          />
        ) : (
          <p className="t-body-s muted">Nothing on this list matches that search.</p>
        )}
      </FeedGroup>
      <FeedGroup label="Follow another" tone="book">
        <div className="cta-well">
          <p className="t-h-s">Add a name to {active.label}</p>
          <p className="t-body-s muted">Following never buys kitta. Completes the watchlist objective when you add.</p>
          {suggestions.slice(0, 3).map((row) => (
            <button
              key={row.symbol}
              type="button"
              className="row"
              onClick={() => {
                addToWatchlist(row.symbol);
                flash({ message: `${row.symbol} is on ${active.label}.` });
                setListId("main");
              }}
            >
              <div className="row-main">
                <p className="t-h-s">{row.symbol}</p>
                <p className="row-sub">{row.name}</p>
              </div>
              <span className="text-link">Add ›</span>
            </button>
          ))}
          <Button variant="secondary" size="md" onClick={() => go("search")}>Find another scrip</Button>
        </div>
      </FeedGroup>
    </div>
    </PageFrame>
  );
}

export function BrokersScreen() {
  const { go, openSheet, session } = useApp();
  const explainBroker = (row: (typeof brokerTable)[number]) => openSheet({
    kind: "quick",
    title: `Broker ${row.code}`,
    body: `${row.name} turned over ${npr(row.turnover, 1)} Cr in the sampled session. Buy ${row.buyPct}% / sell ${row.sellPct}% is the split of executed kitta — many clients, not one person.`,
    note: "Observed activity only. MoneyMitra does not rank brokers or tell you where to open TMS.",
  });
  const tmsSheet = () => openSheet({
    kind: "quick",
    title: "How a TMS account works",
    body: "TMS is your broker’s trading terminal. You open it with a licensed broker, then place orders there. MoneyMitra never holds cash or submits those orders.",
    note: "This is not a list of brokers to pick. Check SEBON’s licensed list.",
  });

  return (
    <PageFrame title="Brokers">
    <div className="home-you tab-feed">
      <FeedGroup label="Floor today" tone="market">
        <div className="cluster">
          <div className="feed-kicker">
            <div>
              <p className="overline">NEPSE · floor</p>
              <p className="t-h-s">Executed flow · {nepse.date}</p>
            </div>
            <span className={`time-pill ${session === "open" ? "live" : ""}`}>
              {session === "open" ? nepse.liveAt : nepse.closedAt}
            </span>
          </div>
          <div className="figure-line">
            <p className="hero-num">{npr(nepse.value, 2)}</p>
            <Delta value={nepse.changePct} />
          </div>
          <p className="figure-note">Turnover {npr(nepse.turnoverCr, 2)} Cr · Volume {nepse.volume}</p>
          <div className="hl-grid">
            {brokerHighlights.map((item) => (
              <button key={item.label} type="button" className="hl-card marked" onClick={() => go("market")}>
                <span className={`broker-mark ${item.tone}`}>{item.mark}</span>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
                <em>{item.sub}</em>
              </button>
            ))}
          </div>
        </div>
      </FeedGroup>
      <FeedGroup label="Your broker" tone="book">
        <div className="cta-well">
          <p className="overline">TMS</p>
          <p className="t-h-s">Need a trading account?</p>
          <p className="t-body-s muted">
            Opening TMS happens at a licensed broker. MoneyMitra can explain the step. It does not open the account or place an order.
          </p>
          <Button variant="primary" size="md" onClick={tmsSheet}>How TMS works</Button>
        </div>
      </FeedGroup>
      <FeedGroup label="On the sheet" tone="list">
        <div className="cluster">
          <SectionHead title="Brokers" action="Floor sheet ›" onAction={() => go("market")} />
          {brokerTable.map((row) => (
            <article key={row.code} className="broker-card">
              <div className="broker-card-top">
                <span className="broker-mark">{row.code}</span>
                <div className="quote-id">
                  <p className="t-h-s">{row.name}</p>
                  <small>Broker no. {row.code}</small>
                </div>
                <span className={`delta ${row.netCr < 0 ? "delta-down" : "delta-up"}`}>
                  {row.netCr < 0 ? "Net seller" : "Net buyer"}
                </span>
              </div>
              <div className="broker-card-stats">
                <div>
                  <small>Today</small>
                  <b>{npr(row.turnover, 1)} Cr</b>
                </div>
                <div>
                  <small>Avg 30 days</small>
                  <b>{npr(row.avg30, 1)} Cr</b>
                </div>
                <div>
                  <small>Buy / sell</small>
                  <b>{row.buyPct}% · {row.sellPct}%</b>
                </div>
              </div>
              <div className="btn-row">
                <Button variant="secondary" size="sm" onClick={() => explainBroker(row)}>Explain</Button>
                <Button variant="primary" size="sm" onClick={tmsSheet}>How TMS works</Button>
              </div>
            </article>
          ))}
        </div>
      </FeedGroup>
    </div>
    </PageFrame>
  );
}

export function BasketsScreen() {
  const { openSheet } = useApp();
  const [audience, setAudience] = useState<"traders" | "investors">("traders");
  const [query, setQuery] = useState("");
  const rows = basketCatalog.filter((item) => {
    if (item.audience !== audience) return false;
    return item.title.toLowerCase().includes(query.trim().toLowerCase());
  });
  const openBasket = (title: string) => openSheet({
    kind: "quick",
    title,
    body: "This group reuses today’s prints with the same dates and definitions. Opening it does not buy kitta, and it is not a recommendation.",
    note: "Compare on Market if you want the underlying names.",
  });

  return (
    <PageFrame title="Baskets">
    <div className="home-you tab-feed">
      <FeedGroup label="Browse" tone="list">
        <div className="cluster">
          <div className="feed-kicker">
            <div>
              <p className="overline">Baskets</p>
              <p className="t-h-s">A few names, same session</p>
            </div>
          </div>
          <SearchField placeholder="Search for baskets" value={query} onChange={setQuery} />
          <div className="home-feed-tabs even" role="tablist" aria-label="Basket audience">
            <button type="button" role="tab" aria-selected={audience === "traders"} className={audience === "traders" ? "on" : ""} onClick={() => setAudience("traders")}>
              For traders
            </button>
            <button type="button" role="tab" aria-selected={audience === "investors"} className={audience === "investors" ? "on" : ""} onClick={() => setAudience("investors")}>
              For investors
            </button>
          </div>
          <p className="t-body-s muted">
            A basket is a way to look at several companies together. It is not a product you buy here.
          </p>
        </div>
      </FeedGroup>
      <FeedGroup label="Themes" tone="move">
        <div className="basket-grid">
          {rows.map((item) => (
            <button key={item.id} type="button" className="basket-tile" onClick={() => openBasket(item.title)}>
              {item.fresh && <span className="tile-badge">New</span>}
              <BasketMark id={item.id} />
              <strong>{item.title}</strong>
              <em>{item.count} names · <span className={item.changePct < 0 ? "c-down" : "c-up"}>{pct(item.changePct)}</span></em>
              <span className="tile-access">Open</span>
            </button>
          ))}
        </div>
        {rows.length === 0 && (
          <p className="t-body-s muted">No basket by that name in this set.</p>
        )}
        <button
          type="button"
          className="text-link"
          style={{ alignSelf: "flex-start" }}
          onClick={() => openSheet({
            kind: "quick",
            title: "Baskets are a view",
            body: "These groups reuse today’s prints. Joining a theme does not buy kitta. Compare on Market if you want the same dates and definitions.",
          })}
        >
          Why these groups?
        </button>
      </FeedGroup>
    </div>
    </PageFrame>
  );
}

export function HomeScreen() {
  return (
    <div className="home-screen">
      <HomeFeedStack />
      {/* <p className="disclaimer">Last session’s prints. We don’t place orders.</p> */}
    </div>
  );
}
