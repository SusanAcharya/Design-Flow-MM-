import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { defaultExploreFavorites, defaultHomeTools, memberCharacter } from "./explore";
import { watchLists } from "./data";

export type WatchList = { id: string; label: string; blurb?: string; symbols: string[] };
import { activeTab } from "./nav";
import { linkedRoute, param } from "./deeplink";
import { getObjective, getObjectiveByTitle, nextOnPath } from "./objectives";
import { replyTo, type TulkeyMessage } from "./tulkey";
import { portfolioList, type PortfolioId, type PortfolioKind } from "./portfolio";
import type { PersonaId } from "./types";
import { stageToast, titleObjective } from "./stage";
import type {
  Circuit,
  DataState,
  Lang,
  HoldingMode,
  MarketDesk,
  MarketSession,
  MarketTab,
  BrokerDesk,
  OnboardingResult,
  Plan,
  PlanCycle,
  PortfolioTab,
  Route,
  Sheet,
  Stage,
  StockTab,
  SubIntent,
  Theme,
  Toast,
  UiFont,
  Viewport,
} from "./types";

type GoExtras = {
  stock?: string;
  stockTab?: StockTab;
  marketTab?: MarketTab;
  marketDesk?: MarketDesk;
  marketIndex?: string;
  brokerDesk?: BrokerDesk;
  brokerCode?: string;
  portfolioTab?: PortfolioTab;
  lesson?: string;
  holdingMode?: HoldingMode;
  holding?: string;
  persona?: PersonaId;
  objective?: string;
  alertSymbol?: string;
  /** Land on Subscription with a tier already picked, ready to buy. */
  planPick?: Plan;
  /** Why they came — a consultation asks for a different opening line. */
  subIntent?: SubIntent;
};

type AppState = {
  theme: Theme;
  uiFont: UiFont;
  lang: Lang;
  viewport: Viewport;
  stage: Stage;
  route: Route;
  session: MarketSession;
  stock: string;
  stockTab: StockTab;
  marketTab: MarketTab;
  marketDesk: MarketDesk;
  marketIndex: string;
  brokerDesk: BrokerDesk;
  brokerCode: string;
  portfolioTab: PortfolioTab;
  portfolioId: PortfolioId;
  holdingSymbol: string;
  plan: Plan;
  planCycle: PlanCycle;
  /** Studio switch for reviewing loading, refreshing and failed fetches. */
  dataState: DataState;
  /** Studio switch for the no-portfolio-yet state. */
  hasPortfolio: boolean;
  lesson: string;
  onboarded: boolean;
  personaId: PersonaId | null;
  onboardingPersona: PersonaId | null;
  objectiveId: string | null;
  viewingObjectiveId: string | null;
  pathFinished: boolean;
  hideHomeObjectives: boolean;
  /** null follows the default rule: open until one objective is marked done. */
  setupOpen: boolean | null;
  objectivesCompleted: number;
  objectivesDone: string[];
  /** Tab an objective was opened from, so the nav highlight stays put. */
  objectiveOrigin: Route;
  setViewingObjectiveId: (id: string | null) => void;
  setHideHomeObjectives: (hide: boolean) => void;
  setSetupOpen: (open: boolean | null) => void;
  sheet: Sheet | null;
  toast: Toast | null;
  circuit: Circuit;
  densityLocked: boolean;
  holdingMode: HoldingMode;
  correctedKitta: number | null;
  exploreFavorites: string[];
  homeTools: string[];
  avatar: string;
  watchlists: WatchList[];
  hasWatchlist: boolean;
  alertSeed: string | null;
  planSeed: Plan | null;
  subIntent: SubIntent | null;
  setTheme: (theme: Theme) => void;
  setLang: (lang: Lang) => void;
  setUiFont: (font: UiFont) => void;
  setViewport: (viewport: Viewport) => void;
  setStage: (stage: Stage, opts?: { silent?: boolean }) => void;
  setSession: (session: MarketSession) => void;
  setCircuit: (circuit: Circuit) => void;
  setDensityLocked: (locked: boolean) => void;
  setObjectiveId: (id: string | null) => void;
  setStockTab: (tab: StockTab) => void;
  setMarketTab: (tab: MarketTab) => void;
  setMarketDesk: (desk: MarketDesk) => void;
  setMarketIndex: (id: string) => void;
  setBrokerDesk: (desk: BrokerDesk) => void;
  setBrokerCode: (code: string) => void;
  setPortfolioTab: (tab: PortfolioTab) => void;
  setPortfolioId: (id: PortfolioId) => void;
  portfolioNames: Record<PortfolioId, string>;
  portfolioKinds: Record<PortfolioId, PortfolioKind>;
  primaryPortfolioId: PortfolioId;
  openPortfolioIds: PortfolioId[];
  renamePortfolio: (id: PortfolioId, name: string) => void;
  savePortfolio: (id: PortfolioId, patch: { name: string; kind: PortfolioKind; primary: boolean }) => void;
  createPortfolio: (patch: { name: string; kind: PortfolioKind; primary: boolean }) => boolean;
  deletePortfolio: (id: PortfolioId) => void;
  setPlan: (plan: Plan, extras?: { cycle?: PlanCycle }) => void;
  setDataState: (next: DataState) => void;
  setHasPortfolio: (next: boolean) => void;
  toggleExploreFavorite: (id: string) => void;
  toggleHomeTool: (id: string) => void;
  setAvatar: (src: string) => void;
  setHasWatchlist: (next: boolean) => void;
  createWatchlist: (label: string) => string;
  renameWatchlist: (id: string, label: string) => void;
  deleteWatchlist: (id: string) => void;
  addToList: (id: string, symbol: string) => void;
  removeFromList: (id: string, symbol: string) => void;
  clearAlertSeed: () => void;
  clearSubSeed: () => void;
  go: (route: Route, extras?: GoExtras) => void;
  back: () => void;
  finishOnboarding: (result: OnboardingResult) => void;
  lookAround: () => void;
  resetDemo: () => void;
  completeObjective: (opts?: { stay?: boolean }) => void;
  fulfillObjective: (id: string) => boolean;
  addToWatchlist: (symbol: string) => boolean;
  watchlistAdds: string[];
  openSheet: (sheet: Sheet) => void;
  closeSheet: () => void;
  dismissToast: () => void;
  flash: (next: Toast) => void;
  undoStage: () => void;
  saveCorrection: (kitta: number) => void;
  dismissBookNudge: () => void;
  bookNudgeDismissed: boolean;
  tulkeyMessages: TulkeyMessage[];
  tulkeyThinking: boolean;
  tulkeyVoiceOpen: boolean;
  askTulkey: (text: string) => void;
  openTulkeyVoice: () => void;
  closeTulkeyVoice: () => void;
};

const Ctx = createContext<AppState | null>(null);

const defaultPortfolioNames = Object.fromEntries(
  portfolioList.map((item) => [item.id, item.name]),
) as Record<PortfolioId, string>;
const defaultOpenPortfolios: PortfolioId[] = ["main", "long"];
/** The one Home everybody lands on after onboarding. */
const onboardedStage: Stage = "base";
const defaultPortfolioKinds = Object.fromEntries(
  portfolioList.map((item) => [item.id, "individual"]),
) as Record<PortfolioId, PortfolioKind>;

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(param("theme", ["dark", "light"] as const, "dark"));
  const [uiFont, setUiFont] = useState<UiFont>("plex");
  const [lang, setLang] = useState<Lang>("en");
  const [viewport, setViewport] = useState<Viewport>(param("viewport", ["mobile", "web"] as const, "mobile"));
  const [stage, setStageState] = useState<Stage>(param("stage", ["base", "explorer", "primary", "secondary", "value", "active"] as const, "base"));
  const [route, setRoute] = useState<Route>(linkedRoute ?? "onboarding");
  const [session, setSession] = useState<MarketSession>("closed");
  const [stock, setStock] = useState("NABIL");
  const [stockTab, setStockTab] = useState<StockTab>(
    param("stab", ["Overview", "Financials", "Analysis", "Floor sheet", "Events"] as const, "Overview"),
  );
  const [marketTab, setMarketTab] = useState<MarketTab>(param("tab", ["Overview", "Movers", "Sectors", "Floor sheet", "Events"] as const, "Overview"));
  const [marketDesk, setMarketDesk] = useState<MarketDesk>("summary");
  const [marketIndex, setMarketIndex] = useState("nepse");
  const [brokerDesk, setBrokerDesk] = useState<BrokerDesk>(param("desk", ["hub", "analysis", "detail"] as const, "hub"));
  const [brokerCode, setBrokerCode] = useState("33");
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>("Overview");
  const [portfolioId, setPortfolioId] = useState<PortfolioId>("main");
  const [portfolioNames, setPortfolioNames] = useState<Record<PortfolioId, string>>(defaultPortfolioNames);
  const [portfolioKinds, setPortfolioKinds] = useState<Record<PortfolioId, PortfolioKind>>(defaultPortfolioKinds);
  const [primaryPortfolioId, setPrimaryPortfolioId] = useState<PortfolioId>("main");
  const [openPortfolioIds, setOpenPortfolioIds] = useState<PortfolioId[]>(defaultOpenPortfolios);
  const [holdingSymbol, setHoldingSymbol] = useState("NABIL");
  const [plan, setPlanState] = useState<Plan>(param("plan", ["free", "plus", "pro"] as const, "free"));
  const [dataState, setDataState] = useState<DataState>(param("data", ["ready", "loading", "refreshing", "error"] as const, "ready"));
  const [hasPortfolio, setHasPortfolio] = useState(param("portfolio", ["yes", "none"] as const, "yes") === "yes");
  const [planCycle, setPlanCycle] = useState<PlanCycle>("annual");
  const [lesson, setLesson] = useState("");
  const [onboarded, setOnboarded] = useState(linkedRoute !== null);
  const [personaId, setPersonaId] = useState<PersonaId | null>(null);
  const [onboardingPersona, setOnboardingPersona] = useState<PersonaId | null>(null);
  const [objectiveId, setObjectiveIdState] = useState<string | null>("share");
  const [viewingObjectiveId, setViewingObjectiveId] = useState<string | null>("share");
  const [pathFinished, setPathFinished] = useState(false);
  const [hideHomeObjectives, setHideHomeObjectives] = useState(false);
  const [setupOpen, setSetupOpen] = useState<boolean | null>(null);
  const [objectivesDone, setObjectivesDone] = useState<string[]>([]);
  const [objectiveOrigin, setObjectiveOrigin] = useState<Route>("home");
  const objectivesCompleted = objectivesDone.length;
  const [watchlistAdds, setWatchlistAdds] = useState<string[]>([]);
  /* ?sheet=navigation opens a drawer or sheet straight from a link, for review. */
  const [sheet, setSheet] = useState<Sheet | null>(() => {
    const kind = param(
      "sheet",
      ["navigation", "profile", "plans", "help", "referral", "avatar", "watch-add", "none"] as const,
      "none",
    );
    if (kind === "none") return null;
    if (kind === "watch-add") return { kind, listId: watchLists[0].id };
    return { kind };
  });
  const [toast, setToast] = useState<Toast | null>(null);
  const [circuit, setCircuit] = useState<Circuit>("off");
  const [densityLocked, setDensityLocked] = useState(false);
  const [holdingMode, setHoldingMode] = useState<HoldingMode>("add");
  const [correctedKitta, setCorrectedKitta] = useState<number | null>(null);
  const [bookNudgeDismissed, setBookNudgeDismissed] = useState(param("nudge", ["show", "dismissed"] as const, "show") === "dismissed");
  const [tulkeyMessages, setTulkeyMessages] = useState<TulkeyMessage[]>([]);
  const [tulkeyThinking, setTulkeyThinking] = useState(false);
  const [tulkeyVoiceOpen, setTulkeyVoiceOpen] = useState(false);
  const [exploreFavorites, setExploreFavorites] = useState<string[]>(defaultExploreFavorites);
  const [homeTools, setHomeTools] = useState<string[]>(defaultHomeTools);
  const [avatar, setAvatar] = useState<string>(`${import.meta.env.BASE_URL}characters/${memberCharacter}.png`);
  const seededLists = () => watchLists.map((list) => ({ ...list, symbols: [...list.symbols] }));
  const emptyLists = (): WatchList[] => [
    { id: "main", label: "Main", blurb: "Names you check after close", symbols: [] },
  ];
  const [hasWatchlist, setHasWatchlistState] = useState(
    param("watch", ["yes", "none"] as const, "yes") === "yes",
  );
  const [watchlists, setWatchlists] = useState<WatchList[]>(() =>
    param("watch", ["yes", "none"] as const, "yes") === "yes" ? seededLists() : emptyLists(),
  );
  const [alertSeed, setAlertSeed] = useState<string | null>(null);
  const [planSeed, setPlanSeed] = useState<Plan | null>(null);
  const [subIntent, setSubIntent] = useState<SubIntent | null>(null);
  const [, setStack] = useState<Route[]>([]);
  const prevStage = useRef<Stage>("base");
  const toastTimer = useRef<number>(0);
  const tulkeyThinkTimer = useRef<number>(0);
  const tulkeyMsgId = useRef(1);

  const dismissToast = useCallback(() => {
    window.clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  const flash = useCallback((next: Toast) => {
    window.clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = window.setTimeout(() => setToast(null), 5200);
  }, []);

  const setStage = useCallback(
    (next: Stage, opts?: { silent?: boolean }) => {
      const changed = next !== stage;
      setStageState((current) => {
        if (current === next) return current;
        prevStage.current = current;
        return next;
      });
      if (changed) {
        const start = titleObjective[next];
        setObjectiveIdState(start);
        setViewingObjectiveId(start);
        setPathFinished(false);
        setHideHomeObjectives(false);
      }
      if (!opts?.silent && changed) {
        flash({ message: stageToast[next], undo: true });
      }
    },
    [flash, stage],
  );

  const undoStage = useCallback(() => {
    setStageState(prevStage.current);
    dismissToast();
  }, [dismissToast]);

  const go = useCallback((next: Route, extras?: GoExtras) => {
    setStack((s) => [...s, route]);
    if (extras?.stock) setStock(extras.stock);
    if (extras?.alertSymbol) setAlertSeed(extras.alertSymbol);
    if (next === "subscription") {
      setPlanSeed(extras?.planPick ?? null);
      setSubIntent(extras?.subIntent ?? null);
    }
    if (extras?.stockTab) setStockTab(extras.stockTab);
    else if (next === "stock" && route !== "stock") setStockTab("Overview");
    if (extras?.marketTab) setMarketTab(extras.marketTab);
    else if (next === "market" && route !== "market") setMarketTab("Overview");
    if (extras?.marketDesk) setMarketDesk(extras.marketDesk);
    else if (next === "market-desk" && route !== "market-desk") setMarketDesk("summary");
    if (extras?.marketIndex) setMarketIndex(extras.marketIndex);
    if (extras?.brokerCode) {
      setBrokerCode(extras.brokerCode);
      setBrokerDesk(extras.brokerDesk ?? "detail");
    } else if (extras?.brokerDesk) {
      setBrokerDesk(extras.brokerDesk);
    } else if (next === "brokers" && route !== "brokers") {
      setBrokerDesk("hub");
    }
    if (extras?.portfolioTab) setPortfolioTab(extras.portfolioTab);
    else if (next === "portfolio" && route !== "portfolio") setPortfolioTab("Overview");
    if (extras?.holding) setHoldingSymbol(extras.holding);
    if (extras?.lesson) {
      const mapped = getObjectiveByTitle(extras.lesson);
      if (mapped) {
        setViewingObjectiveId(mapped.id);
        setRoute("objective");
        setSheet(null);
        return;
      }
      setLesson(extras.lesson);
    }
    if (next === "objective") {
      setViewingObjectiveId(extras?.objective ?? objectiveId);
    }
    if ((next === "objective" || next === "objectives") && route !== "objective" && route !== "objectives") {
      setObjectiveOrigin(activeTab(route));
    }
    if (next === "start") setOnboardingPersona(extras?.persona ?? null);
    if (next === "holding") setHoldingMode(extras?.holdingMode ?? "add");
    setRoute(next);
    setSheet(null);
  }, [route, objectiveId]);

  const back = useCallback(() => {
    setSheet(null);
    setStack((s) => {
      if (!s.length) {
        setRoute(onboarded ? "home" : "onboarding");
        return s;
      }
      const copy = [...s];
      const prev = copy.pop() as Route;
      setRoute(prev);
      return copy;
    });
  }, [onboarded]);

  const finishOnboarding = useCallback((result: OnboardingResult) => {
    setOnboarded(true);
    /* Home reads the same whichever character was picked — the persona still
       chooses the avatar and the learning path, but not the shape of Home.
       The Studio's Home stage control is how you review the other shapes. */
    setStageState(onboardedStage);
    setObjectiveIdState(result.objectiveId);
    setViewingObjectiveId(result.objectiveId);
    setPathFinished(false);
    setHideHomeObjectives(false);
    setSetupOpen(null);
    setObjectivesDone([]);
    setWatchlistAdds([]);
    setPersonaId(result.personaId);
    setOnboardingPersona(null);
    setBookNudgeDismissed(false);
    setTulkeyMessages([]);
    setTulkeyThinking(false);
    setTulkeyVoiceOpen(false);
    setStack([]);
    setRoute("home");
    setSheet(null);
  }, []);

  const lookAround = useCallback(() => {
    setOnboarded(true);
    setStageState("base");
    setObjectiveIdState("share");
    setViewingObjectiveId("share");
    setPathFinished(false);
    setHideHomeObjectives(false);
    setSetupOpen(null);
    setObjectivesDone([]);
    setWatchlistAdds([]);
    setPersonaId(null);
    setOnboardingPersona(null);
    setBookNudgeDismissed(false);
    setTulkeyMessages([]);
    setTulkeyThinking(false);
    setTulkeyVoiceOpen(false);
    setStack([]);
    setRoute("home");
  }, []);

  const resetDemo = useCallback(() => {
    setOnboarded(false);
    setPersonaId(null);
    setOnboardingPersona(null);
    setStageState("explorer");
    setObjectiveIdState("share");
    setViewingObjectiveId("share");
    setPathFinished(false);
    setHideHomeObjectives(false);
    setSetupOpen(null);
    setObjectivesDone([]);
    setWatchlistAdds([]);
    setRoute("onboarding");
    setStack([]);
    setStock("NABIL");
    setStockTab("Overview");
    setMarketTab("Overview");
    setMarketDesk("summary");
    setMarketIndex("nepse");
    setBrokerDesk("hub");
    setBrokerCode("33");
    setLang("en");
    setPlanState("free");
    setPlanCycle("annual");
    setPlanSeed(null);
    setSubIntent(null);
    setDataState("ready");
    setHasPortfolio(true);
    setPortfolioId("main");
    setPortfolioTab("Overview");
    setPortfolioNames(defaultPortfolioNames);
    setPortfolioKinds(defaultPortfolioKinds);
    setPrimaryPortfolioId("main");
    setOpenPortfolioIds(defaultOpenPortfolios);
    setExploreFavorites(defaultExploreFavorites);
    setHomeTools(defaultHomeTools);
    setAvatar(`${import.meta.env.BASE_URL}characters/${memberCharacter}.png`);
    setWatchlists(seededLists());
    setHasWatchlistState(true);
    setAlertSeed(null);
    setSheet(null);
    setToast(null);
    setCircuit("off");
    setDensityLocked(false);
    setCorrectedKitta(null);
    setHoldingMode("add");
    setBookNudgeDismissed(false);
    setTulkeyMessages([]);
    setTulkeyThinking(false);
    setTulkeyVoiceOpen(false);
  }, []);

  const setObjectiveId = useCallback((id: string | null) => {
    setObjectiveIdState(id);
    setViewingObjectiveId(id);
    setPathFinished(false);
    if (id) setHideHomeObjectives(false);
  }, []);

  const completeObjective = useCallback((opts?: { stay?: boolean }) => {
    if (!objectiveId) {
      if (!opts?.stay) setRoute("home");
      return;
    }
    const done = objectivesDone.includes(objectiveId) ? objectivesDone : [...objectivesDone, objectiveId];
    setObjectivesDone(done);
    setSetupOpen(null);
    const next = nextOnPath(objectiveId, done);
    if (next) {
      setObjectiveIdState(next.id);
      setViewingObjectiveId(next.id);
      flash({ message: `Next up: ${next.title}` });
    } else {
      setObjectiveIdState(null);
      setViewingObjectiveId(null);
      setPathFinished(true);
      flash({ message: "That’s the last objective on this path." });
    }
    if (!opts?.stay) {
      setRoute("home");
      setStack([]);
    }
    setSheet(null);
  }, [flash, objectiveId, objectivesDone]);

  /**
   * Ticks a sitting off from the action itself — saving a holding, adding a name.
   * Works even when the objective isn't the one currently pinned on Home.
   */
  const fulfillObjective = useCallback((id: string) => {
    const objective = getObjective(id);
    if (!objective || objectivesDone.includes(id)) return false;
    const done = [...objectivesDone, id];
    setObjectivesDone(done);
    setSetupOpen(null);
    if (objectiveId === id) {
      const next = nextOnPath(id, done);
      setObjectiveIdState(next ? next.id : null);
      setViewingObjectiveId(next ? next.id : null);
      if (!next) setPathFinished(true);
      flash({
        message: next ? `${objective.title} — done. Next up: ${next.title}` : "That’s the last objective on this path.",
      });
    } else {
      flash({ message: `${objective.title} — done.` });
    }
    return true;
  }, [flash, objectiveId, objectivesDone]);

  // The Market sitting finishes when a company is actually opened, not on the visit.
  useEffect(() => {
    if (route === "stock") fulfillObjective("market");
  }, [route, fulfillObjective]);

  /** Returns true when this add also finished the watchlist objective. */
  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlistAdds((current) => (current.includes(symbol) ? current : [...current, symbol]));
    return fulfillObjective("watch");
  }, [fulfillObjective]);

  const toggleExploreFavorite = useCallback((id: string) => {
    setExploreFavorites((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  }, []);
  const createWatchlist = useCallback((label: string) => {
    const id = `wl${Date.now()}`;
    setWatchlists((current) => [...current, { id, label, blurb: "Your list", symbols: [] }]);
    return id;
  }, []);
  const renameWatchlist = useCallback((id: string, label: string) => {
    setWatchlists((current) => current.map((list) => (list.id === id ? { ...list, label } : list)));
  }, []);
  const deleteWatchlist = useCallback((id: string) => {
    setWatchlists((current) => (current.length <= 1 ? current : current.filter((list) => list.id !== id)));
  }, []);
  const addToList = useCallback((id: string, symbol: string) => {
    setWatchlists((current) =>
      current.map((list) =>
        list.id === id && !list.symbols.includes(symbol)
          ? { ...list, symbols: [...list.symbols, symbol] }
          : list,
      ),
    );
  }, []);
  const removeFromList = useCallback((id: string, symbol: string) => {
    setWatchlists((current) =>
      current.map((list) =>
        list.id === id ? { ...list, symbols: list.symbols.filter((item) => item !== symbol) } : list,
      ),
    );
  }, []);
  const clearAlertSeed = useCallback(() => setAlertSeed(null), []);
  const clearSubSeed = useCallback(() => {
    setPlanSeed(null);
    setSubIntent(null);
  }, []);
  /* Studio switch: a member who follows names, or one who has not started. */
  const setHasWatchlist = useCallback((next: boolean) => {
    setHasWatchlistState(next);
    setWatchlists(next ? seededLists() : emptyLists());
    setWatchlistAdds([]);
  }, []);

  const toggleHomeTool = useCallback((id: string) => {
    setHomeTools((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);
  const openSheet = useCallback((next: Sheet) => setSheet(next), []);
  const closeSheet = useCallback(() => setSheet(null), []);
  const saveCorrection = useCallback((kitta: number) => {
    setCorrectedKitta(kitta);
    setSheet(null);
    flash({ message: "Correction saved. Original buy is kept as superseded.", tone: "good" });
  }, [flash]);
  const dismissBookNudge = useCallback(() => setBookNudgeDismissed(true), []);

  const askTulkey = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTulkeyThinking((busy) => {
      if (busy) return busy;
      const id = tulkeyMsgId.current++;
      setTulkeyMessages((current) => [...current, { id, role: "user", text: trimmed }]);
      window.clearTimeout(tulkeyThinkTimer.current);
      tulkeyThinkTimer.current = window.setTimeout(() => {
        const answer = replyTo(trimmed);
        setTulkeyMessages((current) => [
          ...current,
          {
            id: tulkeyMsgId.current++,
            role: "tulkey",
            text: answer.text,
            sittingId: answer.sittingId,
          },
        ]);
        setTulkeyThinking(false);
      }, 1500);
      return true;
    });
  }, []);

  const openTulkeyVoice = useCallback(() => setTulkeyVoiceOpen(true), []);
  const closeTulkeyVoice = useCallback(() => setTulkeyVoiceOpen(false), []);

  const renamePortfolio = useCallback((id: PortfolioId, name: string) => {
    const next = name.trim();
    if (!next) return;
    setPortfolioNames((current) => ({ ...current, [id]: next }));
  }, []);

  const savePortfolio = useCallback((id: PortfolioId, patch: { name: string; kind: PortfolioKind; primary: boolean }) => {
    renamePortfolio(id, patch.name);
    setPortfolioKinds((current) => ({ ...current, [id]: patch.kind }));
    if (patch.primary) {
      setPrimaryPortfolioId(id);
      return;
    }
    setPrimaryPortfolioId((current) => {
      if (current !== id) return current;
      return openPortfolioIds.find((item) => item !== id) ?? id;
    });
  }, [openPortfolioIds, renamePortfolio]);

  const createPortfolio = useCallback((patch: { name: string; kind: PortfolioKind; primary: boolean }) => {
    const title = patch.name.trim();
    if (!title) return false;
    const id = (["fresh", "side"] as PortfolioId[]).find((item) => !openPortfolioIds.includes(item));
    if (!id) return false;
    setOpenPortfolioIds((current) => [...current, id]);
    savePortfolio(id, { name: title, kind: patch.kind, primary: patch.primary });
    setPortfolioId(id);
    fulfillObjective("book");
    return true;
  }, [fulfillObjective, openPortfolioIds, savePortfolio]);

  const deletePortfolio = useCallback((id: PortfolioId) => {
    setOpenPortfolioIds((current) => {
      const remaining = current.filter((item) => item !== id);
      if (remaining.length === 0) return current;
      setPortfolioId((active) => (active === id ? remaining[0] : active));
      setPrimaryPortfolioId((primary) => (primary === id ? remaining[0] : primary));
      return remaining;
    });
  }, []);

  const setPlan = useCallback((next: Plan, extras?: { cycle?: PlanCycle }) => {
    setPlanState(next);
    setPlanCycle(next === "free" ? "annual" : extras?.cycle ?? "annual");
  }, []);

  const value = useMemo(
    () => ({
      theme,
      uiFont,
      lang,
      viewport,
      stage,
      route,
      session,
      stock,
      stockTab,
      marketTab,
      marketDesk,
      marketIndex,
      brokerDesk,
      brokerCode,
      portfolioTab,
      portfolioId,
      holdingSymbol,
      plan,
      planCycle,
      dataState,
      hasPortfolio,
      setDataState,
      setHasPortfolio,
      lesson,
      onboarded,
      personaId,
      onboardingPersona,
      objectiveId,
      viewingObjectiveId,
      pathFinished,
      hideHomeObjectives,
      setupOpen,
      objectivesCompleted,
      objectivesDone,
      objectiveOrigin,
      setViewingObjectiveId,
      setHideHomeObjectives,
      setSetupOpen,
      sheet,
      toast,
      circuit,
      densityLocked,
      holdingMode,
      correctedKitta,
      exploreFavorites,
      homeTools,
      avatar,
      watchlists,
      hasWatchlist,
      alertSeed,
      planSeed,
      subIntent,
      setTheme,
      setLang,
      setUiFont,
      setViewport,
      setStage,
      setSession,
      setCircuit,
      setDensityLocked,
      setObjectiveId,
      setStockTab,
      setMarketTab,
      setMarketDesk,
      setMarketIndex,
      setBrokerDesk,
      setBrokerCode,
      setPortfolioTab,
      setPortfolioId,
      portfolioNames,
      portfolioKinds,
      primaryPortfolioId,
      openPortfolioIds,
      renamePortfolio,
      savePortfolio,
      createPortfolio,
      deletePortfolio,
      setPlan,
      toggleExploreFavorite,
      toggleHomeTool,
      setAvatar,
      setHasWatchlist,
      createWatchlist,
      renameWatchlist,
      deleteWatchlist,
      addToList,
      removeFromList,
      clearAlertSeed,
      clearSubSeed,
      go,
      back,
      finishOnboarding,
      lookAround,
      resetDemo,
      completeObjective,
      fulfillObjective,
      addToWatchlist,
      watchlistAdds,
      openSheet,
      closeSheet,
      dismissToast,
      flash,
      undoStage,
      saveCorrection,
      dismissBookNudge,
      bookNudgeDismissed,
      tulkeyMessages,
      tulkeyThinking,
      tulkeyVoiceOpen,
      askTulkey,
      openTulkeyVoice,
      closeTulkeyVoice,
    }),
    [
      theme,
      uiFont,
      lang,
      viewport,
      stage,
      route,
      session,
      stock,
      stockTab,
      marketTab,
      marketDesk,
      marketIndex,
      brokerDesk,
      brokerCode,
      portfolioTab,
      portfolioId,
      portfolioNames,
      portfolioKinds,
      primaryPortfolioId,
      openPortfolioIds,
      holdingSymbol,
      plan,
      planCycle,
      dataState,
      hasPortfolio,
      lesson,
      onboarded,
      personaId,
      onboardingPersona,
      objectiveId,
      viewingObjectiveId,
      pathFinished,
      hideHomeObjectives,
      setupOpen,
      objectivesCompleted,
      objectivesDone,
      objectiveOrigin,
      watchlistAdds,
      sheet,
      toast,
      circuit,
      densityLocked,
      holdingMode,
      correctedKitta,
      exploreFavorites,
      homeTools,
      avatar,
      watchlists,
      hasWatchlist,
      alertSeed,
      planSeed,
      subIntent,
      setStage,
      toggleExploreFavorite,
      toggleHomeTool,
      setAvatar,
      setHasWatchlist,
      createWatchlist,
      renameWatchlist,
      deleteWatchlist,
      addToList,
      removeFromList,
      clearAlertSeed,
      clearSubSeed,
      go,
      back,
      finishOnboarding,
      lookAround,
      resetDemo,
      completeObjective,
      fulfillObjective,
      addToWatchlist,
      openSheet,
      closeSheet,
      dismissToast,
      flash,
      undoStage,
      saveCorrection,
      dismissBookNudge,
      bookNudgeDismissed,
      tulkeyMessages,
      tulkeyThinking,
      tulkeyVoiceOpen,
      askTulkey,
      renamePortfolio,
      savePortfolio,
      createPortfolio,
      deletePortfolio,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
