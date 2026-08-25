import { AppProvider } from "./lib/state";
import { Studio } from "./studio/Studio";
import "./styles/tokens.css";
import "./styles/ui.css";

export default function App() {
  return (
    <AppProvider>
      <Studio />
    </AppProvider>
  );
}
