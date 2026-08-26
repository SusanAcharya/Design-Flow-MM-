export type HappenKind = "up" | "down" | "event" | "ipo";

export function HappenIco({ kind }: { kind: HappenKind }) {
  return (
    <span className={`happen-ico ${kind}`}>
      {kind === "ipo" ? (
        "IPO"
      ) : kind === "up" ? (
        <svg width="11" height="9" viewBox="0 0 11 9" aria-hidden>
          <path d="M5.5 0L11 9H0L5.5 0Z" fill="currentColor" />
        </svg>
      ) : kind === "down" ? (
        <svg width="11" height="9" viewBox="0 0 11 9" aria-hidden>
          <path d="M5.5 9L0 0h11L5.5 9Z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="5.4" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 5.2V8l2 1.15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export type HappenItem = {
  kind: HappenKind;
  title: string;
  sub: string;
  context: string;
  stock?: string;
};

export function HappenList({
  items,
  onOpen,
}: {
  items: HappenItem[];
  onOpen?: (item: HappenItem) => void;
}) {
  return (
    <div className="happen-list">
      {items.map((item) => {
        const canOpen = Boolean(onOpen && (item.stock || item.kind === "ipo"));
        const body = (
          <>
            <HappenIco kind={item.kind} />
            <span className="happen-row-copy">
              <strong>{item.title}</strong>
              <small>{item.sub}</small>
            </span>
            <em>{item.context}</em>
          </>
        );
        return canOpen ? (
          <button
            key={item.title}
            type="button"
            className="happen-row"
            onClick={() => onOpen?.(item)}
          >
            {body}
          </button>
        ) : (
          <span key={item.title} className="happen-row">
            {body}
          </span>
        );
      })}
    </div>
  );
}
