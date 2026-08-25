import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import {
  Badge,
  BreadthBar,
  Button,
  Chip,
  Explain,
  MovePill,
  Overline,
} from "../ds/primitives";
import { SessionWalk } from "../ds/charts";
import {
  floorBrokers,
  floorSheet,
  liveIpo,
  marketEvents,
  moverBoards,
  nepse,
  nepseSession,
  sectors,
  type MoverRow,
  type TapePrint,
} from "../lib/data";
import { npr, pct, signed } from "../lib/format";
import { useApp } from "../lib/state";
import type { MarketTab } from "../lib/types";

const tabs: MarketTab[] = ["Overview", "Movers", "Sectors", "Floor sheet", "Events"];
type MoverView = keyof typeof moverBoards;

const moverViews: { id: MoverView; label: string }[] = [
  { id: "gainers", label: "Gainers" },
  { id: "losers", label: "Losers" },
  { id: "turnover", label: "Turnover" },
  { id: "volume", label: "Volume" },
  { id: "trades", label: "Transactions" },
];
const sectorSorts = ["By change", "By turnover", "A–Z"] as const;
const floorViews = ["By broker", "By symbol", "All trades"] as const;

function ChangeText({ value }: { value: number }) {
  return <b className={value < 0 ? "c-down" : "c-up"}>{pct(value)}</b>;
}

function QuoteRow({
  row,
  note,
  onOpen,
}: {
  row: MoverRow;
  note?: string;
  onOpen: (symbol: string) => void;
}) {
  const circuit = row.extra.includes("cap") || row.changePct >= 9.9;
  return (
    <button type="button" className="row" onClick={() => onOpen(row.symbol)}>
      <div className="row-main">
        <p className="t-ticker">
          {row.symbol}
          {circuit && <Badge tone="warn">Circuit</Badge>}
        </p>
        <p className="row-sub">{note ?? row.name}</p>
      </div>
      <div className="row-meta">
        <p className="t-mono-m">{npr(row.price, 2)}</p>
        <ChangeText value={row.changePct} />
      </div>
    </button>
  );
}

function MarketBlock({
  title,
  action,
  onAction,
  children,
}: {
  title?: string;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="market-block">
      {(title || action) && (
        <header className="market-block-head">
          {title ? <h2>{title}</h2> : <span />}
          {action && (
            <button type="button" className="text-link" onClick={onAction}>{action}</button>
          )}
        </header>
      )}
      <div className="market-block-body">{children}</div>
    </section>
  );
}

export function MarketScreen() {
  const { flash, go, openSheet, session, viewport, marketTab: tab, setMarketTab } = useApp();
  const [index, setIndex] = useState("NEPSE");
  const [moverView, setMoverView] = useState<MoverView>("gainers");
  const [sectorSort, setSectorSort] = useState<(typeof sectorSorts)[number]>("By change");
  const [floorView, setFloorView] = useState<(typeof floorViews)[number]>("By broker");
  const [scrub, setScrub] = useState<TapePrint | null>(null);

  const shown = scrub?.v ?? nepse.value;
  const shownChange = shown - nepseSession.prevClose;
  const shownPct = (shownChange / nepseSession.prevClose) * 100;
  const sectorRows = useMemo(() => {
    const rows = [...sectors];
    if (sectorSort === "By change") rows.sort((a, b) => b.changePct - a.changePct);
    if (sectorSort === "By turnover") {
      rows.sort((a, b) => Number.parseFloat(b.turnover) - Number.parseFloat(a.turnover));
    }
    if (sectorSort === "A–Z") rows.sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }, [sectorSort]);

  const explain = (title: string, body: string, note?: string) =>
    openSheet({ kind: "quick", title, body, note });

  return (
    <div className="market-screen">
      {viewport === "web" && (
        <div className="pad" style={{ paddingTop: 8, paddingBottom: 12 }}>
          <Overline>Market</Overline>
          <h1 className="t-h-xl">What NEPSE did today</h1>
        </div>
      )}

      <div className="tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "on" : ""}
            onClick={() => setMarketTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <>
          <div className="market-filters">
            {["NEPSE", "Sensitive", "Float", "Banking"].map((item) => (
              <Chip key={item} selected={index === item} onClick={() => setIndex(item)}>
                {item}
              </Chip>
            ))}
          </div>
          {index !== "NEPSE" && (
            <p className="pad t-body-xs muted">
              This prototype keeps the NEPSE tape visible; {index} data is not fabricated.
            </p>
          )}

          <div className="hero-row">
            <div className="figure-line">
              <p className="hero-num">{npr(shown, 2)}</p>
              <MovePill amount={shownChange} pct={shownPct} />
            </div>
          </div>
          <div className="market-live">
            {session === "open" && <span className="live-dot" />}
            <span>
              {scrub
                ? `At ${scrub.t}`
                : session === "open"
                  ? `Live · updated ${nepse.liveAt}, ${nepse.date}`
                  : `Market closed · last close ${nepse.closedAt}, ${nepse.date}`}
            </span>
            <Explain onClick={() => explain(
              "What is NEPSE?",
              "NEPSE is the Nepal Stock Exchange index — a weighted average of listed companies. It is not the price of one share.",
              "A rising index can still hide more companies falling than rising.",
            )}>
              What is NEPSE?
            </Explain>
          </div>
          <SessionWalk tape={nepseSession} compact showVolume={false} onScrub={setScrub} />

          <div className="market-stats">
            <div>
              <small>
                Turnover
                <button
                  className="stat-info"
                  aria-label="What is turnover"
                  onClick={() => explain(
                    "What is turnover?",
                    "Turnover is the rupee value of shares that actually traded. It is activity, not a forecast.",
                  )}
                >
                  <Icon name="info" size={12} />
                </button>
              </small>
              <b>{nepse.traded}</b>
            </div>
            <div>
              <small>
                Shares traded
                <button
                  className="stat-info"
                  aria-label="What is kitta traded"
                  onClick={() => explain(
                    "Shares traded",
                    "Kitta is the number of shares that changed hands. Turnover is the rupee value of those trades.",
                  )}
                >
                  <Icon name="info" size={12} />
                </button>
              </small>
              <b>{nepse.kitta} kitta</b>
            </div>
            <div>
              <small>Transactions</small>
              <b>{npr(nepse.transactions)}</b>
            </div>
          </div>

          <div className="pad" style={{ paddingTop: 14 }}>
            <BreadthBar rose={nepse.rose} fell={nepse.fell} unchanged={nepse.unchanged} />
            <div style={{ marginTop: 10 }}>
              <Explain onClick={() => explain(
                "What is market breadth?",
                "Breadth counts how many companies rose, fell, or stayed put. The index is weighted, so large companies pull it more.",
              )}>
                What is market breadth?
              </Explain>
            </div>
            <p className="t-body-s muted" style={{ marginTop: 9 }}>
              More fell than rose, and the index followed — this was a broad decline, not a few names dragging the average.
            </p>
          </div>

          <MarketBlock
            title="Top gainers"
            action="All movers ›"
            onAction={() => {
              setMoverView("gainers");
              setMarketTab("Movers");
            }}
          >
            {moverBoards.gainers.slice(0, 3).map((row) => (
              <QuoteRow key={row.symbol} row={row} onOpen={(symbol) => go("stock", { stock: symbol })} />
            ))}
          </MarketBlock>

          <MarketBlock
            title="Top losers"
            action="All movers ›"
            onAction={() => {
              setMoverView("losers");
              setMarketTab("Movers");
            }}
          >
            {moverBoards.losers.slice(0, 3).map((row) => (
              <QuoteRow
                key={row.symbol}
                row={row}
                note={row.symbol === "NABIL"
                  ? "Ex-dividend today — part of the fall is the dividend."
                  : row.name}
                onOpen={(symbol) => go("stock", { stock: symbol })}
              />
            ))}
          </MarketBlock>

          <MarketBlock title="Sectors" action="See all ›" onAction={() => setMarketTab("Sectors")}>
            {sectors.slice(0, 4).map((sector) => (
              <div className="row" key={sector.name}>
                <div className="row-main">
                  <p className="t-h-s">{sector.name}</p>
                  <p className="row-sub">Turnover {sector.turnover}</p>
                </div>
                <ChangeText value={sector.changePct} />
              </div>
            ))}
          </MarketBlock>

          <MarketBlock title="Floor sheet" action="Full sheet ›" onAction={() => setMarketTab("Floor sheet")}>
            {floorBrokers.slice(0, 3).map((broker) => (
              <div className="row" key={broker.code}>
                <div className="row-main">
                  <p className="t-h-s">Broker {broker.code}</p>
                  <p className="row-sub">Most active in {broker.active}</p>
                </div>
                <span className={`badge ${broker.net < 0 ? "badge-down" : "badge-teal"}`}>
                  <span className="badge-dot" />
                  {broker.net < 0 ? "Net seller" : "Net buyer"}
                </span>
                <b className={broker.net < 0 ? "c-down t-mono-s" : "c-up t-mono-s"}>
                  {signed(broker.net)}
                </b>
              </div>
            ))}
            <p className="foot-note">
              The floor sheet records trades that already happened. It is not the live order book.
            </p>
          </MarketBlock>

          <MarketBlock title="Coming up" action="Events ›" onAction={() => setMarketTab("Events")}>
            {marketEvents.slice(0, 2).map((event) => (
              <div className="row" key={event.title}>
                <div className="row-main">
                  <p className="t-h-s">{event.title}</p>
                  <p className="row-sub">{event.sub}</p>
                </div>
                <span className="t-body-xs muted">{event.date}</span>
              </div>
            ))}
          </MarketBlock>
        </>
      )}

      {tab === "Movers" && (
        <>
          <p className="market-intro">
            Movers are the biggest price changes today. A large move is information, not a recommendation — check why it moved before acting.
          </p>
          <div className="market-filters">
            {moverViews.map((item) => (
              <Chip
                key={item.id}
                selected={moverView === item.id}
                onClick={() => setMoverView(item.id)}
              >
                {item.label}
              </Chip>
            ))}
          </div>
          <div className="market-filters quiet">
            <span className="chip chip-quiet">All sectors ▾</span>
            <span className="chip chip-quiet">Any price ▾</span>
            <span className="chip chip-quiet">Traded today ▾</span>
          </div>
          <MarketBlock>
            <div className="sheet-wrap market-table">
              <table className="sheet-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th className="num">LTP</th>
                    <th className="num">Change</th>
                    <th className="num">Turnover</th>
                  </tr>
                </thead>
                <tbody>
                  {moverBoards[moverView].map((row) => (
                    <tr key={row.symbol} onClick={() => go("stock", { stock: row.symbol })}>
                      <td>
                        <span className="t-ticker">
                          {row.symbol}
                          {(row.extra.includes("cap") || row.changePct >= 9.9) && (
                            <Badge tone="warn">Circuit</Badge>
                          )}
                        </span>
                        <small>{row.name}</small>
                      </td>
                      <td className="num">{npr(row.price, 2)}</td>
                      <td className="num"><ChangeText value={row.changePct} /></td>
                      <td className="num muted-num">{row.extra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MarketBlock>
          <p className="market-intro">
            “Circuit” means the price reached its daily limit. It says nothing about what the company is worth.
          </p>
          <div className="market-helps">
            <Explain onClick={() => explain(
              "What is a circuit?",
              "A circuit is the maximum a share may rise or fall in one session. It is a trading rule, not a verdict on the company.",
            )}>
              What is a circuit?
            </Explain>
            <Explain onClick={() => explain(
              "What is turnover?",
              "Turnover is the rupee value of completed trades. High turnover means activity, not direction.",
            )}>
              What is turnover?
            </Explain>
          </div>
        </>
      )}

      {tab === "Sectors" && (
        <>
          <p className="market-intro">
            A sector index groups companies doing similar business, so you can see whether a move is about one company or the whole industry.
          </p>
          <div className="market-filters">
            {sectorSorts.map((item) => (
              <Chip key={item} selected={sectorSort === item} onClick={() => setSectorSort(item)}>
                {item}
              </Chip>
            ))}
          </div>
          <MarketBlock>
            <div className="sheet-wrap market-table">
              <table className="sheet-table sector-table">
                <thead>
                  <tr>
                    <th>Sector</th>
                    <th className="num">Rose / fell</th>
                    <th className="num">Turnover</th>
                    <th className="num">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorRows.map((sector) => (
                    <tr key={sector.name}>
                      <td>
                        {sector.name}
                        <i
                          className={`sector-rail ${sector.changePct < 0 ? "down" : "up"}`}
                          style={{ width: `${Math.min(92, 28 + Math.abs(sector.changePct) * 24)}%` }}
                        />
                      </td>
                      <td className="num">{sector.rose} / {sector.fell}</td>
                      <td className="num">{sector.turnover}</td>
                      <td className="num"><ChangeText value={sector.changePct} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MarketBlock>
          <p className="market-intro">
            Commercial banks moved 1.84 Arba — a large share of the market’s turnover — while the sector itself finished down.
          </p>
          <div className="market-helps">
            <Explain onClick={() => explain(
              "What is a sector index?",
              "A sector index is a weighted average of companies in one line of business.",
            )}>
              What is a sector index?
            </Explain>
            <Explain onClick={() => explain(
              "Rose / fell",
              "How many companies in that sector closed higher versus lower. It is a count, not a weighted average.",
            )}>
              Rose / fell?
            </Explain>
          </div>
          <p className="foot-note">
            Sector figures are calculated from NEPSE’s published sector indices at {nepse.closedAt}.
          </p>
        </>
      )}

      {tab === "Floor sheet" && (
        <>
          <div className="market-filters quiet">
            <span className="chip chip-quiet">{nepse.date} ▾</span>
            <span className="chip chip-quiet">All symbols ▾</span>
            <span className="chip chip-quiet">All brokers ▾</span>
          </div>
          <MarketBlock title="Today across NEPSE">
            {[
              ["Trades executed", npr(nepse.transactions)],
              ["Kitta traded", nepse.kitta],
              ["Value traded", nepse.traded],
              ["Companies traded", String(nepse.companies)],
            ].map(([label, value]) => (
              <div className="kv" key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </div>
            ))}
          </MarketBlock>
          <div className="pad" style={{ paddingTop: 12, paddingBottom: 8 }}>
            <Explain onClick={() => explain(
              "What is a floor sheet?",
              "A floor sheet lists trades that already happened: symbol, kitta, price and broker codes.",
              "It is not the live order book and not a recommendation.",
            )}>
              What is a floor sheet?
            </Explain>
          </div>
          <div className="market-filters">
            {floorViews.map((item) => (
              <Chip key={item} selected={floorView === item} onClick={() => setFloorView(item)}>
                {item}
              </Chip>
            ))}
          </div>

          {floorView === "By broker" && (
            <MarketBlock>
              <div className="sheet-wrap market-table">
                <table className="sheet-table">
                  <thead>
                    <tr>
                      <th>Broker</th>
                      <th className="num">Bought</th>
                      <th className="num">Sold</th>
                      <th className="num">Net kitta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floorBrokers.map((broker) => (
                      <tr key={broker.code}>
                        <td>
                          Broker {broker.code}
                          <small>Most active in {broker.active}</small>
                        </td>
                        <td className="num">{npr(broker.bought)}</td>
                        <td className="num">{npr(broker.sold)}</td>
                        <td className={`num ${broker.net < 0 ? "c-down" : "c-up"}`}>
                          <b>{signed(broker.net)}</b>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </MarketBlock>
          )}

          {floorView === "By symbol" && (
            <MarketBlock>
              <div className="sheet-wrap market-table">
                <table className="sheet-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th className="num">Kitta</th>
                      <th className="num">Last</th>
                      <th>Brokers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...new Set(floorSheet.map((trade) => trade.symbol))].map((symbol) => {
                      const trades = floorSheet.filter((trade) => trade.symbol === symbol);
                      return (
                        <tr key={symbol} onClick={() => go("stock", { stock: symbol })}>
                          <td className="t-ticker">{symbol}</td>
                          <td className="num">{npr(trades.reduce((sum, trade) => sum + trade.kitta, 0))}</td>
                          <td className="num">{npr(trades[0].price, 2)}</td>
                          <td className="muted-num">{trades[0].from} → {trades[0].to}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </MarketBlock>
          )}

          {floorView === "All trades" && (
            <MarketBlock>
              {floorSheet.map((trade) => (
                <div className="floor-row" key={`${trade.time}-${trade.symbol}-${trade.from}`}>
                  <span className="t-mono-s">{trade.time}</span>
                  <span className="t-ticker">{trade.symbol}</span>
                  <span className="t-mono-s">{trade.kitta} @ {npr(trade.price, 2)}</span>
                  <span className="t-body-xs muted">{trade.from} → {trade.to}</span>
                </div>
              ))}
            </MarketBlock>
          )}

          <p className="market-intro">
            Brokers appear by their NEPSE code. These are executed trades only, not the live order book.
          </p>
          <div className="pad" style={{ paddingBottom: 8 }}>
            <Button
              block
              size="md"
              variant="secondary"
              onClick={() => flash({
                message: "The real export stays on your device. This prototype does not create a file.",
              })}
            >
              Download today’s floor sheet (CSV)
            </Button>
          </div>
        </>
      )}

      {tab === "Events" && (
        <>
          <p className="market-intro">
            Corporate actions and primary-market dates. Application still happens on MeroShare / C-ASBA.
          </p>
          <MarketBlock>
            {marketEvents.map((event) => (
              <div className="row" key={event.title}>
                <div className="row-main">
                  <p className="t-h-s">{event.title}</p>
                  <p className="row-sub">{event.sub}</p>
                </div>
                <span className="t-body-xs muted">{event.date}</span>
              </div>
            ))}
            <div className="row">
              <div className="row-main">
                <p className="t-h-s">{liveIpo.name} IPO</p>
                <p className="row-sub">Closes in {liveIpo.closesIn} · par Rs {liveIpo.price}</p>
              </div>
              <button type="button" className="text-link" onClick={() => go("ipo")}>IPO ›</button>
            </div>
          </MarketBlock>
        </>
      )}

      <p className="disclaimer">
        Prices refresh from the last official print. Trading happens in TMS at your broker; MoneyMitra does not place orders.
      </p>
    </div>
  );
}
