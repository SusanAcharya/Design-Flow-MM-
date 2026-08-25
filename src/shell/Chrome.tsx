import { useEffect, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { UserAvatar } from "../ds/UserAvatar";
import { SearchField, StatusBar } from "../ds/primitives";
import { alerts, user } from "../lib/data";
import { planMeta } from "../lib/explore";
import { activeTab } from "../lib/nav";
import { stageMeta } from "../lib/stage";
import { useApp } from "../lib/state";
import type { Route } from "../lib/types";

const tabs: { id: Route; label: string; icon: "home" | "market" | "tulkey" | "wallet" | "discover" }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "market", label: "Market", icon: "market" },
  { id: "ai", label: "Tulkey", icon: "tulkey" },
  { id: "portfolio", label: "Portfolio", icon: "wallet" },
  { id: "discover", label: "Explore", icon: "discover" },
];

const tabRoots: Route[] = ["home", "market", "ai", "discover", "portfolio"];

function AvatarButton() {
  const { openSheet } = useApp();
  return (
    <button
      type="button"
      className="avatar-btn"
      aria-label="Profile and level"
      onClick={() => openSheet({ kind: "profile" })}
    >
      <UserAvatar size={40} />
    </button>
  );
}

function Identity({ compact = false }: { compact?: boolean }) {
  const { stage } = useApp();
  return (
    <div className={`header-who ${compact ? "compact" : ""}`}>
      <p className="t-h-s">Namaste, {user.name}</p>
      {!compact && <p className="t-label-s c-muted">{stageMeta[stage].label}</p>}
    </div>
  );
}

function SessionChip() {
  const { session } = useApp();
  return (
    <span className={`session-pill ${session === "open" ? "live" : ""}`}>
      {session === "open" ? (
        <span className="live-dot" />
      ) : (
        <span className="live-dot off" />
      )}
      {session === "open" ? "Market open" : "Closed · 3:00 PM"}
    </span>
  );
}

function AlertButton() {
  const { go } = useApp();
  const unread = alerts.length > 0;
  return (
    <button
      className={`icon-btn header-icon ${unread ? "has-dot" : ""}`}
      onClick={() => go("alerts")}
      aria-label="Alerts"
    >
      <Icon name="bell" size={19} />
    </button>
  );
}

function GlobalHeader() {
  const { go, openSheet, route } = useApp();
  return (
    <div className="global-header">
      <button
        className="icon-btn header-icon"
        onClick={() => openSheet({ kind: "navigation" })}
        aria-label="Open menu"
      >
        <Icon name="menu" size={22} />
      </button>
      {route === "market" ? (
        <div className="header-who compact">
          <p className="t-h-s">Market</p>
        </div>
      ) : route === "ai" ? (
        <div className="header-who compact">
          <p className="t-h-s">Tulkey</p>
        </div>
      ) : route === "discover" ? (
        <div className="header-who compact">
          <p className="t-h-s">Explore</p>
        </div>
      ) : route === "portfolio" ? (
        <div className="header-who compact">
          <p className="t-h-s">Portfolio</p>
        </div>
      ) : (
        <Identity compact />
      )}
      <button
        type="button"
        className="icon-btn header-icon"
        onClick={() => go("search")}
        aria-label="Search"
      >
        <Icon name="search" size={20} />
      </button>
      <AlertButton />
      <AvatarButton />
    </div>
  );
}

export function MobileChrome({ children, showTabs }: { children: ReactNode; showTabs: boolean }) {
  const { go, route } = useApp();
  const current = activeTab(route);
  const showGlobal = showTabs && tabRoots.includes(route);
  return (
    <>
      <StatusBar />
      {showGlobal && <GlobalHeader />}
      <div className="app-scroll">{children}</div>
      {showTabs && (
        <nav className="tab-bar">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tab ${current === t.id ? "on" : ""}`}
              aria-current={current === t.id ? "page" : undefined}
              onClick={() => go(t.id)}
            >
              <Icon name={t.icon} size={22} />
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </>
  );
}

const rail: { id: Route; label: string; icon: "home" | "market" | "discover" | "wallet" | "tulkey" }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "market", label: "Market", icon: "market" },
  { id: "ai", label: "Tulkey AI", icon: "tulkey" },
  { id: "portfolio", label: "Portfolio", icon: "wallet" },
  { id: "discover", label: "Explore", icon: "discover" },
];

export function DesktopChrome({
  children,
  showNav,
}: {
  children: ReactNode;
  showNav: boolean;
}) {
  const { go, route, plan, openSheet } = useApp();
  const current = activeTab(route);
  const searching = route === "search";

  useEffect(() => {
    if (!showNav) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      event.preventDefault();
      go("search");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, showNav]);

  if (!showNav) {
    return <div className="app-scroll">{children}</div>;
  }
  return (
    <>
      <aside className="rail">
        <div className="brand-row">
          <div className="brand-mark">M</div>
          <strong className="t-h-m">MoneyMitra</strong>
        </div>
        <nav className="rail-nav">
          {rail.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`rail-item ${current === t.id ? "on" : ""}`}
              aria-current={current === t.id ? "page" : undefined}
              onClick={() => go(t.id)}
            >
              <Icon name={t.icon} size={20} />
              {t.label}
            </button>
          ))}
        </nav>
        <p className="rail-note">Tulkey explains the words and the site. It never picks a stock.</p>
        <button type="button" className="plan-card" onClick={() => openSheet({ kind: "plans" })}>
          <p className="t-label-l">{plan === "free" ? "Free plan" : `${planMeta[plan].label} plan`}</p>
          <p className="t-body-xs muted">
            {plan === "free"
              ? "Screener, alerts and compare come with Pro."
              : planMeta[plan].renew}
          </p>
        </button>
      </aside>
      <div className="web-main">
        <header className="top-bar">
          <Identity />
          {!searching ? (
            <SearchField
              placeholder="Search a company, a broker code, an IPO or a term"
              onFocus={() => go("search")}
              shortcut
            />
          ) : (
            <p className="top-bar-page">Search</p>
          )}
          <div className="top-bar-actions">
            <SessionChip />
            <AlertButton />
            <AvatarButton />
          </div>
        </header>
        <div className="web-body">
          <div className="app-scroll">{children}</div>
        </div>
      </div>
    </>
  );
}
