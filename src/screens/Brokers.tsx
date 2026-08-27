import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { BrokerMark } from "../ds/BrokerMark";
import { TickerMark } from "../ds/TickerMark";
import { Button, Chip, Explain, SearchField } from "../ds/primitives";
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

type SortKey = "turnover" | "name";
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

export function BrokersScreen() {
  const { back, viewport, brokerDesk, setBrokerDesk, brokerCode, setBrokerCode, fulfillObjective } = useApp();
  const [fromDesk, setFromDesk] = useState<Exclude<BrokerDesk, "detail">>("hub");
  const broker = getBroker(brokerCode);
  const title = brokerDesk === "detail" ? broker.short : "Broker Chirfaar";

  useEffect(() => {
    fulfillObjective("brokers");
  }, [fulfillObjective]);

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
          <Chip selected={sort === "name"} onClick={() => setSort("name")}>A–Z</Chip>
        </div>
      </div>
      <section className="market-block">
        <header className="market-block-head">
          <h2>Licensed brokers</h2>
          <span className="t-body-xs muted">{rows.length}</span>
        </header>
        <div className="market-block-body">
          <div className="quote-list">
            {rows.map((row) => (
              <BrokerRow key={row.code} row={row} onOpen={onOpen} />
            ))}
          </div>
          {rows.length === 0 && (
            <p className="foot-note">No broker matches that name or number.</p>
          )}
        </div>
      </section>
      <div className="market-helps">
        <Explain onClick={() => openSheet(tmsSheet())}>How TMS works</Explain>
      </div>
    </>
  );
}

function BrokerRow({ row, onOpen }: { row: BrokerHouse; onOpen: (code: string) => void }) {
  return (
    <button type="button" className="quote-list-row" onClick={() => onOpen(row.code)}>
      <BrokerMark code={row.code} />
      <span className="quote-id">
        <span className="t-ticker">{row.short}</span>
        <small>Broker {row.code} · {row.city}</small>
      </span>
      <span className="quote-list-meta">
        <b>{npr(row.turnover, 1)} Cr</b>
        <em className={row.netCr < 0 ? "c-down" : "c-up"}>{row.netCr < 0 ? "Net sell" : "Net buy"}</em>
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
  const { go, openSheet, viewport } = useApp();
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

  return (
    <>
      <section className="market-block">
        <header className="market-block-head">
          <h2>Most active today</h2>
        </header>
        <div className="market-block-body">
          <div className="quote-list brk-highlights">
            {brokerHighlights.map((item) => (
              <button
                key={item.label}
                type="button"
                className="quote-list-row"
                onClick={() => (item.broker ? onOpen(item.broker) : go("stock", { stock: item.stock ?? item.value }))}
              >
                {item.broker ? <BrokerMark code={item.broker} /> : <TickerMark symbol={item.value} />}
                <span className="quote-id">
                  <span className="t-ticker">{item.broker ? `Broker ${item.value}` : item.value}</span>
                  <small>{item.label}</small>
                </span>
                <span className="quote-list-meta">
                  <b>{item.name}</b>
                  <em className={item.tone === "up" ? "c-up" : "c-down"}>{item.sub}</em>
                </span>
              </button>
            ))}
          </div>
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
            {viewport === "mobile" ? "Swipe for share · tap a row" : "Tap a row for the broker"}
          </span>
        </header>
        <div className="market-block-body">
          <div className="desk-live-scroll broker-grid-scroll">
            <table className="sheet-table desk-live-grid broker-grid">
              <thead>
                <tr>
                  <th>Broker</th>
                  <th className="num">Buy Cr</th>
                  <th className="num">Sell Cr</th>
                  <th className="num">Buy/sell</th>
                  <th className="num">Share %</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.code} tabIndex={0} onClick={() => onOpen(row.code)}>
                    <td>
                      <span className="sheet-name">
                        <BrokerMark code={row.code} size="sm" />
                        <span className="broker-grid-id">
                          <b>{row.code}</b>
                          <small>{row.short}</small>
                        </span>
                      </span>
                    </td>
                    <td className="num">{npr(row.buyCr, 1)}</td>
                    <td className="num">{npr(row.sellCr, 1)}</td>
                    <td className="num">
                      <b className={row.ratio >= 1 ? "c-up" : "c-down"}>{row.ratio.toFixed(2)}</b>
                      <small>{row.ratio >= 1 ? "net buy" : "net sell"}</small>
                    </td>
                    <td className="num">{npr(row.sharePct, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              body: "Buy value divided by sell value through that broker today. Above 1.00 means more buying than selling passed through it. Share is the broker’s slice of the whole session’s turnover.",
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

      <div className="market-stats four">
        <div><small>Turnover</small><b>{npr(broker.turnover, 1)} Cr</b></div>
        <div><small>Bought</small><b className="c-up">{npr(broker.buyCr, 1)} Cr</b></div>
        <div><small>Sold</small><b className="c-down">{npr(broker.sellCr, 1)} Cr</b></div>
        <div><small>Buy/sell</small><b>{broker.ratio.toFixed(2)}</b></div>
      </div>
      <div className="pad" style={{ paddingTop: 12 }}>
        <div className="broker-split lg" aria-hidden>
          <i className="up" style={{ flexGrow: broker.buyPct }} />
          <i className="down" style={{ flexGrow: broker.sellPct }} />
        </div>
        <p className="t-body-xs muted">
          {broker.buyPct}% buy · {broker.sellPct}% sell of its own turnover
        </p>
      </div>

      {picks.length === 0 && (
        <p className="foot-note">Stock-level activity unavailable for Broker {broker.code} this session.</p>
      )}
      <TradedGroup title="Bought" side="buy" rows={bought} onPick={(symbol) => go("stock", { stock: symbol })} />
      <TradedGroup title="Sold" side="sell" rows={sold} onPick={(symbol) => go("stock", { stock: symbol })} />

      <p className="foot-note">{activityMethod}</p>
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
  onPick,
}: {
  title: string;
  side: "buy" | "sell";
  rows: { symbol: string; name: string; kitta: string; amount: string }[];
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
        <div className="quote-list">
          {rows.map((row) => (
            <button key={row.symbol} type="button" className="quote-list-row" onClick={() => onPick(row.symbol)}>
              <TickerMark symbol={row.symbol} />
              <span className="quote-id">
                <span className="t-ticker">{row.symbol}</span>
                <small>{row.name}</small>
              </span>
              <span className="quote-list-meta">
                <b>{row.amount}</b>
                <em className="muted">{row.kitta} kitta</em>
              </span>
            </button>
          ))}
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
        <div className="market-block-body">
          <p className="foot-note" style={{ paddingTop: 10 }}>
            {buyers} of {rows.length} brokers ended the day net buyers of {symbol}.
          </p>
          <div className="desk-live-scroll broker-grid-scroll">
            <table className="sheet-table desk-live-grid broker-grid">
              <thead>
                <tr>
                  <th>Broker</th>
                  <th className="num">Net kitta</th>
                  <th className="num">Bought</th>
                  <th className="num">Sold</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const broker = getBroker(row.code);
                  const net = row.bought - row.sold;
                  return (
                    <tr key={row.code} tabIndex={0} onClick={() => onOpen(row.code)}>
                      <td>
                        <span className="sheet-name">
                          <BrokerMark code={row.code} size="sm" />
                          <span className="broker-grid-id">
                            <b>{row.code}</b>
                            <small>{broker.short}</small>
                          </span>
                        </span>
                      </td>
                      <td className="num">
                        <b className={net >= 0 ? "c-up" : "c-down"}>{net >= 0 ? "+" : "−"}{npr(Math.abs(net))}</b>
                        <small>{net >= 0 ? "net buy" : "net sell"}</small>
                      </td>
                      <td className="num">{npr(row.bought)}</td>
                      <td className="num">{npr(row.sold)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
          <div className="desk-live-scroll broker-grid-scroll wide">
            <table className="sheet-table desk-live-grid broker-grid wide">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th className="num">Buyer</th>
                  <th className="num">Seller</th>
                  <th className="num">Kitta</th>
                  <th className="num">Rate</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {brokerPrints.map((row, index) => (
                  <tr key={`${row.symbol}-${index}`} tabIndex={0} onClick={() => go("stock", { stock: row.symbol })}>
                    <td>
                      <span className="sheet-name">
                        <TickerMark symbol={row.symbol} size="sm" />
                        <span className="broker-grid-id">
                          <b>{row.symbol}</b>
                        </span>
                      </span>
                    </td>
                    <td className="num">{row.buyer}</td>
                    <td className="num">{row.seller}</td>
                    <td className="num">{npr(row.qty)}</td>
                    <td className="num">{npr(row.rate, 1)}</td>
                    <td className="num">{npr(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

  return (
    <>
      <div className="broker-file">
        <div className="broker-file-id">
          <BrokerMark code={broker.code} size="lg" />
          <div>
            <p className="t-h-l">{broker.name}</p>
            <p className="t-body-s muted">Broker {broker.code} · {broker.city} · SEBON member</p>
          </div>
        </div>
        <p className="hero-num">{npr(broker.turnover, 1)} Cr</p>
        <p className="t-body-s muted">
          Turnover today · {broker.netCr < 0 ? "net seller" : "net buyer"} {npr(Math.abs(broker.netCr), 1)} Cr
        </p>
        <div className="broker-split lg" aria-hidden>
          <i className="up" style={{ flexGrow: broker.buyPct }} />
          <i className="down" style={{ flexGrow: broker.sellPct }} />
        </div>
        <p className="t-body-xs muted">{broker.buyPct}% buy · {broker.sellPct}% sell</p>
      </div>

      <section className="market-block">
        <header className="market-block-head">
          <h2>Today</h2>
        </header>
        <div className="market-block-body">
          <div className="kv"><span>Purchase</span><b>{npr(broker.buyCr, 1)} Cr</b></div>
          <div className="kv"><span>Sales</span><b>{npr(broker.sellCr, 1)} Cr</b></div>
          <div className="kv"><span>Matching</span><b>{broker.matching}</b></div>
          <div className="kv"><span>Avg 30 days</span><b>{npr(broker.avg30, 1)} Cr</b></div>
          <div className="kv"><span>Share of session</span><b>{npr(broker.sharePct, 1)}%</b></div>
        </div>
        <p className="foot-note">{activityMethod}</p>
      </section>

      {picks.length > 0 && (
        <section className="market-block">
          <header className="market-block-head">
            <h2>Stocks traded today</h2>
          </header>
          <div className="market-block-body">
            <div className="quote-list">
              {picks.map((row) => (
                <button
                  key={`${row.symbol}-${row.side}`}
                  type="button"
                  className="quote-list-row"
                  onClick={() => go("stock", { stock: row.symbol })}
                >
                  <TickerMark symbol={row.symbol} />
                  <span className="quote-id">
                    <span className="t-ticker">{row.symbol}</span>
                    <small>{row.kitta} kitta</small>
                  </span>
                  <span className="quote-list-meta">
                    <b>{row.amount}</b>
                    <em className={row.side === "buy" ? "c-up" : "c-down"}>{row.side === "buy" ? "Bought" : "Sold"}</em>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {trades.length > 0 && (
        <section className="market-block">
          <header className="market-block-head">
            <h2>Floor sheet trades</h2>
          </header>
          <div className="market-block-body">
            <div className="quote-list">
              {trades.map((row, index) => (
                <button
                  key={`${row.symbol}-${index}`}
                  type="button"
                  className="quote-list-row"
                  onClick={() => go("stock", { stock: row.symbol })}
                >
                  <TickerMark symbol={row.symbol} size="sm" />
                  <span className="quote-id">
                    <span className="t-ticker">{row.symbol}</span>
                    <small>{row.buyer} → {row.seller}</small>
                  </span>
                  <span className="quote-list-meta">
                    <b>{npr(row.qty)} · {npr(row.rate, 1)}</b>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="market-block">
        <header className="market-block-head">
          <h2>Service</h2>
        </header>
        <div className="market-block-body">
          <div className="kv"><span>Collateral</span><b>{broker.collateral}</b></div>
          <div className="kv"><span>Avg. credit</span><b>{broker.creditDays} days</b></div>
          <div className="kv"><span>Cash deposit</span><b>{broker.depositDays} days</b></div>
        </div>
      </section>

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
