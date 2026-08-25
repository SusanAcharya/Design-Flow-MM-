import { useApp } from "../lib/state";
import { AlertsScreen, DiscoverScreen, IpoScreen, LearnScreen, LessonScreen, MoreScreen, SearchScreen, TulkeyScreen } from "../screens/Discover";
import { HomeScreen } from "../screens/Home";
import { MarketScreen } from "../screens/Market";
import { ObjectiveScreen } from "../screens/Objective";
import { Onboarding, StartingPoint } from "../screens/Onboarding";
import { HoldingScreen, PortfolioScreen } from "../screens/Portfolio";
import { StockScreen } from "../screens/Stock";
import { DesktopChrome, MobileChrome } from "../shell/Chrome";
import { Overlays } from "../shell/Overlays";

export function Prototype() {
  const { viewport, route, theme, uiFont } = useApp();
  const onboarding = route === "onboarding" || route === "start";
  const screen = (() => {
    switch (route) {
      case "onboarding":
        return <Onboarding />;
      case "start":
        return <StartingPoint />;
      case "home":
        return <HomeScreen />;
      case "market":
        return <MarketScreen />;
      case "discover":
        return <DiscoverScreen />;
      case "ai":
        return <TulkeyScreen />;
      case "portfolio":
        return <PortfolioScreen />;
      case "learn":
        return <LearnScreen />;
      case "more":
        return <MoreScreen />;
      case "search":
        return <SearchScreen />;
      case "stock":
        return <StockScreen />;
      case "ipo":
        return <IpoScreen />;
      case "lesson":
        return <LessonScreen />;
      case "objective":
        return <ObjectiveScreen />;
      case "holding":
        return <HoldingScreen />;
      case "alerts":
        return <AlertsScreen />;
      default:
        return <HomeScreen />;
    }
  })();

  return (
    <div className={`device ${viewport}`} data-theme={theme} data-font={uiFont}>
      {viewport === "mobile" ? (
        <MobileChrome showTabs={!onboarding}>{screen}</MobileChrome>
      ) : (
        <DesktopChrome showNav={!onboarding}>
          {screen}
        </DesktopChrome>
      )}
      <Overlays />
    </div>
  );
}
