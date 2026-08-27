import { useState } from "react";
import { Icon } from "../ds/Icon";
import { ObjectiveHero } from "../ds/ObjectiveHero";
import { Button, Explain, Overline, SearchField } from "../ds/primitives";
import { discover, ipo, lessons, liveIpo, tools, user } from "../lib/data";
import { stageMeta } from "../lib/stage";
import { useApp } from "../lib/state";

export { DiscoverScreen } from "./Explore";

export function SearchScreen() {
  const { back, go, openSheet, viewport } = useApp();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const hits = discover.filter((item) => {
    if (!q) return true;
    return `${item.kind} ${item.title} ${item.sub}`.toLowerCase().includes(q);
  });
  const chips = ["NABIL", "Broker 58", "kitta", "IPO"];

  const openHit = (item: (typeof discover)[number]) => {
    if (item.kind === "Stock") go("stock", { stock: "NABIL" });
    else if (item.kind === "IPO") go("ipo");
    else if (item.kind === "Broker") go("market");
    else if (item.kind === "Tool") openSheet({ kind: "metric", id: "wacc" });
    else go("lesson", { lesson: item.title });
  };

  return (
    <div className="search-screen">
      <header className="search-head">
        {viewport === "mobile" && (
          <button type="button" className="icon-btn header-icon" onClick={back} aria-label="Back">
            <Icon name="back" />
          </button>
        )}
        <SearchField
          placeholder="Company, broker, IPO or a word"
          value={query}
          onChange={setQuery}
          autoFocus
        />
      </header>

      <div className="search-chips">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            className={`chip ${q === chip.toLowerCase() ? "chip-on" : ""}`}
            onClick={() => setQuery(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="search-panel">
        <div className="section-head">
          <span className="overline">{q ? "Matches" : "Suggested"}</span>
          <span className="t-mono-s c-muted">{hits.length}</span>
        </div>
        {hits.length === 0 ? (
          <div className="search-empty">
            <p className="t-h-s">Nothing for “{query.trim()}”</p>
            <p className="t-body-s muted">Try a ticker, a broker code, or a word like kitta.</p>
          </div>
        ) : (
          hits.map((item) => {
            const meta = searchKind[item.kind];
            return (
              <button key={item.title} type="button" className="search-hit" onClick={() => openHit(item)}>
                <span className={`ico-soft ${meta.tone}`}><Icon name={meta.icon} size={17} /></span>
                <span className="row-main">
                  <span className="t-label-s c-muted">{item.kind}</span>
                  <strong className={item.kind === "Stock" ? "t-ticker" : "t-h-s"}>{item.title}</strong>
                  <small>{item.sub}</small>
                </span>
                <Icon name="chev" size={15} />
              </button>
            );
          })
        )}
      </div>
      <p className="disclaimer">Looks up companies, brokers, IPOs and words. Doesn’t place an order.</p>
    </div>
  );
}

const searchKind: Record<string, { icon: "market" | "cal" | "discover" | "wallet" | "learn"; tone: string }> = {
  Stock: { icon: "market", tone: "teal" },
  IPO: { icon: "cal", tone: "saffron" },
  Broker: { icon: "discover", tone: "violet" },
  Tool: { icon: "wallet", tone: "" },
  Gyan: { icon: "learn", tone: "learn" },
};

export function LearnScreen() {
  const { go, viewport } = useApp();
  return (
    <div>
      {viewport === "mobile" && <div className="page-title"><h1>Learn</h1></div>}
      <div className="pad">
        <p className="t-body-m muted">Tulkey’s current objective first. The library is here when you want more than one sitting.</p>
      </div>
      <div className="pad" style={{ paddingBottom: 12 }}>
        <ObjectiveHero compact />
      </div>
      {lessons.map((l) => (
        <button key={l.title} className="row" onClick={() => go("lesson", { lesson: l.title })}>
          <span className="learn-ico"><Icon name="learn" size={17} /></span>
          <div className="row-main">
            <p className="t-h-s">{l.title}</p>
            <p className="row-sub">{l.sub}</p>
          </div>
          <Icon name="chev" size={15} />
        </button>
      ))}
    </div>
  );
}

export function LessonScreen() {
  const { back, lesson } = useApp();
  return (
    <div>
      <div className="app-bar">
        <button className="icon-btn" onClick={back}><Icon name="back" /></button>
        <h1 className="t-h-m" style={{ flex: 1 }}>{lesson || "Gyan"}</h1>
      </div>
      <div className="pad stack" style={{ gap: 12 }}>
        <p className="t-body-l muted">
          Plain words first, the market term second. This is not a buy or sell call.
        </p>
        <p className="t-body-m">
          {lesson.includes("kitta") && "A kitta is one unit of a share in Nepal’s market. Minimum IPO application is counted in kitta, not in rupees alone."}
          {lesson.includes("NEPSE") && "NEPSE is Nepal’s stock exchange index — a picture of the market, not a company you can buy."}
          {lesson.includes("share") && !lesson.includes("bonus") && "A share is a slice of ownership in a company. If you hold 10 kitta of NABIL, you own a tiny part of Nabil Bank — not a loan to it."}
          {lesson.includes("ex-dividend") && "On the ex-date the share trades without the dividend. The price usually drops by about the cash amount. You still receive the dividend if you held through record date."}
          {lesson.includes("P/E") && "P/E compares price with earnings per share. Useful for valuation, not a verdict by itself."}
          {lesson.includes("unrealised") && "Unrealised P/L is the gain or loss on shares you still hold, using last traded price minus your average cost. It is not cash until you sell."}
          {lesson.includes("return") && "Estimated total return adds unrealised P/L, realised P/L and dividends received. Incomplete ledgers are labelled estimated."}
          {lesson.includes("IPO") && "You apply at MeroShare or C-ASBA. MoneyMitra explains dates and tracks what it can. It does not submit the application."}
          {lesson.includes("circuit") || lesson.includes("15%") ? "Most NEPSE stocks can only move 10% or 15% in a day. Hitting the limit is a fact about the rule, not a recommendation." : null}
          {lesson.includes("Limit") && "A market order fills at whatever price is available. A limit order waits for your price. In a fast hour, a market buy can fill far from the last print."}
          {lesson.includes("TMS") && "TMS is your broker’s trading terminal. MoneyMitra can send you there. It never places the order itself."}
          {lesson.includes("EDIS") && "After you buy, you must transfer the kitta via MeroShare (EDIS) before T+2. Miss it and the exchange can close out the trade at a penalty."}
          {lesson.includes("floor sheet") && "The floor sheet is a list of trades that already happened — who bought, who sold, how many kitta, at what price. It is not the live order book."}
          {!/(kitta|NEPSE|share|ex-dividend|P\/E|unrealised|return|IPO|circuit|15%|Limit|TMS|EDIS|floor sheet)/.test(lesson) && "Tap any underlined number in the product for a sentence like this, then come here if you want the longer lesson."}
        </p>
        <Explain>Open a longer course</Explain>
      </div>
    </div>
  );
}

export function MoreScreen() {
  const { go, viewport, stage, densityLocked, setDensityLocked, openSheet } = useApp();
  return (
    <div>
      {viewport === "mobile" && <div className="page-title"><h1>More</h1></div>}
      <button className="row" onClick={() => go("profile")}>
        <span className="avatar" style={{ width: 34, height: 34, borderRadius: 11 }}>SP</span>
        <div className="row-main">
          <p className="t-h-s">You · {user.fullName}</p>
          <p className="row-sub">Subscription, password and support</p>
        </div>
        <Icon name="chev" size={15} />
      </button>
      <button className="row" onClick={() => openSheet({ kind: "profile" })}>
        <div className="row-main">
          <p className="t-h-s">Home view</p>
          <p className="row-sub">Currently {stageMeta[stage].label}. Tap to pick another Home.</p>
        </div>
        <Icon name="chev" size={15} />
      </button>
      <div className="row">
        <div className="row-main">
          <p className="t-h-s">Lock this Home view</p>
          <p className="row-sub">Stops automatic density changes. You can still switch it yourself.</p>
        </div>
        <button
          type="button"
          className={`toggle ${densityLocked ? "on" : ""}`}
          onClick={() => setDensityLocked(!densityLocked)}
          aria-pressed={densityLocked}
          aria-label="Lock home density"
        />
      </div>
      <button className="row" onClick={() => go("learn")}>
        <span className="learn-ico"><Icon name="learn" size={17} /></span>
        <div className="row-main">
          <p className="t-h-s">Learn</p>
          <p className="row-sub">On mobile, Learn lives here. Same contents as the desktop rail.</p>
        </div>
        <Icon name="chev" size={15} />
      </button>
      <button className="row" onClick={() => go("alerts")}>
        <div className="row-main">
          <p className="t-h-s">Alerts</p>
          <p className="row-sub">Price, event, IPO — you set the rule</p>
        </div>
        <Icon name="chev" size={15} />
      </button>
      <button className="row" onClick={() => openSheet({ kind: "compare" })}>
        <div className="row-main">
          <p className="t-h-s">Compare companies</p>
          <p className="row-sub">Same dates, same definitions</p>
        </div>
        <Icon name="chev" size={15} />
      </button>
      {tools.filter((t) => t.title !== "Compare companies" && t.title !== "Alerts" && t.title !== "Settings").map((t) => (
        t.title.startsWith("Avg cost") ? (
          <button key={t.title} className="row" onClick={() => openSheet({ kind: "metric", id: "wacc" })}>
            <div className="row-main">
              <p className="t-h-s">{t.title}</p>
              <p className="row-sub">{t.sub}</p>
            </div>
            <Icon name="chev" size={15} />
          </button>
        ) : (
          <div key={t.title} className="row">
            <div className="row-main">
              <p className="t-h-s">{t.title}</p>
              <p className="row-sub">{t.sub}</p>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

export function IpoScreen() {
  const { back, openSheet } = useApp();
  return (
    <div>
      <div className="app-bar">
        <button className="icon-btn" onClick={back}><Icon name="back" /></button>
        <h1 className="t-h-m" style={{ flex: 1 }}>IPO</h1>
      </div>
      <div className="pad stack" style={{ gap: 12 }}>
        <Overline>Open</Overline>
        <h2 className="t-h-xl">{liveIpo.name}</h2>
        <p className="t-body-m muted">Rs {liveIpo.price} per kitta · minimum {liveIpo.minKitta} kitta · closes in {liveIpo.closesIn}</p>
        <Explain onClick={() => openSheet({
          kind: "quick",
          title: "What is a kitta?",
          body: "A kitta is one unit of a share. IPO applications are expressed in kitta, usually with a stated minimum.",
        })}>What is a kitta?</Explain>
        <p className="t-body-s" style={{ color: "var(--warn-text)" }}>
          You apply at MeroShare / C-ASBA. MoneyMitra does not submit the application.
        </p>
        <Button variant="primary" size="lg">Continue in MeroShare <Icon name="ext" size={15} /></Button>
        <p className="t-body-xs muted">Also tracked: {ipo.name} · closes {ipo.closes}. Prospectus remains the authority.</p>
      </div>
    </div>
  );
}
