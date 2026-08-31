import type { IconName } from "../ds/Icon";
import type { BrokerDesk, MarketDesk, MarketTab, Plan, PlanCycle, Route, Sheet, StockTab } from "./types";

export type ExploreCategoryId = "account" | "market" | "intel" | "media";

export type ExploreTool = {
  id: string;
  title: string;
  short: string;
  purpose: string;
  keywords: string;
  icon: IconName;
  tone: "accent" | "teal" | "saffron" | "violet" | "learn";
  category: ExploreCategoryId;
  group: string;
  kind?: "portal";
  go?: { route: Route; stock?: string; stockTab?: StockTab; marketTab?: MarketTab; marketDesk?: MarketDesk; brokerDesk?: BrokerDesk; brokerCode?: string; lesson?: string };
  sheet?: Sheet;
  soon?: { body: string };
  handoff?: { platform: string; body: string };
};

export const exploreTools: ExploreTool[] = [
  {
    id: "portfolio",
    title: "My Portfolio",
    short: "Portfolio",
    purpose: "Ledger, returns and stock entry",
    keywords: "portfolio holdings ledger book returns",
    icon: "wallet",
    tone: "accent",
    category: "account",
    group: "Account",
    go: { route: "portfolio" },
  },
  {
    id: "language",
    title: "Language",
    short: "Language",
    purpose: "Read the app in Nepali or English",
    keywords: "language nepali english bhasa translate",
    icon: "globe",
    tone: "accent",
    category: "account",
    group: "Account",
    sheet: { kind: "language" },
  },
  {
    id: "watchlist",
    title: "My Watchlist",
    short: "Watchlist",
    purpose: "Saved scrips and custom alerts",
    keywords: "watchlist saved scrips follow",
    icon: "bookmark",
    tone: "accent",
    category: "account",
    group: "Account",
    go: { route: "watchlist" },
  },
  {
    id: "brokers",
    title: "Brokers",
    short: "Brokers",
    purpose: "Floor leaders, houses, and executed flow",
    keywords: "brokers tms licensed capital chirfaar analysis floorsheet",
    icon: "handshake",
    tone: "teal",
    category: "account",
    group: "Account",
    go: { route: "brokers", brokerDesk: "hub" },
  },
  {
    id: "baskets",
    title: "Baskets",
    short: "Baskets",
    purpose: "Themes of names, same session",
    keywords: "baskets themes groups hydropower banks",
    icon: "basket",
    tone: "violet",
    category: "account",
    group: "Account",
    go: { route: "baskets" },
  },
  {
    id: "alerts",
    title: "My Alerts",
    short: "Alerts",
    purpose: "Price, volume and announcement notices",
    keywords: "alerts notifications price volume",
    icon: "bell",
    tone: "accent",
    category: "account",
    group: "Account",
    go: { route: "alerts" },
  },
  {
    id: "allotment",
    title: "IPO Allotment Tracker",
    short: "Allotment",
    purpose: "Application results via CDSC",
    keywords: "ipo allotment tracker cdsc application result",
    icon: "ticket",
    tone: "accent",
    category: "account",
    group: "Account",
    go: { route: "ipo" },
  },

  {
    id: "tape",
    title: "Live Market Tape",
    short: "Tape",
    purpose: "NEPSE session, last print and breadth",
    keywords: "live market tape nepse session index",
    icon: "pulse",
    tone: "teal",
    category: "market",
    group: "Live trading",
    go: { route: "market-desk", marketDesk: "live" },
  },
  {
    id: "floorsheet",
    title: "Floor Sheet",
    short: "Floor sheet",
    purpose: "Prints that already happened, by broker",
    keywords: "floor sheet floorsheet broker prints trades",
    icon: "table",
    tone: "teal",
    category: "market",
    group: "Live trading",
    go: { route: "market", marketTab: "Floor sheet" },
  },
  {
    id: "depth",
    title: "Market Depth",
    short: "Depth",
    purpose: "Bid and ask on several names at once",
    keywords: "market depth bid ask order book bulk",
    icon: "depth",
    tone: "teal",
    category: "market",
    group: "Live trading",
    go: { route: "market-desk", marketDesk: "depth" },
  },
  {
    id: "charts",
    title: "Technical Charts",
    short: "Charts",
    purpose: "Line, candles and readings — not a rating",
    keywords: "technical charts candles rsi analysis",
    icon: "candles",
    tone: "teal",
    category: "market",
    group: "Live trading",
    go: { route: "stock", stock: "NABIL", stockTab: "Analysis" },
  },
  {
    id: "screener",
    title: "Stock Screener",
    short: "Screener",
    purpose: "Sector, 52-week range, turnover",
    keywords: "screener filter sector 52 week calculator",
    icon: "sliders",
    tone: "teal",
    category: "market",
    group: "Screener & analytics",
    go: { route: "search" },
  },
  {
    id: "compare",
    title: "Compare Stocks",
    short: "Compare",
    purpose: "Same dates, same definitions",
    keywords: "compare stocks companies side by side",
    icon: "compare",
    tone: "teal",
    category: "market",
    group: "Screener & analytics",
    sheet: { kind: "compare" },
  },
  {
    id: "emotion",
    title: "Emotion Meter",
    short: "Emotion",
    purpose: "Observed session mood, not a signal",
    keywords: "emotion meter sentiment fear greed",
    icon: "gauge",
    tone: "teal",
    category: "market",
    group: "Screener & analytics",
    soon: {
      body: "A read of how busy or quiet the session looks. It is observed activity, never a reason to buy or sell. Not wired in this demo yet.",
    },
  },
  {
    id: "valuators",
    title: "Stock Valuators",
    short: "Valuators",
    purpose: "Avg cost, P/E and cost basis",
    keywords: "valuator wacc pe calculator average cost",
    icon: "calc",
    tone: "teal",
    category: "market",
    group: "Screener & analytics",
    sheet: { kind: "metric", id: "wacc" },
  },
  {
    id: "indices",
    title: "Market Indices",
    short: "Indices",
    purpose: "NEPSE, sensitive, float and banking",
    keywords: "indices index nepse sensitive float banking",
    icon: "index",
    tone: "teal",
    category: "market",
    group: "Market statistics",
    go: { route: "market-desk", marketDesk: "indices" },
  },
  {
    id: "sectors",
    title: "Sector Performance",
    short: "Sectors",
    purpose: "How groups of companies moved",
    keywords: "sector performance groups banking hydro",
    icon: "pie",
    tone: "teal",
    category: "market",
    group: "Market statistics",
    go: { route: "market-desk", marketDesk: "sectors" },
  },
  {
    id: "fiftytwo",
    title: "52-Week High/Low",
    short: "52-week",
    purpose: "Range for a company, not a target",
    keywords: "52 week high low range yearly",
    icon: "range",
    tone: "teal",
    category: "market",
    group: "Market statistics",
    go: { route: "market-desk", marketDesk: "week-change" },
  },
  {
    id: "movers",
    title: "Market Movers",
    short: "Movers",
    purpose: "Gainers, losers, turnover and volume",
    keywords: "movers gainers losers turnover volume",
    icon: "movers",
    tone: "teal",
    category: "market",
    group: "Market statistics",
    go: { route: "market-desk", marketDesk: "movers" },
  },
  {
    id: "summary",
    title: "Market Summary",
    short: "Summary",
    purpose: "Index, breadth and session totals",
    keywords: "market summary nepse session turnover",
    icon: "clipboard",
    tone: "teal",
    category: "market",
    group: "Market statistics",
    go: { route: "market-desk", marketDesk: "summary" },
  },
  {
    id: "gain-loss",
    title: "Gainers & Losers",
    short: "Gain/loss",
    purpose: "Top percentage moves, 1 day or 1 week",
    keywords: "gainers losers gain loss percent",
    icon: "percent",
    tone: "teal",
    category: "market",
    group: "Market statistics",
    go: { route: "market-desk", marketDesk: "gain-loss" },
  },
  {
    id: "price-board",
    title: "Stock Price",
    short: "Prices",
    purpose: "Last traded prices across names",
    keywords: "stock price ltp last traded",
    icon: "tag",
    tone: "teal",
    category: "market",
    group: "Market statistics",
    go: { route: "market-desk", marketDesk: "price" },
  },
  {
    id: "nepse-data",
    title: "NEPSE Data",
    short: "NEPSE data",
    purpose: "Published session figures",
    keywords: "nepse data kitta transactions listed",
    icon: "database",
    tone: "teal",
    category: "market",
    group: "Market statistics",
    go: { route: "market-desk", marketDesk: "nepse-data" },
  },

  {
    id: "open-ipo",
    title: "Open IPOs",
    short: "Open IPOs",
    purpose: "Issues open now, then apply on MeroShare",
    keywords: "open ipo primary issue apply",
    icon: "rocket",
    tone: "saffron",
    category: "intel",
    group: "Primary market",
    go: { route: "ipo" },
  },
  {
    id: "mutual-funds",
    title: "Mutual Funds",
    short: "Funds",
    purpose: "Listed funds and NAVs, when published",
    keywords: "mutual fund nav unit",
    icon: "coins",
    tone: "saffron",
    category: "intel",
    group: "Primary market",
    soon: {
      body: "Listed funds and published NAVs will sit here. MoneyMitra will not tell you which fund to buy.",
    },
  },
  {
    id: "casba-fee",
    title: "C-ASBA Fee Calculator",
    short: "C-ASBA",
    purpose: "Application amount and bank charges",
    keywords: "c-asba casba fee calculator charges kitta",
    icon: "receipt",
    tone: "saffron",
    category: "intel",
    group: "Primary market",
    sheet: {
      kind: "quick",
      title: "C-ASBA fee calculator",
      body: "IPO applications are in kitta, usually with a stated minimum. Bank and C-ASBA charges sit with your ASBA bank — not in this app.",
      note: "Apply on MeroShare / C-ASBA. MoneyMitra does not submit the form.",
    },
  },
  {
    id: "dividends",
    title: "Dividend Calendar",
    short: "Dividends",
    purpose: "Book close, ex-date and payment",
    keywords: "dividend calendar ex-date book close agm",
    icon: "coin",
    tone: "saffron",
    category: "intel",
    group: "Corporate actions",
    go: { route: "market", marketTab: "Events" },
  },
  {
    id: "agm-rights",
    title: "AGM & Right Share History",
    short: "AGM",
    purpose: "Meetings and rights already announced",
    keywords: "agm right share bonus history corporate",
    icon: "users",
    tone: "saffron",
    category: "intel",
    group: "Corporate actions",
    go: { route: "stock", stock: "NABIL", stockTab: "Events" },
  },
  {
    id: "mergers",
    title: "Mergers & Acquisitions",
    short: "M&A",
    purpose: "Swap ratios and timelines when filed",
    keywords: "merger acquisition swap ratio",
    icon: "merge",
    tone: "saffron",
    category: "intel",
    group: "Corporate actions",
    soon: {
      body: "Filed mergers and swap ratios will be listed as facts. This is not a call to hold or exit.",
    },
  },
  {
    id: "commodities",
    title: "Commodity Prices",
    short: "Commodities",
    purpose: "Gold, silver and other published prints",
    keywords: "commodity gold silver prices",
    icon: "ingot",
    tone: "saffron",
    category: "intel",
    group: "Economy & forex",
    soon: {
      body: "Published commodity prints, timestamped. Not a trade recommendation.",
    },
  },
  {
    id: "forex",
    title: "Forex Rates",
    short: "Forex",
    purpose: "NRB buying and selling rates",
    keywords: "forex nrb usd inr exchange rate",
    icon: "forex",
    tone: "saffron",
    category: "intel",
    group: "Economy & forex",
    soon: {
      body: "NRB buying and selling rates, when published. MoneyMitra does not convert or send money.",
    },
  },
  {
    id: "nrb",
    title: "NRB Macro Data",
    short: "NRB",
    purpose: "Inflation, liquidity and policy notes",
    keywords: "nrb macro inflation liquidity policy economy",
    icon: "bank",
    tone: "saffron",
    category: "intel",
    group: "Economy & forex",
    soon: {
      body: "A short reading of published NRB figures. Context for the market, not a portfolio instruction.",
    },
  },

  {
    id: "stock-news",
    title: "Stock News",
    short: "News",
    purpose: "Company headlines with a timestamp",
    keywords: "stock news headlines company",
    icon: "news",
    tone: "violet",
    category: "media",
    group: "News & reports",
    go: { route: "market", marketTab: "Events" },
  },
  {
    id: "newsletters",
    title: "Daily Newsletters",
    short: "Digest",
    purpose: "A session digest, not a pick list",
    keywords: "newsletter daily digest email",
    icon: "mail",
    tone: "violet",
    category: "media",
    group: "News & reports",
    soon: {
      body: "A written session digest. It will recap what moved, not what to buy.",
    },
  },
  {
    id: "reports",
    title: "Company Financial Reports",
    short: "Reports",
    purpose: "Filed statements on the company page",
    keywords: "financial reports annual quarterly statements",
    icon: "doc",
    tone: "learn",
    category: "media",
    group: "News & reports",
    go: { route: "stock", stock: "NABIL", stockTab: "Financials" },
  },
  {
    id: "announcements",
    title: "Corporate Announcements",
    short: "Notices",
    purpose: "AGM, dividend and book-close notices",
    keywords: "corporate announcements filings notice",
    icon: "megaphone",
    tone: "violet",
    category: "media",
    group: "News & reports",
    go: { route: "stock", stock: "NABIL", stockTab: "Events" },
  },
  {
    id: "courses",
    title: "Courses",
    short: "Courses",
    purpose: "Full courses, bought one at a time",
    keywords: "courses course buy paid class lecture technical fundamental training",
    icon: "learn",
    tone: "learn",
    category: "media",
    group: "Learning",
    go: { route: "learn" },
  },
  {
    id: "my-learning",
    title: "My Learning",
    short: "My learning",
    purpose: "Courses you own, and where you stopped",
    keywords: "my learning enrolled bought progress continue resume",
    icon: "book",
    tone: "learn",
    category: "media",
    group: "Learning",
    go: { route: "my-learning" },
  },
  {
    id: "certificates",
    title: "Certificates",
    short: "Certificates",
    purpose: "Issued when you finish a course",
    keywords: "certificate certificates completion issued code",
    icon: "certificate",
    tone: "learn",
    category: "media",
    group: "Learning",
    go: { route: "certificates" },
  },
  {
    id: "lessons",
    title: "2-Minute Market Lessons",
    short: "Lessons",
    purpose: "Mitra's free path — seven short sittings",
    keywords: "lessons gyan mitra learn 2 minute free path objectives sittings",
    icon: "lesson",
    tone: "learn",
    category: "media",
    group: "Learning",
    go: { route: "objectives" },
  },
  {
    id: "dictionary",
    title: "Stock Market Dictionary",
    short: "Dictionary",
    purpose: "Kitta, EDIS, circuit — plain words",
    keywords: "dictionary kitta edis circuit glossary terms",
    icon: "dictionary",
    tone: "learn",
    category: "media",
    group: "Learning",
    go: { route: "lesson", lesson: "What is a kitta?" },
  },
  {
    id: "meroshare",
    title: "MeroShare",
    short: "MeroShare",
    purpose: "IPO apply, EDIS, demat",
    keywords: "meroshare demat edis apply",
    icon: "idcard",
    tone: "accent",
    category: "media",
    group: "External portals",
    kind: "portal",
    handoff: {
      platform: "MeroShare",
      body: "IPO apply, EDIS and demat live on MeroShare. MoneyMitra does not log you in or submit forms.",
    },
  },
  {
    id: "tms",
    title: "Broker TMS",
    short: "TMS",
    purpose: "Live orders at your broker",
    keywords: "tms broker trading terminal order",
    icon: "terminal",
    tone: "accent",
    category: "media",
    group: "External portals",
    kind: "portal",
    handoff: {
      platform: "TMS · your broker",
      body: "Live orders are placed in TMS at a licensed broker. MoneyMitra never places the order itself.",
    },
  },
  {
    id: "sebon",
    title: "SEBON",
    short: "SEBON",
    purpose: "Regulator filings and notices",
    keywords: "sebon regulator filings",
    icon: "shield",
    tone: "accent",
    category: "media",
    group: "External portals",
    kind: "portal",
    handoff: {
      platform: "SEBON",
      body: "Rules, licences and investor notices live with SEBON. This is a handoff, not a filing.",
    },
  },
  {
    id: "cdsc",
    title: "CDSC",
    short: "CDSC",
    purpose: "Allotment and depository records",
    keywords: "cdsc depository allotment demat",
    icon: "vault",
    tone: "accent",
    category: "media",
    group: "External portals",
    kind: "portal",
    handoff: {
      platform: "CDSC",
      body: "Allotment results and depository records sit with CDSC. Tracking here does not change a result.",
    },
  },
];

export const defaultExploreFavorites = ["portfolio", "watchlist", "alerts", "allotment"];

/** What sits on Home before anyone customises anything. Home shows the first
    four of the pinned list, so these are the four a new member starts with. */
export const defaultHomeTools = ["alerts", "baskets", "brokers", "stock-news"];

export const exploreGroupOrder = [...new Set(exploreTools.map((tool) => tool.group))];

export function getExploreTool(id: string) {
  return exploreTools.find((tool) => tool.id === id);
}

export function filterExploreTools(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return exploreTools;
  return exploreTools.filter((tool) =>
    `${tool.title} ${tool.short} ${tool.purpose} ${tool.keywords} ${tool.group}`.toLowerCase().includes(q),
  );
}

/** Home's jump rail shows at most eight, so pinning stops there too. */
export const homePinMax = 8;

export const planIds: Plan[] = ["free", "plus", "pro"];

export const planMeta = {
  free: {
    id: "free" as const,
    label: "Free",
    kicker: "FREE MEMBER",
    renew: "Upgrade when a screener or alert would help",
    blurb: "Tape, one watchlist, and the words.",
    monthly: 0,
    annual: 0,
  },
  plus: {
    id: "plus" as const,
    label: "Plus",
    kicker: "PLUS MEMBER",
    renew: "Renews with this cycle",
    blurb: "Alerts, screener and compare.",
    monthly: 299,
    annual: 2490,
  },
  pro: {
    id: "pro" as const,
    label: "Pro",
    kicker: "PRO MEMBER",
    renew: "Renews with this cycle",
    blurb: "Depth, valuators and newsletters on top.",
    monthly: 799,
    annual: 6990,
  },
};

export const planFeatures = [
  { name: "Market tape and index", free: true, plus: true, pro: true },
  { name: "One watchlist", free: true, plus: true, pro: true },
  { name: "Price and event alerts", free: false, plus: true, pro: true },
  { name: "Screener and compare", free: false, plus: true, pro: true },
  { name: "Depth, valuators, newsletters", free: false, plus: false, pro: true },
];

export const memberSince = "2 Shrawan 2083";
export const referralCode = "SANDIP-MM";

export function planTerm(plan: Plan, cycle: PlanCycle) {
  if (plan === "free") {
    return { started: "—", ending: "—" };
  }
  return {
    started: "26 Bhadra 2083",
    ending: cycle === "monthly" ? "26 Ashwin 2083" : "26 Bhadra 2084",
  };
}

/* ── Subscription page ──────────────────────────────────────────────────────
   Three tiers, one character each, and the same rows compared across all. */
export const planCharacters: Record<Plan, string> = {
  free: "deepak",
  plus: "sarita",
  pro: "kiran",
};

/** The cast a member can pick from for their own picture. */
export const characterCast = [
  "deepak",
  "sarita",
  "kiran",
  "anil",
  "maya",
  "sita",
  "prakash",
  "bina",
  "nabin",
];

/** The face the demo member starts with. */
export const memberCharacter = "deepak";

export const planHighlights: Record<Plan, string[]> = {
  free: ["Live tape and the index", "One watchlist, one book", "Every term explained"],
  plus: ["Price alerts that reach you", "Screener, compare and baskets", "Broker statement import"],
  pro: ["Market depth and floorsheet history", "Valuators and the weekly letter", "Mitra without a daily cap"],
};

export type PerkValue = string | boolean;

export const planPerkGroups: {
  title: string;
  rows: { name: string; free: PerkValue; plus: PerkValue; pro: PerkValue }[];
}[] = [
  {
    title: "Market",
    rows: [
      { name: "Live tape and NEPSE index", free: true, plus: true, pro: true },
      { name: "Movers, sectors and indices", free: true, plus: true, pro: true },
      { name: "Floorsheet and broker analysis", free: "Top 5", plus: "Full day", pro: "Day + history" },
      { name: "Market depth", free: false, plus: false, pro: true },
    ],
  },
  {
    title: "Your book",
    rows: [
      { name: "Watchlists", free: "1", plus: "10", pro: "Unlimited" },
      { name: "Portfolios", free: "1", plus: "5", pro: "Unlimited" },
      { name: "Broker statement import", free: false, plus: true, pro: true },
      { name: "Charges and tax summary", free: false, plus: true, pro: true },
    ],
  },
  {
    title: "Alerts",
    rows: [
      { name: "Price alerts", free: false, plus: "20 live", pro: "Unlimited" },
      { name: "Corporate action notices", free: true, plus: true, pro: true },
      { name: "Email delivery", free: false, plus: true, pro: true },
    ],
  },
  {
    title: "Tools",
    rows: [
      { name: "Baskets", free: "Open ones", plus: "All", pro: "All" },
      { name: "Screener and compare", free: false, plus: true, pro: true },
      { name: "Valuators — WACC, DCF", free: false, plus: false, pro: true },
      { name: "Mitra AI", free: "5 a day", plus: "50 a day", pro: "Unlimited" },
    ],
  },
  {
    title: "Learning",
    rows: [
      { name: "Stock courses", free: "First lesson", plus: "All", pro: "All" },
      { name: "Weekly newsletter", free: false, plus: false, pro: true },
      { name: "Support", free: "Help centre", plus: "Email", pro: "Priority" },
    ],
  },
];
