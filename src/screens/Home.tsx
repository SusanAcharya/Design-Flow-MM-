import { Children, useMemo, useState, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { ObjectiveHero } from "../ds/ObjectiveHero";
import { BookNudge } from "../ds/BookNudge";
import {
  Button,
  Chip,
  Delta,
  SearchField,
  SectionHead,
  StatTable,
} from "../ds/primitives";
import { AllocStrip, Sparkline, TapeSpark } from "../ds/charts";
import {
  allotments,
  basketCatalog,
  brokerHighlights,
  brokerTable,
  corporateActions,
  firedAlerts,
  happening,
  holdings,
  ipoPipeline,
  moverBoards,
  nepse,
  nepseSession,
  portfolio,
  secondaryBook,
  sectorAlloc,
  settlements,
  watchlist,
  type MoverRow,
} from "../lib/data";
import { npr, pct } from "../lib/format";
import { homeTabsFor, isBaseHome, isLearningHome, showsHoldings } from "../lib/stage";
import { useApp } from "../lib/state";

function Panel({ children, nested = false }: { children: ReactNode; nested?: boolean }) {
  return <div className={`home-panel${nested ? " nest-block" : ""}`}>{children}</div>;
}

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

function QuoteList({
  rows,
  onRow,
  spark = true,
}: {
  rows: { symbol: string; name: string; price: number; changePct: number }[];
  onRow: (symbol: string) => void;
  spark?: boolean;
}) {
  return (
    <div className={`quote-list${spark ? " has-spark" : ""}`}>
      {rows.map((row) => (
        <button
          key={row.symbol}
          type="button"
          className="quote-list-row"
          onClick={() => onRow(row.symbol)}
        >
          <span className="ticker-mark" aria-hidden>{row.symbol.slice(0, 2)}</span>
          <span className="quote-id">
            <span className="t-ticker">{row.symbol}</span>
            <small>{row.name}</small>
          </span>
          {spark && (
            <Sparkline changePct={row.changePct} seed={row.symbol} width={56} height={24} />
          )}
          <span className="quote-list-meta">
            <b>{npr(row.price, 2)}</b>
            <em className={row.changePct < 0 ? "c-down" : "c-up"}>{pct(row.changePct)}</em>
          </span>
        </button>
      ))}
    </div>
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
      <span className="nepse-stats">
        <span className="nepse-stat">
          <small>Turnover</small>
          <b>{npr(nepse.turnoverCr, 2)} Cr</b>
        </span>
        <span className="nepse-stat">
          <small>Volume</small>
          <b>{nepse.volume}</b>
        </span>
      </span>
    </button>
  );
}

function BookCard() {
  const { stage, go } = useApp();
  const value = stage === "value" ? portfolio.investorValue : stage === "secondary" ? secondaryBook.value : portfolio.value;
  const today = stage === "value" ? portfolio.investorToday : stage === "secondary" ? secondaryBook.today : portfolio.today;
  const down = today < 0;

  return (
    <button type="button" className="book-card" onClick={() => go("portfolio")}>
      <span className="book-card-head">
        <span>Your portfolio</span>
        <span className="book-card-open">Open ›</span>
      </span>
      <span className="book-card-figures">
        <b>Rs {npr(value)}</b>
        <em className={down ? "c-down" : "c-up"}>
          {down ? "−" : "+"}Rs {npr(Math.abs(today))}
        </em>
      </span>
      <AllocStrip rows={sectorAlloc} />
    </button>
  );
}

function HomeTop() {
  const { stage, go } = useApp();

  return (
    <div className="home-top">
      <NepseHero />
      {stage === "primary" ? (
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
      ) : stage !== "explorer" ? (
        <BookCard />
      ) : null}
    </div>
  );
}

function AddPortfolioCta() {
  const { go } = useApp();
  return (
    <BookNudge
      onPaste={() => go("holding", { holdingMode: "add" })}
      onType={() => go("holding", { holdingMode: "add" })}
    />
  );
}

function HoldingsModule({ force = false }: { force?: boolean }) {
  const { go, stage } = useApp();
  if (!force && !showsHoldings(stage)) return null;
  const rows = holdings.slice(0, 4);

  return (
      <QuoteList
        rows={rows.map((row) => ({
          symbol: row.symbol,
          name: `${row.kitta} kitta`,
          price: row.ltp,
          changePct: row.dayPct,
        }))}
        onRow={(symbol) => go("stock", { stock: symbol })}
      />
  );
}

function ObjectivesModule({ compact = false }: { compact?: boolean }) {
  const { stage } = useApp();
  return (
    <div className="home-learn">
      <ObjectiveHero compact={compact} />
      {stage === "primary" && allotments.map((a) => (
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
  );
}

function AlertsModule() {
  const { stage, go } = useApp();
  const rows: {
    key: string;
    tone: "up" | "down" | "warn" | "accent";
    symbol: string;
    title: string;
    at?: string;
  }[] = [];

  if (stage === "secondary" || stage === "base") {
    for (const s of settlements) {
      rows.push({
        key: `set-${s.symbol}`,
        tone: "warn",
        symbol: s.symbol,
        title: `${s.kitta} kitta · T+2`,
        at: "Today",
      });
    }
  }
  for (const a of firedAlerts) {
    if (rows.length >= 3) break;
    rows.push({
      key: a.symbol + a.at,
      tone: a.tone,
      symbol: a.symbol,
      title: a.text,
      at: a.at,
    });
  }
  for (const e of corporateActions) {
    if (rows.length >= 3) break;
    rows.push({
      key: e.title,
      tone: e.tone === "accent" ? "accent" : "warn",
      symbol: e.symbol,
      title: e.title,
    });
  }

  const shown = rows.slice(0, 3);
  if (shown.length === 0) return null;

  return (
    <div className="alert-board">
      {shown.map((row) => (
        <button key={row.key} type="button" className={`alert-card ${row.tone}`} onClick={() => go("alerts")}>
          <span className="ticker-mark sm" aria-hidden>{row.symbol.slice(0, 2)}</span>
          <span className="alert-card-line">
            <span className="t-ticker">{row.symbol}</span>
            <span>{row.title}</span>
          </span>
          {row.at && <time>{row.at}</time>}
        </button>
      ))}
    </div>
  );
}

function HappenTick({ stock, changePct }: { stock?: string; changePct?: number }) {
  if (!stock) return null;
  const down = (changePct ?? 0) < 0;
  return (
    <span className="happen-tick">
      <span className="ticker-mark sm">{stock.slice(0, 2)}</span>
      <b>{stock}</b>
      {changePct != null && <em className={down ? "c-down" : "c-up"}>{pct(changePct)}</em>}
    </span>
  );
}

function HappeningModule() {
  const { go } = useApp();
  const items = happening.slice(0, 3);
  const [lead, ...rest] = items;
  const open = (stock?: string) => (stock ? go("stock", { stock }) : go("market"));

  return (
    <div className="happen-board">
      <button type="button" className={`happen-lead ${lead.tone}`} onClick={() => open(lead.stock)}>
        <span className="happen-lead-top">
          <span className="happen-tag">{lead.tag}</span>
          <HappenTick stock={lead.stock} changePct={lead.changePct} />
        </span>
        <strong>{lead.title}</strong>
      </button>
      <div className="happen-grid">
        {rest.map((item) => (
          <button
            key={item.title}
            type="button"
            className={`happen-tile ${item.tone}`}
            onClick={() => open(item.stock)}
          >
            <span className="happen-tile-top">
              <span className="happen-tag">{item.tag}</span>
              {item.changePct != null && (
                <em className={item.changePct < 0 ? "c-down" : "c-up"}>{pct(item.changePct)}</em>
              )}
            </span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

const moverTabs: { id: keyof typeof moverBoards; label: string; extra: string }[] = [
  { id: "gainers", label: "Gainers", extra: "%" },
  { id: "losers", label: "Losers", extra: "%" },
  { id: "turnover", label: "Turnover", extra: "Cr" },
  { id: "volume", label: "Volume", extra: "kitta" },
  { id: "trades", label: "Transactions", extra: "txns" },
];

function MoversModule() {
  const { go } = useApp();
  const [tab, setTab] = useState<keyof typeof moverBoards>("gainers");
  const rows = moverBoards[tab].slice(0, 3);

  return (
    <Panel>
      <div className="mover-pills" role="tablist" aria-label="Mover boards">
        {moverTabs.map((item) => (
          <Chip key={item.id} selected={tab === item.id} onClick={() => setTab(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      <QuoteList
        rows={rows.map((row: MoverRow) => ({
          symbol: row.symbol,
          name: row.name,
          price: row.price,
          changePct: row.changePct,
        }))}
        onRow={(symbol) => go("stock", { stock: symbol })}
      />
    </Panel>
  );
}

function HomeFeedStack() {
  const { stage, go } = useApp();
  const base = isBaseHome(stage);
  const learning = isLearningHome(stage);
  const showAdd = base || stage === "explorer";

  return (
    <div className="home-you">
      <HomeTop />
      {showAdd && <AddPortfolioCta />}
      <FeedGroup label="Holdings" tone="list" action="Portfolio ›" onAction={() => go("portfolio")}>
        <HoldingsModule force={base} />
      </FeedGroup>
      <FeedGroup label="Learn" hideLabel tone="learn">
        {(base || learning) && <ObjectivesModule compact={stage === "primary" && !base} />}
      </FeedGroup>
      <FeedGroup label="What's happening" tone="news" action="Market ›" onAction={() => go("market")}>
        <HappeningModule />
      </FeedGroup>
      <FeedGroup label="Alerts" tone="alert" action="All ›" onAction={() => go("alerts")}>
        {(base || !learning) && <AlertsModule />}
      </FeedGroup>
      <FeedGroup label="Biggest moves" tone="move" action="Market ›" onAction={() => go("market")}>
        <MoversModule />
      </FeedGroup>
    </div>
  );
}

function WatchlistScreen() {
  const { go, openSheet, session } = useApp();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const up = watchlist.filter((row) => row.changePct > 0).length;
  const down = watchlist.filter((row) => row.changePct < 0).length;
  const leader = [...watchlist].sort((a, b) => b.changePct - a.changePct)[0];
  const laggard = [...watchlist].sort((a, b) => a.changePct - b.changePct)[0];
  const sectors = ["All", ...new Set(watchlist.map((row) => row.sector))];
  const rows = watchlist.filter((row) => {
    const hay = `${row.symbol} ${row.name}`.toLowerCase();
    const matchQuery = hay.includes(query.trim().toLowerCase());
    const matchSector = sector === "All" || row.sector === sector;
    return matchQuery && matchSector;
  });
  const groups = useMemo(() => {
    const map = new Map<string, typeof rows>();
    for (const item of rows) {
      const list = map.get(item.sector) ?? [];
      list.push(item);
      map.set(item.sector, list);
    }
    return [...map.entries()];
  }, [rows]);

  return (
    <div className="home-you tab-feed">
      <FeedGroup label="Overview" tone="list">
        <div className="cluster">
          <div className="feed-kicker">
            <div>
              <p className="overline">Watching</p>
              <p className="t-h-s">{watchlist.length} names · {session === "open" ? "live prints" : `as of ${nepse.closedAt}`}</p>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => openSheet({
                kind: "quick",
                title: "A watchlist is not a portfolio",
                body: "Following a company does not buy kitta. Adding one here never places an order.",
              })}
            >
              Edit ›
            </button>
          </div>
          <SearchField placeholder="Search this list" value={query} onChange={setQuery} />
          <StatTable
            columns={[
              { label: "Followed", value: watchlist.length },
              { label: "Up today", value: up, tone: "up" },
              { label: "Down today", value: down, tone: "down" },
            ]}
          />
          <div className="hl-grid">
            <button type="button" className="hl-card" onClick={() => go("stock", { stock: leader.symbol })}>
              <small>Leader today</small>
              <strong className="t-ticker">{leader.symbol}</strong>
              <em className="c-up">{pct(leader.changePct)} · {npr(leader.price, 2)}</em>
            </button>
            <button type="button" className="hl-card" onClick={() => go("stock", { stock: laggard.symbol })}>
              <small>Laggard today</small>
              <strong className="t-ticker">{laggard.symbol}</strong>
              <em className="c-down">{pct(laggard.changePct)} · {npr(laggard.price, 2)}</em>
            </button>
          </div>
          <div className="mover-pills" role="tablist" aria-label="Watchlist sectors">
            {sectors.map((item) => (
              <Chip key={item} selected={sector === item} onClick={() => setSector(item)}>{item}</Chip>
            ))}
          </div>
        </div>
      </FeedGroup>
      <FeedGroup label="By sector" tone="move">
        {groups.map(([name, list]) => (
          <Panel nested key={name}>
            <SectionHead title={name} />
            <QuoteList
              rows={list.map((row) => ({
                symbol: row.symbol,
                name: row.kitta ? `You hold ${row.kitta} kitta` : row.name,
                price: row.price,
                changePct: row.changePct,
              }))}
              onRow={(symbol) => go("stock", { stock: symbol })}
            />
          </Panel>
        ))}
        {rows.length === 0 && (
          <p className="t-body-s muted">Nothing on this list matches that search.</p>
        )}
      </FeedGroup>
      <FeedGroup label="Follow another" tone="book">
        <div className="cta-well">
          <p className="t-h-s">Add a name to this list</p>
          <p className="t-body-s muted">Search the tape. Following never buys kitta.</p>
          <Button variant="primary" size="md" onClick={() => go("search")}>Find a scrip</Button>
        </div>
      </FeedGroup>
    </div>
  );
}

function BrokersScreen() {
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
  );
}

function BasketsScreen() {
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
              <span className={`ico-soft ${item.tone}`}><Icon name={item.icon} size={18} /></span>
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
  );
}

export function HomeScreen() {
  const { homeFeed, setHomeFeed } = useApp();
  const tabs = homeTabsFor();

  return (
    <div className="home-screen">
      <div className="home-feed-bar">
        <div className="home-feed-tabs quad" role="tablist" aria-label="Home sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={homeFeed === tab.id}
              className={homeFeed === tab.id ? "on" : ""}
              onClick={() => setHomeFeed(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {homeFeed === "home" && <HomeFeedStack />}
      {homeFeed === "watchlist" && <WatchlistScreen />}
      {homeFeed === "brokers" && <BrokersScreen />}
      {homeFeed === "baskets" && <BasketsScreen />}
      <p className="disclaimer">Last session’s prints. We don’t place orders.</p>
    </div>
  );
}
