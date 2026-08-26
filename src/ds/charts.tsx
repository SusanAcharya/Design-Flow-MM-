import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { npr, pct, signed } from "../lib/format";
import type { Tape, TapePrint } from "../lib/data";

const SESSION_MIN = 11 * 60;
const SESSION_SPAN = 4 * 60;

function toMinutes(stamp: string) {
  const [hRaw, mRaw] = stamp.split(":");
  const h = Number(hRaw);
  const m = Number(mRaw ?? 0);
  const hour24 = h > 0 && h < 6 ? h + 12 : h;
  return hour24 * 60 + m;
}

function xAtClock(stamp: string, width: number, padL: number, padR: number) {
  const plot = width - padL - padR;
  const mins = toMinutes(stamp) - SESSION_MIN;
  return padL + (Math.min(Math.max(mins, 0), SESSION_SPAN) / SESSION_SPAN) * plot;
}

function xOf(tape: Tape, index: number, width: number, padL: number, padR: number) {
  const plot = width - padL - padR;
  if (tape.axis === "days") {
    const n = Math.max(tape.prints.length - 1, 1);
    return padL + (index / n) * plot;
  }
  return xAtClock(tape.prints[index].t, width, padL, padR);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function smoothLine(pts: { x: number; y: number }[], yMin: number, yMax: number) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  const y = (v: number) => clamp(v, yMin, yMax);
  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = y(p1.y + (p2.y - p0.y) / 6);
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = y(p2.y - (p3.y - p1.y) / 6);
    d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export function SessionWalk({
  tape,
  compact = false,
  showVolume = !compact,
  bare = false,
  mark = "line",
  onScrub,
  onActivate,
}: {
  tape: Tape;
  compact?: boolean;
  showVolume?: boolean;
  bare?: boolean;
  mark?: "line" | "columns";
  onScrub?: (print: TapePrint | null) => void;
  onActivate?: () => void;
}) {
  const uid = useId().replace(/:/g, "");
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, y: 0, moved: false });
  const onScrubRef = useRef(onScrub);
  onScrubRef.current = onScrub;
  const [hover, setHover] = useState<number | null>(null);
  const columns = mark === "columns";

  const W = 360;
  const tickH = columns || !bare ? 14 : 0;
  const volH = !columns && !bare && showVolume ? 18 : 0;
  const H = columns ? 96 : bare ? 88 : compact ? 100 : 118 + volH;
  const padL = columns ? 6 : bare ? 4 : 8;
  const padR = columns ? 6 : bare ? 8 : 12;
  const padT = columns ? 10 : bare ? 8 : compact ? 14 : 18;
  const padB = tickH + volH + (bare && !columns ? 4 : 2);
  const plotH = H - padT - padB;

  const geo = useMemo(() => {
    const values = [...tape.prints.map((p) => p.v), tape.prevClose, tape.high, tape.low];
    const vmin = Math.min(...values);
    const vmax = Math.max(...values);
    const pad = (vmax - vmin) * 0.16 || 1;
    const yOf = (v: number) =>
      padT + (1 - (v - (vmin - pad)) / (vmax - vmin + 2 * pad)) * plotH;
    const pts = tape.prints.map((p, i) => ({
      x: xOf(tape, i, W, padL, padR),
      y: yOf(p.v),
      v: p.v,
      vol: p.vol ?? 0,
      t: p.t,
    }));
    const yClose = yOf(tape.prevClose);
    const line = smoothLine(pts, padT + 1, padT + plotH - 1);
    const floorY = bare ? H - 2 : yClose;
    const area = `${line} L${pts[pts.length - 1].x.toFixed(2)} ${floorY.toFixed(2)} L${pts[0].x.toFixed(2)} ${floorY.toFixed(2)} Z`;
    const yPeak = Math.min(...pts.map((p) => p.y), yClose);
    const yTrough = Math.max(...pts.map((p) => p.y), yClose);
    const colW = Math.max(6, ((W - padL - padR) / Math.max(pts.length, 1)) * 0.58);
    return { pts, yClose, line, area, yPeak, yTrough, colW };
  }, [tape, padT, padL, padR, plotH, H, bare, W]);

  const { pts, yClose, line, area, yPeak, yTrough, colW } = geo;
  const last = pts[pts.length - 1];
  const open = pts[0];
  const up = tape.last >= tape.prevClose;
  const tone = up ? "up" : "down";
  const stroke = up ? "var(--up-base)" : "var(--down-base)";
  const maxVol = Math.max(...pts.map((p) => p.vol), 1);
  const active = hover == null ? last : pts[hover];
  const activeDelta = active.v - tape.prevClose;
  const activePct = tape.prevClose ? (activeDelta / tape.prevClose) * 100 : 0;
  const activeUp = activeDelta >= 0;
  const tipFlip = active.y < padT + 28;
  const tipDigits = tape.axis === "days" ? 0 : 2;
  const plotBase = padT + plotH;

  const tapeKey = `${tape.last}:${tape.prevClose}:${tape.prints.length}:${tape.prints[0]?.t}:${tape.prints[tape.prints.length - 1]?.t}`;
  useEffect(() => {
    setHover(null);
    onScrubRef.current?.(null);
  }, [tapeKey]);

  const reveal = (index: number | null) => {
    setHover(index);
    onScrubRef.current?.(index == null ? null : tape.prints[index]);
  };

  const ticks = bare && !columns
    ? []
    : tape.axis === "session"
      ? [
          { x: xAtClock("11:00", W, padL, padR), label: "11" },
          { x: xAtClock("12:00", W, padL, padR), label: "12" },
          { x: xAtClock("13:00", W, padL, padR), label: "1" },
          { x: xAtClock("14:00", W, padL, padR), label: "2" },
          { x: xAtClock("15:00", W, padL, padR), label: "3" },
        ]
      : pts.filter((_, i, arr) => {
          if (arr.length <= 6) return true;
          const step = Math.ceil(arr.length / 5);
          return i === 0 || i === arr.length - 1 || i % step === 0;
        }).map((p) => ({ x: p.x, label: p.t }));

  const clipAbove = `walk-above-${uid}`;
  const clipBelow = `walk-below-${uid}`;
  const gUp = `walk-up-${uid}`;
  const gDown = `walk-down-${uid}`;
  const gBare = `walk-bare-${uid}`;

  const pickAt = (clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(rect.width, 1)) * W;
    let best = 0;
    let dist = Infinity;
    for (let i = 0; i < pts.length; i += 1) {
      const d = Math.abs(pts[i].x - x);
      if (d < dist) {
        dist = d;
        best = i;
      }
    }
    reveal(best);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, x: event.clientX, y: event.clientY, moved: false };
    pickAt(event.clientX);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (drag.current.active && (dx * dx + dy * dy) > 36) drag.current.moved = true;
    if (event.pointerType === "mouse" || drag.current.active) pickAt(event.clientX);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    if (event.pointerType !== "mouse" && !drag.current.moved) {
      /* tap keeps the readout until the next move away */
    }
  };

  const onPointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    if (event.pointerType === "mouse") reveal(null);
  };

  const onClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
      return;
    }
    onActivate?.();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const from = hover ?? pts.length - 1;
      reveal(event.key === "ArrowLeft" ? Math.max(0, from - 1) : Math.min(pts.length - 1, from + 1));
    }
    if (event.key === "Escape") reveal(null);
    if ((event.key === "Enter" || event.key === " ") && onActivate) {
      event.preventDefault();
      onActivate();
    }
  };

  const hovering = hover != null;
  const dimX = hovering ? active.x : W - padR;
  const dimW = Math.max(W - padR - dimX, 0);

  return (
    <div
      ref={stageRef}
      className={`walk-stage ${compact ? "compact" : ""} ${bare ? "bare" : ""} ${columns ? "columns" : ""} ${hovering ? "is-scrubbing" : ""} ${onActivate ? "is-link" : ""}`}
      role={onActivate ? "link" : undefined}
      tabIndex={0}
      aria-label={`From ${tape.prints[0].t} to ${last.t}. Open ${npr(tape.open, 2)}, last ${npr(tape.last, 2)}, versus yesterday ${npr(tape.prevClose, 2)}.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={() => { drag.current.active = false; }}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <svg className={`session-walk ${compact ? "compact" : ""} ${bare ? "bare" : ""} ${columns ? "columns" : ""}`} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <defs>
          <clipPath id={clipAbove}>
            <rect x="0" y="0" width={W} height={Math.max(yClose, 0)} />
          </clipPath>
          <clipPath id={clipBelow}>
            <rect x="0" y={yClose} width={W} height={Math.max(H - yClose, 0)} />
          </clipPath>
          <linearGradient id={gUp} gradientUnits="userSpaceOnUse" x1="0" y1={yPeak} x2="0" y2={yClose}>
            <stop offset="0%" stopColor="var(--up-base)" stopOpacity="0.34" />
            <stop offset="100%" stopColor="var(--up-base)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={gDown} gradientUnits="userSpaceOnUse" x1="0" y1={yClose} x2="0" y2={yTrough}>
            <stop offset="0%" stopColor="var(--down-base)" stopOpacity="0.02" />
            <stop offset="100%" stopColor="var(--down-base)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id={gBare} gradientUnits="userSpaceOnUse" x1="0" y1={padT} x2="0" y2={H}>
            <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
            <stop offset="70%" stopColor={stroke} stopOpacity="0.06" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>

        {!bare && !compact && (
          <>
            <line className="walk-grid" x1={padL} x2={W - padR} y1={padT + plotH * 0.25} y2={padT + plotH * 0.25} />
            <line className="walk-grid" x1={padL} x2={W - padR} y1={padT + plotH * 0.5} y2={padT + plotH * 0.5} />
            <line className="walk-grid" x1={padL} x2={W - padR} y1={padT + plotH * 0.75} y2={padT + plotH * 0.75} />
          </>
        )}

        {!columns && (bare ? (
          <path d={area} fill={`url(#${gBare})`} />
        ) : (
          <>
            <path d={area} fill={`url(#${gUp})`} clipPath={`url(#${clipAbove})`} />
            <path d={area} fill={`url(#${gDown})`} clipPath={`url(#${clipBelow})`} />
          </>
        ))}

        {(!bare || columns) && (
          <line
            className="walk-prev"
            x1={padL}
            x2={W - padR}
            y1={yClose}
            y2={yClose}
          />
        )}
        {!bare && !compact && !columns && (
          <text className="walk-label" x={padL} y={Math.max(yClose - 5, 11)}>
            Yesterday {npr(tape.prevClose, 2)}
          </text>
        )}

        {columns &&
          pts.map((p, i) => {
            const prior = i === 0 ? tape.prevClose : pts[i - 1].v;
            const barUp = p.v >= prior;
            const h = Math.max(plotBase - p.y, 4);
            return (
              <rect
                key={`col-${p.t}-${i}`}
                className={`walk-col ${barUp ? "up" : "down"} ${hover === i ? "on" : ""} ${i === pts.length - 1 ? "last" : ""}`}
                x={p.x - colW / 2}
                y={p.y}
                width={colW}
                height={h}
                rx={Math.min(4, colW / 2)}
              />
            );
          })}

        {!columns && (bare ? (
          <path d={line} className="walk-line" stroke={stroke} />
        ) : (
          <>
            <path d={line} className="walk-line" stroke="var(--up-base)" clipPath={`url(#${clipAbove})`} />
            <path d={line} className="walk-line" stroke="var(--down-base)" clipPath={`url(#${clipBelow})`} />
          </>
        ))}

        {!columns && hovering && dimW > 2 && (
          <rect
            className="walk-dim"
            x={dimX}
            y={padT}
            width={dimW}
            height={plotH}
          />
        )}

        {showVolume &&
          !bare &&
          !columns &&
          pts.map((p, i) => {
            const h = (p.vol / maxVol) * (volH - 4);
            const barUp = p.v >= tape.prevClose;
            return (
              <rect
                key={`vol-${i}`}
                className={`walk-vol ${barUp ? "up" : "down"} ${hover === i ? "on" : ""}`}
                x={p.x - 2.4}
                y={H - tickH - volH + (volH - 3 - h)}
                width="4.8"
                height={Math.max(h, 1.2)}
                rx="1.2"
              />
            );
          })}

        {!columns && !bare && (
          <circle className="walk-open" cx={open.x} cy={open.y} r="3.4" stroke={open.v >= tape.prevClose ? "var(--up-base)" : "var(--down-base)"} />
        )}

        {!columns && !hovering && (
          <>
            <circle className={`walk-pulse ${tone}`} cx={last.x} cy={last.y} r="8" />
            <circle cx={last.x} cy={last.y} r={bare ? 2.8 : 3.4} fill={stroke} />
          </>
        )}

        {!columns && hovering && (
          <>
            <line className="walk-cross" x1={active.x} x2={active.x} y1={padT} y2={H - padB} />
            <line className="walk-cross" x1={padL} x2={W - padR} y1={active.y} y2={active.y} />
            <circle
              className="walk-focus-ring"
              cx={active.x}
              cy={active.y}
              r="7"
              fill={activeUp ? "var(--up-base)" : "var(--down-base)"}
            />
            <circle
              className="walk-focus"
              cx={active.x}
              cy={active.y}
              r="3.6"
              fill={activeUp ? "var(--up-base)" : "var(--down-base)"}
            />
          </>
        )}

        {columns && hovering && (
          <line className="walk-cross" x1={active.x} x2={active.x} y1={padT} y2={plotBase} />
        )}

        {ticks.map((tick) => (
          <text key={tick.label + tick.x} className="walk-tick" x={tick.x} y={H - 5} textAnchor="middle">
            {tick.label}
          </text>
        ))}
      </svg>

      {hovering && (
        <div
          className={`walk-tip ${activeUp ? "up" : "down"} ${tipFlip ? "flip" : ""}`}
          style={{ left: `${clamp((active.x / W) * 100, 16, 84)}%`, top: `${(active.y / H) * 100}%` }}
        >
          <span className="walk-tip-t">{active.t}</span>
          <strong className="walk-tip-v">{npr(active.v, tipDigits)}</strong>
          <span className={`walk-tip-d ${activeUp ? "c-up" : "c-down"}`}>
            {signed(activeDelta, tipDigits)} {pct(activePct)}
          </span>
          {showVolume && active.vol > 0 && <span className="walk-tip-vol">Vol {active.vol}</span>}
        </div>
      )}
    </div>
  );
}

export function PriceSpine({
  prev,
  open,
  high,
  low,
  last,
  circuitPct,
}: {
  prev: number;
  open: number;
  high: number;
  low: number;
  last: number;
  circuitPct?: number;
}) {
  const floor = circuitPct ? prev * (1 - circuitPct / 100) : low - (high - low) * 0.1;
  const ceil = circuitPct ? prev * (1 + circuitPct / 100) : high + (high - low) * 0.1;
  const span = ceil - floor || 1;
  const x = (v: number) => `${((Math.min(Math.max(v, floor), ceil) - floor) / span) * 100}%`;
  const dayLeft = ((low - floor) / span) * 100;
  const dayWidth = ((high - low) / span) * 100;
  const down = last < prev;
  const tone = down ? "down" : "up";

  return (
    <div className={`spine spine-${tone}`}>
      <div className="spine-track" aria-hidden>
        <i className="spine-day" style={{ left: `${dayLeft}%`, width: `${Math.max(dayWidth, 1.2)}%` }} />
        <i className="spine-prev" style={{ left: x(prev) }} data-tip={`Yesterday ${npr(prev, 2)}`} />
        <i className="spine-open" style={{ left: x(open) }} data-tip={`Open ${npr(open, 2)}`} />
        <i className="spine-last" style={{ left: x(last) }} data-tip={`Last ${npr(last, 2)}`} />
      </div>
      <div className="spine-scale">
        <span>{circuitPct ? `−${circuitPct}%` : npr(low, 2)}</span>
        <span className="spine-mid">
          Last {npr(last, 2)} · open {npr(open, 2)}
        </span>
        <span>{circuitPct ? `+${circuitPct}%` : npr(high, 2)}</span>
      </div>
      <p className="spine-note">
        {circuitPct
          ? `Day’s high–low sits inside the ${circuitPct}% circuit. The dashed tick is yesterday.`
          : "Open, last, and the day’s high–low — not a forecast."}
      </p>
    </div>
  );
}

function mixCells(rose: number, fell: number, unchanged: number, count: number) {
  const total = rose + fell + unchanged || 1;
  let r = Math.round((rose / total) * count);
  let f = Math.round((fell / total) * count);
  if (r + f > count) f = Math.max(0, count - r);
  const u = Math.max(0, count - r - f);
  const cells: Array<"up" | "down" | "flat"> = [
    ...Array.from({ length: r }, () => "up" as const),
    ...Array.from({ length: f }, () => "down" as const),
    ...Array.from({ length: u }, () => "flat" as const),
  ];
  let seed = 2083;
  for (let i = cells.length - 1; i > 0; i -= 1) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    const swap = cells[i];
    cells[i] = cells[j];
    cells[j] = swap;
  }
  return cells;
}

export function BreadthField({
  rose,
  fell,
  unchanged = 0,
  tiles = 96,
  cols = 16,
  compact = false,
}: {
  rose: number;
  fell: number;
  unchanged?: number;
  tiles?: number;
  cols?: number;
  compact?: boolean;
}) {
  const cells = mixCells(rose, fell, unchanged, compact ? 18 : tiles);
  const columns = compact ? 6 : cols;
  return (
    <div
      className={`breadth-field ${compact ? "compact" : ""}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      aria-label={`${rose} rose, ${fell} fell, ${unchanged} unchanged`}
    >
      {cells.map((cell, i) => (
        <i key={i} className={cell} />
      ))}
    </div>
  );
}

function hashSeed(input: string) {
  let n = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    n ^= input.charCodeAt(i);
    n = Math.imul(n, 16777619);
  }
  return Math.abs(n);
}

export function Sparkline({
  changePct,
  seed = "mm",
  width = 72,
  height = 28,
}: {
  changePct: number;
  seed?: string;
  width?: number;
  height?: number;
}) {
  const count = 14;
  const start = 42;
  const end = 42 + changePct * 1.15;
  let s = hashSeed(seed) || 1;
  const values = Array.from({ length: count }, (_, i) => {
    s = (s * 16807) % 2147483647;
    const t = i / (count - 1);
    const noise = ((s % 21) - 10) * (i === 0 || i === count - 1 ? 0 : 0.55);
    return start + (end - start) * t + noise;
  });
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.22 || 1;
  const xAt = (i: number) => (i / (count - 1)) * width;
  const yAt = (v: number) =>
    height - 2 - ((v - (min - pad)) / (max - min + 2 * pad)) * (height - 4);
  const pts = values.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const line = smoothLine(pts, 1, height - 1);
  const up = changePct >= 0;
  const stroke = up ? "var(--up-base)" : "var(--down-base)";
  return (
    <svg className={`sparkline ${up ? "up" : "down"}`} viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden>
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function BookChart({
  values,
  positive,
  height = 96,
  ghost = false,
}: {
  values: number[];
  positive?: boolean;
  height?: number;
  ghost?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  if (values.length < 2) return null;
  const W = 320;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.22 || 1;
  const xAt = (i: number) => (i / (values.length - 1)) * W;
  const yAt = (v: number) =>
    height - 4 - ((v - (min - pad)) / (max - min + 2 * pad)) * (height - 10);
  const pts = values.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const line = smoothLine(pts, 2, height - 2);
  const last = values[values.length - 1];
  const up = positive ?? last >= values[0];
  const stroke = ghost ? "var(--text-tertiary)" : up ? "var(--up-base)" : "var(--down-base)";
  const area = `${line} L${W} ${height} L0 ${height} Z`;
  const gid = `book-chart-${uid}`;
  const lastTop = (yAt(last) / height) * 100;

  return (
    <div className={`book-chart-wrap${ghost ? " ghost" : ""}`}>
      <svg
        className={`book-chart ${up ? "up" : "down"}`}
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={ghost ? "0.12" : "0.32"} />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.28, 0.54, 0.8].map((t) => (
          <line
            key={t}
            x1="0"
            x2={W}
            y1={height * t}
            y2={height * t}
            stroke="var(--border-subtle)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line
          x1="0"
          x2={W}
          y1={yAt(values[0])}
          y2={yAt(values[0])}
          stroke="var(--border-default)"
          strokeWidth="1"
          strokeDasharray="3 5"
          vectorEffect="non-scaling-stroke"
        />
        <path d={area} fill={`url(#${gid})`} />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <i className="book-chart-dot" style={{ top: `${lastTop}%`, background: stroke }} />
    </div>
  );
}

export function SectorDonut({
  rows,
  size = 68,
  label,
  sub,
}: {
  rows: { name: string; pct: number; color: string }[];
  size?: number;
  label?: string;
  sub?: string;
}) {
  const stroke = label ? 18 : 11;
  const r = size / 2 - stroke / 2 - 1;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg className="sector-donut" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={stroke} />
      {rows.map((row) => {
        const dash = (row.pct / 100) * circ;
        const rot = (acc / 100) * 360 - 90;
        acc += row.pct;
        return (
          <circle
            key={row.name}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={row.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            transform={`rotate(${rot} ${size / 2} ${size / 2})`}
          />
        );
      })}
      {label && (
        <>
          <text
            x={size / 2}
            y={sub ? size / 2 - 4 : size / 2 + 5}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize={sub ? 18 : 13}
            fontWeight="700"
            fontFamily="var(--font-sans)"
          >
            {label}
          </text>
          {sub && (
            <text
              x={size / 2}
              y={size / 2 + 14}
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize="9"
              fontWeight="600"
              fontFamily="var(--font-sans)"
            >
              {sub}
            </text>
          )}
        </>
      )}
    </svg>
  );
}

export function SectorSplit({
  rows,
}: {
  rows: { name: string; pct: number; color: string }[];
}) {
  return (
    <div className="sector-split">
      <SectorDonut rows={rows} />
      <ul className="sector-legend">
        {rows.map((row) => (
          <li key={row.name}>
            <i style={{ background: row.color }} />
            <span>{row.name}</span>
            <b>{row.pct}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TapeSpark({
  values,
  width = 96,
  height = 32,
  positive,
}: {
  values: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}) {
  if (values.length < 2) return null;
  const uid = useId().replace(/:/g, "");
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.22 || 1;
  const xAt = (i: number) => (i / (values.length - 1)) * width;
  const yAt = (v: number) =>
    height - 2 - ((v - (min - pad)) / (max - min + 2 * pad)) * (height - 4);
  const pts = values.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const line = smoothLine(pts, 1, height - 1);
  const last = values[values.length - 1];
  const up = positive ?? last >= values[0];
  const stroke = up ? "var(--up-base)" : "var(--down-base)";
  const area = `${line} L${xAt(values.length - 1).toFixed(1)} ${height} L0 ${height} Z`;
  const gid = `tape-spark-${uid}`;
  return (
    <svg className={`sparkline ${up ? "up" : "down"}`} viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.32" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={xAt(values.length - 1)} cy={yAt(last)} r="2.1" fill={stroke} />
    </svg>
  );
}

export function PulseBars({
  values,
  ticks,
  height = 88,
  ghost = false,
}: {
  values: number[];
  ticks?: { i: number; label: string }[];
  height?: number;
  ghost?: boolean;
}) {
  if (values.length === 0) return null;
  const W = 360;
  const max = Math.max(...values, 1);
  const n = values.length;
  const gap = 3.2;
  const plotW = W - 2;
  const barW = (plotW - gap * (n - 1)) / n;
  const plotH = height - 4;

  return (
    <div className={`pulse-bars-wrap${ghost ? " ghost" : ""}`}>
      <svg
        className="pulse-bars"
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        style={{ height }}
        aria-hidden
      >
        {values.map((v, i) => {
          const h = Math.max((v / max) * plotH, 4);
          const x = i * (barW + gap);
          return (
            <rect
              key={i}
              className="pulse-bar"
              x={x}
              y={plotH - h}
              width={barW}
              height={h}
              rx={Math.min(3.2, barW / 2)}
            />
          );
        })}
      </svg>
      {ticks && ticks.length > 0 && (
        <div className="pulse-bar-axis" aria-hidden>
          {ticks.map((tick) => (
            <span key={tick.label + tick.i}>{tick.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function AllocStrip({
  rows,
  ghost = false,
  legend = true,
}: {
  rows: { short: string; pct: number; color: string }[];
  ghost?: boolean;
  legend?: boolean;
}) {
  const summary = rows.map((row) => `${row.short} ${row.pct}%`).join(", ");
  return (
    <div className={`alloc-strip${ghost ? " ghost" : ""}${legend ? "" : " bar-only"}`}>
      <div className="alloc-bar" aria-label={summary} aria-hidden={legend}>
        {rows.map((row) => (
          <i key={row.short} style={{ flexGrow: row.pct, background: row.color }} />
        ))}
      </div>
      {legend && (
        <ul className="alloc-legend">
          {rows.map((row) => (
            <li key={row.short}>
              <i style={{ background: row.color }} />
              {row.short} {ghost ? "—" : `${row.pct}%`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
