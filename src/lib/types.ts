export type Theme = "light" | "dark";
export type UiFont = "satoshi" | "jakarta" | "geist" | "subjectivity" | "chillax" | "america";
export type Viewport = "mobile" | "web";
export type Stage = "base" | "explorer" | "primary" | "secondary" | "value" | "active";
export type Circuit = "off" | "index5" | "index8" | "stock15";
export type HoldingMode = "add" | "detail";
export type HomeFeed = "home" | "watchlist" | "brokers" | "baskets";
export type PersonaId = "maya" | "prakash" | "sita" | "anil";
export type Route =
  | "onboarding"
  | "start"
  | "home"
  | "market"
  | "discover"
  | "portfolio"
  | "ai"
  | "learn"
  | "more"
  | "search"
  | "stock"
  | "ipo"
  | "lesson"
  | "objective"
  | "holding"
  | "alerts";

export type Plan = "free" | "pro" | "guru";
export type PlanCycle = "monthly" | "annual";
export type MarketSession = "open" | "closed";
export type MarketTab = "Overview" | "Movers" | "Sectors" | "Floor sheet" | "Events";
export type StockTab = "Overview" | "Financials" | "Analysis" | "Floor sheet" | "Events";

export type Sheet =
  | { kind: "profile" }
  | { kind: "navigation" }
  | { kind: "quick"; title: string; body: string; note?: string }
  | { kind: "metric"; id: string }
  | { kind: "circuit-rules" }
  | { kind: "order"; symbol: string }
  | { kind: "stock-tools"; symbol: string }
  | { kind: "correct" }
  | { kind: "compare" }
  | { kind: "plans" };

export type Toast = {
  message: string;
  undo?: boolean;
};

export type OnboardingResult = {
  stage: Stage;
  objectiveId: string | null;
  personaId: PersonaId;
};
