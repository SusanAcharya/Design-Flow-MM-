/* Screenshot harness for PRODUCT-DESIGN.md's screen gallery.
   Usage:
     1. npm run dev -- --port 5199 --strictPort   (in another terminal)
     2. npm i -D puppeteer-core                    (once; uses your installed Chrome)
     3. node scripts/design-screens.mjs
   Captures every screen x {mobile, web} x {light, dark} via the prototype's
   deep links (?route=&viewport=&theme=) into design-screens/*.webp.
   After running, rebuild the doc page with scripts/build-design-doc.mjs. */
import puppeteer from "puppeteer-core";
import { mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");

const OUT = join(repo, "design-screens");
mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:5199/Design-Flow-MM-/";
const screens = [
  "onboarding", "start", "signin", "signup",
  "home", "objectives", "objective", "ai",
  "market", "market-desk", "stock", "happening",
  "portfolio", "watchlist", "baskets", "brokers",
  "discover", "search", "learn", "course", "my-learning", "certificates", "course-faq", "lesson", "ipo", "more",
  "alerts", "notifications", "profile", "subscription",
];
const themes = ["light", "dark"];
const viewports = {
  mobile: { width: 900, height: 1440, dsf: 2 },
  web: { width: 1600, height: 1240, dsf: 1.5 },
};

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});

const page = await browser.newPage();
let total = 0, count = 0;

for (const [vp, size] of Object.entries(viewports)) {
  await page.setViewport({ width: size.width, height: size.height, deviceScaleFactor: size.dsf });
  for (const theme of themes) {
    for (const route of screens) {
      const url = `${BASE}?route=${route}&viewport=${vp}&theme=${theme}`;
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
      } catch {
        await page.goto(url, { waitUntil: "load", timeout: 45000 });
      }
      await page.addStyleTag({ content: "#root{zoom:1!important} .device{border-radius:0!important} .studio-menu-btn{display:none!important} *{caret-color:transparent!important}" });
      await page.evaluate(async () => { await document.fonts.ready; });
      await new Promise((r) => setTimeout(r, 650));
      const el = await page.$(".device");
      if (!el) { console.log("NO DEVICE", route, vp, theme); continue; }
      const file = `${OUT}/${route}-${vp}-${theme}.webp`;
      await el.screenshot({ path: file, type: "webp", quality: vp === "web" ? 66 : 72 });
      const kb = Math.round(statSync(file).size / 1024);
      total += kb; count++;
      console.log(`${route}-${vp}-${theme}.webp ${kb}KB`);
    }
  }
}

await browser.close();
console.log(`DONE ${count} shots, ${Math.round(total / 1024 * 10) / 10} MB total`);
