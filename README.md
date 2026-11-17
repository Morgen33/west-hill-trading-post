# West Hill Trading Post

West Hill Trading Post is Russ Snyder: twenty years a NYC instructional seal welder,
now teaching the trade in the high school classroom. There is no storefront and no
teaching offered through this site; it works online only.

His bio is the source of truth for anything the site says about him. It lives in
[about.html](about.html) and, condensed, in the first editorial block on the home
page. It is written without dashes.

Static site modelled on the layout and typographic system of werkstatt-muenchen.com:
black canvas, condensed uppercase display type, centred wordmark, full-bleed hero
film, seamless tile grids, and split editorial blocks.

## Run it

```bash
python3 -m http.server 4310
```

Then open http://localhost:4310. Any static host works — there is no build step.

## Files

| File | What's in it |
| --- | --- |
| `index.html` | Home: hero film, collection, mission, pillars, Russ, The Mark |
| `open-bench.html` | The artisan invitation, off the home page by request |
| `video/hero.mp4` | The title film — re-encoded for web, silent (11 MB → 3.4 MB, faststart) |
| `collection.html` | Category rows with 4-up product grids |
| `about.html` | Story, makers, materials, workshop |
| `contact.html` | Visit, shipping, returns, repairs, stockists |
| `styles.css` | Whole design system — tokens at the top of the file |
| `script.js` | Hero video playback, mega menu, mobile drawer |

## The hero film

`video/hero.mp4` autoplays, loops, and plays inline, with no controls over it. It
ends holding on the burnt-in West Hill Trading Post logotype, so nothing heavy is
overlaid on the centre of the frame — the page text sits in the lower band, which
the footage keeps clear. Under `prefers-reduced-motion` the video holds its poster
frame instead of looping.

The file has **no audio track**. Every browser blocks autoplay with sound, so a
silent file is the only way the film can start on its own; the audio would never
have been reachable without a control to turn it on. Re-encode from the original
if that ever needs to change.

Replacing the film: drop a new file at `video/hero.mp4` and regenerate the poster
with `ffmpeg -ss <seconds> -i video/hero.mp4 -frames:v 1 images/hero-poster.jpg`.

## Adding photos

Every image slot paints a tonal placeholder underneath the real photo, so the site
looks finished with an empty `images/` folder. Drop a file in using the name already
referenced in the HTML and it takes over automatically — no CSS changes.

`images/README.txt` lists every filename and its intended crop. Start with the twelve
square category tiles — with the hero handled by the film, those carry the rest of
the page.

## What actually exists

Two products, one maker: Russ's **bracelets** and **bandanas**. Nothing else is real
yet, so nothing else is listed. The site never implies a catalogue it does not have.

The plan is a small curated bench of independent artisans, closer to a mom-and-pop
shop than a marketplace.

The **home page** states the goal only, in the `.mission` section — "A trading post,
not a marketplace" — and links onward. The recruiting pitch itself lives on its own
page, [open-bench.html](open-bench.html): the invitation, the three conditions of
joining, what happens next, and a direct mailto. Keep it off the home page; that was
a deliberate call, not an oversight.

Each live category with no photographed pieces yet shows a `.soon` plate saying so
plainly, with a way to ask what is available, rather than a fake product grid.

When real pieces are ready, replace a `.soon` block with a `.grid .grid--4` of
`.product` cards. The markup for those cards is still in the stylesheet.

## The Mark

The closing section of the home page, sitting directly above the footer. It runs in
a deliberately different register from the rest of the site — Playfair Display for
the headline and airy letterspaced labels — so it reads as a certificate for the
piece rather than another sales block. The spec rows are a `<dl>`; edit the
`.mark__row` entries in `index.html` to change them.

## Changing content

- **Hero line** — `<h1 class="hero__kicker">` in `index.html`.
- **Categories** — the 12 `<a class="tile">` in `index.html` plus the mega-menu
  columns, which are repeated in the header of all four pages.
- **Colors and type** — the `:root` block at the top of `styles.css`.
- **Header height** — `--header-h`; the mega menu positions off it.

## Notes

- Type is Oswald (display) and Archivo (body) from Google Fonts — close free stand-ins
  for the reference site's licensed Grotesque MT Std and Univers Next Pro.
- The header, mega menu and footer are duplicated across the four pages. If this grows
  past a handful of pages, move to a static site generator or includes rather than
  hand-syncing them.
- All copy is original placeholder text written for this build.
