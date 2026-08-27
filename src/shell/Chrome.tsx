import { useEffect, type ReactNode } from "react";
import { Icon } from "../ds/Icon";
import { UserAvatar } from "../ds/UserAvatar";
import { SearchField, StatusBar } from "../ds/primitives";
import { LoadBar } from "../ds/Loading";
import { nepse, notifications, user } from "../lib/data";
import { planMeta } from "../lib/explore";
import { activeTab, jumpDestinations } from "../lib/nav";
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
  const { go } = useApp();
  return (
    <button
      type="button"
      className="avatar-btn"
      aria-label="Profile and account"
      onClick={() => go("profile")}
    >
      <UserAvatar size={40} />
    </button>
  );
}

function Identity({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`header-who ${compact ? "compact" : ""}`}>
      <p className="t-h-s">Namaste, {user.name}</p>
      {!compact && <p className="t-label-s c-muted">{nepse.date}</p>}
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
  const unread = notifications.some((item) => !item.read);
  return (
    <button
      className={`icon-btn header-icon ${unread ? "has-dot" : ""}`}
      onClick={() => go("notifications")}
      aria-label="Notifications"
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
  const { go, route, objectiveOrigin } = useApp();
  const current = activeTab(route, objectiveOrigin);
  const showGlobal = showTabs && tabRoots.includes(route);
  return (
    <>
      <StatusBar />
      {showGlobal && <GlobalHeader />}
      <LoadBar />
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
  const { go, route, plan, objectiveOrigin } = useApp();
  const current = activeTab(route, objectiveOrigin);
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

        {/* The same named places the mobile drawer carries. */}
        <div className="rail-jump">
          <p className="overline rail-label">Jump to</p>
          {jumpDestinations.map((item) => (
            <button
              key={item.id}
              type="button"
              className="rail-jump-item"
              onClick={() => go(item.route, item.brokerDesk ? { brokerDesk: item.brokerDesk } : undefined)}
            >
              <span className="rail-jump-ico" aria-hidden>
                <Icon name={item.icon} size={15} />
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <button type="button" className={`rail-account drawer-card plan-${plan}`} onClick={() => go("profile")}>
          <UserAvatar size={36} />
          <span className="drawer-card-id">
            <span className="drawer-card-name">
              <strong>{user.name}</strong>
              <em className={`tier-pill tier-${plan}`}>{planMeta[plan].label}</em>
            </span>
            <small>
              {plan === "free" ? "Screener and alerts come with Plus" : planMeta[plan].renew}
            </small>
          </span>
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
        <LoadBar />
        <div className="web-body">
          <div className="app-scroll">{children}</div>
        </div>
      </div>
    </>
  );
}
