import type { PersonaId, Stage } from "./types";

export type PersonaTone = "saffron" | "teal" | "violet" | "accent";

export type Persona = {
  id: PersonaId;
  name: string;
  role: string;
  prompt: string;
  img: string;
  tone: PersonaTone;
  stage: Stage;
  objectiveId: string | null;
  tulkey: string;
  where: string;
  gives: { title: string; detail: string }[];
  limit: string;
};

export const personas: Persona[] = [
  {
    id: "maya",
    name: "Maya",
    role: "Just starting",
    prompt: "I’ve never owned kitta.",
    img: "/characters/maya.png",
    tone: "saffron",
    stage: "explorer",
    objectiveId: "share",
    tulkey: "You’re at the beginning. I’ll put the first explanation on Home — nothing to buy.",
    where: "NEPSE is still a word, not a habit. You haven’t owned kitta, and names like Demat or MeroShare can wait. Home should teach first.",
    gives: [
      { title: "A first objective on Home", detail: "What a share is, in about 60s. Plain words. Not a pick." },
      { title: "The market pulse, dated", detail: "NEPSE with the time it was last updated — and when the market is closed." },
      { title: "Open IPOs, explained", detail: "So you know they exist. Applying still happens on MeroShare or C-ASBA." },
    ],
    limit: "MoneyMitra explains. It does not place an order or tell you what to buy.",
  },
  {
    id: "prakash",
    name: "Prakash",
    role: "Applying for IPOs",
    prompt: "I use MeroShare.",
    img: "/characters/prakash.png",
    tone: "teal",
    stage: "primary",
    objectiveId: "ipo",
    tulkey: "You’re in the primary market. I’ll put allotments first, and how an IPO actually works beside them.",
    where: "You apply for new issues. Allotment is the wait that matters. Listed trading can come later — TMS doesn’t have to be first.",
    gives: [
      { title: "How an IPO actually works", detail: "Apply → allotment → listing, and which site does each step." },
      { title: "Pipeline and allotment on Home", detail: "Kitta applied, results when CDSC publishes them — tracking here does not change the result." },
      { title: "Dates, not the form", detail: "We can remind you. We cannot submit on MeroShare or C-ASBA." },
    ],
    limit: "Applying and allotment live at MeroShare / C-ASBA / CDSC. MoneyMitra does not send the application.",
  },
  {
    id: "sita",
    name: "Sita",
    role: "Already holding",
    prompt: "I have a portfolio.",
    img: "/characters/sita.png",
    tone: "violet",
    stage: "value",
    objectiveId: "read",
    tulkey: "You already hold. I’ll open on your ledger, then how to read a company — not what to sell.",
    where: "You own listed kitta. The job is reading what you hold: cost, return, dividends, events. You don’t need the alphabet of the market on Home.",
    gives: [
      { title: "Your ledger first", detail: "Value, today’s move, and the companies you actually own — with cost basis, not a decoration." },
      { title: "How to read a company", detail: "Dividends, ex-date and P/E explained. Figures, not a verdict on any stock." },
      { title: "A watchlist that is follow, not own", detail: "Saved companies to look at. Adding one does not buy it." },
    ],
    limit: "Holdings are a record. Buying or selling still happens in TMS at your broker.",
  },
  {
    id: "anil",
    name: "Anil",
    role: "Watching the tape",
    prompt: "I follow the session.",
    img: "/characters/anil.png",
    tone: "accent",
    stage: "active",
    objectiveId: null,
    tulkey: "You watch the session. I’ll skip the lesson card and lead with breadth and the floor sheet.",
    where: "You live in market hours. Breadth, the floor sheet, broker flow. A beginner card on Home would get in the way.",
    gives: [
      { title: "Breadth and the tape", detail: "Who rose, who fell, prints that already happened — always with a time." },
      { title: "Broker Chirfaar", detail: "Observed flow, not a rating and not a call to follow a broker." },
      { title: "Learn when a word comes up", detail: "No pinned objective. Tulkey stays in the tab if you want a term unpacked." },
    ],
    limit: "The floor sheet is a record. Live orders still go through TMS. We never place them.",
  },
];

export function getPersona(id: PersonaId | string | null | undefined): Persona | null {
  if (!id) return null;
  return personas.find((persona) => persona.id === id) ?? null;
}
