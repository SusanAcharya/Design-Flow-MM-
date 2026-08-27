import { useApp } from "../lib/state";
import { AlertsScreen, NotificationsScreen } from "../screens/Alerts";
import { DiscoverScreen, IpoScreen, LearnScreen, LessonScreen, MoreScreen, SearchScreen } from "../screens/Discover";
import { TulkeyScreen } from "../screens/Tulkey";
import { BasketsScreen, HomeScreen, WatchlistScreen } from "../screens/Home";
import { MarketScreen } from "../screens/Market";
import { MarketDeskScreen } from "../screens/MarketDesk";
import { BrokersScreen } from "../screens/Brokers";
import { ProfileScreen } from "../screens/Profile";
import { SubscriptionScreen } from "../screens/Subscription";
import { HappeningScreen } from "../screens/Happening";
import { ObjectiveScreen, ObjectivesScreen } from "../screens/Objective";
import { Onboarding, StartingPoint } from "../screens/Onboarding";
import { SignInScreen, SignUpScreen } from "../screens/Auth";
import { HoldingScreen, PortfolioScreen } from "../screens/Portfolio";
import { StockScreen } from "../screens/Stock";
import { DesktopChrome, MobileChrome } from "../shell/Chrome";
import { Overlays } from "../shell/Overlays";
import { HomeFab, TulkeyVoiceOverlay } from "../ds/TulkeyVoice";
import { ScreenError, ScreenSkeleton } from "../ds/Loading";

export function Prototype() {
  const { viewport, route, theme, uiFont, dataState } = useApp();
  const onboarding =
    route === "onboarding" || route === "start" || route === "signin" || route === "signup";
  const screen = (() => {
    /* Studio drives these so every screen's loading and failed states can be reviewed. */
    if (!onboarding && dataState === "loading") return <ScreenSkeleton route={route} />;
    if (!onboarding && dataState === "error") return <ScreenError />;
    switch (route) {
      case "onboarding":
        return <Onboarding />;
      case "signin":
        return <SignInScreen />;
      case "signup":
        return <SignUpScreen />;
      case "start":
        return <StartingPoint />;
      case "home":
        return <HomeScreen />;
      case "market":
        return <MarketScreen />;
      case "market-desk":
        return <MarketDeskScreen />;
      case "profile":
        return <ProfileScreen />;
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
      case "objectives":
        return <ObjectivesScreen />;
      case "holding":
        return <HoldingScreen />;
      case "alerts":
        return <AlertsScreen />;
      case "notifications":
        return <NotificationsScreen />;
      case "subscription":
        return <SubscriptionScreen />;
      case "happening":
        return <HappeningScreen />;
      case "watchlist":
        return <WatchlistScreen />;
      case "brokers":
        return <BrokersScreen />;
      case "baskets":
        return <BasketsScreen />;
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
      <HomeFab />
      <TulkeyVoiceOverlay />
      <Overlays />
    </div>
  );
}
