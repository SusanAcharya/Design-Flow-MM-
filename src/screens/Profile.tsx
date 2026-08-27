import { Icon } from "../ds/Icon";
import { user } from "../lib/data";
import { memberSince, planMeta, planTerm, referralCode } from "../lib/explore";
import { useApp } from "../lib/state";

function AccountRow({
  icon,
  title,
  sub,
  danger,
  onClick,
}: {
  icon: "shield" | "users" | "chat" | "alert" | "coin";
  title: string;
  sub: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`row${danger ? " danger" : ""}`} onClick={onClick}>
      <span className="profile-row-ico"><Icon name={icon} size={16} /></span>
      <div className="row-main">
        <p className="t-h-s">{title}</p>
        <p className="row-sub">{sub}</p>
      </div>
      <Icon name="chev" size={15} />
    </button>
  );
}

export function ProfileScreen() {
  const { back, go, viewport, plan, planCycle, avatar, openSheet, flash, resetDemo } = useApp();
  const meta = planMeta[plan];
  const term = planTerm(plan, planCycle);
  const paid = plan !== "free";

  const askDelete = () =>
    openSheet({
      kind: "confirm",
      title: "Delete this account?",
      body: "This clears the demo profile and returns you to the start. Holdings and the subscription are not recovered.",
      confirmLabel: "Delete account",
      cancelLabel: "Keep it",
      danger: true,
      onConfirm: () => {
        resetDemo();
        flash({ message: "Account removed. Start again when you want." });
      },
    });

  return (
    <div className="profile-screen">
      {viewport === "mobile" && (
        <div className="app-bar">
          <button type="button" className="icon-btn" onClick={back} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1>Profile</h1>
        </div>
      )}
      {viewport === "web" && (
        <div className="desk-web-head">
          <button type="button" className="text-link web-back" onClick={back}>‹ Back</button>
          <div className="desk-web-title">
            <h1 className="t-h-xl">Profile</h1>
          </div>
        </div>
      )}

      <div className="profile-grid">
        <div className="profile-col-main">
          <div className="profile-id">
            <span className="profile-face">
              <img src={avatar} alt="" />
              <button
                type="button"
                className="profile-face-edit"
                onClick={() => openSheet({ kind: "avatar" })}
                aria-label="Change your picture"
              >
                <Icon name="plus" size={14} />
              </button>
            </span>
            <div className="profile-id-copy">
              <p className="t-h-l">{user.fullName}</p>
              <p className="t-body-s muted">Member since {memberSince}</p>
              <button type="button" className="text-link" onClick={() => openSheet({ kind: "avatar" })}>
                Change picture
              </button>
            </div>
          </div>

          <article className={`profile-plan plan-${plan}`}>
            <header>
              <div>
                <p className="overline">{meta.kicker}</p>
                <h2>{meta.label}</h2>
              </div>
              <button type="button" className="profile-plan-buy" onClick={() => go("subscription")}>
                {paid ? "Change plan" : "Buy"}
              </button>
            </header>
            <dl>
              <div>
                <dt>Type</dt>
                <dd>{meta.label}{paid ? ` · ${planCycle === "annual" ? "Annual" : "Monthly"}` : ""}</dd>
              </div>
              <div>
                <dt>Started</dt>
                <dd>{term.started}</dd>
              </div>
              <div>
                <dt>Ending</dt>
                <dd>{term.ending}</dd>
              </div>
            </dl>
          </article>
        </div>

        <div className="profile-col-side">
          <div className="profile-card">
            <p className="profile-section">Account</p>
            <AccountRow
              icon="shield"
              title="Change password"
              sub="Update the sign-in for this demo profile"
              onClick={() => openSheet({ kind: "password" })}
            />
            <AccountRow
              icon="coin"
              title="Subscription"
              sub={paid ? `${meta.label} · renews ${term.ending}` : "You are on Free"}
              onClick={() => go("subscription")}
            />
            <AccountRow
              icon="users"
              title="Referral code"
              sub={referralCode}
              onClick={() => openSheet({ kind: "referral" })}
            />
            <AccountRow
              icon="chat"
              title="Help & support"
              sub="Mitra, or write to us"
              onClick={() => openSheet({ kind: "help" })}
            />
          </div>

          <div className="profile-card">
            <AccountRow
              icon="alert"
              title="Delete account"
              sub="Removes this demo profile"
              danger
              onClick={askDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
