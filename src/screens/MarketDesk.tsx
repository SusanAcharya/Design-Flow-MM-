import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { BookTrend, SectorDonut, SessionWalk } from "../ds/charts";
import {
  BreadthBar,
  Chip,
  Explain,
  MovePill,
  SearchField,
} from "../ds/primitives";
import { TickerMark } from "../ds/TickerMark";
import {
  bookRangeTape,
  defaultDepthSymbols,
  depthBook,
  indexWeekRange,
  listedQuotes,
  liveSectorOrder,
  marketIndices,
  moverBoards,
  nepse,
  nepseCalendarMonths,
  nepseHistory,
  nepseSession,
  sectorPalette,
  sectors,
  weekMoverBoards,
  type ListedQuote,
} from "../lib/data";
import { changeFromPct, npr, pct, signed } from "../lib/format";
import { useApp } from "../lib/state";
import type { MarketDesk } from "../lib/types";

const titles: Record<MarketDesk, string> = {
  summary: "Market Summary",
  sectors: "Sector Summary",
  "week-change": "52 W change",
  live: "Live Market",
  price: "Stock price",
  movers: "Market movers",
  "gain-loss": "Gain and losses",
  "nepse-data": "NEPSE Data",
  indices: "Market indices",
  depth: "Market depth",
};

type RangePick = "1D" | "1W" | "1M" | "3M" | "1Y";
const indexRanges: RangePick[] = ["1D", "1W", "1M", "3M", "1Y"];

function DeskFrame({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const { back, viewport } = useApp();
  return (
    <div className="desk-screen">
      {viewport === "mobile" && (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={back} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>{title}</h1>
          {action}
        </div>
      )}
      {viewport === "web" && (
        <div className="desk-web-head">
          <button type="button" className="text-link web-back" onClick={back}>‹ Market</button>
          <div className="desk-web-title">
            <h1 className="t-h-xl">{title}</h1>
            {action}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

function DeskBlock({
  title,
  action,
  onAction,
  children,
}: {
  title?: string;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="market-block">
      {(title || action) && (
        <header className="market-block-head">
          {title ? <h2>{title}</h2> : <span />}
          {action && (
            <button type="button" className="text-link" onClick={onAction}>{action}</button>
          )}
        </header>
      )}
      <div className="market-block-body">{children}</div>
    </section>
  );
}

function parseArba(value: string) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function RangeTrack({ low, high, value }: { low: number; high: number; value: number }) {
  const pos = Math.max(2, Math.min(98, ((value - low) / (high - low || 1)) * 100));
  return (
    <div className="desk-range">
      <span>52W</span>
      <div className="desk-range-track" aria-hidden>
        <i style={{ left: `${Math.max(0, pos - 6)}%`, width: "12%" }} />
        <b style={{ left: `${pos}%` }} />
      </div>
      <em>{npr(low, 0)} – {npr(high, 0)}</em>
    </div>
  );
}

function quoteChange(row: ListedQuote) {
  return changeFromPct(row.ltp, row.changePct);
}

function SummaryDesk() {
  const { go, openSheet, session } = useApp();
  const [scrub, setScrub] = useState<(typeof nepseSession.prints)[number] | null>(null);
  const shown = scrub?.v ?? nepse.value;
  const shownChange = shown - nepseSession.prevClose;
  const shownPct = (shownChange / nepseSession.prevClose) * 100;
  const topGainer = moverBoards.gainers[0];
  const topLoser = moverBoards.losers[0];

  return (
    <>
      <p className="market-intro">
        Today’s session in one place. Figures are prints, not a recommendation.
      </p>
      <DeskBlock>
        <div className="desk-hero">
          <span className="market-hero-name">NEPSE Index</span>
          <div className="figure-line">
            <p className="hero-num">{npr(shown, 2)}</p>
            <MovePill amount={shownChange} pct={shownPct} />
          </div>
          <div className="market-live">
            {session === "open" && <span className="live-dot" />}
            <span>
              {scrub
                ? `At ${scrub.t}`
                : session === "open"
                  ? `Live · updated ${nepse.liveAt}, ${nepse.date}`
                  : `Market closed · last close ${nepse.closedAt}, ${nepse.date}`}
            </span>
          </div>
          <SessionWalk tape={nepseSession} compact showVolume={false} onScrub={setScrub} />
        </div>
        <div className="market-stats">
          <div><small>Turnover</small><b>{nepse.traded}</b></div>
          <div><small>Shares traded</small><b>{nepse.kitta} kitta</b></div>
          <div><small>Transactions</small><b>{npr(nepse.transactions)}</b></div>
        </div>
        <div className="pad" style={{ paddingTop: 14 }}>
          <BreadthBar rose={nepse.rose} fell={nepse.fell} unchanged={nepse.unchanged} />
        </div>
      </DeskBlock>
      <DeskBlock title="Extremes today">
        <div className="quote-list">
        <button type="button" className="quote-list-row" onClick={() => go("stock", { stock: topGainer.symbol })}>
          <TickerMark symbol={topGainer.symbol} />
          <span className="quote-id">
            <span className="t-ticker">{topGainer.symbol}</span>
            <small>Top gainer · {topGainer.name}</small>
          </span>
          <span className="quote-list-meta">
            <b>{npr(topGainer.price, 2)}</b>
            <em className="c-up">{pct(topGainer.changePct)}</em>
          </span>
        </button>
        <button type="button" className="quote-list-row" onClick={() => go("stock", { stock: topLoser.symbol })}>
          <TickerMark symbol={topLoser.symbol} />
          <span className="quote-id">
            <span className="t-ticker">{topLoser.symbol}</span>
            <small>Top loser · {topLoser.name}</small>
          </span>
          <span className="quote-list-meta">
            <b>{npr(topLoser.price, 2)}</b>
            <em className="c-down">{pct(topLoser.changePct)}</em>
          </span>
        </button>
        </div>
      </DeskBlock>
      <div className="market-helps">
        <Explain onClick={() => openSheet({
          kind: "quick",
          title: "What is market summary?",
          body: "A snapshot of the session: the index, how many names rose or fell, and how much rupee value traded.",
          note: "It describes what already happened. It does not tell you what to do next.",
        })}>
          What is this page?
        </Explain>
      </div>
    </>
  );
}

function SectorsDesk() {
  const { openSheet } = useApp();
  const [chartOn, setChartOn] = useState(true);
  const slices = useMemo(() => {
    const total = sectors.reduce((sum, row) => sum + parseArba(row.turnover), 0) || 1;
    return sectors.map((row) => ({
      name: row.name,
      pct: (parseArba(row.turnover) / total) * 100,
      color: sectorPalette[row.name] ?? "var(--text-tertiary)",
      row,
    }));
  }, []);

  return (
    <>
      <div className="desk-toolbar">
        <p className="t-body-s muted">Turnover share by sector · {nepse.date}</p>
        <button
          type="button"
          className={`icon-btn header-icon ${chartOn ? "on" : ""}`}
          aria-label={chartOn ? "Hide chart" : "Show chart"}
          onClick={() => setChartOn((value) => !value)}
        >
          <Icon name="pie" size={18} />
        </button>
      </div>
      {chartOn && (
        <DeskBlock title="Sector chart">
          <div className="desk-sector-chart">
            <SectorDonut rows={slices} size={168} label={`${slices[0]?.pct.toFixed(0)}%`} sub={slices[0]?.name} />
            <ul className="sector-legend">
              {slices.map((slice) => (
                <li key={slice.name}>
                  <i style={{ background: slice.color }} />
                  <span>{slice.name}</span>
                  <b>{slice.pct.toFixed(2)}%</b>
                </li>
              ))}
            </ul>
          </div>
        </DeskBlock>
      )}
      <div className="sector-cards">
        {slices.map((slice) => (
          <article key={slice.row.name} className="sector-card">
            <header>
              <span className={`ticker-mark sm ${slice.row.changePct < 0 ? "down" : "up"}`}>
                {slice.row.name.slice(0, 2).toUpperCase()}
              </span>
              <h3>{slice.row.name}</h3>
              <b className={slice.row.changePct < 0 ? "c-down" : "c-up"}>{pct(slice.row.changePct)}</b>
            </header>
            <div className="kv"><span>Index (LTP)</span><b>{npr(slice.row.ltp, 1)}</b></div>
            <div className="kv"><span>Total volume</span><b>{slice.row.volume}</b></div>
            <div className="kv"><span>Turnover</span><b>{slice.row.turnover}</b></div>
            <div className="kv"><span>Rose / fell</span><b>{slice.row.rose} / {slice.row.fell}</b></div>
          </article>
        ))}
      </div>
      <div className="market-helps">
        <Explain onClick={() => openSheet({
          kind: "quick",
          title: "What is a sector index?",
          body: "A sector index is a weighted average of companies in one line of business. The chart here splits today’s turnover, not market cap.",
        })}>
          What is a sector index?
        </Explain>
      </div>
    </>
  );
}

function WeekChangeDesk() {
  const { go } = useApp();
  const [side, setSide] = useState<"high" | "low">("high");
  const rows = useMemo(() => {
    const nepseRow = {
      symbol: indexWeekRange.symbol,
      name: indexWeekRange.name,
      ltp: indexWeekRange.ltp,
      weekHigh: indexWeekRange.weekHigh,
      weekLow: indexWeekRange.weekLow,
      isIndex: true,
    };
    const body = listedQuotes.map((row) => ({
      symbol: row.symbol,
      name: row.name,
      ltp: row.ltp,
      weekHigh: row.weekHigh,
      weekLow: row.weekLow,
      isIndex: false,
    }));
    const all = [nepseRow, ...body];
    return all
      .map((row) => {
        const offHigh = row.ltp - row.weekHigh;
        const offHighPct = (offHigh / row.weekHigh) * 100;
        const offLow = row.ltp - row.weekLow;
        const offLowPct = (offLow / row.weekLow) * 100;
        return { ...row, offHigh, offHighPct, offLow, offLowPct };
      })
      .sort((a, b) => (side === "high" ? a.offHighPct - b.offHighPct : b.offLowPct - a.offLowPct));
  }, [side]);

  return (
    <>
      <div className="desk-tabs pad">
        <div className="home-feed-tabs even" role="tablist" aria-label="52-week side">
          <button type="button" role="tab" aria-selected={side === "high"} className={side === "high" ? "on" : ""} onClick={() => setSide("high")}>
            52 Week High
          </button>
          <button type="button" role="tab" aria-selected={side === "low"} className={side === "low" ? "on" : ""} onClick={() => setSide("low")}>
            52 Week Low
          </button>
        </div>
      </div>
      <DeskBlock>
        <div className="sheet-wrap market-table">
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th className="num">LTP</th>
                <th className="num">{side === "high" ? "52W High" : "52W Low"}</th>
                <th className="num">{side === "high" ? "Off high" : "Off low"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.symbol}
                  onClick={() => {
                    if (!row.isIndex) go("stock", { stock: row.symbol });
                  }}
                >
                  <td>
                    <span className="t-ticker">{row.symbol}</span>
                    <small>{row.name}</small>
                  </td>
                  <td className="num">{npr(row.ltp, 1)}</td>
                  <td className="num">{npr(side === "high" ? row.weekHigh : row.weekLow, 1)}</td>
                  <td className={`num ${side === "high" ? "c-down" : "c-up"} desk-off`}>
                    {side === "high"
                      ? `Below ${signed(row.offHigh, 0)} (${pct(row.offHighPct, 0)})`
                      : `Above ${signed(row.offLow, 0)} (${pct(row.offLowPct, 0)})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DeskBlock>
      <p className="market-intro">
        Distance from a 52-week print is a fact about the range, not a target or a cue.
      </p>
    </>
  );
}

function LiveDesk() {
  const { go, flash, session } = useApp();
  const [sector, setSector] = useState<(typeof liveSectorOrder)[number]>("All");
  const [direction, setDirection] = useState<"all" | "up" | "down" | "flat">("all");
  const [sectorOpen, setSectorOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const sectorsPresent = useMemo(() => {
    const present = new Set(listedQuotes.map((row) => row.sector));
    return liveSectorOrder.filter((item) => item === "All" || present.has(item));
  }, []);
  const inSector = listedQuotes.filter((row) => sector === "All" || row.sector === sector);
  const rose = inSector.filter((row) => row.changePct > 0).length;
  const fell = inSector.filter((row) => row.changePct < 0).length;
  const unchanged = inSector.filter((row) => row.changePct === 0).length;
  const rows = inSector.filter((row) => {
    if (direction === "up") return row.changePct > 0;
    if (direction === "down") return row.changePct < 0;
    if (direction === "flat") return row.changePct === 0;
    return true;
  });
  const sectorLabel = sector === "All" ? "All sectors" : sector;

  useEffect(() => {
    if (!sectorOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!dropRef.current?.contains(event.target as Node)) setSectorOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSectorOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [sectorOpen]);

  return (
    <>
      <div className="desk-toolbar">
        <div>
          <p className="t-body-s muted">As of {nepse.date}</p>
          <span className={`time-pill ${session === "open" ? "live" : ""}`}>
            {session === "open" ? nepse.liveAt : nepse.closedAt}
          </span>
        </div>
        <div className="desk-toolbar-actions">
          <button
            type="button"
            className="icon-btn header-icon"
            aria-label="Refresh"
            onClick={() => flash({ message: "Prints on this page are the last session snapshot." })}
          >
            <Icon name="refresh" size={18} />
          </button>
        </div>
      </div>
      <div className={`desk-drop ${sectorOpen ? "open" : ""}`} ref={dropRef}>
        <button
          type="button"
          className="desk-drop-btn"
          aria-haspopup="listbox"
          aria-expanded={sectorOpen}
          aria-label="Filter by sector"
          onClick={() => setSectorOpen((value) => !value)}
        >
          <span>{sectorLabel}</span>
          <em className="desk-drop-chev" aria-hidden>
            <Icon name="chev" size={12} />
          </em>
        </button>
        {sectorOpen && (
          <ul className="desk-drop-menu" role="listbox" aria-label="Sectors">
            {sectorsPresent.map((item) => {
              const label = item === "All" ? "All sectors" : item;
              return (
                <li key={item}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sector === item}
                    className={sector === item ? "on" : ""}
                    onClick={() => {
                      setSector(item);
                      setSectorOpen(false);
                    }}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="desk-adv-bar" aria-label="Market breadth" data-filter={direction}>
        <button
          type="button"
          className={`up ${direction === "up" ? "on" : ""}`}
          style={{ flexGrow: Math.max(rose, 1) }}
          onClick={() => setDirection(direction === "up" ? "all" : "up")}
        >
          Rose {rose}
        </button>
        <button
          type="button"
          className={`down ${direction === "down" ? "on" : ""}`}
          style={{ flexGrow: Math.max(fell, 1) }}
          onClick={() => setDirection(direction === "down" ? "all" : "down")}
        >
          Fell {fell}
        </button>
        <button
          type="button"
          className={`flat ${direction === "flat" ? "on" : ""}`}
          style={{ flexGrow: Math.max(unchanged, 1) }}
          onClick={() => setDirection(direction === "flat" ? "all" : "flat")}
        >
          Unc {unchanged}
        </button>
      </div>
      <DeskBlock>
        <div className="desk-live-scroll">
          <table className="sheet-table desk-live-grid">
            <thead>
              <tr>
                <th>Symbol</th>
                <th className="num">Open</th>
                <th className="num">Close</th>
                <th className="num">High</th>
                <th className="num">Low</th>
                <th className="num">% Chg</th>
                <th className="num">P.Close</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.symbol}
                  className={row.changePct < 0 ? "desk-row-down" : row.changePct > 0 ? "desk-row-up" : ""}
                  onClick={() => go("stock", { stock: row.symbol })}
                >
                  <td className="t-ticker">{row.symbol}</td>
                  <td className="num">{npr(row.open, 1)}</td>
                  <td className="num">{npr(row.ltp, 1)}</td>
                  <td className="num">{npr(row.high, 1)}</td>
                  <td className="num">{npr(row.low, 1)}</td>
                  <td className={`num ${row.changePct < 0 ? "c-down" : row.changePct > 0 ? "c-up" : ""}`}>
                    {pct(row.changePct)}
                  </td>
                  <td className="num">{npr(row.prev, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DeskBlock>
      {rows.length === 0 && (
        <p className="market-intro">Nothing in {sector === "All" ? "this view" : sector} for that filter.</p>
      )}
    </>
  );
}

function PriceDesk() {
  const { go } = useApp();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const rows = listedQuotes.filter((row) => {
    if (!q) return true;
    return `${row.symbol} ${row.name} ${row.sector}`.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="pad" style={{ paddingTop: 8, paddingBottom: 4 }}>
        <SearchField placeholder="Symbol or company" value={query} onChange={setQuery} />
      </div>
      <p className="market-intro">Last traded prices from this session. Tap a name to open it.</p>
      <DeskBlock>
        <div className="sheet-wrap market-table">
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th className="num">LTP</th>
                <th className="num">High</th>
                <th className="num">Low</th>
                <th className="num">% Chg</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.symbol} onClick={() => go("stock", { stock: row.symbol })}>
                  <td>
                    <span className="sheet-name">
                      <TickerMark symbol={row.symbol} size="sm" />
                      <span>
                        {row.symbol}
                        <small>{row.name}</small>
                      </span>
                    </span>
                  </td>
                  <td className="num">{npr(row.ltp, 2)}</td>
                  <td className="num">{npr(row.high, 1)}</td>
                  <td className="num">{npr(row.low, 1)}</td>
                  <td className={`num ${row.changePct < 0 ? "c-down" : row.changePct > 0 ? "c-up" : ""}`}>{pct(row.changePct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DeskBlock>
      {rows.length === 0 && (
        <p className="market-intro">Nothing matches “{query.trim()}”.</p>
      )}
    </>
  );
}

function MoversDesk() {
  const { go } = useApp();
  const [view, setView] = useState<keyof typeof moverBoards>("gainers");
  const extraLabel =
    view === "turnover" ? "Turnover"
      : view === "volume" ? "Volume"
        : view === "trades" ? "Trades"
          : "Note";

  return (
    <>
      <p className="market-intro">Biggest moves and busiest names today. A jump is a fact, not a cue to chase it.</p>
      <div className="market-filters">
        {([
          ["gainers", "Gainers"],
          ["losers", "Losers"],
          ["turnover", "Turnover"],
          ["volume", "Volume"],
          ["trades", "Transactions"],
        ] as const).map(([id, label]) => (
          <Chip key={id} selected={view === id} onClick={() => setView(id)}>{label}</Chip>
        ))}
      </div>
      <DeskBlock>
        <div className="sheet-wrap market-table">
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th className="num">LTP</th>
                <th className="num">% Chg</th>
                <th className="num">{extraLabel}</th>
              </tr>
            </thead>
            <tbody>
              {moverBoards[view].map((row) => (
                <tr key={row.symbol} onClick={() => go("stock", { stock: row.symbol })}>
                  <td>
                    <span className="sheet-name">
                      <TickerMark symbol={row.symbol} size="sm" />
                      <span>
                        {row.symbol}
                        <small>{row.name}</small>
                      </span>
                    </span>
                  </td>
                  <td className="num">{npr(row.price, 2)}</td>
                  <td className={`num ${row.changePct < 0 ? "c-down" : "c-up"}`}>{pct(row.changePct)}</td>
                  <td className="num muted-num">{row.extra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DeskBlock>
    </>
  );
}

function GainLossDesk() {
  const { go } = useApp();
  const [side, setSide] = useState<"gainers" | "losers">("gainers");
  const [period, setPeriod] = useState<"1D" | "1W">("1D");
  const rows = period === "1D" ? moverBoards[side] : weekMoverBoards[side];

  return (
    <>
      <div className="desk-tabs pad">
        <div className="home-feed-tabs even" role="tablist" aria-label="Gainers or losers">
          <button type="button" role="tab" aria-selected={side === "gainers"} className={side === "gainers" ? "on" : ""} onClick={() => setSide("gainers")}>
            Top gainer
          </button>
          <button type="button" role="tab" aria-selected={side === "losers"} className={side === "losers" ? "on" : ""} onClick={() => setSide("losers")}>
            Top loser
          </button>
        </div>
        <div className="home-feed-tabs even" role="tablist" aria-label="Window">
          <button type="button" role="tab" aria-selected={period === "1D"} className={period === "1D" ? "on" : ""} onClick={() => setPeriod("1D")}>
            1 Day
          </button>
          <button type="button" role="tab" aria-selected={period === "1W"} className={period === "1W" ? "on" : ""} onClick={() => setPeriod("1W")}>
            1 Week
          </button>
        </div>
      </div>
      <DeskBlock>
        <div className="sheet-wrap market-table">
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th className="num">LTP</th>
                <th className="num">Chg.</th>
                <th className="num">% Chg</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const change = changeFromPct(row.price, row.changePct);
                return (
                  <tr key={row.symbol} onClick={() => go("stock", { stock: row.symbol })}>
                    <td className="t-ticker">{row.symbol}</td>
                    <td className="num">{npr(row.price, 2)}</td>
                    <td className={`num ${row.changePct < 0 ? "c-down" : "c-up"}`}>{signed(change, 1)}</td>
                    <td className={`num ${row.changePct < 0 ? "c-down" : "c-up"}`}>{pct(row.changePct)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DeskBlock>
      <p className="market-intro">
        {period === "1D"
          ? "Today’s largest percentage moves. A circuit is a trading rule, not a verdict."
          : "Largest percentage moves across the last five sessions. Same names, a longer window."}
      </p>
    </>
  );
}

function NepseDataDesk() {
  const { openSheet } = useApp();
  const [picked, setPicked] = useState(nepseHistory[0].date);
  const [calOpen, setCalOpen] = useState(false);
  const [monthId, setMonthId] = useState(nepseCalendarMonths[0].id);
  const month = nepseCalendarMonths.find((item) => item.id === monthId) ?? nepseCalendarMonths[0];
  const day = nepseHistory.find((item) => item.date === picked) ?? nepseHistory[0];
  const sessionByDay = useMemo(() => {
    const map = new Map<string, (typeof nepseHistory)[number]>();
    nepseHistory.forEach((item) => {
      if (item.month === month.month) map.set(String(item.day), item);
    });
    return map;
  }, [month.month]);
  const facts = [
    ["Index close", npr(day.close, 2)],
    ["Point change", signed(day.change, 2)],
    ["Percent change", pct(day.changePct)],
    ["Open", npr(day.open, 2)],
    ["High", npr(day.high, 2)],
    ["Low", npr(day.low, 2)],
    ["Turnover", day.turnover],
    ["Volume", day.volume],
    ["Kitta traded", day.kitta],
    ["Transactions", npr(day.transactions)],
    ["Companies traded", String(day.companies)],
    ["Rose", String(day.rose)],
    ["Fell", String(day.fell)],
    ["Unchanged", String(day.unchanged)],
  ];
  const blanks = Array.from({ length: month.startWeekday }, (_, i) => i);
  const cells = Array.from({ length: month.days }, (_, i) => i + 1);

  return (
    <>
      <div className="desk-toolbar">
        <div>
          <p className="t-body-s muted">Published session</p>
          <p className="t-h-s">{day.date}</p>
        </div>
        <button
          type="button"
          className={`chip ${calOpen ? "chip-on" : ""}`}
          aria-expanded={calOpen}
          onClick={() => setCalOpen((value) => !value)}
        >
          <Icon name="cal" size={14} /> Calendar
        </button>
      </div>
      {calOpen && (
        <DeskBlock title={month.label}>
          <div className="desk-cal-nav">
            <button
              type="button"
              className="text-link"
              disabled={monthId === "shrawan"}
              onClick={() => setMonthId("shrawan")}
            >
              ‹ Shrawan
            </button>
            <button
              type="button"
              className="text-link"
              disabled={monthId === "bhadra"}
              onClick={() => setMonthId("bhadra")}
            >
              Bhadra ›
            </button>
          </div>
          <div className="desk-cal">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((label) => (
              <span key={label} className="desk-cal-dow">{label}</span>
            ))}
            {blanks.map((blank) => <span key={`b-${blank}`} />)}
            {cells.map((num) => {
              const hit = sessionByDay.get(String(num));
              const closed = (month.startWeekday + num - 1) % 7 === 6;
              return (
                <button
                  key={num}
                  type="button"
                  className={`desk-cal-day ${hit ? "session" : ""} ${hit?.date === picked ? "on" : ""} ${closed && !hit ? "off" : ""}`}
                  disabled={!hit}
                  onClick={() => hit && setPicked(hit.date)}
                >
                  {num}
                </button>
              );
            })}
          </div>
          <p className="desk-cal-note">Session days only. Saturday is closed.</p>
        </DeskBlock>
      )}
      <DeskBlock title={`NEPSE · ${day.date}`}>
        {facts.map(([label, value]) => (
          <div className="kv" key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </DeskBlock>
      <DeskBlock title="Recent sessions">
        <div className="desk-live-scroll">
          <table className="sheet-table desk-live-grid desk-history-grid">
            <thead>
              <tr>
                <th>Date</th>
                <th className="num">Close</th>
                <th className="num">% Chg</th>
                <th className="num">Turnover</th>
                <th className="num">Rose / fell</th>
              </tr>
            </thead>
            <tbody>
              {nepseHistory.map((row) => (
                <tr
                  key={row.date}
                  className={row.date === picked ? "desk-row-on" : ""}
                  onClick={() => {
                    setPicked(row.date);
                    setMonthId(row.month === "Bhadra" ? "bhadra" : "shrawan");
                  }}
                >
                  <td>{row.date.replace(` ${row.year}`, "")}</td>
                  <td className="num">{npr(row.close, 2)}</td>
                  <td className={`num ${row.changePct < 0 ? "c-down" : "c-up"}`}>{pct(row.changePct)}</td>
                  <td className="num">{row.turnover}</td>
                  <td className="num">{row.rose} / {row.fell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DeskBlock>
      <div className="market-helps">
        <Explain onClick={() => openSheet({
          kind: "quick",
          title: "Where does this come from?",
          body: "Each row is a published session close. Pick a date on the calendar to read that day’s index, turnover and breadth.",
          note: "Published figures, not a recommendation.",
        })}>
          Where does this come from?
        </Explain>
      </div>
    </>
  );
}

function IndicesDesk() {
  const { openSheet, marketIndex, setMarketIndex } = useApp();
  const [range, setRange] = useState<RangePick>("1Y");
  const index = marketIndices.find((item) => item.id === marketIndex) ?? marketIndices[0];
  const tape = bookRangeTape(index.value, index.change, index.change * 18, range);

  return (
    <>
      <DeskBlock>
        <div className="desk-index-chart">
          <p className="desk-chart-kicker">{index.label} chart</p>
          <BookTrend tape={tape} />
          <div className="stock-ranges desk-ranges">
            {indexRanges.map((item) => (
              <Chip key={item} selected={range === item} onClick={() => setRange(item)}>
                {item}
              </Chip>
            ))}
          </div>
        </div>
      </DeskBlock>
      <DeskBlock>
        <div className="sheet-wrap market-table">
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Index</th>
                <th className="num">Open</th>
                <th className="num">Close</th>
                <th className="num">% Chg</th>
                <th className="num">Turnover</th>
              </tr>
            </thead>
            <tbody>
              {marketIndices.map((item) => (
                <tr
                  key={item.id}
                  className={item.id === index.id ? "desk-row-on" : ""}
                  onClick={() => setMarketIndex(item.id)}
                >
                  <td className="t-ticker">{item.label.replace(" Index", "")}</td>
                  <td className="num">{npr(item.open, 2)}</td>
                  <td className="num">{npr(item.value, 2)}</td>
                  <td className={`num ${item.changePct < 0 ? "c-down" : "c-up"}`}>{pct(item.changePct)}</td>
                  <td className="num">{item.turnover}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DeskBlock>
      <div className="market-helps">
        <Explain onClick={() => openSheet({
          kind: "quick",
          title: index.label,
          body: index.body,
          note: "An index is a picture of a group. It is not a price you can buy.",
        })}>
          What is {index.label}?
        </Explain>
      </div>
    </>
  );
}

function DepthDesk() {
  const { go, flash, session, openSheet } = useApp();
  const [picked, setPicked] = useState<string[]>(defaultDepthSymbols);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const cards = picked
    .map((symbol) => listedQuotes.find((row) => row.symbol === symbol))
    .filter((row): row is ListedQuote => Boolean(row));
  const q = query.trim().toLowerCase();
  const extras = listedQuotes.filter((row) => {
    if (picked.includes(row.symbol)) return false;
    if (!q) return true;
    return `${row.symbol} ${row.name} ${row.sector}`.toLowerCase().includes(q);
  });

  const add = (symbol: string) => {
    setPicked((current) => (current.includes(symbol) ? current : [...current, symbol]));
    setAdding(false);
    setQuery("");
  };

  return (
    <>
      <div className="desk-toolbar">
        <span className={`time-pill ${session === "open" ? "live" : ""}`}>
          {session === "open" ? "Market open" : "Market closed"}
        </span>
        <div className="desk-toolbar-actions">
          <button
            type="button"
            className="icon-btn header-icon"
            aria-label="Refresh"
            onClick={() => flash({ message: session === "open" ? "Depth would refresh during trading hours." : "Market is closed — depth does not move after 3:00 PM." })}
          >
            <Icon name="refresh" size={18} />
          </button>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setAdding((value) => !value);
              setQuery("");
            }}
          >
            {adding ? "Done" : "+ Add"}
          </button>
        </div>
      </div>
      {adding && (
        <DeskBlock title="Add a name">
          <div className="desk-depth-search">
            <SearchField placeholder="Search symbol or company" value={query} onChange={setQuery} autoFocus />
          </div>
          {extras.length === 0 ? (
            <p className="market-intro" style={{ paddingLeft: 14, paddingRight: 14 }}>
              {q ? `Nothing matches “${query.trim()}”.` : "Every name in this set is already on the list."}
            </p>
          ) : (
            extras.slice(0, 10).map((row) => (
              <button key={row.symbol} type="button" className="row" onClick={() => add(row.symbol)}>
                <div className="row-main">
                  <p className="t-h-s">{row.symbol}</p>
                  <p className="row-sub">{row.name} · {row.sector}</p>
                </div>
                <span className="text-link">Add ›</span>
              </button>
            ))
          )}
        </DeskBlock>
      )}
      <div className="depth-cards">
        {cards.map((row) => {
          const book = depthBook(row.ltp);
          const change = quoteChange(row);
          return (
            <article key={row.symbol} className="depth-card">
              <header>
                <button type="button" className="depth-id" onClick={() => go("stock", { stock: row.symbol })}>
                  <strong>{row.symbol}</strong>
                  <small>{row.name}</small>
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Remove ${row.symbol}`}
                  onClick={() =>
                    openSheet({
                      kind: "confirm",
                      title: `Remove ${row.symbol}?`,
                      body: `${row.name} leaves this list. You can add it again from + Add.`,
                      confirmLabel: "Remove",
                      cancelLabel: "Keep",
                      danger: true,
                      onConfirm: () => {
                        setPicked((current) => current.filter((item) => item !== row.symbol));
                        flash({ message: `${row.symbol} left this list.` });
                      },
                    })
                  }
                >
                  <Icon name="close" size={14} />
                </button>
              </header>
              <div className="depth-price">
                <div>
                  <b>{npr(row.ltp, 2)}</b>
                  <em className={row.changePct < 0 ? "c-down" : "c-up"}>{pct(row.changePct)}</em>
                </div>
                <span>
                  <small>Day</small>
                  {npr(row.low, 2)} – {npr(row.high, 2)}
                </span>
              </div>
              <RangeTrack low={row.weekLow} high={row.weekHigh} value={row.ltp} />
              {session === "open" ? (
                <div className="depth-book">
                  <div>
                    <small>Bid</small>
                    {book.bids.slice(0, 3).map((level) => (
                      <span key={level.price}>{npr(level.price, 2)} · {npr(level.kitta)}</span>
                    ))}
                  </div>
                  <div>
                    <small>Ask</small>
                    {book.asks.slice(0, 3).map((level) => (
                      <span key={level.price}>{npr(level.price, 2)} · {npr(level.kitta)}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="depth-note">Market is closed — depth refreshes only during trading hours. Last move {signed(change, 2)}.</p>
              )}
            </article>
          );
        })}
      </div>
      {cards.length === 0 && (
        <p className="market-intro">Add a name to watch bid and ask together. This is not the live order book after close.</p>
      )}
    </>
  );
}

const desks: Record<MarketDesk, () => ReactNode> = {
  summary: () => <SummaryDesk />,
  sectors: () => <SectorsDesk />,
  "week-change": () => <WeekChangeDesk />,
  live: () => <LiveDesk />,
  price: () => <PriceDesk />,
  movers: () => <MoversDesk />,
  "gain-loss": () => <GainLossDesk />,
  "nepse-data": () => <NepseDataDesk />,
  indices: () => <IndicesDesk />,
  depth: () => <DepthDesk />,
};

export function MarketDeskScreen() {
  const { marketDesk } = useApp();
  const Screen = desks[marketDesk] ?? desks.summary;
  return <DeskFrame title={titles[marketDesk]}>{Screen()}</DeskFrame>;
}
