/* Builds the shareable icon sheet (Claude artifact) from icon-concepts/,
   so the page can never drift from the glyphs on disk.
   Usage:
     node scripts/build-icon-sheet.mjs   -> scripts/icon-sheet.html
   Publish the output over the existing artifact URL to keep the same link:
   https://claude.ai/code/artifact/ac54a87a-bf5a-46f9-a88c-a016cdcac2b8 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(repo, "scripts", "icon-sheet.html");

/* Titles come from where the icon is actually used — lib/explore.ts for the
   tools, lib/nav.ts for the named places — so a renamed tool renames its card.
   `nav: true` puts the glyph in the at-size strip. */
const META = {
  home: ["Home", "Navigation", true],
  market: ["Market (tab)", "Navigation", true],
  tulkey: ["Mitra (AI tab)", "Navigation", true],
  discover: ["Explore (tab)", "Navigation", true],
  wallet: ["Portfolio (tab)", "Navigation", true],

  globe: ["Language", "Account"],
  bookmark: ["My Watchlist", "Account"],
  handshake: ["Brokers", "Account"],
  basket: ["Baskets", "Account"],
  bell: ["My Alerts", "Account"],
  ticket: ["IPO Allotment Tracker", "Account"],

  pulse: ["Live Market Tape", "Live trading"],
  table: ["Floor Sheet", "Live trading"],
  depth: ["Market Depth", "Live trading"],
  candles: ["Technical Charts", "Live trading"],

  sliders: ["Stock Screener", "Screener & analytics"],
  compare: ["Compare Stocks", "Screener & analytics"],
  gauge: ["Emotion Meter", "Screener & analytics"],
  calc: ["Stock Valuators", "Screener & analytics"],

  index: ["Market Indices", "Market statistics"],
  pie: ["Sector Performance", "Market statistics"],
  range: ["52-Week High/Low", "Market statistics"],
  movers: ["Market Movers", "Market statistics"],
  clipboard: ["Market Summary", "Market statistics"],
  percent: ["Gainers & Losers", "Market statistics"],
  tag: ["Stock Price", "Market statistics"],
  database: ["NEPSE Data", "Market statistics"],

  rocket: ["Open IPOs", "Primary market"],
  coins: ["Mutual Funds", "Primary market"],
  receipt: ["C-ASBA Fee Calculator", "Primary market"],

  coin: ["Dividend Calendar", "Corporate actions"],
  users: ["AGM & Right Share History", "Corporate actions"],
  merge: ["Mergers & Acquisitions", "Corporate actions"],

  ingot: ["Commodity Prices", "Economy & forex"],
  forex: ["Forex Rates", "Economy & forex"],
  bank: ["NRB Macro Data", "Economy & forex"],

  news: ["Stock News", "News & reports"],
  mail: ["Daily Newsletters", "News & reports"],
  doc: ["Company Financial Reports", "News & reports"],
  megaphone: ["Corporate Announcements", "News & reports"],

  learn: ["Courses", "Learning"],
  book: ["My Learning", "Learning"],
  lesson: ["2-Minute Market Lessons", "Learning"],
  dictionary: ["Stock Market Dictionary", "Learning"],
  certificate: ["Certificates", "Learning"],

  idcard: ["MeroShare", "External portals"],
  terminal: ["Broker TMS", "External portals"],
  shield: ["SEBON", "External portals"],
  vault: ["CDSC", "External portals"],
};

const GROUP_ORDER = [
  "Navigation", "Account", "Live trading", "Screener & analytics", "Market statistics",
  "Primary market", "Corporate actions", "Economy & forex", "News & reports", "Learning",
  "External portals",
];

const conceptDir = join(repo, "icon-concepts");
const keys = readdirSync(conceptDir)
  .filter((f) => f.startsWith("ic-") && f.endsWith(".svg"))
  .map((f) => f.slice(3, -4))
  .sort();

/* Fail loudly rather than shipping a sheet that quietly omits a glyph. */
const untitled = keys.filter((k) => !META[k]);
const orphaned = Object.keys(META).filter((k) => !keys.includes(k));
if (untitled.length) throw new Error(`icon-concepts/ has no META entry for: ${untitled.join(", ")}`);
if (orphaned.length) throw new Error(`META names a missing concept file: ${orphaned.join(", ")}`);

/** The concept sources are pretty-printed; the sheet wants one flat run of tags. */
function inner(key) {
  const raw = readFileSync(join(conceptDir, `ic-${key}.svg`), "utf8");
  return raw
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/\s*\n\s*/g, "")
    .trim();
}

const ICONS = GROUP_ORDER.flatMap((group) =>
  Object.keys(META)
    .filter((k) => META[k][1] === group)
    .map((k) => ({ key: k, title: META[k][0], group, nav: META[k][2] === true, svg: inner(k) })),
);

/* The strip mirrors the real tab bar, so it runs in tab order, not name order. */
const NAV_ORDER = ["home", "market", "tulkey", "wallet", "discover"];

const markData = `data:image/png;base64,${readFileSync(join(repo, "public/mitra/mitra-mark.png")).toString("base64")}`;

const page = `<title>Mitra Icon Set</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #ffffff;
    --surface: #f6f7f9;
    --surface-2: #edeff2;
    --border: #e3e5e9;
    --text: #0a0a0a;
    --text-2: #47483f;
    --text-3: #74756f;
    --accent: #006bff;
    --accent-soft: #eaf2ff;
    --accent-text: #004fbd;
    --mono-fg: #171717;
    --swatch-dark-bg: #111111;
    --swatch-dark-fg: #ffffff;
    --swatch-light-bg: #ffffff;
    --swatch-light-fg: #0a0a0a;
    --swatch-border: #e3e5e9;
    --font-ui: "IBM Plex Sans", -apple-system, "Segoe UI", sans-serif;
    --font-mono: "IBM Plex Mono", "SF Mono", Consolas, monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #0a0a0a; --surface: #121212; --surface-2: #1a1a1a; --border: #262626;
      --text: #ffffff; --text-2: #a3a39d; --text-3: #74746e;
      --accent: #32e36a; --accent-soft: rgba(50, 227, 106, 0.14); --accent-text: #32e36a;
      --mono-fg: #e8e8e8; --swatch-border: #2a2a2a;
    }
  }
  :root[data-theme="dark"] {
    --bg: #0a0a0a; --surface: #121212; --surface-2: #1a1a1a; --border: #262626;
    --text: #ffffff; --text-2: #a3a39d; --text-3: #74746e;
    --accent: #32e36a; --accent-soft: rgba(50, 227, 106, 0.14); --accent-text: #32e36a;
    --mono-fg: #e8e8e8; --swatch-border: #2a2a2a;
  }

  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--font-ui); -webkit-font-smoothing: antialiased; }
  ::selection { background: var(--accent-soft); color: var(--accent-text); }

  .wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px 96px; }

  .top { position: sticky; top: 0; z-index: 20; background: color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); }
  .top-inner { max-width: 1180px; margin: 0 auto; padding: 20px 24px 16px; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-mark { width: 38px; height: 38px; border-radius: 50%; flex: none; overflow: hidden; background: var(--surface); border: 1px solid var(--border); display: grid; place-items: end center; }
  .brand-mark img { width: 34px; height: 34px; display: block; object-fit: contain; }
  .brand h1 { font-size: 19px; font-weight: 700; letter-spacing: -0.3px; margin: 0; line-height: 1.15; }
  .brand p { margin: 2px 0 0; font-size: 12.5px; color: var(--text-3); }

  .controls { display: flex; align-items: center; gap: 10px; }
  .count-chip { font-family: var(--font-mono); font-size: 11.5px; color: var(--text-2); background: var(--surface); border: 1px solid var(--border); padding: 5px 10px; border-radius: 999px; }
  .swatch-toggle { display: flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .swatch-toggle button { font-family: var(--font-ui); font-size: 12.5px; font-weight: 600; padding: 7px 13px; border: none; cursor: pointer; background: var(--surface); color: var(--text-3); }
  .swatch-toggle button.on { background: var(--accent); color: var(--bg); }
  [data-theme="dark"] .swatch-toggle button.on,
  :root:not([data-theme="light"]) .swatch-toggle button.on { color: #05210c; }
  @media (prefers-color-scheme: light) { .swatch-toggle button.on { color: var(--bg); } }

  .tabs { max-width: 1180px; margin: 0 auto; padding: 0 24px 12px; display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { flex: none; font-family: var(--font-ui); font-size: 13px; font-weight: 600; padding: 7px 13px; border-radius: 999px; border: 1px solid var(--border); background: transparent; color: var(--text-2); cursor: pointer; white-space: nowrap; }
  .tab.on { background: var(--text); color: var(--bg); border-color: var(--text); }

  .intro { padding: 28px 0 6px; max-width: 660px; }
  .intro h2 { font-size: 15px; font-weight: 600; margin: 0 0 6px; color: var(--text); }
  .intro p { font-size: 13.5px; line-height: 1.55; color: var(--text-2); margin: 0 0 10px; }
  .intro p:last-child { margin-bottom: 0; }
  code { font-family: var(--font-mono); font-size: 0.92em; }

  .strip { margin-top: 22px; padding: 16px 18px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
  .strip-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-3); flex: none; }
  .strip-row { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
  .strip-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .strip-item .glyph-box { width: 20px; height: 20px; color: var(--text); display: grid; place-items: end center; }
  .strip-item .glyph-box svg { width: 100%; height: 100%; }
  .strip-item .glyph-box img { width: 20px; height: 20px; display: block; object-fit: contain; }
  .strip-item span { font-family: var(--font-mono); font-size: 10px; color: var(--text-3); }

  /* The mascot is the one nav slot that is a picture, so it gets shown as one. */
  .mascot { margin-top: 12px; padding: 18px; border-radius: 14px; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .mascot-copy { flex: 1; min-width: 240px; }
  .mascot-copy strong { display: block; font-size: 13.5px; font-weight: 650; margin-bottom: 4px; }
  .mascot-copy p { margin: 0; font-size: 12.5px; line-height: 1.55; color: var(--text-2); }
  .mascot-set { display: flex; align-items: flex-end; gap: 20px; }
  .mascot-cell { display: flex; flex-direction: column; align-items: center; gap: 7px; }
  .mascot-cell span { font-family: var(--font-mono); font-size: 10px; color: var(--text-3); }
  .fab-demo { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; display: grid; place-items: end center; background: var(--bg); box-shadow: 0 0 0 1px var(--border), 0 8px 24px color-mix(in srgb, var(--accent) 32%, transparent); }
  .fab-demo img { width: 50px; height: 50px; display: block; object-fit: contain; margin-bottom: -2px; }
  .tab-demo img { width: 22px; height: 22px; display: block; object-fit: contain; }
  .tab-demo.off img { filter: saturate(0.12) opacity(0.7); }

  .group { margin-top: 40px; }
  .group-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
  .group-head h3 { font-size: 14.5px; font-weight: 650; margin: 0; }
  .group-head .n { font-family: var(--font-mono); font-size: 11px; color: var(--text-3); }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 10px; }
  .card { border: 1px solid var(--border); border-radius: 14px; background: var(--surface); padding: 16px 12px 12px; display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; transition: border-color .12s ease, background .12s ease; }
  .card:hover { border-color: var(--accent); }
  .card.open { background: var(--surface-2); }
  .swatch { width: 64px; height: 64px; border-radius: 14px; display: grid; place-items: center; background: var(--swatch-light-bg); border: 1px solid var(--swatch-border); }
  [data-swatch="dark"] .swatch { background: var(--swatch-dark-bg); }
  .swatch svg { width: 28px; height: 28px; color: var(--swatch-light-fg); }
  [data-swatch="dark"] .swatch svg { color: var(--swatch-dark-fg); }
  .card-name { font-size: 12.5px; font-weight: 600; text-align: center; line-height: 1.3; }
  .card-key { font-family: var(--font-mono); font-size: 10.5px; color: var(--text-3); text-align: center; }
  .card-note { font-size: 10.5px; line-height: 1.4; text-align: center; color: var(--accent-text); }

  .code-pop { grid-column: 1 / -1; margin-top: -2px; margin-bottom: 4px; border: 1px solid var(--border); border-radius: 14px; background: var(--mono-fg); padding: 14px 16px; display: none; }
  .code-pop.show { display: block; }
  .code-pop .file { font-family: var(--font-mono); font-size: 11px; color: #8fe0a8; margin-bottom: 8px; }
  .code-pop pre { margin: 0; font-family: var(--font-mono); font-size: 11.5px; line-height: 1.55; color: #e8e8e8; white-space: pre-wrap; word-break: break-all; }

  footer.note { margin-top: 56px; padding-top: 20px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-3); line-height: 1.6; }
</style>

<div class="top">
  <div class="top-inner">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true"><img data-mark alt=""></span>
      <div>
        <h1>Mitra Icon Set</h1>
        <p>${ICONS.length} glyphs drawn for MoneyMitra's nav and Explore tools — shipping in <code>public/icons/</code></p>
      </div>
    </div>
    <div class="controls">
      <span class="count-chip" id="visible-count">${ICONS.length} / ${ICONS.length}</span>
      <div class="swatch-toggle" role="group" aria-label="Preview background">
        <button type="button" data-swatch="light" class="on">Light</button>
        <button type="button" data-swatch="dark">Dark</button>
      </div>
    </div>
  </div>
  <nav class="tabs" id="tabs"></nav>
</div>

<div class="wrap">
  <div class="intro">
    <h2>How to review</h2>
    <p>Every glyph sits on a 24×24 grid with round caps and joins, drawn as a single-colour mask exactly the way the app renders <code>public/icons/*.svg</code>. Click any card to open its exact source. Toggle Light / Dark above to check both surfaces.</p>
    <p>Sources are drawn at <strong>2px stroke</strong> in <code>icon-concepts/</code> and thinned to <strong>1.8px</strong> on install, which sits better against this app's type. Cards below show the concept source, so they read one notch heavier than the shipped file.</p>
  </div>

  <div class="strip">
    <span class="strip-label">Bottom nav, at 20px</span>
    <div class="strip-row" id="nav-strip"></div>
  </div>

  <div class="mascot">
    <div class="mascot-copy">
      <strong>Mitra rides the nav and the FAB as artwork, not a mask</strong>
      <p>The AI tab and Home's action button carry Mitra's own face from <code>public/mitra/mitra-mark.png</code>. A mask icon is single-colour by design and can't hold the topi or the green, so this one stays a picture — it desaturates when the tab is off instead of tinting. The <code>tulkey</code> speech-bubble glyph below still serves the smaller inline spots.</p>
    </div>
    <div class="mascot-set">
      <div class="mascot-cell">
        <span class="fab-demo"><img data-mark alt=""></span>
        <span>FAB 56px</span>
      </div>
      <div class="mascot-cell">
        <span class="tab-demo"><img data-mark alt=""></span>
        <span>tab on</span>
      </div>
      <div class="mascot-cell">
        <span class="tab-demo off"><img data-mark alt=""></span>
        <span>tab off</span>
      </div>
    </div>
  </div>

  <div id="groups"></div>

  <footer class="note">
    Sources live in <code>icon-concepts/</code> as <code>ic-&lt;name&gt;.svg</code>, one per key in <code>src/ds/Icon.tsx</code>. Filled "money-node" dots carry <code>stroke="none"</code> so they render as clean dots under <code>mask-image</code>, matching how <code>.icon { background-color: currentColor }</code> colours every icon in the app. <code>discover</code> is Lucide's telescope redrawn to these rules; the other 48 are original. This page is generated by <code>scripts/build-icon-sheet.mjs</code> — edit the SVGs, not the page.
  </footer>
</div>

<script>
const ICONS = ${JSON.stringify(ICONS)};
const GROUP_ORDER = ${JSON.stringify(GROUP_ORDER)};
const NAV_ORDER = ${JSON.stringify(NAV_ORDER)};
const MARK = ${JSON.stringify(markData)};
const TOTAL = ICONS.length;
document.querySelectorAll('img[data-mark]').forEach(el => { el.src = MARK; });
const ROOT_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

function svgTag(icon) {
  return '<svg ' + ROOT_ATTRS + '>' + icon.svg + '</svg>';
}

function fileSource(icon) {
  const inner = icon.svg.replace(/> </g, '>\\n  <').replace(/^</, '  <');
  return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">\\n' + inner + '\\n</svg>';
}

// nav strip — the AI tab shows the mascot the app actually renders there
const navStrip = document.getElementById('nav-strip');
NAV_ORDER.map(k => ICONS.find(i => i.key === k)).forEach(icon => {
  const el = document.createElement('div');
  el.className = 'strip-item';
  const art = icon.key === 'tulkey' ? '<img src="' + MARK + '" alt="">' : svgTag(icon);
  const label = icon.key === 'tulkey' ? 'mitra-mark' : icon.key;
  el.innerHTML = '<span class="glyph-box">' + art + '</span><span>' + label + '</span>';
  navStrip.appendChild(el);
});

const tabsEl = document.getElementById('tabs');
let activeGroup = 'All';
function renderTabs() {
  tabsEl.innerHTML = '';
  ['All'].concat(GROUP_ORDER).forEach(g => {
    const b = document.createElement('button');
    b.className = 'tab' + (g === activeGroup ? ' on' : '');
    b.textContent = g;
    b.onclick = () => { activeGroup = g; renderTabs(); renderGroups(); };
    tabsEl.appendChild(b);
  });
}

const groupsEl = document.getElementById('groups');
let swatch = 'light';

function renderGroups() {
  groupsEl.innerHTML = '';
  const groups = activeGroup === 'All' ? GROUP_ORDER : [activeGroup];
  let shown = 0;
  groups.forEach(g => {
    const items = ICONS.filter(i => i.group === g);
    if (!items.length) return;
    shown += items.length;
    const sec = document.createElement('section');
    sec.className = 'group';
    sec.innerHTML = '<div class="group-head"><h3>' + g + '</h3><span class="n">' + items.length + ' icon' + (items.length === 1 ? '' : 's') + '</span></div>';
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.dataset.swatch = swatch;
    items.forEach(icon => {
      const card = document.createElement('div');
      card.className = 'card';
      const note = icon.key === 'tulkey' ? '<div class="card-note">Nav now uses the mascot</div>' : '';
      card.innerHTML = '<div class="swatch">' + svgTag(icon) + '</div><div class="card-name">' + icon.title + '</div><div class="card-key">ic-' + icon.key + '.svg</div>' + note;
      const pop = document.createElement('div');
      pop.className = 'code-pop';
      pop.innerHTML = '<div class="file">ic-' + icon.key + '.svg</div><pre></pre>';
      pop.querySelector('pre').textContent = fileSource(icon);
      card.onclick = () => {
        const isOpen = pop.classList.contains('show');
        grid.querySelectorAll('.code-pop.show').forEach(p => p.classList.remove('show'));
        grid.querySelectorAll('.card.open').forEach(c => c.classList.remove('open'));
        if (!isOpen) { pop.classList.add('show'); card.classList.add('open'); }
      };
      grid.appendChild(card);
      grid.appendChild(pop);
    });
    sec.appendChild(grid);
    groupsEl.appendChild(sec);
  });
  document.getElementById('visible-count').textContent = shown + ' / ' + TOTAL;
}

document.querySelectorAll('.swatch-toggle button').forEach(btn => {
  btn.onclick = () => {
    swatch = btn.dataset.swatch;
    document.querySelectorAll('.swatch-toggle button').forEach(b => b.classList.toggle('on', b === btn));
    document.querySelectorAll('.grid').forEach(g => g.dataset.swatch = swatch);
  };
});

renderTabs();
renderGroups();
</script>
`;

writeFileSync(OUT, page);
console.log("wrote", OUT, page.length, "bytes;", ICONS.length, "icons");
