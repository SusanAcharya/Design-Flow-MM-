import type { PersonaId, Stage } from "./types";
import { getPersona } from "./personas";
import { titleObjective } from "./stage";

export type ObjectiveKind = "learn" | "do";
export type DoAction = "book" | "alert" | "watch";

export type Objective = {
  id: string;
  n: number;
  kind: ObjectiveKind;
  level: string;
  duration: string;
  title: string;
  cardSub: string;
  tulkeyLine: string;
  know: string[];
  how: { step: string; platform: string }[];
  videoLabel: string;
  doAction?: DoAction;
  cta?: string;
};

/** Linear track. Learn first, then things you do in the app. */
export const curriculum: Objective[] = [
  {
    id: "share",
    n: 1,
    kind: "learn",
    level: "The market",
    duration: "60s",
    title: "Understanding the share market",
    cardSub: "What NEPSE is, and what a share actually is.",
    tulkeyLine: "We’ll start at the beginning. Nothing to buy.",
    know: [
      "NEPSE is Nepal’s stock exchange. The number on Home is an index of many companies together — not a company you can buy.",
      "A share is a slice of ownership in a listed company. Kitta is the unit. Price going up or down changes the value of that slice.",
      "MoneyMitra explains this. It never tells you which company to own, and it never places an order.",
    ],
    how: [
      { step: "Index, movers and breadth live on Market. They are a record, not a call.", platform: "MoneyMitra" },
      { step: "Buying or selling a listed company still happens in TMS at a licensed broker.", platform: "TMS · your broker" },
    ],
    videoLabel: "What the share market is",
  },
  {
    id: "terms",
    n: 2,
    kind: "learn",
    level: "The words",
    duration: "90s",
    title: "The terms you’ll keep seeing",
    cardSub: "Kitta, LTP, book close, circuit — in plain words.",
    tulkeyLine: "These words show up a lot. Here’s what they actually are.",
    know: [
      "Kitta is one unit of a share. IPO applications are usually counted in kitta, often with a 10-kitta minimum.",
      "LTP is the last traded print, with a time. It is not a live promise and not a recommendation.",
      "Book close is the company’s record date for a dividend or AGM. After the ex-date the share usually trades without that cash.",
      "A circuit is the maximum a share may rise or fall in one session. Hitting it is a trading rule, not a verdict on the company.",
    ],
    how: [
      { step: "Tap a word with an info mark when it shows up. The sheet uses the same definition as the lesson.", platform: "MoneyMitra" },
      { step: "Orders, if you place them later, still go through TMS.", platform: "TMS · your broker" },
    ],
    videoLabel: "Kitta, LTP, book close, circuit",
  },
  {
    id: "read",
    n: 3,
    kind: "learn",
    level: "The words",
    duration: "90s",
    title: "What book close actually means",
    cardSub: "Dividends, ex-date, and P/E — not a verdict.",
    tulkeyLine: "Using a name you already know as the example. Not a pick.",
    know: [
      "On the ex-date the share usually trades without the cash dividend. The price often drops by about that amount. That is the cash leaving the price, not a sudden change in the company.",
      "Book close is the date the company freezes its list for that dividend or AGM. Holding through it is a fact about the register, not advice.",
      "P/E compares price with earnings per share. It describes valuation. It is not a buy or sell signal.",
    ],
    how: [
      { step: "Companies announce dividends, book closure and AGMs. We surface dates; the company is the source.", platform: "Company / NEPSE notices" },
      { step: "Capital-gains tax uses your actual cost if you sell. We can show inputs; we do not file tax.", platform: "IRD rules · your records" },
    ],
    videoLabel: "Book close, dividend, P/E",
  },
  {
    id: "book",
    n: 4,
    kind: "do",
    doAction: "book",
    cta: "Add a holding",
    level: "Your book",
    duration: "Your move",
    title: "Add a holding to your portfolio",
    cardSub: "Paste a note or enter kitta. Completes when you save.",
    tulkeyLine: "This one isn’t a lesson. It completes when the holding is in your book.",
    know: [
      "A holding here is a record of kitta you already have. It is not an order, and MoneyMitra cannot read your broker.",
      "Paste a contract note or type symbol, kitta, price and date. You review every field before it is saved.",
    ],
    how: [
      { step: "Add what you already hold. Nothing is bought or sold.", platform: "MoneyMitra" },
      { step: "Listed trades still happen in TMS.", platform: "TMS · your broker" },
    ],
    videoLabel: "How a holding is recorded",
  },
  {
    id: "alert",
    n: 5,
    kind: "do",
    doAction: "alert",
    cta: "Create an alert",
    level: "Your book",
    duration: "Your move",
    title: "Create an alert",
    cardSub: "Price, event, or IPO. Completes when you save the rule.",
    tulkeyLine: "You set the rule. We remind. We never place an order off the back of it.",
    know: [
      "An alert is a reminder you wrote — a price, a date, or an IPO close. It is not a recommendation to act.",
      "Turning one on does not buy or sell kitta.",
    ],
    how: [
      { step: "Pick a name, a rule, and save it. Completes this objective.", platform: "MoneyMitra" },
    ],
    videoLabel: "What an alert is",
  },
  {
    id: "watch",
    n: 6,
    kind: "do",
    doAction: "watch",
    cta: "Add to a watchlist",
    level: "Your book",
    duration: "Your move",
    title: "Add a name to a watchlist",
    cardSub: "Follow a scrip. Completes when the name is on a list.",
    tulkeyLine: "Watching is not buying. The list is yours to check after close.",
    know: [
      "A watchlist is names you want to see again. Following never buys kitta.",
      "You can keep more than one list — banks, hydro, weekend reads.",
    ],
    how: [
      { step: "Add a name that isn’t on the list yet. That completes this objective.", platform: "MoneyMitra" },
    ],
    videoLabel: "What a watchlist is",
  },
];

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
        { id: "words", title: "Start at the terms", sub: "Kitta, book close, circuit — then your book.", objectiveId: "terms", stage: "explorer" },
        { id: "review", title: "From the very beginning anyway", sub: "Understanding the share market first.", objectiveId: "share", stage: "explorer" },
      ];
    case "demat":
      return [
        { id: "read", title: "Book close and dividends", sub: "Then add a holding, an alert, a watchlist.", objectiveId: "read", stage: "primary" },
        { id: "review", title: "From the very beginning anyway", sub: "Start at the share market.", objectiveId: "share", stage: "explorer" },
      ];
    case "tms":
      return [
        { id: "book", title: "Add what you already hold", sub: "Then an alert and a watchlist.", objectiveId: "book", stage: "secondary" },
        { id: "alert", title: "Alert and watchlist", sub: "If the book is already in.", objectiveId: "alert", stage: "secondary" },
      ];
    case "regular":
      return [
        { id: "book", title: "Holdings, then alerts and a watchlist", sub: "Skip the lessons. Set the book up.", objectiveId: "book", stage: "active" },
        { id: "alert", title: "Just the last two: alert and watchlist", sub: "If the book is already in.", objectiveId: "alert", stage: "active" },
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

export function nextOnPath(id: string): Objective | null {
  const i = curriculum.findIndex((o) => o.id === id);
  if (i < 0 || i >= curriculum.length - 1) return null;
  return curriculum[i + 1];
}

export function getObjectiveByTitle(title: string): Objective | null {
  const t = title.trim().toLowerCase();
  if (!t) return null;
  const exact = curriculum.find((o) => o.title.toLowerCase() === t);
  if (exact) return exact;
  if (t.includes("p/e") || t.includes("ex-dividend") || t.includes("dividend") || t.includes("book close")) {
    return getObjective("read");
  }
  if (t.includes("alert")) return getObjective("alert");
  if (t.includes("watch")) return getObjective("watch");
  if (t.includes("holding") || t.includes("portfolio")) return getObjective("book");
  if (t.includes("kitta") || t.includes("circuit") || t.includes("ltp")) return getObjective("terms");
  if (t.includes("nepse") || t.includes("share") || t.includes("market")) return getObjective("share");
  return null;
}

export function pathProgress(currentId: string | null, finished = false) {
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
  if (!now) {
    return { done: [] as Objective[], now: null, later: curriculum, learned: 0, total };
  }
  return {
    done: curriculum.filter((o) => o.n < now.n),
    now,
    later: curriculum.filter((o) => o.n > now.n),
    learned: now.n - 1,
    total,
  };
}

export const studioObjectives: { id: string; label: string }[] = curriculum.map((o) => ({
  id: o.id,
  label: `${o.n} · ${o.title}`,
}));
