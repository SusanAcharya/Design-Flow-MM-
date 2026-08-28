export type Theme = "light" | "dark";
/** The app reads in Nepali or English. Numbers and tickers stay as they are. */
export type Lang = "en" | "ne";
export type UiFont = "plex" | "inter" | "satoshi" | "jakarta" | "geist" | "subjectivity" | "chillax" | "america";
export type Viewport = "mobile" | "web";
export type Stage = "base" | "explorer" | "primary" | "secondary" | "value" | "active";
export type Circuit = "off" | "index5" | "index8" | "stock15";
/** How the screen behaves while data is on its way — or does not arrive. */
export type DataState = "ready" | "loading" | "refreshing" | "error";
export type HoldingMode = "add" | "detail";
export type PersonaId = "maya" | "prakash" | "sita" | "anil";
export type Route =
  | "onboarding"
  | "signin"
  | "signup"
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
  | "objectives"
  | "holding"
  | "alerts"
  | "notifications"
  | "subscription"
  | "happening"
  | "watchlist"
  | "brokers"
  | "baskets"
  | "market-desk"
  | "profile";

export type MarketDesk =
  | "summary"
  | "sectors"
  | "week-change"
  | "live"
  | "price"
  | "movers"
  | "gain-loss"
  | "nepse-data"
  | "indices"
  | "depth";

export type BrokerDesk = "hub" | "analysis" | "detail";

export type Plan = "free" | "plus" | "pro";
/** Why a member landed on Subscription — a consultation opens differently. */
export type SubIntent = "consult";
export type PlanCycle = "monthly" | "annual";
export type MarketSession = "open" | "closed";
export type MarketTab = "Overview" | "Movers" | "Sectors" | "Floor sheet" | "Events";
export type StockTab = "Overview" | "Financials" | "Analysis" | "Floor sheet" | "Events";
export type PortfolioTab = "Overview" | "Holdings" | "Allocation" | "Activity" | "Income" | "Analytics";

export type Sheet =
  | { kind: "profile" }
  | { kind: "navigation" }
  | { kind: "quick"; title: string; body: string; note?: string }
  | { kind: "metric"; id: string }
  | { kind: "circuit-rules" }
  | { kind: "order"; symbol: string }
  | { kind: "stock-tools"; symbol: string }
  | { kind: "correct" }
  | { kind: "portfolio-switch" }
  | { kind: "portfolio-menu" }
  | { kind: "portfolio-edit" }
  | { kind: "portfolio-create" }
  | { kind: "portfolio-delete" }
  | { kind: "portfolio-import" }
  | { kind: "portfolio-import-steps"; source: "file" | "tms"; fileName?: string }
  | { kind: "compare" }
  | { kind: "plans" }
  | { kind: "password" }
  | { kind: "help" }
  | { kind: "referral" }
  | { kind: "avatar" }
  | { kind: "language" }
  | { kind: "watch-add"; listId: string }
  | { kind: "watch-name"; listId?: string }
  | {
      kind: "actions";
      title: string;
      note?: string;
      actions: {
        label: string;
        sub?: string;
        icon?: string;
        danger?: boolean;
        onSelect: () => void;
      }[];
    }
  | {
      kind: "confirm";
      title: string;
      body: string;
      confirmLabel: string;
      cancelLabel?: string;
      danger?: boolean;
      onConfirm: () => void;
    };

export type Toast = {
  message: string;
  undo?: boolean;
};

export type OnboardingResult = {
  stage: Stage;
  objectiveId: string | null;
  personaId: PersonaId;
};
