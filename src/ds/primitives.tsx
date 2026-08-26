import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { BreadthField } from "./charts";
import { direction, npr, pct, signed } from "../lib/format";

export function StatusBar({ time = "11:27" }: { time?: string }) {
  return (
    <div className="status-bar">
      <span className="t-mono-s">{time}</span>
      <span className="signal" aria-hidden>
        <i /><i /><i /><i />
        <b />
      </span>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "lg",
  onClick,
  block,
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "up" | "warn";
  size?: "lg" | "md" | "sm";
  onClick?: () => void;
  block?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} btn-${size} ${block ? "btn-block" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" className={`chip ${selected ? "chip-on" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export function Delta({ value, digits = 2 }: { value: number; digits?: number }) {
  const dir = direction(value);
  return (
    <span className={`delta delta-${dir}`}>
      {dir !== "flat" && (
        <Icon name={dir === "down" ? "triangle-down" : "triangle-up"} size={7} />
      )}
      {pct(value, digits)}
    </span>
  );
}

export function AmountDelta({ value, digits = 0 }: { value: number; digits?: number }) {
  const dir = direction(value);
  return <span className={`delta delta-${dir}`}>{signed(value, digits)}</span>;
}

export function MovePill({
  amount,
  pct: pctValue,
  amountDigits = 2,
  pctDigits = 2,
}: {
  amount?: number;
  pct: number;
  amountDigits?: number;
  pctDigits?: number;
}) {
  const dir = direction(pctValue);
  return (
    <span className={`move-mark move-${dir}`}>
      {dir !== "flat" && (
        <Icon name={dir === "down" ? "triangle-down" : "triangle-up"} size={8} />
      )}
      {amount != null && <b>{signed(amount, amountDigits)}</b>}
      <em>{pct(pctValue, pctDigits)}</em>
    </span>
  );
}

export function Figure({
  kicker,
  value,
  digits = 0,
  amount,
  pct: pctValue,
  amountDigits,
  note,
  action,
  loading,
  updated,
}: {
  kicker?: ReactNode;
  value: number;
  digits?: number;
  amount?: number;
  pct?: number;
  amountDigits?: number;
  note?: ReactNode;
  action?: ReactNode;
  loading?: boolean;
  updated?: boolean;
}) {
  return (
    <div className={`figure${loading ? " is-loading" : ""}${updated ? " just-updated" : ""}`}>
      {(kicker || action) && (
        <div className="figure-head">
          {kicker ? <p className="figure-kicker">{kicker}</p> : <span />}
          {action}
        </div>
      )}
      <div className="figure-line">
        <p className="hero-num">{npr(value, digits)}</p>
        {pctValue != null && (
          <MovePill amount={amount} pct={pctValue} amountDigits={amountDigits ?? digits} />
        )}
      </div>
      {note ? <p className="figure-note">{note}</p> : null}
    </div>
  );
}

export function Badge({
  tone = "accent",
  children,
}: {
  tone?: "accent" | "teal" | "violet" | "saffron" | "warn";
  children: ReactNode;
}) {
  return (
    <span className={`badge badge-${tone}`}>
      <span className="badge-dot" />
      {children}
    </span>
  );
}

export function Explain({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="explain" onClick={onClick}>
      <Icon name="info" size={14} />
      {children}
    </button>
  );
}

export function Overline({ children }: { children: ReactNode }) {
  return <p className="overline">{children}</p>;
}

export function SectionHead({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-head">
      <span className="overline">{title}</span>
      {action && (
        <button type="button" className="text-link" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

export function StatTable({
  columns,
}: {
  columns: { label: string; value: ReactNode; tone?: "up" | "down" }[];
}) {
  return (
    <div className="stat-table-wrap">
      <table className="stat-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.label}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((col) => (
              <td
                key={col.label}
                className={col.tone === "down" ? "c-down" : col.tone === "up" ? "c-up" : undefined}
              >
                {col.value}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SearchField({
  placeholder,
  onFocus,
  shortcut,
  value,
  onChange,
  autoFocus,
}: {
  placeholder: string;
  onFocus?: () => void;
  shortcut?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
}) {
  if (onChange) {
    return (
      <label className={`search-field ${value ? "filled" : ""}`}>
        <Icon name="search" size={17} />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
        />
        {value ? (
          <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
            ×
          </button>
        ) : shortcut ? (
          <kbd>/</kbd>
        ) : null}
      </label>
    );
  }

  return (
    <button type="button" className="search-field" onClick={onFocus}>
      <Icon name="search" size={17} />
      <span>{placeholder}</span>
      {shortcut && <kbd>/</kbd>}
    </button>
  );
}

export function BreadthBar({
  rose,
  fell,
  unchanged = 0,
}: {
  rose: number;
  fell: number;
  unchanged?: number;
}) {
  const total = rose + fell + unchanged || 1;
  return (
    <div className="breadth-split">
      <div className="breadth-bar tri" aria-hidden>
        <i style={{ width: `${(rose / total) * 100}%` }} />
        <b style={{ width: `${(fell / total) * 100}%` }} />
        <em style={{ width: `${(unchanged / total) * 100}%` }} />
      </div>
      <div className="breadth-legend tri">
        <span><strong className="c-up">{rose}</strong> rose</span>
        <span><strong className="c-down">{fell}</strong> fell</span>
        <span><strong className="c-muted">{unchanged}</strong> unchanged</span>
      </div>
    </div>
  );
}

export function Breadth({
  rose,
  fell,
  unchanged = 0,
}: {
  rose: number;
  fell: number;
  unchanged?: number;
}) {
  return (
    <div className="breadth">
      <BreadthField rose={rose} fell={fell} unchanged={unchanged} />
      <div className="breadth-legend">
        <span>
          <strong className="c-up">{rose}</strong> rose
        </span>
        <span>
          <strong className="c-muted">{unchanged}</strong> unchanged
        </span>
        <span>
          <strong className="c-down">{fell}</strong> fell
        </span>
      </div>
    </div>
  );
}

export function Row({
  title,
  sub,
  meta,
  extra,
  onClick,
  icon,
}: {
  title: ReactNode;
  sub?: ReactNode;
  meta?: ReactNode;
  extra?: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  const inner = (
    <>
      {icon}
      <div className="row-main">
        <div className="row-title">{title}</div>
        {sub && <div className="row-sub">{sub}</div>}
      </div>
      <div className="row-meta">{meta}</div>
      {extra}
    </>
  );
  if (onClick) {
    return (
      <button type="button" className="row" onClick={onClick}>
        {inner}
      </button>
    );
  }
  return <div className="row">{inner}</div>;
}
