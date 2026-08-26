import { getObjectiveByTitle } from "./objectives";

export type TulkeyMessage = {
  id: number;
  role: "user" | "tulkey";
  text: string;
  sittingId?: string | null;
};

export const tulkeyPrompts = [
  "What is a kitta?",
  "How does an IPO application work?",
  "What is a limit order?",
  "Why did a price stop moving?",
];

export const voiceSamples = [
  "What is a kitta?",
  "What does book close mean?",
  "What is EDIS?",
];

export function replyTo(question: string): { text: string; sittingId: string | null } {
  const q = question.trim();
  const sitting = getObjectiveByTitle(q);
  if (sitting) {
    const where = sitting.how.map((step) => step.platform).join(" · ");
    return {
      sittingId: sitting.id,
      text: `${sitting.know[0]}\n\nWhere this actually happens: ${where}.\n\nI explain the words and the platform. I never say what to buy or sell.`,
    };
  }

  const lower = q.toLowerCase();
  if (lower.includes("edis")) {
    return {
      sittingId: "terms",
      text: "After you buy, the kitta still has to move via MeroShare (EDIS) before T+2. Miss that and the exchange can close the trade at a penalty. MoneyMitra does not submit EDIS for you.",
    };
  }
  if (lower.includes("tms")) {
    return {
      sittingId: "terms",
      text: "TMS is your broker’s trading terminal. Live orders are placed there. MoneyMitra can send you to TMS. It never places the order itself.",
    };
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste")) {
    return {
      sittingId: null,
      text: "Namaste. Ask about a word, a date, or which site does the work — MeroShare, C-ASBA, or TMS. I will not pick a stock.",
    };
  }

  return {
    sittingId: null,
    text: "I can unpack a market word, a date, or which platform does the work. Try kitta, IPO, EDIS, a limit order, or the daily circuit. I never recommend a trade.",
  };
}
