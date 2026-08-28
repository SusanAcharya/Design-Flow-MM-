import { useMemo, useState } from "react";
import { Icon } from "../ds/Icon";
import { Badge, Button, Chip, Explain, MovePill, Overline } from "../ds/primitives";
import { SessionWalk } from "../ds/charts";
import { MetricLink } from "../shell/Overlays";
import { TickerMark } from "../ds/TickerMark";
import { GreedMeter } from "../ds/GreedMeter";
import {
  nabil,
  nabilAnalysis,
  nabilCompany,
  nabilEvents,
  nabilFinancials,
  nabilFloor,
  nabilMonth,
  nabilSessionTicks,
  nabilWeek,
  nabilYear,
  nepse,
  stockTake,
  type Tape,
  type TapePrint,
} from "../lib/data";
import { npr, pct, signed } from "../lib/format";
import { useApp } from "../lib/state";
import type { IconName } from "../ds/Icon";
import type { MarketDesk, Route, StockTab } from "../lib/types";

/* Drawn inline rather than through <Icon>, because this one fills when it is on
   and a CSS mask cannot switch fill. Same Lucide bookmark path and weight. */
function StarMark({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden
      fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

type CompanyMenu = {
  label: string;
  icon: IconName;
  tab?: StockTab;
  desk?: MarketDesk;
  route?: Route;
  sheet?: "compare" | "depth";
};

/* The same jumps the company menu offers, on the page instead of behind a tap. */
const companyMenus: CompanyMenu[] = [
  { label: "Market depth", icon: "depth", desk: "depth" },
  { label: "Floor sheet", icon: "table", tab: "Floor sheet" },
  { label: "Broker holding", icon: "building", route: "brokers" },
  { label: "Price history", icon: "candles", desk: "price" },
  { label: "Dividend", icon: "coins", tab: "Events" },
  { label: "Fundamentals", icon: "doc", tab: "Financials" },
  { label: "Share holding", icon: "pie", tab: "Financials" },
  { label: "Technicals", icon: "pulse", tab: "Analysis" },
  { label: "Announcements", icon: "megaphone", tab: "Events" },
  { label: "AGM history", icon: "cal", tab: "Events" },
  { label: "Compare", icon: "compare", sheet: "compare" },
  { label: "Reports", icon: "clipboard", route: "learn" },
];

const ranges = ["1D", "1W", "1M", "3M", "1Y"] as const;
const tabs: StockTab[] = ["Overview", "Financials", "Analysis", "Floor sheet", "Events"];
type Range = (typeof ranges)[number];

function CandleChart({ tape }: { tape: Tape }) {
  const candles = useMemo(() => tape.prints.map((point, index) => {
    const open = index === 0 ? tape.open : tape.prints[index - 1].v;
    const close = point.v;
    const spread = Math.max(1.4, Math.abs(close - open) * 0.38);
    return {
      open,
      close,
      high: Math.max(open, close) + spread,
      low: Math.min(open, close) - spread,
      volume: point.vol ?? 20 + ((index * 17) % 42),
    };
  }), [tape]);
  const high = Math.max(...candles.map((item) => item.high));
  const low = Math.min(...candles.map((item) => item.low));
  const maxVolume = Math.max(...candles.map((item) => item.volume), 1);
  const y = (value: number) => 8 + ((high - value) / (high - low || 1)) * 114;
  const step = 360 / candles.length;

  return (
    <div className="candle-stage" aria-label="Candlestick chart">
      <svg viewBox="0 0 360 158" role="img">
        {candles.map((item, index) => {
          const x = index * step + step / 2;
          const up = item.close >= item.open;
          const top = y(Math.max(item.open, item.close));
          const bottom = y(Math.min(item.open, item.close));
          const color = up ? "var(--up-base)" : "var(--down-base)";
          return (
            <g key={x}>
              <line x1={x} y1={y(item.high)} x2={x} y2={y(item.low)} stroke={color} strokeWidth="1" />
              <rect
                x={x - Math.max(2, step * 0.25)}
                y={top}
                width={Math.max(4, step * 0.5)}
                height={Math.max(2, bottom - top)}
                rx="1"
                fill={color}
              />
              <rect
                x={x - Math.max(2, step * 0.25)}
                y={150 - (item.volume / maxVolume) * 21}
                width={Math.max(4, step * 0.5)}
                height={(item.volume / maxVolume) * 21}
                rx="1"
                fill={color}
                opacity=".35"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RsiChart() {
  const values = [44, 52, 48, 58, 62, 54, 49, 42, 38, 45, 36, 31, 28, 34, 29, 26, 32, 27, 24, 22];
  const points = values.map((value, index) =>
    `${(index / (values.length - 1)) * 360},${6 + ((70 - value) / 50) * 56}`,
  ).join(" ");
  return (
    <div className="rsi-panel">
      <div className="rsi-head">
        <span className="t-mono-s">RSI 68</span>
        <Badge tone="warn">High</Badge>
        <Explain>What is RSI?</Explain>
      </div>
      <svg viewBox="0 0 360 70" aria-label="Relative strength index">
        <line x1="0" y1="12" x2="360" y2="12" className="rsi-guide" />
        <line x1="0" y1="58" x2="360" y2="58" className="rsi-guide" />
        <polyline points={points} className="rsi-line" />
      </svg>
      <p>A high reading is not a sell signal and a low one is not a buy signal.</p>
    </div>
  );
}

function StockSection({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="stock-section-head">
      <Overline>{title}</Overline>
      {action && <button className="text-link" onClick={onAction}>{action}</button>}
    </div>
  );
}

export function StockScreen() {
  const {
    back,
    flash,
    go,
    openSheet,
    session,
    setStockTab,
    stockTab: tab,
    viewport,
    watchlists,
    addToList,
    removeFromList,
    fulfillObjective,
  } = useApp();
  const [range, setRange] = useState<Range>("1D");
  const [chartMode, setChartMode] = useState<"line" | "candles">("line");
  const [showRsi, setShowRsi] = useState(false);
  const [showAllReadings, setShowAllReadings] = useState(false);
  const [scrub, setScrub] = useState<TapePrint | null>(null);
  const watched = watchlists.some((list) => list.symbols.includes(nabil.symbol));
  const holding = watchlists.find((list) => list.symbols.includes(nabil.symbol));
  const watch = () => {
    if (holding) {
      openSheet({
        kind: "confirm",
        title: `Remove ${nabil.symbol}?`,
        body: `It comes off ${holding.label}. Nothing is sold — a list only follows.`,
        confirmLabel: "Remove",
        cancelLabel: "Keep it",
        danger: true,
        onConfirm: () => {
          removeFromList(holding.id, nabil.symbol);
          flash({ message: `${nabil.symbol} removed from ${holding.label}.` });
        },
      });
      return;
    }
    openSheet({
      kind: "confirm",
      title: `Add ${nabil.symbol} to ${watchlists[0].label}?`,
      body: "Following a company never buys kitta. You will see it after every close.",
      confirmLabel: "Add to list",
      cancelLabel: "Not now",
      onConfirm: () => {
        addToList(watchlists[0].id, nabil.symbol);
        fulfillObjective("watch");
        flash({ message: `${nabil.symbol} added to ${watchlists[0].label}.` });
      },
    });
  };

  const openMenu = (item: CompanyMenu) => {
    if (item.tab) setStockTab(item.tab);
    else if (item.desk) go("market-desk", { marketDesk: item.desk });
    else if (item.sheet === "compare") openSheet({ kind: "compare" });
    else if (item.route) go(item.route, item.route === "brokers" ? { brokerDesk: "analysis" } : undefined);
  };

  const tape =
    range === "1W"
      ? nabilWeek
      : range === "1M" || range === "3M"
        ? nabilMonth
        : range === "1Y"
          ? nabilYear
          : nabilSessionTicks;
  const shown = scrub?.v ?? nabil.ltp;
  const shownChange = scrub ? shown - tape.prevClose : nabil.change;
  const shownPct = scrub ? (shownChange / tape.prevClose) * 100 : nabil.changePct;
  const explain = (title: string, body: string, note?: string) =>
    openSheet({ kind: "quick", title, body, note });

  return (
    <div className="stock-screen">
      {viewport === "mobile" && (
        <div className="app-bar stock-app-bar">
          <button className="icon-btn" onClick={back} aria-label="Back"><Icon name="back" /></button>
          <TickerMark symbol={nabil.symbol} size="sm" />
          <div className="stock-identity">
            <p className="t-ticker">{nabil.symbol}</p>
            <p className="t-body-xs muted">{nabil.name} · {nabil.sector}</p>
          </div>
          <button
            type="button"
            className={`icon-btn stock-star${watched ? " on" : ""}`}
            aria-label={watched ? "On your watchlist" : "Add to watchlist"}
            aria-pressed={watched}
            onClick={watch}
          >
            <StarMark on={watched} />
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="Company tools"
            onClick={() => openSheet({ kind: "stock-tools", symbol: nabil.symbol })}
          >
            <Icon name="sliders" />
          </button>
        </div>
      )}
      {viewport === "web" && (
        <div className="pad stock-web-head">
          <button className="text-link web-back" onClick={back}>‹ Market</button>
          <div className="stock-web-id">
            <TickerMark symbol={nabil.symbol} />
            <div>
              <p className="t-ticker">{nabil.symbol}</p>
              <p className="t-body-s muted">{nabil.name} · {nabil.sector}</p>
            </div>
            <div className="stock-web-acts">
              <button type="button" className={`pf-quick-btn${watched ? " on" : ""}`} onClick={watch}>
                <StarMark on={watched} /> {watched ? "Watching" : "Watch"}
              </button>
              <button
                type="button"
                className="pf-quick-btn"
                onClick={() => go("alerts", { alertSymbol: nabil.symbol })}
              >
                <Icon name="bell" size={15} /> Alert
              </button>
              <button
                type="button"
                className="pf-quick-btn"
                onClick={() => openSheet({ kind: "stock-tools", symbol: nabil.symbol })}
              >
                <Icon name="sliders" size={15} /> Tools
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="stock-hero">
        <div className="figure-line">
          <p className="hero-num">{npr(shown, 2)}</p>
          <MovePill amount={shownChange} pct={shownPct} />
        </div>
        <div className="stock-status">
          <span className="time-pill">
            {scrub
              ? `At ${scrub.t}`
              : session === "closed"
                ? `Closed 3:00 PM · 2 Bhadra 2083`
                : "Live"}
          </span>
          {!scrub && <Badge tone="warn">Ex-dividend today</Badge>}
        </div>
      </div>

      <div className="stock-chart-controls">
        <div className="stock-ranges">
          {ranges.map((item) => (
            <Chip
              key={item}
              selected={range === item}
              onClick={() => {
                setRange(item);
                setScrub(null);
              }}
            >
              {item}
            </Chip>
          ))}
        </div>
        <div className="stock-chart-mode">
          <button className={chartMode === "line" ? "on" : ""} onClick={() => setChartMode("line")}>
            Line
          </button>
          <button className={chartMode === "candles" ? "on" : ""} onClick={() => setChartMode("candles")}>
            Candles
          </button>
        </div>
      </div>

      {chartMode === "line" ? (
        <SessionWalk tape={tape} compact showVolume={false} bare spiky={range === "1D"} onScrub={setScrub} />
      ) : (
        <CandleChart tape={tape} />
      )}
      <div className="stock-chart-note">
        <span className="c-down">↓</span>
        {scrub ? `At ${scrub.t}` : `Down ${npr(Math.abs(nabil.change), 2)} today · last price 3:00 PM`}
        <button
          className={`stock-indicator ${showRsi ? "on" : ""}`}
          onClick={() => setShowRsi((current) => !current)}
        >
          RSI
        </button>
      </div>
      {showRsi && <RsiChart />}

      <div className="tabs stock-tabs">
        {tabs.map((item) => (
          <button key={item} className={tab === item ? "on" : ""} onClick={() => setStockTab(item)}>
            {item}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <>
          <div className="stock-read">
            <section className="take-card">
              <header className="take-head">
                <span className="take-ico" aria-hidden>
                  <Icon name="tulkey" size={17} />
                </span>
                <span className="overline">Mitra&rsquo;s take</span>
              </header>
              <p className="take-body">{stockTake.summary}</p>
              <p className="take-aside">{stockTake.aside}</p>
              <button type="button" className="text-link" onClick={() => go("ai")}>
                Ask Mitra about {nabil.symbol} &rsaquo;
              </button>
            </section>
            <GreedMeter symbol={nabil.symbol} />
          </div>

          <StockSection title="More on this company" />
          <div className="stock-menus">
            {companyMenus.map((item) => (
              <button key={item.label} type="button" onClick={() => openMenu(item)}>
                <span className="stock-menu-ico" aria-hidden>
                  <Icon name={item.icon} size={19} />
                </span>
                {item.label}
              </button>
            ))}
          </div>

          {/* One number to a tile: what it is called, the figure, then what it means. */}
          <StockSection title="Key numbers" />
          <div className="stock-keys">
            {[
              { id: "pe", code: "P/E", value: nabil.pe.toFixed(1), label: "Price vs profit" },
              { id: "pb", code: "P/B", value: nabil.pb.toFixed(2), label: "Price vs net worth" },
              { id: "eps", code: "EPS", value: `Rs ${nabil.eps.toFixed(2)}`, label: "Profit per share" },
              { id: null, code: "Market cap", value: nabil.mcap, label: "Value of all shares" },
              { id: null, code: "Dividend", value: nabil.dividend, label: "Paid last year" },
            ].map((row) =>
              row.id ? (
                <button
                  type="button"
                  className="stock-key"
                  key={row.code}
                  onClick={() => openSheet({ kind: "metric", id: row.id! })}
                >
                  <small className="stock-key-code">
                    {row.code}
                    <Icon name="info" size={11} />
                  </small>
                  <b>{row.value}</b>
                  <span>{row.label}</span>
                </button>
              ) : (
                <div className="stock-key" key={row.code}>
                  <small className="stock-key-code">{row.code}</small>
                  <b>{row.value}</b>
                  <span>{row.label}</span>
                </div>
              ),
            )}
          </div>

          <StockSection title="Price info" action={nepse.date} />
          <div className="stock-grid">
            {[
              ["Open", npr(nabil.open, 2)],
              ["High", npr(nabil.high, 2)],
              ["Low", npr(nabil.low, 2)],
              ["Previous close", npr(nabil.prev, 2)],
              ["Turnover", nabil.turnover],
              ["Volume", nabil.volume],
              ["52W high", npr(nabil.weekHigh, 2)],
              ["52W low", npr(nabil.weekLow, 2)],
              ["30-day average", npr(nabil.avg30, 2)],
            ].map(([label, value]) => (
              <span key={label}>
                <small>{label}</small>
                <b>{value}</b>
              </span>
            ))}
          </div>

          <StockSection title="About the company" />
          <div className="stock-company">
            <p>{nabilCompany.description}</p>
            <div className="stock-company-facts">
              <span><small>Founded</small><b>{nabilCompany.founded}</b></span>
              <span><small>Exchange</small><b>{nabilCompany.exchange}</b></span>
              <span><small>Sector</small><b>{nabilCompany.sector}</b></span>
            </div>
            <small>Source: {nabilCompany.source}</small>
          </div>

          <StockSection title="Understand this" action="Learn ›" onAction={() => go("learn")} />
          {[
            ["What a dividend does to the price", "Two minutes · why a fall today is not a loss"],
            ["How to read P/E", "Two minutes · comparing two banks fairly"],
          ].map(([title, sub]) => (
            <button className="row" key={title} onClick={() => go("lesson", { lesson: title })}>
              <span className="learn-ico"><Icon name="learn" size={17} /></span>
              <div className="row-main"><p className="t-h-s">{title}</p><p className="row-sub">{sub}</p></div>
              <Icon name="chev" size={15} />
            </button>
          ))}
        </>
      )}

      {tab === "Financials" && (
        <>
          <div className="market-filters quiet stock-filters">
            <span className="chip chip-on">{nabilFinancials.period}</span>
            <span className="chip chip-quiet">Q4</span>
            <span className="chip chip-quiet">6-year</span>
          </div>
          <StockSection title="Company essentials" action={nabilFinancials.period} />
          <div className="stock-grid">
            {nabilFinancials.essentials.map((row) => (
              <span key={row.label}>
                <small>{row.label}</small>
                <b>{row.value}</b>
              </span>
            ))}
          </div>

          <StockSection title="Earnings" action="Full statement ›" />
          {nabilFinancials.earnings.map((row) => (
            <div className="kv" key={row.label}>
              <span>
                {row.metric ? <MetricLink id={row.metric}>{row.label}</MetricLink> : row.label}
                {row.code && <small className="kv-code">{row.code}</small>}
              </span>
              <b>
                {row.value}
                {row.change != null && <em className="stock-change c-up">{pct(row.change, 1)}</em>}
              </b>
            </div>
          ))}
          <StockSection title="Valuation & quality" action="Method ›" />
          {nabilFinancials.quality.map((row) => (
            <div className="kv" key={row.label}>
              <span>
                {row.metric ? <MetricLink id={row.metric}>{row.label}</MetricLink> : row.label}
                {row.code && <small className="kv-code">{row.code}</small>}
              </span>
              <b className={row.tone === "warn" ? "stock-warn" : ""}>{row.value}</b>
            </div>
          ))}
          <StockSection title="Balance sheet & efficiency" action="Reported FY 2081–82" />
          {nabilFinancials.balance.map((row) => (
            <div className="kv" key={row.label}>
              <span>{row.label}<Icon name="info" size={11} /></span>
              <b>{row.value}</b>
            </div>
          ))}
          <StockSection title="Who owns it" action="Detail ›" />
          <div className="ownership">
            <div className="ownership-bar">
              {nabilFinancials.owners.map((owner) => (
                <i key={owner.label} style={{ width: `${owner.value}%`, background: owner.color }} />
              ))}
            </div>
            <div className="ownership-legend">
              {nabilFinancials.owners.map((owner) => (
                <span key={owner.label}>
                  <i style={{ background: owner.color }} />
                  {owner.label} {owner.value}%
                </span>
              ))}
            </div>
            <Explain onClick={() => explain(
              "What is promoter holding?",
              "Promoter holding is the portion owned by founding or controlling shareholders. It describes ownership, not future performance.",
            )}>
              What is promoter holding?
            </Explain>
          </div>
        </>
      )}

      {tab === "Analysis" && (
        <>
          <StockSection title="Technical essentials" action={nabilAnalysis.updated.split(" · ")[0]} />
          <div className="stock-grid">
            {nabilAnalysis.essentials.map((row) => (
              <span key={row.label}>
                <small>{row.label}</small>
                <b>{row.value}</b>
              </span>
            ))}
          </div>

          <StockSection title="Price versus trend" action="Closing prices" />
          <div className="trend-map">
            <div className="trend-map-track">
              {[
                { label: "200d", value: 487.35, tone: "quiet" },
                { label: "Price", value: nabil.ltp, tone: "price" },
                { label: "20d", value: 505.1, tone: "quiet" },
                { label: "50d", value: 512.4, tone: "quiet" },
              ].map((point) => (
                <span
                  key={point.label}
                  className={point.tone}
                  style={{ left: `${Math.max(3, Math.min(97, ((point.value - 484) / 32) * 100))}%` }}
                >
                  <i />
                  <b>{point.label}</b>
                  <em>{npr(point.value, 2)}</em>
                </span>
              ))}
            </div>
            <p>
              The close sits between the 200-day average and the shorter 20- and 50-day averages.
            </p>
          </div>

          <StockSection title="Momentum & strength" action="Recent window" />
          <div className="analysis-metric-grid">
            {[
              { label: "RSI (14)", value: "39.23", state: "Lower half", fill: 39.23 },
              { label: "Stochastic", value: "26.24", state: "Near low band", fill: 26.24 },
              { label: "MFI", value: "19.30", state: "Low reading", fill: 19.3 },
              { label: "ADX", value: "36.07", state: "Trend present", fill: 36.07 },
            ].map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <b>{item.value}</b>
                <div className="analysis-mini-track"><i style={{ width: `${item.fill}%` }} /></div>
                <small>{item.state}</small>
              </div>
            ))}
          </div>
          <div className="analysis-macd">
            <div><span>MACD</span><b>−0.09</b></div>
            <p>Below its signal line. This describes recent momentum, not tomorrow’s direction.</p>
          </div>

          <button
            type="button"
            className="analysis-disclosure"
            onClick={() => setShowAllReadings((current) => !current)}
            aria-expanded={showAllReadings}
          >
            <span>
              <b>{showAllReadings ? "Hide detailed readings" : "Show all technical readings"}</b>
              <small>Moving averages, bands and beta</small>
            </span>
            <Icon name="chev" size={15} />
          </button>

          {showAllReadings && (
            <div className="analysis-details">
              <StockSection title="Trend levels" action="Same closing date" />
              <div className="stock-level-grid">
                {nabilAnalysis.levels.map((item) => (
                  <div key={item.label}><span>{item.label}</span><b>{item.value}</b></div>
                ))}
              </div>
              <StockSection title="Market sensitivity" action="Beta by window" />
              {nabilAnalysis.risk.map((item) => (
                <div className="stock-risk-row" key={item.label}>
                  <div><span>{item.label}</span><small>{item.note}</small></div>
                  <b>{item.value}</b>
                </div>
              ))}
            </div>
          )}

          <div className="analysis-learning">
            <Overline>Use with care</Overline>
            <p>Indicators change with the period and source. Check company events and financials before interpreting a price pattern.</p>
            <Explain onClick={() => explain(
              "How should I use technical indicators?",
              "Use them to describe a chosen price window, not to predict one outcome. Confirm the date, period and source, then compare with company events and fundamentals.",
            )}>
              How to use these readings
            </Explain>
          </div>
        </>
      )}

      {tab === "Floor sheet" && (
        <>
          <div className="market-filters quiet stock-filters">
            <span className="chip chip-on">Today · 2 Bhadra</span>
            <span className="chip chip-quiet">Yesterday</span>
            <span className="chip chip-quiet">This week</span>
          </div>
          <StockSection title="Today’s trade summary" />
          {nabilFloor.summary.map(([label, value]) => (
            <div className="kv" key={label}><span>{label}</span><b>{value}</b></div>
          ))}
          <div className="pad stock-explain-row">
            <Explain onClick={() => explain(
              "What is a floor sheet?",
              "A floor sheet lists trades that already happened. It is not the live order book.",
            )}>
              What is a floor sheet?
            </Explain>
          </div>
          <StockSection title="Broker activity today" action="Net position" />
          <div className="sheet-wrap stock-broker-table">
            <table className="sheet-table">
              <thead>
                <tr><th>Broker</th><th className="num">Bought</th><th className="num">Sold</th><th className="num">Net kitta</th></tr>
              </thead>
              <tbody>
                {nabilFloor.brokers.map((broker) => (
                  <tr key={broker.code}>
                    <td>Broker {broker.code}</td>
                    <td className="num">{npr(broker.bought)}</td>
                    <td className="num">{npr(broker.sold)}</td>
                    <td className={`num ${broker.net < 0 ? "c-down" : "c-up"}`}>{signed(broker.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="foot-note">
            Brokers are shown by their NEPSE code. A net buyer today is not a forecast of tomorrow.
          </p>
          <StockSection title="Largest trades today" action="Full sheet ›" />
          {nabilFloor.largest.map((trade) => (
            <div className="stock-trade-row" key={trade.time}>
              <span>{trade.time}</span><span>{trade.kitta}</span><b>{npr(trade.price, 2)}</b>
            </div>
          ))}
          <p className="foot-note">
            The floor sheet lists trades that already happened. It does not show pending buy or sell orders.
          </p>
        </>
      )}

      {tab === "Events" && (
        <>
          <div className="stock-event-feature">
            <div><strong>Ex-dividend today</strong><time>2 Bhadra 2083</time></div>
            <p>NABIL trades without its 10% cash dividend today. Buying today does not earn you this dividend.</p>
            <Explain onClick={() => explain(
              "What does ex-dividend mean?",
              "Buying on or after the ex-date does not include the announced dividend. The price often adjusts for that cash.",
            )}>
              What does ex-dividend mean?
            </Explain>
          </div>
          <StockSection title="Upcoming" />
          {nabilEvents.upcoming.map((event) => (
            <div className="row" key={event.title}>
              <div className="row-main"><p className="t-h-s">{event.title}</p><p className="row-sub">{event.sub}</p></div>
              <time className="t-mono-s">{event.date}</time>
            </div>
          ))}
          <div className="pad stock-explain-row">
            <Explain onClick={() => explain(
              "What is book closure?",
              "Book closure is the date the company freezes its shareholder list for an announced benefit or meeting.",
            )}>
              What is book closure?
            </Explain>
          </div>
          <StockSection title="Dividend history" action="5 years ›" />
          {nabilEvents.dividends.map(([year, cash, bonus]) => (
            <div className="stock-history-row" key={year}>
              <span>{year}</span><b>{cash}</b><b>{bonus}</b>
            </div>
          ))}
          <StockSection title="Past corporate actions" />
          {nabilEvents.past.map((event) => (
            <div className="row" key={event.title}>
              <div className="row-main"><p className="t-h-s">{event.title}</p><p className="row-sub">{event.date}</p></div>
              <span className="t-body-xs muted">{event.status}</span>
            </div>
          ))}
          <p className="foot-note">
            Dates follow the company’s published notices and can change. Confirm on NEPSE or with your broker before you act.
          </p>
        </>
      )}

      <p className="disclaimer">
        Last print at the close. Trading still happens in TMS — we don’t place orders.
      </p>
      <div className={`float-actions stock-actions ${tab === "Analysis" ? "stock-actions-min" : ""}`}>
        <button
          type="button"
          className="icon-btn"
          aria-label="Set an alert"
          onClick={() => go("alerts", { alertSymbol: nabil.symbol })}
        >
          <Icon name="bell" />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label="Compare"
          onClick={() => openSheet({ kind: "compare" })}
        >
          <Icon name="compare" />
        </button>
        <Button
          variant="primary"
          size="md"
          onClick={() => openSheet({ kind: "order", symbol: nabil.symbol })}
        >
          Trade in TMS <Icon name="ext" size={14} />
        </Button>
      </div>
    </div>
  );
}
