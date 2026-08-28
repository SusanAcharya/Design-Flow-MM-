import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { AllocStrip, BookTrend, SectorDonut } from "../ds/charts";
import { BookNudge } from "../ds/BookNudge";
import { Explain, Overline, SectionHead } from "../ds/primitives";
import { TickerMark } from "../ds/TickerMark";
import { HappenList, type HappenItem } from "../ds/HappenList";
import {
  allotments,
  bookHappen,
  bookRangeTape,
  ipoPipeline,
  type BookRange,
} from "../lib/data";
import {
  activityFor,
  analyticsNotes,
  attentionFor,
  bookFor,
  bookHoldings,
  buyCharges,
  chargeRules,
  contributors,
  eventsFor,
  glossary,
  incomeFor,
  incomeTabs,
  perfRanges,
  type Book,
  type Holding,
  type IncomeEvent,
  type IncomeTab,
  type StockEvent,
  type Txn,
} from "../lib/portfolio";
import { npr, pct, signed } from "../lib/format";
import { useApp } from "../lib/state";
import type { PortfolioTab } from "../lib/types";

const tabs: PortfolioTab[] = ["Overview", "Holdings", "Allocation", "Activity", "Income", "Analytics"];

const VEIL = "••••••";

/** The Portfolio destination always reads the book the user has selected. */
function useBook(): Book {
  const { portfolioId, portfolioNames } = useApp();
  const next = bookFor(portfolioId);
  const name = portfolioNames[portfolioId] ?? next.totals.name;
  if (name === next.totals.name) return next;
  return { ...next, totals: { ...next.totals, name } };
}

function money(value: number, hidden: boolean, digits = 0) {
  return hidden ? VEIL : `Rs ${npr(value, digits)}`;
}

function signedMoney(value: number, hidden: boolean, digits = 0) {
  if (hidden) return VEIL;
  return `${value < 0 ? "−" : "+"}Rs ${npr(Math.abs(value), digits)}`;
}

function tone(value: number) {
  if (value > 0) return "c-up";
  if (value < 0) return "c-down";
  return "";
}

function dir(value: number) {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

function EyeBtn({ hidden, onClick }: { hidden: boolean; onClick: () => void }) {
  return (
    <button type="button" className="eye-btn" onClick={onClick} aria-label={hidden ? "Show value" : "Hide value"}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        {hidden ? (
          <>
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7A2 2 0 0012 14a2 2 0 001.4-.6" />
            <path d="M9.9 5.5A10.6 10.6 0 0112 5c5 0 9.3 3.1 11 7.5a11.7 11.7 0 01-4.2 5.1" />
            <path d="M6.7 6.8A11.7 11.7 0 001 12.5C2.7 16.9 7 20 12 20c1.5 0 2.9-.3 4.2-.8" />
          </>
        ) : (
          <>
            <path d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5C21.3 16.9 17 20 12 20S2.7 16.9 1 12.5z" />
            <circle cx="12" cy="12.5" r="2.6" />
          </>
        )}
      </svg>
    </button>
  );
}

function PfBlock({
  title,
  note,
  action,
  onAction,
  children,
}: {
  title?: string;
  note?: ReactNode;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="pf-block">
      {(title || action) && (
        <header className="pf-block-head">
          <div>
            {title ? <h2>{title}</h2> : <span />}
            {note ? <p className="pf-block-note">{note}</p> : null}
          </div>
          {action && (
            <button type="button" className="text-link" onClick={onAction}>
              {action}
            </button>
          )}
        </header>
      )}
      <div className="pf-block-body">{children}</div>
    </section>
  );
}

/** Spec §12 — collapse rules: some sections start folded and say so. */
function Fold({
  label,
  count,
  open,
  onToggle,
  children,
}: {
  label: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`pf-fold${open ? " on" : ""}`}>
      <button type="button" className="pf-fold-btn" onClick={onToggle} aria-expanded={open}>
        <span>{open ? "Collapse" : label}</span>
        {count != null && !open && <em>{count}</em>}
        <i aria-hidden>›</i>
      </button>
      {open && <div className="pf-fold-body">{children}</div>}
    </div>
  );
}

function useExplain() {
  const { openSheet } = useApp();
  return (title: string, body: string, note?: string) => openSheet({ kind: "quick", title, body, note });
}

/* ---------------------------------------------------------------- Overview */

/** The value chart, as a tier of the hero card rather than a block of its own. */
function HeroTrend({ hidden }: { hidden: boolean }) {
  const { totals: b } = useBook();
  const [range, setRange] = useState<BookRange>("1M");
  const tape = useMemo(
    () => bookRangeTape(b.marketValue, b.dayPl, b.unrealised, range),
    [range, b],
  );
  const change = tape.last - tape.prevClose;

  return (
    <div className="pf-hero-trend">
      <div className="pf-hero-trend-head">
        <span>{range} change</span>
        <b className={tone(change)}>{signedMoney(change, hidden)}</b>
        <em className={tone(change)}>
          {hidden ? VEIL : `(${pct((change / tape.prevClose) * 100)})`}
        </em>
      </div>
      <div className="pf-hero-trend-chart">
        <BookTrend tape={tape} hidden={hidden} />
      </div>
      <div className="range-pills" role="tablist" aria-label="Performance range">
        {perfRanges.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={range === item}
            className={range === item ? "on" : ""}
            onClick={() => setRange(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Spec §3.2 — one card, four tiers: value, today, the parts, the sum. */
function HeroCard({ hidden, setHidden }: { hidden: boolean; setHidden: (v: boolean) => void }) {
  const { totals: b } = useBook();
  const { portfolioId } = useApp();
  const explain = useExplain();
  const reminders = attentionFor(portfolioId);

  const cells = [
    {
      id: "today",
      label: "Today’s change",
      value: signedMoney(b.dayPl, hidden),
      sub: hidden ? undefined : pct(b.dayPlPct),
      klass: tone(b.dayPl),
      title: "Today’s change",
      body: `Since yesterday's close this book moved Rs ${npr(b.dayPl)} (${pct(b.dayPlPct)}). It counts only price moves on shares you hold today.`,
      note: "A day move is noise until it repeats. It is not your return.",
    },
    {
      id: "invested",
      label: "Invested",
      value: money(b.costBasis, hidden),
      title: "Cost basis",
      body: "What the shares you currently hold cost you, using recorded buys, rights and adjustments.",
      note: "Sold shares are excluded — their result sits in realised P/L.",
    },
    {
      id: "unrealised",
      label: "Unrealised P/L",
      value: signedMoney(b.unrealised, hidden),
      sub: hidden ? undefined : pct(b.unrealisedPct),
      klass: tone(b.unrealised),
      title: "Unrealised P/L",
      body: "Market value minus the cost basis of the shares you still hold. This is the gain or loss you have not locked in.",
      note: "It becomes realised P/L only when you sell.",
    },
    {
      id: "realised",
      label: "Realised P/L",
      value: b.realised === 0 ? "No sales yet" : signedMoney(b.realised, hidden),
      klass: b.realised === 0 ? "dim" : tone(b.realised),
      title: "Realised P/L",
      body:
        b.realised === 0
          ? "Nothing has been sold from this portfolio, so there is no realised P/L to show. That is different from Rs 0 profit."
          : `Rs ${npr(b.realised)} locked in by completed sales, after selling charges and capital gain tax.`,
      note: "Kept separate from unrealised P/L on purpose.",
    },
  ];

  return (
    <div className="pf-hero">
      <div className="pf-hero-card">
        <div className="pf-hero-acts">
          <button
            type="button"
            className={`pf-hero-chip${reminders.length > 0 ? " on" : ""}`}
            aria-label={
              reminders.length === 0
                ? "Reminders: nothing waiting"
                : `Reminders: ${reminders.length}`
            }
            onClick={() => {
              if (reminders.length === 0) {
                explain("Reminders", "Nothing is waiting on this book right now. Deadlines, missing prices and events will show up here.");
                return;
              }
              document.getElementById("pf-reminders")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Icon name="bell" size={15} />
            {reminders.length > 0 && <em>{reminders.length}</em>}
          </button>
          <EyeBtn hidden={hidden} onClick={() => setHidden(!hidden)} />
        </div>

        <button
          type="button"
          className="pf-hero-top"
          onClick={() =>
            explain(
              "Market value",
              `Every share in ${b.name}, priced at its latest traded price: ${b.count} holdings, ${npr(b.kitta)} kitta, Rs ${npr(b.marketValue)} in total.`,
              "It is not cash, and it changes with the market.",
            )
          }
        >
          <span className="pf-hero-kicker">Market value</span>
          <span className="pf-hero-value">
            <b>{money(b.marketValue, hidden)}</b>
          </span>
          <span className="pf-hero-sub">
            {b.count} {b.count === 1 ? "holding" : "holdings"}
          </span>
        </button>

        <HeroTrend hidden={hidden} />

        <div className="pf-hero-grid">
          {cells.map((cell) => (
            <button
              key={cell.id}
              type="button"
              className="pf-cell"
              onClick={() => explain(cell.title, cell.body, cell.note)}
            >
              <span>
                {cell.label}
                <Icon name="info" size={11} />
              </span>
              <b className={cell.klass}>{cell.value}</b>
              {cell.sub && <em className={cell.klass}>{cell.sub}</em>}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pf-hero-total"
          onClick={() =>
            explain(
              "Total return",
              `Unrealised P/L (Rs ${npr(b.unrealised)}) + realised P/L (Rs ${npr(b.realised)}) + recorded dividends (Rs ${npr(b.dividends)}), measured from your first recorded transaction.`,
              b.incompleteCount > 0
                ? "One buy is missing a price, so this is an estimate."
                : "Period and method are stated so the number means something.",
            )
          }
        >
          <span>Total return</span>
          <b className={tone(b.totalReturn)}>{signedMoney(b.totalReturn, hidden)}</b>
          <em className={`pf-pill ${dir(b.totalReturnPct)}`}>{hidden ? VEIL : pct(b.totalReturnPct)}</em>
          <i aria-hidden>›</i>
        </button>
      </div>
    </div>
  );
}

function AttentionBlock() {
  const { go, openSheet, portfolioId } = useApp();
  const items = attentionFor(portfolioId);

  const open = (item: (typeof items)[number]) => {
    if (item.kind === "gap") {
      go("holding", { holdingMode: "add" });
      return;
    }
    if (item.kind === "alert") {
      go("alerts");
      return;
    }
    if (item.symbol) {
      go("holding", { holdingMode: "detail", holding: item.symbol });
      return;
    }
    openSheet({ kind: "quick", title: item.title, body: item.body });
  };

  return (
    <PfBlock title="Reminders">
      <div id="pf-reminders">
        {items.length === 0 ? (
          <p className="foot-note" style={{ padding: "4px 15px 12px" }}>
            Nothing waiting. When a deadline or a missing price shows up, it lands here.
          </p>
        ) : (
          <ul className="pf-attn">
            {items.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => open(item)}>
                  <span className={`pf-attn-ico ${item.kind}`} aria-hidden>
                    <Icon name={item.kind === "event" ? "cal" : item.kind === "gap" ? "info" : "cal"} size={15} />
                  </span>
                  <span className="pf-attn-copy">
                    <strong>{item.title}</strong>
                    <small>{item.body}</small>
                  </span>
                  <em>{item.action} ›</em>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PfBlock>
  );
}

function HoldingRowCard({ row, hidden, onOpen }: { row: Holding; hidden: boolean; onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const soon = eventsFor(row.symbol).deadlines[0];

  return (
    <div className={`pf-hcard${open ? " open" : ""}`}>
      <div className="pf-hcard-l1">
        <button type="button" className="pf-hcard-idbtn" onClick={onOpen}>
          <TickerMark symbol={row.symbol} />
          <span className="pf-hcard-id">
            <strong className="t-ticker">{row.symbol}</strong>
            <small>{row.name}</small>
            <b className="pf-hcard-qty">{hidden ? VEIL : `${npr(row.kitta)} kitta · Rs ${npr(row.ltp, 2)}`}</b>
          </span>
        </button>
        <button
          type="button"
          className="pf-hcard-toggle"
          aria-expanded={open}
          aria-label={open ? `Hide ${row.symbol} figures` : `Show ${row.symbol} figures`}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="pf-hcard-ltp">
            <b>{money(row.marketValue, hidden)}</b>
            <em className={tone(row.dayPl)}>
              <i>Today</i>
              {signedMoney(row.dayPl, hidden)}
            </em>
          </span>
          <span className="pf-hcard-caret" aria-hidden />
        </button>
      </div>
      {open && (
        <div className="pf-hcard-body">
          <span className="pf-hcard-kv">
            <i>Avg cost</i>
            <b>{npr(row.wacc, 2)}</b>
          </span>
          <span className="pf-hcard-kv">
            <i>Invested</i>
            <b>{money(row.costBasis, hidden)}</b>
          </span>
          <span className="pf-hcard-kv">
            <i>Total return</i>
            <b className={tone(row.totalPl)}>
              {signedMoney(row.totalPl, hidden)}
              <em>({pct(row.plPct)})</em>
            </b>
          </span>
          <div className="pf-hcard-foot">
            <button type="button" className="pf-hcard-open" onClick={onOpen}>
              View position ›
            </button>
            {(row.incomplete || soon) && (
              <span className="pf-hcard-flags">
                {row.incomplete && <span className="pf-flag warn">Estimated</span>}
                {soon && (
                  <span className="pf-flag accent">
                    {soon.daysLeft}d to {soon.kind === "deadline" ? "deadline" : "event"}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AllocationBlock({ hidden }: { hidden: boolean }) {
  const { go } = useApp();
  const { holdings, sectors, totals: b } = useBook();
  const top5 = holdings.slice(0, 5);
  const top5Weight = top5.reduce((sum, row) => sum + row.weight, 0);
  const peak = top5[0]?.weight || 1;

  return (
    <PfBlock
      title="Allocation"
      note={
        b.count === 0
          ? "Add a holding to see how the book is split."
          : `Top ${top5.length} ${top5.length === 1 ? "holding is" : "holdings are"} ${top5Weight.toFixed(0)}% of the book`
      }
      action="Holdings ›"
      onAction={() => go("portfolio", { portfolioTab: "Holdings" })}
    >
      {b.count === 0 ? (
        <p className="foot-note" style={{ padding: "8px 15px 16px" }}>
          Allocation is derived from market value. An empty book has nothing to split.
        </p>
      ) : (
        <>
      <div className="pf-alloc">
        <SectorDonut rows={sectors} size={148} label={String(b.count)} sub="holdings" />
        <ul className="pf-alloc-list">
          {sectors.map((row) => (
            <li key={row.name}>
              <i style={{ background: row.color }} />
              <span className="pf-alloc-name">
                <strong>{row.name}</strong>
                <small>{row.symbols.join(" · ")}</small>
              </span>
              <span className="pf-alloc-meta">
                <b>{row.pct}%</b>
                <em>{money(row.value, hidden)}</em>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pf-conc">
        <p className="pf-conc-head">Concentration</p>
        {top5.map((row) => (
          <div key={row.symbol} className="pf-conc-row">
            <span>{row.symbol}</span>
            <span className="pf-weight" aria-hidden>
              <i style={{ width: `${(row.weight / peak) * 100}%` }} />
            </span>
            <b>{row.weight.toFixed(1)}%</b>
          </div>
        ))}
        <p className="foot-note">
          Exposure, not a verdict. A large weight is only a fact about your book.
        </p>
      </div>
        </>
      )}
    </PfBlock>
  );
}

function IncomeSummary({ hidden }: { hidden: boolean }) {
  const { go, portfolioId } = useApp();
  const { totals: b } = useBook();
  const rows = incomeFor(portfolioId);
  const upcoming = rows.filter((row) => row.status === "Eligible" || row.status === "Announced");

  return (
    <PfBlock
      title="Income & events"
      action="View all ›"
      onAction={() => go("portfolio", { portfolioTab: "Income" })}
    >
      <div className="pf-income-top">
        <div>
          <span>Dividends recorded</span>
          <b>{b.dividends === 0 ? "No records" : money(b.dividends, hidden)}</b>
        </div>
        <div>
          <span>Upcoming events</span>
          <b>{upcoming.length}</b>
        </div>
      </div>
      {upcoming.length > 0 && (
        <ul className="pf-event-list">
          {upcoming.slice(0, 2).map((row) => (
            <li key={row.id}>
              <button type="button" onClick={() => go("portfolio", { portfolioTab: "Income" })}>
                <TickerMark symbol={row.symbol} size="sm" />
                <span className="pf-event-copy">
                  <strong>{row.kind} · {row.rate}</strong>
                  <small>{row.dates}</small>
                </span>
                <span className={`pf-status ${row.status.toLowerCase()}`}>{row.status}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </PfBlock>
  );
}

function TxnRow({ row, hidden, onOpen }: { row: Txn; hidden: boolean; onOpen: () => void }) {
  const [fees, setFees] = useState(false);
  const feeTotal = row.fees?.reduce((sum, fee) => sum + fee.value, 0) ?? 0;

  return (
    <li className={`pf-txn${row.corporate ? " corporate" : ""}`}>
      <button type="button" className="pf-txn-main" onClick={onOpen}>
        <span className={`pf-txn-kind ${row.type.replace(/\s/g, "-").toLowerCase()}`}>{row.type}</span>
        <span className="pf-txn-copy">
          <strong>
            {row.symbol}
            {row.kitta != null && <> · {npr(row.kitta)} kitta</>}
            {row.price != null && <> @ {npr(row.price, 2)}</>}
          </strong>
          <small>
            {row.date}
            {row.kittaAfter != null && <> · position {npr(row.kittaAfter)} kitta</>}
            {row.waccAfter != null && <> · avg cost {npr(row.waccAfter, 2)}</>}
          </small>
          {row.note && <small className="pf-txn-note">{row.note}</small>}
        </span>
        <span className="pf-txn-amt">{row.amount === 0 ? "—" : money(row.amount, hidden, 0)}</span>
      </button>
      {row.fees && (
        <div className="pf-txn-fees">
          <button type="button" onClick={() => setFees((v) => !v)} aria-expanded={fees}>
            {fees ? "Hide charges" : `Charges Rs ${npr(feeTotal, 2)}`}
          </button>
          {fees && (
            <dl>
              {row.fees.map((fee) => (
                <div key={fee.label}>
                  <dt>{fee.label}</dt>
                  <dd>{npr(fee.value, 2)}</dd>
                </div>
              ))}
              <div className="total">
                <dt>Total charges</dt>
                <dd>{npr(feeTotal, 2)}</dd>
              </div>
            </dl>
          )}
        </div>
      )}
    </li>
  );
}

function OverviewTab({ hidden, setHidden }: { hidden: boolean; setHidden: (v: boolean) => void }) {
  const { go, openSheet } = useApp();
  const { holdings, totals: b } = useBook();
  const [advanced, setAdvanced] = useState(false);
  const top = holdings.slice(0, 3);

  return (
    <div className="pf-grid">
      <div className="pf-col-main">
        <HeroCard hidden={hidden} setHidden={setHidden} />

        {b.incompleteCount > 0 && (
          <button
            type="button"
            className="pf-warn"
            onClick={() =>
              openSheet({
                kind: "quick",
                title: "Calculation incomplete",
                body: `${b.incompleteCount} holding has a transaction without a recorded price, so its average cost, P/L and your total return are estimates.`,
                note: "Fix the transaction and every number recalculates.",
              })
            }
          >
            <Icon name="info" size={16} />
            <span>
              <strong>Calculation incomplete</strong>
              <small>
                {b.incompleteCount} holding is missing a price. Average cost, P/L and total return are estimates until it is fixed.
              </small>
            </span>
            <em>Fix ›</em>
          </button>
        )}

        <PfBlock
          title="Holdings"
          note={b.count > 3 ? `3 of ${b.count} · ${money(b.marketValue, hidden)}` : `${b.count} ${b.count === 1 ? "position" : "positions"} · ${money(b.marketValue, hidden)}`}
          action="View all ›"
          onAction={() => go("portfolio", { portfolioTab: "Holdings" })}
        >
          <div className="pf-hlist">
            {top.map((row) => (
              <HoldingRowCard
                key={row.symbol}
                row={row}
                hidden={hidden}
                onOpen={() => go("holding", { holdingMode: "detail", holding: row.symbol })}
              />
            ))}
          </div>
        </PfBlock>

      </div>

      <div className="pf-col-side">
        <AttentionBlock />
        <IncomeSummary hidden={hidden} />
        <PfBlock
          title="What's happening"
          action="View more ›"
          onAction={() => go("happening")}
        >
          <HappenList
            items={bookHappen.slice(0, 3)}
            onOpen={(item: HappenItem) => item.stock && go("stock", { stock: item.stock })}
          />
        </PfBlock>
      </div>

      <div className="pf-col-full">
        <div className="pf-advanced">
          <Fold label="Advanced analytics" open={advanced} onToggle={() => setAdvanced((v) => !v)}>
            <AdvancedMetrics />
            <button
              type="button"
              className="text-link"
              onClick={() => go("portfolio", { portfolioTab: "Analytics" })}
            >
              Open analytics ›
            </button>
          </Fold>
        </div>

        <div className="pad" style={{ paddingTop: 14 }}>
          <Explain
            onClick={() =>
              openSheet({
                kind: "quick",
                title: "Why P/L is shown in parts",
                body: "Unrealised P/L is the gain on shares you still hold. Realised P/L is what completed sales actually returned. Dividends are cash you received. Adding them into one word — profit — hides which part is real money.",
                note: "MoneyMitra explains how your portfolio works. It never tells you what to buy or sell.",
              })
            }
          >
            Why is profit shown in parts?
          </Explain>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Holdings */

const sorts = [
  { id: "value", label: "Market value", get: (row: Holding) => row.marketValue },
  { id: "pl", label: "P/L amount", get: (row: Holding) => row.totalPl },
  { id: "plpct", label: "P/L %", get: (row: Holding) => row.plPct },
  { id: "day", label: "Day P/L", get: (row: Holding) => row.dayPl },
  { id: "weight", label: "Weight", get: (row: Holding) => row.weight },
  { id: "wacc", label: "Avg cost", get: (row: Holding) => row.wacc },
  { id: "ltp", label: "Price", get: (row: Holding) => row.ltp },
];

const filters = ["All", "Gainers", "Losers", "Dividend payers", "Corporate action"] as const;

function HoldingsTab({ hidden }: { hidden: boolean }) {
  const { go, viewport, openSheet } = useApp();
  const { holdings, totals: b } = useBook();
  const [sortId, setSortId] = useState("value");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState(false);
  const [wide, setWide] = useState(false);

  const rows = useMemo(() => {
    const sort = sorts.find((item) => item.id === sortId) ?? sorts[0];
    const needle = query.trim().toLowerCase();
    return holdings
      .filter((row) => {
        if (filter === "Gainers" && row.totalPl <= 0) return false;
        if (filter === "Losers" && row.totalPl >= 0) return false;
        if (filter === "Dividend payers" && row.dividend === 0) return false;
        if (filter === "Corporate action" && !row.pending) return false;
        if (needle && !`${row.symbol} ${row.name}`.toLowerCase().includes(needle)) return false;
        return true;
      })
      .sort((a, b2) => sort.get(b2) - sort.get(a));
  }, [sortId, filter, query, holdings]);

  const shownValue = rows.reduce((sum, row) => sum + row.marketValue, 0);
  const openHolding = (symbol: string) => go("holding", { holdingMode: "detail", holding: symbol });

  return (
    <>
      <div className="pf-tools">
        <label className="pf-search">
          <Icon name="search" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Symbol or company"
            spellCheck={false}
          />
        </label>
        <button type="button" className={`pf-tool${panel ? " on" : ""}`} onClick={() => setPanel((v) => !v)}>
          <Icon name="sliders" size={15} />
          Sort & filter
        </button>
        {viewport === "web" && (
          <button type="button" className={`pf-tool${wide ? " on" : ""}`} onClick={() => setWide((v) => !v)}>
            <Icon name="table" size={15} />
            {wide ? "Core columns" : "All columns"}
          </button>
        )}
      </div>

      {panel && (
        <div className="pf-panel">
          <p className="overline">Sort by</p>
          <div className="pf-panel-row">
            {sorts.map((item) => (
              <button
                key={item.id}
                type="button"
                className={sortId === item.id ? "on" : ""}
                onClick={() => setSortId(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="overline">Filter</p>
          <div className="pf-panel-row">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? "on" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="pf-count">
        {rows.length} of {b.count} holdings · {money(shownValue, hidden)}
      </p>

      {viewport === "web" ? (
        <div className="pf-table-wrap">
          <table className="sheet-table pf-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th className="num">Qty</th>
                <th className="num">Avg cost</th>
                <th className="num">Price</th>
                <th className="num">Market value</th>
                <th className="num">Day P/L</th>
                <th className="num">Total P/L</th>
                <th className="num">P/L %</th>
                <th className="num">Weight</th>
                {wide && <th className="num">Dividend</th>}
                {wide && <th>Sector</th>}
                {wide && <th className="num">52W</th>}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.symbol} onClick={() => openHolding(row.symbol)} tabIndex={0}>
                  <td>
                    <span className="sheet-name">
                      <TickerMark symbol={row.symbol} size="sm" />
                      <span>
                        <b className="t-ticker">{row.symbol}</b>
                        <small>{row.name}</small>
                      </span>
                    </span>
                  </td>
                  <td className="num">{npr(row.kitta)}</td>
                  <td className="num">
                    {npr(row.wacc, 2)}
                    {row.incomplete && <small className="pf-est">est.</small>}
                  </td>
                  <td className="num">
                    {npr(row.ltp, 2)}
                    <small className={tone(row.dayPct)}>{pct(row.dayPct)}</small>
                  </td>
                  <td className="num">{hidden ? VEIL : npr(row.marketValue)}</td>
                  <td className={`num ${tone(row.dayPl)}`}>{hidden ? VEIL : signed(row.dayPl)}</td>
                  <td className={`num ${tone(row.totalPl)}`}>{hidden ? VEIL : signed(row.totalPl)}</td>
                  <td className={`num ${tone(row.plPct)}`}>{pct(row.plPct)}</td>
                  <td className="num">{row.weight.toFixed(1)}%</td>
                  {wide && <td className="num">{row.dividend === 0 ? "—" : npr(row.dividend)}</td>}
                  {wide && <td>{row.sector}</td>}
                  {wide && (
                    <td className="num">
                      <span className="pf-52" aria-label={`${npr(row.low52, 0)} to ${npr(row.high52, 0)}`}>
                        <i style={{ left: `${Math.max(2, Math.min(98, row.range52 * 100))}%` }} />
                      </span>
                      <small>{(row.range52 * 100).toFixed(0)}%</small>
                    </td>
                  )}
                  <td className="pf-row-acts">
                    <button
                      type="button"
                      className="icon-btn sm"
                      aria-label={`More for ${row.symbol}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        openSheet({ kind: "stock-tools", symbol: row.symbol });
                      }}
                    >
                      <Icon name="dots" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="foot-note">No holding matches this filter.</p>}
        </div>
      ) : (
        <div className="pf-hlist pad-list">
          {rows.map((row) => (
            <HoldingRowCard key={row.symbol} row={row} hidden={hidden} onOpen={() => openHolding(row.symbol)} />
          ))}
          {rows.length === 0 && <p className="foot-note">No holding matches this filter.</p>}
        </div>
      )}

      <p className="foot-note">
        Qty is kitta. Avg cost is what you paid, on average, for the shares you still hold. Price is the last traded print from the market. Tap a row for the position.
      </p>
    </>
  );
}

/* ---------------------------------------------------------------- Activity */

const txnTypes = ["All", "Buy", "Sell", "Corporate action"] as const;

function ActivityTab({ hidden }: { hidden: boolean }) {
  const { go, openSheet, portfolioId } = useApp();
  const [type, setType] = useState<(typeof txnTypes)[number]>("All");
  const all = activityFor(portfolioId);

  const rows = all.filter((row) => {
    if (type === "All") return true;
    if (type === "Corporate action") return Boolean(row.corporate);
    return row.type === type;
  });

  const months = [...new Set(rows.map((row) => row.month))];

  return (
    <>
      <div className="pf-tools">
        <div className="pf-panel-row inline">
          {txnTypes.map((item) => (
            <button key={item} type="button" className={type === item ? "on" : ""} onClick={() => setType(item)}>
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="pf-tool"
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "Export activity",
              body: "Your transaction log can be exported as CSV or PDF, including charges and the position after each entry.",
              note: "Exports contain only what you recorded.",
            })
          }
        >
          <Icon name="doc" size={15} />
          Export
        </button>
      </div>

      {months.length === 0 && (
        <PfBlock title="Activity">
          <p className="pf-empty">
            <strong>No transactions recorded</strong>
            <small>
              Nothing has been entered against this portfolio yet. Add a transaction and the audit trail starts here.
            </small>
          </p>
        </PfBlock>
      )}

      {months.map((month) => (
        <PfBlock key={month} title={month}>
          <ul className="pf-txn-list">
            {rows
              .filter((row) => row.month === month)
              .map((row) => (
                <TxnRow
                  key={row.id}
                  row={row}
                  hidden={hidden}
                  onOpen={() => go("holding", { holdingMode: "detail", holding: row.symbol })}
                />
              ))}
          </ul>
        </PfBlock>
      ))}

      <p className="foot-note">
        This is the audit trail. Editing an entry shows what will recalculate before it is saved, and nothing is deleted
        silently.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ Income */

function IncomeCard({ row, hidden }: { row: IncomeEvent; hidden: boolean }) {
  const { openSheet, go } = useApp();
  const shift = row.before != null && row.after != null;

  return (
    <div className="pf-inc">
      <header>
        <button type="button" className="pf-inc-id" onClick={() => go("stock", { stock: row.symbol })}>
          <TickerMark symbol={row.symbol} size="sm" />
          <span>
            <strong className="t-ticker">{row.symbol}</strong>
            <small>{row.name}</small>
          </span>
        </button>
        <span className={`pf-status ${row.status.toLowerCase()}`}>{row.status}</span>
      </header>
      <p className="pf-inc-kind">
        {row.kind} · {row.rate}
      </p>
      {shift && (
        <p className="pf-inc-shift">
          <b>{npr(row.before!)} kitta</b>
          <i aria-hidden>→</i>
          <span>{row.kind}</span>
          <i aria-hidden>→</i>
          <b>{npr(row.after!)} kitta</b>
        </p>
      )}
      <dl className="pf-inc-grid">
        <div>
          <dt>Eligible qty</dt>
          <dd>{npr(row.eligible)}</dd>
        </div>
        {row.gross > 0 && (
          <>
            <div>
              <dt>Gross</dt>
              <dd>{money(row.gross, hidden)}</dd>
            </div>
            <div>
              <dt>Tax</dt>
              <dd>{money(row.tax, hidden)}</dd>
            </div>
            <div>
              <dt>Net</dt>
              <dd className="strong">{money(row.net, hidden)}</dd>
            </div>
          </>
        )}
      </dl>
      <footer>
        <span>{row.dates}</span>
        <button
          type="button"
          className="text-link"
          onClick={() =>
            openSheet({
              kind: "quick",
              title: `${row.symbol} ${row.kind.toLowerCase()}`,
              body: shift
                ? `${row.rate}. Your position moves from ${npr(row.before!)} to ${npr(row.after!)} kitta. Cost basis does not change, so average cost is restated across the larger quantity.`
                : `${row.rate} on ${npr(row.eligible)} kitta. Gross Rs ${npr(row.gross)}, tax Rs ${npr(row.tax)}, net Rs ${npr(row.net)}.`,
              note: row.dates,
            })
          }
        >
          Event detail ›
        </button>
      </footer>
    </div>
  );
}

function IncomeTabView({ hidden }: { hidden: boolean }) {
  const { portfolioId } = useApp();
  const [tab, setTab] = useState<IncomeTab>("Dividends");
  const rows = incomeFor(portfolioId).filter((row) => row.tab === tab);
  const net = rows.reduce((sum, row) => sum + row.net, 0);

  return (
    <>
      <div className="pf-subtabs">
        {incomeTabs.map((item) => (
          <button key={item} type="button" className={tab === item ? "on" : ""} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>
      <PfBlock
        title={tab}
        note={
          rows.length === 0
            ? "No tracked records"
            : net > 0
              ? `${rows.length} records · net ${money(net, hidden)}`
              : `${rows.length} records`
        }
      >
        {rows.length === 0 ? (
          <p className="pf-empty">
            <strong>No tracked records</strong>
            <small>
              Nothing recorded here yet. That is not the same as Rs 0 — add the event and this fills in.
            </small>
          </p>
        ) : (
          <div className="pf-inc-list">
            {rows.map((row) => (
              <IncomeCard key={row.id} row={row} hidden={hidden} />
            ))}
          </div>
        )}
      </PfBlock>
      <p className="foot-note">
        Bonus and rights always show before → after, so a quantity change is never something you have to infer.
      </p>
    </>
  );
}

/* --------------------------------------------------------------- Analytics */

function AdvancedMetrics() {
  const explain = useExplain();
  const rows = [
    { label: "XIRR", ...analyticsNotes.xirr },
    { label: "TWR", ...analyticsNotes.twr },
    { label: "Turnover", ...analyticsNotes.turnover },
  ];

  return (
    <div className="pf-adv">
      {rows.map((row) => (
        <button
          key={row.label}
          type="button"
          className="pf-adv-cell"
          onClick={() => explain(row.label, row.body, "Period: 12 Ashadh 2083 to today.")}
        >
          <span>
            {row.label}
            <Icon name="info" size={12} />
          </span>
          <b>{row.value}</b>
        </button>
      ))}
    </div>
  );
}

function AnalyticsTab({ hidden }: { hidden: boolean }) {
  const { go } = useApp();
  const { holdings, sectors, totals: b } = useBook();
  const [terms, setTerms] = useState(false);
  const winners = contributors(holdings, "win");
  const losers = contributors(holdings, "lose");
  const spread = Math.max(...holdings.map((row) => Math.abs(row.totalPl)));

  return (
    <>
      <PfBlock title="Realised vs unrealised" note="Kept apart on purpose">
        <div className="pf-split">
          <div>
            <span>Unrealised P/L</span>
            <b className={tone(b.unrealised)}>{signedMoney(b.unrealised, hidden)}</b>
            <em className={tone(b.unrealised)}>{pct(b.unrealisedPct)}</em>
            <small>On shares you still hold. Not cash.</small>
          </div>
          <div>
            <span>Realised P/L</span>
            <b className={b.realised === 0 ? "dim" : tone(b.realised)}>
              {b.realised === 0 ? "No sales yet" : signedMoney(b.realised, hidden)}
            </b>
            <em className={tone(b.realised)}>{b.realised === 0 ? "" : pct((b.realised / b.costBasis) * 100)}</em>
            <small>From completed sales, after charges and tax.</small>
          </div>
          <div>
            <span>Recorded dividends</span>
            <b className={b.dividends === 0 ? "dim" : undefined}>
              {b.dividends === 0 ? "No records" : money(b.dividends, hidden)}
            </b>
            <em>{b.dividends === 0 ? "" : pct((b.dividends / b.costBasis) * 100)}</em>
            <small>Yield on cost, from what you recorded.</small>
          </div>
        </div>
      </PfBlock>

      <PfBlock title="Contributors" note="Share of your unrealised P/L, not a ranking of companies">
        <div className="pf-contrib">
          <div>
            <p className="overline">Adding most</p>
            {winners.length === 0 && <p className="foot-note">No position is in gain right now.</p>}
            {winners.map((row) => (
              <button
                key={row.symbol}
                type="button"
                className="pf-contrib-row"
                onClick={() => go("holding", { holdingMode: "detail", holding: row.symbol })}
              >
                <span>{row.symbol}</span>
                <span className="pf-bar up" aria-hidden>
                  <i style={{ width: `${(row.totalPl / spread) * 100}%` }} />
                </span>
                <b className="c-up">{signedMoney(row.totalPl, hidden)}</b>
              </button>
            ))}
          </div>
          <div>
            <p className="overline">Taking away most</p>
            {losers.length === 0 && <p className="foot-note">No position is in loss right now.</p>}
            {losers.map((row) => (
              <button
                key={row.symbol}
                type="button"
                className="pf-contrib-row"
                onClick={() => go("holding", { holdingMode: "detail", holding: row.symbol })}
              >
                <span>{row.symbol}</span>
                <span className="pf-bar down" aria-hidden>
                  <i style={{ width: `${(Math.abs(row.totalPl) / spread) * 100}%` }} />
                </span>
                <b className="c-down">{signedMoney(row.totalPl, hidden)}</b>
              </button>
            ))}
          </div>
        </div>
      </PfBlock>

      <PfBlock title="Sector contribution">
        <ul className="pf-alloc-list flat">
          {sectors.map((row) => (
            <li key={row.name}>
              <i style={{ background: row.color }} />
              <span className="pf-alloc-name">
                <strong>{row.name}</strong>
                <small>{row.pct}% of book</small>
              </span>
              <span className="pf-alloc-meta">
                <b className={tone(row.changePct)}>{pct(row.changePct)}</b>
                <em>{money(row.value, hidden)}</em>
              </span>
            </li>
          ))}
        </ul>
      </PfBlock>

      <PfBlock title="Return measures" note="Each one states its period and method">
        <AdvancedMetrics />
        <p className="foot-note">
          Deposits, withdrawals and corporate actions distort simple percentages. These figures cover 12 Ashadh 2083 to
          today, and one missing buy price makes them estimates.
        </p>
      </PfBlock>

      <div className="pf-advanced">
        <Fold label="What these words mean" count={glossary.length} open={terms} onToggle={() => setTerms((v) => !v)}>
          <dl className="pf-gloss">
            {glossary.map((row) => (
              <div key={row.term}>
                <dt>{row.term}</dt>
                <dd>{row.meaning}</dd>
              </div>
            ))}
          </dl>
        </Fold>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Screen */

function PortfolioHeader() {
  const { go, openSheet } = useApp();
  const { totals: b } = useBook();

  return (
    <header className="pf-head">
      <div className="pf-head-id">
        <button
          type="button"
          className="pf-switcher"
          onClick={() => openSheet({ kind: "portfolio-switch" })}
          aria-haspopup="dialog"
          aria-label={`Switch portfolio. Current: ${b.name}`}
        >
          <span>{b.name}</span>
          <em className="pf-switcher-chev" aria-hidden>
            <Icon name="chev" size={12} />
          </em>
        </button>
      </div>
      <div className="pf-head-acts">
        <button
          type="button"
          className="icon-btn"
          aria-label="Add transaction"
          onClick={() => go("holding", { holdingMode: "add" })}
        >
          <Icon name="plus" size={19} />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label="Portfolio options"
          onClick={() => openSheet({ kind: "portfolio-menu" })}
        >
          <Icon name="dots" />
        </button>
      </div>
    </header>
  );
}

/* Spec §14 — no portfolio yet. One screen: what lands here, and the two ways in. */
const zeroAlloc = [
  { short: "BANKS", pct: 42, color: "#5b8cff" },
  { short: "HYDRO", pct: 26, color: "#32e36a" },
  { short: "MFG", pct: 18, color: "#f08c00" },
  { short: "OTHER", pct: 14, color: "#8b8b8b" },
];

function PortfolioEmpty() {
  const { go, openSheet } = useApp();
  return (
    <div className="pf-screen pf-zero">
      <div className="pf-zero-art" aria-hidden>
        <div className="pf-zero-card">
          <span className="book-card-head">
            <span>Your portfolio</span>
            <em>after you add</em>
          </span>
          <span className="book-card-figures ghost">
            <b>Rs —.—</b>
            <em>+Rs —</em>
          </span>
          <AllocStrip rows={zeroAlloc} ghost legend={false} />
        </div>
      </div>

      <div className="pf-zero-copy">
        <h2>Nothing in your book yet</h2>
      </div>

      <div className="pf-quick">
        <button type="button" className="pf-quick-btn primary" onClick={() => go("holding", { holdingMode: "add" })}>
          <Icon name="plus" size={16} />
          Add a holding
        </button>
        <button type="button" className="pf-quick-btn" onClick={() => openSheet({ kind: "portfolio-import" })}>
          <Icon name="doc" size={16} />
          Import
        </button>
      </div>

    </div>
  );
}

export function PortfolioScreen() {
  const { go, stage, openSheet, hasPortfolio, bookNudgeDismissed, dismissBookNudge, portfolioTab: tab, setPortfolioTab } = useApp();
  const [hidden, setHidden] = useState(false);

  if (!hasPortfolio) return <PortfolioEmpty />;

  /* Spec §14 — no portfolio: explain, then offer add or import. */
  if (stage === "explorer") {
    if (!bookNudgeDismissed) {
      return (
        <div className="pf-screen">
          <div className="pad" style={{ paddingTop: 12 }}>
            <BookNudge
              kicker="Nothing here yet"
              onAdd={() => go("holding", { holdingMode: "add" })}
              onDismiss={dismissBookNudge}
            />
            <p className="t-body-xs muted" style={{ marginTop: 14 }}>
              We can’t read your broker, and every edit keeps its history.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="pf-screen">
        <PortfolioHeader />
        <div className="pf-empty-hero">
          <h2>Add your first holding</h2>
          <p>
            A portfolio needs at least one recorded buy before it can show value, average cost or P/L. Add one by hand, or paste a
            statement and review each row.
          </p>
          <div className="pf-quick">
            <button type="button" className="pf-quick-btn primary" onClick={() => go("holding", { holdingMode: "add" })}>
              <Icon name="wallet" size={16} />
              Add transaction
            </button>
            <button
              type="button"
              className="pf-quick-btn"
              onClick={() =>
                openSheet({
                  kind: "portfolio-import",
                })
              }
            >
              <Icon name="doc" size={16} />
              Import
            </button>
          </div>
          <p className="foot-note">
            Mitra can explain kitta, average cost and cost basis before you record anything.
          </p>
        </div>
      </div>
    );
  }

  if (stage === "primary") {
    return (
      <div className="pf-screen">
        <PortfolioHeader />
        <div className="pad"><Overline>IPO pipeline</Overline></div>
        <div className="pad" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <p className="t-display-l">{npr(ipoPipeline.value)}</p>
        </div>
        <p className="pad t-body-xs muted">
          {ipoPipeline.kitta} kitta across {ipoPipeline.count} IPOs · par Rs 100. Not yet listed on the secondary market.
        </p>
        <div className="gap-16" />
        <SectionHead title="Allotments" />
        {allotments.map((a) => (
          <div key={a.name} className="row">
            <span className={`event-bar ${a.status === "allotted" ? "up" : "warn"}`} />
            <div className="row-main">
              <p className="t-h-s">{a.name}</p>
              <p className="row-sub">
                {a.status === "allotted" ? `${a.kitta} kitta allotted` : "Awaiting allotment"}
              </p>
            </div>
          </div>
        ))}
        <p className="foot-note">MoneyMitra tracks status. Allotment is still at CDSC / MeroShare.</p>
      </div>
    );
  }

  return (
    <div className="pf-screen">
      <PortfolioHeader />

      <div className="tabs pf-tabs">
        {tabs.map((item) => (
          <button key={item} className={tab === item ? "on" : ""} onClick={() => setPortfolioTab(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className={`pf-body pf-body-${tab.toLowerCase()}`}>
        {tab === "Overview" && <OverviewTab hidden={hidden} setHidden={setHidden} />}
        {tab === "Holdings" && <HoldingsTab hidden={hidden} />}
        {tab === "Allocation" && <AllocationBlock hidden={hidden} />}
        {tab === "Activity" && <ActivityTab hidden={hidden} />}
        {tab === "Income" && <IncomeTabView hidden={hidden} />}
        {tab === "Analytics" && <AnalyticsTab hidden={hidden} />}
      </div>

     
    </div>
  );
}

/* --------------------------------------------------------- Holding detail */

/** Spec §5 — position history with the WACC line and transaction markers. */
function HoldingChart({ row }: { row: Holding }) {
  const tape = bookRangeTape(row.ltp, row.ltp - row.prevClose, row.ltp - row.wacc, "3M");
  const values = tape.prints.map((print) => print.v);
  const min = Math.min(...values, row.wacc);
  const max = Math.max(...values, row.wacc);
  const pad = (max - min) * 0.18 || 1;
  const lo = min - pad;
  const hi = max + pad;
  const w = 320;
  const h = 108;
  const x = (i: number) => (i / (values.length - 1)) * w;
  const y = (v: number) => h - ((v - lo) / (hi - lo)) * h;
  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const marks = [
    { i: 1, label: "Buy" },
    { i: Math.floor(values.length / 2), label: "Event" },
  ];

  return (
    <div className="pf-hchart">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={`${row.symbol} price with cost line`}>
        <line className="pf-hchart-wacc" x1="0" x2={w} y1={y(row.wacc)} y2={y(row.wacc)} />
        <path className={`pf-hchart-line ${row.totalPl >= 0 ? "up" : "down"}`} d={line} />
        {marks.map((mark) => (
          <circle key={mark.label} className="pf-hchart-mark" cx={x(mark.i)} cy={y(values[mark.i])} r="3.5" />
        ))}
      </svg>
      <div className="pf-hchart-key">
        <span className="wacc">Your cost {npr(row.wacc, 2)}</span>
        <span className="mark">Transactions & events</span>
        <span>3M</span>
      </div>
    </div>
  );
}

const eventLook: Record<StockEvent["kind"], { label: string; icon: "cal" | "doc" | "news" | "users" }> = {
  deadline: { label: "Deadline", icon: "cal" },
  result: { label: "Result", icon: "doc" },
  news: { label: "News", icon: "news" },
  meeting: { label: "Meeting", icon: "users" },
};

/** What is coming up on this stock, and what has been said about it. */
function HoldingEvents({ row }: { row: Holding }) {
  const { openSheet } = useApp();
  const { deadlines, news } = eventsFor(row.symbol);
  const [all, setAll] = useState(false);
  const shownNews = all ? news : news.slice(0, 2);

  const open = (event: StockEvent) => {
    const look = eventLook[event.kind];
    openSheet({
      kind: "quick",
      title: event.title,
      body:
        event.daysLeft != null
          ? `${event.sub}. This lands on ${event.date}, ${event.daysLeft} days from today. If you sell before it, you stop being eligible.`
          : `${event.sub}`,
      note: event.source ? `${look.label} · ${event.source} · ${event.date}` : `${look.label} · ${event.date}`,
    });
  };

  if (deadlines.length === 0 && news.length === 0) {
    return (
      <PfBlock title="Events & news">
        <p className="pf-empty">
          <strong>Nothing tracked for {row.symbol}</strong>
          <small>No deadline or disclosure has been recorded against this company yet.</small>
        </p>
      </PfBlock>
    );
  }

  return (
    <PfBlock
      title="Events & news"
      note={
        deadlines.length > 0
          ? `${deadlines.length} ${deadlines.length === 1 ? "date" : "dates"} you can still miss`
          : "Nothing time-sensitive right now"
      }
    >
      {deadlines.length > 0 && (
        <ul className="pf-ev-dead">
          {deadlines.map((event) => (
            <li key={event.id}>
              <button type="button" onClick={() => open(event)}>
                <span className={`pf-ev-days${(event.daysLeft ?? 99) <= 7 ? " soon" : ""}`}>
                  <b>{event.daysLeft}</b>
                  <i>days</i>
                </span>
                <span className="pf-ev-copy">
                  <strong>{event.title}</strong>
                  <small>{event.sub}</small>
                  <small className="pf-ev-when">
                    <Icon name="cal" size={11} />
                    {event.date}
                  </small>
                </span>
                <em aria-hidden>›</em>
              </button>
            </li>
          ))}
        </ul>
      )}

      {news.length > 0 && (
        <ul className="pf-ev-news">
          {shownNews.map((event) => {
            const look = eventLook[event.kind];
            return (
              <li key={event.id}>
                <button type="button" onClick={() => open(event)}>
                  <span className={`pf-ev-ico ${event.kind}`} aria-hidden>
                    <Icon name={look.icon} size={14} />
                  </span>
                  <span className="pf-ev-copy">
                    <strong>{event.title}</strong>
                    <small>{event.sub}</small>
                    <small className="pf-ev-when">
                      {look.label} · {event.date}
                      {event.source ? ` · ${event.source}` : ""}
                    </small>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {news.length > 2 && (
        <button type="button" className="pf-ev-more" onClick={() => setAll((v) => !v)}>
          {all ? "Show less" : `Show ${news.length - 2} more`}
        </button>
      )}
      <p className="foot-note">
        We record what was announced and when. We never read it as a reason to buy or sell.
      </p>
    </PfBlock>
  );
}

const timeline = [
  { date: "1 Bhadra 2083", title: "Cash dividend eligible", sub: "10% on the recorded position" },
  { date: "12 Ashadh 2083", title: "Buy 180 kitta @ 462.40", sub: "Charges Rs 337.10" },
  { date: "4 Jestha 2083", title: "Buy 350 kitta @ 448.00", sub: "Charges Rs 546.20" },
  { date: "22 Chaitra 2082", title: "Transfer in 260 kitta", sub: "Basis Rs 481.60 recorded by you" },
];

export function HoldingScreen() {
  const { back, go, holdingMode, holdingSymbol, openSheet, correctedKitta, fulfillObjective, flash, portfolioId } =
    useApp();
  const { holdings } = bookFor(portfolioId);
  const row =
    holdings.find((item) => item.symbol === holdingSymbol) ??
    bookHoldings.find((item) => item.symbol === holdingSymbol) ??
    holdings[0];
  const kitta = correctedKitta ?? row.kitta;
  const corrected = correctedKitta !== null && correctedKitta !== row.kitta;

  if (holdingMode === "detail") {
    return (
      <div className="pf-detail">
        <div className="app-bar">
          <button className="icon-btn" onClick={back} aria-label="Back"><Icon name="back" /></button>
          <div className="pf-detail-id">
            <p className="t-ticker">{row.symbol}</p>
            <p className="t-body-xs muted">{row.name} · {row.sector}</p>
          </div>
          <button
            className="icon-btn"
            aria-label="More"
            onClick={() => openSheet({ kind: "stock-tools", symbol: row.symbol })}
          >
            <Icon name="dots" />
          </button>
        </div>

        <div className="pf-detail-quote">
          <b>{npr(row.ltp, 2)}</b>
          <em className={tone(row.dayPct)}>
            {signed(row.ltp - row.prevClose, 2)} {pct(row.dayPct)}
          </em>
          <button type="button" className="text-link" onClick={() => go("stock", { stock: row.symbol })}>
            Company detail ›
          </button>
        </div>

        <PfBlock title="Your position">
          <dl className="pf-pos">
            <div>
              <dt>Quantity</dt>
              <dd>{npr(kitta)} kitta</dd>
            </div>
            <div>
              <dt>
                <button
                  type="button"
                  className="pf-dt-link"
                  onClick={() =>
                    openSheet({
                      kind: "quick",
                      title: "How this average cost is built",
                      body: `Rs ${npr(row.wacc, 2)} is the average cost of your ${npr(row.kitta)} kitta, across every recorded buy, transfer and bonus. Charges are included where you recorded them. Brokers call this WACC.`,
                      note: "Sold lots are removed from this average and settled into realised P/L.",
                    })
                  }
                >
                  Avg cost <Icon name="info" size={12} />
                </button>
              </dt>
              <dd>{npr(row.wacc, 2)}</dd>
            </div>
            <div>
              <dt>
                <button
                  type="button"
                  className="pf-dt-link"
                  onClick={() =>
                    openSheet({
                      kind: "quick",
                      title: "Price",
                      body: `Rs ${npr(row.ltp, 2)} is the last traded print for ${row.symbol}. Market value uses this price × kitta.`,
                      note: "Brokers call this LTP. It is a print with a time, not a live promise.",
                    })
                  }
                >
                  Price <Icon name="info" size={12} />
                </button>
              </dt>
              <dd>{npr(row.ltp, 2)}</dd>
            </div>
            <div>
              <dt>Cost basis</dt>
              <dd>Rs {npr(row.costBasis)}</dd>
            </div>
            <div>
              <dt>Market value</dt>
              <dd>Rs {npr(row.marketValue)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{row.weight.toFixed(1)}% of book</dd>
            </div>
            <div>
              <dt>Recorded dividends</dt>
              <dd>{row.dividend === 0 ? "No tracked records" : `Rs ${npr(row.dividend)}`}</dd>
            </div>
          </dl>
        </PfBlock>

        <PfBlock title="Performance">
          <div className="pf-detail-perf">
            <div>
              <span>Unrealised P/L</span>
              <b className={tone(row.totalPl)}>{signedMoney(row.totalPl, false)}</b>
              <em className={tone(row.plPct)}>{pct(row.plPct)}</em>
            </div>
            <div>
              <span>Day P/L</span>
              <b className={tone(row.dayPl)}>{signedMoney(row.dayPl, false)}</b>
              <em className={tone(row.dayPct)}>{pct(row.dayPct)}</em>
            </div>
          </div>
          <HoldingChart row={row} />
          {row.incomplete && (
            <p className="pf-inline-warn">
              <Icon name="info" size={14} />
              {row.incomplete}
            </p>
          )}
        </PfBlock>

        <HoldingEvents row={row} />

        {row.pending && (
          <PfBlock title="Corporate action">
            <div className="pf-pending">
              <strong>{row.pending}</strong>
              <p>
                Nothing has been applied to your quantity or cost basis. When the event is confirmed, we will show the
                before and after instead of changing the numbers quietly.
              </p>
              <span className="pf-status announced">Pending</span>
            </div>
          </PfBlock>
        )}

        <PfBlock title="Timeline" note="Every change to this position">
          <ol className="pf-timeline">
            {corrected && (
              <li>
                <span className="pf-time-date">Today</span>
                <div>
                  <strong>Correction · {npr(kitta)} kitta</strong>
                  <small>Original entry preserved</small>
                </div>
                <span className="audit on">Correction</span>
              </li>
            )}
            {timeline.map((item) => (
              <li key={item.title}>
                <span className="pf-time-date">{item.date}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.sub}</small>
                </div>
              </li>
            ))}
          </ol>
        </PfBlock>

        <div className="pf-detail-acts">
          <button type="button" className="pf-quick-btn primary" onClick={() => go("holding", { holdingMode: "add" })}>
            Add transaction
          </button>
          <button type="button" className="pf-quick-btn" onClick={() => go("alerts")}>
            Set alert
          </button>
          <button type="button" className="pf-quick-btn" onClick={() => openSheet({ kind: "correct" })}>
            Something wrong?
          </button>
        </div>
        <p className="foot-note">
          This page is about your position. Charts, ratios and technicals live on the company page.
        </p>
      </div>
    );
  }

  return (
    <TransactionForm
      onSaved={() => {
        if (!fulfillObjective("book")) {
          flash({ message: "Holding saved. We don’t place orders.", tone: "good" });
        }
        go("portfolio");
      }}
    />
  );
}

/* ------------------------------------------------------ Add / edit txn §6 */

const txnKinds = ["Buy", "Sell", "Bonus", "Right share", "Dividend", "Transfer in"] as const;

function TransactionForm({ onSaved }: { onSaved: () => void }) {
  const { back, openSheet, portfolioId } = useApp();
  const { holdings, totals: b } = bookFor(portfolioId);
  const [kind, setKind] = useState<(typeof txnKinds)[number]>("Buy");
  const [symbol, setSymbol] = useState(holdings[0]?.symbol ?? "NABIL");
  const [date, setDate] = useState("2 Bhadra 2083");
  const [kitta, setKitta] = useState("100");
  const [price, setPrice] = useState("498");
  const [note, setNote] = useState("");

  const qty = Number(kitta) || 0;
  const rate = Number(price) || 0;
  const amount = qty * rate;
  const charges = buyCharges(amount);
  const effective = qty === 0 ? 0 : charges.payable / qty;

  return (
    <div className="pf-form">
      <div className="app-bar">
        <button className="icon-btn" onClick={back} aria-label="Back"><Icon name="back" /></button>
        <h1>Add transaction</h1>
      </div>
      <p className="pad t-body-xs muted" style={{ paddingBottom: 8 }}>
        Recording into <b>{b.name}</b>
      </p>

      <div className="pf-form-kinds">
        {txnKinds.map((item) => (
          <button key={item} type="button" className={kind === item ? "on" : ""} onClick={() => setKind(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="pf-fields">
        <label className="pf-field">
          <span>Company</span>
          <select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
            {holdings.map((row) => (
              <option key={row.symbol} value={row.symbol}>
                {row.symbol} · {row.name}
              </option>
            ))}
          </select>
        </label>
        <label className="pf-field">
          <span>Date</span>
          <input value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label className="pf-field">
          <span>Quantity (kitta)</span>
          <input value={kitta} inputMode="numeric" onChange={(event) => setKitta(event.target.value)} />
        </label>
        {kind !== "Bonus" && (
          <label className="pf-field">
            <span>Price per share</span>
            <input value={price} inputMode="decimal" onChange={(event) => setPrice(event.target.value)} />
          </label>
        )}
      </div>

      <PfBlock title="Charges" note={chargeRules.version}>
        <dl className="pf-charges">
          <div>
            <dt>Transaction value</dt>
            <dd>{npr(amount, 2)}</dd>
          </div>
          {charges.rows.map((charge) => (
            <div key={charge.label}>
              <dt>
                {charge.label}
                <small>{charge.note}</small>
              </dt>
              <dd>{npr(charge.value, 2)}</dd>
            </div>
          ))}
          <div className="total">
            <dt>Total payable</dt>
            <dd>{npr(charges.payable, 2)}</dd>
          </div>
          <div className="total">
            <dt>Effective cost per share</dt>
            <dd>{npr(effective, 2)}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="text-link"
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "How charges are applied",
              body: `Broker commission uses the slab for this amount, SEBON fee is 0.015%, and DP charge is Rs 25 per company per day. Rates follow ${chargeRules.version} and are versioned, because they change.`,
              note: "Charges are folded into your cost basis, which is why effective cost is higher than the price.",
            })
          }
        >
          How is this calculated?
        </button>
      </PfBlock>

      <label className="pf-field pf-field-wide">
        <span>Note (optional)</span>
        <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Contract note number, reason…" />
      </label>

      <div className="pf-form-save">
        <p className="pf-form-effect">
          Saving updates <b>{symbol}</b> quantity, average cost and the value of {b.name}. We will show you each change.
        </p>
        <button type="button" className="pf-quick-btn primary block" onClick={onSaved}>
          Save {kind.toLowerCase()}
        </button>
        <p className="foot-note">Nothing is written until you save, and history is never deleted.</p>
      </div>
    </div>
  );
}
