import { greedRead } from "../lib/data";
import { useApp } from "../lib/state";

/* Where a price sits and how it got there, on one track. Not a signal. */
export function GreedMeter({ symbol }: { symbol: string }) {
  const { openSheet } = useApp();
  const read = greedRead(symbol);

  return (
    <section className="greed-card">
      <header className="greed-head">
        <span className="overline">Greed meter</span>
        <button
          type="button"
          className={`greed-score s-${read.label.toLowerCase()}`}
          onClick={() =>
            openSheet({
              kind: "quick",
              title: "What the greed meter reads",
              body: "It mixes where the last price sits in its 52-week range with how the day moved. High means buyers have been paying up; low means they have not.",
              note: "A mood reading of past prints — not a recommendation. MoneyMitra does not place orders.",
            })
          }
        >
          {read.score} · {read.label}
        </button>
      </header>

      <div className="greed-track" role="img" aria-label={`${read.score} out of 100, ${read.label}`}>
        <i className="greed-mark" style={{ left: `${read.score}%` }} />
      </div>
      <div className="greed-ticks">
        <span>Fear</span>
        <span>Greed</span>
      </div>
    </section>
  );
}
