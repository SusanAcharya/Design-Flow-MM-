# Icons

Every icon in the product comes from **[Lucide](https://lucide.dev) v1.34.0** (ISC licence).
One family, one grid, one weight — see `src/ds/Icon.tsx` for the name → file map.

Two deliberate changes from stock Lucide:

- `stroke="currentColor"` → `stroke="#000"`. Icons render as CSS masks, which read
  the alpha channel; `currentColor` has no reliable value in a standalone SVG.
  Colour still comes from CSS, via `.icon { background: currentColor }`.
- `stroke-width` 2 → **1.8**. Lucide's default (2 on a 24 grid) sits heavier than
  this app's type. 1.8 matches the weight the screens were drawn against.

Icons are drawn in a single colour — `.explore-glyph` inks them with
`--text-primary` on a neutral well. There is no per-category tinting: 40 tools in
five hues read as noise, and the group headings already do that work.

Names are mapped one-to-one with meanings — no icon stands for two things. If you
add a tool, give it an icon nothing else uses.

To add one: copy the SVG from `lucide-static/icons`, apply both changes above,
and register the name in `src/ds/Icon.tsx`.

Not from Lucide, and not part of the `Icon` set — these are chart parts drawn to
their own geometry: `spark-line.svg`, `spark-fill.svg`, `triangle-up.svg`,
`triangle-down.svg`.

Lucide is ISC licensed; the per-file `@license` comment is kept as attribution.
