import { greedRead, greedSample, greedZones } from "../lib/data";
import { mitraGreed } from "../lib/mitra";
import { useApp } from "../lib/state";

/* Where a price sits and how it got there, on one track. Not a signal.

   The five zones are drawn to their real widths, so the marker lands where the
   score actually is — and Mitra wears the zone, which is the fastest way to
   read a mood without parsing a number first. */
export function GreedMeter({ symbol }: { symbol: string }) {
  const { openSheet, greedPick } = useApp();
  /* The studio can force a zone. It does that by reading a listed name that
     really sits there, so a previewed state still shows true figures. */
  const shown = greedPick === "auto" ? symbol : greedSample[greedPick] ?? symbol;
  const read = greedRead(shown);

  const explain = () =>
    openSheet({
      kind: "quick",
      title: "What the greed meter reads",
      body: "It mixes where the last price sits in its 52-week range with how the day moved. High means buyers have been paying up; low means they have not.",
      note: "A mood reading of past prints — not a recommendation. MoneyMitra does not place orders.",
    });

  return (
    <section className="greed-card">
      <header className="greed-head">
        <span className="overline">Greed meter</span>
        <button type="button" className="explain greed-explain" onClick={explain}>
          How it is read
        </button>
      </header>

      <div className="greed-read">
        <img className={`greed-face z-${read.zone}`} src={mitraGreed[read.zone]} alt="" />
        <div className="greed-read-copy">
          <p className="greed-line">
            <b className="greed-num">{read.score}</b>
            <span className={`greed-tag z-${read.zone}`}>{read.label}</span>
          </p>
          <p className="greed-reads">{read.reads}</p>
          <p className="greed-note">{read.note}</p>
        </div>
      </div>

      <div
        className="greed-scale"
        role="img"
        aria-label={`${read.score} out of 100 — ${read.label}. ${read.reads}`}
      >
        <div className="greed-zones">
          {greedZones.map((zone, i) => {
            const from = i === 0 ? 0 : greedZones[i - 1].upTo;
            return (
              <i
                key={zone.id}
                className={`z-${zone.id}${zone.id === read.zone ? " on" : ""}`}
                style={{ flexGrow: zone.upTo - from }}
              />
            );
          })}
          <span className="greed-mark" style={{ left: `${read.score}%` }} />
        </div>
        <div className="greed-ticks">
          {greedZones.map((zone, i) => {
            const from = i === 0 ? 0 : greedZones[i - 1].upTo;
            return (
              <span
                key={zone.id}
                className={zone.id === read.zone ? "on" : ""}
                style={{ flexGrow: zone.upTo - from }}
              >
                {zone.label}
              </span>
            );
          })}
        </div>
      </div>

      <p className="greed-foot">A reading of prints that already happened. Never a call to buy or sell.</p>
    </section>
  );
}
