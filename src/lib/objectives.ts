import type { IconName } from "../ds/Icon";
import type { PersonaId, Route, Stage } from "./types";
import { getPersona } from "./personas";
import { titleObjective } from "./stage";

export type ObjectiveKind = "learn" | "feature" | "overview";
export type DoAction = "courses" | "market" | "book" | "watch" | "alerts";

export type Objective = {
  id: string;
  n: number;
  kind: ObjectiveKind;
  level: string;
  duration: string;
  title: string;
  cardSub: string;
  tulkeyLine: string;
  /** Two short lines. The video carries the lesson; this is the recap. */
  points: string[];
  videoLabel?: string;
  /** Lessons send you to the page where the lesson is visible. */
  lessonCta?: { line: string; ctaLabel: string; route: Route };
  /** Feature sittings send you into the product and finish on the action there. */
  feature?: {
    route: Route;
    ctaLabel: string;
    doneWhen: string;
  };
  /** The closing sitting: the rest of the app, named once. Nothing to set up. */
  overview?: { id: string; icon: IconName; title: string; blurb: string; route: Route }[];
  doAction?: DoAction;
};

/**
 * Seven sittings: watch the video, find the courses, walk the market, then set
 * up the three things that are yours — book, list, alerts. The last one just
 * names what is left, so the path ends on knowing rather than on a chore.
 */
export const curriculum: Objective[] = [
  {
    id: "share",
    n: 1,
    kind: "learn",
    level: "The market",
    duration: "60s",
    title: "How the share market works",
    cardSub: "Watch this first. Nothing to buy.",
    tulkeyLine: "Sixty seconds, then you’ll know what NEPSE is.",
    points: [
      "A share is a slice of a company. Kitta is the unit.",
      "The index is many companies together — not a thing you buy.",
    ],
    videoLabel: "What the share market is",
  },
  {
    id: "courses",
    n: 2,
    kind: "feature",
    level: "Learn",
    duration: "Your move",
    title: "Courses",
    cardSub: "The long version, when a minute isn’t enough.",
    tulkeyLine: "The video was sixty seconds. A course is the whole thing.",
    points: [
      "Short lectures — IPOs, book close, reading a company.",
      "Yours to watch at your pace. Never a stock tip.",
    ],
    doAction: "courses",
    feature: {
      route: "learn",
      ctaLabel: "Open Courses",
      doneWhen: "Done when you open Courses.",
    },
  },
  {
    id: "market",
    n: 3,
    kind: "feature",
    level: "MoneyMitra",
    duration: "Your move",
    title: "Market",
    cardSub: "The day’s board — index, movers, floor sheet.",
    tulkeyLine: "The whole session, on one page.",
    points: [
      "Index, movers, sectors and the floor sheet.",
      "Tap any name to see how a company reads.",
      "A record of the session. Never an order.",
    ],
    doAction: "market",
    feature: {
      route: "market",
      ctaLabel: "Open Market",
      doneWhen: "Done when you open the Market page.",
    },
  },
  {
    id: "book",
    n: 4,
    kind: "feature",
    level: "MoneyMitra",
    duration: "Your move",
    title: "Portfolio",
    cardSub: "Your own book of the kitta you hold.",
    tulkeyLine: "Add what you already hold. Nothing gets bought.",
    points: [
      "Kitta you already own, with cost and date.",
      "Paste a contract note or type it in.",
    ],
    doAction: "book",
    feature: {
      route: "portfolio",
      ctaLabel: "Open portfolio",
      doneWhen: "Done when a holding is saved.",
    },
  },
  {
    id: "watch",
    n: 5,
    kind: "feature",
    level: "MoneyMitra",
    duration: "Your move",
    title: "Watchlist",
    cardSub: "Names you follow, without buying them.",
    tulkeyLine: "Watching is not buying.",
    points: [
      "Names you want to see again, in one place.",
      "Keep more than one list — banks, hydro, weekend reads.",
    ],
    doAction: "watch",
    feature: {
      route: "watchlist",
      ctaLabel: "Open watchlist",
      doneWhen: "Done when a name is on your list.",
    },
  },
  {
    id: "alerts",
    n: 6,
    kind: "feature",
    level: "MoneyMitra",
    duration: "Your move",
    title: "Alerts",
    cardSub: "A nudge when a price crosses.",
    tulkeyLine: "An alert reminds you. It never places the order.",
    points: [
      "Pick a name and a price. We tell you when it crosses.",
      "Comes to the app or your inbox, and expires on the date you set.",
    ],
    doAction: "alerts",
    feature: {
      route: "alerts",
      ctaLabel: "Open alerts",
      doneWhen: "Done when an alert is saved.",
    },
  },
  {
    id: "rest",
    n: 7,
    kind: "overview",
    level: "MoneyMitra",
    duration: "1 min",
    title: "The rest of MoneyMitra",
    cardSub: "Mitra AI, brokers, baskets, personalised analysis.",
    tulkeyLine: "Four more places. Nothing to set up — just so you know they’re there.",
    points: [],
    overview: [
      {
        id: "ai",
        icon: "tulkey",
        title: "Mitra AI",
        blurb: "Ask about a word, a date, or which site does the work. Never a pick.",
        route: "ai",
      },
      {
        id: "brokers",
        icon: "handshake",
        title: "Brokers",
        blurb: "Who traded today, and how TMS fits in. Orders are placed there, not here.",
        route: "brokers",
      },
      {
        id: "baskets",
        icon: "basket",
        title: "Baskets",
        blurb: "Several names in one view — banks, hydro, the fallers.",
        route: "baskets",
      },
      {
        id: "analysis",
        icon: "pie",
        title: "Personalised analysis",
        blurb: "Your own book read back to you — mix, income, what is concentrated.",
        route: "portfolio",
      },
    ],
  },
];

export const courseCta = {
  title: "Want the long version?",
  body: "Check out our range of courses — IPOs to book close.",
  label: "Browse courses",
};

export type Knowledge = "nothing" | "terms" | "demat" | "tms" | "regular";

export const knowledgeOptions: {
  id: Knowledge;
  title: string;
  sub: string;
  icon: "market" | "learn" | "cal" | "wallet" | "compare";
}[] = [
  { id: "nothing", title: "I don’t know anything yet", sub: "Start from what a share is.", icon: "market" },
  { id: "terms", title: "I know some terms", sub: "Share, IPO, NEPSE — not much more.", icon: "learn" },
  { id: "demat", title: "I have Demat / MeroShare", sub: "I can apply for IPOs. I may not trade yet.", icon: "cal" },
  { id: "tms", title: "I have TMS — I’ve placed orders", sub: "Secondary market, at a broker.", icon: "wallet" },
  { id: "regular", title: "I trade or manage a portfolio regularly", sub: "I already live in this market.", icon: "compare" },
];

export type PathPick = {
  id: string;
  title: string;
  sub: string;
  objectiveId: string | null;
  stage: Stage;
};

export function pathOptions(q1: Knowledge): PathPick[] {
  switch (q1) {
    case "nothing":
      return [
        { id: "start", title: "From the very first thing", sub: "What the share market is, in sixty seconds.", objectiveId: "share", stage: "explorer" },
        { id: "courses", title: "I know what a share is", sub: "Start at the courses instead.", objectiveId: "courses", stage: "explorer" },
      ];
    case "terms":
      return [
        { id: "courses", title: "Take me to the courses", sub: "The long version, then the app.", objectiveId: "courses", stage: "explorer" },
        { id: "review", title: "From the very beginning anyway", sub: "How the share market works, first.", objectiveId: "share", stage: "explorer" },
      ];
    case "demat":
      return [
        { id: "market", title: "Show me around the app", sub: "Market, portfolio, watchlist, alerts.", objectiveId: "market", stage: "primary" },
        { id: "review", title: "From the very beginning anyway", sub: "Start at the share market.", objectiveId: "share", stage: "explorer" },
      ];
    case "tms":
      return [
        { id: "book", title: "Add what you already hold", sub: "Then a watchlist and alerts.", objectiveId: "book", stage: "secondary" },
        { id: "watch", title: "Start with a watchlist", sub: "Names first, book after.", objectiveId: "watch", stage: "secondary" },
      ];
    case "regular":
      return [
        { id: "book", title: "Set the book up first", sub: "Skip the video. Portfolio, then the rest.", objectiveId: "book", stage: "active" },
        { id: "alerts", title: "Just the extras", sub: "Alerts, then what else is here.", objectiveId: "alerts", stage: "active" },
      ];
  }
}

export function getObjective(id: string | null | undefined): Objective | null {
  if (!id) return null;
  return curriculum.find((o) => o.id === id) ?? null;
}

/** Current sitting on Home. Never empty unless the path is finished — hide is a separate flag. */
export function homeObjectiveId(
  currentId: string | null,
  stage: Stage,
  personaId: PersonaId | null,
): string {
  if (getObjective(currentId)) return currentId as string;
  const fromPersona = getPersona(personaId)?.objectiveId;
  if (fromPersona && getObjective(fromPersona)) return fromPersona;
  return titleObjective[stage];
}

export function nextOnPath(id: string, done: string[] = []): Objective | null {
  const i = curriculum.findIndex((o) => o.id === id);
  if (i < 0) return null;
  return curriculum.slice(i + 1).find((o) => !done.includes(o.id)) ?? null;
}

export function getObjectiveByTitle(title: string): Objective | null {
  const t = title.trim().toLowerCase();
  if (!t) return null;
  const exact = curriculum.find((o) => o.title.toLowerCase() === t);
  if (exact) return exact;
  if (t.includes("course") || t.includes("lesson") || t.includes("learn")) return getObjective("courses");
  if (t.includes("alert")) return getObjective("alerts");
  if (t.includes("watch")) return getObjective("watch");
  if (t.includes("holding") || t.includes("portfolio")) return getObjective("book");
  if (t.includes("basket") || t.includes("broker") || t.includes("tms")) return getObjective("rest");
  if (t.includes("nepse") || t.includes("share") || t.includes("kitta")) return getObjective("share");
  if (t.includes("market")) return getObjective("market");
  return null;
}

export function pathProgress(currentId: string | null, finished = false, doneIds: string[] = []) {
  const total = curriculum.length;
  if (finished) {
    return {
      done: curriculum,
      now: null as Objective | null,
      later: [] as Objective[],
      learned: total,
      total,
    };
  }
  const now = getObjective(currentId);
  const isDone = (o: Objective) => doneIds.includes(o.id) || (!!now && o.n < now.n);
  const done = curriculum.filter((o) => o.id !== now?.id && isDone(o));
  if (!now) {
    return { done, now: null, later: curriculum.filter((o) => !isDone(o)), learned: done.length, total };
  }
  return {
    done,
    now,
    later: curriculum.filter((o) => o.n > now.n && !isDone(o)),
    learned: done.length,
    total,
  };
}

export const studioObjectives: { id: string; label: string }[] = curriculum.map((o) => ({
  id: o.id,
  label: `${o.n} · ${o.title}`,
}));
