import type { Route } from "./types";

/* Query params so a single screen can be opened straight from a link — used for
   design review and screenshots: ?route=market&viewport=web&theme=light&data=loading */

const query = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);

export const allRoutes: Route[] = [
  "onboarding",
  "start",
  "home",
  "market",
  "discover",
  "portfolio",
  "ai",
  "learn",
  "more",
  "search",
  "stock",
  "ipo",
  "lesson",
  "objective",
  "objectives",
  "holding",
  "alerts",
  "notifications",
  "subscription",
  "happening",
  "watchlist",
  "brokers",
  "baskets",
  "market-desk",
  "profile",
];

export function param<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  const value = query.get(key) as T | null;
  return value && (allowed as readonly string[]).includes(value) ? value : fallback;
}

/** A link that names a route skips onboarding and lands on that screen. */
export const linkedRoute = query.has("route") ? param("route", allRoutes, "home") : null;

/** Free-form param for ids the caller validates itself (a basket, a broker). */
export function rawParam(key: string) {
  return query.get(key);
}
