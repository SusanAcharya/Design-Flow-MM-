import { holdings, type BookRange, type SectorRow } from "./data";
import type { MarketSession } from "./types";

/** Spec §10 — every derived number has one definition, computed in one place. */

export const perfRanges: BookRange[] = ["1D", "1W", "1M", "3M", "6M", "1Y", "All"];

export type Holding = {
  symbol: string;
  name: string;
  sector: string;
  kitta: number;
  /** Weighted average cost of the current position. */
  wacc: number;
  ltp: number;
  prevClose: number;
  dayPct: number;
  marketValue: number;
  costBasis: number;
  dayPl: number;
  totalPl: number;
  plPct: number;
  weight: number;
  /** Dividend recorded against this holding, not a forecast. */
  dividend: number;
  low52: number;
  high52: number;
  /** LTP position inside the 52-week range, 0–1. */
  range52: number;
  /** Spec §14 — missing history must be visible, not smoothed over. */
  incomplete?: string;
  /** Spec §14 — pending corporate action, no silent adjustment. */
  pending?: string;
};

const extras: Record<
  string,
  { dividend: number; low52: number; high52: number; incomplete?: string; pending?: string }
> = {
  NABIL: { dividend: 15800, low52: 452.3, high52: 685.0, pending: "Cash dividend 10% — ex-date today" },
  UPPER: { dividend: 4200, low52: 448.0, high52: 664.9 },
  NICA: { dividend: 3400, low52: 396.1, high52: 612.0 },
  SHIVM: { dividend: 0, low52: 402.0, high52: 588.4, pending: "8% bonus on the AGM agenda" },
  HDL: { dividend: 0, low52: 1780.0, high52: 2544.0 },
  SOHL: { dividend: 1800, low52: 512.4, high52: 724.0 },
  CHCL: { dividend: 2600, low52: 486.0, high52: 648.2 },
  GBIME: {
    dividend: 0,
    low52: 214.0,
    high52: 328.6,
    incomplete: "One buy from Poush has no price recorded, so average cost is an estimate.",
  },
  RIDI: { dividend: 1200, low52: 168.0, high52: 258.0 },
  NRIC: { dividend: 9600, low52: 742.0, high52: 1012.0 },
  NTC: { dividend: 12000, low52: 812.5, high52: 1064.0 },
};

type RawRow = {
  symbol: string;
  name: string;
  sector: string;
  kitta: number;
  avg: number;
  ltp: number;
  dayPct: number;
};

/** A second, separate book — its own holdings, its own WACC, its own history. */
const longTermRows: RawRow[] = [
  { symbol: "NRIC", name: "Nepal Reinsurance", sector: "Insurance", kitta: 240, avg: 828, ltp: 902.4, dayPct: 0.62 },
  { symbol: "NTC", name: "Nepal Telecom", sector: "Telecom", kitta: 150, avg: 918, ltp: 874.5, dayPct: -1.1 },
  { symbol: "UPPER", name: "Upper Tamakoshi", sector: "Hydropower", kitta: 110, avg: 498.2, ltp: 612.4, dayPct: 0.33 },
];

function derive(source: RawRow[]): Holding[] {
  const rows = source.map((row) => {
    const marketValue = row.kitta * row.ltp;
    const costBasis = row.kitta * row.avg;
    const prevClose = row.ltp / (1 + row.dayPct / 100);
    const extra = extras[row.symbol] ?? { dividend: 0, low52: row.ltp * 0.8, high52: row.ltp * 1.2 };
    return {
      symbol: row.symbol,
      name: row.name,
      sector: row.sector,
      kitta: row.kitta,
      wacc: row.avg,
      ltp: row.ltp,
      prevClose,
      dayPct: row.dayPct,
      marketValue,
      costBasis,
      dayPl: row.kitta * (row.ltp - prevClose),
      totalPl: marketValue - costBasis,
      plPct: ((marketValue - costBasis) / costBasis) * 100,
      weight: 0,
      dividend: extra.dividend,
      low52: extra.low52,
      high52: extra.high52,
      range52: (row.ltp - extra.low52) / (extra.high52 - extra.low52),
      incomplete: extra.incomplete,
      pending: extra.pending,
    };
  });
  const total = rows.reduce((sum, row) => sum + row.marketValue, 0);
  return rows
    .map((row) => ({ ...row, weight: (row.marketValue / total) * 100 }))
    .sort((a, b) => b.marketValue - a.marketValue);
}

const sectorLook: Record<string, { short: string; color: string; label: string }> = {
  Banking: { short: "BANKS", color: "#5b8cff", label: "Banks" },
  Hydropower: { short: "HYDRO", color: "#32e36a", label: "Hydropower" },
  Manufacturing: { short: "MFG", color: "#f08c00", label: "Manufacturing" },
  Distillery: { short: "DIST", color: "#d4a84a", label: "Distillery" },
  Investment: { short: "INV", color: "#a78bfa", label: "Investment" },
  Insurance: { short: "INS", color: "#ff7ab2", label: "Insurance" },
  Telecom: { short: "TEL", color: "#4dd6c1", label: "Telecom" },
};

/** Spec §3.4 / §9 — sector weight derived from the same market value as the hero. */
function sectorsFor(rows: Holding[]): SectorRow[] {
  const total = rows.reduce((sum, row) => sum + row.marketValue, 0);
  if (total === 0) return [];
  const groups = new Map<string, Holding[]>();
  for (const row of rows) {
    const list = groups.get(row.sector) ?? [];
    list.push(row);
    groups.set(row.sector, list);
  }
  return [...groups.entries()]
    .map(([sector, group]) => {
      const look = sectorLook[sector] ?? { short: sector.slice(0, 5).toUpperCase(), color: "#8b8b8b", label: sector };
      const value = group.reduce((sum, row) => sum + row.marketValue, 0);
      const prev = group.reduce((sum, row) => sum + row.kitta * row.prevClose, 0);
      return {
        name: look.label,
        short: look.short,
        color: look.color,
        value,
        pct: Math.round((value / total) * 1000) / 10,
        changePct: prev === 0 ? 0 : Math.round(((value - prev) / prev) * 10000) / 100,
        symbols: group.map((row) => row.symbol),
      };
    })
    .sort((a, b) => b.value - a.value);
}

export type PortfolioId = "main" | "long" | "fresh" | "side";
export type PortfolioKind = "individual" | "company";

type PortfolioDef = {
  id: PortfolioId;
  name: string;
  note: string;
  rows: RawRow[];
  /** Recorded, not inferred — realised P/L comes from the transaction log. */
  realised: number;
  cashNoted: number;
};

const defs: PortfolioDef[] = [
  { id: "main", name: "My Portfolio", note: "Everything I trade", rows: holdings, realised: 38600, cashNoted: 215000 },
  { id: "long", name: "Long term", note: "Hold for 5 years", rows: longTermRows, realised: 0, cashNoted: 0 },
  { id: "fresh", name: "New portfolio", note: "Just created", rows: [], realised: 0, cashNoted: 0 },
  { id: "side", name: "Another book", note: "Just created", rows: [], realised: 0, cashNoted: 0 },
];

export type BookTotals = {
  id: PortfolioId;
  name: string;
  note: string;
  count: number;
  kitta: number;
  marketValue: number;
  costBasis: number;
  unrealised: number;
  unrealisedPct: number;
  dayPl: number;
  dayPlPct: number;
  realised: number;
  dividends: number;
  totalReturn: number;
  totalReturnPct: number;
  cashNoted: number;
  incompleteCount: number;
};

function totals(def: PortfolioDef, rows: Holding[]): BookTotals {
  const marketValue = rows.reduce((sum, row) => sum + row.marketValue, 0);
  const costBasis = rows.reduce((sum, row) => sum + row.costBasis, 0);
  const dayPl = rows.reduce((sum, row) => sum + row.dayPl, 0);
  const dividends = rows.reduce((sum, row) => sum + row.dividend, 0);
  const unrealised = marketValue - costBasis;
  const prevValue = marketValue - dayPl;
  const totalReturn = unrealised + def.realised + dividends;
  return {
    id: def.id,
    name: def.name,
    note: def.note,
    count: rows.length,
    kitta: rows.reduce((sum, row) => sum + row.kitta, 0),
    marketValue,
    costBasis,
    unrealised,
    unrealisedPct: costBasis === 0 ? 0 : (unrealised / costBasis) * 100,
    dayPl,
    dayPlPct: prevValue === 0 ? 0 : (dayPl / prevValue) * 100,
    realised: def.realised,
    dividends,
    totalReturn,
    totalReturnPct: costBasis === 0 ? 0 : (totalReturn / costBasis) * 100,
    cashNoted: def.cashNoted,
    /** Spec §14 — at least one position has incomplete history. */
    incompleteCount: rows.filter((row) => row.incomplete).length,
  };
}

export type Book = {
  totals: BookTotals;
  holdings: Holding[];
  sectors: SectorRow[];
};

const books = new Map<PortfolioId, Book>();

export function bookFor(id: PortfolioId): Book {
  const cached = books.get(id);
  if (cached) return cached;
  const def = defs.find((item) => item.id === id) ?? defs[0];
  const rows = derive(def.rows);
  const next = { totals: totals(def, rows), holdings: rows, sectors: sectorsFor(rows) };
  books.set(id, next);
  return next;
}

export const portfolioList = defs.map((def) => bookFor(def.id).totals);

/** Home and anything outside the Portfolio destination reads the default book. */
export const bookHoldings = bookFor("main").holdings;
export const book = bookFor("main").totals;

export type Freshness = {
  state: "live" | "closed" | "stale";
  label: string;
  detail: string;
};

export function freshness(session: MarketSession): Freshness {
  if (session === "open") {
    return {
      state: "live",
      label: "Live",
      detail: "Prices update through the session. Last print 12:42 PM.",
    };
  }
  return {
    state: "closed",
    label: "Market closed",
    detail: "Values use the closing print at 3:00 PM, 2 Bhadra 2083.",
  };
}

export const bookSectorRows = bookFor("main").sectors;

/** Spec §3.5 — never more than three, each one actionable. */
export type AttentionItem = {
  id: string;
  kind: "event" | "gap" | "alert";
  title: string;
  body: string;
  action: string;
  symbol?: string;
};

export const attention: AttentionItem[] = [
  {
    id: "nabil-div",
    kind: "event",
    title: "NABIL book closure in 5 days",
    body: "Cash dividend 10% on 790 kitta. Eligibility is set on 7 Bhadra.",
    action: "See event",
    symbol: "NABIL",
  },
  {
    id: "gbime-gap",
    kind: "gap",
    title: "GBIME cost basis is incomplete",
    body: "A buy from Poush has no price recorded, so its average cost and P/L are estimates.",
    action: "Fix transaction",
    symbol: "GBIME",
  },
  {
    id: "nabil-alert",
    kind: "alert",
    title: "Your NABIL alert fired at 2:41 PM",
    body: "Price fell below Rs 500.00. Alerts describe movement, not a decision.",
    action: "Open alert",
    symbol: "NABIL",
  },
  {
    id: "nric-agm",
    kind: "event",
    title: "NRIC AGM record date on 14 Bhadra",
    body: "You hold 240 kitta. The agenda includes a 12% bonus proposal.",
    action: "See event",
    symbol: "NRIC",
  },
];

/** Each book only ever shows records that belong to its own holdings. */
export function attentionFor(id: PortfolioId) {
  const owned = new Set(bookFor(id).holdings.map((row) => row.symbol));
  return attention.filter((item) => !item.symbol || owned.has(item.symbol)).slice(0, 3);
}

/** Spec §6 — charges are a breakdown, never one unexplained fee, and the rules are versioned. */
export const chargeRules = { version: "SEBON / NEPSE rates, Shrawan 2083" };

const commissionSlabs = [
  { upTo: 50_000, rate: 0.0036 },
  { upTo: 500_000, rate: 0.0033 },
  { upTo: 2_000_000, rate: 0.0031 },
  { upTo: 10_000_000, rate: 0.0027 },
  { upTo: Infinity, rate: 0.0024 },
];

export function buyCharges(amount: number) {
  const slab = commissionSlabs.find((row) => amount <= row.upTo) ?? commissionSlabs[0];
  const commission = amount === 0 ? 0 : Math.max(10, amount * slab.rate);
  const sebon = amount * 0.00015;
  const dp = amount === 0 ? 0 : 25;
  const rows = [
    {
      label: "Broker commission",
      note: `${(slab.rate * 100).toFixed(2)}% slab, minimum Rs 10`,
      value: commission,
    },
    { label: "SEBON fee", note: "0.015% of transaction value", value: sebon },
    { label: "DP charge", note: "Rs 25 per company per day", value: dp },
  ];
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return { rows, total, payable: amount + total };
}

export type TxnType =
  | "Buy"
  | "Sell"
  | "Bonus"
  | "Right share"
  | "Dividend"
  | "Transfer in"
  | "Transfer out"
  | "Adjustment";

export type Txn = {
  id: string;
  /** Which book this entry belongs to. Records never leak between books. */
  pf?: PortfolioId;
  date: string;
  month: string;
  symbol: string;
  type: TxnType;
  kitta?: number;
  price?: number;
  amount: number;
  /** Position after this entry, so the audit trail explains every quantity change. */
  kittaAfter?: number;
  waccAfter?: number;
  fees?: { label: string; value: number }[];
  note?: string;
  corporate?: boolean;
};

export const activity: Txn[] = [
  {
    id: "t1",
    date: "1 Bhadra 2083",
    month: "Bhadra 2083",
    symbol: "HDL",
    type: "Buy",
    kitta: 20,
    price: 2332.7,
    amount: 46654,
    kittaAfter: 60,
    waccAfter: 2180,
    fees: [
      { label: "Broker commission", value: 167.9 },
      { label: "SEBON fee", value: 7.0 },
      { label: "DP charge", value: 25 },
    ],
  },
  {
    id: "t2",
    date: "29 Shrawan 2083",
    month: "Shrawan 2083",
    symbol: "SOHL",
    type: "Dividend",
    amount: 1800,
    note: "Cash dividend 10% on 120 kitta · Rs 1,800 gross, Rs 1,710 net after 5% tax",
    corporate: true,
  },
  {
    id: "t3",
    date: "24 Shrawan 2083",
    month: "Shrawan 2083",
    symbol: "NICA",
    type: "Sell",
    kitta: 100,
    price: 431.2,
    amount: 43120,
    kittaAfter: 500,
    waccAfter: 438,
    fees: [
      { label: "Broker commission", value: 155.2 },
      { label: "SEBON fee", value: 6.5 },
      { label: "DP charge", value: 25 },
      { label: "Capital gain tax (7.5%)", value: 397.5 },
    ],
    note: "Realised P/L Rs −680 on this lot",
  },
  {
    id: "t4",
    date: "17 Shrawan 2083",
    month: "Shrawan 2083",
    symbol: "SHIVM",
    type: "Bonus",
    kitta: 22,
    amount: 0,
    kittaAfter: 300,
    waccAfter: 512.6,
    note: "8% bonus · 278 kitta → 300 kitta. Cost basis unchanged, average cost restated.",
    corporate: true,
  },
  {
    id: "t5",
    date: "9 Shrawan 2083",
    month: "Shrawan 2083",
    symbol: "UPPER",
    type: "Right share",
    kitta: 84,
    price: 100,
    amount: 8400,
    kittaAfter: 420,
    waccAfter: 540,
    note: "1:5 rights, entitlement 84 kitta, all purchased at Rs 100",
    corporate: true,
  },
  {
    id: "t6",
    date: "28 Ashadh 2083",
    month: "Ashadh 2083",
    symbol: "GBIME",
    type: "Buy",
    kitta: 80,
    amount: 0,
    kittaAfter: 200,
    note: "Price not recorded — average cost for this holding is an estimate until you fix it.",
  },
  {
    id: "t7",
    date: "12 Ashadh 2083",
    month: "Ashadh 2083",
    symbol: "NABIL",
    type: "Buy",
    kitta: 180,
    price: 462.4,
    amount: 83232,
    kittaAfter: 790,
    waccAfter: 462.4,
    fees: [
      { label: "Broker commission", value: 299.6 },
      { label: "SEBON fee", value: 12.5 },
      { label: "DP charge", value: 25 },
    ],
  },
  {
    id: "t8",
    pf: "long",
    date: "19 Ashadh 2083",
    month: "Ashadh 2083",
    symbol: "NTC",
    type: "Dividend",
    amount: 12000,
    note: "Cash dividend 80% on 150 kitta · Rs 11,400 net after 5% tax",
    corporate: true,
  },
  {
    id: "t9",
    pf: "long",
    date: "3 Jestha 2083",
    month: "Jestha 2083",
    symbol: "NRIC",
    type: "Buy",
    kitta: 240,
    price: 828,
    amount: 198720,
    kittaAfter: 240,
    waccAfter: 828,
    fees: [
      { label: "Broker commission", value: 655.8 },
      { label: "SEBON fee", value: 29.8 },
      { label: "DP charge", value: 25 },
    ],
  },
  {
    id: "t10",
    pf: "long",
    date: "26 Baisakh 2083",
    month: "Baisakh 2083",
    symbol: "NTC",
    type: "Buy",
    kitta: 150,
    price: 918,
    amount: 137700,
    kittaAfter: 150,
    waccAfter: 918,
    fees: [
      { label: "Broker commission", value: 454.4 },
      { label: "SEBON fee", value: 20.7 },
      { label: "DP charge", value: 25 },
    ],
  },
];

export type IncomeTab = "Dividends" | "Bonus" | "Rights" | "Book closures";
export const incomeTabs: IncomeTab[] = ["Dividends", "Bonus", "Rights", "Book closures"];

export type IncomeStatus = "Announced" | "Eligible" | "Received" | "Recorded";

export type IncomeEvent = {
  id: string;
  pf?: PortfolioId;
  tab: IncomeTab;
  symbol: string;
  name: string;
  kind: string;
  rate: string;
  eligible: number;
  gross: number;
  tax: number;
  net: number;
  status: IncomeStatus;
  dates: string;
  /** Spec §8 — bonus and rights always show before → after. */
  before?: number;
  after?: number;
};

export const incomeEvents: IncomeEvent[] = [
  {
    id: "i1",
    tab: "Dividends",
    symbol: "SOHL",
    name: "Shivam Holdings",
    kind: "Cash dividend",
    rate: "10% on Rs 100 paid-up",
    eligible: 120,
    gross: 1800,
    tax: 90,
    net: 1710,
    status: "Received",
    dates: "Book closure 2 Shrawan · paid 29 Shrawan",
  },
  {
    id: "i2",
    tab: "Dividends",
    symbol: "NABIL",
    name: "Nabil Bank",
    kind: "Cash dividend",
    rate: "10% on Rs 100 paid-up",
    eligible: 790,
    gross: 7900,
    tax: 395,
    net: 7505,
    status: "Eligible",
    dates: "Ex-date today · book closure 7 Bhadra",
  },
  {
    id: "i3",
    tab: "Dividends",
    symbol: "CHCL",
    name: "Chilime Hydropower",
    kind: "Cash dividend",
    rate: "14.5% on Rs 100 paid-up",
    eligible: 180,
    gross: 2610,
    tax: 130,
    net: 2480,
    status: "Recorded",
    dates: "Book closure 18 Ashadh · paid 4 Shrawan",
  },
  {
    id: "i4",
    tab: "Bonus",
    symbol: "SHIVM",
    name: "Shivam Cements",
    kind: "Bonus share",
    rate: "8% bonus",
    eligible: 278,
    gross: 0,
    tax: 0,
    net: 0,
    status: "Recorded",
    dates: "Credited 17 Shrawan",
    before: 278,
    after: 300,
  },
  {
    id: "i5",
    tab: "Bonus",
    symbol: "NABIL",
    name: "Nabil Bank",
    kind: "Bonus share",
    rate: "5% bonus on the AGM agenda",
    eligible: 790,
    gross: 0,
    tax: 0,
    net: 0,
    status: "Announced",
    dates: "AGM 24 Bhadra · not yet approved",
    before: 790,
    after: 829,
  },
  {
    id: "i6",
    tab: "Rights",
    symbol: "UPPER",
    name: "Upper Tamakoshi",
    kind: "Right share 1:5",
    rate: "Rs 100 per right share",
    eligible: 336,
    gross: 8400,
    tax: 0,
    net: 8400,
    status: "Recorded",
    dates: "Applied 4 Shrawan · credited 9 Shrawan",
    before: 336,
    after: 420,
  },
  {
    id: "i7",
    tab: "Book closures",
    symbol: "NABIL",
    name: "Nabil Bank",
    kind: "Book closure",
    rate: "Cash dividend 10% + 5% bonus proposed",
    eligible: 790,
    gross: 7900,
    tax: 395,
    net: 7505,
    status: "Eligible",
    dates: "7 Bhadra 2083",
  },
  {
    id: "i8",
    tab: "Book closures",
    symbol: "RIDI",
    name: "Ridi Hydropower",
    kind: "AGM record date",
    rate: "No distribution proposed",
    eligible: 150,
    gross: 0,
    tax: 0,
    net: 0,
    status: "Announced",
    dates: "11 Bhadra 2083",
  },
  {
    id: "i9",
    pf: "long",
    tab: "Dividends",
    symbol: "NTC",
    name: "Nepal Telecom",
    kind: "Cash dividend",
    rate: "80% on Rs 100 paid-up",
    eligible: 150,
    gross: 12000,
    tax: 600,
    net: 11400,
    status: "Received",
    dates: "Book closure 6 Ashadh · paid 19 Ashadh",
  },
  {
    id: "i10",
    pf: "long",
    tab: "Dividends",
    symbol: "NRIC",
    name: "Nepal Reinsurance",
    kind: "Cash dividend",
    rate: "40% on Rs 100 paid-up",
    eligible: 240,
    gross: 9600,
    tax: 480,
    net: 9120,
    status: "Received",
    dates: "Book closure 28 Jestha · paid 11 Ashadh",
  },
  {
    id: "i11",
    pf: "long",
    tab: "Bonus",
    symbol: "NRIC",
    name: "Nepal Reinsurance",
    kind: "Bonus share",
    rate: "12% bonus on the AGM agenda",
    eligible: 240,
    gross: 0,
    tax: 0,
    net: 0,
    status: "Announced",
    dates: "AGM record date 14 Bhadra · not yet approved",
    before: 240,
    after: 268,
  },
];

export function incomeFor(id: PortfolioId) {
  return incomeEvents.filter((row) => (row.pf ?? "main") === id);
}

export function activityFor(id: PortfolioId) {
  return activity.filter((row) => (row.pf ?? "main") === id);
}

/** Spec §9 — contribution to portfolio P/L, not a ranking of "good" stocks. */
export function contributors(rows: Holding[], direction: "win" | "lose", count = 4) {
  return [...rows]
    .sort((a, b) => (direction === "win" ? b.totalPl - a.totalPl : a.totalPl - b.totalPl))
    .filter((row) => (direction === "win" ? row.totalPl > 0 : row.totalPl < 0))
    .slice(0, count);
}

/* ---------------------------------------- Per-holding news and deadlines */

export type StockEventKind = "deadline" | "result" | "news" | "meeting";

export type StockEvent = {
  id: string;
  symbol: string;
  kind: StockEventKind;
  title: string;
  sub: string;
  /** Nepali date the event lands on. */
  date: string;
  /** Set for anything you can still miss. */
  daysLeft?: number;
  source?: string;
};

export const stockEvents: StockEvent[] = [
  {
    id: "e1",
    symbol: "NABIL",
    kind: "deadline",
    title: "Book closure for 10% cash dividend",
    sub: "Hold 790 kitta through this date to stay eligible",
    date: "7 Bhadra 2083",
    daysLeft: 5,
  },
  {
    id: "e2",
    symbol: "NABIL",
    kind: "meeting",
    title: "Annual general meeting",
    sub: "Agenda: 10% cash dividend and 5% bonus approval",
    date: "24 Bhadra 2083",
    daysLeft: 22,
  },
  {
    id: "e3",
    symbol: "NABIL",
    kind: "result",
    title: "Q4 report published",
    sub: "Net profit Rs 7,940 L, up 8.2%. EPS 27.05, NPL 1.2%.",
    date: "28 Shrawan 2083",
    source: "Company disclosure",
  },
  {
    id: "e4",
    symbol: "NABIL",
    kind: "news",
    title: "Trading ex-dividend from today",
    sub: "The price opened lower by roughly the dividend amount. That is mechanical, not a fall.",
    date: "2 Bhadra 2083",
    source: "NEPSE notice",
  },
  {
    id: "e5",
    symbol: "SHIVM",
    kind: "deadline",
    title: "AGM record date for 8% bonus",
    sub: "Your 300 kitta would become 324 kitta if approved",
    date: "18 Bhadra 2083",
    daysLeft: 16,
  },
  {
    id: "e6",
    symbol: "SHIVM",
    kind: "news",
    title: "Clinker plant running at full capacity",
    sub: "Management guided to higher volumes for the second half.",
    date: "26 Shrawan 2083",
    source: "Annapurna Post",
  },
  {
    id: "e7",
    symbol: "UPPER",
    kind: "news",
    title: "Monsoon generation above target",
    sub: "Plant load factor held near 92% through Shrawan.",
    date: "30 Shrawan 2083",
    source: "Company disclosure",
  },
  {
    id: "e8",
    symbol: "UPPER",
    kind: "result",
    title: "Q4 report published",
    sub: "Net profit up 14.8% on higher energy sales.",
    date: "21 Shrawan 2083",
    source: "Company disclosure",
  },
  {
    id: "e9",
    symbol: "GBIME",
    kind: "news",
    title: "Merger integration completed",
    sub: "Branch network consolidated. No entitlement change for existing holders.",
    date: "18 Shrawan 2083",
    source: "NRB notice",
  },
  {
    id: "e10",
    symbol: "RIDI",
    kind: "deadline",
    title: "AGM record date",
    sub: "No distribution proposed. You hold 150 kitta.",
    date: "11 Bhadra 2083",
    daysLeft: 9,
  },
  {
    id: "e11",
    symbol: "NICA",
    kind: "news",
    title: "Deposit growth slowed in Shrawan",
    sub: "Quarterly disclosure showed a smaller loan book than the previous quarter.",
    date: "24 Shrawan 2083",
    source: "Company disclosure",
  },
  {
    id: "e12",
    symbol: "HDL",
    kind: "news",
    title: "Turnover leader for a third session",
    sub: "Heavy volume with no company announcement behind it.",
    date: "2 Bhadra 2083",
    source: "NEPSE floor sheet",
  },
  {
    id: "e13",
    symbol: "NRIC",
    kind: "deadline",
    title: "AGM record date for 12% bonus",
    sub: "Your 240 kitta would become 268 kitta if approved",
    date: "14 Bhadra 2083",
    daysLeft: 12,
  },
  {
    id: "e14",
    symbol: "NTC",
    kind: "news",
    title: "Fibre subscriber additions slowed",
    sub: "Quarterly disclosure noted higher competition in Kathmandu valley.",
    date: "27 Shrawan 2083",
    source: "Company disclosure",
  },
];

export function eventsFor(symbol: string) {
  const rows = stockEvents.filter((row) => row.symbol === symbol);
  return {
    deadlines: rows
      .filter((row) => row.daysLeft != null)
      .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0)),
    news: rows.filter((row) => row.daysLeft == null),
  };
}

export const analyticsNotes = {
  xirr: {
    value: "18.4%",
    body:
      "Money-weighted annual return since 12 Ashadh 2083, using every recorded buy, sell and dividend. " +
      "One buy is missing a price, so treat this as an estimate.",
  },
  twr: {
    value: "14.1%",
    body:
      "Time-weighted return over the same period. It removes the effect of when you added money, " +
      "so it describes the holdings rather than your timing.",
  },
  turnover: {
    value: "0.09",
    body: "Buy and sell value over the period divided by average portfolio value. Your history covers 2 months only.",
  },
};

export const glossary: { term: string; meaning: string }[] = [
  { term: "Kitta", meaning: "The number of shares you hold. Same as units." },
  { term: "Avg cost", meaning: "What you paid, on average, for the shares you still hold. Brokers call this WACC." },
  { term: "Price", meaning: "The last traded price from the market feed. Brokers call this LTP." },
  { term: "Cost basis", meaning: "What the shares you still hold cost you." },
  { term: "Unrealised P/L", meaning: "Gain or loss on shares you have not sold. Not cash yet." },
  { term: "Realised P/L", meaning: "Gain or loss locked in by completed sales." },
  { term: "Day P/L", meaning: "Today's movement on the shares you hold." },
  { term: "Weight", meaning: "A position's share of your total market value." },
];

/** Highest unrealised return in this book — a fact, not a recommendation. */
export function bestPerformer(rows: Holding[]) {
  if (rows.length === 0) return null;
  return [...rows].sort((a, b) => b.plPct - a.plPct)[0];
}

export type ImportPortal = {
  id: string;
  label: string;
  mode: "file" | "steps";
  hint: string;
};

export const importPortals: ImportPortal[] = [
  {
    id: "meroshare",
    label: "MeroShare",
    mode: "file",
    hint: "Upload a MeroShare holding statement. CSV or PDF.",
  },
  {
    id: "tms",
    label: "Broker TMS",
    mode: "steps",
    hint: "We’ll walk through the holdings your broker lists. Nothing is saved until you confirm.",
  },
  {
    id: "csv",
    label: "CSV or Excel",
    mode: "file",
    hint: "A file with symbol, kitta, average cost and date.",
  },
  {
    id: "cdsc",
    label: "CDSC statement",
    mode: "file",
    hint: "Upload the Demat holding statement from CDSC.",
  },
];

export const importPreview = [
  { symbol: "NABIL", name: "Nabil Bank", kitta: 200, avg: 470, value: 99600 },
  { symbol: "UPPER", name: "Upper Tamakoshi", kitta: 80, avg: 540, value: 48992 },
  { symbol: "SHIVM", name: "Shivam Cements", kitta: 40, avg: 512.6, value: 21924 },
];
