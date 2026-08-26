import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { defaultExploreFavorites } from "./explore";
import { getObjectiveByTitle, nextOnPath } from "./objectives";
import { replyTo, type TulkeyMessage } from "./tulkey";
import { portfolioList, type PortfolioId, type PortfolioKind } from "./portfolio";
import type { PersonaId } from "./types";
import { stageToast, titleObjective } from "./stage";
import type {
  Circuit,
  HoldingMode,
  MarketSession,
  MarketTab,
  OnboardingResult,
  Plan,
  PortfolioTab,
  Route,
  Sheet,
  Stage,
  StockTab,
  Theme,
  Toast,
  UiFont,
  Viewport,
} from "./types";

type GoExtras = {
  stock?: string;
  stockTab?: StockTab;
  marketTab?: MarketTab;
  portfolioTab?: PortfolioTab;
  lesson?: string;
  holdingMode?: HoldingMode;
  holding?: string;
  persona?: PersonaId;
  objective?: string;
};

type AppState = {
  theme: Theme;
  uiFont: UiFont;
  viewport: Viewport;
  stage: Stage;
  route: Route;
  session: MarketSession;
  stock: string;
  stockTab: StockTab;
  marketTab: MarketTab;
  portfolioTab: PortfolioTab;
  portfolioId: PortfolioId;
  holdingSymbol: string;
  plan: Plan;
  lesson: string;
  onboarded: boolean;
  personaId: PersonaId | null;
  onboardingPersona: PersonaId | null;
  objectiveId: string | null;
  viewingObjectiveId: string | null;
  pathFinished: boolean;
  hideHomeObjectives: boolean;
  setViewingObjectiveId: (id: string | null) => void;
  setHideHomeObjectives: (hide: boolean) => void;
  sheet: Sheet | null;
  toast: Toast | null;
  circuit: Circuit;
  densityLocked: boolean;
  holdingMode: HoldingMode;
  correctedKitta: number | null;
  exploreFavorites: string[];
  setTheme: (theme: Theme) => void;
  setUiFont: (font: UiFont) => void;
  setViewport: (viewport: Viewport) => void;
  setStage: (stage: Stage, opts?: { silent?: boolean }) => void;
  setSession: (session: MarketSession) => void;
  setCircuit: (circuit: Circuit) => void;
  setDensityLocked: (locked: boolean) => void;
  setObjectiveId: (id: string | null) => void;
  setStockTab: (tab: StockTab) => void;
  setMarketTab: (tab: MarketTab) => void;
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
  setPlan: (plan: Plan) => void;
  toggleExploreFavorite: (id: string) => void;
  go: (route: Route, extras?: GoExtras) => void;
  back: () => void;
  finishOnboarding: (result: OnboardingResult) => void;
  lookAround: () => void;
  resetDemo: () => void;
  completeObjective: (opts?: { stay?: boolean }) => void;
  fulfillObjective: (id: string) => boolean;
  addToWatchlist: (symbol: string) => void;
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
const defaultPortfolioKinds = Object.fromEntries(
  portfolioList.map((item) => [item.id, "individual"]),
) as Record<PortfolioId, PortfolioKind>;

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [uiFont, setUiFont] = useState<UiFont>("plex");
  const [viewport, setViewport] = useState<Viewport>("mobile");
  const [stage, setStageState] = useState<Stage>("base");
  const [route, setRoute] = useState<Route>("onboarding");
  const [session, setSession] = useState<MarketSession>("closed");
  const [stock, setStock] = useState("NABIL");
  const [stockTab, setStockTab] = useState<StockTab>("Overview");
  const [marketTab, setMarketTab] = useState<MarketTab>("Overview");
  const [portfolioTab, setPortfolioTab] = useState<PortfolioTab>("Overview");
  const [portfolioId, setPortfolioId] = useState<PortfolioId>("main");
  const [portfolioNames, setPortfolioNames] = useState<Record<PortfolioId, string>>(defaultPortfolioNames);
  const [portfolioKinds, setPortfolioKinds] = useState<Record<PortfolioId, PortfolioKind>>(defaultPortfolioKinds);
  const [primaryPortfolioId, setPrimaryPortfolioId] = useState<PortfolioId>("main");
  const [openPortfolioIds, setOpenPortfolioIds] = useState<PortfolioId[]>(defaultOpenPortfolios);
  const [holdingSymbol, setHoldingSymbol] = useState("NABIL");
  const [plan, setPlan] = useState<Plan>("free");
  const [lesson, setLesson] = useState("");
  const [onboarded, setOnboarded] = useState(false);
  const [personaId, setPersonaId] = useState<PersonaId | null>(null);
  const [onboardingPersona, setOnboardingPersona] = useState<PersonaId | null>(null);
  const [objectiveId, setObjectiveIdState] = useState<string | null>("share");
  const [viewingObjectiveId, setViewingObjectiveId] = useState<string | null>("share");
  const [pathFinished, setPathFinished] = useState(false);
  const [hideHomeObjectives, setHideHomeObjectives] = useState(false);
  const [watchlistAdds, setWatchlistAdds] = useState<string[]>([]);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [circuit, setCircuit] = useState<Circuit>("off");
  const [densityLocked, setDensityLocked] = useState(false);
  const [holdingMode, setHoldingMode] = useState<HoldingMode>("add");
  const [correctedKitta, setCorrectedKitta] = useState<number | null>(null);
  const [bookNudgeDismissed, setBookNudgeDismissed] = useState(false);
  const [tulkeyMessages, setTulkeyMessages] = useState<TulkeyMessage[]>([]);
  const [tulkeyThinking, setTulkeyThinking] = useState(false);
  const [tulkeyVoiceOpen, setTulkeyVoiceOpen] = useState(false);
  const [exploreFavorites, setExploreFavorites] = useState<string[]>(defaultExploreFavorites);
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
    if (extras?.stockTab) setStockTab(extras.stockTab);
    else if (next === "stock" && route !== "stock") setStockTab("Overview");
    if (extras?.marketTab) setMarketTab(extras.marketTab);
    else if (next === "market" && route !== "market") setMarketTab("Overview");
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
    setStageState(result.stage);
    setObjectiveIdState(result.objectiveId);
    setViewingObjectiveId(result.objectiveId);
    setPathFinished(false);
    setHideHomeObjectives(false);
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
    setWatchlistAdds([]);
    setRoute("onboarding");
    setStack([]);
    setStock("NABIL");
    setStockTab("Overview");
    setMarketTab("Overview");
    setPlan("free");
    setPortfolioId("main");
    setPortfolioTab("Overview");
    setPortfolioNames(defaultPortfolioNames);
    setPortfolioKinds(defaultPortfolioKinds);
    setPrimaryPortfolioId("main");
    setOpenPortfolioIds(defaultOpenPortfolios);
    setExploreFavorites(defaultExploreFavorites);
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
    const next = nextOnPath(objectiveId);
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
  }, [flash, objectiveId]);

  const fulfillObjective = useCallback((id: string) => {
    if (objectiveId !== id) return false;
    completeObjective({ stay: true });
    return true;
  }, [completeObjective, objectiveId]);

  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlistAdds((current) => (current.includes(symbol) ? current : [...current, symbol]));
    fulfillObjective("watch");
  }, [fulfillObjective]);

  const toggleExploreFavorite = useCallback((id: string) => {
    setExploreFavorites((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  }, []);
  const openSheet = useCallback((next: Sheet) => setSheet(next), []);
  const closeSheet = useCallback(() => setSheet(null), []);
  const saveCorrection = useCallback((kitta: number) => {
    setCorrectedKitta(kitta);
    setSheet(null);
    flash({ message: "Correction saved. Original buy is kept as superseded." });
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
    return true;
  }, [openPortfolioIds, savePortfolio]);

  const deletePortfolio = useCallback((id: PortfolioId) => {
    setOpenPortfolioIds((current) => {
      const remaining = current.filter((item) => item !== id);
      if (remaining.length === 0) return current;
      setPortfolioId((active) => (active === id ? remaining[0] : active));
      setPrimaryPortfolioId((primary) => (primary === id ? remaining[0] : primary));
      return remaining;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      uiFont,
      viewport,
      stage,
      route,
      session,
      stock,
      stockTab,
      marketTab,
      portfolioTab,
      portfolioId,
      holdingSymbol,
      plan,
      lesson,
      onboarded,
      personaId,
      onboardingPersona,
      objectiveId,
      viewingObjectiveId,
      pathFinished,
      hideHomeObjectives,
      setViewingObjectiveId,
      setHideHomeObjectives,
      sheet,
      toast,
      circuit,
      densityLocked,
      holdingMode,
      correctedKitta,
      exploreFavorites,
      setTheme,
      setUiFont,
      setViewport,
      setStage,
      setSession,
      setCircuit,
      setDensityLocked,
      setObjectiveId,
      setStockTab,
      setMarketTab,
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
      viewport,
      stage,
      route,
      session,
      stock,
      stockTab,
      marketTab,
      portfolioTab,
      portfolioId,
      portfolioNames,
      portfolioKinds,
      primaryPortfolioId,
      openPortfolioIds,
      holdingSymbol,
      plan,
      lesson,
      onboarded,
      personaId,
      onboardingPersona,
      objectiveId,
      viewingObjectiveId,
      pathFinished,
      hideHomeObjectives,
      watchlistAdds,
      sheet,
      toast,
      circuit,
      densityLocked,
      holdingMode,
      correctedKitta,
      exploreFavorites,
      setStage,
      toggleExploreFavorite,
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
