import { useMemo, useState } from "react";
import { Icon } from "../ds/Icon";
import { SectorDonut, SessionWalk } from "../ds/charts";
import { BookNudge } from "../ds/BookNudge";
import { Explain, Overline, SectionHead } from "../ds/primitives";
import {
  allotments,
  bookNews,
  bookRangeTape,
  holdings,
  ipoPipeline,
  nabilLedger,
  portfolio,
  sectorAlloc,
  type BookRange,
} from "../lib/data";
import { npr, pct } from "../lib/format";
import { useApp } from "../lib/state";

const ranges: BookRange[] = ["1D", "1W", "1M", "6M", "1Y"];

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

function veil(value: string, hidden: boolean) {
  return hidden ? "••••••" : value;
}

function NewsPulse() {
  const { go } = useApp();
  const items = bookNews.slice(0, 3);
  const [lead, ...rest] = items;
  const open = (stock: string) => go("stock", { stock });

  return (
    <div className="happen-board">
      <button type="button" className={`happen-lead ${lead.tone}`} onClick={() => open(lead.stock)}>
        <span className="happen-lead-top">
          <span className="happen-tag">{lead.tag}</span>
          <span className="happen-tick">
            <span className="ticker-mark sm">{lead.stock.slice(0, 2)}</span>
            <b>{lead.stock}</b>
            <em className={lead.changePct < 0 ? "c-down" : "c-up"}>{pct(lead.changePct)}</em>
          </span>
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
              <em className={item.changePct < 0 ? "c-down" : "c-up"}>{pct(item.changePct)}</em>
            </span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PortfolioScreen() {
  const { go, stage, openSheet } = useApp();
  const [hidden, setHidden] = useState(false);
  const [range, setRange] = useState<BookRange>("1W");
  const tape = useMemo(
    () => bookRangeTape(portfolio.value, portfolio.today, portfolio.unrealised, range),
    [range],
  );
  const profitUp = portfolio.unrealisedPct >= 0;

  if (stage === "explorer") {
    return (
      <div className="port-screen">
        <div className="pad" style={{ paddingTop: 12 }}>
          <BookNudge
            kicker="Nothing here yet"
            onPaste={() => go("holding", { holdingMode: "add" })}
            onType={() => go("holding", { holdingMode: "add" })}
          />
          <p className="t-body-xs muted" style={{ marginTop: 14 }}>
            We can’t read your broker, and every edit keeps its history.
          </p>
        </div>
      </div>
    );
  }

  if (stage === "primary") {
    return (
      <div className="port-screen">
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
    <div className="port-screen">
      <section className="port-hero">
        <div className="port-value-row">
          <p className="port-value">{veil(`Rs ${npr(portfolio.value)}`, hidden)}</p>
          <EyeBtn hidden={hidden} onClick={() => setHidden((v) => !v)} />
        </div>
        <p className={`port-profit ${profitUp ? "c-up" : "c-down"}`}>
          Your profit{" "}
          <b>
            {veil(`Rs ${npr(portfolio.unrealised)}`, hidden)} {pct(portfolio.unrealisedPct, 1)}
          </b>
        </p>
        <div className="port-acts">
          <button type="button" className="port-act" onClick={() => go("holding", { holdingMode: "add" })}>
            <span className="port-act-ico" aria-hidden>↓</span>
            Add kitta
          </button>
          <button
            type="button"
            className="port-act"
            onClick={() => openSheet({
              kind: "quick",
              title: "Cash noted",
              body: `Rs ${npr(portfolio.cashNoted)} sitting beside this book. MoneyMitra does not hold it, and it is not a TMS balance.`,
              note: "We don’t place orders or move cash.",
            })}
          >
            <span className="port-act-ico" aria-hidden>↑</span>
            Cash noted
          </button>
        </div>
      </section>

      <section className="port-chart">
        <SessionWalk tape={tape} compact showVolume={false} />
        <div className="range-pills" role="tablist" aria-label="Book range">
          {ranges.map((item) => (
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
      </section>

      <section className="port-block">
        <div className="port-block-head">
          <h2>My book</h2>
          <button type="button" className="text-link" onClick={() => go("holding", { holdingMode: "add" })}>
            Add ›
          </button>
        </div>
        <div className="hold-rail">
          {holdings.map((h) => (
            <button key={h.symbol} type="button" className="hold-card" onClick={() => go("stock", { stock: h.symbol })}>
              <span className="ticker-mark">{h.symbol.slice(0, 2)}</span>
              <strong className="t-ticker">{h.symbol}</strong>
              <small>{h.name}</small>
              <span className="hold-card-quote">
                <b>{veil(npr(h.ltp, 2), hidden)}</b>
                <em className={h.dayPct < 0 ? "c-down" : "c-up"}>{pct(h.dayPct)}</em>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="port-block">
        <div className="port-block-head">
          <h2>Sector allocation</h2>
        </div>
        <div className="sector-board">
          <SectorDonut rows={sectorAlloc} size={168} label={String(holdings.length)} sub="stocks" />
          <ul className="sector-board-list">
            {sectorAlloc.map((row) => (
              <li key={row.name}>
                <i style={{ background: row.color }} />
                <div>
                  <p>
                    <strong>{row.name}</strong>
                    <span>{row.pct}%</span>
                  </p>
                  <div className="sector-marks">
                    {row.symbols.map((sym) => (
                      <span key={sym} className="ticker-mark sm">{sym.slice(0, 2)}</span>
                    ))}
                  </div>
                </div>
                <div className="sector-board-meta">
                  <b>{veil(`Rs ${npr(row.value)}`, hidden)}</b>
                  <em className={row.changePct < 0 ? "c-down" : "c-up"}>{pct(row.changePct)}</em>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="port-block">
        <div className="port-block-head">
          <h2>Latest on your names</h2>
        </div>
        <div className="news-stack">
          <NewsPulse />
        </div>
      </section>

      <section className="port-block">
        <div className="port-block-head">
          <h2>Return</h2>
          <button
            type="button"
            className="text-link"
            onClick={() => openSheet({
              kind: "quick",
              title: "How return is calculated",
              body: "Estimated total return combines unrealised P/L, realised P/L and dividends recorded in this portfolio.",
              note: "If transactions are missing, the result is labelled estimated.",
            })}
          >
            How is this calculated?
          </button>
        </div>
        <div className="return-board">
          <div className="return-hero">
            <span>Unrealised P/L</span>
            <b className="c-up">{veil(`+Rs ${npr(portfolio.unrealised)}`, hidden)}</b>
            <em className="c-up">{veil(pct(portfolio.unrealisedPct, 1), hidden)}</em>
          </div>
          <div className="return-rows">
            <div>
              <span>Realised P/L</span>
              <b className="c-up">{veil(`+Rs ${npr(portfolio.realised)}`, hidden)}</b>
            </div>
            <div>
              <span>Dividends</span>
              <b>{veil(`Rs ${npr(portfolio.dividends)}`, hidden)}</b>
            </div>
            <div className="total">
              <span>Estimated total</span>
              <b className="c-up">{veil(`+Rs ${npr(portfolio.estimatedReturn)}`, hidden)}</b>
            </div>
          </div>
        </div>
      </section>
      <div className="pad" style={{ paddingTop: 12 }}>
        <Explain onClick={() => openSheet({
          kind: "quick",
          title: "Unrealised P/L",
          body: "The gain or loss on shares you still hold, using the last traded price minus your recorded average cost.",
          note: "It is not cash until you sell.",
        })}>What is unrealised P/L?</Explain>
      </div>
      <p className="foot-note">
        We don’t place orders, and we can’t read your broker. Values use the last print at 3:00 PM.
      </p>
    </div>
  );
}

export function HoldingScreen() {
  const { back, holdingMode, openSheet, correctedKitta } = useApp();
  const kitta = correctedKitta ?? nabilLedger.kitta;
  const superseded = correctedKitta !== null && correctedKitta !== nabilLedger.kitta;

  if (holdingMode === "detail") {
    return (
      <div>
        <div className="app-bar">
          <button className="icon-btn" onClick={back}><Icon name="back" /></button>
          <h1>NABIL holding</h1>
        </div>
        <div className="pad stack" style={{ gap: 12, paddingBottom: 24 }}>
          <Overline>Transaction history</Overline>
          <div className={`ledger-row ${superseded ? "superseded" : ""}`}>
            <div>
              <p className="t-h-s">{nabilLedger.side} {nabilLedger.kitta} kitta</p>
              <p className="t-body-xs muted">{nabilLedger.date} · {npr(nabilLedger.price, 2)}</p>
            </div>
            {superseded ? <span className="audit">Superseded</span> : <span className="audit">Original</span>}
          </div>
          {superseded && (
            <div className="ledger-row">
              <div>
                <p className="t-h-s">Correction · {kitta} kitta</p>
                <p className="t-body-xs muted">Today · original entry preserved</p>
              </div>
              <span className="audit on">Correction</span>
            </div>
          )}
          <button type="button" className="choice" onClick={() => openSheet({ kind: "correct" })}>
            <div>
              <p className="t-h-s">Something look wrong?</p>
              <p className="t-body-xs muted">Correct this holding — history is never deleted.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="app-bar">
        <button className="icon-btn" onClick={back}><Icon name="back" /></button>
        <h1>Add a holding</h1>
      </div>
      <div className="pad stack" style={{ gap: 10 }}>
        <p className="t-body-m muted">Choose how. Nothing is written until you confirm.</p>
        <button className="choice">
          <span className="ico-soft"><Icon name="wallet" size={19} /></span>
          <div>
            <p className="t-h-s">Paste a contract note</p>
            <p className="t-body-xs muted">Photo or text. You review every field.</p>
          </div>
        </button>
        <button className="choice">
          <span className="ico-soft"><Icon name="cal" size={19} /></span>
          <div>
            <p className="t-h-s">Enter it yourself</p>
            <p className="t-body-xs muted">Symbol, kitta, price, date, fees.</p>
          </div>
        </button>
      </div>
    </div>
  );
}
