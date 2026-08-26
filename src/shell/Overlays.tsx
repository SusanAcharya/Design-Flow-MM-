import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { UserAvatar } from "../ds/UserAvatar";
import { Button } from "../ds/primitives";
import { Icon } from "../ds/Icon";
import {
  circuitCopy,
  compareRows,
  metrics,
  nabil,
  nabilLedger,
} from "../lib/data";
import { npr, signed } from "../lib/format";
import {
  attentionFor,
  importPortals,
  importPreview,
  portfolioList,
  type PortfolioId,
  type PortfolioKind,
} from "../lib/portfolio";
import { planFeatures, planMeta } from "../lib/explore";
import { activeTab } from "../lib/nav";
import { stageMeta, stageOrder } from "../lib/stage";
import { useApp } from "../lib/state";
import type { Plan, PlanCycle, Route, Stage } from "../lib/types";

export function MetricLink({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { openSheet } = useApp();
  return (
    <button type="button" className="metric-link" onClick={() => openSheet({ kind: "metric", id })}>
      {children}
    </button>
  );
}

const DISMISS_AT = 96;

function SheetFrame({
  children,
  onClose,
  tall,
  from = "bottom",
  labelledBy,
}: {
  children: ReactNode;
  onClose: () => void;
  tall?: boolean;
  from?: "bottom" | "left";
  labelledBy?: string;
}) {
  const drawer = from === "left";
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragFrom = useRef<number | null>(null);
  const dragged = useRef(false);
  const [drag, setDrag] = useState(0);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    sheetRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  const startDrag = (e: ReactPointerEvent<HTMLElement>) => {
    dragFrom.current = e.clientY;
    dragged.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const moveDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (dragFrom.current === null) return;
    const dy = e.clientY - dragFrom.current;
    if (Math.abs(dy) > 6) dragged.current = true;
    setDrag(Math.max(0, dy));
  };
  const endDrag = () => {
    if (dragFrom.current === null) return;
    dragFrom.current = null;
    if (drag > DISMISS_AT) onClose();
    else setDrag(0);
  };
  // The grab bar doubles as a tap-to-close target, so ignore the click a drag leaves behind.
  const grabClick = () => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    onClose();
  };

  return (
    <div
      className={`sheet-backdrop${drawer ? " from-left" : ""}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={sheetRef}
        className={`sheet${tall ? " sheet-tall" : ""}${drawer ? " sheet-drawer" : ""}${drag ? " is-dragging" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={drag ? { transform: `translateY(${drag}px)` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {!drawer && (
          <button
            type="button"
            className="sheet-grab"
            aria-label="Close"
            onClick={grabClick}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <span className="sheet-handle" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

function ProfileSheet() {
  const { stage, setStage, closeSheet, densityLocked } = useApp();
  return (
    <>
      <p className="overline">You</p>
      <div className="ob-profile-row">
        <UserAvatar size={48} />
        <div>
          <p className="t-h-l">Sandip</p>
          <p className="t-body-s muted">{stageMeta[stage].label} · Home follows this title. The people in onboarding were just a way in.</p>
        </div>
      </div>
      {densityLocked && (
        <p className="t-body-xs" style={{ marginTop: 10, color: "var(--warn-text)" }}>
          Density lock is on in More. Auto-changes are paused; this still works.
        </p>
      )}
      <div className="stack" style={{ gap: 8, marginTop: 16 }}>
        {stageOrder.map((id) => {
          const m = stageMeta[id];
          const on = stage === id;
          return (
            <button
              key={id}
              type="button"
              className={`choice ${on ? "on" : ""}`}
              onClick={() => {
                setStage(id as Stage);
                closeSheet();
              }}
            >
              <span className="stage-dot" style={{ boxShadow: `0 0 0 2px ${m.ring}` }} />
              <div style={{ flex: 1 }}>
                <p className="t-h-s">{m.label}</p>
                <p className="t-body-xs muted">{m.blurb}</p>
              </div>
              <span className="radio" />
            </button>
          );
        })}
      </div>
    </>
  );
}

function QuickSheet({ title, body, note }: { title: string; body: string; note?: string }) {
  const { closeSheet } = useApp();
  return (
    <div className="quick-sheet">
      <header className="quick-sheet-head">
        <div>
          <p className="overline">In short</p>
          <h2 className="t-h-l" id="sheet-title">{title}</h2>
        </div>
        <button type="button" className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </header>
      <p className="t-body-m quick-sheet-body">{body}</p>
      {note && (
        <p className="quick-sheet-note">
          <Icon name="info" size={14} />
          <span>{note}</span>
        </p>
      )}
      <div className="quick-sheet-foot">
        <Button variant="primary" size="md" block onClick={closeSheet}>Got it</Button>
      </div>
    </div>
  );
}

function NavigationSheet() {
  const { go, closeSheet, openSheet, stage, route } = useApp();
  const current = activeTab(route);
  const routeTo = (next: Route) => {
    closeSheet();
    go(next);
  };
  return (
    <>
      <div className="drawer-profile">
        <UserAvatar size={36} />
        <span>
          <strong className="t-h-s">Sandip</strong>
          <small>{stageMeta[stage].label}</small>
        </span>
        <button type="button" className="icon-btn" onClick={() => openSheet({ kind: "profile" })} aria-label="Profile">
          <Icon name="chev" size={16} />
        </button>
      </div>
      <nav className="drawer-nav" aria-label="Primary">
        <button type="button" className={current === "home" ? "on" : ""} onClick={() => routeTo("home")}>
          <Icon name="home" size={18} /><span>Home</span>
        </button>
        <button type="button" className={current === "market" ? "on" : ""} onClick={() => routeTo("market")}>
          <Icon name="market" size={18} /><span>Market</span>
        </button>
        <button type="button" className={current === "ai" ? "on" : ""} onClick={() => routeTo("ai")}>
          <Icon name="tulkey" size={18} /><span>Tulkey</span>
        </button>
        <button type="button" className={current === "portfolio" ? "on" : ""} onClick={() => routeTo("portfolio")}>
          <Icon name="wallet" size={18} /><span>Portfolio</span>
        </button>
        <button type="button" className={current === "discover" ? "on" : ""} onClick={() => routeTo("discover")}>
          <Icon name="discover" size={18} /><span>Explore</span>
        </button>
      </nav>
      <p className="overline" style={{ margin: "18px 0 6px" }}>Go here</p>
      <div className="drawer-links">
        <button type="button" onClick={() => routeTo("watchlist")}><span>Watching</span><Icon name="chev" size={15} /></button>
        <button type="button" onClick={() => routeTo("brokers")}><span>Brokers</span><Icon name="chev" size={15} /></button>
        <button type="button" onClick={() => routeTo("baskets")}><span>Baskets</span><Icon name="chev" size={15} /></button>
        <button type="button" onClick={() => routeTo("objectives")}><span>Objectives</span><Icon name="chev" size={15} /></button>
        <button type="button" onClick={() => routeTo("discover")}><span>Tools & screener</span><Icon name="chev" size={15} /></button>
      </div>
    </>
  );
}

function MetricSheet({ id }: { id: string }) {
  const { closeSheet, go } = useApp();
  const m = metrics[id] ?? metrics.pe;
  return (
    <div className="metric-sheet">
      <div className="metric-sheet-head">
        <div>
          <p className="t-h-l">{m.name}</p>
          <p className="t-body-xs muted">Nabil Bank · what this number means</p>
        </div>
        <button className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </div>
      <div className="metric-sheet-value">
        <p className="hero-num">{m.value}</p>
        <span className="chip chip-quiet">
          {m.stock > m.sector ? "Above sector" : "Close to its sector"}
        </span>
      </div>
      <p className="t-body-m">{m.plain}</p>
      <p className="t-body-xs muted" style={{ marginTop: 10 }}>
        A low value is not automatically cheap and a high one is not automatically expensive. Compare it with similar companies, not across unrelated sectors.
      </p>
      <div className="metric-compare-list">
        <div><span>NABIL</span><b>{m.stock}</b></div>
        <div><span>Commercial bank average</span><b>{m.sector}</b></div>
        {m.nepseAvg > 0 && <div><span>NEPSE average</span><b>{m.nepseAvg}</b></div>}
      </div>
      <div className="metric-sheet-foot">
        <span>Explanations are educational, not advice.</span>
        <button
          className="text-link"
          onClick={() => {
            closeSheet();
            go("lesson", { lesson: m.lesson });
          }}
        >
          Learn more ›
        </button>
      </div>
    </div>
  );
}

function CircuitRulesSheet() {
  const { closeSheet, go } = useApp();
  return (
    <>
      <p className="overline">Circuit rules</p>
      <p className="t-h-l" style={{ margin: "8px 0 12px" }}>When NEPSE pauses</p>
      <div className="kv" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span>Index ±5%</span>
        <b>15-minute halt</b>
      </div>
      <div className="kv" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span>Index ±8%</span>
        <b>Rest of the session</b>
      </div>
      <div className="kv" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span>A single stock</span>
        <b>Daily 10% or 15% cap</b>
      </div>
      <p className="t-body-s muted" style={{ marginTop: 12 }}>
        Hitting the cap is a fact about the rule. It is not a buy or sell call.
      </p>
      <div className="btn-row" style={{ marginTop: 16 }}>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            closeSheet();
            go("lesson", { lesson: "Why prices stop at 15%" });
          }}
        >
          Open the lesson
        </Button>
        <Button variant="secondary" size="md" onClick={closeSheet}>Got it</Button>
      </div>
    </>
  );
}

function OrderSheet({ symbol }: { symbol: string }) {
  const { closeSheet } = useApp();
  return (
    <>
      <p className="overline">How an order is placed</p>
      <p className="t-h-l" style={{ margin: "8px 0" }}>{symbol} · TMS at your broker</p>
      <p className="t-body-m muted">
        If you decide to buy or sell {symbol}, that happens in TMS at your licensed broker. MoneyMitra does not place the order, hold cash, or recommend a side.
      </p>
      <div className="btn-row" style={{ marginTop: 16 }}>
        <Button variant="primary" size="md" onClick={closeSheet}>Continue to TMS</Button>
        <Button variant="secondary" size="md" onClick={closeSheet}>Got it</Button>
      </div>
    </>
  );
}

function StockToolsSheet({ symbol }: { symbol: string }) {
  const { closeSheet, flash, openSheet, setStockTab } = useApp();
  const openTab = (tab: "Overview" | "Financials" | "Analysis" | "Floor sheet" | "Events") => {
    setStockTab(tab);
    closeSheet();
  };
  const tools = [
    { label: "Highlights", icon: "star" as const, onClick: () => openTab("Overview") },
    { label: "Technicals", icon: "market" as const, onClick: () => openTab("Analysis") },
    { label: "Fundamentals", icon: "learn" as const, onClick: () => openTab("Financials") },
    { label: "Floor sheet", icon: "compare" as const, onClick: () => openTab("Floor sheet") },
    { label: "Share holding", icon: "wallet" as const, onClick: () => openTab("Financials") },
    { label: "Dividends & AGM", icon: "cal" as const, onClick: () => openTab("Events") },
    {
      label: "Compare",
      icon: "compare" as const,
      onClick: () => openSheet({ kind: "compare" }),
    },
    {
      label: "Reports",
      icon: "more" as const,
      onClick: () => {
        closeSheet();
        flash({ message: `${symbol} reports will open from the company filing source.` });
      },
    },
    {
      label: "Announcements",
      icon: "alert" as const,
      onClick: () => openTab("Events"),
    },
  ];
  return (
    <>
      <div className="metric-sheet-head">
        <div>
          <p className="t-h-l">{symbol} tools</p>
          <p className="t-body-xs muted">Jump to company, trading and disclosure views.</p>
        </div>
        <button className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </div>
      <div className="stock-tools-grid">
        {tools.map((tool) => (
          <button key={tool.label} onClick={tool.onClick}>
            <span><Icon name={tool.icon} size={19} /></span>
            {tool.label}
          </button>
        ))}
      </div>
      <p className="t-body-xs muted" style={{ marginTop: 14 }}>
        Readings explain published data. They do not rate the stock or recommend a trade.
      </p>
    </>
  );
}

function CompareSheet() {
  const { closeSheet, openSheet } = useApp();
  return (
    <>
      <p className="overline">Compare</p>
      <p className="t-h-l" style={{ margin: "8px 0 12px" }}>NABIL vs GBIME</p>
      <div className="compare-head">
        <span />
        <span className="t-ticker">NABIL</span>
        <span className="t-ticker">GBIME</span>
      </div>
      {compareRows.map((row) => (
        <div key={row.id} className="compare-row">
          <button type="button" className="metric-link" onClick={() => openSheet({ kind: "metric", id: row.id })}>
            {row.label}
          </button>
          <b className="t-mono-m">{row.nabil}</b>
          <b className="t-mono-m">{row.gbime}</b>
        </div>
      ))}
      <p className="t-body-xs muted" style={{ marginTop: 12 }}>
        Same dates, same definitions. Tap a ratio for a sentence in plain words.
      </p>
      <div style={{ marginTop: 16 }}>
        <Button variant="secondary" size="md" onClick={closeSheet}>Close</Button>
      </div>
    </>
  );
}

function CorrectSheet() {
  const { closeSheet, saveCorrection, correctedKitta } = useApp();
  const orig = nabilLedger.kitta;
  const [kitta, setKitta] = useState(correctedKitta ?? orig);
  const ltp = nabil.ltp;
  const price = nabilLedger.price;
  const pl = kitta * (ltp - price);
  const wacc = price;
  const origPl = orig * (ltp - price);

  return (
    <>
      <p className="overline">Correct transaction</p>
      <p className="t-h-l" style={{ margin: "8px 0 4px" }}>Buy NABIL · {nabilLedger.date}</p>
      <p className="t-body-s muted">The original row stays. This appends a dated correction.</p>
      <label className="field" style={{ marginTop: 16 }}>
        Kitta
        <input
          type="number"
          min={1}
          value={kitta}
          onChange={(e) => setKitta(Number(e.target.value) || 0)}
        />
      </label>
      <div className="preview-card">
        <div>
          <p className="overline">Avg cost</p>
          <p className="t-mono-m">{npr(wacc, 2)}</p>
        </div>
        <div>
          <p className="overline">Unrealised P/L</p>
          <p className={`t-mono-m ${pl < 0 ? "c-down" : "c-up"}`}>{signed(pl)}</p>
        </div>
        <div>
          <p className="overline">vs original</p>
          <p className="t-mono-m">{signed(pl - origPl)} P/L</p>
        </div>
      </div>
      <div className="btn-row" style={{ marginTop: 16 }}>
        <Button variant="primary" size="md" onClick={() => saveCorrection(kitta)}>Save correction</Button>
        <Button variant="secondary" size="md" onClick={closeSheet}>Cancel</Button>
      </div>
    </>
  );
}

function PortfolioSwitchSheet() {
  const {
    portfolioId,
    setPortfolioId,
    closeSheet,
    openSheet,
    openPortfolioIds,
    portfolioNames,
    portfolioKinds,
    primaryPortfolioId,
  } = useApp();
  const rows = portfolioList.filter((item) => openPortfolioIds.includes(item.id));

  const pick = (id: PortfolioId) => {
    setPortfolioId(id);
    closeSheet();
  };

  return (
    <>
      <p className="overline">Your portfolios</p>
      <ul className="pf-switch">
        {rows.map((item) => {
          const events = attentionFor(item.id).length;
          const on = item.id === portfolioId;
          const name = portfolioNames[item.id] ?? item.name;
          const kind = portfolioKinds[item.id] === "company" ? "Company" : "Individual";
          const primary = item.id === primaryPortfolioId;
          return (
            <li key={item.id}>
              <button type="button" className={on ? "on" : ""} onClick={() => pick(item.id)}>
                <span className="pf-switch-mark" aria-hidden>{name.slice(0, 1)}</span>
                <span className="pf-switch-copy">
                  <strong>
                    {name}
                    {primary && <em className="pf-primary-tag">Primary</em>}
                  </strong>
                  <small>
                    {kind} · Rs {npr(item.marketValue)} · {item.count} holdings
                  </small>
                  {events > 0 && (
                    <small className="pf-switch-badge">
                      <i aria-hidden /> {events} {events === 1 ? "item needs" : "items need"} attention
                    </small>
                  )}
                </span>
                {on && (
                  <span className="pf-switch-tick" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                )}
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            className="pf-switch-add"
            onClick={() => openSheet({ kind: "portfolio-create" })}
          >
            <span className="pf-switch-mark plus" aria-hidden>+</span>
            <span className="pf-switch-copy">
              <strong>Create a portfolio</strong>
              <small>Keep long-term holdings apart from trades</small>
            </span>
          </button>
        </li>
      </ul>
      <p className="t-body-xs muted" style={{ marginTop: 14 }}>
        Each portfolio keeps its own transactions, average cost and P/L. Nothing is mixed between them.
      </p>
    </>
  );
}

function PortfolioMenuSheet() {
  const { closeSheet, openSheet, portfolioId, portfolioNames, openPortfolioIds } = useApp();
  const name = portfolioNames[portfolioId];
  const only = openPortfolioIds.length === 1;

  return (
    <>
      <div className="metric-sheet-head">
        <div>
          <p className="t-h-l">{name}</p>
          <p className="t-body-xs muted">Rename this book, or remove it from the list.</p>
        </div>
        <button className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </div>
      <ul className="pf-menu">
        <li>
          <button type="button" onClick={() => openSheet({ kind: "portfolio-edit" })}>
            <span className="pf-menu-ico" aria-hidden><Icon name="clipboard" size={18} /></span>
            <span>
              <strong>Edit portfolio</strong>
              <small>Rename, set the type, or mark this book as primary.</small>
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="danger"
            disabled={only}
            onClick={() => {
              if (only) return;
              openSheet({ kind: "portfolio-delete" });
            }}
          >
            <span className="pf-menu-ico" aria-hidden><Icon name="alert" size={18} /></span>
            <span>
              <strong>Delete portfolio</strong>
              <small>
                {only
                  ? "This is your only book, so it cannot be deleted."
                  : "Removes it from this list. History is not recovered."}
              </small>
            </span>
          </button>
        </li>
      </ul>
    </>
  );
}

function PortfolioEditSheet() {
  const {
    closeSheet,
    flash,
    portfolioId,
    portfolioNames,
    portfolioKinds,
    primaryPortfolioId,
    openPortfolioIds,
    savePortfolio,
  } = useApp();
  const current = portfolioNames[portfolioId];
  const [name, setName] = useState(current);
  const [kind, setKind] = useState<PortfolioKind>(portfolioKinds[portfolioId] ?? "individual");
  const [primary, setPrimary] = useState(portfolioId === primaryPortfolioId);
  const onlyBook = openPortfolioIds.length === 1;

  const save = () => {
    const next = name.trim();
    if (!next) return;
    savePortfolio(portfolioId, { name: next, kind, primary: primary || onlyBook });
    closeSheet();
    flash({ message: "Portfolio updated." });
  };

  return (
    <>
      <div className="metric-sheet-head">
        <div>
          <p className="t-h-l">Edit portfolio</p>
          <p className="t-body-xs muted">Holdings and history stay as they are.</p>
        </div>
        <button className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </div>
      <label className="field" style={{ marginTop: 16 }}>
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={32}
          autoComplete="off"
        />
      </label>
      <p className="field-label">Type</p>
      <div className="pf-seg" role="radiogroup" aria-label="Portfolio type">
        {(["individual", "company"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={kind === item}
            className={kind === item ? "on" : ""}
            onClick={() => setKind(item)}
          >
            {item === "individual" ? "Individual" : "Company"}
          </button>
        ))}
      </div>
      <label className={`pf-check${onlyBook ? " locked" : ""}`}>
        <input
          type="checkbox"
          checked={primary || onlyBook}
          disabled={onlyBook}
          onChange={(event) => setPrimary(event.target.checked)}
        />
        <span>
          <strong>Mark as primary</strong>
          <small>
            {onlyBook
              ? "This is your only book, so it stays primary and is used on Home."
              : "Shown first, and used on Home. Only one book can be primary."}
          </small>
        </span>
      </label>
      <div className="btn-row" style={{ marginTop: 16 }}>
        <Button variant="primary" size="md" onClick={save}>Save</Button>
        <Button variant="secondary" size="md" onClick={closeSheet}>Cancel</Button>
      </div>
    </>
  );
}

function PortfolioCreateSheet() {
  const { closeSheet, flash, openSheet, openPortfolioIds, createPortfolio } = useApp();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<PortfolioKind>("individual");
  const [primary, setPrimary] = useState(false);
  const room = (["fresh", "side"] as const).some((id) => !openPortfolioIds.includes(id));

  const save = () => {
    if (!createPortfolio({ name, kind, primary })) {
      flash({ message: room ? "Give this book a name." : "Delete a book first to make space." });
      return;
    }
    closeSheet();
    flash({ message: "Portfolio created. Add a holding when you are ready." });
  };

  return (
    <>
      <div className="metric-sheet-head">
        <div>
          <p className="t-h-l">Create a portfolio</p>
          <p className="t-body-xs muted">
            {room
              ? "A separate book keeps its own average cost and history."
              : "This demo can keep two extra books. Delete one to make space."}
          </p>
        </div>
        <button className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </div>
      {room ? (
        <>
          <label className="field" style={{ marginTop: 16 }}>
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={32}
              autoComplete="off"
              placeholder="Long term, SIP, family…"
            />
          </label>
          <p className="field-label">Type</p>
          <div className="pf-seg" role="radiogroup" aria-label="Portfolio type">
            {(["individual", "company"] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={kind === item}
                className={kind === item ? "on" : ""}
                onClick={() => setKind(item)}
              >
                {item === "individual" ? "Individual" : "Company"}
              </button>
            ))}
          </div>
          <label className="pf-check">
            <input
              type="checkbox"
              checked={primary}
              onChange={(event) => setPrimary(event.target.checked)}
            />
            <span>
              <strong>Mark as primary</strong>
              <small>Shown first, and used on Home. Only one book can be primary.</small>
            </span>
          </label>
          <div className="btn-row" style={{ marginTop: 16 }}>
            <Button variant="primary" size="md" onClick={save}>Create</Button>
            <Button variant="secondary" size="md" onClick={() => openSheet({ kind: "portfolio-switch" })}>
              Back
            </Button>
          </div>
        </>
      ) : (
        <div className="btn-row" style={{ marginTop: 16 }}>
          <Button variant="secondary" size="md" onClick={() => openSheet({ kind: "portfolio-switch" })}>
            Back to list
          </Button>
        </div>
      )}
    </>
  );
}

function PortfolioImportSheet() {
  const { closeSheet, openSheet } = useApp();
  const [portalId, setPortalId] = useState(importPortals[0].id);
  const [fileName, setFileName] = useState<string | null>(null);
  const portal = importPortals.find((item) => item.id === portalId) ?? importPortals[0];

  return (
    <>
      <div className="metric-sheet-head">
        <div>
          <p className="t-h-l">Import portfolio</p>
          <p className="t-body-xs muted">Choose where the holdings come from. Nothing is written until you confirm.</p>
        </div>
        <button className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </div>
      <label className="field" style={{ marginTop: 16 }}>
        Portal
        <select
          value={portalId}
          onChange={(event) => {
            setPortalId(event.target.value);
            setFileName(null);
          }}
        >
          {importPortals.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <p className="t-body-xs muted" style={{ marginTop: 10 }}>{portal.hint}</p>

      {portal.mode === "file" ? (
        <>
          <label className={`pf-drop${fileName ? " on" : ""}`}>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,.txt"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setFileName(file?.name ?? null);
              }}
            />
            <Icon name="doc" size={20} />
            <strong>{fileName ?? "Select a file to upload"}</strong>
            <small>{fileName ? "Tap to choose a different file" : "CSV, Excel or PDF"}</small>
          </label>
          <div style={{ marginTop: 16 }}>
            <Button
              variant="primary"
              size="lg"
              block
              disabled={!fileName}
              onClick={() => {
                if (!fileName) return;
                openSheet({ kind: "portfolio-import-steps", source: "file", fileName });
              }}
            >
              Continue
            </Button>
          </div>
        </>
      ) : (
        <div style={{ marginTop: 16 }}>
          <Button
            variant="primary"
            size="lg"
            block
            onClick={() => openSheet({ kind: "portfolio-import-steps", source: "tms" })}
          >
            Go to import steps
          </Button>
        </div>
      )}
    </>
  );
}

function PortfolioImportStepsSheet({ source, fileName }: { source: "file" | "tms"; fileName?: string }) {
  const { closeSheet, flash, openSheet } = useApp();
  const [step, setStep] = useState(0);
  const firstTitle = source === "file" ? "File received" : "Connect to TMS";
  const steps = [firstTitle, "Review holdings", "Confirm"];

  return (
    <>
      <div className="metric-sheet-head">
        <div>
          <p className="t-h-l">Import</p>
          <p className="t-body-xs muted">
            Step {step + 1} of {steps.length} · {steps[step]}
          </p>
        </div>
        <button className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </div>
      <ol className="pf-steps" aria-hidden>
        {steps.map((label, index) => (
          <li key={label} className={index === step ? "on" : index < step ? "done" : ""}>
            <i>{index + 1}</i>
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="pf-import-copy">
          {source === "file" ? (
            <>
              <p className="t-h-s">{fileName ?? "Statement"}</p>
              <p className="t-body-s muted">
                We read {importPreview.length} holdings from this file. You will review every row before anything is saved.
              </p>
            </>
          ) : (
            <>
              <p className="t-h-s">Broker TMS</p>
              <p className="t-body-s muted">
                This is a demo handshake. In production you would sign in at your broker. We never place orders or move cash.
              </p>
            </>
          )}
        </div>
      )}

      {step === 1 && (
        <ul className="pf-import-list">
          {importPreview.map((row) => (
            <li key={row.symbol}>
              <span>
                <strong className="t-ticker">{row.symbol}</strong>
                <small>{row.name}</small>
              </span>
              <span>
                <b>{npr(row.kitta)} kitta</b>
                <small>Avg cost {npr(row.avg, 2)}</small>
              </span>
            </li>
          ))}
        </ul>
      )}

      {step === 2 && (
        <div className="pf-import-copy">
          <p className="t-h-s">{importPreview.length} holdings ready</p>
          <p className="t-body-s muted">
            Quantity, average cost and market value will update. You can correct any row afterwards — history is never deleted.
          </p>
        </div>
      )}

      <div className="btn-row" style={{ marginTop: 18 }}>
        {step > 0 && (
          <Button variant="secondary" size="md" onClick={() => setStep((n) => n - 1)}>Back</Button>
        )}
        {step === 0 && (
          <Button variant="secondary" size="md" onClick={() => openSheet({ kind: "portfolio-import" })}>
            Change portal
          </Button>
        )}
        {step < 2 ? (
          <Button variant="primary" size="md" onClick={() => setStep((n) => n + 1)}>
            {step === 0 ? "Review holdings" : "Continue"}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              closeSheet();
              flash({ message: `${importPreview.length} holdings imported. We don’t place orders.` });
            }}
          >
            Confirm import
          </Button>
        )}
      </div>
    </>
  );
}

function PortfolioDeleteSheet() {
  const { closeSheet, flash, portfolioId, portfolioNames, openPortfolioIds, deletePortfolio } = useApp();
  const name = portfolioNames[portfolioId];
  const only = openPortfolioIds.length === 1;

  const confirm = () => {
    if (only) return;
    deletePortfolio(portfolioId);
    closeSheet();
    flash({ message: `${name} was removed.` });
  };

  return (
    <>
      <div className="metric-sheet-head">
        <div>
          <p className="t-h-l">Delete {name}?</p>
          <p className="t-body-xs muted">
            {only
              ? "Keep at least one book. Create another first if you want to start over."
              : "This removes the book from your list. Holdings and transactions are not recovered in this prototype."}
          </p>
        </div>
        <button className="sheet-close" onClick={closeSheet} aria-label="Close">×</button>
      </div>
      <div className="btn-row" style={{ marginTop: 16 }}>
        {!only && <Button variant="danger" size="md" onClick={confirm}>Delete</Button>}
        <Button variant="secondary" size="md" onClick={closeSheet}>{only ? "Close" : "Cancel"}</Button>
      </div>
    </>
  );
}

function PlansSheet() {
  const { plan, setPlan, closeSheet, flash } = useApp();
  const [cycle, setCycle] = useState<PlanCycle>("annual");
  const [pick, setPick] = useState<Plan>(plan);
  const [pay, setPay] = useState<"esewa" | "khalti" | "connectips">("esewa");
  const paid = pick !== "free";
  const price = cycle === "annual" ? planMeta[pick].annual : planMeta[pick].monthly;

  const confirm = () => {
    setPlan(pick);
    closeSheet();
    if (pick === "free") {
      flash({ message: "You’re on Free. Screeners and alerts stay off this plan." });
      return;
    }
    flash({ message: `Demo ${planMeta[pick].label} via ${pay === "connectips" ? "ConnectIPS" : pay === "esewa" ? "eSewa" : "Khalti"}. No payment is taken.` });
  };

  return (
    <div className="plans-sheet">
      <p className="overline">Subscription</p>
      <p className="t-h-l" style={{ margin: "6px 0 4px" }}>Plans</p>
      <p className="t-body-s muted">Paid tiers unlock tools. They never unlock a stock pick.</p>

      <div className="plans-cycle">
        <button type="button" className={cycle === "monthly" ? "on" : ""} onClick={() => setCycle("monthly")}>Monthly</button>
        <button type="button" className={cycle === "annual" ? "on" : ""} onClick={() => setCycle("annual")}>Annual · save ~30%</button>
      </div>

      <div className="plans-list">
        {(["free", "pro", "guru"] as Plan[]).map((id) => {
          const item = planMeta[id];
          const on = pick === id;
          const amount = cycle === "annual" ? item.annual : item.monthly;
          return (
            <button
              key={id}
              type="button"
              className={`plans-card ${id} ${on ? "on" : ""}`}
              onClick={() => setPick(id)}
            >
              <span>
                <strong>{item.label}</strong>
                {plan === id && <em>Current</em>}
              </span>
              <b>{amount === 0 ? "Rs 0" : `Rs ${amount.toLocaleString("en-IN")}${cycle === "annual" ? " / yr" : " / mo"}`}</b>
            </button>
          );
        })}
      </div>

      <table className="plans-table">
        <thead>
          <tr>
            <th>Includes</th>
            <th>Free</th>
            <th>Pro</th>
            <th>Guru</th>
          </tr>
        </thead>
        <tbody>
          {planFeatures.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.free ? "Yes" : "—"}</td>
              <td>{row.pro ? "Yes" : "—"}</td>
              <td>{row.guru ? "Yes" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {paid && (
        <>
          <p className="overline" style={{ marginTop: 16 }}>Pay with</p>
          <div className="plans-pay">
            {([
              ["esewa", "eSewa"],
              ["khalti", "Khalti"],
              ["connectips", "ConnectIPS"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={pay === id ? "on" : ""}
                onClick={() => setPay(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 16 }}>
        <Button variant="primary" size="lg" block onClick={confirm}>
          {paid ? `Continue · Rs ${price.toLocaleString("en-IN")}` : "Stay on Free"}
        </Button>
      </div>
      <p className="t-body-xs muted" style={{ marginTop: 10, textAlign: "center" }}>
        Prototype only. eSewa, Khalti and ConnectIPS are shown as the handoff. No charge is made.
      </p>
    </div>
  );
}

export function Overlays() {
  const { sheet, closeSheet, toast, dismissToast, undoStage, circuit, openSheet, route } = useApp();
  const alert = circuit !== "off" ? circuitCopy[circuit] : null;
  const onboarding = route === "onboarding" || route === "start";

  return (
    <>
      {alert && !onboarding && (
        <div className={`circuit-banner ${alert.tone}`}>
          <p className="t-h-s">{alert.title}</p>
          <p className="t-body-xs" style={{ margin: "4px 0 10px", opacity: 0.92 }}>{alert.body}</p>
          <button type="button" className="circuit-cta" onClick={() => openSheet({ kind: "circuit-rules" })}>
            View circuit rules
          </button>
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          <p style={{ flex: 1 }}>{toast.message}</p>
          {toast.undo && (
            <button type="button" className="toast-undo" onClick={undoStage}>Undo</button>
          )}
          <button type="button" className="toast-x" onClick={dismissToast} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {sheet?.kind === "profile" && (
        <SheetFrame onClose={closeSheet}><ProfileSheet /></SheetFrame>
      )}
      {sheet?.kind === "navigation" && (
        <SheetFrame from="left" onClose={closeSheet}><NavigationSheet /></SheetFrame>
      )}
      {sheet?.kind === "quick" && (
        <SheetFrame onClose={closeSheet} labelledBy="sheet-title">
          <QuickSheet title={sheet.title} body={sheet.body} note={sheet.note} />
        </SheetFrame>
      )}
      {sheet?.kind === "metric" && (
        <SheetFrame onClose={closeSheet}><MetricSheet id={sheet.id} /></SheetFrame>
      )}
      {sheet?.kind === "circuit-rules" && (
        <SheetFrame onClose={closeSheet}><CircuitRulesSheet /></SheetFrame>
      )}
      {sheet?.kind === "order" && (
        <SheetFrame onClose={closeSheet}><OrderSheet symbol={sheet.symbol} /></SheetFrame>
      )}
      {sheet?.kind === "stock-tools" && (
        <SheetFrame onClose={closeSheet}><StockToolsSheet symbol={sheet.symbol} /></SheetFrame>
      )}
      {sheet?.kind === "compare" && (
        <SheetFrame onClose={closeSheet}><CompareSheet /></SheetFrame>
      )}
      {sheet?.kind === "plans" && (
        <SheetFrame tall onClose={closeSheet}><PlansSheet /></SheetFrame>
      )}
      {sheet?.kind === "correct" && (
        <SheetFrame onClose={closeSheet}><CorrectSheet /></SheetFrame>
      )}
      {sheet?.kind === "portfolio-switch" && (
        <SheetFrame onClose={closeSheet}><PortfolioSwitchSheet /></SheetFrame>
      )}
      {sheet?.kind === "portfolio-menu" && (
        <SheetFrame onClose={closeSheet}><PortfolioMenuSheet /></SheetFrame>
      )}
      {sheet?.kind === "portfolio-edit" && (
        <SheetFrame onClose={closeSheet}><PortfolioEditSheet /></SheetFrame>
      )}
      {sheet?.kind === "portfolio-create" && (
        <SheetFrame onClose={closeSheet}><PortfolioCreateSheet /></SheetFrame>
      )}
      {sheet?.kind === "portfolio-delete" && (
        <SheetFrame onClose={closeSheet}><PortfolioDeleteSheet /></SheetFrame>
      )}
      {sheet?.kind === "portfolio-import" && (
        <SheetFrame onClose={closeSheet}><PortfolioImportSheet /></SheetFrame>
      )}
      {sheet?.kind === "portfolio-import-steps" && (
        <SheetFrame tall onClose={closeSheet}>
          <PortfolioImportStepsSheet source={sheet.source} fileName={sheet.fileName} />
        </SheetFrame>
      )}
    </>
  );
}
