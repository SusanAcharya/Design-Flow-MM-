import type { ReactNode } from "react";
import { sectorPalette } from "../lib/data";

/* ── Shared desk visuals ────────────────────────────────────────────────────
   Baskets and Brokers exist to compare rows against each other, so every
   element here takes its scale from the whole list, not from its own row.
   A bar that only knows its own number is decoration; a bar that knows the
   list is a reading. Callers compute the scale once and pass it down. */

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/* One signed number against the biggest in its column. Used where the sign is
   the point — net kitta through a broker, a member's move inside a basket. */
export function NetBar({
  value,
  max,
  children,
}: {
  value: number;
  max: number;
  children?: ReactNode;
}) {
  /* Stops short of the half so the number that sits past the bar's end has
     somewhere to be printed, instead of spilling out of the column. */
  const reach = clamp((Math.abs(value) / max) * 42, 0.6, 42);
  const down = value < 0;
  /* The number sits just past the end of its own bar rather than on the axis,
     where it would sit on top of every bar that crosses it. */
  const label = down
    ? { right: `calc(50% + ${reach}%)`, paddingRight: "6px" }
    : { left: `calc(50% + ${reach}%)`, paddingLeft: "6px" };
  return (
    <span className="net-bar" aria-hidden>
      <i className={`net-fill ${down ? "down" : "up"}`} style={{ width: `${reach}%` }} />
      <i className="net-axis" />
      {children && (
        <em className={down ? "c-down" : "c-up"} style={label}>
          {children}
        </em>
      )}
    </span>
  );
}

/* Today measured against the same house's own 30-day average — the only
   honest comparison for a broker, because houses differ in size. */
export function PaceBars({
  today,
  average,
  unit = "Cr",
}: {
  today: number;
  average: number;
  unit?: string;
}) {
  const top = Math.max(today, average) || 1;
  const busier = today >= average;
  return (
    <div className="pace-bars">
      <div className="pace-row">
        <small>Today</small>
        <span className="pace-track">
          <i className="pace-fill now" style={{ width: `${(today / top) * 100}%` }} />
        </span>
        <b>{today.toFixed(1)} {unit}</b>
      </div>
      <div className="pace-row">
        <small>30-day avg</small>
        <span className="pace-track">
          <i className="pace-fill avg" style={{ width: `${(average / top) * 100}%` }} />
        </span>
        <b>{average.toFixed(1)} {unit}</b>
      </div>
      <p className="pace-read">
        {busier ? "Busier" : "Quieter"} than its own month —{" "}
        {(Math.abs(today - average) / (average || 1) * 100).toFixed(0)}%{" "}
        {busier ? "above" : "below"} average.
      </p>
    </div>
  );
}

/** The board already has a sector palette; anything unlisted stays neutral. */
export function sectorTone(name: string) {
  return sectorPalette[name] ?? "var(--border-strong)";
}

/* Column labels for the lists that stack two numbers in one cell. On web
   these lists run two-up, so the header is rendered once per column — a
   single band spanning both would leave its labels over the gap between
   them. CSS hides the second copy wherever the list stays single-column. */
export function ListHead({ cols }: { cols: ReactNode[] }) {
  return (
    <>
      {[0, 1].map((copy) => (
        <div className="list-head" key={copy} aria-hidden>
          {cols.map((col, i) => (
            <span key={i}>{col}</span>
          ))}
        </div>
      ))}
    </>
  );
}
