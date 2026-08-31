/* The paid side of Learn. Objectives are the free guided path; courses are the
   longer sittings you buy. Nothing here recommends a trade — a course teaches a
   method, and every catalogue line is written to keep that clear. */

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type CourseTone = "accent" | "teal" | "saffron" | "violet" | "learn";

export type Lecture = {
  id: string;
  title: string;
  minutes: number;
  /** Free lectures play before you buy — the sample, not the course. */
  free?: boolean;
};

export type CourseReview = {
  id: string;
  who: string;
  when: string;
  stars: number;
  body: string;
};

export type Course = {
  id: string;
  title: string;
  /** Short label for chips and breadcrumbs. */
  short: string;
  blurb: string;
  level: CourseLevel;
  tone: CourseTone;
  /** Days of access after purchase, the way Nepali course sellers price it. */
  validityDays: number;
  price: number;
  wasPrice?: number;
  rating: number;
  reviewCount: number;
  /** Mitra pose used on the cover, keyed to lib/mitra.ts. */
  pose: "chart" | "search" | "savings" | "thinking" | "pointing" | "celebrate" | "thumbsUp" | "namaste";
  lectures: Lecture[];
  takeaways: string[];
  needs: string[];
  reviews: CourseReview[];
  popular?: boolean;
  fresh?: boolean;
};

/* ── Free lectures ────────────────────────────────────────────────────────
   Ungated, and deliberately the first thing on the screen. Somebody who has
   never bought a share should be able to learn something without paying. */
export type FreeLecture = {
  id: string;
  title: string;
  sub: string;
  minutes: number;
  tone: CourseTone;
  order: number;
};

export const freeLectures: FreeLecture[] = [
  {
    id: "what-is-nepse",
    title: "What NEPSE actually is",
    sub: "One exchange, many companies",
    minutes: 6,
    tone: "accent",
    order: 1,
  },
  {
    id: "read-the-board",
    title: "Reading the price board",
    sub: "LTP, change, turnover",
    minutes: 8,
    tone: "teal",
    order: 2,
  },
  {
    id: "kitta",
    title: "Kitta, and what one costs",
    sub: "The unit you actually buy",
    minutes: 5,
    tone: "saffron",
    order: 3,
  },
  {
    id: "demat-meroshare",
    title: "Demat and MeroShare, set up once",
    sub: "The accounts before the first buy",
    minutes: 9,
    tone: "violet",
    order: 4,
  },
];

/* ── The catalogue ────────────────────────────────────────────────────────
   Eight courses. Lecture lists are trimmed to a representative handful per
   course — the count on the card is the real length. */

const basicsLectures: Lecture[] = [
  { id: "b1", title: "Primary and secondary market", minutes: 10, free: true },
  { id: "b2", title: "What a share certificate means", minutes: 7, free: true },
  { id: "b3", title: "Opening demat, TMS and MeroShare", minutes: 12 },
  { id: "b4", title: "How an order reaches the floor", minutes: 9 },
  { id: "b5", title: "Kitta, lot size and the minimum buy", minutes: 8 },
  { id: "b6", title: "Reading the daily circuit", minutes: 11 },
  { id: "b7", title: "Settlement, T+2 and EDIS", minutes: 10 },
  { id: "b8", title: "Brokerage, SEBON fee and DP charge", minutes: 9 },
];

const fundamentalLectures: Lecture[] = [
  { id: "f1", title: "What fundamental analysis answers", minutes: 8, free: true },
  { id: "f2", title: "Reading a balance sheet", minutes: 14 },
  { id: "f3", title: "Profit and loss, line by line", minutes: 13 },
  { id: "f4", title: "EPS, P/E and book value", minutes: 12 },
  { id: "f5", title: "Return on equity for a Nepali bank", minutes: 11 },
  { id: "f6", title: "NPL, CD ratio and capital adequacy", minutes: 15 },
  { id: "f7", title: "Reading a quarterly report", minutes: 12 },
  { id: "f8", title: "Where the numbers can mislead", minutes: 10 },
];

const technicalLectures: Lecture[] = [
  { id: "t1", title: "What a chart can and cannot tell you", minutes: 9, free: true },
  { id: "t2", title: "Candles: body, wick, and what they mean", minutes: 12 },
  { id: "t3", title: "Support, resistance and the round number", minutes: 13 },
  { id: "t4", title: "Volume as confirmation", minutes: 10 },
  { id: "t5", title: "Moving averages on a thin market", minutes: 14 },
  { id: "t6", title: "RSI and why it is not a signal", minutes: 11 },
  { id: "t7", title: "Trendlines without fooling yourself", minutes: 12 },
  { id: "t8", title: "Circuit days break every pattern", minutes: 9 },
];

const comboLectures: Lecture[] = [
  { id: "c1", title: "How the two methods differ", minutes: 9, free: true },
  { id: "c2", title: "Trader versus investor", minutes: 11, free: true },
  { id: "c3", title: "Building a company shortlist", minutes: 14 },
  { id: "c4", title: "Checking the books before the chart", minutes: 15 },
  { id: "c5", title: "Timing an entry you already researched", minutes: 13 },
  { id: "c6", title: "Position size and the money you keep back", minutes: 12 },
  { id: "c7", title: "When the two methods disagree", minutes: 11 },
  { id: "c8", title: "Writing down why you bought", minutes: 8 },
];

const ipoLectures: Lecture[] = [
  { id: "i1", title: "Why a company issues shares", minutes: 7, free: true },
  { id: "i2", title: "Applying through C-ASBA", minutes: 11 },
  { id: "i3", title: "Allotment, and the lottery maths", minutes: 9 },
  { id: "i4", title: "Refunds and the waiting week", minutes: 6 },
  { id: "i5", title: "Listing day, and the circuit that follows", minutes: 10 },
  { id: "i6", title: "FPO, right share and bonus, told apart", minutes: 12 },
];

const financialsLectures: Lecture[] = [
  { id: "r1", title: "Where filings actually live", minutes: 8, free: true },
  { id: "r2", title: "The four statements", minutes: 13 },
  { id: "r3", title: "Cash flow versus profit", minutes: 14 },
  { id: "r4", title: "Notes to accounts, the part people skip", minutes: 12 },
  { id: "r5", title: "Comparing two banks fairly", minutes: 15 },
  { id: "r6", title: "Auditor language worth noticing", minutes: 10 },
];

const portfolioLectures: Lecture[] = [
  { id: "p1", title: "What a portfolio is for", minutes: 8, free: true },
  { id: "p2", title: "Spreading across sectors", minutes: 12 },
  { id: "p3", title: "Averaging down, honestly assessed", minutes: 13 },
  { id: "p4", title: "Booking a loss without drama", minutes: 11 },
  { id: "p5", title: "WACC and your real cost", minutes: 10 },
  { id: "p6", title: "Reading your own book monthly", minutes: 9 },
];

const smartMoneyLectures: Lecture[] = [
  { id: "s1", title: "What the term means, and its limits", minutes: 10, free: true },
  { id: "s2", title: "Order blocks on a low-volume market", minutes: 14 },
  { id: "s3", title: "Liquidity and the stop hunt story", minutes: 13 },
  { id: "s4", title: "Market structure shifts", minutes: 15 },
  { id: "s5", title: "Why this travels poorly to NEPSE", minutes: 12 },
];

export const courses: Course[] = [
  {
    id: "basics",
    title: "Share Market Basics",
    short: "Basics",
    blurb: "From demat to your first order, in plain words.",
    level: "Beginner",
    tone: "accent",
    validityDays: 90,
    price: 2500,
    wasPrice: 3500,
    rating: 4.7,
    reviewCount: 412,
    pose: "namaste",
    lectures: basicsLectures,
    takeaways: [
      "Open a demat, TMS and MeroShare account without guesswork",
      "Read a price board and know what every column means",
      "Follow one order from your tap to settlement",
      "Work out what a trade actually costs you in fees",
    ],
    needs: ["No prior market knowledge", "A phone and a bank account"],
    reviews: [
      {
        id: "bv1",
        who: "Sujata K.",
        when: "2 weeks ago",
        stars: 5,
        body: "I had a demat for two years and never used it. The settlement lecture finally explained why my shares took days to show.",
      },
      {
        id: "bv2",
        who: "Ramesh P.",
        when: "1 month ago",
        stars: 4,
        body: "Good for a complete beginner. The fee breakdown alone was worth it — I had no idea about the DP charge.",
      },
    ],
    popular: true,
  },
  {
    id: "fundamental",
    title: "Fundamental Analysis for NEPSE",
    short: "Fundamental",
    blurb: "Read the books before you read the chart.",
    level: "Beginner",
    tone: "saffron",
    validityDays: 120,
    price: 4000,
    wasPrice: 4500,
    rating: 4.8,
    reviewCount: 286,
    pose: "search",
    lectures: fundamentalLectures,
    takeaways: [
      "Open a company report and know which pages matter",
      "Work out EPS, P/E and book value yourself",
      "Judge a bank on NPL, CD ratio and capital adequacy",
      "Spot the places a number flatters the company",
    ],
    needs: ["Comfortable with basic arithmetic", "Share Market Basics, or equivalent"],
    reviews: [
      {
        id: "fv1",
        who: "Anita G.",
        when: "3 weeks ago",
        stars: 5,
        body: "The NPL and CD ratio lecture is specific to Nepali banks, which is exactly what I could not find anywhere else.",
      },
      {
        id: "fv2",
        who: "Bikash S.",
        when: "2 months ago",
        stars: 5,
        body: "Slow and careful. He does not tell you what to buy, which I appreciated more than I expected to.",
      },
    ],
    popular: true,
  },
  {
    id: "technical",
    title: "Technical Analysis: Charts and Candles",
    short: "Technical",
    blurb: "What a chart shows, and what it only seems to show.",
    level: "Intermediate",
    tone: "violet",
    validityDays: 120,
    price: 4500,
    wasPrice: 5500,
    rating: 4.6,
    reviewCount: 331,
    pose: "chart",
    lectures: technicalLectures,
    takeaways: [
      "Read candles without inventing a story around them",
      "Draw support and resistance you can defend",
      "Use volume to check what price is claiming",
      "Know which patterns fall apart on a circuit day",
    ],
    needs: ["Share Market Basics, or equivalent", "Access to a charting screen"],
    reviews: [
      {
        id: "tv1",
        who: "Nabin T.",
        when: "1 week ago",
        stars: 5,
        body: "The circuit-day lecture is the honest one. Most technical courses pretend Nepal trades like the US.",
      },
      {
        id: "tv2",
        who: "Prashant M.",
        when: "1 month ago",
        stars: 4,
        body: "Solid. RSI section changed how I use it — as context, not a trigger.",
      },
    ],
    popular: true,
  },
  {
    id: "combo",
    title: "Fundamental and Technical, Combined",
    short: "Combo",
    blurb: "Both methods, and what to do when they disagree.",
    level: "Beginner",
    tone: "teal",
    validityDays: 180,
    price: 5000,
    wasPrice: 6000,
    rating: 4.9,
    reviewCount: 508,
    pose: "thumbsUp",
    lectures: comboLectures,
    takeaways: [
      "Build a shortlist from the books, then time it on the chart",
      "Size a position against money you can lose",
      "Handle the case where the two methods point opposite ways",
      "Keep a written record of your own reasoning",
    ],
    needs: ["No prior market knowledge", "The longest course here — plan for a few weeks"],
    reviews: [
      {
        id: "cv1",
        who: "Deepak R.",
        when: "5 days ago",
        stars: 5,
        body: "Ninety-odd lectures sounds heavy but they are short. The 'write down why you bought' one stuck with me.",
      },
      {
        id: "cv2",
        who: "Sarita B.",
        when: "3 weeks ago",
        stars: 5,
        body: "Best value of the lot if you are starting from nothing. Covers both courses for less than buying them apart.",
      },
    ],
    popular: true,
  },
  {
    id: "ipo",
    title: "IPO and the Primary Market",
    short: "IPO",
    blurb: "Apply, wait, and understand the listing.",
    level: "Beginner",
    tone: "violet",
    validityDays: 60,
    price: 1500,
    wasPrice: 2000,
    rating: 4.5,
    reviewCount: 197,
    pose: "savings",
    lectures: ipoLectures,
    takeaways: [
      "Apply through C-ASBA without a second guess",
      "Understand allotment odds instead of hoping",
      "Know what happens between allotment and listing",
      "Tell an FPO, a right share and a bonus apart",
    ],
    needs: ["A bank account with C-ASBA enabled", "No prior market knowledge"],
    reviews: [
      {
        id: "iv1",
        who: "Kiran A.",
        when: "2 weeks ago",
        stars: 5,
        body: "Short and to the point. The allotment maths lecture stopped me applying with expectations.",
      },
    ],
  },
  {
    id: "financials",
    title: "Reading Company Financials",
    short: "Financials",
    blurb: "Filings, statements and the notes people skip.",
    level: "Intermediate",
    tone: "accent",
    validityDays: 90,
    price: 3500,
    wasPrice: 4000,
    rating: 4.7,
    reviewCount: 148,
    pose: "thinking",
    lectures: financialsLectures,
    takeaways: [
      "Find a company's real filings rather than a forwarded screenshot",
      "Tell profit from cash, and know why it matters",
      "Read the notes to accounts for what the headline hides",
      "Compare two companies on the same definitions",
    ],
    needs: ["Fundamental Analysis, or equivalent"],
    reviews: [
      {
        id: "rv1",
        who: "Manisha L.",
        when: "1 month ago",
        stars: 5,
        body: "The cash flow versus profit lecture is the one I send to friends.",
      },
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio and Risk",
    short: "Portfolio",
    blurb: "Holding a book without losing sleep over it.",
    level: "Intermediate",
    tone: "saffron",
    validityDays: 90,
    price: 3000,
    rating: 4.6,
    reviewCount: 122,
    pose: "chart",
    lectures: portfolioLectures,
    takeaways: [
      "Spread across sectors for a reason you can state",
      "Judge averaging down honestly, case by case",
      "Book a loss as a decision, not a defeat",
      "Review your own book on a schedule",
    ],
    needs: ["A live or paper portfolio to work with"],
    reviews: [
      {
        id: "pv1",
        who: "Hari D.",
        when: "3 weeks ago",
        stars: 4,
        body: "The averaging-down lecture does not give you a rule, it gives you the questions. Took me a while to appreciate that.",
      },
    ],
  },
  {
    id: "smart-money",
    title: "Smart Money Concepts",
    short: "SMC",
    blurb: "The vocabulary, and where it stops working here.",
    level: "Advanced",
    tone: "learn",
    validityDays: 90,
    price: 3000,
    wasPrice: 4000,
    rating: 4.2,
    reviewCount: 89,
    pose: "search",
    lectures: smartMoneyLectures,
    takeaways: [
      "Use the vocabulary accurately instead of loosely",
      "Read order blocks and liquidity with proper scepticism",
      "Follow a market structure shift on a chart",
      "Understand why thin volume breaks most of this",
    ],
    needs: ["Technical Analysis, or equivalent", "The most sceptical course here"],
    reviews: [
      {
        id: "sv1",
        who: "Aayush K.",
        when: "2 weeks ago",
        stars: 4,
        body: "Refreshing that the last lecture argues against the rest. I came in a believer and left more careful.",
      },
    ],
    fresh: true,
  },
];

/* ── What the demo member owns ────────────────────────────────────────────
   Sandip has bought two and finished one — enough to show progress, a
   resume point, and a certificate without pretending he owns the catalogue. */
export type Enrollment = {
  courseId: string;
  /** Lecture ids already watched. */
  done: string[];
  boughtOn: string;
  expiresOn: string;
};

export const enrollments: Enrollment[] = [
  {
    courseId: "basics",
    done: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
    boughtOn: "18 Shrawan 2083",
    expiresOn: "18 Kartik 2083",
  },
  {
    courseId: "fundamental",
    done: ["f1", "f2", "f3"],
    boughtOn: "29 Shrawan 2083",
    expiresOn: "29 Mangsir 2083",
  },
];

export type Certificate = {
  id: string;
  courseId: string;
  issued: string;
  code: string;
};

export const certificates: Certificate[] = [
  {
    id: "cert-basics",
    courseId: "basics",
    issued: "1 Bhadra 2083",
    code: "MM-BASICS-2083-0417",
  },
];

export const courseFaqs: { id: string; q: string; a: string }[] = [
  {
    id: "access",
    q: "How long do I keep a course?",
    a: "For the validity printed on the card — 60 to 180 days, counted from the day you pay. You can watch a lecture as many times as you like inside that window.",
  },
  {
    id: "expired",
    q: "What happens when validity runs out?",
    a: "The lectures lock, but your progress and any certificate stay on your account. Buying again picks up where you stopped.",
  },
  {
    id: "device",
    q: "Can I watch on more than one device?",
    a: "Yes, on any device where you are signed in. Lectures stream, so they need a connection — there is no download.",
  },
  {
    id: "certificate",
    q: "How do I get a certificate?",
    a: "Finish every lecture in a course and the certificate is issued to your account the same day. It carries a code anyone can check.",
  },
  {
    id: "refund",
    q: "Can I get a refund?",
    a: "Within seven days of paying, if you have watched under a quarter of the lectures. Write to hello@moneymitra.com with your order and we will process it.",
  },
  {
    id: "advice",
    q: "Will a course tell me what to buy?",
    a: "No. Courses teach a method and explain the words. MoneyMitra does not recommend a stock, and no instructor here will give you a buy or sell call.",
  },
  {
    id: "free",
    q: "What are the free lectures?",
    a: "Four short lectures anyone can watch without paying, plus a sample lecture inside most courses. They are the real thing, not a trailer.",
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────────*/

export function courseById(id: string) {
  return courses.find((course) => course.id === id);
}

export function enrollmentFor(id: string) {
  return enrollments.find((entry) => entry.courseId === id);
}

export function courseMinutes(course: Course) {
  return course.lectures.reduce((sum, lecture) => sum + lecture.minutes, 0);
}

/** Whole hours, rounded down, plus the leftover minutes — "6h 20m". */
export function courseLength(course: Course) {
  const total = courseMinutes(course);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function courseProgress(course: Course) {
  const owned = enrollmentFor(course.id);
  if (!owned) return { done: 0, total: course.lectures.length, pct: 0, owned: false };
  const done = owned.done.length;
  const total = course.lectures.length;
  return { done, total, pct: Math.round((done / total) * 100), owned: true };
}

/** The lecture a member would resume on — first unwatched, else the last. */
export function nextLecture(course: Course) {
  const owned = enrollmentFor(course.id);
  if (!owned) return course.lectures[0];
  return course.lectures.find((lecture) => !owned.done.includes(lecture.id)) ?? course.lectures[course.lectures.length - 1];
}

export const popularCourses = courses.filter((course) => course.popular);
export const myCourses = enrollments
  .map((entry) => courseById(entry.courseId))
  .filter((course): course is Course => Boolean(course));
