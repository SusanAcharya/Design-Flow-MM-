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
import type { PersonaId } from "./types";
import { coerceHomeFeed, stageToast } from "./stage";
import type {
  Circuit,
  HoldingMode,
  HomeFeed,
  MarketSession,
  MarketTab,
  OnboardingResult,
  Plan,
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
  lesson?: string;
  holdingMode?: HoldingMode;
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
  plan: Plan;
  lesson: string;
  onboarded: boolean;
  personaId: PersonaId | null;
  onboardingPersona: PersonaId | null;
  objectiveId: string | null;
  viewingObjectiveId: string | null;
  pathFinished: boolean;
  setViewingObjectiveId: (id: string | null) => void;
  sheet: Sheet | null;
  toast: Toast | null;
  circuit: Circuit;
  densityLocked: boolean;
  holdingMode: HoldingMode;
  correctedKitta: number | null;
  homeFeed: HomeFeed;
  exploreFavorites: string[];
  setTheme: (theme: Theme) => void;
  setUiFont: (font: UiFont) => void;
  setViewport: (viewport: Viewport) => void;
  setStage: (stage: Stage, opts?: { silent?: boolean }) => void;
  setSession: (session: MarketSession) => void;
  setCircuit: (circuit: Circuit) => void;
  setDensityLocked: (locked: boolean) => void;
  setObjectiveId: (id: string | null) => void;
  setHomeFeed: (feed: HomeFeed) => void;
  setStockTab: (tab: StockTab) => void;
  setMarketTab: (tab: MarketTab) => void;
  setPlan: (plan: Plan) => void;
  toggleExploreFavorite: (id: string) => void;
  go: (route: Route, extras?: GoExtras) => void;
  back: () => void;
  finishOnboarding: (result: OnboardingResult) => void;
  lookAround: () => void;
  resetDemo: () => void;
  completeObjective: () => void;
  openSheet: (sheet: Sheet) => void;
  closeSheet: () => void;
  dismissToast: () => void;
  flash: (next: Toast) => void;
  undoStage: () => void;
  saveCorrection: (kitta: number) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [uiFont, setUiFont] = useState<UiFont>("satoshi");
  const [viewport, setViewport] = useState<Viewport>("mobile");
  const [stage, setStageState] = useState<Stage>("base");
  const [route, setRoute] = useState<Route>("onboarding");
  const [session, setSession] = useState<MarketSession>("closed");
  const [stock, setStock] = useState("NABIL");
  const [stockTab, setStockTab] = useState<StockTab>("Overview");
  const [marketTab, setMarketTab] = useState<MarketTab>("Overview");
  const [plan, setPlan] = useState<Plan>("free");
  const [lesson, setLesson] = useState("");
  const [onboarded, setOnboarded] = useState(false);
  const [personaId, setPersonaId] = useState<PersonaId | null>(null);
  const [onboardingPersona, setOnboardingPersona] = useState<PersonaId | null>(null);
  const [objectiveId, setObjectiveIdState] = useState<string | null>("share");
  const [viewingObjectiveId, setViewingObjectiveId] = useState<string | null>("share");
  const [pathFinished, setPathFinished] = useState(false);
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [circuit, setCircuit] = useState<Circuit>("off");
  const [densityLocked, setDensityLocked] = useState(false);
  const [holdingMode, setHoldingMode] = useState<HoldingMode>("add");
  const [correctedKitta, setCorrectedKitta] = useState<number | null>(null);
  const [homeFeed, setHomeFeed] = useState<HomeFeed>("home");
  const [exploreFavorites, setExploreFavorites] = useState<string[]>(defaultExploreFavorites);
  const [, setStack] = useState<Route[]>([]);
  const prevStage = useRef<Stage>("base");
  const toastTimer = useRef<number>(0);

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
      setStageState((current) => {
        if (current === next) return current;
        prevStage.current = current;
        return next;
      });
      setHomeFeed((feed) => coerceHomeFeed(next, feed));
      if (!opts?.silent && next !== stage) {
        flash({ message: stageToast[next], undo: true });
      }
    },
    [flash, stage],
  );

  const undoStage = useCallback(() => {
    setStageState(prevStage.current);
    setHomeFeed((feed) => coerceHomeFeed(prevStage.current, feed));
    dismissToast();
  }, [dismissToast]);

  const go = useCallback((next: Route, extras?: GoExtras) => {
    setStack((s) => [...s, route]);
    if (extras?.stock) setStock(extras.stock);
    if (extras?.stockTab) setStockTab(extras.stockTab);
    else if (next === "stock" && route !== "stock") setStockTab("Overview");
    if (extras?.marketTab) setMarketTab(extras.marketTab);
    else if (next === "market" && route !== "market") setMarketTab("Overview");
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
    setPersonaId(result.personaId);
    setOnboardingPersona(null);
    setHomeFeed("home");
    setStack([]);
    setRoute("home");
    setSheet(null);
  }, []);

  const lookAround = useCallback(() => {
    setOnboarded(true);
    setStageState("base");
    setObjectiveIdState(null);
    setViewingObjectiveId(null);
    setPathFinished(false);
    setPersonaId(null);
    setOnboardingPersona(null);
    setHomeFeed("home");
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
    setRoute("onboarding");
    setStack([]);
    setStock("NABIL");
    setStockTab("Overview");
    setMarketTab("Overview");
    setPlan("free");
    setExploreFavorites(defaultExploreFavorites);
    setSheet(null);
    setToast(null);
    setCircuit("off");
    setDensityLocked(false);
    setCorrectedKitta(null);
    setHoldingMode("add");
    setHomeFeed("home");
  }, []);

  const setObjectiveId = useCallback((id: string | null) => {
    setObjectiveIdState(id);
    setViewingObjectiveId(id);
    setPathFinished(false);
  }, []);

  const completeObjective = useCallback(() => {
    if (!objectiveId) {
      setRoute("home");
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
    setRoute("home");
    setStack([]);
    setSheet(null);
  }, [flash, objectiveId]);

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
      plan,
      lesson,
      onboarded,
      personaId,
      onboardingPersona,
      objectiveId,
      viewingObjectiveId,
      pathFinished,
      setViewingObjectiveId,
      sheet,
      toast,
      circuit,
      densityLocked,
      holdingMode,
      correctedKitta,
      homeFeed,
      exploreFavorites,
      setTheme,
      setUiFont,
      setViewport,
      setStage,
      setSession,
      setCircuit,
      setDensityLocked,
      setObjectiveId,
      setHomeFeed,
      setStockTab,
      setMarketTab,
      setPlan,
      toggleExploreFavorite,
      go,
      back,
      finishOnboarding,
      lookAround,
      resetDemo,
      completeObjective,
      openSheet,
      closeSheet,
      dismissToast,
      flash,
      undoStage,
      saveCorrection,
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
      plan,
      lesson,
      onboarded,
      personaId,
      onboardingPersona,
      objectiveId,
      viewingObjectiveId,
      pathFinished,
      sheet,
      toast,
      circuit,
      densityLocked,
      holdingMode,
      correctedKitta,
      homeFeed,
      exploreFavorites,
      setStage,
      toggleExploreFavorite,
      go,
      back,
      finishOnboarding,
      lookAround,
      resetDemo,
      completeObjective,
      openSheet,
      closeSheet,
      dismissToast,
      flash,
      undoStage,
      saveCorrection,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
