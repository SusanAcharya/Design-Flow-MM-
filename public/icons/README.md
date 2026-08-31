# Icons

Two families share one grid. See `src/ds/Icon.tsx` for the name → file map.

- **Mitra set — 49 icons, drawn for this app.** Everything the bottom nav and the
  Explore tools use. Design sources live in `/icon-concepts` as `ic-<name>.svg`.
- **Lucide v1.34.0 (ISC) — 19 icons.** The generic chrome nothing custom was drawn
  for: `back`, `menu`, `close`, `chev`, `ext`, `search`, `plus`, `check`, `dots`,
  `more`, `info`, `alert`, `cal`, `chat`, `send`, `mic`, `pin`, `refresh`,
  `building`. The per-file `@license` comment is kept as attribution, and is what
  tells the two families apart on disk. `discover` is a third case: Lucide's
  `telescope` silhouette, redrawn to the rules below and given a money-node at
  the mount, so it stays in the Mitra set the rest of the bottom nav belongs to.

Both families obey the same three rules, so they sit together without reading as
a mixed set:

- **24 grid**, `stroke-linecap`/`stroke-linejoin` `round`.
- `stroke="#000"`, never `currentColor`. Icons render as CSS masks, which read the
  alpha channel; `currentColor` has no reliable value in a standalone SVG. Colour
  still comes from CSS, via `.icon { background: currentColor }`. Filled shapes
  need `stroke="none"` alongside `fill="#000"` or the round cap bleeds the dot.
- `stroke-width` **1.8** — lighter than Lucide's default 2, which sits heavier than
  this app's type. The `/icon-concepts` sources are drawn at 2 and thinned to 1.8
  on the way in, so edit the source and re-install rather than editing here.

The Mitra set carries a "money-node": a small filled dot at one load-bearing vertex
(coin faces, the peak of a bar, the tick on a ticket). Nepali motifs are used where
the meaning already invites them, not sprinkled — a pagoda eave on `home`, `bank`
and `vault`, twin Himalaya peaks on `range` (52-week high/low *is* a range).

Icons are drawn in a single colour — `.explore-glyph` inks them with
`--text-primary` on a neutral well. There is no per-category tinting: 40 tools in
five hues read as noise, and the group headings already do that work.

Names are mapped one-to-one with meanings — no icon stands for two things. If you
add a tool, give it an icon nothing else uses. `certificate`, `dictionary` and
`lesson` exist because Certificates, the Dictionary and 2-Minute Lessons were
borrowing `ticket`, `book` and `clipboard` from tools that already had them.

A mark also has to survive its own label at 24 px, which is the size the Explore
grid actually renders. `handshake`, `depth`, `candles`, `compare`, `gauge`, `pie`,
`index`, `tag`, `coins` and `forex` were all redrawn after a contact sheet showed
them reading as something else — a scribble, a double dagger, an equalizer, a code
bracket, a bare arch, a clock, a flag, a rhombus, a no-entry sign, and a second
copy of `refresh`. Render the set together before shipping a new one: collisions
only show up beside their neighbours.

**To add one:** draw it at 24/2px in `/icon-concepts` as `ic-<name>.svg`, or copy
from `lucide-static/icons`; apply the three rules above; register the name in
`src/ds/Icon.tsx`.

Not part of the `Icon` set — these are chart parts drawn to their own geometry:
`spark-line.svg`, `spark-fill.svg`, `triangle-up.svg`, `triangle-down.svg`.
