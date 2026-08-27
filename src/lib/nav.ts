import type { IconName } from "../ds/Icon";
import type { Route } from "./types";

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
}[] = [
  { id: "watchlist", label: "Watchlist", icon: "star", route: "watchlist" },
  { id: "broker-analysis", label: "Broker analysis", icon: "building", route: "brokers", brokerDesk: "analysis" },
  { id: "baskets", label: "Baskets", icon: "pie", route: "baskets" },
  { id: "objectives", label: "Objectives", icon: "clipboard", route: "objectives" },
  { id: "courses", label: "Stock courses", icon: "learn", route: "learn" },
  { id: "alerts", label: "Alerts", icon: "bell", route: "alerts" },
  { id: "ipo", label: "IPO & allotment", icon: "doc", route: "ipo" },
  { id: "subscription", label: "Subscription", icon: "coin", route: "subscription" },
  { id: "tools", label: "All tools", icon: "sliders", route: "more" },
];
