import type { Stage } from "./types";

export const stageMeta: Record<
  Stage,
  { n: number; label: string; short: string; ring: string; blurb: string }
> = {
  base: {
    n: 0,
    label: "Base",
    short: "Base",
    ring: "var(--accent-base)",
    blurb: "Full Home stack: pulse, book, add-portfolio, holdings, objectives, alerts, bytes, movers, IPOs.",
  },
  explorer: {
    n: 1,
    label: "Newbie",
    short: "Newbie",
    ring: "var(--text-tertiary)",
    blurb: "Objectives, market gyan and news. No book to keep yet.",
  },
  primary: {
    n: 2,
    label: "IPO applicant",
    short: "IPO",
    ring: "var(--accent-base)",
    blurb: "Open issues, a pipeline to track, allotment when CDSC publishes it.",
  },
  secondary: {
    n: 3,
    label: "New trader",
    short: "Trader",
    ring: "var(--deco-saffron)",
    blurb: "Add what you hold, watch T+2, and keep a watchlist.",
  },
  value: {
    n: 4,
    label: "Holder",
    short: "Holder",
    ring: "var(--up-base)",
    blurb: "Your ledger, dividends and corporate actions.",
  },
  active: {
    n: 5,
    label: "Veteran",
    short: "Veteran",
    ring: "var(--up-base)",
    blurb: "Breadth, the floor sheet and alerts during the session.",
  },
};

export const stageOrder: Stage[] = ["explorer", "primary", "secondary", "value", "active"];

export const titleObjective: Record<Stage, string> = {
  base: "share",
  explorer: "share",
  primary: "courses",
  secondary: "book",
  value: "book",
  active: "book",
};

export const stageToast: Record<Stage, string> = {
  base: "Base Home — the full module stack.",
  explorer: "Newbie Home — objectives, gyan and news. Nothing to buy.",
  primary: "IPO applicant Home — openings and a pipeline to track.",
  secondary: "New trader Home — add holdings and watch T+2.",
  value: "Holder Home — your ledger, dividends and events.",
  active: "Veteran Home — breadth, alerts and the floor sheet.",
};

/** Newbie + IPO applicant keep Learn / News on Home. Later titles watch the tape. */
export function isLearningHome(stage: Stage) {
  return stage === "explorer" || stage === "primary";
}

export function isBaseHome(stage: Stage) {
  return stage === "base";
}

export function showsIpoTools(stage: Stage) {
  return stage === "primary" || stage === "secondary";
}

export function showsHoldings(stage: Stage) {
  return stage === "base" || stage === "secondary" || stage === "value" || stage === "active";
}

