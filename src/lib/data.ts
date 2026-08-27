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

export const marketIndices = [
  {
    id: "nepse",
    label: "NEPSE Index",
    value: 2622.48,
    open: 2638.1,
    change: -19.34,
    changePct: -0.73,
    turnover: "4.82 Arba",
    body: "NEPSE is the Nepal Stock Exchange index — a weighted average of listed companies. It is not a share you can buy.",
  },
  {
    id: "sensitive",
    label: "Sensitive Index",
    value: 468.12,
    open: 471.54,
    change: -3.42,
    changePct: -0.73,
    turnover: "1.61 Arba",
    body: "The Sensitive Index covers A-class companies — larger names that trade more often.",
  },
  {
    id: "float",
    label: "Float Index",
    value: 179.40,
    open: 180.68,
    change: -1.28,
    changePct: -0.71,
    turnover: "4.69 Arba",
    body: "The Float Index weights companies by shares that can actually trade, not the full issued capital.",
  },
  {
    id: "senfloat",
    label: "Sensitive Float",
    value: 156.80,
    open: 157.72,
    change: -0.92,
    changePct: -0.58,
    turnover: "1.61 Arba",
    body: "Sensitive Float combines A-class names with free-float weights.",
  },
  {
    id: "banking",
    label: "Banking Index",
    value: 1248.60,
    open: 1256.72,
    change: -8.12,
    changePct: -0.65,
    turnover: "1.84 Arba",
    body: "The Banking Index groups commercial banks. A move here is about the group, not one ticker.",
  },
  {
    id: "hydro",
    label: "Hydro Index",
    value: 2840.20,
    open: 2862.3,
    change: -22.10,
    changePct: -0.77,
    turnover: "1.28 Arba",
    body: "The Hydro Index groups hydropower companies listed on NEPSE.",
  },
];

export const movers = [
  { symbol: "SAPIL", name: "Sarbottam Poly", price: 524.6, changePct: 14.99, note: "Hit today’s 15% limit" },
  { symbol: "MEPDL", name: "Men's Apparel", price: 603.2, changePct: 14.98, note: "Hit today’s 15% limit" },
  { symbol: "CFCL", name: "Central Finance", price: 188.4, changePct: -6.12, note: "Fifth day falling" },
  { symbol: "HDL", name: "Himalayan Distillery", price: 2412, changePct: 3.4, note: "Turnover leader" },
  { symbol: "NABIL", name: "Nabil Bank", price: 498, changePct: -2.71, note: "Ex-dividend today" },
];

export const holdings = [
  { symbol: "NABIL", name: "Nabil Bank", sector: "Banking", kitta: 790, avg: 462.4, value: 393420, returnPct: 7.7, ltp: 498, dayPct: -2.71 },
  { symbol: "UPPER", name: "Upper Tamakoshi", sector: "Hydropower", kitta: 420, avg: 540, value: 257208, returnPct: 13.4, ltp: 612.4, dayPct: 0.33 },
  { symbol: "NICA", name: "NIC Asia Bank", sector: "Banking", kitta: 500, avg: 438, value: 206300, returnPct: -5.8, ltp: 412.6, dayPct: -0.4 },
  { symbol: "SHIVM", name: "Shivam Cements", sector: "Manufacturing", kitta: 300, avg: 512.6, value: 164430, returnPct: 6.9, ltp: 548.1, dayPct: 1.1 },
  { symbol: "HDL", name: "Himalayan Distillery", sector: "Distillery", kitta: 60, avg: 2180, value: 144720, returnPct: 10.6, ltp: 2412, dayPct: 3.4 },
  { symbol: "SOHL", name: "Shivam Holdings", sector: "Investment", kitta: 120, avg: 640, value: 82536, returnPct: 7.2, ltp: 687.8, dayPct: 1.2 },
  { symbol: "CHCL", name: "Chilime Hydropower", sector: "Hydropower", kitta: 180, avg: 580, value: 110160, returnPct: 5.5, ltp: 612, dayPct: 0.33 },
  { symbol: "GBIME", name: "Global IME Bank", sector: "Banking", kitta: 200, avg: 268, value: 51200, returnPct: -4.5, ltp: 256, dayPct: -0.8 },
  { symbol: "RIDI", name: "Ridi Hydropower", sector: "Hydropower", kitta: 150, avg: 210, value: 33750, returnPct: 7.1, ltp: 225, dayPct: 0.9 },
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
  weekHigh: 685.0,
  weekLow: 452.3,
  avg30: 516.4,
};

export const nabilFinancials = {
  period: "FY 2081–82",
  essentials: [
    { label: "Earning per share", value: "27.05" },
    { label: "Market capitalisation", value: "12,240 Cr" },
    { label: "Graham number", value: "380.15" },
    { label: "Paid up capital", value: "3,205.7 Cr" },
    { label: "Book value", value: "237.10" },
    { label: "Net profit", value: "7,940 L" },
    { label: "Current ratio", value: "1.18" },
    { label: "Dividend yield", value: "2.01%" },
    { label: "Debt to equity", value: "1.42" },
    { label: "Price per earning", value: "18.40" },
    { label: "Return on asset", value: "1.08%" },
    { label: "Return on equity", value: "13.80%" },
    { label: "Price per book value", value: "2.10" },
    { label: "Liabilities to asset", value: "0.88" },
    { label: "Number of shares", value: "32.06 Cr" },
    { label: "Interest income", value: "3,795.54 Cr" },
    { label: "Interest expense", value: "2,240.10 Cr" },
    { label: "Operating expenses", value: "612.40 Cr" },
    { label: "Revenue", value: "4,182.90 Cr" },
    { label: "One year yield", value: "6.42%" },
  ],
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
  essentials: [
    { label: "Date", value: "2 Bhadra 2083" },
    { label: "LTP", value: "498.00" },
    { label: "RSI (14)", value: "39.23" },
    { label: "Stochastic", value: "26.24" },
    { label: "MACD", value: "−0.09" },
    { label: "MACD signal", value: "0.34" },
    { label: "MACD vs signal", value: "Down" },
    { label: "Bollinger signal", value: "Buy" },
    { label: "13-day VWAP", value: "502.44" },
    { label: "30-day average", value: "516.40" },
    { label: "8-day EMA", value: "500.20" },
    { label: "ADX", value: "36.07" },
    { label: "MFI", value: "19.30" },
  ],
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
    { label: "Month beta", value: "0.91", note: "One month of daily moves against the index." },
    { label: "Quarter beta", value: "0.57", note: "Sensitivity varies with the time window." },
    { label: "Year beta", value: "0.76", note: "Historical relationship, not a forecast." },
    { label: "Three-year beta", value: "0.82", note: "The longest window we hold." },
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
  { name: "Hydropower", changePct: 1.42, turnover: "1.28 Arba", rose: 61, fell: 19, ltp: 2840.2, volume: "77.49 L" },
  { name: "Manufacturing", changePct: 0.88, turnover: "0.54 Arba", rose: 24, fell: 11, ltp: 10233.8, volume: "3.59 L" },
  { name: "Hotels & tourism", changePct: 0.62, turnover: "0.14 Arba", rose: 7, fell: 4, ltp: 4128.6, volume: "0.82 L" },
  { name: "Life insurance", changePct: -0.44, turnover: "0.22 Arba", rose: 6, fell: 9, ltp: 11840.4, volume: "1.12 L" },
  { name: "Development banks", changePct: -0.88, turnover: "0.36 Arba", rose: 8, fell: 14, ltp: 4862.1, volume: "5.52 L" },
  { name: "Commercial banks", changePct: -1.42, turnover: "1.84 Arba", rose: 4, fell: 22, ltp: 1248.6, volume: "13.07 L" },
  { name: "Microfinance", changePct: -1.88, turnover: "0.61 Arba", rose: 9, fell: 41, ltp: 1642.8, volume: "8.24 L" },
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

export const watchLists = [
  {
    id: "main",
    label: "Main",
    blurb: "Names you check after close",
    symbols: ["NABIL", "NICA", "GBIME", "UPPER", "CHCL", "HDL", "SHIVM"],
  },
  {
    id: "banks",
    label: "Banks",
    blurb: "Commercial banks on this list",
    symbols: ["NABIL", "NICA", "GBIME"],
  },
  {
    id: "hydro",
    label: "Hydro",
    blurb: "Power names after the rains",
    symbols: ["UPPER", "CHCL"],
  },
  {
    id: "reads",
    label: "Weekend reads",
    blurb: "Not a buy list — names to sit with",
    symbols: ["HDL", "SHIVM"],
  },
];

export function namesOnWatchList(id: string) {
  const list = watchLists.find((item) => item.id === id) ?? watchLists[0];
  return list.symbols
    .map((symbol) => watchlist.find((row) => row.symbol === symbol))
    .filter((row): row is (typeof watchlist)[number] => Boolean(row));
}

export const discover = [
  { kind: "Stock", title: "NABIL", sub: "Nabil Bank · you own 790 kitta" },
  { kind: "IPO", title: ipo.name, sub: `Rs ${ipo.price} · closes ${ipo.closes}` },
  { kind: "Broker", title: "Broker 58", sub: "Observed activity, not a rating" },
  { kind: "Tool", title: "Avg cost", sub: "What you paid, on average, for what you hold" },
  { kind: "Gyan", title: "What is a kitta?", sub: "The unit Nepal’s market trades in" },
];

export const tools = [
  { title: "Average cost", sub: "How cost basis is calculated" },
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
  { symbol: "NABIL", title: "cash dividend 10%", sub: "Ex-date today", tone: "warn" as const },
  { symbol: "SHIVM", title: "AGM announced", sub: "Agenda: 8% bonus share", tone: "accent" as const },
];

export type SectorRow = {
  name: string;
  short: string;
  pct: number;
  color: string;
  value: number;
  changePct: number;
  symbols: string[];
};

/** Home strip: four named slices, remainder folded into Other. */
export function stripAlloc(rows: SectorRow[], named = 4): SectorRow[] {
  const sorted = [...rows].sort((a, b) => b.pct - a.pct);
  if (sorted.length <= named) return sorted;
  const head = sorted.slice(0, named);
  const tail = sorted.slice(named);
  const value = tail.reduce((sum, row) => sum + row.value, 0);
  const pctTotal = tail.reduce((sum, row) => sum + row.pct, 0);
  const changePct = value === 0
    ? 0
    : tail.reduce((sum, row) => sum + row.changePct * row.value, 0) / value;
  return [
    ...head,
    {
      name: "Other",
      short: "OTHER",
      pct: pctTotal,
      color: "#8b8b8b",
      value,
      changePct: Math.round(changePct * 100) / 100,
      symbols: tail.flatMap((row) => row.symbols),
    },
  ];
}

export const bookHappen = [
  {
    kind: "up" as const,
    title: "Hydropower led today",
    sub: "UPPER +6.4%, API +9.8%. Sector up 2.4%.",
    context: "You hold 2",
    stock: "UPPER",
  },
  {
    kind: "event" as const,
    title: "NABIL book close Tuesday",
    sub: "Hold till Bhadra 12 to get Rs 11,770.",
    context: "Yours",
    stock: "NABIL",
  },
  {
    kind: "down" as const,
    title: "Insurance down a third week",
    sub: "NLIC −3.2%. No company news behind it.",
    context: "You hold 1",
    stock: "NICA",
  },
  {
    kind: "ipo" as const,
    title: "Sanima Middle Tamor closes Thursday",
    sub: "You applied for 10 kitta.",
    context: "Applied",
    stock: "SAPIL",
  },
];

export const bookNews = [
  { tag: "Ex-div", tone: "teal" as const, title: "NABIL went ex-div in your book", stock: "NABIL", changePct: -2.71 },
  { tag: "Quiet", tone: "saffron" as const, title: "UPPER barely moved today", stock: "UPPER", changePct: 0.33 },
  { tag: "Best day", tone: "violet" as const, title: "HDL is your biggest move", stock: "HDL", changePct: 3.4 },
];

export const bookPulse = {
  values: [28, 36, 32, 44, 40, 52, 48, 61, 55, 70, 64, 58, 72, 66, 80, 74, 68, 76, 62, 54, 60, 48, 42, 50],
  ticks: [
    { i: 0, label: "11" },
    { i: 6, label: "12" },
    { i: 12, label: "1" },
    { i: 18, label: "2" },
    { i: 23, label: "3" },
  ],
};

export type BookRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "All";

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
    name: "Avg cost",
    value: "462.40",
    plain: "Average cost of your NABIL kitta after fees. Brokers call this WACC. The stock has to trade above this for you to be ahead.",
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

function seriesTape(
  last: number,
  change: number,
  labels: string[],
  axis: Tape["axis"] = "days",
): Tape {
  const prev = last - change;
  const n = Math.max(labels.length - 1, 1);
  const prints = labels.map((t, i) => {
    const wave = Math.sin(i * 1.18) * change * 0.26;
    const v = prev + (change * i) / n + (i === 0 || i === labels.length - 1 ? 0 : wave);
    return { t, v };
  });
  const values = prints.map((p) => p.v);
  return {
    prevClose: prev,
    open: prints[0].v,
    high: Math.max(...values),
    low: Math.min(...values),
    last,
    axis,
    prints,
  };
}

export function bookRangeTape(last: number, today: number, overall: number, range: BookRange): Tape {
  if (range === "1D") {
    const prev = last - today;
    const src = nepseSession.prints;
    const s0 = src[0].v;
    const span = src[src.length - 1].v - s0 || 1;
    const prints = src.map((p, i) => ({
      t: p.t,
      v: i === src.length - 1 ? last : prev + ((p.v - s0) / span) * today,
      vol: p.vol,
    }));
    const values = prints.map((p) => p.v);
    return {
      prevClose: prev,
      open: prints[0].v,
      high: Math.max(...values),
      low: Math.min(...values),
      last,
      axis: "session" as const,
      prints,
    };
  }
  if (range === "1W") return seriesTape(last, today * 1.6, ["Sun", "Mon", "Tue", "Wed", "Thu"]);
  if (range === "1M") return seriesTape(last, overall * 0.22, ["3 Shr", "10", "17", "24", "2 Bha"]);
  if (range === "3M") return seriesTape(last, overall * 0.38, ["Jes", "Ash", "Shr", "Bha"]);
  if (range === "6M") return seriesTape(last, overall * 0.55, ["Mag", "Fal", "Cha", "Bai", "Jes", "Bha"]);
  return seriesTape(last, overall, ["Ash", "Kar", "Pou", "Mag", "Cha", "Bai", "Jes", "Bha"]);
}

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

/* The session tape at print resolution: the same path, sampled every couple of
   minutes with the wobble a real tape has. Deterministic, so shots repeat. */
function clockAt(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}

function toMinutes(clock: string) {
  const [h, m] = clock.split(":").map(Number);
  return h * 60 + m;
}

function tickTape(base: Tape, per = 8): Tape {
  const prints: TapePrint[] = [];
  for (let i = 0; i < base.prints.length - 1; i += 1) {
    const a = base.prints[i];
    const b = base.prints[i + 1];
    const from = toMinutes(a.t);
    const to = toMinutes(b.t);
    for (let k = 0; k < per; k += 1) {
      const f = k / per;
      const n = i * per + k;
      const wobble = Math.sin(n * 1.9) * 0.85 + Math.sin(n * 0.61) * 1.35 + Math.sin(n * 3.7) * 0.45;
      const value = a.v + (b.v - a.v) * f + wobble;
      prints.push({
        t: clockAt(from + (to - from) * f),
        v: Math.round(Math.min(base.high, Math.max(base.low, value)) * 100) / 100,
        vol: a.vol ? Math.round((a.vol / per) * (1 + Math.sin(n * 2.3) * 0.4)) : undefined,
      });
    }
  }
  prints.push(base.prints[base.prints.length - 1]);
  return { ...base, prints };
}

export const nabilSessionTicks: Tape = tickTape(nabilSession);

export const nepseSessionTicks: Tape = tickTape(nepseSession, 7);

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
  { label: "Top buying broker", mark: "33", value: "33", name: "NIBL Ace", sub: "Net buy · 62.4 Cr", tone: "up" as const, broker: "33", stock: undefined as string | undefined },
  { label: "Top selling broker", mark: "45", value: "45", name: "Global IME", sub: "Net sell · 33.2 Cr", tone: "down" as const, broker: "45", stock: undefined as string | undefined },
  { label: "Top bought stock", mark: "NB", value: "NABIL", name: "Nabil Bank", sub: "Most kitta bought", tone: "up" as const, broker: undefined as string | undefined, stock: "NABIL" },
  { label: "Top sold stock", mark: "HD", value: "HDL", name: "Himalayan Distillery", sub: "Most kitta sold", tone: "down" as const, broker: undefined as string | undefined, stock: "HDL" },
];

export const freeBrokers = [
  { code: "33", name: "NIBL Ace Capital", short: "NIBL Ace", mark: "NA", tone: "accent" as const },
  { code: "58", name: "Nabil Investment", short: "Nabil", mark: "NI", tone: "teal" as const },
  { code: "45", name: "Global IME Capital", short: "Global IME", mark: "GI", tone: "violet" as const },
  { code: "17", name: "Himalayan Capital", short: "Himalayan", mark: "HC", tone: "saffron" as const },
  { code: "22", name: "Prabhu Capital", short: "Prabhu", mark: "PC", tone: "accent" as const },
  { code: "12", name: "Laxmi Capital", short: "Laxmi", mark: "LC", tone: "teal" as const },
  { code: "9", name: "Sanima Capital", short: "Sanima", mark: "SC", tone: "violet" as const },
  { code: "4", name: "NIDC Capital", short: "NIDC", mark: "ND", tone: "saffron" as const },
  { code: "49", name: "NIC Asia Capital", short: "NIC Asia", mark: "NC", tone: "accent" as const },
  { code: "26", name: "Siddhartha Capital", short: "Siddhartha", mark: "SD", tone: "teal" as const },
  { code: "21", name: "Sunrise Capital", short: "Sunrise", mark: "SR", tone: "violet" as const },
  { code: "34", name: "Machhapuchchhre Capital", short: "MPCL", mark: "MC", tone: "saffron" as const },
];

export type BrokerHouse = {
  code: string;
  name: string;
  short: string;
  city: string;
  turnover: number;
  avg30: number;
  buyCr: number;
  sellCr: number;
  matching: string;
  buyPct: number;
  sellPct: number;
  netCr: number;
  sharePct: number;
  ratio: number;
  collateral: string;
  creditDays: number;
  depositDays: number;
  active: string;
  about: string;
  mentionUp: string[];
  mentionDown: string[];
};

export const brokerHouses: BrokerHouse[] = [
  {
    code: "33",
    name: "NIBL Ace Capital",
    short: "NIBL Ace",
    city: "Kathmandu",
    turnover: 124.6,
    avg30: 86.2,
    buyCr: 93.5,
    sellCr: 31.1,
    matching: "18.69 L",
    buyPct: 62,
    sellPct: 38,
    netCr: 62.4,
    sharePct: 24.56,
    ratio: 3.01,
    collateral: "1:1",
    creditDays: 2,
    depositDays: 4,
    active: "NABIL",
    about: "NIBL Ace Capital is a licensed stock broker and a member of Nepal Stock Exchange, regulated by SEBON. Figures here are executed flow from this session, not a ranking or a recommendation to open TMS.",
    mentionUp: ["TMS login is usually quoted as same-day once KYC is in."],
    mentionDown: ["The phone desk is slower after the 3:00 PM close."],
  },
  {
    code: "58",
    name: "Nabil Investment Banking",
    short: "Nabil",
    city: "Kathmandu",
    turnover: 98.2,
    avg30: 71.4,
    buyCr: 39.8,
    sellCr: 58.4,
    matching: "12.40 L",
    buyPct: 44,
    sellPct: 56,
    netCr: -18.6,
    sharePct: 19.36,
    ratio: 0.68,
    collateral: "1:1",
    creditDays: 2,
    depositDays: 3,
    active: "UPPER",
    about: "Nabil Investment Banking Ltd. is a licensed broker and NEPSE member. Buy and sell percentages are the split of executed kitta across many clients, not one person.",
    mentionUp: ["Credit is often released in two working days."],
    mentionDown: ["Branch queues can be long on IPO close days."],
  },
  {
    code: "45",
    name: "Global IME Capital",
    short: "Global IME",
    city: "Kathmandu",
    turnover: 86.4,
    avg30: 64.8,
    buyCr: 26.8,
    sellCr: 59.6,
    matching: "9.12 L",
    buyPct: 31,
    sellPct: 69,
    netCr: -33.2,
    sharePct: 17.03,
    ratio: 0.45,
    collateral: "1:1",
    creditDays: 3,
    depositDays: 4,
    active: "NABIL",
    about: "Global IME Capital is a licensed house. A net seller on one session is a picture of that day’s prints, not a forecast of the next.",
    mentionUp: ["Demat and TMS sit under one group brand."],
    mentionDown: ["Net selling today is not a reason to leave or join."],
  },
  {
    code: "17",
    name: "Himalayan Capital",
    short: "Himalayan",
    city: "Kathmandu",
    turnover: 71.8,
    avg30: 52.1,
    buyCr: 39.5,
    sellCr: 32.3,
    matching: "7.80 L",
    buyPct: 55,
    sellPct: 45,
    netCr: 12.8,
    sharePct: 14.15,
    ratio: 1.22,
    collateral: "1:1",
    creditDays: 2,
    depositDays: 5,
    active: "HDL",
    about: "Himalayan Capital is a SEBON-licensed broker. Average 30-day turnover is a smoothed print, not a promise of tomorrow’s flow.",
    mentionUp: ["Written collateral terms are usually 1:1."],
    mentionDown: ["Cash deposit confirmation can take a few working days."],
  },
  {
    code: "4",
    name: "NIDC Capital Markets",
    short: "NIDC",
    city: "Kathmandu",
    turnover: 64.1,
    avg30: 48.6,
    buyCr: 30.8,
    sellCr: 33.3,
    matching: "6.44 L",
    buyPct: 48,
    sellPct: 52,
    netCr: -4.1,
    sharePct: 12.63,
    ratio: 0.92,
    collateral: "1:1",
    creditDays: 2,
    depositDays: 4,
    active: "GBIME",
    about: "NIDC Capital Markets is a licensed NEPSE member. Matching amount is kitta that crossed inside the same house, not extra volume.",
    mentionUp: ["Older house, same regulator as the rest of the list."],
    mentionDown: ["A near-even buy/sell split is not a quality score."],
  },
  {
    code: "22",
    name: "Prabhu Capital",
    short: "Prabhu",
    city: "Kathmandu",
    turnover: 51.3,
    avg30: 39.2,
    buyCr: 30.3,
    sellCr: 21.0,
    matching: "5.10 L",
    buyPct: 59,
    sellPct: 41,
    netCr: 8.6,
    sharePct: 10.11,
    ratio: 1.44,
    collateral: "1:1",
    creditDays: 2,
    depositDays: 4,
    active: "SHIVM",
    about: "Prabhu Capital is a licensed broker. Opening an account happens at the house and on MeroShare. MoneyMitra does not submit the form.",
    mentionUp: ["Group bank rails are often used for deposits."],
    mentionDown: ["Confirm every fee on the house’s own schedule."],
  },
  {
    code: "12",
    name: "Laxmi Capital",
    short: "Laxmi",
    city: "Lalitpur",
    turnover: 44.7,
    avg30: 33.8,
    buyCr: 18.3,
    sellCr: 26.4,
    matching: "4.22 L",
    buyPct: 41,
    sellPct: 59,
    netCr: -9.4,
    sharePct: 8.81,
    ratio: 0.69,
    collateral: "1:1",
    creditDays: 3,
    depositDays: 4,
    active: "NICA",
    about: "Laxmi Capital is a licensed NEPSE member based in Lalitpur. Location is an address, not a rating.",
    mentionUp: ["Lalitpur desk is an option if Kathmandu queues are long."],
    mentionDown: ["A net seller print is one session only."],
  },
  {
    code: "9",
    name: "Sanima Capital",
    short: "Sanima",
    city: "Kathmandu",
    turnover: 38.9,
    avg30: 29.5,
    buyCr: 20.2,
    sellCr: 18.7,
    matching: "3.90 L",
    buyPct: 52,
    sellPct: 48,
    netCr: 2.2,
    sharePct: 7.67,
    ratio: 1.08,
    collateral: "1:1",
    creditDays: 2,
    depositDays: 3,
    active: "UPPER",
    about: "Sanima Capital is a licensed broker. Share of NEPSE is this house’s turnover divided by the session’s traded value.",
    mentionUp: ["Buy and sell were close to even on this sample."],
    mentionDown: ["Even flow is not a reason to pick a house."],
  },
];

export const brokerTable = brokerHouses;

export function getBroker(code: string) {
  return brokerHouses.find((row) => row.code === code) ?? brokerHouses[0];
}

export const brokerChoice: Record<string, { symbol: string; name: string; side: "buy" | "sell"; kitta: string; amount: string }[]> = {
  "33": [
    { symbol: "NABIL", name: "Nabil Bank", side: "buy", kitta: "48,200", amount: "24.0 Cr" },
    { symbol: "UPPER", name: "Upper Tamakoshi", side: "buy", kitta: "12,400", amount: "7.6 Cr" },
    { symbol: "HDL", name: "Himalayan Distillery", side: "sell", kitta: "3,100", amount: "7.5 Cr" },
    { symbol: "SHIVM", name: "Shivam Cements", side: "buy", kitta: "8,600", amount: "4.7 Cr" },
  ],
  "45": [
    { symbol: "NABIL", name: "Nabil Bank", side: "sell", kitta: "39,400", amount: "19.6 Cr" },
    { symbol: "CFCL", name: "Central Finance", side: "sell", kitta: "18,200", amount: "3.4 Cr" },
    { symbol: "GBIME", name: "Global IME Bank", side: "buy", kitta: "9,800", amount: "2.5 Cr" },
    { symbol: "NICA", name: "NIC Asia Bank", side: "sell", kitta: "6,400", amount: "2.6 Cr" },
  ],
  "58": [
    { symbol: "UPPER", name: "Upper Tamakoshi", side: "buy", kitta: "19,160", amount: "11.7 Cr" },
    { symbol: "NABIL", name: "Nabil Bank", side: "sell", kitta: "9,800", amount: "4.9 Cr" },
    { symbol: "CHCL", name: "Chilime Hydropower", side: "buy", kitta: "7,200", amount: "4.4 Cr" },
    { symbol: "HDL", name: "Himalayan Distillery", side: "buy", kitta: "1,400", amount: "3.4 Cr" },
  ],
  "17": [
    { symbol: "HDL", name: "Himalayan Distillery", side: "buy", kitta: "2,600", amount: "6.3 Cr" },
    { symbol: "NABIL", name: "Nabil Bank", side: "sell", kitta: "8,200", amount: "4.1 Cr" },
    { symbol: "CHCL", name: "Chilime Hydropower", side: "sell", kitta: "5,400", amount: "3.3 Cr" },
    { symbol: "UPPER", name: "Upper Tamakoshi", side: "buy", kitta: "2,100", amount: "1.3 Cr" },
  ],
  "4": [
    { symbol: "NABIL", name: "Nabil Bank", side: "buy", kitta: "12,800", amount: "6.4 Cr" },
    { symbol: "GBIME", name: "Global IME Bank", side: "sell", kitta: "8,600", amount: "2.2 Cr" },
    { symbol: "NICA", name: "NIC Asia Bank", side: "buy", kitta: "3,100", amount: "1.3 Cr" },
    { symbol: "CHCL", name: "Chilime Hydropower", side: "buy", kitta: "2,100", amount: "1.3 Cr" },
  ],
  "22": [
    { symbol: "SHIVM", name: "Shivam Cements", side: "buy", kitta: "5,200", amount: "2.9 Cr" },
    { symbol: "GBIME", name: "Global IME Bank", side: "buy", kitta: "2,400", amount: "0.6 Cr" },
    { symbol: "SAPIL", name: "Sanima Life", side: "sell", kitta: "1,900", amount: "1.0 Cr" },
    { symbol: "HDL", name: "Himalayan Distillery", side: "sell", kitta: "820", amount: "2.0 Cr" },
  ],
  "12": [
    { symbol: "UPPER", name: "Upper Tamakoshi", side: "sell", kitta: "14,600", amount: "8.9 Cr" },
    { symbol: "NICA", name: "NIC Asia Bank", side: "buy", kitta: "6,400", amount: "2.6 Cr" },
    { symbol: "SHIVM", name: "Shivam Cements", side: "sell", kitta: "2,400", amount: "1.3 Cr" },
    { symbol: "NABIL", name: "Nabil Bank", side: "buy", kitta: "1,600", amount: "0.8 Cr" },
  ],
  "9": [
    { symbol: "UPPER", name: "Upper Tamakoshi", side: "buy", kitta: "5,200", amount: "3.2 Cr" },
    { symbol: "CFCL", name: "Central Finance", side: "sell", kitta: "3,400", amount: "0.6 Cr" },
    { symbol: "NICA", name: "NIC Asia Bank", side: "sell", kitta: "2,600", amount: "1.1 Cr" },
    { symbol: "SAPIL", name: "Sanima Life", side: "buy", kitta: "1,200", amount: "0.6 Cr" },
  ],
};

/* Which brokers stood on each side of a stock today, in kitta. */
export const stockFlow: Record<
  string,
  { name: string; brokers: { code: string; bought: number; sold: number }[] }
> = {
  NABIL: {
    name: "Nabil Bank",
    brokers: [
      { code: "33", bought: 48200, sold: 3100 },
      { code: "4", bought: 12800, sold: 4100 },
      { code: "17", bought: 6400, sold: 8200 },
      { code: "58", bought: 2400, sold: 9800 },
      { code: "45", bought: 1200, sold: 39400 },
    ],
  },
  UPPER: {
    name: "Upper Tamakoshi",
    brokers: [
      { code: "58", bought: 19160, sold: 2200 },
      { code: "33", bought: 12400, sold: 900 },
      { code: "9", bought: 5200, sold: 6800 },
      { code: "12", bought: 1800, sold: 14600 },
      { code: "45", bought: 700, sold: 9400 },
    ],
  },
  HDL: {
    name: "Himalayan Distillery",
    brokers: [
      { code: "17", bought: 2600, sold: 480 },
      { code: "58", bought: 1400, sold: 200 },
      { code: "22", bought: 640, sold: 820 },
      { code: "33", bought: 260, sold: 3100 },
    ],
  },
  SHIVM: {
    name: "Shivam Cements",
    brokers: [
      { code: "33", bought: 8600, sold: 400 },
      { code: "22", bought: 5200, sold: 1100 },
      { code: "12", bought: 900, sold: 2400 },
      { code: "45", bought: 300, sold: 6800 },
    ],
  },
  NICA: {
    name: "NIC Asia Bank",
    brokers: [
      { code: "12", bought: 6400, sold: 1200 },
      { code: "4", bought: 3100, sold: 900 },
      { code: "9", bought: 1400, sold: 2600 },
      { code: "45", bought: 800, sold: 6400 },
    ],
  },
  CHCL: {
    name: "Chilime Hydropower",
    brokers: [
      { code: "58", bought: 7200, sold: 600 },
      { code: "4", bought: 2100, sold: 1300 },
      { code: "17", bought: 900, sold: 5400 },
    ],
  },
  GBIME: {
    name: "Global IME Bank",
    brokers: [
      { code: "45", bought: 9800, sold: 1400 },
      { code: "22", bought: 2400, sold: 900 },
      { code: "4", bought: 1200, sold: 8600 },
    ],
  },
};

export const brokerPrints = [
  { symbol: "NABIL", buyer: "33", seller: "58", qty: 200, rate: 498.0, amount: 99600 },
  { symbol: "HDL", buyer: "17", seller: "33", qty: 50, rate: 2412.0, amount: 120600 },
  { symbol: "UPPER", buyer: "58", seller: "12", qty: 500, rate: 612.4, amount: 306200 },
  { symbol: "NABIL", buyer: "4", seller: "33", qty: 100, rate: 498.5, amount: 49850 },
  { symbol: "SAPIL", buyer: "22", seller: "9", qty: 40, rate: 524.6, amount: 20984 },
  { symbol: "SHIVM", buyer: "22", seller: "45", qty: 300, rate: 548.1, amount: 164430 },
  { symbol: "NICA", buyer: "12", seller: "45", qty: 250, rate: 412.6, amount: 103150 },
  { symbol: "CHCL", buyer: "58", seller: "17", qty: 180, rate: 612.0, amount: 110160 },
  { symbol: "GBIME", buyer: "4", seller: "45", qty: 400, rate: 256.0, amount: 102400 },
  { symbol: "CFCL", buyer: "9", seller: "45", qty: 600, rate: 188.4, amount: 113040 },
];

export const brokerNote = {
  code: "58",
  name: "Nabil Investment Banking",
  stars: 4,
  body: "TMS opened the next working day after KYC. Credit for a sale showed up in two days. This is one person’s note in the demo, not a score.",
  by: "A client note",
  date: "3 Ashadh 2083",
};

export const marketHappen = [
  {
    kind: "down" as const,
    title: "NABIL went ex-div",
    sub: "The print dropped as the cash left the price. Not a sudden change in the bank.",
    context: "NABIL",
    stock: "NABIL",
  },
  {
    kind: "up" as const,
    title: "HDL did 42.6 Cr",
    sub: "Busiest name by turnover this session.",
    context: "HDL",
    stock: "HDL",
  },
  {
    kind: "event" as const,
    title: "SAPIL hit the 15% circuit",
    sub: "A daily limit. It is a trading rule, not a verdict on the company.",
    context: "SAPIL",
    stock: "SAPIL",
  },
  {
    kind: "down" as const,
    title: "More names fell than rose",
    sub: "48 rose, 92 fell. A broad session — not a few names dragging the index.",
    context: "NEPSE",
  },
  {
    kind: "ipo" as const,
    title: "Sanima Middle Tamor still open",
    sub: "Primary issue. Application is on MeroShare / C-ASBA.",
    context: "IPO",
  },
];

export type ListedQuote = {
  symbol: string;
  name: string;
  sector: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  prev: number;
  changePct: number;
  volume: string;
  turnover: string;
  weekHigh: number;
  weekLow: number;
};

export const listedQuotes: ListedQuote[] = [
  { symbol: "SAPIL", name: "Sarbottam Poly", sector: "Manufacturing", ltp: 524.6, open: 456.2, high: 524.6, low: 454.0, prev: 456.2, changePct: 14.99, volume: "0.84 L", turnover: "4.2 Cr", weekHigh: 524.6, weekLow: 312.0 },
  { symbol: "MEPDL", name: "Men's Apparel", sector: "Manufacturing", ltp: 603.2, open: 524.8, high: 603.2, low: 521.0, prev: 524.6, changePct: 14.98, volume: "0.61 L", turnover: "3.6 Cr", weekHigh: 603.2, weekLow: 348.0 },
  { symbol: "HDL", name: "Himalayan Distillery", sector: "Manufacturing", ltp: 2412, open: 2334, high: 2438, low: 2320, prev: 2332.6, changePct: 3.4, volume: "1.76 L", turnover: "42.6 Cr", weekHigh: 2680, weekLow: 1984 },
  { symbol: "SHIVM", name: "Shivam Cements", sector: "Manufacturing", ltp: 548.1, open: 542.0, high: 552.4, low: 538.6, prev: 542.1, changePct: 1.1, volume: "1.80 L", turnover: "9.8 Cr", weekHigh: 612, weekLow: 468 },
  { symbol: "SOHL", name: "Shivam Holdings", sector: "Investment", ltp: 687.8, open: 680.0, high: 692.4, low: 678.2, prev: 679.6, changePct: 1.2, volume: "0.42 L", turnover: "2.9 Cr", weekHigh: 742, weekLow: 540 },
  { symbol: "UPPER", name: "Upper Tamakoshi", sector: "Hydropower", ltp: 612.4, open: 610.2, high: 618.0, low: 608.4, prev: 610.4, changePct: 0.33, volume: "2.96 L", turnover: "18.1 Cr", weekHigh: 684, weekLow: 498 },
  { symbol: "CHCL", name: "Chilime Hydropower", sector: "Hydropower", ltp: 612.0, open: 610.0, high: 616.4, low: 608.0, prev: 610.0, changePct: 0.33, volume: "1.12 L", turnover: "6.8 Cr", weekHigh: 670, weekLow: 512 },
  { symbol: "RIDI", name: "Ridi Hydropower", sector: "Hydropower", ltp: 225.0, open: 223.0, high: 227.4, low: 222.6, prev: 223.0, changePct: 0.9, volume: "0.68 L", turnover: "1.5 Cr", weekHigh: 264, weekLow: 164 },
  { symbol: "API", name: "Api Power", sector: "Hydropower", ltp: 327.5, open: 329.8, high: 332.0, low: 325.0, prev: 329.8, changePct: -0.70, volume: "1.04 L", turnover: "3.4 Cr", weekHigh: 370, weekLow: 259 },
  { symbol: "BHL", name: "Balephi Hydropower", sector: "Hydropower", ltp: 201.0, open: 204.0, high: 209.9, low: 200.0, prev: 204.0, changePct: -1.47, volume: "0.88 L", turnover: "1.8 Cr", weekHigh: 264, weekLow: 164 },
  { symbol: "NICA", name: "NIC Asia Bank", sector: "Commercial banks", ltp: 412.6, open: 414.2, high: 416.8, low: 410.4, prev: 414.3, changePct: -0.4, volume: "2.11 L", turnover: "12.4 Cr", weekHigh: 486, weekLow: 372 },
  { symbol: "GBIME", name: "Global IME Bank", sector: "Commercial banks", ltp: 256.0, open: 258.1, high: 259.4, low: 254.8, prev: 258.1, changePct: -0.8, volume: "3.40 L", turnover: "8.7 Cr", weekHigh: 312, weekLow: 228 },
  { symbol: "NABIL", name: "Nabil Bank", sector: "Commercial banks", ltp: 498.0, open: 510.0, high: 512.0, low: 494.1, prev: 511.9, changePct: -2.71, volume: "4.12 L", turnover: "20.6 Cr", weekHigh: 685.0, weekLow: 452.3 },
  { symbol: "ADBL", name: "Agricultural Development Bank", sector: "Development banks", ltp: 412.0, open: 415.3, high: 417.2, low: 410.0, prev: 415.3, changePct: -0.8, volume: "1.22 L", turnover: "5.0 Cr", weekHigh: 468, weekLow: 338 },
  { symbol: "NLIC", name: "Nepal Life", sector: "Life insurance", ltp: 742.0, open: 744.3, high: 748.0, low: 738.6, prev: 744.3, changePct: -0.31, volume: "0.28 L", turnover: "0.8 Cr", weekHigh: 890, weekLow: 612 },
  { symbol: "AHL", name: "Asian Hydropower", sector: "Hydropower", ltp: 480.0, open: 482.4, high: 486.0, low: 478.2, prev: 482.4, changePct: -0.5, volume: "0.54 L", turnover: "2.6 Cr", weekHigh: 540, weekLow: 392 },
  { symbol: "AVYAN", name: "Aviyan Laghubitta", sector: "Microfinance", ltp: 1010.0, open: 1020.0, high: 1022.0, low: 1004.0, prev: 1020.0, changePct: -0.98, volume: "0.36 L", turnover: "3.6 Cr", weekHigh: 1366, weekLow: 906 },
  { symbol: "ACLBSL", name: "Aarambha Chautari Laghubitta", sector: "Microfinance", ltp: 1240.0, open: 1255.0, high: 1262.0, low: 1232.0, prev: 1255.0, changePct: -1.2, volume: "0.22 L", turnover: "2.7 Cr", weekHigh: 1488, weekLow: 980 },
  { symbol: "NTC", name: "Nepal Telecom", sector: "Others", ltp: 890.0, open: 890.0, high: 894.0, low: 886.0, prev: 890.0, changePct: 0, volume: "0.18 L", turnover: "1.6 Cr", weekHigh: 1024, weekLow: 742 },
  { symbol: "CFCL", name: "Central Finance", sector: "Finance", ltp: 188.4, open: 200.7, high: 201.4, low: 186.2, prev: 200.7, changePct: -6.12, volume: "1.84 L", turnover: "3.5 Cr", weekHigh: 246, weekLow: 164 },
  { symbol: "GUFL", name: "Gurkhas Finance", sector: "Finance", ltp: 612.0, open: 618.4, high: 621.0, low: 608.0, prev: 618.4, changePct: -1.04, volume: "0.46 L", turnover: "2.8 Cr", weekHigh: 704, weekLow: 488 },
  { symbol: "BBC", name: "Bishal Bazar Company", sector: "Trading", ltp: 4120.0, open: 4088.0, high: 4148.0, low: 4072.0, prev: 4088.0, changePct: 0.78, volume: "0.08 L", turnover: "3.3 Cr", weekHigh: 4680, weekLow: 3210 },
  { symbol: "NLO", name: "Nepal Lube Oil", sector: "Trading", ltp: 748.0, open: 752.0, high: 756.0, low: 742.0, prev: 752.0, changePct: -0.53, volume: "0.12 L", turnover: "0.9 Cr", weekHigh: 840, weekLow: 610 },
];

export const indexWeekRange = {
  symbol: "NEPSE",
  name: "NEPSE Index",
  ltp: 2622.48,
  weekHigh: 2969.5,
  weekLow: 2418.2,
};

export const weekMoverBoards: Record<"gainers" | "losers", MoverRow[]> = {
  gainers: [
    { rank: 1, symbol: "SAPIL", name: "Sarbottam Poly", price: 524.6, changePct: 22.4, extra: "Week" },
    { rank: 2, symbol: "MEPDL", name: "Men's Apparel", price: 603.2, changePct: 18.6, extra: "Week" },
    { rank: 3, symbol: "HDL", name: "Himalayan Distillery", price: 2412, changePct: 6.8, extra: "Week" },
    { rank: 4, symbol: "RIDI", name: "Ridi Hydropower", price: 225, changePct: 4.2, extra: "Week" },
    { rank: 5, symbol: "SHIVM", name: "Shivam Cements", price: 548.1, changePct: 3.1, extra: "Week" },
  ],
  losers: [
    { rank: 1, symbol: "CFCL", name: "Central Finance", price: 188.4, changePct: -11.4, extra: "Week" },
    { rank: 2, symbol: "NABIL", name: "Nabil Bank", price: 498, changePct: -5.8, extra: "Week" },
    { rank: 3, symbol: "AVYAN", name: "Aviyan Laghubitta", price: 1010, changePct: -4.2, extra: "Week" },
    { rank: 4, symbol: "GBIME", name: "Global IME Bank", price: 256, changePct: -3.6, extra: "Week" },
    { rank: 5, symbol: "BHL", name: "Balephi Hydropower", price: 201, changePct: -3.1, extra: "Week" },
  ],
};

export const defaultDepthSymbols = ["BHL", "AVYAN", "API"];

export type DepthLevel = { price: number; kitta: number; orders: number };

export function depthBook(ltp: number): { bids: DepthLevel[]; asks: DepthLevel[] } {
  const bids = [0.4, 0.9, 1.5, 2.2, 3.1].map((off, i) => ({
    price: Number((ltp - off).toFixed(2)),
    kitta: 2400 - i * 320,
    orders: 11 - i,
  }));
  const asks = [0.3, 0.8, 1.4, 2.1, 2.9].map((off, i) => ({
    price: Number((ltp + off).toFixed(2)),
    kitta: 2100 - i * 280,
    orders: 9 - i,
  }));
  return { bids, asks };
}

export const sectorPalette: Record<string, string> = {
  Hydropower: "var(--deco-violet)",
  "Commercial banks": "var(--deco-teal)",
  Manufacturing: "var(--text-primary)",
  "Development banks": "var(--deco-saffron)",
  Microfinance: "var(--up-base)",
  "Life insurance": "var(--down-base)",
  "Hotels & tourism": "var(--warn-base)",
};

export const liveSectorOrder = [
  "All",
  "Commercial banks",
  "Hydropower",
  "Finance",
  "Trading",
  "Others",
  "Manufacturing",
  "Development banks",
  "Microfinance",
  "Life insurance",
  "Investment",
] as const;

export type NepseSessionDay = {
  month: "Shrawan" | "Bhadra";
  day: number;
  year: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePct: number;
  turnover: string;
  volume: string;
  kitta: string;
  transactions: number;
  companies: number;
  rose: number;
  fell: number;
  unchanged: number;
};

export const nepseHistory: NepseSessionDay[] = [
  { month: "Bhadra", day: 2, year: 2083, date: "2 Bhadra 2083", open: 2638.1, high: 2644.2, low: 2618.4, close: 2622.48, change: -19.34, changePct: -0.73, turnover: "4.82 Arba", volume: "1.84 Cr", kitta: "1.42 Cr", transactions: 148220, companies: 244, rose: 78, fell: 142, unchanged: 21 },
  { month: "Shrawan", day: 31, year: 2083, date: "31 Shrawan 2083", open: 2651.2, high: 2660.4, low: 2638.6, close: 2641.82, change: -8.12, changePct: -0.31, turnover: "5.14 Arba", volume: "1.96 Cr", kitta: "1.51 Cr", transactions: 152410, companies: 248, rose: 94, fell: 118, unchanged: 18 },
  { month: "Shrawan", day: 30, year: 2083, date: "30 Shrawan 2083", open: 2644.8, high: 2668.0, low: 2640.2, close: 2649.94, change: 6.82, changePct: 0.26, turnover: "4.41 Arba", volume: "1.62 Cr", kitta: "1.28 Cr", transactions: 131880, companies: 241, rose: 126, fell: 88, unchanged: 16 },
  { month: "Shrawan", day: 29, year: 2083, date: "29 Shrawan 2083", open: 2638.4, high: 2652.1, low: 2624.6, close: 2643.12, change: 4.28, changePct: 0.16, turnover: "3.96 Arba", volume: "1.48 Cr", kitta: "1.19 Cr", transactions: 124610, companies: 239, rose: 112, fell: 96, unchanged: 22 },
  { month: "Shrawan", day: 28, year: 2083, date: "28 Shrawan 2083", open: 2662.0, high: 2669.4, low: 2631.8, close: 2638.84, change: -22.46, changePct: -0.84, turnover: "5.62 Arba", volume: "2.08 Cr", kitta: "1.66 Cr", transactions: 161240, companies: 252, rose: 61, fell: 168, unchanged: 14 },
  { month: "Shrawan", day: 27, year: 2083, date: "27 Shrawan 2083", open: 2671.6, high: 2684.2, low: 2658.0, close: 2661.3, change: -9.44, changePct: -0.35, turnover: "4.18 Arba", volume: "1.55 Cr", kitta: "1.22 Cr", transactions: 128940, companies: 246, rose: 88, fell: 132, unchanged: 19 },
  { month: "Shrawan", day: 24, year: 2083, date: "24 Shrawan 2083", open: 2658.2, high: 2688.6, low: 2654.4, close: 2670.74, change: 14.62, changePct: 0.55, turnover: "6.08 Arba", volume: "2.22 Cr", kitta: "1.74 Cr", transactions: 172310, companies: 255, rose: 154, fell: 72, unchanged: 12 },
  { month: "Shrawan", day: 23, year: 2083, date: "23 Shrawan 2083", open: 2649.0, high: 2664.8, low: 2638.2, close: 2656.12, change: 8.04, changePct: 0.30, turnover: "4.72 Arba", volume: "1.71 Cr", kitta: "1.36 Cr", transactions: 139220, companies: 243, rose: 118, fell: 101, unchanged: 17 },
  { month: "Shrawan", day: 21, year: 2083, date: "21 Shrawan 2083", open: 2668.4, high: 2672.0, low: 2641.6, close: 2648.08, change: -19.86, changePct: -0.74, turnover: "5.31 Arba", volume: "1.89 Cr", kitta: "1.47 Cr", transactions: 155080, companies: 249, rose: 70, fell: 154, unchanged: 15 },
  { month: "Shrawan", day: 20, year: 2083, date: "20 Shrawan 2083", open: 2660.2, high: 2681.4, low: 2655.8, close: 2667.94, change: 9.18, changePct: 0.35, turnover: "4.55 Arba", volume: "1.64 Cr", kitta: "1.31 Cr", transactions: 133470, companies: 240, rose: 121, fell: 94, unchanged: 20 },
  { month: "Shrawan", day: 17, year: 2083, date: "17 Shrawan 2083", open: 2642.6, high: 2666.8, low: 2639.0, close: 2658.76, change: 16.44, changePct: 0.62, turnover: "5.88 Arba", volume: "2.14 Cr", kitta: "1.69 Cr", transactions: 168540, companies: 251, rose: 148, fell: 78, unchanged: 13 },
  { month: "Shrawan", day: 16, year: 2083, date: "16 Shrawan 2083", open: 2631.4, high: 2650.2, low: 2624.8, close: 2642.32, change: 11.08, changePct: 0.42, turnover: "4.08 Arba", volume: "1.52 Cr", kitta: "1.21 Cr", transactions: 126330, companies: 238, rose: 131, fell: 86, unchanged: 16 },
];

export const nepseCalendarMonths = [
  { id: "bhadra", label: "Bhadra 2083", month: "Bhadra" as const, year: 2083, days: 31, startWeekday: 6 },
  { id: "shrawan", label: "Shrawan 2083", month: "Shrawan" as const, year: 2083, days: 31, startWeekday: 3 },
];



/* ── Baskets ────────────────────────────────────────────────────────────────
   A basket is a filter, not a portfolio. Every one names the column that put
   a company on the list, so the same number is on the row and in the table. */

export type BasketLead = "move" | "turnover" | "offHigh" | "nearHigh" | "offLow" | "nearLow";

const offHigh = (q: ListedQuote) => ((q.ltp - q.weekHigh) / q.weekHigh) * 100;
const offLow = (q: ListedQuote) => ((q.ltp - q.weekLow) / q.weekLow) * 100;

export const basketLeads: Record<
  BasketLead,
  { label: string; unit: "pct" | "cr"; dir: "asc" | "desc"; value: (q: ListedQuote) => number }
> = {
  move: { label: "% Chg", unit: "pct", dir: "desc", value: (q) => q.changePct },
  turnover: { label: "Turnover", unit: "cr", dir: "desc", value: (q) => Number.parseFloat(q.turnover) },
  offHigh: { label: "Off 52W high", unit: "pct", dir: "asc", value: offHigh },
  nearHigh: { label: "Off 52W high", unit: "pct", dir: "desc", value: offHigh },
  offLow: { label: "Above 52W low", unit: "pct", dir: "desc", value: offLow },
  nearLow: { label: "Above 52W low", unit: "pct", dir: "asc", value: offLow },
};

export type Basket = {
  id: string;
  audience: "traders" | "investors";
  title: string;
  /** The filter in plain words. This is the only description a basket gets. */
  note: string;
  lead: BasketLead;
  /** Free members see the row and its numbers, but not the names inside. */
  plan?: "plus" | "pro";
  fresh?: boolean;
  members: string[];
};

export const basketCatalog: Basket[] = [
  { id: "leaders", audience: "traders", title: "Upward leaders", note: "Furthest above the 52-week low", lead: "offLow", fresh: true, members: ["SAPIL", "MEPDL", "HDL", "SHIVM", "SOHL", "BBC"] },
  { id: "mom", audience: "traders", title: "Momentum movers", note: "Up today on heavy turnover", lead: "move", members: ["HDL", "SHIVM", "UPPER", "SOHL", "BBC", "RIDI"] },
  { id: "fallers", audience: "traders", title: "The fallers", note: "Furthest below the 52-week high", lead: "offHigh", members: ["CFCL", "NABIL", "ACLBSL", "AVYAN", "NLIC", "GBIME"] },
  { id: "peak", audience: "traders", title: "Near peak", note: "Within reach of the 52-week high", lead: "nearHigh", members: ["SAPIL", "MEPDL", "HDL", "SHIVM"] },
  { id: "bottom", audience: "traders", title: "Near bottom", note: "Sitting close to the 52-week low", lead: "nearLow", members: ["CFCL", "NABIL", "BHL", "RIDI", "GBIME"] },
  { id: "lowcap", audience: "traders", title: "Low cap", note: "Smallest listed capital", lead: "turnover", members: ["RIDI", "BHL", "API", "CFCL", "GUFL", "NLO"] },
  { id: "mid", audience: "traders", title: "Mid cap", note: "Middle of the listed capital board", lead: "turnover", members: ["SHIVM", "NICA", "ADBL", "AHL", "GUFL", "SOHL"] },
  { id: "large", audience: "traders", title: "Large cap", note: "Largest listed capital", lead: "turnover", members: ["NABIL", "NTC", "NLIC", "BBC", "HDL", "NICA"] },
  { id: "fav", audience: "traders", title: "Broker favourites", note: "Most traded by the busiest desks", lead: "turnover", plan: "plus", members: ["NABIL", "HDL", "UPPER", "GBIME", "NICA"] },
  { id: "margin", audience: "investors", title: "Margin applicable", note: "Accepted as loan collateral", lead: "turnover", members: ["NABIL", "NICA", "GBIME", "ADBL", "NTC", "NLIC"] },
  { id: "earn", audience: "investors", title: "Earning excellence", note: "Profit up four quarters running", lead: "move", plan: "plus", members: ["NABIL", "NTC", "BBC", "HDL", "UPPER"] },
  { id: "sip", audience: "investors", title: "SIP on stocks", note: "Traded every session this year", lead: "turnover", fresh: true, members: ["NABIL", "NTC", "UPPER", "NLIC", "ADBL"] },
  { id: "banks-b", audience: "investors", title: "Commercial banks", note: "Sector: commercial banks", lead: "turnover", members: ["NABIL", "NICA", "GBIME"] },
  { id: "hydro-b", audience: "investors", title: "Hydropower", note: "Sector: hydropower", lead: "turnover", members: ["UPPER", "CHCL", "RIDI", "API", "BHL", "AHL"] },
  { id: "micro", audience: "investors", title: "Microfinance", note: "Sector: microfinance", lead: "turnover", members: ["AVYAN", "ACLBSL"] },
  { id: "stars", audience: "investors", title: "Rising stars", note: "Listed under two years", lead: "offLow", members: ["SAPIL", "MEPDL", "SOHL"] },
  { id: "exdate", audience: "investors", title: "Ex-date this week", note: "Book close inside seven days", lead: "move", members: ["NABIL", "SOHL", "NLIC", "ADBL"] },
  { id: "list", audience: "investors", title: "Recent listings", note: "First year on the board", lead: "move", members: ["SAPIL", "MEPDL"] },
];

export type BasketRow = Basket & {
  quotes: ListedQuote[];
  count: number;
  /** Simple average of member moves — every name counts the same. */
  changePct: number;
  up: number;
  down: number;
};

function buildBasket(basket: Basket): BasketRow {
  const lead = basketLeads[basket.lead];
  const quotes = basket.members
    .map((symbol) => listedQuotes.find((row) => row.symbol === symbol))
    .filter((row): row is ListedQuote => Boolean(row))
    .sort((a, b) => (lead.dir === "asc" ? lead.value(a) - lead.value(b) : lead.value(b) - lead.value(a)));
  const mean = quotes.length
    ? quotes.reduce((sum, row) => sum + row.changePct, 0) / quotes.length
    : 0;
  return {
    ...basket,
    quotes,
    count: quotes.length,
    changePct: Math.round(mean * 100) / 100,
    up: quotes.filter((row) => row.changePct > 0).length,
    down: quotes.filter((row) => row.changePct < 0).length,
  };
}

export const basketRows: BasketRow[] = basketCatalog.map(buildBasket);

export function getBasketRow(id: string) {
  return basketRows.find((row) => row.id === id);
}

/* ── Alerts ─────────────────────────────────────────────────────────────────
   Rules a member wrote. They remind; they never place an order. */
export type AlertRule = {
  id: string;
  name: string;
  symbol: string;
  cross: "above" | "below";
  price: number;
  expiry: string;
  channels: ("app" | "email")[];
  message?: string;
  expired?: boolean;
  firedAt?: string;
};

export const alertRules: AlertRule[] = [
  { id: "a1", name: "NABIL entry watch", symbol: "NABIL", cross: "below", price: 480, expiry: "30 Bhadra 2083", channels: ["app"], message: "Check the book close date first.", firedAt: "2:41 PM" },
  { id: "a2", name: "UPPER breakout", symbol: "UPPER", cross: "above", price: 640, expiry: "15 Ashwin 2083", channels: ["app", "email"] },
  { id: "a3", name: "HDL cool-off", symbol: "HDL", cross: "below", price: 2200, expiry: "30 Bhadra 2083", channels: ["email"] },
  { id: "a4", name: "SHIVM dip", symbol: "SHIVM", cross: "below", price: 520, expiry: "31 Shrawan 2083", channels: ["app"], expired: true, firedAt: "28 Shrawan" },
  { id: "a5", name: "NTC target", symbol: "NTC", cross: "above", price: 1180, expiry: "15 Shrawan 2083", channels: ["app", "email"], expired: true },
];

/* ── Notifications ──────────────────────────────────────────────────────────
   What already happened: a rule that fired, a corporate action, an IPO date. */
export type NotificationKind = "alert" | "corporate" | "ipo" | "book";

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  sub: string;
  at: string;
  day: "today" | "earlier";
  read: boolean;
  symbol?: string;
};

export const notifications: NotificationItem[] = [
  { id: "n1", kind: "alert", symbol: "NABIL", title: "NABIL fell below 500.00", at: "2:41 PM", day: "today", read: false, sub: "Your alert “NABIL entry watch”" },
  { id: "n2", kind: "alert", symbol: "UPPER", title: "UPPER crossed 610.00", at: "1:18 PM", day: "today", read: false, sub: "Your alert “UPPER breakout”" },
  { id: "n3", kind: "corporate", symbol: "SAPIL", title: "SAPIL hit the 15% circuit", at: "12:06 PM", day: "today", read: false, sub: "Trading capped for the day" },
  { id: "n4", kind: "corporate", symbol: "NABIL", title: "NABIL cash dividend", at: "10:02 AM", day: "today", read: true, sub: "10% · ex-date today" },
  { id: "n5", kind: "book", symbol: "NABIL", title: "EDIS due", at: "Yesterday", day: "earlier", read: true, sub: "200 kitta NABIL · T+2 closeout risk" },
  { id: "n6", kind: "ipo", title: "Himalayan Hydropower IPO", at: "Yesterday", day: "earlier", read: true, sub: "Closes in 2 days" },
  { id: "n7", kind: "book", title: "Broker 33 statement imported", at: "2 days ago", day: "earlier", read: true, sub: "14 transactions added to your book" },
];

/* The rest of the day — the part behind the plan wall on the full list. */
export const moreHappen = [
  { kind: "event" as const, title: "GBIME AGM on Bhadra 18", sub: "Book close passed on Bhadra 4.", context: "Watchlist", stock: "GBIME" },
  { kind: "up" as const, title: "Banks turned after four flat days", sub: "NICA +2.1%, ADBL +1.8%. Sector up 1.2%.", context: "You hold 1", stock: "NICA" },
  { kind: "down" as const, title: "SHIVM gave back the week", sub: "−4.6% on 2.1 Cr turnover.", context: "Watchlist", stock: "SHIVM" },
  { kind: "ipo" as const, title: "Avyan Hydro allotment on Bhadra 9", sub: "1.2 lakh applicants for 4 lakh kitta.", context: "Not applied", stock: "AVYAN" },
  { kind: "event" as const, title: "NTC dividend reaches your bank", sub: "Rs 4,200 for 240 kitta.", context: "Yours", stock: "NTC" },
  { kind: "up" as const, title: "Turnover crossed 9 Cr in the last hour", sub: "Hydropower took 41% of the day.", context: "Market", stock: "UPPER" },
];

/* ── Mood, and what Tulkey makes of it ──────────────────────────────────────
   A reading of where a price sits and how it got there. Never a call. */
export type GreedRead = {
  score: number;
  label: string;
  note: string;
};

export function greedRead(symbol: string): GreedRead {
  const quote = listedQuotes.find((row) => row.symbol === symbol);
  const span = quote ? quote.weekHigh - quote.weekLow || 1 : 1;
  const place = quote ? ((quote.ltp - quote.weekLow) / span) * 100 : 50;
  const move = quote ? quote.changePct : 0;
  const raw = 0.6 * place + 0.4 * (50 + move * 6);
  const score = Math.max(3, Math.min(97, Math.round(raw)));
  const label =
    score < 25 ? "Fear" : score < 45 ? "Cautious" : score < 56 ? "Neutral" : score < 76 ? "Warm" : "Greed";
  const note = quote
    ? `${Math.round(place)}% up its 52-week range, ${move < 0 ? "down" : "up"} ${Math.abs(move).toFixed(2)}% today.`
    : "Not enough prints to read.";
  return { score, label, note };
}

/** Tulkey's read on the open stock page — plain words, no call to act. */
export const stockTake = {
  summary:
    "Most of today's 2.71% fall is the 10% cash dividend leaving the price on its ex-date, not the business changing. Turnover ran heavier than a usual NABIL day, and the price now sits in the lower fifth of its 52-week range.",
};
