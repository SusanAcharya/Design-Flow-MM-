import { useState } from "react";

/* One mark per listed company — keep this in step with public/tickers. */
const art = new Set([
  "nabil",
  "nica",
  "gbime",
  "adbl",
  "nlic",
  "upper",
  "chcl",
  "ridi",
  "api",
  "bhl",
  "ahl",
  "shivm",
  "hdl",
  "sapil",
  "mepdl",
  "sohl",
  "bbc",
  "nlo",
  "cfcl",
  "gufl",
  "avyan",
  "aclbsl",
  "ntc",
  "nric",
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
