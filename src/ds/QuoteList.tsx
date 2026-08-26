import { npr, pct } from "../lib/format";
import { Sparkline } from "./charts";
import { TickerMark } from "./TickerMark";

export type QuoteRowData = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
};

export function QuoteList({
  rows,
  onRow,
  spark = true,
}: {
  rows: QuoteRowData[];
  onRow: (symbol: string) => void;
  spark?: boolean;
}) {
  return (
    <div className={`quote-list${spark ? " has-spark" : ""}`}>
      {rows.map((row) => (
        <button
          key={row.symbol}
          type="button"
          className="quote-list-row"
          onClick={() => onRow(row.symbol)}
        >
          <TickerMark symbol={row.symbol} />
          <span className="quote-id">
            <span className="t-ticker">{row.symbol}</span>
            <small>{row.name}</small>
          </span>
          {spark && (
            <Sparkline changePct={row.changePct} seed={row.symbol} width={56} height={24} />
          )}
          <span className="quote-list-meta">
            <b>{npr(row.price, 2)}</b>
            <em className={row.changePct < 0 ? "c-down" : "c-up"}>{pct(row.changePct)}</em>
          </span>
        </button>
      ))}
    </div>
  );
}
