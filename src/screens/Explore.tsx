import { useRef, useState, type PointerEvent } from "react";
import { Icon } from "../ds/Icon";
import { SearchField } from "../ds/primitives";
import { UserAvatar } from "../ds/UserAvatar";
import {
  exploreGroupOrder,
  filterExploreTools,
  getExploreTool,
  planMeta,
  type ExploreTool,
} from "../lib/explore";
import { user } from "../lib/data";
import { useApp } from "../lib/state";

function useOpenTool() {
  const { go, setHomeFeed, openSheet } = useApp();
  return (tool: ExploreTool) => {
    if (tool.feed) {
      setHomeFeed(tool.feed);
      go("home");
      return;
    }
    if (tool.sheet) {
      openSheet(tool.sheet);
      return;
    }
    if (tool.soon) {
      openSheet({ kind: "quick", title: tool.title, body: tool.soon.body });
      return;
    }
    if (tool.handoff) {
      openSheet({
        kind: "quick",
        title: tool.handoff.platform,
        body: tool.handoff.body,
        note: "This opens the named site. MoneyMitra does not log you in.",
      });
      return;
    }
    if (tool.go) {
      go(tool.go.route, {
        stock: tool.go.stock,
        stockTab: tool.go.stockTab,
        marketTab: tool.go.marketTab,
        lesson: tool.go.lesson,
      });
    }
  };
}

function ToolGlyph({ tool }: { tool: ExploreTool }) {
  return (
    <span className="explore-glyph">
      <Icon name={tool.icon} size={22} />
    </span>
  );
}

function ToolTile({
  tool,
  onOpen,
  onPin,
}: {
  tool: ExploreTool;
  onOpen: (tool: ExploreTool) => void;
  onPin: (tool: ExploreTool) => void;
}) {
  const held = useRef(false);
  const timer = useRef(0);

  const start = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    held.current = false;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      held.current = true;
      onPin(tool);
    }, 480);
  };
  const stop = () => window.clearTimeout(timer.current);

  return (
    <button
      type="button"
      className="explore-tile"
      aria-label={tool.title}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(event) => {
        event.preventDefault();
        onPin(tool);
      }}
      onClick={() => {
        if (held.current) {
          held.current = false;
          return;
        }
        onOpen(tool);
      }}
    >
      <ToolGlyph tool={tool} />
      <strong>{tool.short}</strong>
    </button>
  );
}

export function DiscoverScreen() {
  const {
    plan,
    exploreFavorites,
    toggleExploreFavorite,
    flash,
    openSheet,
  } = useApp();
  const [query, setQuery] = useState("");
  const openTool = useOpenTool();
  const searching = Boolean(query.trim());
  const matches = filterExploreTools(query).filter((tool) => {
    if (searching) return true;
    return !exploreFavorites.includes(tool.id);
  });
  const meta = planMeta[plan];
  const pinned = exploreFavorites
    .map((id) => getExploreTool(id))
    .filter((tool): tool is ExploreTool => Boolean(tool));

  const pin = (tool: ExploreTool) => {
    const isOn = exploreFavorites.includes(tool.id);
    if (!isOn && exploreFavorites.length >= 4) {
      flash({ message: "Unpin one first. Four shortcuts maximum." });
      return;
    }
    toggleExploreFavorite(tool.id);
    flash({ message: isOn ? `Removed ${tool.title}` : `Pinned ${tool.title}` });
  };

  const groups = exploreGroupOrder.filter((group) =>
    matches.some((tool) => tool.group === group),
  );

  return (
    <div className="explore-screen">
      <div className="explore-sticky">
        <SearchField
          placeholder="Search a tool — calculator, screener, IPO…"
          value={query}
          onChange={setQuery}
        />

        <div className={`tier-banner tier-${plan}`}>
          <button type="button" className="tier-who" onClick={() => openSheet({ kind: "profile" })}>
            <UserAvatar size={40} />
            <span>
              <strong>{user.fullName}</strong>
              <small>{meta.kicker} · {meta.renew}</small>
            </span>
            {plan !== "free" && <span className="tier-badge">{meta.label}</span>}
          </button>
          {plan === "free" ? (
            <button type="button" className="tier-cta" onClick={() => openSheet({ kind: "plans" })}>
              Upgrade to Pro
            </button>
          ) : (
            <button type="button" className="tier-manage" onClick={() => openSheet({ kind: "plans" })}>
              Manage
              <Icon name="chev" size={14} />
            </button>
          )}
        </div>
      </div>

      {!searching && (
        <section className="explore-cat">
          <p className="explore-group">Pinned</p>
          <div className="explore-favs" aria-label="Pinned tools">
            {Array.from({ length: 4 }, (_, index) => {
              const tool = pinned[index];
              if (!tool) {
                return (
                  <span key={`empty-${index}`} className="explore-fav empty">
                    <span className="explore-glyph" />
                    <strong>Pin</strong>
                  </span>
                );
              }
              return (
                <button
                  key={tool.id}
                  type="button"
                  className="explore-fav"
                  aria-label={tool.title}
                  onClick={() => openTool(tool)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    pin(tool);
                  }}
                >
                  <ToolGlyph tool={tool} />
                  <strong>{tool.short}</strong>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {matches.length === 0 ? (
        <div className="explore-empty">
          <p className="t-h-s">No tool matches “{query.trim()}”</p>
          <p className="t-body-s muted">Try calculator, screener, floor sheet, or MeroShare.</p>
        </div>
      ) : (
        groups.map((group) => {
          const rows = matches.filter((tool) => tool.group === group);
          return (
            <section key={group} className="explore-cat">
              <p className="explore-group">{group}</p>
              <div className="explore-grid">
                {rows.map((tool) => (
                  <ToolTile
                    key={tool.id}
                    tool={tool}
                    onOpen={openTool}
                    onPin={pin}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
      <p className="disclaimer">Hold a tool to pin it. Plans never include a stock pick.</p>
    </div>
  );
}
