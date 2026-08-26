import { AllocStrip } from "./charts";
import { Button } from "./primitives";

const ghostSectors = [
  { short: "BANKS", pct: 45, color: "#5b8cff" },
  { short: "HYDRO", pct: 28, color: "#32e36a" },
  { short: "MFG", pct: 11, color: "#f08c00" },
  { short: "DIST", pct: 10, color: "#d4a84a" },
  { short: "OTHER", pct: 6, color: "#8b8b8b" },
];

export function BookNudge({
  kicker = "Nothing in the book yet",
  onAdd,
  onDismiss,
}: {
  kicker?: string;
  onAdd: () => void;
  onDismiss?: () => void;
}) {
  return (
    <div className="book-nudge">
      <div className="book-nudge-copy">
        <p className="book-nudge-kicker">{kicker}</p>
        <p className="book-nudge-title">Create your portfolio</p>
        <p className="book-nudge-note">
          Add one holding. We’ll put in what you paid, what it’s worth, and how it’s split.
        </p>
      </div>
      <div className="book-preview" aria-hidden>
        <div className="book-card-head">
          <span>Your portfolio</span>
          <em>after you add</em>
        </div>
        <div className="book-card-figures ghost">
          <b>Rs —.—</b>
          <em>+Rs —</em>
        </div>
        <AllocStrip rows={ghostSectors} ghost />
      </div>
      <div className="book-nudge-actions">
        <Button variant="primary" size="sm" onClick={onAdd}>
          Add a holding
        </Button>
        {onDismiss && (
          <Button variant="secondary" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}
