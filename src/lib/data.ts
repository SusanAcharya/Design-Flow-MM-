export const user = {
  name: "Sandip",
  fullName: "Sandip Sharma",
  initials: "SP",
};

export const nepse = {
  name: "NEPSE",
  value: 2622.48,
  change: -19.34,
  changePct: -0.73,
  rose: 78,
  fell: 142,
  unchanged: 21,
  listed: 220,
  turnoverCr: 507.35,
  volume: "1.84 Cr",
  kitta: "1.42 Cr",
  traded: "4.82 Arba",
  transactions: 148220,
  companies: 244,
  closedAt: "3:00 PM",
  date: "2 Bhadra 2083",
  liveAt: "12:42 PM",
};

export const movers = [
  { symbol: "SAPIL", name: "Sarbottam Poly", price: 524.6, changePct: 14.99, note: "Hit today’s 15% limit" },
  { symbol: "MEPDL", name: "Men's Apparel", price: 603.2, changePct: 14.98, note: "Hit today’s 15% limit" },
  { symbol: "CFCL", name: "Central Finance", price: 188.4, changePct: -6.12, note: "Fifth day falling" },
  { symbol: "HDL", name: "Himalayan Distillery", price: 2412, changePct: 3.4, note: "Turnover leader" },
  { symbol: "NABIL", name: "Nabil Bank", price: 498, changePct: -2.71, note: "Ex-dividend today" },
];

export const holdings = [
  { symbol: "NABIL", name: "Nabil Bank", kitta: 790, avg: 462.4, value: 393420, returnPct: 7.7, ltp: 498, dayPct: -2.71 },
  { symbol: "UPPER", name: "Upper Tamakoshi", kitta: 420, avg: 540, value: 257208, returnPct: 13.4, ltp: 612.4, dayPct: 0.33 },
  { symbol: "NICA", name: "NIC Asia Bank", kitta: 500, avg: 438, value: 206300, returnPct: -5.8, ltp: 412.6, dayPct: -0.4 },
  { symbol: "SHIVM", name: "Shivam Cements", kitta: 300, avg: 512.6, value: 164430, returnPct: 6.9, ltp: 548.1, dayPct: 1.1 },
  { symbol: "HDL", name: "Himalayan Distillery", kitta: 60, avg: 2180, value: 144720, returnPct: 10.6, ltp: 2412, dayPct: 3.4 },
  { symbol: "SOHL", name: "Shivam Holdings", kitta: 120, avg: 640, value: 82536, returnPct: 7.2, ltp: 687.8, dayPct: 1.2 },
  { symbol: "CHCL", name: "Chilime Hydropower", kitta: 180, avg: 580, value: 110160, returnPct: 5.5, ltp: 612, dayPct: 0.33 },
  { symbol: "GBIME", name: "Global IME Bank", kitta: 200, avg: 268, value: 51200, returnPct: -4.5, ltp: 256, dayPct: -0.8 },
  { symbol: "RIDI", name: "Ridi Hydropower", kitta: 150, avg: 210, value: 33750, returnPct: 7.1, ltp: 225, dayPct: 0.9 },
];

export const investorHoldingsPreview = [
  { symbol: "SOHL", kitta: 120, price: 687.8, dayPct: 1.24, overallPct: 8.1 },
  { symbol: "NABIL", kitta: 60, price: 498.0, dayPct: -2.71, overallPct: -2.58 },
  { symbol: "CHCL", kitta: 180, price: 612.0, dayPct: 0.33, overallPct: 4.9 },
  { symbol: "UPPER", kitta: 90, price: 612.4, dayPct: 0.33, overallPct: 13.4 },
];

export const portfolio = {
  name: "Personal",
  count: 9,
  value: 1284600,
  today: 18240,
  todayPct: 1.44,
  cashNoted: 215000,
  investorCash: 42000,
  investorValue: 393800,
  investorToday: 2840,
  investorTodayPct: 0.69,
  investorOverall: -18200,
  investorOverallPct: -4.42,
  unrealised: 142300,
  unrealisedPct: 12.5,
  realised: 38600,
  dividends: 24180,
  estimatedReturn: 205080,
};

export const ipo = {
  name: "Sanima Middle Tamor Hydropower",
  price: 100,
  minKitta: 10,
  closes: "5 Bhadra",
};

export const lessons = [
  { title: "How an IPO actually works", sub: "Apply · allotment · listing" },
  { title: "Why prices stop at 15%", sub: "The daily circuit, in plain words" },
  { title: "What a dividend does to the price", sub: "Ex-date versus payment" },
  { title: "How to read P/E", sub: "Price compared with earnings, not a verdict" },
];

export const events = [
  { tone: "up" as const, title: "SOHL dividend received", sub: "Yesterday · Rs 1,800 credited" },
  { tone: "accent" as const, title: "RIDI AGM · 11 Bhadra", sub: "You hold 150 kitta" },
  { tone: "warn" as const, title: "GBIME book closure · 7 Bhadra", sub: "You do not hold this stock" },
];

export const nabil = {
  symbol: "NABIL",
  name: "Nabil Bank",
  sector: "Commercial bank",
  ltp: 498,
  change: -13.9,
  changePct: -2.71,
  kitta: 60,
  value: 29880,
  overall: -792,
  avg: 511.2,
  pe: 18.4,
  pb: 2.1,
  eps: 27.05,
  mcap: "12,240 Cr",
  dividend: "10% cash",
  range: "452.30 – 685.00",
  open: 510.0,
  high: 512.0,
  low: 494.1,
  prev: 511.9,
  volume: "2.44 L kitta",
  turnover: "12.19 Cr",
};

export const nabilFinancials = {
  period: "FY 2081–82",
  earnings: [
    { label: "Net interest income", value: "24,180 L", change: 11.4 },
    { label: "Net profit", value: "7,940 L", change: 8.2 },
    { label: "EPS", value: "27.05" },
    { label: "Book value", value: "237.10" },
  ],
  quality: [
    { label: "P/E", value: "18.4", metric: "pe" },
    { label: "P/B", value: "2.10" },
    { label: "Return on equity", value: "13.8%" },
    { label: "Non-performing loans", value: "3.42%", tone: "warn" },
    { label: "Capital adequacy", value: "12.90%" },
  ],
  balance: [
    { label: "Paid-up capital", value: "3,205.7 Cr" },
    { label: "Interest income", value: "3,795.54 Cr" },
    { label: "Return on assets", value: "1.08%" },
    { label: "Cost of funds", value: "3.09%" },
    { label: "Loan to deposit", value: "0.78" },
    { label: "Three-year profit CAGR", value: "−3.01%" },
  ],
  owners: [
    { label: "Promoter", value: 51, color: "var(--accent-base)" },
    { label: "Public", value: 34, color: "var(--deco-violet)" },
    { label: "Institutions", value: 15, color: "var(--deco-teal)" },
  ],
};

export const nabilAnalysis = {
  updated: "2 Bhadra 2083 · session close",
  momentum: [
    { label: "RSI (14)", value: "39.23", state: "Lower half", explain: "Momentum compared with recent gains and losses." },
    { label: "Stochastic", value: "26.24", state: "Near low band", explain: "Where the close sits inside its recent range." },
    { label: "MACD", value: "−0.09", state: "Below signal", explain: "Difference between two trend averages." },
    { label: "ADX", value: "36.07", state: "Trend present", explain: "Trend strength, not whether it points up or down." },
    { label: "MFI", value: "19.30", state: "Low reading", explain: "Price and volume pressure over a recent window." },
  ],
  levels: [
    { label: "Bollinger upper", value: "519.20" },
    { label: "Bollinger middle", value: "505.10" },
    { label: "Bollinger lower", value: "491.00" },
    { label: "20-day SMA", value: "505.10" },
    { label: "50-day SMA", value: "512.40" },
    { label: "200-day SMA", value: "487.35" },
    { label: "13-day EMA", value: "501.85" },
    { label: "20-day EMA", value: "504.75" },
  ],
  risk: [
    { label: "Weekly beta", value: "0.73", note: "Moved less than the market in this sample." },
    { label: "Quarter beta", value: "0.57", note: "Sensitivity varies with the time window." },
    { label: "Year beta", value: "0.76", note: "Historical relationship, not a forecast." },
  ],
  context: [
    { label: "Short-term trend", value: 36, state: "Below 20- and 50-day averages" },
    { label: "Long-term position", value: 62, state: "Above the 200-day average" },
    { label: "Range position", value: 20, state: "Near the lower end of its 52-week range" },
    { label: "Trading activity", value: 54, state: "12.19 Cr turnover at the close" },
  ],
};

export const nabilCompany = {
  founded: "1984",
  exchange: "NEPSE",
  sector: "Commercial bank",
  description:
    "Nabil Bank is a Nepal-based commercial bank serving individuals and businesses through deposits, lending, cards, digital banking and investment-banking subsidiaries. It operates a nationwide branch and ATM network.",
  source: "Company filings and NEPSE disclosures",
};

export const nabilFloor = {
  summary: [
    ["Trades executed", "1,842"],
    ["Kitta traded", "2,44,310"],
    ["Value traded", "12.19 Cr"],
    ["Average trade size", "132 kitta"],
  ],
  brokers: [
    { code: "33", bought: 48200, sold: 12400, net: 35800 },
    { code: "58", bought: 31600, sold: 9800, net: 21800 },
    { code: "45", bought: 6200, sold: 39400, net: -33200 },
    { code: "49", bought: 4100, sold: 28700, net: -24600 },
    { code: "07", bought: 18900, sold: 17200, net: 1700 },
  ],
  largest: [
    { time: "3:00 PM", kitta: "12,000 kitta", price: 498.0 },
    { time: "1:42 PM", kitta: "9,500 kitta", price: 501.1 },
    { time: "12:18 PM", kitta: "8,200 kitta", price: 503.5 },
    { time: "11:36 AM", kitta: "6,750 kitta", price: 506.2 },
  ],
};

export const nabilEvents = {
  upcoming: [
    { title: "Book closure", date: "4 Bhadra 2083", sub: "In 2 days · hold before this date to receive the dividend" },
    { title: "Annual general meeting", date: "28 Bhadra 2083", sub: "Kathmandu · agenda published by the company" },
    { title: "Q1 results", date: "Expected Kartik 2083", sub: "Date not yet announced" },
  ],
  dividends: [
    ["2082–83", "10% cash", "5% bonus"],
    ["2081–82", "12% cash", "8% bonus"],
    ["2080–81", "15% cash", "—"],
    ["2079–80", "11% cash", "4% bonus"],
    ["2078–79", "9% cash", "6% bonus"],
  ],
  past: [
    { title: "Right share 1:4", date: "2079 Ashadh", status: "Completed" },
    { title: "Bonus share 8%", date: "2081 Poush", status: "Completed" },
    { title: "Share split", date: "—", status: "None on record" },
  ],
};

export const sectors = [
  { name: "Hydropower", changePct: 1.42, turnover: "1.28 Arba", rose: 61, fell: 19 },
  { name: "Manufacturing", changePct: 0.88, turnover: "0.54 Arba", rose: 24, fell: 11 },
  { name: "Hotels & tourism", changePct: 0.62, turnover: "0.14 Arba", rose: 7, fell: 4 },
  { name: "Life insurance", changePct: -0.44, turnover: "0.22 Arba", rose: 6, fell: 9 },
  { name: "Development banks", changePct: -0.88, turnover: "0.36 Arba", rose: 8, fell: 14 },
  { name: "Commercial banks", changePct: -1.42, turnover: "1.84 Arba", rose: 4, fell: 22 },
  { name: "Microfinance", changePct: -1.88, turnover: "0.61 Arba", rose: 9, fell: 41 },
];

export const watchlist = [
  { symbol: "NABIL", name: "Nabil Bank", sector: "Commercial banks", price: 498, changePct: -2.71, pe: 12.4, kitta: 790 },
  { symbol: "NICA", name: "NIC Asia Bank", sector: "Commercial banks", price: 412.6, changePct: -0.4, pe: 11.8, kitta: 0 },
  { symbol: "GBIME", name: "Global IME Bank", sector: "Commercial banks", price: 256, changePct: -0.8, pe: 14.8, kitta: 200 },
  { symbol: "UPPER", name: "Upper Tamakoshi", sector: "Hydropower", price: 612.4, changePct: 0.33, pe: 18.2, kitta: 420 },
  { symbol: "CHCL", name: "Chilime Hydropower", sector: "Hydropower", price: 612, changePct: 0.33, pe: 16.4, kitta: 180 },
  { symbol: "HDL", name: "Himalayan Distillery", sector: "Manufacturing", price: 2412, changePct: 3.4, pe: 22.1, kitta: 60 },
  { symbol: "SHIVM", name: "Shivam Cements", sector: "Manufacturing", price: 548.1, changePct: 1.1, pe: 19.6, kitta: 300 },
];

export const discover = [
  { kind: "Stock", title: "NABIL", sub: "Nabil Bank · you own 790 kitta" },
  { kind: "IPO", title: ipo.name, sub: `Rs ${ipo.price} · closes ${ipo.closes}` },
  { kind: "Broker", title: "Broker 58", sub: "Observed activity, not a rating" },
  { kind: "Tool", title: "WACC", sub: "Average cost of what you hold" },
  { kind: "Gyan", title: "What is a kitta?", sub: "The unit Nepal’s market trades in" },
];

export const tools = [
  { title: "WACC / average cost", sub: "How cost basis is calculated" },
  { title: "SIP calculator", sub: "What a regular buy would have done" },
  { title: "Compare companies", sub: "Same dates, same definitions" },
  { title: "Alerts", sub: "Price, event, IPO — you set the rule" },
  { title: "Export", sub: "Holdings and transactions" },
  { title: "Settings", sub: "Theme follows this studio, for now" },
];

export const liveIpo = {
  name: "Sanima Middle Tamor",
  closesIn: "3 days",
  price: 100,
  minKitta: 10,
};

export const ipoPipeline = {
  value: 10000,
  kitta: 100,
  count: 10,
};

export const allotments = [
  { name: "Sanima Hydro", status: "allotted" as const, kitta: 10 },
  { name: "Upper Tamakoshi", status: "awaiting" as const, kitta: 0 },
];

export const dictionary = {
  term: "Kitta",
  meaning: "Unit of stock. Minimum IPO apply = 10 kitta.",
};

export const secondaryBook = {
  value: 142800,
  today: 3200,
  todayPct: 2.2,
  cash: 25000,
};

export const settlements = [
  { symbol: "NABIL", kitta: 200, note: "Bought today — EDIS transfer due in T+2" },
];

export const corporateActions = [
  { title: "NABIL cash dividend 10%", sub: "Ex-date: today", tone: "warn" as const },
  { title: "SHIVM AGM announced", sub: "Agenda: 8% bonus share", tone: "accent" as const },
];

export const sectorAlloc = [
  { name: "Banking", pct: 45, color: "var(--accent-base)" },
  { name: "Hydro", pct: 30, color: "var(--deco-teal)" },
  { name: "Manufacturing", pct: 25, color: "var(--deco-saffron)" },
];

export const compareRows = [
  { id: "pe", label: "P/E", nabil: "12.4", gbime: "14.8" },
  { id: "eps", label: "EPS", nabil: "40.12", gbime: "18.40" },
  { id: "npl", label: "NPL", nabil: "1.2%", gbime: "2.8%" },
];

export const annualDividend = 38500;

export const traderBook = {
  buyingPower: 112000,
  marginUsed: 28,
};

export const firedAlerts = [
  { symbol: "NABIL", text: "fell below 500.00", at: "2:41 PM", tone: "down" as const },
  { symbol: "UPPER", text: "crossed 610.00", at: "1:18 PM", tone: "up" as const },
  { symbol: "SHIVM", text: "above 548.00", at: "12:06 PM", tone: "warn" as const },
];

export const floorBrokers = [
  { code: "33", active: "NABIL", bought: 248200, sold: 112400, net: 135800 },
  { code: "58", active: "UPPER", bought: 191600, sold: 69800, net: 121800 },
  { code: "07", active: "HDL", bought: 88900, sold: 67200, net: 21700 },
  { code: "45", active: "NABIL", bought: 36200, sold: 169400, net: -133200 },
  { code: "49", active: "SHIVM", bought: 44100, sold: 128700, net: -84600 },
];

export const marketEvents = [
  { title: "NABIL book closure", date: "7 Bhadra", sub: "Cash dividend 10%" },
  { title: "Sarbottam Cement IPO closes", date: "9 Bhadra", sub: "Apply on MeroShare / C-ASBA" },
  { title: "SHIVM AGM", date: "18 Bhadra", sub: "Agenda includes 8% bonus" },
];

export const floorSheet = [
  { time: "11:24:02", symbol: "NABIL", kitta: 200, price: 498, from: "B33", to: "B58" },
  { time: "11:23:41", symbol: "HDL", kitta: 50, price: 2412, from: "B17", to: "B33" },
  { time: "11:23:18", symbol: "UPPER", kitta: 500, price: 612.4, from: "B58", to: "B12" },
  { time: "11:22:55", symbol: "NABIL", kitta: 100, price: 498.5, from: "B4", to: "B33" },
  { time: "11:22:31", symbol: "SAPIL", kitta: 40, price: 524.6, from: "B22", to: "B9" },
];

export const alerts = [
  { title: "NABIL cash dividend", sub: "10% · ex-date today" },
  { title: "EDIS due", sub: "200 kitta NABIL · T+2 closeout risk" },
  { title: "SAPIL at 15% circuit", sub: "Hit the daily cap" },
  { title: "Himalayan Hydropower IPO", sub: "Closes in 2 days" },
];

export const metrics: Record<
  string,
  {
    name: string;
    value: string;
    plain: string;
    stock: number;
    sector: number;
    nepseAvg: number;
    lesson: string;
  }
> = {
  pe: {
    name: "P/E ratio",
    value: "18.4",
    plain: "P/E compares the share price with one year of profit per share. At 18.4, the market is paying about Rs 18.40 for every Rs 1 NABIL earns in a year.",
    stock: 18.4,
    sector: 16.2,
    nepseAvg: 21.7,
    lesson: "How to read P/E",
  },
  wacc: {
    name: "WACC",
    value: "462.40",
    plain: "Weighted average cost of your NABIL kitta after fees. The stock has to trade above this for you to be ahead.",
    stock: 462.4,
    sector: 480,
    nepseAvg: 0,
    lesson: "How is return calculated?",
  },
  eps: {
    name: "EPS",
    value: "27.05",
    plain: "NABIL earned NPR 27.05 per share over the last reported year.",
    stock: 27.05,
    sector: 28.4,
    nepseAvg: 22.1,
    lesson: "How to read P/E",
  },
  npl: {
    name: "NPL",
    value: "1.2%",
    plain: "Non-performing loans — the share of NABIL’s loans that are not being repaid on time.",
    stock: 1.2,
    sector: 2.1,
    nepseAvg: 2.8,
    lesson: "How to read P/E",
  },
};

export const nabilLedger = {
  date: "12 Ashadh 2083",
  side: "Buy",
  kitta: 180,
  price: 462.4,
  fees: 210,
};

export type TapePrint = { t: string; v: number; vol?: number };
export type Tape = {
  prevClose: number;
  open: number;
  high: number;
  low: number;
  last: number;
  circuitPct?: number;
  axis: "session" | "days";
  prints: TapePrint[];
};

export function bookTape(last: number, today: number): Tape {
  const prev = last - today;
  const count = 12;
  const prints = Array.from({ length: count }, (_, i) => {
    const t = i === count - 1 ? "Now" : `${count - 1 - i}d`;
    const wave = Math.sin(i * 1.35) * today * 0.28;
    const v = prev + (today * i) / (count - 1) + (i === 0 || i === count - 1 ? 0 : wave);
    return { t, v };
  });
  const values = prints.map((p) => p.v);
  return {
    prevClose: prev,
    open: prints[0].v,
    high: Math.max(...values),
    low: Math.min(...values),
    last,
    axis: "days",
    prints,
  };
}

export const nepseSession: Tape = {
  prevClose: 2641.82,
  open: 2638.1,
  high: 2644.2,
  low: 2618.4,
  last: 2622.48,
  circuitPct: 5,
  axis: "session",
  prints: [
    { t: "11:00", v: 2638.1, vol: 18 },
    { t: "11:15", v: 2642.4, vol: 34 },
    { t: "11:30", v: 2644.2, vol: 41 },
    { t: "11:45", v: 2640.8, vol: 29 },
    { t: "12:00", v: 2636.2, vol: 36 },
    { t: "12:15", v: 2631.5, vol: 44 },
    { t: "12:30", v: 2626.8, vol: 52 },
    { t: "12:45", v: 2622.1, vol: 48 },
    { t: "13:00", v: 2619.4, vol: 61 },
    { t: "13:15", v: 2618.4, vol: 58 },
    { t: "13:30", v: 2621.6, vol: 39 },
    { t: "13:45", v: 2625.3, vol: 33 },
    { t: "14:00", v: 2624.0, vol: 47 },
    { t: "14:15", v: 2620.8, vol: 42 },
    { t: "14:30", v: 2623.2, vol: 55 },
    { t: "14:45", v: 2622.9, vol: 38 },
    { t: "15:00", v: 2622.48, vol: 26 },
  ],
};

export const nabilSession: Tape = {
  prevClose: 511.9,
  open: 511.0,
  high: 512.5,
  low: 496.0,
  last: 498.0,
  circuitPct: 10,
  axis: "session",
  prints: [
    { t: "11:00", v: 511.0, vol: 22 },
    { t: "11:20", v: 512.5, vol: 31 },
    { t: "11:40", v: 510.2, vol: 28 },
    { t: "12:00", v: 507.8, vol: 40 },
    { t: "12:20", v: 504.1, vol: 46 },
    { t: "12:40", v: 501.6, vol: 38 },
    { t: "13:00", v: 500.6, vol: 52 },
    { t: "13:20", v: 497.2, vol: 61 },
    { t: "13:40", v: 496.0, vol: 55 },
    { t: "14:00", v: 496.8, vol: 44 },
    { t: "14:20", v: 497.4, vol: 36 },
    { t: "14:40", v: 498.6, vol: 41 },
    { t: "15:00", v: 498.0, vol: 29 },
  ],
};

export const nabilWeek: Tape = {
  prevClose: 522.4,
  open: 518.4,
  high: 524.2,
  low: 496.0,
  last: 498.0,
  axis: "days",
  prints: [
    { t: "Sun", v: 518.4 },
    { t: "Mon", v: 524.2 },
    { t: "Tue", v: 516.1 },
    { t: "Wed", v: 511.9 },
    { t: "Thu", v: 498.0 },
  ],
};

export const nabilMonth: Tape = {
  prevClose: 486.0,
  open: 488.2,
  high: 548.0,
  low: 472.0,
  last: 498.0,
  axis: "days",
  prints: [
    { t: "3 Shra", v: 488.2 },
    { t: "6", v: 494.6 },
    { t: "10", v: 508.4 },
    { t: "13", v: 521.0 },
    { t: "17", v: 548.0 },
    { t: "20", v: 536.2 },
    { t: "24", v: 519.8 },
    { t: "27", v: 511.9 },
    { t: "2 Bha", v: 498.0 },
  ],
};

export const nabilYear: Tape = {
  prevClose: 462.0,
  open: 458.4,
  high: 612.0,
  low: 448.0,
  last: 498.0,
  axis: "days",
  prints: [
    { t: "Ash", v: 458.4 },
    { t: "Kar", v: 472.0 },
    { t: "Man", v: 448.0 },
    { t: "Pou", v: 481.6 },
    { t: "Mag", v: 510.2 },
    { t: "Fal", v: 538.4 },
    { t: "Cha", v: 612.0 },
    { t: "Bai", v: 586.2 },
    { t: "Jes", v: 544.8 },
    { t: "Ash", v: 521.0 },
    { t: "Shr", v: 511.9 },
    { t: "Bha", v: 498.0 },
  ],
};

export const circuitCopy = {
  index5: {
    tone: "warn" as const,
    title: "Trading paused 15 minutes",
    body: "NEPSE Index down −5.02%. Continuous trading suspended for 15 minutes.",
  },
  index8: {
    tone: "halt" as const,
    title: "Market halted for the session",
    body: "NEPSE Index down −8.11%. Trading is suspended for the rest of today’s session.",
  },
  stock15: {
    tone: "warn" as const,
    title: "SAPIL at the daily cap",
    body: "SAPIL hit +15.00%. It cannot trade higher today. This is the circuit rule, not a buy call.",
  },
};

export const volBars = [28, 44, 36, 62, 40, 72, 55, 48, 80, 66, 42, 58, 70, 38, 52, 64, 44, 30, 48, 56];

export type MoverRow = {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  extra: string;
};

export const moverBoards: Record<"gainers" | "losers" | "turnover" | "volume" | "trades", MoverRow[]> = {
  gainers: [
    { rank: 1, symbol: "SAPIL", name: "Sarbottam Poly", price: 524.6, changePct: 14.99, extra: "15% cap" },
    { rank: 2, symbol: "MEPDL", name: "Men's Apparel", price: 603.2, changePct: 14.98, extra: "15% cap" },
    { rank: 3, symbol: "HDL", name: "Himalayan Distillery", price: 2412, changePct: 3.4, extra: "3.2 Cr" },
    { rank: 4, symbol: "SHIVM", name: "Shivam Cements", price: 548.1, changePct: 1.1, extra: "1.8 Cr" },
    { rank: 5, symbol: "UPPER", name: "Upper Tamakoshi", price: 612.4, changePct: 0.33, extra: "4.1 Cr" },
  ],
  losers: [
    { rank: 1, symbol: "CFCL", name: "Central Finance", price: 188.4, changePct: -6.12, extra: "5th day" },
    { rank: 2, symbol: "NABIL", name: "Nabil Bank", price: 498, changePct: -2.71, extra: "Ex-div" },
    { rank: 3, symbol: "GBIME", name: "Global IME Bank", price: 256, changePct: -0.8, extra: "2.4 Cr" },
    { rank: 4, symbol: "NICA", name: "NIC Asia Bank", price: 412.6, changePct: -0.4, extra: "1.9 Cr" },
    { rank: 5, symbol: "NLIC", name: "Nepal Life", price: 742, changePct: -0.31, extra: "0.8 Cr" },
  ],
  turnover: [
    { rank: 1, symbol: "HDL", name: "Himalayan Distillery", price: 2412, changePct: 3.4, extra: "42.6 Cr" },
    { rank: 2, symbol: "NABIL", name: "Nabil Bank", price: 498, changePct: -2.71, extra: "20.6 Cr" },
    { rank: 3, symbol: "UPPER", name: "Upper Tamakoshi", price: 612.4, changePct: 0.33, extra: "18.1 Cr" },
    { rank: 4, symbol: "NICA", name: "NIC Asia Bank", price: 412.6, changePct: -0.4, extra: "12.4 Cr" },
    { rank: 5, symbol: "SHIVM", name: "Shivam Cements", price: 548.1, changePct: 1.1, extra: "9.8 Cr" },
  ],
  volume: [
    { rank: 1, symbol: "UPPER", name: "Upper Tamakoshi", price: 612.4, changePct: 0.33, extra: "2.96 L" },
    { rank: 2, symbol: "NABIL", name: "Nabil Bank", price: 498, changePct: -2.71, extra: "4.12 L" },
    { rank: 3, symbol: "GBIME", name: "Global IME Bank", price: 256, changePct: -0.8, extra: "3.40 L" },
    { rank: 4, symbol: "NICA", name: "NIC Asia Bank", price: 412.6, changePct: -0.4, extra: "2.11 L" },
    { rank: 5, symbol: "CFCL", name: "Central Finance", price: 188.4, changePct: -6.12, extra: "1.84 L" },
  ],
  trades: [
    { rank: 1, symbol: "NABIL", name: "Nabil Bank", price: 498, changePct: -2.71, extra: "1,842 txns" },
    { rank: 2, symbol: "UPPER", name: "Upper Tamakoshi", price: 612.4, changePct: 0.33, extra: "1,206 txns" },
    { rank: 3, symbol: "HDL", name: "Himalayan Distillery", price: 2412, changePct: 3.4, extra: "964 txns" },
    { rank: 4, symbol: "SAPIL", name: "Sarbottam Poly", price: 524.6, changePct: 14.99, extra: "812 txns" },
    { rank: 5, symbol: "NICA", name: "NIC Asia Bank", price: 412.6, changePct: -0.4, extra: "701 txns" },
  ],
};

export const brokerHighlights = [
  { label: "Top buying broker", mark: "33", value: "NIBL Ace", sub: "Net buy · 62.4 Cr", tone: "up" as const },
  { label: "Top selling broker", mark: "45", value: "Global IME", sub: "Net sell · 33.2 Cr", tone: "down" as const },
  { label: "Top bought scrip", mark: "NB", value: "NABIL", sub: "Most kitta bought", tone: "up" as const },
  { label: "Top sold scrip", mark: "CF", value: "CFCL", sub: "Most kitta sold", tone: "down" as const },
];

export const brokerTable = [
  { rank: 1, code: "33", name: "NIBL Ace Capital", turnover: 124.6, avg30: 86.2, buyPct: 62, sellPct: 38, netCr: 62.4 },
  { rank: 2, code: "58", name: "Nabil Investment", turnover: 98.2, avg30: 71.4, buyPct: 44, sellPct: 56, netCr: -18.6 },
  { rank: 3, code: "45", name: "Global IME Capital", turnover: 86.4, avg30: 64.8, buyPct: 31, sellPct: 69, netCr: -33.2 },
  { rank: 4, code: "17", name: "Himalayan Capital", turnover: 71.8, avg30: 52.1, buyPct: 55, sellPct: 45, netCr: 12.8 },
  { rank: 5, code: "4", name: "NIDC Capital", turnover: 64.1, avg30: 48.6, buyPct: 48, sellPct: 52, netCr: -4.1 },
  { rank: 6, code: "22", name: "Prabhu Capital", turnover: 51.3, avg30: 39.2, buyPct: 59, sellPct: 41, netCr: 8.6 },
  { rank: 7, code: "12", name: "Laxmi Capital", turnover: 44.7, avg30: 33.8, buyPct: 41, sellPct: 59, netCr: -9.4 },
  { rank: 8, code: "9", name: "Sanima Capital", turnover: 38.9, avg30: 29.5, buyPct: 52, sellPct: 48, netCr: 2.2 },
];

type BasketIcon = "market" | "wallet" | "learn" | "star" | "compare" | "alert" | "cal" | "shield" | "discover";
type BasketTone = "accent" | "teal" | "violet" | "saffron";

export const basketCatalog: {
  id: string;
  audience: "traders" | "investors";
  title: string;
  count: number;
  changePct: number;
  icon: BasketIcon;
  tone: BasketTone;
  fresh?: boolean;
  members: string[];
}[] = [
  { id: "lowcap", audience: "traders", title: "Low cap stocks", count: 18, changePct: 2.14, icon: "alert", tone: "saffron", members: ["SAPIL", "MEPDL"] },
  { id: "leaders", audience: "traders", title: "Upward leaders", count: 12, changePct: 3.4, icon: "market", tone: "teal", fresh: true, members: ["HDL", "SHIVM"] },
  { id: "mom", audience: "traders", title: "Momentum movers", count: 10, changePct: 1.88, icon: "compare", tone: "accent", members: ["UPPER", "CHCL"] },
  { id: "fallers", audience: "traders", title: "The fallers", count: 9, changePct: -2.71, icon: "alert", tone: "violet", members: ["NABIL", "CFCL"] },
  { id: "bottom", audience: "traders", title: "Near bottom", count: 8, changePct: -1.4, icon: "cal", tone: "saffron", members: ["GBIME", "NICA"] },
  { id: "peak", audience: "traders", title: "Near peak", count: 7, changePct: 0.92, icon: "star", tone: "accent", members: ["HDL", "UPPER"] },
  { id: "mid", audience: "traders", title: "Mid cap", count: 14, changePct: 0.44, icon: "wallet", tone: "teal", members: ["SHIVM", "NICA"] },
  { id: "large", audience: "traders", title: "Large cap", count: 11, changePct: -0.61, icon: "shield", tone: "accent", members: ["NABIL", "NICA"] },
  { id: "fav", audience: "traders", title: "Broker favourites", count: 8, changePct: 0.28, icon: "star", tone: "violet", members: ["NABIL", "HDL"] },
  { id: "margin", audience: "investors", title: "Margin applicable", count: 16, changePct: -0.4, icon: "wallet", tone: "accent", members: ["NABIL", "GBIME"] },
  { id: "earn", audience: "investors", title: "Earning excellence", count: 9, changePct: 0.88, icon: "learn", tone: "teal", members: ["NABIL", "HDL"] },
  { id: "sip", audience: "investors", title: "SIP on stocks", count: 10, changePct: 1.1, icon: "cal", tone: "violet", fresh: true, members: ["UPPER", "CHCL"] },
  { id: "banks-b", audience: "investors", title: "Commercial banks", count: 12, changePct: -0.61, icon: "shield", tone: "accent", members: ["NABIL", "NICA", "GBIME"] },
  { id: "hydro-b", audience: "investors", title: "Hydropower", count: 8, changePct: 1.42, icon: "market", tone: "teal", members: ["UPPER", "CHCL", "RIDI"] },
  { id: "micro", audience: "investors", title: "Microfinance", count: 11, changePct: -1.12, icon: "discover", tone: "saffron", members: ["NICA"] },
  { id: "stars", audience: "investors", title: "Rising stars", count: 6, changePct: 2.2, icon: "star", tone: "violet", members: ["SAPIL", "MEPDL"] },
  { id: "exdate", audience: "investors", title: "Ex-date this week", count: 4, changePct: -1.12, icon: "cal", tone: "saffron", members: ["NABIL", "SOHL"] },
  { id: "list", audience: "investors", title: "Recent listings", count: 6, changePct: 0.88, icon: "learn", tone: "accent", members: ["SAPIL", "MEPDL"] },
];

export const happening = [
  {
    tag: "Corporate",
    time: "Last session",
    title: "NABIL trades ex-dividend today",
    dek: "The cash left the print. That is not a call to sell.",
    stock: "NABIL",
  },
  {
    tag: "Turnover",
    time: "Last session",
    title: "HDL led the tape at 42.6 Cr",
    dek: "A session total, not a forecast.",
    stock: "HDL",
  },
  {
    tag: "Circuit",
    time: "Last session",
    title: "SAPIL closed at the 15% cap",
    dek: "The daily limit paused the print.",
    stock: "SAPIL",
  },
  {
    tag: "Sectors",
    time: "Last session",
    title: "Hydropower led turnover",
    dek: "86 Cr of activity. A record, not a forecast.",
  },
];
