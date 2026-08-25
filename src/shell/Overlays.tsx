import { useState, type ReactNode } from "react";
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
import { planFeatures, planMeta } from "../lib/explore";
import { activeTab } from "../lib/nav";
import { stageMeta, stageOrder, titleObjective } from "../lib/stage";
import { useApp } from "../lib/state";
import type { HomeFeed, Plan, PlanCycle, Stage } from "../lib/types";

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

function SheetFrame({
  children,
  onClose,
  tall,
  from = "bottom",
}: {
  children: ReactNode;
  onClose: () => void;
  tall?: boolean;
  from?: "bottom" | "left";
}) {
  const drawer = from === "left";
  return (
    <div
      className={`sheet-backdrop${drawer ? " from-left" : ""}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`sheet${tall ? " sheet-tall" : ""}${drawer ? " sheet-drawer" : ""}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {!drawer && <div className="sheet-handle" />}
        {children}
      </div>
    </div>
  );
}

function ProfileSheet() {
  const { stage, setStage, setObjectiveId, closeSheet, densityLocked } = useApp();
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
                setObjectiveId(titleObjective[id]);
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
    <>
      <p className="overline">In short</p>
      <p className="t-h-l" style={{ margin: "8px 0" }}>{title}</p>
      <p className="t-body-m">{body}</p>
      {note && <p className="t-body-xs muted" style={{ marginTop: 10 }}>{note}</p>}
      <div style={{ marginTop: 16 }}>
        <Button variant="primary" size="md" onClick={closeSheet}>Got it</Button>
      </div>
    </>
  );
}

function NavigationSheet() {
  const { go, closeSheet, setHomeFeed, openSheet, stage, route } = useApp();
  const current = activeTab(route);
  const routeTo = (next: "home" | "market" | "ai" | "portfolio" | "discover") => {
    closeSheet();
    go(next);
  };
  const openHomeFeed = (feed: HomeFeed) => {
    setHomeFeed(feed);
    closeSheet();
    go("home");
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
        <button type="button" onClick={() => openHomeFeed("watchlist")}><span>Watching</span><Icon name="chev" size={15} /></button>
        <button type="button" onClick={() => openHomeFeed("brokers")}><span>Brokers</span><Icon name="chev" size={15} /></button>
        <button type="button" onClick={() => openHomeFeed("baskets")}><span>Baskets</span><Icon name="chev" size={15} /></button>
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
          <p className="overline">WACC</p>
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
        <SheetFrame onClose={closeSheet}>
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
    </>
  );
}
