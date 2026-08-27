import { Icon } from "../ds/Icon";
import { HappenList } from "../ds/HappenList";
import { bookHappen, moreHappen, nepse } from "../lib/data";
import { useApp } from "../lib/state";
import type { HappenItem } from "../ds/HappenList";

/* Everything the book and the watchlist did today. The open part is what Home
   and Portfolio already showed; the rest comes with a paid plan. */
export function HappeningScreen() {
  const { back, go, viewport, plan } = useApp();
  const paid = plan !== "free";

  const open = (item: HappenItem) => {
    if (item.stock) go("stock", { stock: item.stock });
    else if (item.kind === "ipo") go("ipo");
  };

  return (
    <div className="desk-screen happen-desk">
      {viewport === "mobile" ? (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={back} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>What's happening</h1>
        </div>
      ) : (
        <div className="desk-web-head">
          <button type="button" className="text-link web-back" onClick={back}>‹ Back</button>
          <div className="desk-web-title">
            <h1 className="t-h-xl">What's happening</h1>
          </div>
        </div>
      )}

      <p className="pad t-body-xs muted happen-when">
        Your book and watchlist · {nepse.date} close
      </p>

      <section className="happen-block">
        <HappenList items={bookHappen} onOpen={open} />
      </section>

      <section className="happen-block">
        <p className="happen-block-head">
          Others
          {!paid && <em>{moreHappen.length} more</em>}
        </p>
        {paid ? (
          <HappenList items={moreHappen} onOpen={open} />
        ) : (
          <div className="happen-lock">
            <div className="happen-lock-blur" aria-hidden>
              <HappenList items={moreHappen} />
            </div>
            <div className="happen-lock-card">
              <span className="happen-lock-ico" aria-hidden>
                <Icon name="shield" size={20} />
              </span>
              <p className="t-h-s">Full list is available for Plus and Pro users.</p>
              <button type="button" className="pf-quick-btn primary" onClick={() => go("subscription")}>
                See plans
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
