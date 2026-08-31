import { useMemo, useState } from "react";
import { Icon } from "../ds/Icon";
import { BasketMark } from "../ds/BasketMark";
import { TickerMark } from "../ds/TickerMark";
import { Chip, Explain, SearchField } from "../ds/primitives";
import { ListHead, sectorTone } from "../ds/desk";
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

/* The sort a basket was built on, said as a rule rather than a jargon key.
   It is the one thing that explains why these names and not others. */
const leadRule: Record<BasketLead, string> = {
  move: "Sorted by today’s move, biggest first",
  turnover: "Sorted by turnover, busiest first",
  offHigh: "Sorted by distance below the 52-week high",
  nearHigh: "Sorted by closeness to the 52-week high",
  offLow: "Sorted by distance above the 52-week low",
  nearLow: "Sorted by closeness to the 52-week low",
};

/** The same column said as a phrase, so a row reads as a sentence. */
const leadPhrase: Record<BasketLead, string> = {
  move: "today",
  turnover: "traded today",
  offHigh: "off its 52-week high",
  nearHigh: "off its 52-week high",
  offLow: "above its 52-week low",
  nearLow: "above its 52-week low",
};

/** And as a column name, for the header that says what the ranking is on. */
const leadColumn: Record<BasketLead, string> = {
  move: "today’s move",
  turnover: "turnover",
  offHigh: "distance off the 52-week high",
  nearHigh: "distance off the 52-week high",
  offLow: "distance above the 52-week low",
  nearLow: "distance above the 52-week low",
};

export function BasketsScreen() {
  const { back, go, viewport, plan } = useApp();
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
        <div className="market-block-body bkt-body">
          <div className="bkt-grid">
            <ListHead cols={[null, "Basket", "Average move"]} />
            {rows.map((row) => (
              <BasketCard key={row.id} row={row} plan={plan} onOpen={onOpen} />
            ))}
          </div>
        </div>
        {rows.length === 0 && <p className="foot-note">No basket matches that name.</p>}
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

/* The shelf, not the shelf's contents. Cover art, the filter in one line, and
   the two numbers that decide whether to open it — the group's shape, its
   sectors and its members all wait on the other side of the tap. */
function BasketCard({
  row,
  plan,
  onOpen,
}: {
  row: BasketRow;
  plan: Plan;
  onOpen: (basket: BasketRow) => void;
}) {
  const shut = locked(row, plan);
  const down = row.changePct < 0;

  return (
    <button type="button" className={`bkt-card${shut ? " shut" : ""}`} onClick={() => onOpen(row)}>
      <BasketMark id={row.id} />
      <span className="bkt-id">
        <span className="bkt-title">
          {row.title}
          {row.fresh && <span className="basket-tag">New</span>}
          {shut && <span className="basket-tag lock">Plus</span>}
        </span>
        <small>{row.note}</small>
      </span>
      <span className="bkt-move">
        <b className={down ? "c-down" : "c-up"}>{pct(row.changePct)}</b>
        <em>{row.count} names</em>
      </span>
    </button>
  );
}

/* One company inside a basket. The lead bar is drawn on the whole basket's
   scale, so the column that put these names on the list can be compared down
   the page instead of read one row at a time. */
function MemberRow({
  quote,
  rank,
  leadId,
  onOpen,
}: {
  quote: ListedQuote;
  rank: number;
  leadId: BasketLead;
  onOpen: () => void;
}) {
  const lead = basketLeads[leadId];
  const down = quote.changePct < 0;
  const value = lead.value(quote);
  const reading = lead.unit === "cr" ? `${npr(value, 1)} Cr` : pct(value, 1);
  const phrase = leadPhrase[leadId];

  return (
    <button type="button" className="bkm-row" onClick={onOpen}>
      <span className="bkm-rank">{rank}</span>
      <TickerMark symbol={quote.symbol} />
      <span className="bkm-id">
        <strong>{quote.symbol}</strong>
        <small>{quote.name}</small>
      </span>

      <span className="bkm-px">
        <b>{npr(quote.ltp, 2)}</b>
        <em className={down ? "c-down" : "c-up"}>{pct(quote.changePct)}</em>
      </span>

      {/* The one column that put this name on the list, said in words. Day
          range, turnover and volume all live on the company's own page. */}
      <span className="bkm-lead">
        <b>{reading}</b> {phrase}
      </span>
    </button>
  );
}

function BasketDetail({ basket }: { basket: BasketRow }) {
  const { go, openSheet } = useApp();

  /* What the basket actually holds, by sector, biggest slice first. */
  const mix = useMemo(() => {
    const counts = new Map<string, number>();
    for (const quote of basket.quotes) {
      counts.set(quote.sector, (counts.get(quote.sector) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count, pct: (count / basket.count) * 100 }))
      .sort((a, b) => b.count - a.count);
  }, [basket]);

  /* Both ends of the day, named — the rail's two extremes are the only two
     dots worth spelling out. */
  const byMove = useMemo(
    () => [...basket.quotes].sort((a, b) => a.changePct - b.changePct),
    [basket],
  );
  const low = byMove[0];
  const high = byMove[byMove.length - 1];

  return (
    <>
      <section className="bkt-hero">
        <div className="bkt-hero-id">
          <BasketMark id={basket.id} />
          <div>
            <p className="t-body-s">{basket.note}</p>
            <p className="bkt-rule">
              <Icon name="sliders" size={13} />
              {leadRule[basket.lead]}
            </p>
          </div>
        </div>

        <div className="bkt-hero-figs">
          <div>
            <b className={basket.changePct < 0 ? "c-down" : "c-up"}>{pct(basket.changePct)}</b>
            <small>Average move</small>
          </div>
          <div>
            <b>{basket.count}</b>
            <small>Names</small>
          </div>
          <div>
            <b>
              <span className="c-up">{basket.up}</span> / <span className="c-down">{basket.down}</span>
            </b>
            <small>Up / down</small>
          </div>
        </div>
      </section>

      <div className="bkt-panels">
        <section className="market-block">
          <header className="market-block-head">
            <h2>How the group sat today</h2>
            <span className="t-body-xs muted">{nepse.date} close</span>
          </header>
          <div className="market-block-body">
            <div className="bkt-shape">
              <dl className="bkt-shape-ends">
                <div>
                  <dt>Lowest</dt>
                  <dd className={low && low.changePct < 0 ? "c-down" : "c-up"}>
                    {low?.symbol} {pct(low?.changePct ?? 0)}
                  </dd>
                </div>
                <div>
                  <dt>Highest</dt>
                  <dd className={high && high.changePct < 0 ? "c-down" : "c-up"}>
                    {high?.symbol} {pct(high?.changePct ?? 0)}
                  </dd>
                </div>
              </dl>
              <p className="bkt-shape-read">
                {basket.up} of {basket.count} rose.
              </p>
            </div>
          </div>
        </section>

        <section className="market-block">
          <header className="market-block-head">
            <h2>What is inside</h2>
            <span className="t-body-xs muted">{mix.length} {mix.length === 1 ? "sector" : "sectors"}</span>
          </header>
          <div className="market-block-body">
            <div className="bkt-mix">
              {/* A single-sector basket has nothing to divide, and a full-width
                  band of one colour only says what the legend already says. */}
              {mix.length > 1 && (
                <div className="bkt-mix-bar" aria-hidden>
                  {mix.map((slice) => (
                    <i key={slice.name} style={{ flexGrow: slice.count, background: sectorTone(slice.name) }} />
                  ))}
                </div>
              )}
              <ul className="bkt-mix-legend">
                {mix.map((slice) => (
                  <li key={slice.name}>
                    <i style={{ background: sectorTone(slice.name) }} />
                    <span>{slice.name}</span>
                    <b>{slice.count}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <section className="market-block">
        <header className="market-block-head">
          <h2>In this basket</h2>
          <span className="t-body-xs muted">Ranked on {leadColumn[basket.lead]}</span>
        </header>
        <div className="market-block-body bkt-body">
          <div className="bkm-list">
            <ListHead cols={[null, null, "Company", "Last price · today"]} />
            {basket.quotes.map((quote, index) => (
              <MemberRow
                key={quote.symbol}
                quote={quote}
                rank={index + 1}
                leadId={basket.lead}
                onOpen={() => go("stock", { stock: quote.symbol })}
              />
            ))}
          </div>
        </div>
      </section>

      <p className="foot-note">
        Every row shows its {leadColumn[basket.lead]} — the one column that ranked this list.
        Green and red only ever mean today’s move.
      </p>

      <div className="market-helps">
        <Explain onClick={() => openSheet(basketSheet(basket))}>How this list is built</Explain>
      </div>
      <p className="foot-note">
        A filter over prints that already happened. Never a call to buy or sell.
      </p>
    </>
  );
}
