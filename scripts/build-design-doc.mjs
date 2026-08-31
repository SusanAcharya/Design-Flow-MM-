/* Builds the shareable HTML page (Claude artifact) from PRODUCT-DESIGN.md,
   inlining the design-screens/ gallery as data URIs.
   Usage:
     1. npm i -D marked   (once)
     2. node scripts/build-design-doc.mjs   -> scripts/design-doc.html
   Publish the output over the existing artifact URL to keep the same link:
   https://claude.ai/code/artifact/c903a007-6107-48af-9f94-fba06363ead3 */
import { marked } from "marked";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");

const SRC = join(repo, "PRODUCT-DESIGN.md");
const OUT = join(repo, "scripts", "design-doc.html");

let md = readFileSync(SRC, "utf8");

/* Drop the title block + markdown TOC (the page gets a masthead and a live rail). */
md = md.replace(/^# MoneyMitra[^\n]*\n[\s\S]*?## Table of Contents[\s\S]*?\n---\n/, "");

const slugCount = new Map();
const slug = (s) => {
  let base = s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 64);
  const n = slugCount.get(base) ?? 0;
  slugCount.set(base, n + 1);
  return n ? `${base}-${n}` : base;
};

const toc = []; // {level, id, text}
const renderer = new marked.Renderer();
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const plain = tokens.map((t) => t.raw ?? "").join("").replace(/\*\*/g, "");
  const id = slug(plain);
  if (depth === 2 || (depth === 3 && /^15\.\d/.test(plain))) {
    toc.push({ level: depth, id, text: plain });
  }
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};
renderer.table = function (token) {
  const html = marked.Renderer.prototype.table.call(this, token);
  return `<div class="tbl">${html}</div>`;
};

marked.setOptions({ gfm: true, renderer });
let body = marked.parse(md);

/* Inline the screen-gallery captures as data URIs so the page is self-contained. */
body = body.replace(/<img class="(shot-[mw])" src="(design-screens\/[^"]+\.webp)" width="\d+"([^>]*)>/g, (m, cls, rel, rest) => {
  const b64 = readFileSync(join(repo, rel)).toString("base64");
  return `<img class="${cls}" loading="lazy" decoding="async" src="data:image/webp;base64,${b64}"${rest}>`;
});

const tocHtml = toc
  .map((t) => {
    const label = t.text.replace(/^(\d+)\.\s/, '<em>$1</em> ').replace(/^15\.(\d+)\s/, '<em>·</em> ');
    return `<a class="toc-${t.level}" href="#${t.id}">${label}</a>`;
  })
  .join("\n");

const page = `<title>MoneyMitra Product Design</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  :root {
    --canvas: #ffffff;
    --inset: #f4f4f2;
    --sunken: #eeeeec;
    --border-subtle: #ececea;
    --border-default: #d9d9d6;
    --text-1: #050505;
    --text-2: #464644;
    --text-3: #737370;
    --accent: #006bff;
    --accent-soft: #eaf2ff;
    --accent-soft-text: #004fbd;
    --accent-line: #bfd5ff;
    --up: #087b31;
    --warn-soft: #fff4dc;
    --warn-text: #744800;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --canvas: #000000;
      --inset: #141414;
      --sunken: #111111;
      --border-subtle: #1c1c1c;
      --border-default: #262626;
      --text-1: #ffffff;
      --text-2: #9a9a9a;
      --text-3: #6b6b6b;
      --accent: #32e36a;
      --accent-soft: #0c2414;
      --accent-soft-text: #32e36a;
      --accent-line: #163d22;
      --up: #4aff80;
      --warn-soft: #241c0e;
      --warn-text: #e8c56a;
    }
  }
  :root[data-theme="dark"] {
    --canvas: #000000;
    --inset: #141414;
    --sunken: #111111;
    --border-subtle: #1c1c1c;
    --border-default: #262626;
    --text-1: #ffffff;
    --text-2: #9a9a9a;
    --text-3: #6b6b6b;
    --accent: #32e36a;
    --accent-soft: #0c2414;
    --accent-soft-text: #32e36a;
    --accent-line: #163d22;
    --up: #4aff80;
    --warn-soft: #241c0e;
    --warn-text: #e8c56a;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  body {
    background: var(--canvas);
    color: var(--text-1);
    font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 15px;
    line-height: 1.6;
  }
  .frame { display: grid; grid-template-columns: 264px minmax(0, 1fr); max-width: 1200px; margin: 0 auto; }

  /* ---- rail ---- */
  .rail {
    position: sticky; top: 0; align-self: start;
    height: 100dvh; overflow-y: auto; overscroll-behavior: contain;
    padding: 28px 20px 40px 24px;
    border-right: 1px solid var(--border-subtle);
    scrollbar-width: thin;
  }
  .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .brand i {
    width: 30px; height: 30px; border-radius: 10px; flex: none;
    background: var(--accent); color: var(--canvas);
    display: grid; place-items: center;
    font-style: normal; font-weight: 700; font-size: 15px;
  }
  .brand b { font-size: 14.5px; font-weight: 700; letter-spacing: -0.2px; }
  .brand small { display: block; font-size: 10.5px; font-weight: 500; color: var(--text-3); }
  .rail nav { display: flex; flex-direction: column; margin-top: 18px; }
  .rail nav a {
    display: block; text-decoration: none; color: var(--text-2);
    font-size: 12px; line-height: 1.35; font-weight: 500;
    padding: 5px 8px; border-radius: 8px;
  }
  .rail nav a em { font-style: normal; color: var(--text-3); font-weight: 600; font-variant-numeric: tabular-nums; margin-right: 4px; }
  .rail nav a.toc-3 { padding-left: 26px; font-size: 11.5px; color: var(--text-3); }
  .rail nav a:hover { background: var(--inset); color: var(--text-1); }
  .rail nav a.on { background: var(--accent-soft); color: var(--accent-soft-text); }
  .rail nav a.on em { color: var(--accent-soft-text); }

  /* ---- masthead + content ---- */
  main { min-width: 0; padding: 0 48px 96px; }
  .masthead { padding: 52px 0 28px; border-bottom: 1px solid var(--border-subtle); }
  .kicker {
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px;
    color: var(--text-3); margin-bottom: 14px;
  }
  .masthead h1 { font-size: 34px; line-height: 1.15; font-weight: 700; letter-spacing: -1.1px; text-wrap: balance; max-width: 22ch; }
  .masthead p.sub { margin-top: 12px; font-size: 14.5px; color: var(--text-2); max-width: 62ch; }
  .meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
  .meta span {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; color: var(--text-2);
    background: var(--inset); border-radius: 999px; padding: 5px 11px;
    font-variant-numeric: tabular-nums;
  }
  .meta span i { font-style: normal; width: 6px; height: 6px; border-radius: 50%; background: var(--up); }

  /* ---- document typography ---- */
  article { padding-top: 8px; }
  article > * { max-width: 74ch; }
  article h2 {
    max-width: none;
    font-size: 23px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.25; text-wrap: balance;
    margin: 56px 0 4px; padding-top: 30px;
    border-top: 1px solid var(--border-subtle);
    scroll-margin-top: 18px;
  }
  article h3 {
    font-size: 16.5px; font-weight: 700; letter-spacing: -0.25px;
    margin: 34px 0 4px; scroll-margin-top: 18px; text-wrap: balance;
  }
  article h4 {
    font-size: 13px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; color: var(--text-2);
    margin: 26px 0 2px; scroll-margin-top: 18px;
  }
  article p { margin: 12px 0; color: var(--text-2); }
  article p strong, article li strong { color: var(--text-1); font-weight: 600; }
  article ul, article ol { margin: 12px 0; padding-left: 22px; color: var(--text-2); }
  article li { margin: 5px 0; }
  article li::marker { color: var(--text-3); }
  article a { color: var(--accent-soft-text); text-decoration: none; border-bottom: 1px dashed var(--border-default); }
  article a:hover { border-bottom-color: var(--accent); }
  article blockquote {
    margin: 16px 0; padding: 12px 16px;
    background: var(--accent-soft); border: 1px solid var(--accent-line); border-radius: 14px;
    color: var(--text-2); font-size: 14px;
  }
  article blockquote p { margin: 4px 0; }
  article code {
    font-family: "IBM Plex Sans", ui-monospace, monospace;
    font-variant-numeric: tabular-nums;
    font-size: 12.5px; background: var(--inset); border-radius: 6px; padding: 1.5px 6px;
    color: var(--text-1);
  }
  article pre { background: var(--inset); border-radius: 12px; padding: 14px 16px; overflow-x: auto; margin: 14px 0; }
  article pre code { background: none; padding: 0; }
  article hr { border: 0; border-top: 1px solid var(--border-subtle); margin: 40px 0; }
  article em { color: inherit; }

  /* ---- tables ---- */
  .tbl { max-width: none; overflow-x: auto; margin: 16px 0; border: 1px solid var(--border-subtle); border-radius: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  thead th {
    text-align: left; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.45px;
    color: var(--text-3); padding: 9px 12px; border-bottom: 1px solid var(--border-default);
    background: var(--inset); white-space: nowrap;
  }
  tbody td {
    padding: 8px 12px; border-top: 1px solid var(--border-subtle);
    color: var(--text-2); vertical-align: top; font-variant-numeric: tabular-nums; min-width: 88px;
  }
  tbody tr:first-child td { border-top: 0; }
  tbody td strong { color: var(--text-1); }

  /* ---- screen gallery ---- */
  .shots {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    margin: 12px 0 28px; align-items: start;
  }
  .shots img {
    display: block; width: 100%; height: auto;
    border: 1px solid var(--border-subtle); border-radius: 10px;
    background: var(--inset);
  }
  .shots img.shot-w { grid-column: 1 / -1; }
  @media (max-width: 560px) { .shots { grid-template-columns: 1fr; } .shots img.shot-m { max-width: 320px; } }

  /* ---- mobile ---- */
  .toc-mobile { display: none; }
  @media (max-width: 940px) {
    .frame { display: block; }
    .rail { display: none; }
    main { padding: 0 20px 72px; }
    .masthead { padding-top: 36px; }
    .masthead h1 { font-size: 27px; }
    .toc-mobile { display: block; margin: 20px 0 0; border: 1px solid var(--border-subtle); border-radius: 14px; }
    .toc-mobile summary {
      cursor: pointer; list-style: none; padding: 12px 16px;
      font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-2);
    }
    .toc-mobile summary::-webkit-details-marker { display: none; }
    .toc-mobile nav { display: flex; flex-direction: column; padding: 0 10px 12px; }
    .toc-mobile nav a { display: block; text-decoration: none; color: var(--text-2); font-size: 13px; padding: 6px 8px; border-radius: 8px; }
    .toc-mobile nav a.toc-3 { padding-left: 24px; font-size: 12px; color: var(--text-3); }
    .toc-mobile nav a em { font-style: normal; color: var(--text-3); font-weight: 600; margin-right: 4px; }
  }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
</style>

<div class="frame">
  <aside class="rail">
    <div class="brand"><i>M</i><div><b>MoneyMitra</b><small>Product Design Spec</small></div></div>
    <nav id="toc">
${tocHtml}
    </nav>
  </aside>
  <main>
    <header class="masthead">
      <p class="kicker">Product Design Specification · v1.0</p>
      <h1>MoneyMitra, screen by screen</h1>
      <p class="sub">The complete product design of the NEPSE companion app — every screen, component, system, state, and flow, written so a designer can rebuild the whole app in Figma and a stakeholder can understand the product without opening the prototype.</p>
      <div class="meta">
        <span><i></i>22 sections</span>
        <span>19 screens</span>
        <span>26 sheets</span>
        <span>2 themes · 2 viewports</span>
        <span>6 Home stages</span>
        <span>August 2026</span>
      </div>
      <details class="toc-mobile"><summary>Contents</summary><nav>
${tocHtml}
      </nav></details>
    </header>
    <article>
${body}
    </article>
  </main>
</div>

<script>
  (() => {
    const links = Array.from(document.querySelectorAll("#toc a"));
    if (!links.length) return;
    const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const heads = Array.from(document.querySelectorAll("article h2[id], article h3[id]")).filter((h) => byId.has(h.id));
    let current = null;
    const rail = document.querySelector(".rail");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) {
        const link = byId.get(e.target.id);
        if (!link || link === current) continue;
        current?.classList.remove("on");
        link.classList.add("on");
        current = link;
        try {
          const r = link.getBoundingClientRect(), rr = rail.getBoundingClientRect();
          if (r.top < rr.top + 60 || r.bottom > rr.bottom - 60) link.scrollIntoView({ block: "center", behavior: "instant" });
        } catch {}
      }
    }, { rootMargin: "0px 0px -75% 0px" });
    heads.forEach((h) => io.observe(h));
  })();
</script>
`;

writeFileSync(OUT, page);
console.log("wrote", OUT, page.length, "bytes;", toc.length, "toc entries");
