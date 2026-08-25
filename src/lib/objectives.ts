import type { Stage } from "./types";

export type Objective = {
  id: string;
  n: number;
  level: string;
  duration: string;
  title: string;
  cardSub: string;
  tulkeyLine: string;
  know: string[];
  how: { step: string; platform: string }[];
  videoLabel: string;
};

/** Linear track. People enter at different points; they do not jump around. */
export const curriculum: Objective[] = [
  {
    id: "share",
    n: 1,
    level: "The basics",
    duration: "60s",
    title: "What is a share?",
    cardSub: "Ownership in a company, in plain words.",
    tulkeyLine: "We’ll start at the beginning. Nothing to buy.",
    know: [
      "A share is a slice of ownership in a company — not a loan to it, and not a bet MoneyMitra is making for you.",
      "If you hold kitta of a company, you own a tiny part of that company. Price going up or down changes the value of that slice.",
      "MoneyMitra explains this. It never tells you which company to own.",
    ],
    how: [
      { step: "Owning listed shares later means an order at a broker, in TMS — not in this app.", platform: "TMS · your broker" },
      { step: "A brand-new issue is applied for on MeroShare or C-ASBA.", platform: "MeroShare / C-ASBA" },
    ],
    videoLabel: "What is a share?",
  },
  {
    id: "nepse-kitta",
    n: 2,
    level: "The basics",
    duration: "60s",
    title: "NEPSE, kitta, and the market",
    cardSub: "The index, the unit, and what you cannot buy.",
    tulkeyLine: "Two words you’ll see everywhere. Here’s what they actually are.",
    know: [
      "NEPSE is Nepal’s stock exchange index — a picture of many companies together. It is not a company you can buy.",
      "Nepal trades in kitta. One kitta is one unit. An IPO application is usually counted in kitta, often with a 10-kitta minimum.",
      "A price on a screen is a last traded print, with a time. It is not a live promise and not a recommendation.",
    ],
    how: [
      { step: "Index, movers and breadth are on the Market tab here. They are a record, not a call.", platform: "MoneyMitra" },
      { step: "Buying or selling a listed company still happens in TMS at a licensed broker.", platform: "TMS · your broker" },
    ],
    videoLabel: "NEPSE and kitta",
  },
  {
    id: "ipo",
    n: 3,
    level: "Primary market",
    duration: "90s",
    title: "How an IPO actually works",
    cardSub: "Apply, allotment, listing — who does each step.",
    tulkeyLine: "This is your first objective: how a new issue becomes kitta you might hold.",
    know: [
      "An IPO is a company offering new shares to the public for the first time (or a further issue). You apply for a number of kitta at a stated price.",
      "Who gets kitta is decided at CDSC allotment. Tracking a result here does not change the result.",
      "After listing on NEPSE, those kitta can be sold on the secondary market — only if you choose to, and only in TMS.",
    ],
    how: [
      { step: "Fill and submit the application.", platform: "MeroShare / C-ASBA" },
      { step: "See allotted or not when CDSC publishes it.", platform: "MeroShare · CDSC" },
      { step: "If you later place an order in a listed stock, that is TMS at your broker — not here.", platform: "TMS · your broker" },
    ],
    videoLabel: "IPO apply → allotment → listing",
  },
  {
    id: "meroshare",
    n: 4,
    level: "Primary market",
    duration: "90s",
    title: "Demat, MeroShare and C-ASBA",
    cardSub: "The accounts behind an application — not this app.",
    tulkeyLine: "Where the paperwork actually lives.",
    know: [
      "A Demat account holds your kitta electronically. MeroShare is the usual way you see it and apply for issues.",
      "C-ASBA is the bank-side path to block application money. MoneyMitra does not block or release that money.",
      "Having MeroShare does not mean an order was placed. Trading listed shares still needs TMS at a broker.",
    ],
    how: [
      { step: "Open or use Demat / MeroShare with a capital / depository participant.", platform: "MeroShare" },
      { step: "Apply for an issue and block funds.", platform: "MeroShare / C-ASBA" },
      { step: "MoneyMitra can remind you of dates. It cannot submit the form.", platform: "MoneyMitra" },
    ],
    videoLabel: "Demat and MeroShare",
  },
  {
    id: "orders",
    n: 5,
    level: "Secondary market",
    duration: "2 min",
    title: "Limit orders, market orders, and EDIS",
    cardSub: "What the words mean, and which site does the work.",
    tulkeyLine: "Useful before you use TMS — not a suggestion to trade.",
    know: [
      "A market order fills at whatever price is available. A limit order waits for your price — it may not fill.",
      "Both are placed in TMS at your broker. MoneyMitra does not send the order.",
      "After a buy, kitta is transferred via EDIS on MeroShare before T+2. Missing that can trigger an exchange closeout. That is a settlement rule, not advice.",
    ],
    how: [
      { step: "Place or cancel a limit or market order.", platform: "TMS · your broker" },
      { step: "Transfer bought kitta (EDIS) so settlement can complete.", platform: "MeroShare" },
      { step: "MoneyMitra can show the T+2 window. It cannot complete EDIS.", platform: "MoneyMitra" },
    ],
    videoLabel: "Limit vs market · then EDIS",
  },
  {
    id: "read",
    n: 6,
    level: "Reading a company",
    duration: "2 min",
    title: "Dividends, ex-date, and P/E",
    cardSub: "How to read the figures. Not a verdict on any stock.",
    tulkeyLine: "These numbers show up a lot. Here’s what they are — not what to do.",
    know: [
      "On the ex-date the share usually trades without the cash dividend. The price often drops by about that amount. That is the cash leaving the price, not a sudden change in the company.",
      "P/E compares price with earnings per share. It describes valuation. It is not a buy or sell signal.",
      "WACC (average cost) is your own cost basis after fees — for records and tax maths, not a target we recommend.",
    ],
    how: [
      { step: "Companies announce dividends, book closure and AGMs. We surface dates; the company is the source.", platform: "Company / NEPSE notices" },
      { step: "Capital-gains tax uses your actual cost if you sell. We can show inputs; we do not file tax.", platform: "IRD rules · your records" },
    ],
    videoLabel: "Ex-date, dividend, P/E",
  },
  {
    id: "tape",
    n: 7,
    level: "Live session",
    duration: "90s",
    title: "Floor sheet and circuit rules",
    cardSub: "What a print and a halt are. Observed activity, not a call.",
    tulkeyLine: "Only if you want it — busy-day language, unpacked.",
    know: [
      "The floor sheet is a list of trades that already happened. It is not the live order book and not a recommendation.",
      "A 10% or 15% daily cap is an exchange rule. Hitting it is a fact about the rule, not a reason to buy or sell.",
      "“Broker 33 net buyer” is observed flow. It is not a rating of that broker or of the stock.",
    ],
    how: [
      { step: "Live orders still go through TMS during market hours.", platform: "TMS · your broker" },
      { step: "Circuit and halt rules sit with NEPSE / SEBON. We summarise them in plain words.", platform: "NEPSE rules" },
    ],
    videoLabel: "Floor sheet and circuits",
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
        { id: "start", title: "From the very first thing", sub: "What is a share? Then NEPSE and kitta.", objectiveId: "share", stage: "explorer" },
        { id: "skip-kitta", title: "I know what a share is", sub: "Start at NEPSE, kitta, and the index.", objectiveId: "nepse-kitta", stage: "explorer" },
      ];
    case "terms":
      return [
        { id: "ipo", title: "Start at how IPOs work", sub: "Your first objective — apply, allotment, listing.", objectiveId: "ipo", stage: "explorer" },
        { id: "review", title: "From the very beginning anyway", sub: "What is a share? Useful if the words are shaky.", objectiveId: "share", stage: "explorer" },
      ];
    case "demat":
      return [
        { id: "ipo", title: "How an IPO actually works", sub: "First objective: apply → allotment → listing.", objectiveId: "ipo", stage: "primary" },
        { id: "accounts", title: "I already apply — explain the accounts", sub: "Demat, MeroShare, C-ASBA, then secondary.", objectiveId: "meroshare", stage: "primary" },
        { id: "review", title: "From the very beginning anyway", sub: "Start at what a share is.", objectiveId: "share", stage: "explorer" },
      ];
    case "tms":
      return [
        { id: "orders", title: "Keep an objective: orders and EDIS", sub: "First on Home: limit vs market, then T+2.", objectiveId: "orders", stage: "secondary" },
        { id: "read", title: "Skip orders — reading dividends and P/E", sub: "If TMS is already familiar.", objectiveId: "read", stage: "value" },
        { id: "none", title: "No objective on Home", sub: "Learn stays in the library if a term comes up.", objectiveId: null, stage: "secondary" },
      ];
    case "regular":
      return [
        { id: "none", title: "No objective on Home", sub: "You’re far enough along. Dashboard first.", objectiveId: null, stage: "active" },
        { id: "read", title: "One objective: dividends and P/E", sub: "If you hold more than you trade.", objectiveId: "read", stage: "value" },
        { id: "tape", title: "One objective: floor sheet and circuits", sub: "If you watch the session closely.", objectiveId: "tape", stage: "active" },
      ];
  }
}

export function getObjective(id: string | null | undefined): Objective | null {
  if (!id) return null;
  return curriculum.find((o) => o.id === id) ?? null;
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
  if (t.includes("p/e") || t.includes("ex-dividend") || t.includes("dividend")) {
    return getObjective("read");
  }
  if (t.includes("ipo") || t.includes("allotment")) return getObjective("ipo");
  if (t.includes("meroshare") || t.includes("demat") || t.includes("c-asba")) {
    return getObjective("meroshare");
  }
  if (t.includes("edis") || t.includes("limit") || t.includes("market order")) {
    return getObjective("orders");
  }
  if (t.includes("floor") || t.includes("circuit") || t.includes("15%")) {
    return getObjective("tape");
  }
  if (t.includes("kitta") || t.includes("nepse")) return getObjective("nepse-kitta");
  if (t.includes("share")) return getObjective("share");
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

export const studioObjectives: { id: string; label: string }[] = [
  { id: "", label: "None (no Home card)" },
  ...curriculum.map((o) => ({ id: o.id, label: `${o.n} · ${o.title}` })),
];
