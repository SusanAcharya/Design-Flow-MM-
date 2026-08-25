import { useApp } from "../lib/state";
import { Prototype } from "../prototype/Prototype";
import { studioObjectives } from "../lib/objectives";
import type { Circuit, Route, Stage, UiFont } from "../lib/types";

const screens: { id: Route; label: string }[] = [
  { id: "onboarding", label: "Onboarding" },
  { id: "home", label: "Home" },
  { id: "ai", label: "Tulkey AI" },
  { id: "objective", label: "Objective" },
  { id: "market", label: "Market" },
  { id: "stock", label: "Stock detail" },
  { id: "portfolio", label: "Portfolio" },
  { id: "discover", label: "Explore" },
  { id: "search", label: "Search" },
  { id: "learn", label: "Learn" },
  { id: "ipo", label: "IPO" },
  { id: "more", label: "More / Tools" },
  { id: "alerts", label: "Alerts" },
];

const stages: { id: Stage; label: string }[] = [
  { id: "base", label: "Base" },
  { id: "explorer", label: "Newbie" },
  { id: "primary", label: "IPO applicant" },
  { id: "secondary", label: "New trader" },
  { id: "value", label: "Holder" },
  { id: "active", label: "Veteran" },
];

const circuits: { id: Circuit; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "index5", label: "Index 5%" },
  { id: "index8", label: "Index 8%" },
  { id: "stock15", label: "Stock 15%" },
];

const fonts: { id: UiFont; label: string }[] = [
  { id: "satoshi", label: "Satoshi" },
  { id: "jakarta", label: "Plus Jakarta Sans" },
  { id: "geist", label: "Geist Mono" },
  { id: "subjectivity", label: "Subjectivity" },
  { id: "chillax", label: "Chillax" },
  { id: "america", label: "GT America" },
];

export function Studio() {
  const {
    theme,
    setTheme,
    uiFont,
    setUiFont,
    viewport,
    setViewport,
    stage,
    setStage,
    objectiveId,
    setObjectiveId,
    session,
    setSession,
    circuit,
    setCircuit,
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
          Font
          <select value={uiFont} onChange={(e) => setUiFont(e.target.value as UiFont)}>
            {fonts.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
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
          Objective
          <select
            value={objectiveId ?? ""}
            onChange={(e) => setObjectiveId(e.target.value || null)}
          >
            {studioObjectives.map((o) => (
              <option key={o.id || "none"} value={o.id}>{o.label}</option>
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
          Circuit
          <select value={circuit} onChange={(e) => setCircuit(e.target.value as Circuit)}>
            {circuits.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
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
