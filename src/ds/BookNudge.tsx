import { AllocStrip } from "./charts";
import { Button } from "./primitives";

const ghostSectors = [
  { short: "BANKS", pct: 45, color: "#5b8cff" },
  { short: "HYDRO", pct: 28, color: "#32e36a" },
  { short: "MFG", pct: 21, color: "#f08c00" },
  { short: "INV", pct: 6, color: "#a78bfa" },
];

export function BookNudge({
  kicker = "Nothing in the book yet",
  onPaste,
  onType,
}: {
  kicker?: string;
  onPaste: () => void;
  onType: () => void;
}) {
  return (
    <div className="book-nudge">
      <div className="book-nudge-copy">
        <p className="book-nudge-kicker">{kicker}</p>
        <p className="book-nudge-title">Create your portfolio</p>
        <p className="book-nudge-note">
          Paste one broker SMS. We’ll put in what you paid, what it’s worth, and how it’s split.
        </p>
      </div>
      <div className="book-preview" aria-hidden>
        <div className="book-card-head">
          <span>Your portfolio</span>
          <em>after one paste</em>
        </div>
        <div className="book-card-figures ghost">
          <b>Rs —.—</b>
          <em>+Rs —</em>
        </div>
        <AllocStrip rows={ghostSectors} ghost />
      </div>
      <div className="book-nudge-actions">
        <Button variant="primary" size="lg" block onClick={onPaste}>
          Paste a broker message
        </Button>
        <button type="button" className="book-nudge-alt" onClick={onType}>
          Or type the kitta yourself
        </button>
      </div>
    </div>
  );
}
