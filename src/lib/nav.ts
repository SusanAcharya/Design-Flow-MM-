import type { Route } from "./types";

const tabIds: Route[] = ["home", "market", "ai", "portfolio", "discover"];

export function activeTab(route: Route): Route {
  if (route === "stock" || route === "ipo") return "market";
  if (route === "holding") return "portfolio";
  if (route === "search" || route === "more") return "discover";
  if (route === "learn" || route === "lesson" || route === "objective") return "ai";
  if (route === "alerts" || route === "watchlist" || route === "brokers" || route === "baskets" || route === "objectives") return "home";
  if (tabIds.includes(route)) return route;
  return "home";
}
