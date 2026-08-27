import { useState } from "react";
import { Icon } from "../ds/Icon";
import { planCharacters, planHighlights, planIds, planMeta, planPerkGroups, planTerm } from "../lib/explore";
import { npr } from "../lib/format";
import { useApp } from "../lib/state";
import type { PerkValue } from "../lib/explore";
import type { Plan, PlanCycle } from "../lib/types";

const order: Record<Plan, number> = { free: 0, plus: 1, pro: 2 };

function PlanCharacter({ plan }: { plan: Plan }) {
  return (
    <span className="sub-char" aria-hidden>
      <img src={`${import.meta.env.BASE_URL}characters/${planCharacters[plan]}.png`} alt="" />
    </span>
  );
}

function Perk({ value }: { value: PerkValue }) {
  if (value === true) return <span className="perk-yes" aria-label="Included">✓</span>;
  if (value === false) return <span className="perk-no" aria-label="Not included">—</span>;
  return <span className="perk-word">{value}</span>;
}

function PlanCard({
  id,
  cycle,
  current,
  onPick,
}: {
  id: Plan;
  cycle: PlanCycle;
  current: Plan;
  onPick: (plan: Plan) => void;
}) {
  const meta = planMeta[id];
  const price = cycle === "annual" ? meta.annual : meta.monthly;
  const isNow = id === current;
  const down = order[id] < order[current];

  return (
    <article className={`sub-card plan-${id}${isNow ? " now" : ""}`}>
      {id === "plus" && <span className="sub-flag">Most picked</span>}
      <PlanCharacter plan={id} />
      <h2>{meta.label}</h2>
      <p className="sub-price">
        {price === 0 ? "No cost" : <>Rs {npr(price, 0)}</>}
        {price > 0 && <small>/{cycle === "annual" ? "year" : "month"}</small>}
      </p>
      <p className="t-body-s muted">{meta.blurb}</p>
      <ul className="sub-perks">
        {planHighlights[id].map((line) => (
          <li key={line}>
            <span aria-hidden>✓</span>
            {line}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`pf-quick-btn block${isNow || down ? "" : " primary"}`}
        disabled={isNow}
        onClick={() => onPick(id)}
      >
        {isNow ? "Your plan" : down ? `Move to ${meta.label}` : `Get ${meta.label}`}
      </button>
    </article>
  );
}

export function SubscriptionScreen() {
  const { back, viewport, plan, planCycle, setPlan, openSheet, flash } = useApp();
  const [cycle, setCycle] = useState<PlanCycle>(planCycle);
  const term = planTerm(plan, planCycle);
  const meta = planMeta[plan];

  const pick = (next: Plan) => {
    if (next === "free") {
      openSheet({
        kind: "confirm",
        title: "Move to Free?",
        body: "Alerts, the screener and imports switch off at the end of this cycle. Your holdings stay.",
        confirmLabel: "Move to Free",
        cancelLabel: "Stay on " + meta.label,
        danger: true,
        onConfirm: () => {
          setPlan("free");
          flash({ message: "You are on Free. Nothing was charged." });
        },
      });
      return;
    }
    setPlan(next, { cycle });
    flash({ message: `Demo ${planMeta[next].label} is on. No payment is taken.` });
  };

  return (
    <div className="desk-screen sub-desk">
      {viewport === "mobile" ? (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={back} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>Subscription</h1>
        </div>
      ) : (
        <div className="desk-web-head">
          <button type="button" className="text-link web-back" onClick={back}>‹ Back</button>
          <div className="desk-web-title">
            <h1 className="t-h-xl">Subscription</h1>
          </div>
        </div>
      )}

      <div className="sub-now">
        <span className={`sub-now-pill tier-${plan}`}>{meta.label}</span>
        <span className="sub-now-copy">
          <strong>{plan === "free" ? "You are on Free" : `${meta.label} · ${planCycle === "annual" ? "Annual" : "Monthly"}`}</strong>
          <small>{plan === "free" ? `Member since ${term.started}` : `Renews ${term.ending}`}</small>
        </span>
        <div className="sub-cycle" role="tablist" aria-label="Billing cycle">
          {(["monthly", "annual"] as PlanCycle[]).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={cycle === item}
              className={cycle === item ? "on" : ""}
              onClick={() => setCycle(item)}
            >
              {item === "monthly" ? "Monthly" : "Annual"}
            </button>
          ))}
        </div>
      </div>
      {cycle === "annual" && <p className="pad t-body-xs muted sub-save">Annual keeps about two months.</p>}

      <div className="sub-cards">
        {planIds.map((id) => (
          <PlanCard key={id} id={id} cycle={cycle} current={plan} onPick={pick} />
        ))}
      </div>

      <section className="sub-table-wrap">
        <p className="sub-table-title">What each plan gives you</p>
        <table className="sub-table">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              {planIds.map((id) => (
                <th key={id} scope="col" className={id === plan ? "on" : undefined}>
                  {planMeta[id].label}
                </th>
              ))}
            </tr>
          </thead>
          {planPerkGroups.map((group) => (
            <tbody key={group.title}>
              <tr className="sub-table-group">
                <th scope="colgroup" colSpan={4}>{group.title}</th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td className={plan === "free" ? "on" : undefined}><Perk value={row.free} /></td>
                  <td className={plan === "plus" ? "on" : undefined}><Perk value={row.plus} /></td>
                  <td className={plan === "pro" ? "on" : undefined}><Perk value={row.pro} /></td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </section>

      <p className="foot-note pad">
        A demo. No payment is taken and nothing is charged to you.
      </p>
    </div>
  );
}
