# Designer Flow · platform design system

Living document for the **MoneyMitra Design System v1.0** as implemented in this platform.

Source of truth: Figma file *Money Mitra App*, page **Design System v1.0** (`97:2`). The Figma file is read-only. Theme and colour tweaks happen **here**, then this file is updated to match.

Extracted 22 Aug 2026. Variable collection `Theme` has modes **Light** and **Dark**. Collection `Primitives` holds radius and spacing.

---

## Principles

1. **Calm by default.** Home is one warm paper sheet. Sections are a title, space, and a hairline — not a stack of cards. Tint only for attention, objectives, and teaching asides.
2. **Colour means money.** Green and red are reserved for market movement. Light accent is MoneyMitra Chirfaar blue (`#026BA4`); dark accent is the site cyan (`#81E8EF`). A gaining stock can never be the same colour as a button.
3. **Display numbers in the UI face.** Big prices and index values use Satoshi (or the studio Font) with tabular numerals. Geist Mono stays on tickers, tables, timestamps, and compact deltas so columns still line up.
4. **Plain Nepali words.** Short explanations in context; exact market terms kept (P/E, kitta, NEPSE).
5. **Teach, don’t pick.** Objectives explain what something is and which platform does the work (MeroShare, C-ASBA, TMS). They never say what to buy or sell.
6. **One product, five Home titles — plus a Base stack.** Studio **Base** is the default and shows the full Home template (pulse → book → holdings → alerts → bytes → movers → IPOs). Newbie / IPO applicant / New trader / Holder / Veteran still change which modules appear. The onboarding characters are only a chooser — they never become the profile face.
7. **Honest handoff.** IPO apply and trade are external (MeroShare / C-ASBA / TMS). Never imply MoneyMitra submitted them.
8. **Dark mode uses quieter surfaces, not shadows.** Light Home is a single paper sheet. Dark Home is charcoal with hairlines so faint they almost disappear — depth comes from value, not cards. Selected feed tabs may use a 1px paper lift in light.

---

## How this platform maps the system

| Figma | Platform |
|---|---|
| Theme / Light, Theme / Dark | Studio **Light / Dark** (`data-theme` on the device) |
| Type / Satoshi, Plus Jakarta Sans, Geist Mono, Subjectivity, Chillax, GT America | Studio **Font** (`data-font` on the device) |
| Mobile · 390 | Studio **Mobile 390** |
| Desktop · 1440 | Studio **Web 1440** |
| Home · 0–4 stages | Studio **Home stage** |
| CSS variables `--bg-canvas`, `--accent-base`, … | `src/styles/tokens.css` |

Tweaking a colour: edit the Light and/or Dark block in `src/styles/tokens.css`, then update the hex in the tables below.

---

## Colour — Theme tokens

Every colour is a **role**, never a raw hue in components.

### Surfaces

| Token | CSS | Light | Dark |
|---|---|---|---|
| bg/canvas | `--bg-canvas` | `#F5F2EB` | `#121212` |
| bg/surface | `--bg-surface` | `#FFFFFF` | `#181818` |
| bg/raised | `--bg-raised` | `#FFFFFF` | `#222222` |
| bg/sunken | `--bg-sunken` | `#EBE7DE` | `#0E0E0E` |
| bg/inset | `--bg-inset` | `#F0ECE4` | `#1E1E1E` |
| bg/inverse | `--bg-inverse` | `#1A1916` | `#F4F4F2` |

### Borders

| Token | CSS | Light | Dark |
|---|---|---|---|
| border/subtle | `--border-subtle` | `#E6E1D6` | `#242424` |
| border/default | `--border-default` | `#D5CFC2` | `#2C2C2C` |
| border/strong | `--border-strong` | `#B8AF9E` | `#3A3A3A` |
| border/focus | `--border-focus` | `#026BA4` | `#81E8EF` |

### Text

| Token | CSS | Light | Dark |
|---|---|---|---|
| text/primary | `--text-primary` | `#1A1916` | `#F4F4F2` |
| text/secondary | `--text-secondary` | `#4A4640` | `#A3A3A3` |
| text/tertiary | `--text-tertiary` | `#6F6A62` | `#737373` |
| text/inverse | `--text-inverse` | `#F7F5F0` | `#121212` |
| text/onAccent | `--text-on-accent` | `#FFFFFF` | `#062026` |

### Accent (the only saturated blue on a screen)

| Token | CSS | Light | Dark |
|---|---|---|---|
| accent/base | `--accent-base` | `#026BA4` | `#81E8EF` |
| accent/hover | `--accent-hover` | `#025A8A` | `#A8F2F6` |
| accent/soft | `--accent-soft` | `#E3F2FA` | `#123338` |
| accent/softText | `--accent-soft-text` | `#025A8A` | `#81E8EF` |
| accent/line | `--accent-line` | `#9DCEE8` | `#1E4A50` |

### Market movement (never for buttons except Buy/Sell)

| Token | CSS | Light | Dark |
|---|---|---|---|
| up/base | `--up-base` | `#35B14F` | `#3DD68B` |
| up/soft | `--up-soft` | `#E8F7EC` | `#0F2B21` |
| up/text | `--up-text` | `#1F6138` | `#5EE9A4` |
| down/base | `--down-base` | `#E11D2E` | `#FF6B6B` |
| down/soft | `--down-soft` | `#FDECED` | `#2A1416` |
| down/text | `--down-text` | `#B01222` | `#FF8A8A` |
| flat/base | `--flat-base` | `#6F6A62` | `#737373` |

Green/red are **paired with a triangle and a signed number**. Colour is never the only encoding.

### Warning & decorative

| Token | CSS | Light | Dark |
|---|---|---|---|
| warn/base | `--warn-base` | `#E08700` | `#F5B33C` |
| warn/soft | `--warn-soft` | `#FBF1DF` | `#2B2113` |
| warn/text | `--warn-text` | `#825000` | `#F5C46B` |
| deco/violet | `--deco-violet` | `#7C5CF0` | `#A188FF` |
| deco/violetSoft | `--deco-violet-soft` | `#F0EBFE` | `#1C1730` |
| deco/saffron | `--deco-saffron` | `#F08C00` | `#FFB43D` |
| deco/saffronSoft | `--deco-saffron-soft` | `#FDF0DC` | `#2A1E0C` |
| deco/teal | `--deco-teal` | `#0F9C9C` | `#81E8EF` |
| deco/tealSoft | `--deco-teal-soft` | `#E2F5F4` | `#123338` |

Signature palette: Light Chirfaar blue `#026BA4`, Gurumantra green `#35B14F`, site cyan `#81E8EF`. Dark-ink board: Cyan `#81E8EF`, Up `#3DD68B`, Down `#FF6B6B`, Watch `#F5B33C`, Violet `#A188FF`, Saffron `#FFB43D`, Ink `#F4F4F2`.

---

## Shape

| Token | CSS | Value | Use |
|---|---|---|---|
| radius/xs | `--radius-xs` | 6 | keyboard chip, session pill |
| radius/sm | `--radius-sm` | 10 | small controls |
| radius/md | `--radius-md` | 14 | rail items, avatars |
| radius/lg | `--radius-lg` | 20 | cards, attention modules |
| radius/xl | `--radius-xl` | 28 | large hero cards |
| radius/full | `--radius-full` | 999 | **buttons, chips, inputs are pills** |

Primary is the only saturated blue. Buttons are pill-shaped everywhere.

---

## Spacing (4px grid)

| Token | CSS | Value |
|---|---|---|
| space/1–12 | `--space-1` … `--space-12` | 4, 8, 12, 16, 20, 24, 32, 40, 48 |

Mobile gutter: **20px**. Touch targets: **44px+** (primary actions 46–52px).

Desktop: 248px rail, 68px top bar. Home is a single column — no duplicate context rail.

---

## Typography

**Satoshi** is the default UI face. Studio **Font** swaps `--font-sans` on the device (`data-font`) so you can compare Satoshi, Plus Jakarta Sans, Geist Mono, Subjectivity, Chillax, and GT America. Display figures (Home NEPSE, book, Market, Stock) use `--font-sans` with tabular numerals. **Geist Mono** stays on `--font-mono` for tickers, tables, timestamps, and overlines. GT America needs a licensed Regular / Medium / Bold file in `public/fonts/gt-america/` (or the desktop font installed) — it is not bundled.

| Style | Size / weight / line / tracking |
|---|---|
| Display/XL | 34 Bold / 40 / −1 |
| Display/L | 28 Bold / 34 / −0.8 |
| Display/M | 22 Bold / 28 / −0.5 |
| Heading/XL | 22 SemiBold / 28 / −0.4 |
| Heading/L | 18 SemiBold / 24 / −0.3 |
| Heading/M | 16 SemiBold / 22 / −0.2 |
| Heading/S | 14 SemiBold / 20 / −0.1 |
| Body/L | 16 Regular / 24 |
| Body/M | 14 Regular / 20 |
| Body/S | 13 Regular / 19 |
| Body/XS | 12 Regular / 17 |
| Label/L | 14 Medium / 18 / −0.1 |
| Label/M | 13 Medium / 16 / −0.1 |
| Label/S | 11.5 Medium / 15 |
| Overline | 10.5 Mono SemiBold / 13 / 0.7 · UPPERCASE |
| Figure kicker | 13.5 Sans SemiBold / 18 / −0.15 · title case |
| Section title | 16 Sans SemiBold / 22 / −0.25 · title case · on the sheet, not in a card |
| Display figure | 32–40 Sans Bold / −1.1 · tabular |
| Mono/Ticker | 14 Mono SemiBold / 18 / 0.2 |
| Mono/Figure M | 14 Mono Medium / 18 |
| Mono/Figure S | 11 Mono Medium / 14 / 0.2 |

NPR money uses Indian grouping (lakh/crore style): `3,93,800`. Percents: 2 decimals on cards unless noted. Kitta: integers.

---

## Elevation

| Style | Light | Dark |
|---|---|---|
| Elevation/Card | `0 1px 2px rgba(23,20,15,.05), 0 6px 16px -4px rgba(23,20,15,.06)` | none — use border |
| Elevation/Raised | `0 12px 32px -8px rgba(23,20,15,.08)` | none |
| Elevation/Nav | `0 -2px 24px -6px rgba(23,20,15,.10)` | none |
| Elevation/Accent | `0 8px 20px -6px rgba(2,107,164,.28)` | cyan glow at 28% |

---

## Components (atoms)

Implemented in `src/ds/primitives.tsx` and `src/styles/ui.css`.

- **Button/primary** — pill, accent fill, 52px lg / 46px md. Dark mode: cyan fill, dark teal label (`text/onAccent`).
- **Button/secondary** — raised fill in light, inset fill in dark.
- **Button/ghost** — accent soft text, no fill.
- **Button/danger** · **Button/up** — Sell / Buy only.
- **Chips** — selected is **filled** accent, not outlined.
- **Delta chips** — triangle + signed % in lists (still a small tinted chip). **Move mark** under a display figure: no box — triangle, rupee change, then percent, in up/down text colour.
- **Badges** — dot + label (Following teal, New listing accent, Right share violet, Bull saffron, Book closure warn).
- **Input / search** — pill, 40–46px, icon left.
- **Explain chip** — info icon + “What is …?”
- **Tab bar / rail** — Home, Market, Tulkey AI, Portfolio, Explore. Mobile header: menu, greeting, search, alerts, initials avatar. Web header: greeting, search, session, alerts, avatar.
- **Home feeds** — Four top tabs on every title: **Home**, **Watchlist**, **Brokers**, **Baskets**. Home is one paper sheet. Each block is a section title (Market, Your book, Holdings) then content — not a card. Holdings, movers and watchlists use a flush table (Symbol / path / Last / Today). Book snapshot is a three-column stat table (Today / Overall / Cash). **What’s happening** is a short news digest of the session — headlines and one-line context, not a stats strip. Broker Chirfaar is observed flow, never a signal.
- **Onboarding** — Tulkey greets you, you pick who’s closest, then you enter Home. No mock preview. Stage and objective come from the person you choose.
- **Objective path** — Home keeps a compact strip. The Objective screen holds the video sitting, short notes, and a learned vs left checklist. Tapping a module swaps the sitting. Completing “I understand this” advances the current sitting only.
- **Navigation drawer** — profile, all five primary destinations, then Watchlist, Brokers, Baskets, and Tools.
- **Explore** — profile/settings row, search, analysis tools, screener, comparison, WACC, IPO and alerts.
- **Market** — tabs lead the page. Overview alone has index chips, then the index tape, three session totals, a three-part breadth bar, and compact gainers / losers / sector / floor / event summaries. Movers, Sectors, Floor sheet, and Events each have their own filters and teaching context.
- **Sheets** — metric explain, profile/level, order handoff, compare, transaction correction, circuit rules.
- **Quick explain sheet** — info chips open a short in-context definition with one dismiss action; full lessons remain explicit library destinations.
- **Session tape** — NEPSE hours 11:00–3:00 with yesterday’s close as a dashed horizon; fill is green above / red below that line. Last print is a bead. Not a generic sparkline.
- **Price spine** — day’s high–low drawn inside the circuit window (5% index / 10% stock), with open and last marked.
- **Breadth** — Home may use a compact field; Market Overview uses a three-part rose / fell / unchanged bar so all three counts are explicit.

---

## Screens in the demo

Clickable paths (same information architecture on mobile and web; theme via tokens):

1. Onboarding — Tulkey greets you, you tap who’s closest (Maya / Prakash / Sita / Anil). That pick becomes a title, not a profile face.
2. Home × five titles: Newbie, IPO applicant, New trader, Holder, Veteran. Same four tabs; Home stack swaps the book, holdings, and objective/alert module.
3. Objective page — what to know, which platform, video placeholder, then the next on the path. Not a buy/sell call.
4. Market (overview, movers, sectors, floor sheet, events)
5. Stock detail (NABIL) + Trade handoff + tap-to-learn metrics
6. Portfolio (empty Explorer; IPO pipeline for Primary; ledger otherwise)
7. Discover / Search
8. Learn / lesson sheets
9. IPO (MeroShare handoff)
10. More / Tools (density lock, profile)
11. Alerts + circuit overlay (studio Circuit control)
12. Holding correction (append-only audit)

---

## Change log

| Date | Change |
|---|---|
| 2026-08-25 | Stock detail rebuilt from the reference: line/candle chart controls with optional RSI, complete Overview / Financials / Floor sheet / Events tabs, persistent TMS handoff, and benchmark metric sheet. |
| 2026-08-25 | Market rebuilt around the reference IA: tab-specific controls, NEPSE tape and breadth, mover/sector tables, broker floor sheet, events, and plain-language explainers. |
| 2026-08-25 | Move next to a figure is type only: triangle + amount + percent in up/down colour, no well. Home NEPSE is a session tape; portfolio is day columns. |
| 2026-08-24 | Light paper cleaned toward [MoneyMitra.com](https://moneymitra.com/): Chirfaar blue chrome, Gurumantra green for up. Dark charcoal stack with site cyan chrome — quieter hairlines, no card chrome. |
| 2026-08-24 | Studio Home stage defaults to **Base**: the full seven-module Home stack. Watchlist, Brokers and Baskets gained search, summary tiles, broker cards and a traders/investors basket grid. |
| 2026-08-24 | Numbers sit in one figure line: Geist Mono tabular value plus a single change pill. Home book, NEPSE, movers, watchlist and brokers follow the reference spacing — sparkline quote rows, turnover wells, and a three-column Today / Overall / Cash strip. |
| 2026-08-24 | Studio Font dropdown: Satoshi, Plus Jakarta Sans, Geist Mono on the device (`data-font`). Numbers stay Geist Mono. |
| 2026-08-24 | Home tabs are Home / Watchlist / Brokers / Baskets. Holdings sit under the user book; Chirfaar and watchlists left the vertical feed. Movers and brokers use paper tables. |
| 2026-08-24 | Home feed switcher is a segmented control on an inset track, so For you / Learn / News (and later Broker Chirfaar) read as a control instead of a faint underline. |
| 2026-08-24 | Objective screen: video sitting plus learned / left checklist. Tapping a module swaps the video and notes. Home keeps the compact objective strip. |
| 2026-08-24 | Home and lists sit on one paper sheet: section titles, hairlines, inset tables, and tinted asides. |
| 2026-08-24 | Header: hamburger left, Namaste centre-left, search and bell, initials squircle on the right. NEPSE/stock charts became a session tape (yesterday’s close, 11–3 clock) plus a circuit spine and a breadth mosaic. |
| 2026-08-23 | Onboarding characters stay in onboarding. Profile shows initials plus a title (Newbie → Veteran). Newbie Home leads with objectives, gyan and news; IPO/holder titles unlock pipeline and add-holding tools. |
| 2026-08-23 | Character-led onboarding: Tulkey speech, four avatars, live Home preview with tappable feeds. Selected persona becomes the header avatar. |
| 2026-08-23 | Light readability pass: Plus Jakarta Sans UI font, darker secondary/tertiary text, stronger borders/accent labels, and larger XS/label/overline type. |
| 2026-08-23 | Reworked onboarding into Build/Preview Home setup; personalized For You modules; added Watchlist Home tab and complete navigation drawer. |
| 2026-08-23 | Reduced Home/Explore text density: compact IPO and dictionary rows, tighter tool tiles and news cards, fixed search truncation. Info chips now open bite-size sheets. |
| 2026-08-23 | Compact animated objective strip; Home For you / Broker Chirfaar feeds; nav changed to Home / Market / Tulkey / Portfolio / Explore; Explore tools/profile; Market News. |
| 2026-08-22 | Objective path: 2 onboarding questions place the entry point. Curriculum is linear (share → kitta → IPO → MeroShare → orders → ratios → tape). Advanced can have none. |
| 2026-08-22 | Adaptive Home v2 from product spec: five stages, stage-ring header, metric sheets, circuit overlay, IPO pipeline, holding correction, density lock. |
| 2026-08-22 | Light mode warmed: paper canvas `#F3EEE4`, cream cards `#FFFAF2`, accent shifted from corporate `#2F5BEA` to `#4C7CF5`. Market green/red unchanged. Dark mode unchanged. |
| 2026-08-22 | v1.0 implemented from Figma Design System v1.0. Light/Dark, Mobile 390 / Web 1440. No Figma writes. |

When you ask to tweak a theme colour, the edit is in `src/styles/tokens.css` **and** the matching row in this file.
