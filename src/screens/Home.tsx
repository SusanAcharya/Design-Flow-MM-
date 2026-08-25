import { Children, useMemo, useState, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { ObjectiveHero } from "../ds/ObjectiveHero";
import {
  Button,
  Chip,
  Delta,
  Figure,
  SearchField,
  SectionHead,
  StatTable,
} from "../ds/primitives";
import { SessionWalk, Sparkline } from "../ds/charts";
import {
  allotments,
  basketCatalog,
  bookTape,
  brokerHighlights,
  brokerTable,
  corporateActions,
  firedAlerts,
  happening,
  holdings,
  ipoPipeline,
  liveIpo,
  moverBoards,
  nepse,
  nepseSession,
  portfolio,
  secondaryBook,
  settlements,
  traderBook,
  watchlist,
  type MoverRow,
  type TapePrint,
} from "../lib/data";
import { npr, pct, signed } from "../lib/format";
import { getObjective } from "../lib/objectives";
import { homeTabsFor, isBaseHome, isLearningHome, showsHoldings } from "../lib/stage";
import { useApp } from "../lib/state";

function Panel({ children, nested = false }: { children: ReactNode; nested?: boolean }) {
  return <div className={`home-panel${nested ? " nest-block" : ""}`}>{children}</div>;
}

type FeedTone = "market" | "book" | "learn" | "news" | "alert" | "ipo" | "move" | "list";

function FeedGroup({
  label,
  action,
  onAction,
  tone = "list",
  children,
}: {
  label: string;
  action?: string;
  onAction?: () => void;
  tone?: FeedTone;
  children: ReactNode;
}) {
  const items = Children.toArray(children);
  if (items.length === 0) return null;
  const id = `feed-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section className="feed-group" data-tone={tone} aria-labelledby={id}>
      <header className="feed-group-head">
        <h2 id={id} className="feed-group-label">{label}</h2>
        {action && (
          <button type="button" className="text-link" onClick={onAction}>{action}</button>
        )}
      </header>
      <div className="feed-group-body">{items}</div>
    </section>
  );
}

function QuoteTable({
  rows,
  onRow,
  showReturn = false,
}: {
  rows: { symbol: string; name: string; price: number; changePct: number; returnPct?: number }[];
  onRow: (symbol: string) => void;
  showReturn?: boolean;
}) {
  return (
    <div className="sheet-wrap">
      <table className="sheet-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th className="spark-col"><span className="vh">Session path</span></th>
            <th className="num">Last</th>
            <th className="num">Today</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.symbol}
              tabIndex={0}
              onClick={() => onRow(row.symbol)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onRow(row.symbol);
                }
              }}
            >
              <td>
                <span className="t-ticker">{row.symbol}</span>
                <small>{row.name}</small>
              </td>
              <td className="spark-col">
                <Sparkline changePct={row.changePct} seed={row.symbol} width={56} height={24} />
              </td>
              <td className="num">{npr(row.price, 2)}</td>
              <td className="num">
                <b className={row.changePct < 0 ? "c-down" : "c-up"}>{pct(row.changePct)}</b>
                {showReturn && row.returnPct != null && (
                  <small className={row.returnPct < 0 ? "c-down" : "c-up"}>{pct(row.returnPct, 1)} all</small>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PulseModule() {
  const { session, go, flash } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [scrub, setScrub] = useState<TapePrint | null>(null);
  const total = nepse.rose + nepse.fell || 1;
  const shown = scrub?.v ?? nepse.value;
  const shownChange = shown - nepseSession.prevClose;
  const shownPct = nepseSession.prevClose ? (shownChange / nepseSession.prevClose) * 100 : 0;

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setUpdated(false);
    window.setTimeout(() => {
      setRefreshing(false);
      setUpdated(true);
      window.setTimeout(() => setUpdated(false), 480);
      flash({
        message: session === "open"
          ? "NEPSE prints updated."
          : "NEPSE is still the last session close.",
      });
    }, 1100);
  };

  return (
    <div className={`home-card home-card-chart${refreshing ? " is-refreshing" : ""}`}>
      <Figure
        kicker="NEPSE"
        value={shown}
        digits={2}
        amount={shownChange}
        pct={shownPct}
        loading={refreshing}
        updated={updated}
        note={refreshing
          ? "Updating last prints…"
          : scrub
            ? `At ${scrub.t}`
            : session === "open"
              ? `Live at ${nepse.liveAt} · ${nepse.date}`
              : `Closed at ${nepse.closedAt} · ${nepse.date}`}
        action={
          <button
            type="button"
            className={`refresh-btn${refreshing ? " is-loading" : ""}`}
            onClick={refresh}
            disabled={refreshing}
            aria-busy={refreshing}
            aria-label="Refresh NEPSE"
          >
            <Icon name="refresh" size={14} />
            {refreshing ? "Updating" : "Refresh"}
          </button>
        }
      />
      <SessionWalk
        tape={nepseSession}
        compact
        showVolume={false}
        onScrub={setScrub}
        onActivate={() => go("market")}
      />
      <div className="pulse-breadth">
        <div className="breadth-bar" aria-hidden>
          <i style={{ width: `${(nepse.rose / total) * 100}%` }} />
          <b style={{ width: `${(nepse.fell / total) * 100}%` }} />
        </div>
        <div className="breadth-legend">
          <span><strong className="c-up">{nepse.rose}</strong> up</span>
          <span><strong className="c-down">{nepse.fell}</strong> down</span>
        </div>
      </div>
    </div>
  );
}

function PortfolioBook() {
  const { stage, go } = useApp();
  const [scrub, setScrub] = useState<TapePrint | null>(null);
  if (stage === "primary") {
    return (
      <button type="button" className="book-block" onClick={() => go("portfolio")}>
        <Figure
          kicker="IPO pipeline"
          value={ipoPipeline.value}
          note={`${ipoPipeline.kitta} kitta across ${ipoPipeline.count} issues · par Rs 100`}
        />
      </button>
    );
  }

  const value = stage === "value" ? portfolio.investorValue : stage === "secondary" ? secondaryBook.value : portfolio.value;
  const today = stage === "value" ? portfolio.investorToday : stage === "secondary" ? secondaryBook.today : portfolio.today;
  const todayPct = stage === "value" ? portfolio.investorTodayPct : stage === "secondary" ? secondaryBook.todayPct : portfolio.todayPct;
  const overall = stage === "value" ? portfolio.investorOverall : stage === "secondary" ? secondaryBook.today : portfolio.unrealised;
  const cash = stage === "secondary" ? secondaryBook.cash : stage === "value" ? portfolio.investorCash : portfolio.cashNoted;

  const prev = value - today;
  const shown = scrub?.v ?? value;
  const shownChange = shown - prev;
  const shownPct = prev ? (shownChange / prev) * 100 : todayPct;

  return (
    <div
      className="book-block"
      role="link"
      tabIndex={0}
      onClick={() => go("portfolio")}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          go("portfolio");
        }
      }}
    >
      <Figure
        kicker="Your portfolio"
        value={shown}
        amount={shownChange}
        pct={shownPct}
        amountDigits={0}
        note={scrub ? `At ${scrub.t}` : `Today · valued at ${nepse.closedAt}`}
      />
      <SessionWalk tape={bookTape(value, today)} mark="columns" compact showVolume={false} onScrub={setScrub} />
      <StatTable
        columns={[
          { label: "Today", value: signed(today), tone: today < 0 ? "down" : "up" },
          { label: "Overall", value: signed(overall), tone: overall < 0 ? "down" : "up" },
          { label: "Cash noted", value: npr(cash) },
        ]}
      />
      {stage === "active" && (
        <p className="figure-note">Buying power {npr(traderBook.buyingPower)} · Margin {traderBook.marginUsed}%</p>
      )}
    </div>
  );
}

function AddPortfolioCta() {
  const { go } = useApp();
  return (
    <div className="cta-well">
      <p className="overline">Your next step</p>
      <p className="t-h-s">Start tracking what you own</p>
      <p className="t-body-s muted">
        Paste one broker message and MoneyMitra builds the rest — what you paid, what it is worth now.
      </p>
      <div className="btn-row">
        <Button variant="primary" size="md" onClick={() => go("holding", { holdingMode: "add" })}>
          Create a portfolio
        </Button>
        <Button variant="secondary" size="md" onClick={() => go("portfolio")}>
          Later
        </Button>
      </div>
    </div>
  );
}

function HoldingsModule({ force = false }: { force?: boolean }) {
  const { go, stage } = useApp();
  if (!force && !showsHoldings(stage)) return null;
  const rows = holdings.slice(0, 4);

  return (
    <QuoteTable
      rows={rows.map((row) => ({
        symbol: row.symbol,
        name: `${row.kitta} kitta · ${row.name}`,
        price: row.ltp,
        changePct: row.dayPct,
        returnPct: row.returnPct,
      }))}
      showReturn
      onRow={(symbol) => go("stock", { stock: symbol })}
    />
  );
}

function ObjectivesModule({ compact = false }: { compact?: boolean }) {
  const { stage, objectiveId } = useApp();
  const current = getObjective(objectiveId);
  return (
    <Panel>
      <ObjectiveHero compact={compact} />
      {current && (
        <p className="t-body-xs muted" style={{ marginTop: 10 }}>
          {current.tulkeyLine}
        </p>
      )}
      {stage === "primary" && allotments.map((a) => (
        <div key={a.name} className="row">
          <span className={`event-bar ${a.status === "allotted" ? "up" : "warn"}`} />
          <div className="row-main">
            <p className="t-h-s">
              {a.status === "allotted" ? "Allotted" : "Awaiting allotment"} · {a.name}
            </p>
            <p className="row-sub">
              {a.status === "allotted" ? `${a.kitta} kitta · check CDSC / MeroShare` : "Result not out yet"}
            </p>
          </div>
        </div>
      ))}
    </Panel>
  );
}

function AlertsModule() {
  const { stage, go } = useApp();
  return (
    <div className="alert-well">
      <p className="overline">Fired today</p>
      <p className="t-h-s">{firedAlerts.length} alerts</p>
      {(stage === "secondary" || stage === "base") && settlements.map((s) => (
        <div key={s.symbol} className="alert-item">
          <i className="warn" />
          <p><b>{s.kitta} kitta {s.symbol}</b> T+2 · {s.note}</p>
        </div>
      ))}
      {firedAlerts.map((a) => (
        <button key={a.symbol + a.at} type="button" className="alert-item" onClick={() => go("alerts")}>
          <i className={a.tone} />
          <p><b>{a.symbol}</b> {a.text}</p>
          <time>{a.at}</time>
        </button>
      ))}
      {corporateActions.slice(0, 1).map((e) => (
        <button key={e.title} type="button" className="alert-item" onClick={() => go("alerts")}>
          <i className={e.tone} />
          <p>{e.title}</p>
        </button>
      ))}
      <div className="btn-row" style={{ marginTop: 12 }}>
        <Button variant="primary" size="sm" onClick={() => go("alerts")}>Manage alerts</Button>
        <Button variant="secondary" size="sm" onClick={() => go("alerts")}>Dismiss</Button>
      </div>
    </div>
  );
}

function HappeningModule() {
  const { go } = useApp();
  const toneFor: Record<string, string> = {
    Corporate: "teal",
    Turnover: "saffron",
    Circuit: "warn",
    Sectors: "violet",
  };
  return (
    <div className="home-news">
      {happening.map((item) => (
        <button
          key={item.title}
          type="button"
          onClick={() => item.stock ? go("stock", { stock: item.stock }) : go("market")}
        >
          <span className={`happen-meta happen-${toneFor[item.tag] ?? "accent"}`}>{item.tag} · {item.time}</span>
          <strong>{item.title}</strong>
          <small>{item.dek}</small>
        </button>
      ))}
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
      <QuoteTable
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

function IpoModule() {
  const { go } = useApp();
  return (
    <Panel>
      <SectionHead title="Open IPO" action="All ›" onAction={() => go("ipo")} />
      <button type="button" className="ipo-compact" onClick={() => go("ipo")}>
        <span className="row-main">
          <strong>{liveIpo.name}</strong>
          <small>Rs {liveIpo.price} each · closes in {liveIpo.closesIn}</small>
        </span>
        <span className="chip">How to apply</span>
      </button>
    </Panel>
  );
}

function HomeFeedStack() {
  const { stage, go } = useApp();
  const base = isBaseHome(stage);
  const learning = isLearningHome(stage);
  const showBook = base || (stage !== "explorer");
  const showAdd = base || stage === "explorer";

  return (
    <div className="home-you">
      <FeedGroup label="Market" tone="market">
        <PulseModule />
      </FeedGroup>
      <FeedGroup label="Your book" tone="book">
        {showBook && <PortfolioBook />}
        {showAdd && <AddPortfolioCta />}
      </FeedGroup>
      <FeedGroup label="Holdings" tone="list" action="Portfolio ›" onAction={() => go("portfolio")}>
        <HoldingsModule force={base} />
      </FeedGroup>
      <FeedGroup label="Learn" tone="learn">
        {(base || learning) && <ObjectivesModule compact={stage === "primary" && !base} />}
      </FeedGroup>
      <FeedGroup label="What's happening" tone="news" action="Market ›" onAction={() => go("market")}>
        <HappeningModule />
      </FeedGroup>
      <FeedGroup label="Alerts" tone="alert">
        {(base || !learning) && <AlertsModule />}
      </FeedGroup>
      <FeedGroup label="IPO" tone="ipo">
        <IpoModule />
      </FeedGroup>
      <FeedGroup label="Movers" tone="move" action="Market ›" onAction={() => go("market")}>
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
              <p className="overline">Your watchlist</p>
              <p className="t-h-s">{watchlist.length} followed · {session === "open" ? "live prints" : `as of ${nepse.closedAt}`}</p>
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
            <QuoteTable
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
          <p className="t-h-s">Add a company to this list</p>
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
              <p className="t-h-s">Thematic groups · same session</p>
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
      <p className="disclaimer">Prices are from the last session. MoneyMitra does not place orders.</p>
    </div>
  );
}
