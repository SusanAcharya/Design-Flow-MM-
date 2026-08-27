import { useEffect, useMemo, useState } from "react";
import { Icon } from "../ds/Icon";
import { TickerMark } from "../ds/TickerMark";

import { alertRules, listedQuotes, nepse, notifications } from "../lib/data";
import { npr } from "../lib/format";
import { useApp } from "../lib/state";
import { rawParam } from "../lib/deeplink";
import type { AlertRule, NotificationItem, NotificationKind } from "../lib/data";

/* Two screens live here and they are deliberately different jobs.
   Notifications = what already happened. Alerts = the rules you wrote. */

function ScreenHead({ title, action }: { title: string; action?: React.ReactNode }) {
  const { back, viewport } = useApp();
  if (viewport === "web") {
    return (
      <div className="desk-web-head">
        <button type="button" className="text-link web-back" onClick={back}>‹ Back</button>
        <div className="desk-web-title">
          <h1 className="t-h-xl">{title}</h1>
          {action}
        </div>
      </div>
    );
  }
  return (
    <div className="app-bar">
      <button type="button" className="icon-btn" onClick={back} aria-label="Back">
        <Icon name="back" />
      </button>
      <h1>{title}</h1>
      {action}
    </div>
  );
}

/* ── Notifications ──────────────────────────────────────────────────────── */

const noteIcon: Record<NotificationKind, "alert" | "megaphone" | "doc" | "wallet"> = {
  alert: "alert",
  corporate: "megaphone",
  ipo: "doc",
  book: "wallet",
};

export function NotificationsScreen() {
  const { go, openSheet } = useApp();
  const [read, setRead] = useState<string[]>(() => notifications.filter((n) => n.read).map((n) => n.id));

  const today = notifications.filter((n) => n.day === "today");
  const earlier = notifications.filter((n) => n.day === "earlier");
  const unread = notifications.filter((n) => !read.includes(n.id)).length;
  const fired = notifications.filter((n) => n.kind === "alert").length;

  const open = (item: NotificationItem) => {
    setRead((list) => (list.includes(item.id) ? list : [...list, item.id]));
    if (item.kind === "alert") go("alerts");
    else if (item.kind === "ipo") go("ipo");
    else if (item.symbol) go("stock", { stock: item.symbol });
    else openSheet({ kind: "quick", title: item.title, body: item.sub, note: `As of ${nepse.date}.` });
  };

  const group = (label: string, items: NotificationItem[]) =>
    items.length === 0 ? null : (
      <section className="note-group" key={label}>
        <p className="note-group-head">{label}</p>
        <div className="note-feed">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`note-row${read.includes(item.id) ? "" : " unread"}`}
              onClick={() => open(item)}
            >
              <span className={`note-ico k-${item.kind}`} aria-hidden>
                <Icon name={noteIcon[item.kind]} size={16} />
              </span>
              <span className="note-main">
                <strong>{item.title}</strong>
                <small>{item.sub}</small>
              </span>
              <span className="note-at">{item.at}</span>
            </button>
          ))}
        </div>
      </section>
    );

  return (
    <div className="desk-screen note-desk">
      <ScreenHead
        title="Notifications"
        action={
          unread > 0 ? (
            <button type="button" className="text-link note-read-all" onClick={() => setRead(notifications.map((n) => n.id))}>
              Mark all read
            </button>
          ) : undefined
        }
      />

      {group("Today", today)}
      {group("Earlier", earlier)}

      <button type="button" className="note-cta" onClick={() => go("alerts")}>
        <span className="note-cta-ico" aria-hidden>
          <Icon name="bell" size={20} />
        </span>
        <span className="note-cta-copy">
          <strong>Check out your alerts that fired</strong>
          <small>{fired} fired · see every rule you set</small>
        </span>
        <Icon name="chev" size={16} />
      </button>
    </div>
  );
}

/* ── Alerts ─────────────────────────────────────────────────────────────── */

function crossWord(rule: AlertRule) {
  return `${rule.cross === "above" ? "Above" : "Below"} ${npr(rule.price, 2)}`;
}

/** How far today's price is from the trigger, in the direction the rule needs. */
function toGo(rule: AlertRule) {
  const quote = listedQuotes.find((q) => q.symbol === rule.symbol);
  if (!quote) return null;
  const gap = ((rule.price - quote.ltp) / quote.ltp) * 100;
  const met = rule.cross === "above" ? gap <= 0 : gap >= 0;
  return { ltp: quote.ltp, gap, met, name: quote.name };
}

function RuleCard({
  rule,
  onMenu,
  onEdit,
}: {
  rule: AlertRule;
  onMenu: () => void;
  onEdit: () => void;
}) {
  const near = toGo(rule);
  return (
    <div className={`rule-card${rule.expired ? " gone" : ""}`}>
      <div className="rule-card-top">
        <button type="button" className="rule-card-open" onClick={onEdit}>
          <TickerMark symbol={rule.symbol} />
          <span className="rule-id">
            <strong>{rule.name}</strong>
            <small>{near?.name ?? rule.symbol}</small>
          </span>
        </button>
        <button type="button" className="rule-more" onClick={onMenu} aria-label={`Options for ${rule.name}`}>
          <Icon name="dots" size={18} />
        </button>
      </div>

      <button type="button" className="rule-facts" onClick={onEdit}>
        <span>
          <small>Trigger</small>
          <b>{crossWord(rule)}</b>
        </span>
        <span>
          <small>Last traded</small>
          <b>{near ? npr(near.ltp, 2) : "—"}</b>
        </span>
        <span>
          <small>To go</small>
          <b className={near && near.met ? "c-up" : undefined}>
            {near ? (near.met ? "Met" : `${Math.abs(near.gap).toFixed(1)}%`) : "—"}
          </b>
        </span>
      </button>

      <div className="rule-card-foot">
        <span className="rule-tags">
          {rule.channels.includes("app") && <em>App</em>}
          {rule.channels.includes("email") && <em>Email</em>}
          {rule.firedAt && !rule.expired && <em className="fired">Fired {rule.firedAt}</em>}
        </span>
        <em className="rule-when">{rule.expired ? `Ended ${rule.expiry}` : `Until ${rule.expiry}`}</em>
      </div>
    </div>
  );
}

export function AlertsScreen() {
  const { flash, openSheet, alertSeed, clearAlertSeed } = useApp();
  const [rules, setRules] = useState<AlertRule[]>(alertRules);
  const [tab, setTab] = useState<"active" | "expired">(() =>
    rawParam("alert") === "expired" ? "expired" : "active",
  );
  const linked = rawParam("alert");
  const linkedSymbol = linked && listedQuotes.some((q) => q.symbol === linked) ? linked : null;
  const [editing, setEditing] = useState<AlertRule | "new" | null>(() =>
    linked === "new" || linkedSymbol ? "new" : null,
  );

  useEffect(() => {
    if (alertSeed) setEditing("new");
  }, [alertSeed]);

  const active = rules.filter((r) => !r.expired);
  const expired = rules.filter((r) => r.expired);
  const shown = tab === "active" ? active : expired;

  const save = (rule: AlertRule) => {
    setRules((list) => (list.some((r) => r.id === rule.id) ? list.map((r) => (r.id === rule.id ? rule : r)) : [rule, ...list]));
    setEditing(null);
    clearAlertSeed();
    setTab(rule.expired ? "expired" : "active");
    flash({ message: "Alert saved. It reminds you — it never places an order." });
  };

  const remove = (id: string) => {
    setRules((list) => list.filter((r) => r.id !== id));
    setEditing(null);
    flash({ message: "Alert deleted." });
  };

  const openMenu = (rule: AlertRule) => {
    openSheet({
      kind: "actions",
      title: rule.name,
      note: `${crossWord(rule)} · ${rule.symbol}`,
      actions: [
        { label: "Edit alert", icon: "clipboard", onSelect: () => setEditing(rule) },
        ...(rule.expired
          ? [
              {
                label: "Watch again",
                icon: "refresh",
                onSelect: () => {
                  setRules((list) => list.map((r) => (r.id === rule.id ? { ...r, expired: false } : r)));
                  setTab("active");
                  flash({ message: `${rule.name} is watching again.` });
                },
              },
            ]
          : []),
        { label: "Delete alert", icon: "alert", danger: true, onSelect: () => askDelete(rule) },
      ],
    });
  };

  const askDelete = (rule: AlertRule) => {
    openSheet({
      kind: "confirm",
      title: "Delete this alert?",
      body: `${rule.name} — ${crossWord(rule)} on ${rule.symbol}. Nothing will watch that price after this.`,
      confirmLabel: "Delete alert",
      cancelLabel: "Keep it",
      danger: true,
      onConfirm: () => remove(rule.id),
    });
  };

  if (editing) {
    return (
      <AlertForm
        rule={editing === "new" ? null : editing}
        symbolSeed={alertSeed ?? linkedSymbol ?? undefined}
        onSave={save}
        onDelete={askDelete}
        onCancel={() => {
          setEditing(null);
          clearAlertSeed();
        }}
      />
    );
  }

  return (
    <div className="desk-screen alerts-desk">
      <ScreenHead title="Alerts" />

      <div className="desk-tabs pad">
        <div className="home-feed-tabs duo" role="tablist" aria-label="Alert state">
          {([
            { id: "active" as const, label: "Active", count: active.length },
            { id: "expired" as const, label: "Expired", count: expired.length },
          ]).map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={tab === item.id ? "on" : ""}
              onClick={() => setTab(item.id)}
            >
              {item.label} <em>{item.count}</em>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="alerts-empty">
          <span className="alerts-empty-ico" aria-hidden>
            <Icon name="alert" size={24} />
          </span>
          <p className="t-h-s">{tab === "active" ? "No alerts yet" : "Nothing has expired"}</p>
          <p className="t-body-s muted">
            {tab === "active" ? "Set a price and we watch it for you." : "Alerts move here when their date passes."}
          </p>
          {tab === "active" && (
            <button type="button" className="pf-quick-btn primary" onClick={() => setEditing("new")}>
              Create an alert
            </button>
          )}
        </div>
      ) : (
        <div className="rule-cards">
          {shown.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onEdit={() => setEditing(rule)}
              onMenu={() => openMenu(rule)}
            />
          ))}
        </div>
      )}


      <button type="button" className="alert-fab" onClick={() => setEditing("new")} aria-label="Create an alert">
        <Icon name="plus" size={22} />
        <span>New alert</span>
      </button>
    </div>
  );
}

/* ── The form ───────────────────────────────────────────────────────────── */

function AlertForm({
  rule,
  symbolSeed,
  onSave,
  onDelete,
  onCancel,
}: {
  rule: AlertRule | null;
  symbolSeed?: string;
  onSave: (rule: AlertRule) => void;
  onDelete: (rule: AlertRule) => void;
  onCancel: () => void;
}) {
  const { viewport } = useApp();
  const [symbol, setSymbol] = useState(rule?.symbol ?? symbolSeed ?? "NABIL");
  const [cross, setCross] = useState<"above" | "below">(rule?.cross ?? "above");
  const [price, setPrice] = useState(rule ? String(rule.price) : "");
  const [expiry, setExpiry] = useState(rule?.expiry ?? "30 Bhadra 2083");
  const [app, setApp] = useState(rule ? rule.channels.includes("app") : true);
  const [email, setEmail] = useState(rule ? rule.channels.includes("email") : false);
  const [name, setName] = useState(rule?.name ?? "");
  const [message, setMessage] = useState(rule?.message ?? "");

  const quote = useMemo(() => listedQuotes.find((q) => q.symbol === symbol), [symbol]);
  const value = Number(price);
  const ready = Boolean(symbol) && value > 0 && (app || email);
  const away = quote && value > 0 ? ((value - quote.ltp) / quote.ltp) * 100 : null;

  const submit = () => {
    if (!ready) return;
    onSave({
      id: rule?.id ?? `a${Date.now()}`,
      name: name.trim() || `${symbol} ${cross} ${npr(value, 2)}`,
      symbol,
      cross,
      price: value,
      expiry,
      channels: [...(app ? (["app"] as const) : []), ...(email ? (["email"] as const) : [])],
      message: message.trim() || undefined,
      expired: false,
      firedAt: rule?.firedAt,
    });
  };

  return (
    <div className="pf-form alert-form">
      {viewport === "web" ? (
        <div className="desk-web-head">
          <button type="button" className="text-link web-back" onClick={onCancel}>‹ Back</button>
          <div className="desk-web-title">
            <h1 className="t-h-xl">{rule ? "Edit alert" : "Add alert"}</h1>
          </div>
        </div>
      ) : (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Cancel">
            <Icon name="back" />
          </button>
          <h1>{rule ? "Edit alert" : "Add alert"}</h1>
        </div>
      )}

      <div className="alert-form-grid">
        <div className="alert-form-main">
          <div className="pf-fields one">
            <label className="pf-field">
              <span>Company</span>
              <select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
                {listedQuotes.map((q) => (
                  <option key={q.symbol} value={q.symbol}>
                    {q.symbol} · {q.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {quote && (
            <div className="alert-now">
              <TickerMark symbol={quote.symbol} />
              <span>
                <strong>{npr(quote.ltp, 2)}</strong>
                <small>Last traded · {nepse.date}</small>
              </span>
              <span className="alert-now-range">
                {npr(quote.weekLow, 2)} – {npr(quote.weekHigh, 2)}
                <small>52 weeks</small>
              </span>
            </div>
          )}

          <p className="pf-legend pad alert-legend">Tell me when the price goes</p>
          <div className="pf-form-kinds">
            {(["above", "below"] as const).map((item) => (
              <button key={item} type="button" className={cross === item ? "on" : ""} onClick={() => setCross(item)}>
                {item === "above" ? "Above" : "Below"}
              </button>
            ))}
          </div>

          <div className="pf-fields">
            <label className="pf-field">
              <span>Price</span>
              <input value={price} inputMode="decimal" placeholder="0.00" onChange={(event) => setPrice(event.target.value)} />
            </label>
            <label className="pf-field">
              <span>Expires</span>
              <input value={expiry} onChange={(event) => setExpiry(event.target.value)} />
            </label>
          </div>

          <div className="alert-channels">
            <p className="pf-legend">Tell me by</p>
            {([
              { on: app, set: setApp, label: "Notification on app" },
              { on: email, set: setEmail, label: "Email" },
            ] as const).map((row) => (
              <button
                key={row.label}
                type="button"
                role="checkbox"
                aria-checked={row.on}
                className={`alert-check${row.on ? " on" : ""}`}
                onClick={() => row.set(!row.on)}
              >
                <i aria-hidden />
                <span>{row.label}</span>
              </button>
            ))}
          </div>

          <div className="pf-fields one">
            <label className="pf-field">
              <span>Name (optional)</span>
              <input value={name} placeholder={`${symbol} ${cross} ${price || "0.00"}`} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="pf-field">
              <span>Message (optional)</span>
              <input value={message} placeholder="What to check when this fires" onChange={(event) => setMessage(event.target.value)} />
            </label>
          </div>
        </div>

        <aside className="alert-form-side">
          <div className="alert-recap">
            <p className="pf-legend">This alert</p>
            <p className="alert-recap-line">
              {symbol} {cross} <b>{value > 0 ? npr(value, 2) : "—"}</b>
            </p>
            <p className="t-body-xs muted">
              {value <= 0
                ? "Enter a price to finish."
                : away !== null && Math.abs(away) < 0.05
                  ? "At today’s price."
                  : `${Math.abs(away ?? 0).toFixed(1)}% ${(away ?? 0) > 0 ? "above" : "below"} today’s price.`}
            </p>
            <dl className="alert-recap-list">
              <div>
                <dt>Tell me by</dt>
                <dd>{[app && "App", email && "Email"].filter(Boolean).join(" · ") || "Pick one"}</dd>
              </div>
              <div>
                <dt>Expires</dt>
                <dd>{expiry}</dd>
              </div>
            </dl>
            <button type="button" className="pf-quick-btn primary block" disabled={!ready} onClick={submit}>
              Save alert
            </button>
            {rule && (
              <button type="button" className="text-link danger" onClick={() => onDelete(rule)}>
                Delete alert
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
