import type { IconName } from "../ds/Icon";
import type { MarketTab, Route } from "./types";

const tabIds: Route[] = ["home", "market", "ai", "portfolio", "discover"];

/**
 * `origin` is the tab an objective was opened from, so a sitting reached from
 * Home keeps Home lit instead of jumping the highlight to Mitra.
 */
export function activeTab(route: Route, origin?: Route): Route {
  if (route === "objective" || route === "objectives") return origin ?? "home";
  if (route === "stock" || route === "ipo" || route === "market-desk") return "market";
  if (route === "holding") return "portfolio";
  if (route === "search" || route === "more") return "discover";
  if (route === "learn" || route === "lesson") return "ai";
  if (route === "alerts" || route === "notifications" || route === "watchlist" || route === "brokers" || route === "baskets" || route === "profile" || route === "subscription" || route === "happening") return "home";
  if (tabIds.includes(route)) return route;
  return "home";
}

/** The named places, shown in the mobile drawer and the web rail alike. */
export const jumpDestinations: {
  id: string;
  label: string;
  icon: IconName;
  route: Route;
  brokerDesk?: "hub" | "analysis";
  marketTab?: MarketTab;
}[] = [
  { id: "alerts", label: "Alerts", icon: "bell", route: "alerts" },
  { id: "baskets", label: "Baskets", icon: "basket", route: "baskets" },
  { id: "watchlist", label: "Watchlist", icon: "bookmark", route: "watchlist" },
  { id: "broker-analysis", label: "Broker analysis", icon: "handshake", route: "brokers", brokerDesk: "analysis" },
  { id: "news", label: "News", icon: "news", route: "market", marketTab: "Events" },
  { id: "courses", label: "Courses", icon: "learn", route: "learn" },
  { id: "objectives", label: "Objectives", icon: "clipboard", route: "objectives" },
  { id: "subscription", label: "Subscription", icon: "coin", route: "subscription" },
  { id: "tools", label: "View all tools", icon: "sliders", route: "more" },
];

/** The quiet half of the drawer: who we are, what we promise, and the way out.
    None of these are screens — each opens a short sheet. */
export const drawerSupport: { id: string; label: string; icon: IconName; body: string; note?: string }[] = [
  {
    id: "contact",
    label: "Contact us",
    icon: "mail",
    body: "Write to hello@moneymitra.com or call 01-4000000, Sunday to Friday, 10am to 5pm. Tell us the screen you were on and we can answer faster.",
    note: "A demo. No message is sent.",
  },
  {
    id: "about",
    label: "About us",
    icon: "info",
    body: "MoneyMitra explains Nepal’s market in plain words — the tape, your book, and what the numbers actually mean. We are not a broker. We never place an order and we never sell a stock pick.",
  },
  {
    id: "terms",
    label: "Terms and conditions",
    icon: "doc",
    body: "The short of it: everything here is information, not advice. You decide what to buy or sell and your broker executes it. Figures come from NEPSE and company filings, and can arrive late or be restated.",
    note: "Placeholder text in this demo, not the signed terms.",
  },
  {
    id: "privacy",
    label: "Privacy policy",
    icon: "shield",
    body: "We keep your account details, your book and the names you follow. We do not sell them, and we never ask for your broker or MeroShare password.",
    note: "This demo stores nothing — a restart clears it all.",
  },
];
