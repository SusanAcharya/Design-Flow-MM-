import type { PersonaId, Stage } from "./types";

export type PersonaTone = "saffron" | "teal" | "violet" | "accent";

export type Persona = {
  id: PersonaId;
  name: string;
  role: string;
  img: string;
  tone: PersonaTone;
  stage: Stage;
  objectiveId: string | null;
  youIf: string[];
};

export const personas: Persona[] = [
  {
    id: "maya",
    name: "Maya",
    role: "Just starting",
    img: `${import.meta.env.BASE_URL}characters/maya.png`,
    tone: "saffron",
    stage: "explorer",
    objectiveId: "share",
    youIf: [
      "you’ve never owned kitta",
      "NEPSE is still just a word",
      "you’re looking around, not buying",
    ],
  },
  {
    id: "prakash",
    name: "Prakash",
    role: "Applying for IPOs",
    img: `${import.meta.env.BASE_URL}characters/prakash.png`,
    tone: "teal",
    stage: "primary",
    objectiveId: "ipo",
    youIf: [
      "you apply for IPOs on MeroShare",
      "you’re waiting to see if you got kitta",
      "listed trading can wait",
    ],
  },
  {
    id: "sita",
    name: "Sita",
    role: "Already holding",
    img: `${import.meta.env.BASE_URL}characters/sita.png`,
    tone: "violet",
    stage: "value",
    objectiveId: "read",
    youIf: [
      "you already hold some companies",
      "you want to know what it’s worth today",
      "dates and dividends matter more than the tape",
    ],
  },
  {
    id: "anil",
    name: "Anil",
    role: "Watching the tape",
    img: `${import.meta.env.BASE_URL}characters/anil.png`,
    tone: "accent",
    stage: "active",
    objectiveId: null,
    youIf: [
      "you watch the session while it’s open",
      "the floor sheet is the interesting bit",
      "you don’t need a lesson on Home",
    ],
  },
];

export function getPersona(id: PersonaId | string | null | undefined): Persona | null {
  if (!id) return null;
  return personas.find((persona) => persona.id === id) ?? null;
}
