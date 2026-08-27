import { useState } from "react";
import { Icon } from "../ds/Icon";
import { SearchField } from "../ds/primitives";
import { UserAvatar } from "../ds/UserAvatar";
import {
  exploreGroupOrder,
  filterExploreTools,
  getExploreTool,
  planMeta,
  type ExploreCategoryId,
  type ExploreTool,
} from "../lib/explore";
import { user } from "../lib/data";
import { useApp } from "../lib/state";

const categoryTabs: { id: "all" | ExploreCategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "account", label: "Account" },
  { id: "market", label: "Market" },
  { id: "intel", label: "Primary & economy" },
  { id: "media", label: "News & learning" },
];

function useOpenTool() {
  const { go, openSheet } = useApp();
  return (tool: ExploreTool) => {
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
        marketDesk: tool.go.marketDesk,
        brokerDesk: tool.go.brokerDesk,
        brokerCode: tool.go.brokerCode,
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

function ToolRow({
  tool,
  pinned,
  onOpen,
  onMenu,
}: {
  tool: ExploreTool;
  pinned: boolean;
  onOpen: (tool: ExploreTool) => void;
  onMenu: (tool: ExploreTool) => void;
}) {
  return (
    <div className={`explore-row${pinned ? " pinned" : ""}`}>
      <button type="button" className="explore-row-main" onClick={() => onOpen(tool)}>
        <ToolGlyph tool={tool} />
        <span className="explore-row-copy">
          <strong>{tool.title}</strong>
          <small>{tool.purpose}</small>
        </span>
        {tool.kind === "portal" && <span className="explore-row-tag">Opens site</span>}
        {tool.soon && <span className="explore-row-tag">Soon</span>}
      </button>
      <button
        type="button"
        className="explore-more"
        aria-label={`Options for ${tool.title}`}
        onClick={() => onMenu(tool)}
      >
        <Icon name="dots" size={18} />
      </button>
    </div>
  );
}

export function DiscoverScreen() {
  const {
    go,
    plan,
    exploreFavorites,
    toggleExploreFavorite,
    homeTools,
    toggleHomeTool,
    flash,
    openSheet,
  } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ExploreCategoryId>("all");
  const openTool = useOpenTool();
  const searching = Boolean(query.trim());
  const meta = planMeta[plan];

  /* Search looks everywhere; the chips narrow the browse. */
  const matches = filterExploreTools(query).filter(
    (tool) => searching || category === "all" || tool.category === category,
  );
  const pinned = exploreFavorites
    .map((id) => getExploreTool(id))
    .filter((tool): tool is ExploreTool => Boolean(tool));

  const pin = (tool: ExploreTool) => {
    const isOn = exploreFavorites.includes(tool.id);
    if (!isOn && exploreFavorites.length >= 4) {
      flash({ message: "Remove one first. Four shortcuts maximum." });
      return;
    }
    toggleExploreFavorite(tool.id);
    flash({ message: isOn ? `Removed ${tool.title} from shortcuts` : `${tool.title} added to your shortcuts` });
  };

  const toHome = (tool: ExploreTool) => {
    const isOn = homeTools.includes(tool.id);
    toggleHomeTool(tool.id);
    flash({ message: isOn ? `Removed ${tool.title} from Home` : `${tool.title} added to Home` });
  };

  /* One menu per tool: where it lives, not what it does. */
  const toolMenu = (tool: ExploreTool) => {
    const fav = exploreFavorites.includes(tool.id);
    const onHome = homeTools.includes(tool.id);
    openSheet({
      kind: "actions",
      title: tool.title,
      note: tool.purpose,
      actions: [
        {
          label: fav ? "Remove from favourites" : "Add to favourites",
          icon: "star",
          onSelect: () => pin(tool),
        },
        {
          label: onHome ? "Remove from home screen" : "Add to home screen",
          icon: "home",
          onSelect: () => toHome(tool),
        },
      ],
    });
  };

  const groups = exploreGroupOrder.filter((group) =>
    matches.some((tool) => tool.group === group),
  );

  return (
    <div className="explore-screen">
      <div className="explore-top">
      <div className="explore-sticky">
        <SearchField
          placeholder="Search a tool — calculator, screener, IPO…"
          value={query}
          onChange={setQuery}
        />
      </div>

      <button type="button" className={`tier-strip tier-${plan}`} onClick={() => go("subscription")}>
        <UserAvatar size={34} />
        <span className="tier-strip-copy">
          <strong>{user.fullName}</strong>
          <small>{plan === "free" ? meta.kicker : `${meta.label} · ${meta.renew}`}</small>
        </span>
        <em>{plan === "free" ? "Upgrade" : "Manage"}</em>
      </button>
      </div>

      {!searching && (
        <>
          {pinned.length > 0 && (
            <section className="explore-cat">
              <p className="explore-group">Your shortcuts</p>
              <div className="explore-favs" aria-label="Pinned tools">
                {pinned.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    className="explore-fav"
                    aria-label={tool.title}
                    onClick={() => openTool(tool)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      toolMenu(tool);
                    }}
                  >
                    <ToolGlyph tool={tool} />
                    <strong>{tool.short}</strong>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="explore-cats" role="tablist" aria-label="Tool categories">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={category === tab.id}
                className={`chip${category === tab.id ? " chip-on" : ""}`}
                onClick={() => setCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}

      {matches.length === 0 ? (
        <div className="explore-empty">
          <p className="t-h-s">
            {searching ? `No tool matches “${query.trim()}”` : "Nothing in this group yet"}
          </p>
          <p className="t-body-s muted">Try calculator, screener, floor sheet, or MeroShare.</p>
        </div>
      ) : (
        groups.map((group) => {
          const rows = matches.filter((tool) => tool.group === group);
          return (
            <section key={group} className="explore-cat">
              <p className="explore-group">{group}</p>
              <div className="explore-list">
                {rows.map((tool) => (
                  <ToolRow
                    key={tool.id}
                    tool={tool}
                    pinned={exploreFavorites.includes(tool.id)}
                    onOpen={openTool}
                    onMenu={toolMenu}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
      <p className="disclaimer">Star a tool to keep it up top. Plans never include a stock pick.</p>
    </div>
  );
}
