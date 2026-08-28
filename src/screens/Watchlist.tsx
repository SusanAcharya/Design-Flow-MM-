import { useMemo, useState } from "react";
import { Icon } from "../ds/Icon";
import { TickerMark } from "../ds/TickerMark";
import { Chip } from "../ds/primitives";
import { TapeSpark } from "../ds/charts";
import { listedQuotes, nepse, watchlist } from "../lib/data";
import { npr, pct } from "../lib/format";
import { useApp } from "../lib/state";
import { mitra } from "../lib/mitra";

/* One screen for every list a member keeps: switch, name, add, alert, drop. */

function rowFor(symbol: string) {
  const quote = listedQuotes.find((item) => item.symbol === symbol);
  const fallback = watchlist.find((item) => item.symbol === symbol);
  if (quote) {
    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.ltp,
      changePct: quote.changePct,
      weekLow: quote.weekLow,
      weekHigh: quote.weekHigh,
    };
  }
  if (fallback) {
    return {
      symbol: fallback.symbol,
      name: fallback.name,
      price: fallback.price,
      changePct: fallback.changePct,
      weekLow: undefined,
      weekHigh: undefined,
    };
  }
  return null;
}

/* A quiet line so a row has some shape without another fetch. */
function spark(symbol: string, up: boolean) {
  const seed = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Array.from({ length: 14 }, (_, i) => {
    const wave = Math.sin((seed % 7) + i / 1.7) * 4;
    return 50 + wave + (up ? i : -i) * 1.1;
  });
}

export function WatchlistScreen() {
  const { back, go, viewport, watchlists, deleteWatchlist, removeFromList, openSheet, flash } = useApp();
  const [listId, setListId] = useState(watchlists[0]?.id ?? "main");
  const [query, setQuery] = useState("");

  const active = watchlists.find((list) => list.id === listId) ?? watchlists[0];
  const rows = useMemo(() => {
    if (!active) return [];
    const q = query.trim().toLowerCase();
    return active.symbols
      .map(rowFor)
      .filter((row): row is NonNullable<ReturnType<typeof rowFor>> => Boolean(row))
      .filter((row) => !q || `${row.symbol} ${row.name}`.toLowerCase().includes(q));
  }, [active, query]);

  if (!active) return null;

  const listMenu = () => {
    openSheet({
      kind: "actions",
      title: active.label,
      actions: [
        {
          label: "Rename this list",
          icon: "clipboard",
          onSelect: () => openSheet({ kind: "watch-name", listId: active.id }),
        },
        {
          label: "Add a name",
          icon: "plus",
          onSelect: () => openSheet({ kind: "watch-add", listId: active.id }),
        },
        {
          label: "Delete this list",
          icon: "alert",
          danger: true,
          onSelect: () =>
            openSheet({
              kind: "confirm",
              title: `Delete ${active.label}?`,
              body: `${active.symbols.length} name${active.symbols.length === 1 ? "" : "s"} leave this list. Nothing is sold — a list only follows.`,
              confirmLabel: "Delete list",
              cancelLabel: "Keep it",
              danger: true,
              onConfirm: () => {
                const next = watchlists.find((list) => list.id !== active.id);
                deleteWatchlist(active.id);
                if (next) setListId(next.id);
                flash({ message: `${active.label} deleted.`, tone: "warn" });
              },
            }),
        },
      ],
    });
  };

  const rowMenu = (symbol: string, name: string) => {
    openSheet({
      kind: "actions",
      title: symbol,
      note: name,
      actions: [
        { label: "Open the company", icon: "chev", onSelect: () => go("stock", { stock: symbol }) },
        {
          label: "Set an alert",
          icon: "bell",
          onSelect: () => go("alerts", { alertSymbol: symbol }),
        },
        {
          label: `Remove from ${active.label}`,
          icon: "close",
          danger: true,
          onSelect: () =>
            openSheet({
              kind: "confirm",
              title: `Remove ${symbol}?`,
              body: `${name} comes off ${active.label}. Nothing is sold — a list only follows.`,
              confirmLabel: "Remove",
              cancelLabel: "Keep it",
              danger: true,
              onConfirm: () => {
                removeFromList(active.id, symbol);
                flash({ message: `${symbol} removed from ${active.label}.`, tone: "warn" });
              },
            }),
        },
      ],
    });
  };

  return (
    <div className="desk-screen watch-desk">
      {viewport === "mobile" ? (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={back} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>Watchlist</h1>
          <button type="button" className="icon-btn" onClick={listMenu} aria-label="List options">
            <Icon name="dots" />
          </button>
        </div>
      ) : (
        <div className="desk-web-head">
          <button type="button" className="text-link web-back" onClick={back}>‹ Back</button>
          <div className="desk-web-title">
            <h1 className="t-h-xl">Watchlist</h1>
            <button type="button" className="pf-quick-btn" onClick={() => openSheet({ kind: "watch-name" })}>
              <Icon name="plus" size={16} /> New list
            </button>
          </div>
        </div>
      )}

      <div className="watch-tabs" role="tablist" aria-label="Your lists">
        {watchlists.map((list) => (
          <Chip key={list.id} selected={list.id === active.id} onClick={() => setListId(list.id)}>
            {list.label} <em>{list.symbols.length}</em>
          </Chip>
        ))}
        {viewport === "mobile" && (
          <button type="button" className="watch-new" onClick={() => openSheet({ kind: "watch-name" })}>
            <Icon name="plus" size={15} /> New
          </button>
        )}
      </div>

      <div className="watch-head">
        <div>
          <p className="t-h-m">{active.label}</p>
          <p className="t-body-xs muted">
            {active.symbols.length} name{active.symbols.length === 1 ? "" : "s"} · {nepse.date} close
          </p>
        </div>
        <button type="button" className="rule-more" onClick={listMenu} aria-label="List options">
          <Icon name="dots" size={18} />
        </button>
      </div>

      {active.symbols.length > 3 && (
        <div className="watch-search">
          <input
            value={query}
            placeholder="Search this list"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      )}

      {rows.length === 0 ? (
        <div className="watch-empty">
          <img src={mitra.search} alt="" />
          <p className="t-h-m">
            {active.symbols.length === 0 ? "No names on this list yet" : "No match on this list"}
          </p>
          <p className="t-body-s muted">
            {active.symbols.length === 0
              ? "Follow a company and it shows up here after every close, with the day’s move and a line you can set an alert on."
              : "Nothing on this list matches that search."}
          </p>
          {active.symbols.length === 0 && (
            <div className="watch-empty-acts">
              <button
                type="button"
                className="pf-quick-btn primary"
                onClick={() => openSheet({ kind: "watch-add", listId: active.id })}
              >
                <Icon name="plus" size={16} /> Add a name
              </button>
              <button type="button" className="pf-quick-btn" onClick={() => go("market")}>
                Browse the market
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="watch-rows">
          {rows.map((row) => {
            const down = row.changePct < 0;
            return (
              <div key={row.symbol} className="watch-row">
                <button type="button" className="watch-row-main" onClick={() => go("stock", { stock: row.symbol })}>
                  <TickerMark symbol={row.symbol} />
                  <span className="watch-row-id">
                    <strong>{row.symbol}</strong>
                    <small>{row.name}</small>
                  </span>
                  <TapeSpark values={spark(row.symbol, !down)} width={72} height={26} positive={!down} />
                  <span className="watch-row-px">
                    <b>{npr(row.price, 2)}</b>
                    <em className={down ? "c-down" : "c-up"}>{pct(row.changePct)}</em>
                  </span>
                </button>
                <button
                  type="button"
                  className="rule-more"
                  onClick={() => rowMenu(row.symbol, row.name)}
                  aria-label={`Options for ${row.symbol}`}
                >
                  <Icon name="dots" size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p className="foot-note pad">A list follows names. It never buys kitta.</p>

      <button
        type="button"
        className="alert-fab"
        onClick={() => openSheet({ kind: "watch-add", listId: active.id })}
        aria-label="Add a name to this list"
      >
        <Icon name="plus" size={22} />
        <span>Add a name</span>
      </button>
    </div>
  );
}
