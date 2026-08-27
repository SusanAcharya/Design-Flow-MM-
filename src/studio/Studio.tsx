import { useApp } from "../lib/state";
import { Prototype } from "../prototype/Prototype";
import type { DataState, Plan, Route, Stage } from "../lib/types";

const screens: { id: Route; label: string }[] = [
  { id: "onboarding", label: "Onboarding" },
  { id: "signin", label: "Sign in" },
  { id: "signup", label: "Sign up" },
  { id: "home", label: "Home" },
  { id: "objectives", label: "Objectives" },
  { id: "ai", label: "Mitra AI" },
  { id: "objective", label: "Objective" },
  { id: "market", label: "Market" },
  { id: "market-desk", label: "Market tools" },
  { id: "stock", label: "Stock detail" },
  { id: "portfolio", label: "Portfolio" },
  { id: "watchlist", label: "Watchlist" },
  { id: "brokers", label: "Brokers" },
  { id: "baskets", label: "Baskets" },
  { id: "discover", label: "Explore" },
  { id: "search", label: "Search" },
  { id: "learn", label: "Learn" },
  { id: "ipo", label: "IPO" },
  { id: "more", label: "More / Tools" },
  { id: "profile", label: "Profile" },
  { id: "alerts", label: "Alerts" },
  { id: "notifications", label: "Notifications" },
  { id: "subscription", label: "Subscription" },
  { id: "happening", label: "What\u2019s happening" },
];

const stages: { id: Stage; label: string }[] = [
  { id: "base", label: "Base" },
  { id: "explorer", label: "Newbie" },
  { id: "primary", label: "IPO applicant" },
  { id: "secondary", label: "New trader" },
  { id: "value", label: "Holder" },
  { id: "active", label: "Veteran" },
];

const dataStates: { id: DataState; label: string }[] = [
  { id: "ready", label: "Ready" },
  { id: "loading", label: "Loading" },
  { id: "refreshing", label: "Refreshing" },
  { id: "error", label: "Failed" },
];

export function Studio() {
  const {
    theme,
    setTheme,
    viewport,
    setViewport,
    stage,
    setStage,
    session,
    setSession,
    plan,
    setPlan,
    dataState,
    setDataState,
    hasPortfolio,
    setHasPortfolio,
    hasWatchlist,
    setHasWatchlist,
    route,
    go,
    resetDemo,
  } = useApp();

  return (
    <div className="studio">
      <header className="studio-bar">
        <div className="studio-brand">
          <div className="studio-mark">DF</div>
          <div>
            <strong>Designer Flow</strong>
            <span>Clickable demo · Design System v1.0</span>
          </div>
        </div>

        <label>
          Viewport
          <div className="seg">
            <button className={viewport === "mobile" ? "on" : ""} onClick={() => setViewport("mobile")}>
              Mobile 390
            </button>
            <button className={viewport === "web" ? "on" : ""} onClick={() => setViewport("web")}>
              Web 1440
            </button>
          </div>
        </label>

        <label>
          Theme
          <div className="seg">
            <button className={theme === "light" ? "on" : ""} onClick={() => setTheme("light")}>
              Light
            </button>
            <button className={theme === "dark" ? "on" : ""} onClick={() => setTheme("dark")}>
              Dark
            </button>
          </div>
        </label>

        <label>
          Home stage
          <select value={stage} onChange={(e) => setStage(e.target.value as Stage)}>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>

        <label>
          Market
          <div className="seg">
            <button className={session === "closed" ? "on" : ""} onClick={() => setSession("closed")}>
              Closed
            </button>
            <button className={session === "open" ? "on" : ""} onClick={() => setSession("open")}>
              Open
            </button>
          </div>
        </label>

        <label>
          Plan
          <div className="seg">
            {(["free", "plus", "pro"] as Plan[]).map((id) => (
              <button key={id} className={plan === id ? "on" : ""} onClick={() => setPlan(id)}>
                {id === "free" ? "Free" : id === "plus" ? "Plus" : "Pro"}
              </button>
            ))}
          </div>
        </label>

        <label>
          Portfolio
          <div className="seg">
            <button className={hasPortfolio ? "on" : ""} onClick={() => setHasPortfolio(true)}>
              Added
            </button>
            <button className={!hasPortfolio ? "on" : ""} onClick={() => setHasPortfolio(false)}>
              None
            </button>
          </div>
        </label>

        <label>
          Watchlist
          <div className="seg">
            <button className={hasWatchlist ? "on" : ""} onClick={() => setHasWatchlist(true)}>
              Added
            </button>
            <button className={!hasWatchlist ? "on" : ""} onClick={() => setHasWatchlist(false)}>
              None
            </button>
          </div>
        </label>

        <label>
          Data
          <select value={dataState} onChange={(e) => setDataState(e.target.value as DataState)}>
            {dataStates.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </label>

        <label>
          Jump to
          <select value={screens.some((s) => s.id === route) ? route : "home"} onChange={(e) => go(e.target.value as Route)}>
            {screens.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>

        <span className="spacer" />
        <button className="ghost-studio" onClick={resetDemo}>Restart demo</button>
      </header>
      <div className="canvas">
        <Prototype />
      </div>
    </div>
  );
}
