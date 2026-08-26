import { useState } from "react";

const art = new Set([
  "nabil",
  "upper",
  "nica",
  "shivm",
  "hdl",
  "sohl",
  "chcl",
  "gbime",
  "ridi",
  "nric",
  "ntc",
]);

export function TickerMark({ symbol, size }: { symbol: string; size?: "sm" }) {
  const [failed, setFailed] = useState(false);
  const key = symbol.toLowerCase();
  const showImg = art.has(key) && !failed;

  if (!showImg) {
    return (
      <span className={`ticker-mark${size === "sm" ? " sm" : ""}`} aria-hidden>
        {symbol.slice(0, 2)}
      </span>
    );
  }

  return (
    <span className={`ticker-mark has-img${size === "sm" ? " sm" : ""}`} aria-hidden>
      <img
        src={`${import.meta.env.BASE_URL}tickers/${key}.svg`}
        alt=""
        onError={() => setFailed(true)}
      />
    </span>
  );
}
