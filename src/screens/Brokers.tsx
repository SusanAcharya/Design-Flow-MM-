import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { BrokerMark } from "../ds/BrokerMark";
import { TickerMark } from "../ds/TickerMark";
import { Button, Chip, Explain, SearchField } from "../ds/primitives";
import { ListHead, NetBar, PaceBars } from "../ds/desk";
import {
  brokerChoice,
  brokerHighlights,
  brokerHouses,
  brokerNote,
  brokerPrints,
  getBroker,
  nepse,
  stockFlow,
} from "../lib/data";
import { npr } from "../lib/format";
import { useApp } from "../lib/state";
import type { BrokerHouse } from "../lib/data";
import type { BrokerDesk } from "../lib/types";

type SortKey = "turnover" | "name" | "credit";
type BrokerSort = "turnover" | "buy" | "sell" | "ratio";
type ActivityView = "top" | "broker" | "stock" | "sheet";

/* Broker Chirfaar covers two different jobs and the spec keeps them apart:
   choosing a broker to trade with, and reading observed broker activity. */
const activityViews: { id: ActivityView; label: string }[] = [
  { id: "top", label: "Top brokers" },
  { id: "broker", label: "By broker" },
  { id: "stock", label: "By stock" },
  { id: "sheet", label: "Floor sheet" },
];

/* Source, period and method for every derived broker number on this screen. */
const activityMethod = `Source: NEPSE floor sheet · ${nepse.date} close · executed trades only`;

function tmsSheet() {
  return {
    kind: "quick" as const,
    title: "How a TMS account works",
    body: "TMS is your broker’s trading terminal. You open it with a licensed broker, then place orders there. MoneyMitra never holds cash or submits those orders.",
    note: "This is not a ranked list. Check SEBON’s licensed broker list.",
  };
}

function portalSheet(title: string, body: string) {
  return {
    kind: "quick" as const,
    title,
    body,
    note: "This opens the named site. MoneyMitra does not log you in.",
  };
}

function serviceSheet() {
  return {
    kind: "quick" as const,
    title: "What the service terms mean",
    body: "Collateral is how much the house lends against shares you pledge. Credit is how long a sale takes to reach your bank. Cash deposit is how long money you send takes to show in TMS.",
    note: "Terms are quoted by the houses and change. Confirm with the broker before you open an account.",
  };
}

export function BrokersScreen() {
  const { back, viewport, brokerDesk, setBrokerDesk, brokerCode, setBrokerCode } = useApp();
  const [fromDesk, setFromDesk] = useState<Exclude<BrokerDesk, "detail">>("hub");
  const broker = getBroker(brokerCode);
  const title = brokerDesk === "detail" ? broker.short : "Broker Chirfaar";

  const openBroker = (code: string) => {
    if (brokerDesk !== "detail") setFromDesk(brokerDesk);
    setBrokerCode(code);
    setBrokerDesk("detail");
  };

  const onBack = () => {
    if (brokerDesk === "detail") setBrokerDesk(fromDesk);
    else back();
  };

  return (
    <div className="desk-screen broker-desk">
      {viewport === "mobile" && (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>{title}</h1>
        </div>
      )}
      {viewport === "web" && (
        <div className="desk-web-head">
          <button type="button" className="text-link web-back" onClick={onBack}>‹ Back</button>
          <div className="desk-web-title">
            <h1 className="t-h-xl">{title}</h1>
          </div>
        </div>
      )}
      {brokerDesk !== "detail" && (
        <div className="desk-tabs">
          <div className="home-feed-tabs" role="tablist" aria-label="Brokers">
            <button
              type="button"
              role="tab"
              aria-selected={brokerDesk === "hub"}
              className={brokerDesk === "hub" ? "on" : ""}
              onClick={() => setBrokerDesk("hub")}
            >
              Choose a broker
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={brokerDesk === "analysis"}
              className={brokerDesk === "analysis" ? "on" : ""}
              onClick={() => setBrokerDesk("analysis")}
            >
              Broker activity
            </button>
          </div>
        </div>
      )}
      {brokerDesk === "hub" && <ChooseBrokerDesk onOpen={openBroker} />}
      {brokerDesk === "analysis" && <BrokerActivityDesk onOpen={openBroker} />}
      {brokerDesk === "detail" && <BrokerProfile />}
    </div>
  );
}

function ChooseBrokerDesk({ onOpen }: { onOpen: (code: string) => void }) {
  const { openSheet } = useApp();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("turnover");
  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    const filtered = brokerHouses.filter((row) => {
      if (!q) return true;
      return `${row.code} ${row.name} ${row.short} ${row.city}`.toLowerCase().includes(q);
    });
    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "credit") return a.creditDays - b.creditDays || a.depositDays - b.depositDays;
      return b.turnover - a.turnover;
    });
  }, [q, sort]);

  return (
    <>
      <div className="desk-controls">
        <div className="pad" style={{ paddingTop: 8, paddingBottom: 4 }}>
          <SearchField placeholder="Broker number or name" value={query} onChange={setQuery} />
        </div>
        <div className="broker-sort">
          <Chip selected={sort === "turnover"} onClick={() => setSort("turnover")}>Turnover</Chip>
          <Chip selected={sort === "credit"} onClick={() => setSort("credit")}>Fastest credit</Chip>
          <Chip selected={sort === "name"} onClick={() => setSort("name")}>A–Z</Chip>
        </div>
      </div>

      <section className="market-block">
        <header className="market-block-head">
          <h2>Licensed brokers</h2>
          <span className="t-body-xs muted">{rows.length} SEBON members</span>
        </header>
        <div className="market-block-body">
          <div className="brk-grid">
            <ListHead cols={[null, "Broker", "Turnover today"]} />
            {rows.map((row) => (
              <BrokerCard key={row.code} row={row} onOpen={onOpen} />
            ))}
          </div>
          {rows.length === 0 && (
            <p className="foot-note" style={{ padding: "14px" }}>No broker matches that name or number.</p>
          )}
        </div>
      </section>

      <div className="market-helps">
        <Explain onClick={() => openSheet(tmsSheet())}>How TMS works</Explain>
      </div>
    </>
  );
}

/* Who they are, how busy they were, and which way they leaned. The split, the
   settlement terms and the month's pace are all one tap away on the profile —
   this row only has to be enough to choose which profile to open. */
function BrokerCard({ row, onOpen }: { row: BrokerHouse; onOpen: (code: string) => void }) {
  const selling = row.netCr < 0;
  return (
    <button type="button" className="brk-card" onClick={() => onOpen(row.code)}>
      <BrokerMark code={row.code} />
      <span className="brk-id">
        <strong>{row.short}</strong>
        <small>Broker {row.code} · {row.city}</small>
      </span>
      <span className="brk-turn">
        <b>{npr(row.turnover, 1)} Cr</b>
        <em className={`side-tag ${selling ? "down" : "up"}`}>
          {selling ? "Net seller" : "Net buyer"}
        </em>
      </span>
    </button>
  );
}

function BrokerActivityDesk({ onOpen }: { onOpen: (code: string) => void }) {
  const [view, setView] = useState<ActivityView>("top");
  const session = brokerHouses.length > 0;

  return (
    <>
      <p className="market-intro">
        Market closed · last update {nepse.closedAt} · {nepse.date}
      </p>

      <div className="tabs broker-views" role="tablist" aria-label="Broker activity">
        {activityViews.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={view === tab.id}
            className={view === tab.id ? "on" : ""}
            onClick={() => setView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!session && (
        <section className="market-block">
          <div className="market-block-body">
            <p className="foot-note" style={{ padding: "16px 14px" }}>
              Broker activity unavailable for this session.
            </p>
          </div>
        </section>
      )}
      {session && view === "top" && <TopBrokersView onOpen={onOpen} />}
      {session && view === "broker" && <ByBrokerView onOpen={onOpen} />}
      {session && view === "stock" && <ByStockView onOpen={onOpen} />}
      {session && view === "sheet" && <FloorSheetView />}
    </>
  );
}

function Picker({
  label,
  face,
  children,
}: {
  label: string;
  face: ReactNode;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`broker-pick-in ${open ? "open" : ""}`}>
      <button
        type="button"
        className="broker-pick-row"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((was) => !was)}
      >
        {face}
        <Icon name="chev" size={14} />
      </button>
      {open && (
        <ul className="broker-pick-menu" role="listbox" aria-label={label}>
          {children(() => setOpen(false))}
        </ul>
      )}
    </div>
  );
}

function TopBrokersView({ onOpen }: { onOpen: (code: string) => void }) {
  const { go, openSheet } = useApp();
  const [sort, setSort] = useState<BrokerSort>("turnover");
  const rows = useMemo(
    () =>
      [...brokerHouses].sort((a, b) => {
        if (sort === "buy") return b.buyCr - a.buyCr;
        if (sort === "sell") return b.sellCr - a.sellCr;
        if (sort === "ratio") return b.ratio - a.ratio;
        return b.turnover - a.turnover;
      }),
    [sort],
  );

  /* How much of the whole session went through the three busiest desks — the
     one concentration figure worth carrying on the landing view. */
  const topThree = useMemo(
    () =>
      [...brokerHouses]
        .sort((a, b) => b.sharePct - a.sharePct)
        .slice(0, 3)
        .reduce((sum, row) => sum + row.sharePct, 0),
    [],
  );

  return (
    <>
      <section className="market-block">
        <header className="market-block-head">
          <h2>Most active today</h2>
        </header>
        <div className="brk-tiles">
          {brokerHighlights.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`brk-tile t-${item.tone}`}
              onClick={() => (item.broker ? onOpen(item.broker) : go("stock", { stock: item.stock ?? item.value }))}
            >
              <span className="brk-tile-top">
                {item.broker ? <BrokerMark code={item.broker} size="sm" /> : <TickerMark symbol={item.value} size="sm" />}
                <small>{item.label}</small>
              </span>
              <b>{item.broker ? `Broker ${item.value}` : item.value}</b>
              <span className="brk-tile-sub">{item.name}</span>
              <em className={item.tone === "up" ? "c-up" : "c-down"}>{item.sub}</em>
            </button>
          ))}
        </div>
      </section>

      <div className="broker-sort">
        <Chip selected={sort === "turnover"} onClick={() => setSort("turnover")}>Turnover</Chip>
        <Chip selected={sort === "buy"} onClick={() => setSort("buy")}>Buy</Chip>
        <Chip selected={sort === "sell"} onClick={() => setSort("sell")}>Sell</Chip>
        <Chip selected={sort === "ratio"} onClick={() => setSort("ratio")}>Buy/sell</Chip>
      </div>

      <section className="market-block">
        <header className="market-block-head">
          <h2>All {rows.length} brokers</h2>
          <span className="t-body-xs muted">
Top 3 carried {topThree.toFixed(0)}%
          </span>
        </header>
        <div className="market-block-body">
          {/* Rank, house, how much and which way. Opening one shows its split,
              its month's pace and the names it traded. */}
          <div className="brk-rank-list">
            <ListHead cols={[null, null, "Broker", "Turnover today"]} />
            {rows.map((row, index) => (
              <button
                key={row.code}
                type="button"
                className="brk-rank-row"
                onClick={() => onOpen(row.code)}
              >
                <i className="brk-rank-no">{index + 1}</i>
                <BrokerMark code={row.code} size="sm" />
                <span className="brk-rank-id">
                  <strong>Broker {row.code}</strong>
                  <small>{row.short}</small>
                </span>
                <span className="brk-rank-num">
                  <b>{npr(row.turnover, 1)} Cr</b>
                  <em className={`side-tag ${row.ratio >= 1 ? "up" : "down"}`}>
                    {row.ratio >= 1 ? "Net buyer" : "Net seller"}
                  </em>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <p className="foot-note">{activityMethod}</p>
      <div className="market-helps">
        <Explain
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "Reading the buy/sell ratio",
              body: "Buy value divided by sell value through that broker today. Above 1.00 means more buying than selling passed through it. Share is the broker’s slice of the whole session’s turnover — the three busiest desks together carried most of it.",
              note: "Observed activity, not intent, and not a broker ranking. A busy broker is not a better broker.",
            })
          }
        >
          What is the buy/sell ratio?
        </Explain>
      </div>
    </>
  );
}

function ByBrokerView({ onOpen }: { onOpen: (code: string) => void }) {
  const { go, openSheet } = useApp();
  const [code, setCode] = useState("33");
  const broker = getBroker(code);
  const picks = brokerChoice[code] ?? [];
  const bought = picks.filter((row) => row.side === "buy");
  const sold = picks.filter((row) => row.side === "sell");
  /* One scale across both groups, so a 24 Cr buy dwarfs a 4 Cr sell on screen
     the way it does in the numbers. */
  const pickMax = picks.reduce((max, row) => Math.max(max, Number.parseFloat(row.amount)), 1);

  return (
    <>
      <div className="pad" style={{ paddingTop: 10, paddingBottom: 2 }}>
        <Picker
          label="Choose a broker"
          face={
            <>
              <BrokerMark code={broker.code} size="sm" />
              <span className="quote-id">
                <span className="t-ticker">{broker.short}</span>
                <small>Broker {broker.code} · {broker.city}</small>
              </span>
            </>
          }
        >
          {(close) =>
            brokerHouses.map((row) => (
              <li key={row.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={code === row.code}
                  className={code === row.code ? "on" : ""}
                  onClick={() => {
                    setCode(row.code);
                    close();
                  }}
                >
                  <BrokerMark code={row.code} size="sm" />
                  {row.short} · {row.code}
                </button>
              </li>
            ))
          }
        </Picker>
      </div>

      <section className="brk-flowcard">
        <header>
          <span className="overline">Where its turnover went</span>
          <b>{npr(broker.turnover, 1)} Cr</b>
        </header>
        <div className="brk-scale">
          <i className="up" style={{ flexGrow: broker.buyPct }}>
            <b>{npr(broker.buyCr, 1)} Cr</b>
            <small>{broker.buyPct}% bought</small>
          </i>
          <i className="down" style={{ flexGrow: broker.sellPct }}>
            <b>{npr(broker.sellCr, 1)} Cr</b>
            <small>{broker.sellPct}% sold</small>
          </i>
        </div>
        <p className="brk-scale-read">
          Ended the day a <b className={broker.netCr < 0 ? "c-down" : "c-up"}>
            {broker.netCr < 0 ? "net seller" : "net buyer"} of {npr(Math.abs(broker.netCr), 1)} Cr
          </b>
          {" "}· buy/sell {broker.ratio.toFixed(2)} · {npr(broker.sharePct, 1)}% of the session.
        </p>
        <PaceBars today={broker.turnover} average={broker.avg30} />
      </section>

      {picks.length === 0 && (
        <p className="foot-note">Stock-level activity unavailable for Broker {broker.code} this session.</p>
      )}
      <TradedGroup title="Bought" side="buy" rows={bought} max={pickMax} onPick={(symbol) => go("stock", { stock: symbol })} />
      <TradedGroup title="Sold" side="sell" rows={sold} max={pickMax} onPick={(symbol) => go("stock", { stock: symbol })} />

      <p className="foot-note">
        Each bar is that name’s value against the biggest name this broker traded today. {activityMethod}
      </p>
      <div className="market-helps">
        <button type="button" className="text-link" onClick={() => onOpen(broker.code)}>
          Open Broker {broker.code} profile ›
        </button>
        <Explain
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "Whose trades are these?",
              body: "This is the sum of what that broker’s clients did today. It is not the broker’s own position and not a view the broker holds on the stock.",
              note: "Observed activity, not intent. Do not read it as a tip.",
            })
          }
        >
          Whose trades are these?
        </Explain>
      </div>
    </>
  );
}

function TradedGroup({
  title,
  side,
  rows,
  max,
  onPick,
}: {
  title: string;
  side: "buy" | "sell";
  rows: { symbol: string; name: string; kitta: string; amount: string }[];
  max: number;
  onPick: (symbol: string) => void;
}) {
  if (rows.length === 0) return null;
  return (
    <section className="market-block">
      <header className="market-block-head">
        <h2>{title}</h2>
        <span className={`t-body-xs ${side === "buy" ? "c-up" : "c-down"}`}>
          {rows.length} {rows.length === 1 ? "stock" : "stocks"}
        </span>
      </header>
      <div className="market-block-body">
        <div className="brk-traded">
        <div className="list-head" aria-hidden>
          <span />
          <span>Stock</span>
          <span>Share of its biggest name</span>
          <span>Value · kitta</span>
        </div>
        {rows.map((row) => {
          const amount = Number.parseFloat(row.amount);
          return (
            <button key={row.symbol} type="button" className="brk-traded-row" onClick={() => onPick(row.symbol)}>
              <TickerMark symbol={row.symbol} size="sm" />
              <span className="brk-traded-id">
                <strong>{row.symbol}</strong>
                <small>{row.name}</small>
              </span>
              <span className="brk-traded-viz">
                <i className={`brk-traded-bar ${side}`} style={{ width: `${(amount / max) * 100}%` }} />
              </span>
              <span className="brk-traded-num">
                <b>{row.amount}</b>
                <em>{row.kitta} kitta</em>
              </span>
            </button>
          );
        })}
      </div>
      </div>
    </section>
  );
}

function ByStockView({ onOpen }: { onOpen: (code: string) => void }) {
  const { go, openSheet } = useApp();
  const symbols = Object.keys(stockFlow);
  const [symbol, setSymbol] = useState(symbols[0]);
  const flow = stockFlow[symbol];
  const rows = useMemo(
    () => [...flow.brokers].sort((a, b) => b.bought - b.sold - (a.bought - a.sold)),
    [flow],
  );
  const buyers = rows.filter((row) => row.bought > row.sold).length;
  const netMax = rows.reduce((max, row) => Math.max(max, Math.abs(row.bought - row.sold)), 1);
  const traded = rows.reduce((sum, row) => sum + row.bought + row.sold, 0);

  return (
    <>
      <div className="pad" style={{ paddingTop: 10, paddingBottom: 2 }}>
        <Picker
          label="Choose a stock"
          face={
            <>
              <TickerMark symbol={symbol} size="sm" />
              <span className="quote-id">
                <span className="t-ticker">{symbol}</span>
                <small>{flow.name}</small>
              </span>
            </>
          }
        >
          {(close) =>
            symbols.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={symbol === code}
                  className={symbol === code ? "on" : ""}
                  onClick={() => {
                    setSymbol(code);
                    close();
                  }}
                >
                  <TickerMark symbol={code} size="sm" />
                  {code} · {stockFlow[code].name}
                </button>
              </li>
            ))
          }
        </Picker>
      </div>

      <section className="market-block">
        <header className="market-block-head">
          <h2>Brokers in {symbol}</h2>
          <button type="button" className="text-link" onClick={() => go("stock", { stock: symbol })}>Stock ›</button>
        </header>
        <p className="brk-net-read">
          <b>{buyers}</b> of {rows.length} brokers ended the day net buyers of {symbol}, on{" "}
          {npr(traded)} kitta traded between them.
        </p>
        <div className="market-block-body">
        <div className="brk-net">
          <div className="brk-net-head" aria-hidden>
            <span>Broker</span>
            <span className="brk-net-axis-cap">
              <em className="c-down">net sold</em>
              <em className="c-up">net bought</em>
            </span>
            <span className="num">Bought / sold</span>
          </div>
          {rows.map((row) => {
            const broker = getBroker(row.code);
            const net = row.bought - row.sold;
            return (
              <button key={row.code} type="button" className="brk-net-row" onClick={() => onOpen(row.code)}>
                <span className="brk-net-id">
                  <BrokerMark code={row.code} size="sm" />
                  <span className="broker-grid-id">
                    <b>{row.code}</b>
                    <small>{broker.short}</small>
                  </span>
                </span>
                <NetBar value={net} max={netMax}>
                  {net >= 0 ? "+" : "−"}{npr(Math.abs(net))}
                </NetBar>
                <span className="brk-net-num num">
                  <b className="c-up">{npr(row.bought)}</b>
                  <em className="c-down">{npr(row.sold)}</em>
                </span>
              </button>
            );
          })}
        </div>
        </div>
      </section>

      <p className="foot-note">{activityMethod}</p>
      <div className="market-helps">
        <Explain
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "One broker on both sides",
              body: "A broker often buys and sells the same stock on one day, because different clients sit on different sides. Net kitta is what is left after the two cancel out.",
              note: "Kitta counts from executed trades. Heavy buying through one broker does not predict the price.",
            })
          }
        >
          Why does one broker both buy and sell?
        </Explain>
      </div>
    </>
  );
}

function FloorSheetView() {
  const { go, openSheet } = useApp();
  return (
    <>
      <div className="market-stats four">
        <div><small>Trades</small><b>{npr(nepse.transactions)}</b></div>
        <div><small>Kitta</small><b>{nepse.kitta}</b></div>
        <div><small>Turnover</small><b>{npr(nepse.turnoverCr, 2)} Cr</b></div>
        <div><small>Companies</small><b>{nepse.companies}</b></div>
      </div>

      <section className="market-block">
        <header className="market-block-head">
          <h2>Last {brokerPrints.length} trades</h2>
          <button type="button" className="text-link" onClick={() => go("market", { marketTab: "Floor sheet" })}>
            Full sheet ›
          </button>
        </header>
        <div className="market-block-body">
        <div className="brk-tape">
          <div className="brk-tape-head" aria-hidden>
            <span>Stock</span>
            <span>Buyer ← seller</span>
            <span className="num">Kitta · rate</span>
            <span className="num">Amount</span>
          </div>
          {brokerPrints.map((row, index) => (
            <button
              key={`${row.symbol}-${index}`}
              type="button"
              className="brk-tape-row"
              onClick={() => go("stock", { stock: row.symbol })}
            >
              <span className="brk-tape-id">
                <TickerMark symbol={row.symbol} size="sm" />
                <b>{row.symbol}</b>
              </span>
              <span className="brk-tape-hands">
                <i className="buyer">{row.buyer}</i>
                <Icon name="back" size={12} />
                <i className="seller">{row.seller}</i>
              </span>
              <span className="brk-tape-qty num">
                <b>{npr(row.qty)}</b>
                <em>at {npr(row.rate, 1)}</em>
              </span>
              <span className="brk-tape-amt num">{npr(row.amount)}</span>
            </button>
          ))}
        </div>
        </div>
      </section>

      <p className="foot-note">{activityMethod}</p>
      <div className="market-helps">
        <Explain
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "What is a floor sheet?",
              body: "A floor sheet is the record of trades that already happened: stock, kitta, rate and the broker numbers on each side. Buyer and seller are broker numbers, not client names.",
              note: "This is not the live order book, and not the same as market depth.",
            })
          }
        >
          What is a floor sheet?
        </Explain>
      </div>
    </>
  );
}

function BrokerProfile() {
  const { go, openSheet, brokerCode } = useApp();
  const broker = getBroker(brokerCode);
  const picks = brokerChoice[broker.code] ?? [];
  const trades = brokerPrints.filter((row) => row.buyer === broker.code || row.seller === broker.code);
  const pickMax = picks.reduce((max, row) => Math.max(max, Number.parseFloat(row.amount)), 1);
  const rank = [...brokerHouses]
    .sort((a, b) => b.turnover - a.turnover)
    .findIndex((row) => row.code === broker.code) + 1;

  return (
    <>
      <section className="brk-file">
        <div className="brk-file-id">
          <BrokerMark code={broker.code} size="lg" />
          <div>
            <p className="t-h-l">{broker.name}</p>
            <p className="t-body-s muted">Broker {broker.code} · {broker.city} · SEBON member</p>
          </div>
          <span className="brk-rank-tag">#{rank} of {brokerHouses.length} today</span>
        </div>

        <div className="brk-file-fig">
          <p className="hero-num">{npr(broker.turnover, 1)} Cr</p>
          <p className="t-body-s muted">
            Turnover today ·{" "}
            <b className={broker.netCr < 0 ? "c-down" : "c-up"}>
              {broker.netCr < 0 ? "net seller" : "net buyer"} {npr(Math.abs(broker.netCr), 1)} Cr
            </b>
          </p>
        </div>

        <div className="brk-scale">
          <i className="up" style={{ flexGrow: broker.buyPct }}>
            <b>{npr(broker.buyCr, 1)} Cr</b>
            <small>{broker.buyPct}% bought</small>
          </i>
          <i className="down" style={{ flexGrow: broker.sellPct }}>
            <b>{npr(broker.sellCr, 1)} Cr</b>
            <small>{broker.sellPct}% sold</small>
          </i>
        </div>
      </section>

      <div className="brk-panels">
        <section className="market-block">
          <header className="market-block-head">
            <h2>How today compares</h2>
          </header>
          <div className="market-block-body">
            <div className="brk-pace">
              <PaceBars today={broker.turnover} average={broker.avg30} />
              <div className="brk-pace-cells">
                <div><small>Matching</small><b>{broker.matching}</b></div>
                <div><small>Share of session</small><b>{npr(broker.sharePct, 1)}%</b></div>
                <div><small>Most active in</small><b>{broker.active}</b></div>
              </div>
            </div>
          </div>
          <p className="foot-note">{activityMethod}</p>
        </section>

        <section className="market-block">
          <header className="market-block-head">
            <h2>Service</h2>
            <button type="button" className="text-link" onClick={() => openSheet(serviceSheet())}>
              What these mean ›
            </button>
          </header>
          <div className="market-block-body">
            <div className="brk-service">
              <div>
                <Icon name="shield" size={18} />
                <b>{broker.collateral}</b>
                <small>Collateral against pledged shares</small>
              </div>
              <div>
                <Icon name="cal" size={18} />
                <b>{broker.creditDays} days</b>
                <small>Average credit after a sale</small>
              </div>
              <div>
                <Icon name="wallet" size={18} />
                <b>{broker.depositDays} days</b>
                <small>Cash deposit to reach TMS</small>
              </div>
            </div>
          </div>
        </section>
      </div>

      {picks.length > 0 && (
        <section className="market-block">
          <header className="market-block-head">
            <h2>Stocks traded today</h2>
            <span className="t-body-xs muted">{picks.length} names</span>
          </header>
          <div className="market-block-body">
        <div className="brk-traded">
            <div className="list-head" aria-hidden>
              <span />
              <span>Stock · kitta</span>
              <span>Share of its biggest name</span>
              <span>Value · side</span>
            </div>
            {picks.map((row) => {
              const amount = Number.parseFloat(row.amount);
              return (
                <button
                  key={`${row.symbol}-${row.side}`}
                  type="button"
                  className="brk-traded-row"
                  onClick={() => go("stock", { stock: row.symbol })}
                >
                  <TickerMark symbol={row.symbol} size="sm" />
                  <span className="brk-traded-id">
                    <strong>{row.symbol}</strong>
                    <small>{row.kitta} kitta</small>
                  </span>
                  <span className="brk-traded-viz">
                    <i
                      className={`brk-traded-bar ${row.side}`}
                      style={{ width: `${(amount / pickMax) * 100}%` }}
                    />
                  </span>
                  <span className="brk-traded-num">
                    <b>{row.amount}</b>
                    <em className={`side-tag ${row.side === "buy" ? "up" : "down"}`}>
                      {row.side === "buy" ? "Bought" : "Sold"}
                    </em>
                  </span>
                </button>
              );
            })}
          </div>
          </div>
          <p className="foot-note">
            Each bar is that name’s value against the biggest name this broker traded today.
          </p>
        </section>
      )}

      {trades.length > 0 && (
        <section className="market-block">
          <header className="market-block-head">
            <h2>Floor sheet trades</h2>
            <span className="t-body-xs muted">{trades.length} prints</span>
          </header>
          <div className="market-block-body">
        <div className="brk-tape">
            <div className="brk-tape-head" aria-hidden>
              <span>Stock</span>
              <span>Buyer ← seller</span>
              <span className="num">Kitta · rate</span>
              <span className="num">Amount</span>
            </div>
            {trades.map((row, index) => (
              <button
                key={`${row.symbol}-${index}`}
                type="button"
                className="brk-tape-row lite"
                onClick={() => go("stock", { stock: row.symbol })}
              >
                <span className="brk-tape-id">
                  <TickerMark symbol={row.symbol} size="sm" />
                  <b>{row.symbol}</b>
                </span>
                <span className="brk-tape-hands">
                  <i className={row.buyer === broker.code ? "buyer on" : "buyer"}>{row.buyer}</i>
                  <Icon name="back" size={12} />
                  <i className={row.seller === broker.code ? "seller on" : "seller"}>{row.seller}</i>
                </span>
                <span className="brk-tape-qty num">
                  <b>{npr(row.qty)}</b>
                  <em>at {npr(row.rate, 1)}</em>
                </span>
                <span className="brk-tape-amt num">{npr(row.amount)}</span>
              </button>
            ))}
          </div>
          </div>
          <p className="foot-note">
            Buyer and seller are broker numbers, not client names. Broker {broker.code} is ringed
            on the side it stood.
          </p>
        </section>
      )}

      <section className="market-block">
        <header className="market-block-head">
          <h2>Open an account</h2>
        </header>
        <div className="market-block-body">
          <div className="pad" style={{ paddingTop: 12, paddingBottom: 12 }}>
            <Button variant="primary" size="md" block onClick={() => openSheet(tmsSheet())}>Open TMS</Button>
          </div>
          <div className="kv" onClick={() => openSheet(portalSheet("Demat", "A demat account holds your shares at the central depository. You open it with a licensed DP. MoneyMitra does not open it."))} style={{ cursor: "pointer" }}>
            <span>Demat</span><b>Guide ›</b>
          </div>
          <div className="kv" onClick={() => openSheet(portalSheet("MeroShare", "IPO apply, EDIS and demat live on MeroShare. MoneyMitra does not log you in or submit forms."))} style={{ cursor: "pointer" }}>
            <span>MeroShare</span><b>Guide ›</b>
          </div>
        </div>
      </section>

      <section className="market-block">
        <header className="market-block-head">
          <h2>About</h2>
        </header>
        <p className="market-intro" style={{ paddingTop: 0 }}>{broker.about}</p>
      </section>

      {broker.code === brokerNote.code && (
        <section className="market-block">
          <header className="market-block-head">
            <h2>One client note</h2>
          </header>
          <div className="market-block-body">
            <p className="foot-note" style={{ paddingTop: 12 }}>{brokerNote.body}</p>
          </div>
        </section>
      )}
    </>
  );
}
