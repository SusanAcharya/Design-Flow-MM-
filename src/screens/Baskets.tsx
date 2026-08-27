import { useMemo, useState } from "react";
import { Icon } from "../ds/Icon";
import { BasketMark } from "../ds/BasketMark";
import { TickerMark } from "../ds/TickerMark";
import { Chip, Explain, SearchField } from "../ds/primitives";
import { basketLeads, basketRows, getBasketRow, nepse } from "../lib/data";
import { npr, pct } from "../lib/format";
import { useApp } from "../lib/state";
import { rawParam } from "../lib/deeplink";
import type { BasketLead, BasketRow, ListedQuote } from "../lib/data";
import type { Plan } from "../lib/types";

type Audience = "traders" | "investors";
type BasketSort = "move" | "size" | "name";

const planRank: Record<Plan, number> = { free: 0, plus: 1, pro: 2 };

const sorts: { id: BasketSort; label: string }[] = [
  { id: "move", label: "Move" },
  { id: "size", label: "Names" },
  { id: "name", label: "A–Z" },
];

function locked(basket: BasketRow, plan: Plan) {
  return Boolean(basket.plan) && planRank[plan] < planRank[basket.plan as Plan];
}

/** Same wording on the list, the detail and the sheet — one sentence, no essay. */
function basketSheet(basket: BasketRow) {
  return {
    kind: "quick" as const,
    title: basket.title,
    body: `${basket.note}. Rebuilt from the ${nepse.date} close, same dates for every name.`,
    note: "A filter, not a recommendation. MoneyMitra does not place orders.",
  };
}

export function BasketsScreen() {
  const { back, go, viewport, plan, fulfillObjective } = useApp();
  const [openId, setOpenId] = useState<string | null>(() => {
    const linked = rawParam("basket");
    return linked && getBasketRow(linked) ? linked : null;
  });
  const open = openId ? getBasketRow(openId) : undefined;
  const title = open ? open.title : "Baskets";

  const onOpen = (basket: BasketRow) => {
    if (locked(basket, plan)) {
      go("subscription");
      return;
    }
    fulfillObjective("baskets");
    setOpenId(basket.id);
  };

  const onBack = () => {
    if (open) setOpenId(null);
    else back();
  };

  return (
    <div className="desk-screen baskets-desk">
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
      {open ? <BasketDetail basket={open} /> : <BasketList onOpen={onOpen} />}
    </div>
  );
}

function BasketList({ onOpen }: { onOpen: (basket: BasketRow) => void }) {
  const { plan, openSheet } = useApp();
  const [audience, setAudience] = useState<Audience>("traders");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<BasketSort>("move");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const found = basketRows.filter((row) => {
      if (row.audience !== audience) return false;
      if (!q) return true;
      return `${row.title} ${row.note} ${row.members.join(" ")}`.toLowerCase().includes(q);
    });
    return [...found].sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      if (sort === "size") return b.count - a.count;
      return b.changePct - a.changePct;
    });
  }, [audience, query, sort]);

  return (
    <>
      <div className="desk-head-row">
      <div className="desk-tabs pad">
        <div className="home-feed-tabs duo" role="tablist" aria-label="Basket audience">
          {(["traders", "investors"] as Audience[]).map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={audience === id}
              className={audience === id ? "on" : ""}
              onClick={() => setAudience(id)}
            >
              {id === "traders" ? "For traders" : "For investors"}
            </button>
          ))}
        </div>
      </div>

      <div className="desk-controls">
        <div className="pad" style={{ paddingTop: 8, paddingBottom: 4 }}>
          <SearchField placeholder="Search baskets" value={query} onChange={setQuery} />
        </div>

      <div className="broker-sort">
        {sorts.map((item) => (
          <Chip key={item.id} selected={sort === item.id} onClick={() => setSort(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      </div>
      </div>

      <section className="market-block">
        <header className="market-block-head">
          <h2>{rows.length} baskets</h2>
          <span className="t-body-xs muted">{nepse.date} close</span>
        </header>
        <div className="market-block-body">
          <div className="quote-list">
            {rows.map((row) => (
              <BasketListRow key={row.id} row={row} plan={plan} onOpen={onOpen} />
            ))}
          </div>
          {rows.length === 0 && <p className="foot-note">No basket matches that name.</p>}
        </div>
      </section>

      <div className="market-helps">
        <Explain
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "What a basket is",
              body: "A basket is one filter run over the day’s prints — the column that put a company on the list is shown next to it.",
              note: "A filter, not a recommendation. MoneyMitra does not place orders.",
            })
          }
        >
          What a basket is
        </Explain>
      </div>
    </>
  );
}

function BasketListRow({
  row,
  plan,
  onOpen,
}: {
  row: BasketRow;
  plan: Plan;
  onOpen: (basket: BasketRow) => void;
}) {
  const shut = locked(row, plan);
  return (
    <button type="button" className="quote-list-row basket-row" onClick={() => onOpen(row)}>
      <span className={`basket-stack${shut ? " shut" : ""}`} aria-hidden>
        {row.quotes.slice(0, 3).map((quote) => (
          <TickerMark key={quote.symbol} symbol={quote.symbol} size="sm" />
        ))}
      </span>
      <span className="quote-id">
        <span className="t-ticker">
          {row.title}
          {row.fresh && <span className="basket-tag">New</span>}
          {shut && <span className="basket-tag lock">Plus</span>}
        </span>
        <small>{row.note}</small>
      </span>
      <span className="quote-list-meta">
        <b className={row.changePct < 0 ? "c-down" : "c-up"}>{pct(row.changePct)}</b>
        <em className="muted">{row.count} names</em>
      </span>
    </button>
  );
}

/* One card per company: who it is, what it costs, where that sits in the year,
   and the numbers behind the sort. */
function MemberCard({
  quote,
  rank,
  lead,
  onOpen,
}: {
  quote: ListedQuote;
  rank: number;
  lead: (typeof basketLeads)[BasketLead];
  onOpen: () => void;
}) {
  const span = quote.weekHigh - quote.weekLow || 1;
  const at = Math.min(98, Math.max(2, ((quote.ltp - quote.weekLow) / span) * 100));
  const down = quote.changePct < 0;
  const showLead = lead.unit === "pct" && lead.label !== "% Chg";

  return (
    <button type="button" className="bk-card" onClick={onOpen}>
      <span className="bk-card-head">
        <span className="bk-rank">{rank}</span>
        <TickerMark symbol={quote.symbol} />
        <span className="bk-id">
          <strong>{quote.symbol}</strong>
          <small>{quote.name}</small>
        </span>
        <span className="bk-px">
          <b>{npr(quote.ltp, 2)}</b>
          <em className={down ? "c-down" : "c-up"}>{pct(quote.changePct)}</em>
        </span>
      </span>

      <span className="bk-range">
        <span className="bk-range-cap">
          <small>52W low</small>
          <b>{npr(quote.weekLow, 2)}</b>
        </span>
        <span className="bk-range-track">
          <i className="bk-range-fill" style={{ width: `${at}%` }} />
          <i className="bk-range-dot" style={{ left: `${at}%` }} />
        </span>
        <span className="bk-range-cap end">
          <small>52W high</small>
          <b>{npr(quote.weekHigh, 2)}</b>
        </span>
      </span>

      <span className="bk-facts">
        <span>
          <small>Day</small>
          <b>{npr(quote.low, 2)}–{npr(quote.high, 2)}</b>
        </span>
        <span>
          <small>Turnover</small>
          <b>{quote.turnover}</b>
        </span>
        <span>
          <small>Volume</small>
          <b>{quote.volume}</b>
        </span>
        {showLead && (
          <span>
            <small>{lead.label}</small>
            <b>{pct(lead.value(quote), 1)}</b>
          </span>
        )}
      </span>
    </button>
  );
}

function BasketDetail({ basket }: { basket: BasketRow }) {
  const { go, openSheet } = useApp();
  const lead = basketLeads[basket.lead];

  return (
    <>
      {/* The bar above already carries the name — the head only says what the filter is. */}
      <div className="basket-head">
        <BasketMark id={basket.id} />
        <p className="t-body-s muted">{basket.note}</p>
      </div>

      <div className="basket-stats">
        <div>
          <b className={basket.changePct < 0 ? "c-down" : "c-up"}>{pct(basket.changePct)}</b>
          <small>Average move</small>
        </div>
        <div>
          <b>{basket.count}</b>
          <small>Names</small>
        </div>
        <div>
          <b>{basket.up} / {basket.down}</b>
          <small>Up / down</small>
        </div>
      </div>

      <section className="market-block">
        <header className="market-block-head">
          <h2>In this basket</h2>
          <span className="t-body-xs muted">{nepse.date} close</span>
        </header>
        <div className="bk-cards">
          {basket.quotes.map((quote, index) => (
            <MemberCard
              key={quote.symbol}
              quote={quote}
              rank={index + 1}
              lead={lead}
              onOpen={() => go("stock", { stock: quote.symbol })}
            />
          ))}
        </div>
      </section>

      <div className="market-helps">
        <Explain onClick={() => openSheet(basketSheet(basket))}>How this list is built</Explain>
      </div>
    </>
  );
}
