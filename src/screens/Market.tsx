import { useMemo, useState, type ReactNode } from "react";
import { Icon, type IconName } from "../ds/Icon";
import {
  BreadthBar,
  Button,
  Chip,
  Explain,
  MovePill,
  Overline,
} from "../ds/primitives";
import { SessionWalk, Sparkline } from "../ds/charts";
import { HappenList } from "../ds/HappenList";
import { QuoteList } from "../ds/QuoteList";
import {
  floorBrokers,
  floorSheet,
  liveIpo,
  marketEvents,
  marketHappen,
  marketIndices,
  moverBoards,
  nepse,
  nepseSession,
  sectors,
  type TapePrint,
  listedQuotes,
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

const sectorMarks: Record<string, string> = {
  Hydropower: "HY",
  Manufacturing: "MF",
  "Hotels & tourism": "HT",
  "Life insurance": "LI",
  "Development banks": "DB",
  "Commercial banks": "CB",
  Microfinance: "MI",
};

function sectorMark(name: string) {
  return sectorMarks[name] ?? name.slice(0, 2).toUpperCase();
}

function SectorList({
  rows,
  onOpen,
}: {
  rows: typeof sectors;
  onOpen?: () => void;
}) {
  return (
    <div className="quote-list">
      {rows.map((sector) => (
        <button
          key={sector.name}
          type="button"
          className="quote-list-row"
          onClick={onOpen}
        >
          <span className={`ticker-mark ${sector.changePct < 0 ? "down" : "up"}`}>
            {sectorMark(sector.name)}
          </span>
          <span className="quote-id">
            <span className="t-ticker">{sector.name}</span>
            <small>Turnover {sector.turnover} · {sector.rose} rose / {sector.fell} fell</small>
          </span>
          <span className="quote-list-meta">
            <b className={sector.changePct < 0 ? "c-down" : "c-up"}>{pct(sector.changePct)}</b>
          </span>
        </button>
      ))}
    </div>
  );
}

function FloorBrokerList({
  rows,
  onOpen,
}: {
  rows: typeof floorBrokers;
  onOpen?: () => void;
}) {
  return (
    <div className="quote-list">
      {rows.map((broker) => (
        <button
          key={broker.code}
          type="button"
          className="quote-list-row"
          onClick={onOpen}
        >
          <span className={`ticker-mark ${broker.net < 0 ? "down" : "up"}`}>{broker.code}</span>
          <span className="quote-id">
            <span className="t-ticker">Broker {broker.code}</span>
            <small>Most active in {broker.active}</small>
          </span>
          <span className="quote-list-meta">
            <b className={broker.net < 0 ? "c-down" : "c-up"}>{signed(broker.net)}</b>
            <em className="muted">{broker.net < 0 ? "Net seller" : "Net buyer"}</em>
          </span>
        </button>
      ))}
    </div>
  );
}

type FilterOption = { id: string; label: string };

/* The movers filters actually filter — each chip opens its own short menu. */
function FilterChip({
  options,
  value,
  onPick,
}: {
  options: FilterOption[];
  value: string;
  onPick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((option) => option.id === value) ?? options[0];
  const active = value !== options[0].id;
  return (
    <div className={`mkt-filter${open ? " open" : ""}`}>
      <button
        type="button"
        className={`chip${active ? " chip-on" : " chip-quiet"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
      >
        {current.label} ▾
      </button>
      {open && (
        <ul className="mkt-filter-menu" role="listbox">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                className={option.id === value ? "on" : ""}
                onClick={() => {
                  onPick(option.id);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const priceBands: FilterOption[] = [
  { id: "any", label: "Any price" },
  { id: "under500", label: "Under 500" },
  { id: "500to1000", label: "500 – 1,000" },
  { id: "over1000", label: "Over 1,000" },
];

const turnoverBands: FilterOption[] = [
  { id: "any", label: "Any turnover" },
  { id: "over1", label: "Over 1 Cr" },
  { id: "over5", label: "Over 5 Cr" },
];

function quoteFor(symbol: string) {
  return listedQuotes.find((row) => row.symbol === symbol);
}

function moverRows(view: MoverView, limit?: number) {
  const source = limit ? moverBoards[view].slice(0, limit) : moverBoards[view];
  return source.map((row) => ({
    symbol: row.symbol,
    name: view === "gainers" || view === "losers" ? row.name : `${row.name} · ${row.extra}`,
    price: row.price,
    changePct: row.changePct,
  }));
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

function IndexStrip() {
  const { go } = useApp();

  return (
    <div className="idx-strip" role="list" aria-label="Market indices">
      {marketIndices.map((item) => {
        const down = item.change < 0;
        return (
          <button
            key={item.id}
            type="button"
            className="idx-card"
            role="listitem"
            onClick={() => go("market-desk", { marketDesk: "indices", marketIndex: item.id })}
          >
            <span className="idx-card-label">{item.label}</span>
            <b className="idx-card-value">{npr(item.value, 2)}</b>
            <em className={down ? "c-down" : "c-up"}>
              {signed(item.change, 2)} ({pct(item.changePct)})
            </em>
            <span className="idx-card-spark">
              <Sparkline changePct={item.changePct} width={160} height={26} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

type MarketTool = {
  id: string;
  label: string;
  icon: IconName;
  run: () => void;
};

function MarketTools() {
  const { go, setMarketTab, viewport } = useApp();
  const [more, setMore] = useState(false);

  const tools: MarketTool[] = [
    {
      id: "summary",
      label: "Market Summary",
      icon: "clipboard",
      run: () => go("market-desk", { marketDesk: "summary" }),
    },
    {
      id: "sectors",
      label: "Sector Summary",
      icon: "pie",
      run: () => go("market-desk", { marketDesk: "sectors" }),
    },
    {
      id: "floor",
      label: "Market Floorsheet",
      icon: "table",
      run: () => setMarketTab("Floor sheet"),
    },
    {
      id: "range",
      label: "52 W change",
      icon: "range",
      run: () => go("market-desk", { marketDesk: "week-change" }),
    },
    {
      id: "live",
      label: "Live Market",
      icon: "pulse",
      run: () => go("market-desk", { marketDesk: "live" }),
    },
    {
      id: "charts",
      label: "Technical Chart",
      icon: "candles",
      run: () => go("stock", { stock: "NABIL", stockTab: "Analysis" }),
    },
    {
      id: "price",
      label: "Stock price",
      icon: "coin",
      run: () => go("market-desk", { marketDesk: "price" }),
    },
    {
      id: "movers",
      label: "Market movers",
      icon: "movers",
      run: () => go("market-desk", { marketDesk: "movers" }),
    },
    {
      id: "gainloss",
      label: "Gain and losses",
      icon: "percent",
      run: () => go("market-desk", { marketDesk: "gain-loss" }),
    },
    {
      id: "data",
      label: "NEPSE Data",
      icon: "doc",
      run: () => go("market-desk", { marketDesk: "nepse-data" }),
    },
    {
      id: "indices",
      label: "Market indices",
      icon: "index",
      run: () => go("market-desk", { marketDesk: "indices" }),
    },
    {
      id: "depth",
      label: "Market depth",
      icon: "depth",
      run: () => go("market-desk", { marketDesk: "depth" }),
    },
  ];

  /* Web has the room for two rows before the toggle earns its place. */
  const shown = more ? tools : tools.slice(0, viewport === "web" ? 8 : 4);

  return (
    <section className="market-block mkt-tools-block">
      <header className="market-block-head">
        <h2>Market tools</h2>
        <button
          type="button"
          className={`mkt-tools-toggle ${more ? "on" : ""}`}
          aria-expanded={more}
          aria-label={more ? "Show fewer tools" : "Show all tools"}
          onClick={() => setMore((value) => !value)}
        >
          <Icon name="chev" size={16} />
        </button>
      </header>
      <div className="market-block-body">
        <div className="mkt-tools">
          <div className="mkt-tools-grid">
            {shown.map((tool) => (
              <button key={tool.id} type="button" className="mkt-tool" onClick={tool.run}>
                <span className="mkt-tool-ico" aria-hidden>
                  <Icon name={tool.icon} size={20} />
                </span>
                <strong>{tool.label}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketScreen() {
  const { flash, go, openSheet, session, viewport, marketTab: tab, setMarketTab } = useApp();
  const [moverView, setMoverView] = useState<MoverView>("gainers");
  const [moverSector, setMoverSector] = useState("any");
  const [moverPrice, setMoverPrice] = useState("any");
  const [moverTurnover, setMoverTurnover] = useState("any");
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

  const sectorOptions: FilterOption[] = useMemo(() => {
    const names = new Set(
      moverBoards[moverView].map((row) => quoteFor(row.symbol)?.sector).filter(Boolean) as string[],
    );
    return [{ id: "any", label: "All sectors" }, ...[...names].sort().map((name) => ({ id: name, label: name }))];
  }, [moverView]);

  const filtered = useMemo(
    () =>
      moverRows(moverView).filter((row) => {
        const quote = quoteFor(row.symbol);
        if (moverSector !== "any" && quote?.sector !== moverSector) return false;
        if (moverPrice === "under500" && row.price >= 500) return false;
        if (moverPrice === "500to1000" && (row.price < 500 || row.price > 1000)) return false;
        if (moverPrice === "over1000" && row.price <= 1000) return false;
        const cr = Number.parseFloat(quote?.turnover ?? "0");
        if (moverTurnover === "over1" && !(cr > 1)) return false;
        if (moverTurnover === "over5" && !(cr > 5)) return false;
        return true;
      }),
    [moverView, moverSector, moverPrice, moverTurnover],
  );

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
        <div className="market-overview">
          <div className="market-web-indices">
            <IndexStrip />
          </div>
          <div className="market-web-pulse">
          <div className="hero-row">
            <div className="figure-line">
              <span className="market-hero-name">NEPSE Index</span>
              <p className="hero-num">{npr(shown, 2)}</p>
              <MovePill amount={shownChange} pct={shownPct} />
            </div>
            <button
              type="button"
              className="stat-info hero-info"
              aria-label="What is NEPSE"
              onClick={() => explain(
                "What is NEPSE?",
                "NEPSE is the Nepal Stock Exchange index — a weighted average of listed companies. It is not the price of one share.",
                "A rising index can still hide more companies falling than rising.",
              )}
            >
              <Icon name="info" size={16} />
            </button>
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
            {/* <div style={{ marginTop: 10 }}>
              <Explain onClick={() => explain(
                "What is market breadth?",
                "Breadth counts how many companies rose, fell, or stayed put. The index is weighted, so large companies pull it more.",
              )}>
                What is market breadth?
              </Explain>
            </div> */}
            
          </div>
          </div>

          <div className="market-web-tools">
            <MarketTools />
          </div>

          <div className="market-web-update">
            <MarketBlock title="Market update">
              <HappenList
                items={marketHappen}
                onOpen={(item) => {
                  if (item.stock) go("stock", { stock: item.stock });
                  else if (item.kind === "ipo") go("ipo");
                }}
              />
            </MarketBlock>
          </div>

          <div className="market-web-movers">
            <MarketBlock
              title="Top gainers"
              action="All movers ›"
              onAction={() => {
                setMoverView("gainers");
                setMarketTab("Movers");
              }}
            >
              <QuoteList
                rows={moverRows("gainers", 3)}
                onRow={(symbol) => go("stock", { stock: symbol })}
              />
            </MarketBlock>

            <MarketBlock
              title="Top losers"
              action="All movers ›"
              onAction={() => {
                setMoverView("losers");
                setMarketTab("Movers");
              }}
            >
              <QuoteList
                rows={moverRows("losers", 3)}
                onRow={(symbol) => go("stock", { stock: symbol })}
              />
            </MarketBlock>
          </div>

          <div className="market-web-rest">
            <MarketBlock title="Sectors" action="See all ›" onAction={() => setMarketTab("Sectors")}>
              <SectorList rows={sectors.slice(0, 4)} onOpen={() => setMarketTab("Sectors")} />
            </MarketBlock>

            <MarketBlock title="Floor sheet" action="Full sheet ›" onAction={() => setMarketTab("Floor sheet")}>
              <FloorBrokerList rows={floorBrokers.slice(0, 3)} onOpen={() => setMarketTab("Floor sheet")} />
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
          </div>
        </div>
      )}

      {tab === "Movers" && (
        <>
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
            <FilterChip options={sectorOptions} value={moverSector} onPick={setMoverSector} />
            <FilterChip options={priceBands} value={moverPrice} onPick={setMoverPrice} />
            <FilterChip options={turnoverBands} value={moverTurnover} onPick={setMoverTurnover} />
            {filtered.length !== moverRows(moverView).length && (
              <button
                type="button"
                className="chip chip-quiet"
                onClick={() => {
                  setMoverSector("any");
                  setMoverPrice("any");
                  setMoverTurnover("any");
                }}
              >
                Clear
              </button>
            )}
          </div>
          <MarketBlock>
            {filtered.length > 0 ? (
              <QuoteList rows={filtered} onRow={(symbol) => go("stock", { stock: symbol })} />
            ) : (
              <p className="foot-note" style={{ padding: "18px 14px" }}>
                No name on this board matches those filters.
              </p>
            )}
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
                        <span className="sheet-name">
                          <span className={`ticker-mark sm ${sector.changePct < 0 ? "down" : "up"}`}>
                            {sectorMark(sector.name)}
                          </span>
                          {sector.name}
                        </span>
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
                          <span className="sheet-name">
                            <span className={`ticker-mark sm ${broker.net < 0 ? "down" : "up"}`}>{broker.code}</span>
                            <span>
                              Broker {broker.code}
                              <small>Most active in {broker.active}</small>
                            </span>
                          </span>
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
                          <td>
                            <span className="sheet-name">
                              <span className="ticker-mark sm">{symbol.slice(0, 2)}</span>
                              {symbol}
                            </span>
                          </td>
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
              <div className="sheet-wrap market-table">
                <table className="sheet-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Symbol</th>
                      <th className="num">Kitta</th>
                      <th className="num">Price</th>
                      <th className="num">Brokers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floorSheet.map((trade) => (
                      <tr
                        key={`${trade.time}-${trade.symbol}-${trade.from}`}
                        onClick={() => go("stock", { stock: trade.symbol })}
                      >
                        <td className="muted-num">{trade.time}</td>
                        <td className="t-ticker">{trade.symbol}</td>
                        <td className="num">{npr(trade.kitta)}</td>
                        <td className="num">{npr(trade.price, 2)}</td>
                        <td className="num muted-num">{trade.from} → {trade.to}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

    </div>
  );
}
