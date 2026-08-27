import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { useApp } from "../lib/state";
import { nepse } from "../lib/data";
import type { Route } from "../lib/types";

/** One grey block. Widths are percentages so a bone reflows with its column. */
export function Bone({ w = "100%", h = 12, r = 6 }: { w?: number | string; h?: number; r?: number }) {
  return <span className="bone" style={{ width: w, height: h, borderRadius: r }} aria-hidden />;
}

function BoneRow({ mark = true, lines = 2 }: { mark?: boolean; lines?: number }) {
  return (
    <div className="bone-row">
      {mark && <Bone w={36} h={36} r={11} />}
      <div className="bone-lines">
        <Bone w="52%" h={13} />
        {lines > 1 && <Bone w="34%" h={11} />}
      </div>
      <div className="bone-meta">
        <Bone w={54} h={13} />
        <Bone w={38} h={11} />
      </div>
    </div>
  );
}

export function BoneList({ rows = 6, mark = true }: { rows?: number; mark?: boolean }) {
  return (
    <div className="bone-list">
      {Array.from({ length: rows }, (_, i) => (
        <BoneRow key={i} mark={mark} />
      ))}
    </div>
  );
}

function BoneBlock({ title = true, children }: { title?: boolean; children: ReactNode }) {
  return (
    <section className="market-block">
      {title && (
        <header className="market-block-head">
          <Bone w={120} h={15} />
        </header>
      )}
      <div className="market-block-body">{children}</div>
    </section>
  );
}

function BoneTable({ rows = 8, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bone-table">
      <div className="bone-tr head">
        {Array.from({ length: cols }, (_, i) => (
          <Bone key={i} w={i === 0 ? "42%" : "58%"} h={10} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div className="bone-tr" key={r}>
          {Array.from({ length: cols }, (_, c) => (
            <Bone key={c} w={c === 0 ? "70%" : "60%"} h={12} />
          ))}
        </div>
      ))}
    </div>
  );
}

type Shape = "feed" | "board" | "book" | "detail" | "list" | "panel";

const shapes: Partial<Record<Route, Shape>> = {
  home: "feed",
  market: "board",
  "market-desk": "board",
  portfolio: "book",
  holding: "detail",
  stock: "detail",
  watchlist: "list",
  baskets: "list",
  brokers: "list",
  alerts: "list",
  notifications: "list",
  discover: "list",
  more: "list",
  search: "list",
  ipo: "panel",
  learn: "list",
  lesson: "panel",
  ai: "panel",
  objective: "panel",
  objectives: "list",
  profile: "panel",
};

/** A loading screen keeps the shape of the screen it stands in for. */
export function ScreenSkeleton({ route }: { route: Route }) {
  const shape = shapes[route] ?? "list";
  return (
    <div className="skeleton-screen" role="status" aria-live="polite">
      <span className="vh">Loading</span>

      {shape === "feed" && (
        <>
          <div className="pad bone-stack">
            <Bone w="46%" h={13} />
            <Bone w="100%" h={132} r={20} />
          </div>
          <BoneBlock>
            <BoneList rows={3} />
          </BoneBlock>
          <BoneBlock>
            <BoneList rows={4} />
          </BoneBlock>
        </>
      )}

      {shape === "board" && (
        <>
          <div className="pad bone-stack">
            <Bone w="100%" h={40} r={14} />
            <Bone w="100%" h={96} r={20} />
          </div>
          <BoneBlock>
            <BoneTable rows={8} />
          </BoneBlock>
        </>
      )}

      {shape === "book" && (
        <>
          <div className="pad bone-stack">
            <Bone w="38%" h={13} />
            <Bone w="62%" h={34} r={10} />
            <Bone w="44%" h={13} />
            <Bone w="100%" h={104} r={20} />
          </div>
          <BoneBlock>
            <BoneList rows={5} />
          </BoneBlock>
        </>
      )}

      {shape === "detail" && (
        <>
          <div className="pad bone-stack">
            <Bone w="52%" h={24} r={8} />
            <Bone w="30%" h={13} />
            <Bone w="100%" h={156} r={20} />
            <Bone w="100%" h={36} r={12} />
          </div>
          <BoneBlock>
            <BoneList rows={4} mark={false} />
          </BoneBlock>
        </>
      )}

      {shape === "list" && (
        <>
          <div className="pad bone-stack">
            <Bone w="100%" h={44} r={999} />
          </div>
          <BoneBlock>
            <BoneList rows={7} />
          </BoneBlock>
        </>
      )}

      {shape === "panel" && (
        <div className="pad bone-stack">
          <Bone w="60%" h={22} r={8} />
          <Bone w="100%" h={72} r={16} />
          <Bone w="100%" h={140} r={20} />
          <Bone w="86%" h={13} />
          <Bone w="74%" h={13} />
        </div>
      )}
    </div>
  );
}

/** A failed fetch says what is missing, when it was last good, and offers one retry. */
export function ScreenError() {
  const { setDataState } = useApp();
  return (
    <div className="data-error" role="alert">
      <span className="data-error-ico" aria-hidden>
        <Icon name="refresh" size={22} />
      </span>
      <p className="t-h-s">Could not load</p>
      <p className="t-body-s muted">
        Last good update {nepse.closedAt} · {nepse.date}
      </p>
      <button type="button" className="btn btn-secondary btn-md" onClick={() => setDataState("ready")}>
        Try again
      </button>
    </div>
  );
}

/** Fetching over content that is already on screen — never a blocking spinner. */
export function LoadBar() {
  const { dataState } = useApp();
  if (dataState !== "refreshing") return null;
  return (
    <div className="load-bar" role="status">
      <span className="vh">Refreshing</span>
      <i />
    </div>
  );
}
