import { Icon } from "../ds/Icon";
import { Explain, Figure, Overline, SectionHead, StatTable } from "../ds/primitives";
import { allotments, holdings, ipoPipeline, nabilLedger, portfolio } from "../lib/data";
import { npr, pct, signed } from "../lib/format";
import { useApp } from "../lib/state";

export function PortfolioScreen() {
  const { go, viewport, stage, openSheet } = useApp();

  if (stage === "explorer") {
    return (
      <div>
        {viewport === "mobile" && (
          <div className="page-title"><h1>Portfolio</h1></div>
        )}
        <div className="pad" style={{ paddingTop: 16 }}>
          <Overline>No portfolio yet</Overline>
          <h2 className="t-h-xl" style={{ marginTop: 8 }}>Start tracking what you own</h2>
          <p className="t-body-m muted" style={{ marginTop: 8 }}>
            MoneyMitra cannot read your broker. Paste a contract note or enter a trade. Every edit keeps a history.
          </p>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="choice" onClick={() => go("holding", { holdingMode: "add" })}>
              <span className="ico-soft"><Icon name="wallet" size={19} /></span>
              <div>
                <p className="t-h-s">Paste a contract note</p>
                <p className="t-body-xs muted">We read the trade. You confirm it.</p>
              </div>
            </button>
            <button className="choice" onClick={() => go("holding", { holdingMode: "add" })}>
              <span className="ico-soft"><Icon name="cal" size={19} /></span>
              <div>
                <p className="t-h-s">Enter a holding</p>
                <p className="t-body-xs muted">Symbol, kitta, average cost.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "primary") {
    return (
      <div>
        {viewport === "mobile" && (
          <div className="page-title"><h1>Portfolio</h1></div>
        )}
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
        <p className="foot-note">MoneyMitra tracks status. Allotment happens at CDSC / MeroShare.</p>
      </div>
    );
  }

  return (
    <div>
      {viewport === "mobile" && (
        <div className="page-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1>Portfolio</h1>
          <span className="chip">Personal ▾</span>
        </div>
      )}
      <div className="pad">
        <Figure
          kicker="Your portfolio"
          value={portfolio.value}
          amount={portfolio.today}
          pct={portfolio.todayPct}
          amountDigits={0}
          note="Today · valued at 3:00 PM, 2 Bhadra 2083"
        />
        <StatTable
          columns={[
            { label: "Today", value: signed(portfolio.today), tone: "up" },
            { label: "Overall", value: signed(portfolio.unrealised), tone: "up" },
            { label: "Cash noted", value: npr(portfolio.cashNoted) },
          ]}
        />
      </div>
      <div className="gap-16" />
      <SectionHead title="Return" action="How is this calculated?" onAction={() => openSheet({
        kind: "quick",
        title: "How return is calculated",
        body: "Estimated total return combines unrealised P/L, realised P/L and dividends recorded in this portfolio.",
        note: "If transactions are missing, the result is labelled estimated.",
      })} />
      <hr className="rule" />
      <div className="kv">
        <span>Unrealised P/L</span>
        <b className="c-up">{signed(portfolio.unrealised)} {pct(portfolio.unrealisedPct, 1)}</b>
      </div>
      <div className="kv">
        <span>Realised P/L</span>
        <b className="c-up">{signed(portfolio.realised)}</b>
      </div>
      <div className="kv">
        <span>Dividends received</span>
        <b>{npr(portfolio.dividends)}</b>
      </div>
      <div className="kv">
        <span>Estimated total return</span>
        <b className="c-up">{signed(portfolio.estimatedReturn)}</b>
      </div>
      <div className="pad" style={{ paddingTop: 12 }}>
        <Explain onClick={() => openSheet({
          kind: "quick",
          title: "Unrealised P/L",
          body: "The gain or loss on shares you still hold, using the last traded price minus your recorded average cost.",
          note: "It is not cash until you sell.",
        })}>What is unrealised P/L?</Explain>
      </div>
      <div className="gap-20" />
      <SectionHead title={`Holdings · ${holdings.length}`} action="Sort: Value ▾" />
      {holdings.map((h) => (
        <button key={h.symbol} className="row" onClick={() => go("stock", { stock: h.symbol })}>
          <div className="row-main">
            <p>
              <span className="t-ticker">{h.symbol}</span>{" "}
              <span className="t-body-xs muted">{h.name}</span>
            </p>
            <p className="row-sub">{h.kitta} kitta · avg {npr(h.avg, 2)}</p>
          </div>
          <div className="row-meta">
            <p className="t-mono-m">{npr(h.value)}</p>
            <p className={`t-mono-s ${h.returnPct < 0 ? "c-down" : "c-up"}`}>{pct(h.returnPct, 1)}</p>
          </div>
        </button>
      ))}
      <button className="row" onClick={() => go("holding", { holdingMode: "add" })}>
        <p className="t-label-m c-accent" style={{ flex: 1 }}>Add a holding</p>
        <p className="t-body-xs muted">Paste a contract note or enter it ›</p>
      </button>
      <p className="foot-note">
        MoneyMitra does not place orders and cannot read your broker account. Values use the last traded price at 3:00 PM.
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
