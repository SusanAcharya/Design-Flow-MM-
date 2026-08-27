import type { PersonaId, Route, Stage } from "./types";
import { getPersona } from "./personas";
import { titleObjective } from "./stage";

export type ObjectiveKind = "learn" | "feature";
export type DoAction = "book" | "watch" | "basket" | "broker" | "market";

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
  doAction?: DoAction;
};

/** Watch first, then use the product. Feature sittings tick off on the action, not the visit. */
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
    lessonCta: { line: "Check out the Market page", ctaLabel: "Open Market", route: "market" },
  },
  {
    id: "terms",
    n: 2,
    kind: "learn",
    level: "The words",
    duration: "90s",
    title: "The words you’ll keep seeing",
    cardSub: "Kitta, LTP, book close, circuit.",
    tulkeyLine: "Four words that show up on every screen.",
    points: [
      "LTP is the last print. Book close is the record date.",
      "A circuit caps how far a share moves in a day.",
    ],
    videoLabel: "Kitta, LTP, book close, circuit",
    lessonCta: { line: "Check out a company page", ctaLabel: "Open NABIL", route: "stock" },
  },
  {
    id: "market",
    n: 3,
    kind: "feature",
    level: "MoneyMitra",
    duration: "Your move",
    title: "Market",
    cardSub: "The day’s board — index, movers, floor sheet.",
    tulkeyLine: "Open one company and see how a name reads.",
    points: [
      "Index, movers, sectors and the floor sheet.",
      "A record of the session. Never an order.",
    ],
    doAction: "market",
    feature: {
      route: "market",
      ctaLabel: "Open Market",
      doneWhen: "Done when you open a company.",
    },
  },
  {
    id: "watch",
    n: 4,
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
    id: "book",
    n: 5,
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
    id: "baskets",
    n: 6,
    kind: "feature",
    level: "MoneyMitra",
    duration: "Your move",
    title: "Baskets",
    cardSub: "Several names in one view.",
    tulkeyLine: "A way of looking at a group. Not a product.",
    points: [
      "Companies grouped by theme — banks, hydro, the fallers.",
      "Same prints, same dates. Opening one buys nothing.",
    ],
    doAction: "basket",
    feature: {
      route: "baskets",
      ctaLabel: "Open baskets",
      doneWhen: "Done when you open a basket.",
    },
  },
  {
    id: "brokers",
    n: 7,
    kind: "feature",
    level: "MoneyMitra",
    duration: "Your move",
    title: "Brokers",
    cardSub: "Who traded today, and how TMS fits in.",
    tulkeyLine: "Buying still happens at a licensed broker.",
    points: [
      "Executed turnover and the buy/sell split.",
      "Orders are placed in TMS, never here.",
    ],
    doAction: "broker",
    feature: {
      route: "brokers",
      ctaLabel: "Open brokers",
      doneWhen: "Done when you open a broker.",
    },
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
        { id: "start", title: "From the very first thing", sub: "The share market, then the words.", objectiveId: "share", stage: "explorer" },
        { id: "skip-kitta", title: "I know what a share is", sub: "Start at the terms you’ll keep seeing.", objectiveId: "terms", stage: "explorer" },
      ];
    case "terms":
      return [
        { id: "words", title: "Start at the terms", sub: "Kitta, book close, circuit — then the app.", objectiveId: "terms", stage: "explorer" },
        { id: "review", title: "From the very beginning anyway", sub: "How the share market works, first.", objectiveId: "share", stage: "explorer" },
      ];
    case "demat":
      return [
        { id: "market", title: "Show me around the app", sub: "Market, watchlist, portfolio, baskets.", objectiveId: "market", stage: "primary" },
        { id: "review", title: "From the very beginning anyway", sub: "Start at the share market.", objectiveId: "share", stage: "explorer" },
      ];
    case "tms":
      return [
        { id: "book", title: "Add what you already hold", sub: "Then baskets and brokers.", objectiveId: "book", stage: "secondary" },
        { id: "watch", title: "Start with a watchlist", sub: "Names first, book after.", objectiveId: "watch", stage: "secondary" },
      ];
    case "regular":
      return [
        { id: "book", title: "Set the book up first", sub: "Skip the lessons. Portfolio, then the rest.", objectiveId: "book", stage: "active" },
        { id: "baskets", title: "Just the extras", sub: "Baskets and broker flow.", objectiveId: "baskets", stage: "active" },
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
  if (t.includes("basket")) return getObjective("baskets");
  if (t.includes("broker") || t.includes("tms")) return getObjective("brokers");
  if (t.includes("watch")) return getObjective("watch");
  if (t.includes("holding") || t.includes("portfolio")) return getObjective("book");
  if (t.includes("p/e") || t.includes("dividend") || t.includes("book close")) return getObjective("terms");
  if (t.includes("kitta") || t.includes("circuit") || t.includes("ltp")) return getObjective("terms");
  if (t.includes("nepse") || t.includes("share")) return getObjective("share");
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
