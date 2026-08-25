import { useMemo, useState } from "react";
import { Icon } from "../ds/Icon";
import { Badge, Button, Chip, Explain, MovePill, Overline } from "../ds/primitives";
import { SessionWalk } from "../ds/charts";
import { MetricLink } from "../shell/Overlays";
import {
  holdings,
  nabil,
  nabilAnalysis,
  nabilCompany,
  nabilEvents,
  nabilFinancials,
  nabilFloor,
  nabilMonth,
  nabilSession,
  nabilWeek,
  nabilYear,
  type Tape,
  type TapePrint,
} from "../lib/data";
import { npr, pct, signed } from "../lib/format";
import { useApp } from "../lib/state";
import type { StockTab } from "../lib/types";

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
  const { back, flash, go, openSheet, session, setStockTab, stockTab: tab, viewport } = useApp();
  const [range, setRange] = useState<Range>("1D");
  const [chartMode, setChartMode] = useState<"line" | "candles">("line");
  const [showRsi, setShowRsi] = useState(false);
  const [showAllReadings, setShowAllReadings] = useState(false);
  const [scrub, setScrub] = useState<TapePrint | null>(null);
  const owned = holdings.find((holding) => holding.symbol === nabil.symbol);
  const tape =
    range === "1W"
      ? nabilWeek
      : range === "1M" || range === "3M"
        ? nabilMonth
        : range === "1Y"
          ? nabilYear
          : nabilSession;
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
          <div className="stock-identity">
            <p className="t-ticker">{nabil.symbol}</p>
            <p className="t-body-xs muted">{nabil.name} · {nabil.sector}</p>
          </div>
          <button
            className="icon-btn stock-star"
            aria-label="Watchlist"
            onClick={() => flash({ message: "NABIL is on your watchlist." })}
          >
            <Icon name="star" />
          </button>
          <button
            className="icon-btn"
            aria-label="More stock tools"
            onClick={() => openSheet({ kind: "stock-tools", symbol: nabil.symbol })}
          >
            <Icon name="dots" />
          </button>
        </div>
      )}
      {viewport === "web" && (
        <div className="pad" style={{ paddingBottom: 8 }}>
          <button className="text-link" onClick={back}>‹ Market</button>
          <p className="t-ticker" style={{ marginTop: 8 }}>{nabil.symbol}</p>
          <p className="t-body-s muted">{nabil.name} · {nabil.sector}</p>
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
        <SessionWalk tape={tape} compact showVolume={false} bare onScrub={setScrub} />
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
          {owned && (
            <div className="own-card stock-own">
              <Overline>You own this</Overline>
              <div className="own-grid">
                <div><div className="k">Units</div><div className="v">{nabil.kitta} kitta</div></div>
                <div><div className="k">Value now</div><div className="v">{npr(nabil.value)}</div></div>
                <div><div className="k">Overall</div><div className="v c-down">{signed(nabil.overall)}</div></div>
              </div>
              <div className="stock-own-foot">
                <span>Average cost {npr(nabil.avg, 2)} · bought with own money</span>
                <button className="text-link" onClick={() => go("holding", { holdingMode: "detail" })}>Detail ›</button>
              </div>
            </div>
          )}

          <div className="stock-ex-div">
            <Overline>Why it moved today</Overline>
            <p>
              NABIL trades without its 10% cash dividend today. Part of this fall is the dividend leaving the price, not the business changing.
            </p>
            <Explain onClick={() => explain(
              "What is ex-dividend?",
              "On the ex-date, a share trades without the upcoming dividend. Its price often drops by roughly that cash amount.",
              "That adjustment is not, by itself, a sudden change in the company.",
            )}>
              What is ex-dividend?
            </Explain>
          </div>

          <StockSection title="Key numbers" action="Tap any number to explain it" />
          {[
            { id: "pe", label: "P/E", value: nabil.pe.toFixed(1) },
            { id: null, label: "P/B", value: nabil.pb.toFixed(2) },
            { id: "eps", label: "EPS", value: nabil.eps.toFixed(2) },
            { id: null, label: "Market cap", value: nabil.mcap },
            { id: null, label: "Dividend", value: nabil.dividend },
            { id: null, label: "52-week range", value: nabil.range },
          ].map((row) => (
            <div className="kv" key={row.label}>
              <span>
                {row.id ? <MetricLink id={row.id}>{row.label}</MetricLink> : row.label}
                {!row.id && <Icon name="info" size={11} />}
              </span>
              <b>{row.value}</b>
            </div>
          ))}

          <StockSection title="Today’s trading" />
          {[
            ["Open", npr(nabil.open, 2)],
            ["High", npr(nabil.high, 2)],
            ["Low", npr(nabil.low, 2)],
            ["Previous close", npr(nabil.prev, 2)],
            ["Volume", nabil.volume],
            ["Turnover", nabil.turnover],
          ].map(([label, value]) => (
            <div className="kv" key={label}><span>{label}</span><b>{value}</b></div>
          ))}

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
          <StockSection title="Earnings" action="Full statement ›" />
          {nabilFinancials.earnings.map((row) => (
            <div className="kv" key={row.label}>
              <span>{row.label}{row.label === "EPS" && <Icon name="info" size={11} />}</span>
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
                {!row.metric && <Icon name="info" size={11} />}
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
          <div className="analysis-hero">
            <div className="analysis-hero-top">
              <div>
                <Overline>Technical snapshot</Overline>
                <h2>Mixed picture</h2>
              </div>
              <span className="analysis-price">{npr(nabil.ltp, 2)}</span>
            </div>
            <p>
              Short-term momentum is weak, while the price remains above its long-term average.
              That describes the chart; it does not recommend an action.
            </p>
            <div className="analysis-summary">
              <div><small>Short term</small><b>Below 20d & 50d</b></div>
              <div><small>Long term</small><b>Above 200d</b></div>
              <div><small>Activity</small><b>12.19 Cr</b></div>
            </div>
            <div className="analysis-asof">
              <span>{nabilAnalysis.updated}</span>
              <Explain onClick={() => explain(
                "What does mixed picture mean?",
                "Different windows can point in different directions. Here, recent prices are below shorter averages while remaining above the 200-day average.",
                "This is context, not a buy or sell signal.",
              )}>
                Explain this
              </Explain>
            </div>
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
          className="icon-btn"
          aria-label="Alert"
          onClick={() => flash({ message: "NABIL price alert created for this demo." })}
        >
          <Icon name="alert" />
        </button>
        <button
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
