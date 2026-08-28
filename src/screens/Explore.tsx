import { useState } from "react";
import { Icon } from "../ds/Icon";
import { SearchField } from "../ds/primitives";
import { UserAvatar } from "../ds/UserAvatar";
import {
  exploreGroupOrder,
  filterExploreTools,
  getExploreTool,
  homePinMax,
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

/* One tool, one icon. While customising, the tile pins to Home instead of
   opening — the badge says which way the tap will go. */
function ToolTile({
  tool,
  onHome,
  editing,
  onOpen,
  onPin,
  onMenu,
}: {
  tool: ExploreTool;
  onHome: boolean;
  editing: boolean;
  onOpen: (tool: ExploreTool) => void;
  onPin: (tool: ExploreTool) => void;
  onMenu: (tool: ExploreTool) => void;
}) {
  return (
    <button
      type="button"
      className={`explore-tile${onHome ? " on" : ""}${tool.soon ? " soon" : ""}`}
      title={tool.purpose}
      aria-pressed={editing ? onHome : undefined}
      aria-label={editing ? `${onHome ? "Unpin" : "Pin"} ${tool.title}` : tool.title}
      onClick={() => (editing ? onPin(tool) : onOpen(tool))}
      onContextMenu={(event) => {
        event.preventDefault();
        onMenu(tool);
      }}
    >
      <span className="explore-tile-art">
        <ToolGlyph tool={tool} />
        {tool.kind === "portal" && !editing && (
          <span className="explore-tile-mark" aria-hidden><Icon name="ext" size={10} /></span>
        )}
        {/* Pinned always shows the pin. While customising, everything else
            shows the plus that would add it. */}
        {onHome ? (
          <span className={`explore-pin-mark${editing ? " lit" : ""}`} aria-hidden>
            <Icon name="pin" size={11} />
          </span>
        ) : (
          editing && <span className="explore-tile-pin" aria-hidden>+</span>
        )}
      </span>
      <strong>{tool.short}</strong>
    </button>
  );
}

export function DiscoverScreen() {
  const {
    go,
    plan,
    homeTools,
    toggleHomeTool,
    flash,
    openSheet,
  } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ExploreCategoryId>("all");
  const [editing, setEditing] = useState(false);
  const openTool = useOpenTool();
  const searching = Boolean(query.trim());
  const meta = planMeta[plan];

  /* Search looks everywhere; the chips narrow the browse. */
  const matches = filterExploreTools(query).filter(
    (tool) => searching || category === "all" || tool.category === category,
  );
  const homePinned = homeTools
    .map((id) => getExploreTool(id))
    .filter((tool): tool is ExploreTool => Boolean(tool));

  const toHome = (tool: ExploreTool) => {
    const isOn = homeTools.includes(tool.id);
    if (!isOn && homeTools.length >= homePinMax) {
      flash({ message: `Unpin one first. ${homePinMax} on Home maximum.` });
      return;
    }
    toggleHomeTool(tool.id);
    flash({ message: isOn ? `${tool.title} unpinned from Home` : `${tool.title} pinned to Home` });
  };

  /* Press and hold: open it, or change where it lives. */
  const toolMenu = (tool: ExploreTool) => {
    const onHome = homeTools.includes(tool.id);
    openSheet({
      kind: "actions",
      title: tool.title,
      note: tool.purpose,
      actions: [
        { label: "Open", icon: "chev", onSelect: () => openTool(tool) },
        {
          label: onHome ? "Unpin from Home" : "Pin to Home",
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
          {/* Customise: what rides along on Home, and the way to change it. */}
          <section className="explore-cat explore-custom">
            <div className="explore-custom-head">
              <p className="explore-group">Pinned to Home</p>
              <button
                type="button"
                className={`explore-custom-btn${editing ? " on" : ""}`}
                aria-pressed={editing}
                onClick={() => setEditing((was) => !was)}
              >
                {editing ? "Done" : <><Icon name="sliders" size={14} /> Customise</>}
              </button>
            </div>
            {editing ? (
              <p className="explore-custom-hint">
                Tap any tool below to pin or unpin it. {homeTools.length} of {homePinMax}
              </p>
            ) : homePinned.length === 0 ? (
              <p className="explore-custom-hint">
                Nothing pinned. Tap Customise and pick the tools you want on Home.
              </p>
            ) : null}
            {homePinned.length > 0 && (
              <div className="explore-favs" aria-label="Pinned to Home">
                {homePinned.map((tool) => (
                  <ToolTile
                    key={tool.id}
                    tool={tool}
                    onHome
                    editing={editing}
                    onOpen={openTool}
                    onPin={toHome}
                    onMenu={toolMenu}
                  />
                ))}
              </div>
            )}
          </section>

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
              <div className="explore-grid">
                {rows.map((tool) => (
                  <ToolTile
                    key={tool.id}
                    tool={tool}
                    onHome={homeTools.includes(tool.id)}
                    editing={editing}
                    onOpen={openTool}
                    onPin={toHome}
                    onMenu={toolMenu}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
