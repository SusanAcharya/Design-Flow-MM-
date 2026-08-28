import { useEffect, useState } from "react";
import { Icon } from "../ds/Icon";
import type { IconName } from "../ds/Icon";
import { planCharacters, planHighlights, planIds, planMeta, planPerkGroups, planTerm } from "../lib/explore";
import { npr } from "../lib/format";
import { useApp } from "../lib/state";
import type { PerkValue } from "../lib/explore";
import type { Plan, PlanCycle } from "../lib/types";

const order: Record<Plan, number> = { free: 0, plus: 1, pro: 2 };

/* Three steps, one screen: pick a plan, check out, then the receipt. */
type Step = "plans" | "checkout" | "done";

const payMethods: { id: string; label: string; note: string; icon: IconName }[] = [
  { id: "esewa", label: "eSewa", note: "Wallet · lands at once", icon: "wallet" },
  { id: "khalti", label: "Khalti", note: "Wallet · lands at once", icon: "coin" },
  { id: "connectips", label: "Connect IPS", note: "Straight from your bank", icon: "bank" },
  { id: "card", label: "Card", note: "Visa or Mastercard", icon: "idcard" },
];

/** The one code the demo knows. Anything else is politely refused. */
const promoCode = "MITRA10";
const vatRate = 0.13;


function price(plan: Plan, cycle: PlanCycle) {
  const meta = planMeta[plan];
  return cycle === "annual" ? meta.annual : meta.monthly;
}

/** What the year costs against twelve single months — the reason to take annual. */
function annualSaving(plan: Plan) {
  const meta = planMeta[plan];
  if (meta.monthly === 0) return 0;
  return meta.monthly * 12 - meta.annual;
}

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

/* Web has the room for the tall card. The whole thing is the control — the
   button inside it is a shortcut, not the only way to pick. */
function PlanCard({
  id,
  cycle,
  current,
  picked,
  onPick,
}: {
  id: Plan;
  cycle: PlanCycle;
  current: Plan;
  picked: Plan | null;
  onPick: (plan: Plan) => void;
}) {
  const meta = planMeta[id];
  const amount = price(id, cycle);
  const isNow = id === current;
  const isPicked = id === picked;
  const down = order[id] < order[current];

  return (
    <article
      className={`sub-card plan-${id}${isNow ? " now" : ""}${isPicked ? " picked" : ""}`}
      role="button"
      tabIndex={isNow ? -1 : 0}
      aria-pressed={id === "free" ? undefined : isPicked}
      aria-disabled={isNow || undefined}
      onClick={() => !isNow && onPick(id)}
      onKeyDown={(event) => {
        if (isNow) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPick(id);
        }
      }}
    >
      {/* {id === "plus" && <span className="sub-flag">Most picked</span>} */}
      {isPicked && <span className="sub-tick" aria-hidden>✓</span>}
      <PlanCharacter plan={id} />
      <h2>{meta.label}</h2>
      <p className="sub-price">
        {amount === 0 ? "No cost" : <>Rs {npr(amount, 0)}</>}
        {amount > 0 && <small>/{cycle === "annual" ? "year" : "month"}</small>}
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
      <span className={`pf-quick-btn block${isNow || down || isPicked ? "" : " primary"}`} aria-hidden>
        {isNow ? "Your plan" : down ? `Move to ${meta.label}` : isPicked ? "Picked" : `Choose ${meta.label}`}
      </span>
    </article>
  );
}

/* Phone: one line a plan, so all three land in a single view. The perks of
   whichever is picked show once, below the list, instead of three times over. */
function PlanRow({
  id,
  cycle,
  current,
  picked,
  onPick,
}: {
  id: Plan;
  cycle: PlanCycle;
  current: Plan;
  picked: Plan | null;
  onPick: (plan: Plan) => void;
}) {
  const meta = planMeta[id];
  const amount = price(id, cycle);
  const isNow = id === current;
  const isPicked = id === picked;

  return (
    <button
      type="button"
      className={`sub-row plan-${id}${isPicked ? " picked" : ""}${isNow ? " now" : ""}`}
      aria-pressed={id === "free" ? undefined : isPicked}
      onClick={() => onPick(id)}
    >
      <span className="sub-row-face" aria-hidden>
        <img src={`${import.meta.env.BASE_URL}characters/${planCharacters[id]}.png`} alt="" />
      </span>
      <span className="sub-row-id">
        <span className="sub-row-name">
          <strong>{meta.label}</strong>
          {/* {id === "plus" && <em className="sub-row-flag">Most picked</em>} */}
          {isNow && <em className="sub-row-now">Your plan</em>}
        </span>
        <small>{meta.blurb}</small>
      </span>
      <span className="sub-row-price">
        <b>{amount === 0 ? "Free" : `Rs ${npr(amount, 0)}`}</b>
        {amount > 0 && <em>/{cycle === "annual" ? "yr" : "mo"}</em>}
      </span>
      <span className="sub-row-dot" aria-hidden />
    </button>
  );
}

/* ── Step 1 ─────────────────────────────────────────────────────────────── */
function PlansStep({
  cycle,
  setCycle,
  picked,
  setPicked,
  onContinue,
}: {
  cycle: PlanCycle;
  setCycle: (cycle: PlanCycle) => void;
  picked: Plan | null;
  setPicked: (plan: Plan | null) => void;
  onContinue: () => void;
}) {
  const { plan, planCycle, openSheet, setPlan, flash, subIntent, viewport } = useApp();
  const term = planTerm(plan, planCycle);
  const meta = planMeta[plan];

  const pick = (next: Plan) => {
    if (next === "free") {
      openSheet({
        kind: "confirm",
        title: "Move to Free?",
        body: "Alerts, the screener and imports switch off at the end of this cycle. Your holdings stay.",
        confirmLabel: "Move to Free",
        cancelLabel: `Stay on ${meta.label}`,
        danger: true,
        onConfirm: () => {
          setPicked(null);
          setPlan("free");
          flash({ message: "You are on Free. Nothing was charged.", tone: "warn" });
        },
      });
      return;
    }
    setPicked(picked === next ? null : next);
  };

  const step = picked ? order[picked] - order[plan] : 0;
  /* Nothing picked yet? Light up the plan they already hold. */
  const lit = picked ?? plan;

  return (
    <>
      {subIntent === "consult" && (
        <div className="sub-intent">
          <span className="sub-intent-mark" aria-hidden>
            <Icon name="chat" size={18} />
          </span>
          <span className="sub-intent-copy">
            <strong>A quick call comes with a paid plan</strong>
            <small>
              Plus gets one 30-minute call a quarter. Pro gets one a month, and you pick the analyst.
              We explain what you are holding — we never place an order for you.
            </small>
          </span>
        </div>
      )}

      <div className="sub-now">
        <span className={`sub-now-pill tier-${plan}`}>{meta.label}</span>
        <span className="sub-now-copy">
          <strong>
            {plan === "free"
              ? "You are on Free"
              : `${meta.label} · ${planCycle === "annual" ? "Annual" : "Monthly"}`}
          </strong>
          <small>{plan === "free" ? `Member since ${term.started}` : `Renews ${term.ending}`}</small>
        </span>
      </div>

      {/* The cycle sets the price on every card below, so it sits above them. */}
      <div className="sub-cycle-wrap">
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
        {cycle === "annual" && (
          <p className="sub-save-line">
            Annual keeps Rs {npr(annualSaving("plus"), 0)} on Plus and Rs {npr(annualSaving("pro"), 0)} on Pro
            against paying by the month.
          </p>
        )}
      </div>

      {viewport === "mobile" ? (
        <>
          <div className="sub-rows">
            {planIds.map((id) => (
              <PlanRow key={id} id={id} cycle={cycle} current={plan} picked={picked} onPick={pick} />
            ))}
          </div>
          <div className="sub-detail">
            <p className="sub-detail-head">
              What {planMeta[lit].label} gives you
            </p>
            <ul className="sub-perks">
              {planHighlights[lit].map((line) => (
                <li key={line}>
                  <span aria-hidden>✓</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="sub-cards">
          {planIds.map((id) => (
            <PlanCard key={id} id={id} cycle={cycle} current={plan} picked={picked} onPick={pick} />
          ))}
        </div>
      )}

      {/* The lit column follows the pick, and falls back to the plan they are on. */}
      <section className="sub-table-wrap">
        <p className="sub-table-title">What each plan gives you</p>
        <p className="sub-table-sub">
          {picked
            ? `Green is ${planMeta[lit].label} — the plan you picked.`
            : `Green is ${planMeta[lit].label} — the plan you are on. Pick another to compare.`}
        </p>
        <table className="sub-table">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              {planIds.map((id) => (
                <th key={id} scope="col" className={id === lit ? "on" : undefined}>
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
                  {planIds.map((id) => (
                    <td key={id} className={id === lit ? "on" : undefined}>
                      <Perk value={row[id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </section>

      {/* The buy button only shows once a tier is picked. */}
      {picked && (
        <div className="sub-bar" role="region" aria-label="Selected plan">
          <span className="sub-bar-copy">
            <strong>{planMeta[picked].label}</strong>
            <small>
              Rs {npr(price(picked, cycle), 0)} / {cycle === "annual" ? "year" : "month"}
              {step < 0 ? " · a step down" : ""}
            </small>
          </span>
          <button type="button" className="pf-quick-btn primary sub-bar-go" onClick={onContinue}>
            {step < 0 ? "Switch to" : "Buy"} {planMeta[picked].label}
          </button>
        </div>
      )}
    </>
  );
}

/* ── Step 2 ─────────────────────────────────────────────────────────────── */
function CheckoutStep({
  picked,
  cycle,
  setCycle,
  onBack,
  onPaid,
}: {
  picked: Plan;
  cycle: PlanCycle;
  setCycle: (cycle: PlanCycle) => void;
  onBack: () => void;
  onPaid: () => void;
}) {
  const { flash } = useApp();
  const [method, setMethod] = useState(payMethods[0].id);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [codeNote, setCodeNote] = useState<string | null>(null);

  const meta = planMeta[picked];
  const base = price(picked, cycle);
  const discount = applied ? Math.round(base * 0.1) : 0;
  const vat = Math.round((base - discount) * vatRate);
  const total = base - discount + vat;
  const term = planTerm(picked, cycle);

  const applyCode = () => {
    const entered = code.trim().toUpperCase();
    if (!entered) return;
    if (entered === promoCode) {
      setApplied(true);
      setCodeNote(`${promoCode} is on — 10% off this cycle.`);
      return;
    }
    setApplied(false);
    setCodeNote("That code did not work. Check the spelling.");
  };

  return (
    <>
      <div className="sub-sum">
        <PlanCharacter plan={picked} />
        <div className="sub-sum-copy">
          <div className="sub-sum-top">
            <span className={`sub-now-pill tier-${picked}`}>{meta.label}</span>
            <button type="button" className="text-link" onClick={onBack}>Change plan</button>
          </div>
          <strong>{meta.blurb}</strong>
          <small>Starts today · renews {term.ending}</small>
        </div>
      </div>

      <div className="sub-block">
        <p className="sub-block-title">How often</p>
        <div className="sub-terms">
          {(["monthly", "annual"] as PlanCycle[]).map((item) => (
            <button
              key={item}
              type="button"
              className={`sub-term${cycle === item ? " on" : ""}`}
              aria-pressed={cycle === item}
              onClick={() => setCycle(item)}
            >
              <span className="sub-term-id">
                <strong>{item === "monthly" ? "Monthly" : "Annual"}</strong>
                <small>
                  {item === "monthly"
                    ? "Stop any month"
                    : `Keeps Rs ${npr(annualSaving(picked), 0)} a year`}
                </small>
              </span>
              <b>Rs {npr(price(picked, item), 0)}</b>
            </button>
          ))}
        </div>
      </div>

      <div className="sub-block">
        <p className="sub-block-title">How you pay</p>
        <div className="sub-pays" role="radiogroup" aria-label="Payment method">
          {payMethods.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={method === item.id}
              className={`sub-pay${method === item.id ? " on" : ""}`}
              onClick={() => setMethod(item.id)}
            >
              <span className="sub-pay-mark" aria-hidden>
                <Icon name={item.icon} size={18} />
              </span>
              <span className="sub-pay-id">
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </span>
              <span className="sub-pay-dot" aria-hidden />
            </button>
          ))}
        </div>
      </div>

      <div className="sub-block">
        <p className="sub-block-title">Have a code?</p>
        <div className="sub-code">
          <input
            value={code}
            placeholder="Referral or offer code"
            aria-label="Offer code"
            onChange={(event) => {
              setCode(event.target.value);
              setApplied(false);
              setCodeNote(null);
            }}
            onKeyDown={(event) => event.key === "Enter" && applyCode()}
          />
          <button type="button" className="pf-quick-btn" disabled={!code.trim()} onClick={applyCode}>
            Apply
          </button>
        </div>
        {codeNote && <p className={`sub-code-note${applied ? " ok" : ""}`}>{codeNote}</p>}
      </div>

      <div className="sub-block">
        <p className="sub-block-title">What it comes to</p>
        <ul className="sub-lines">
          <li>
            <span>{meta.label} · {cycle === "annual" ? "one year" : "one month"}</span>
            <b>Rs {npr(base, 0)}</b>
          </li>
          {applied && (
            <li className="off">
              <span>{promoCode}</span>
              <b>− Rs {npr(discount, 0)}</b>
            </li>
          )}
          <li>
            <span>VAT 13%</span>
            <b>Rs {npr(vat, 0)}</b>
          </li>
          <li className="tot">
            <span>Total today</span>
            <b>Rs {npr(total, 0)}</b>
          </li>
        </ul>
      </div>

      <p className="foot-note pad">
        A demo checkout. No wallet is opened, no card is read and nothing is charged to you.
      </p>

      <div className="sub-bar" role="region" aria-label="Payment">
        <span className="sub-bar-copy">
          <strong>Rs {npr(total, 0)}</strong>
          <small>{payMethods.find((item) => item.id === method)?.label} · VAT included</small>
        </span>
        <button
          type="button"
          className="pf-quick-btn primary sub-bar-go"
          onClick={() => {
            onPaid();
            flash({ message: `Demo ${meta.label} is on. No payment is taken.` });
          }}
        >
          <Icon name="shield" size={16} /> Pay Rs {npr(total, 0)}
        </button>
      </div>
    </>
  );
}

/* ── Step 3 ─────────────────────────────────────────────────────────────── */
function DoneStep({ picked, cycle, onPlans }: { picked: Plan; cycle: PlanCycle; onPlans: () => void }) {
  const { go } = useApp();
  const meta = planMeta[picked];
  const term = planTerm(picked, cycle);

  return (
    <div className="sub-done">
      <PlanCharacter plan={picked} />
      <p className="t-h-xl">You are on {meta.label}</p>
      <p className="t-body-s muted">
        {cycle === "annual" ? "One year" : "One month"}, starting today. Renews {term.ending}, and you can
        step back down whenever you like.
      </p>
      <ul className="sub-done-list">
        {planHighlights[picked].map((line) => (
          <li key={line}>
            <span aria-hidden>✓</span>
            {line}
          </li>
        ))}
      </ul>
      <div className="sub-done-acts">
        <button type="button" className="pf-quick-btn primary" onClick={() => go("home")}>
          Start using it
        </button>
        <button type="button" className="pf-quick-btn" onClick={onPlans}>
          Back to plans
        </button>
      </div>
      <p className="foot-note">Nothing was charged. This is a demo receipt.</p>
    </div>
  );
}

export function SubscriptionScreen() {
  const { back, viewport, plan, planCycle, planSeed, setPlan, clearSubSeed } = useApp();
  const [cycle, setCycle] = useState<PlanCycle>(planCycle);
  const [picked, setPicked] = useState<Plan | null>(planSeed && planSeed !== plan ? planSeed : null);
  const [step, setStep] = useState<Step>("plans");

  /* A deep link or the quick-call card can land here with a tier already chosen. */
  useEffect(() => {
    if (planSeed && planSeed !== plan) setPicked(planSeed);
  }, [planSeed, plan]);

  useEffect(() => () => clearSubSeed(), [clearSubSeed]);

  const title = step === "plans" ? "Subscription" : step === "checkout" ? "Checkout" : "You're set";
  const stepBack = () => {
    if (step === "checkout") setStep("plans");
    else if (step === "done") setStep("plans");
    else back();
  };

  return (
    <div className={`desk-screen sub-desk step-${step}`}>
      {viewport === "mobile" ? (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={stepBack} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>{title}</h1>
        </div>
      ) : (
        <div className="desk-web-head">
          <button type="button" className="text-link web-back" onClick={stepBack}>‹ Back</button>
          <div className="desk-web-title">
            <h1 className="t-h-xl">{title}</h1>
          </div>
        </div>
      )}

      {step !== "done" && (
        <ol className="sub-steps" aria-label="Where you are">
          <li className={step === "plans" ? "on" : "past"}>Pick a plan</li>
          <li className={step === "checkout" ? "on" : ""}>Pay</li>
          <li>Done</li>
        </ol>
      )}

      {step === "plans" && (
        <PlansStep
          cycle={cycle}
          setCycle={setCycle}
          picked={picked}
          setPicked={setPicked}
          onContinue={() => setStep("checkout")}
        />
      )}

      {step === "checkout" && picked && (
        <CheckoutStep
          picked={picked}
          cycle={cycle}
          setCycle={setCycle}
          onBack={() => setStep("plans")}
          onPaid={() => {
            setPlan(picked, { cycle });
            setStep("done");
          }}
        />
      )}

      {step === "done" && picked && (
        <DoneStep
          picked={picked}
          cycle={cycle}
          onPlans={() => {
            setPicked(null);
            setStep("plans");
          }}
        />
      )}
    </div>
  );
}
