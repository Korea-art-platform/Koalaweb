import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import ServerError from "./app/pages/ServerError.tsx";
import RootErrorBoundary from "./observability/RootErrorBoundary.tsx";
import { scheduleSentry } from "./observability/sentry.ts";
import "./styles/index.css";
import { initKakao } from './utils/kakao';

initKakao();

createRoot(document.getElementById("root")!).render(
  <RootErrorBoundary fallback={(reset) => <ServerError onReset={reset} />}>
    <App />
  </RootErrorBoundary>
);

scheduleSentry();
