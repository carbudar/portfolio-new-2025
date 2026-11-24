# carlabudar.com

Hand-coded portfolio, hosted on GitHub Pages (no build step).

## Files

| File | What it does |
| --- | --- |
| `index.html` + `home.css` + `home.js` | Homepage: hero, building menu, filterable project list, About, toolkit |
| `toolkit.js` | The "My Toolkit" content (Design / Code / AI): edit the text here |
| `site.js` | Shared by every page: header, footer (scroll reveal + ticker), buttons, Back to Top, `project-info.html` loader, Dot Map "generate" button |
| `style.css` | Shared styles: colours, fonts, header, footer, buttons |
| `case-study.css` + `case-study.js` | Shared layout for the highlighted project pages (see below) |
| `projects.json` | Project data for the homepage list (`highlight`) and the archive page (`archive`) |
| `<project>.html` | One case study per highlighted project |
| `archive.html` / `project-info.html` | Archive grid (grouped by `category`), and the detail page each archive item opens (built from `projects.json`: Description from `info`, Process from `documentation`, Reflection from `reflection` if set) |
| `assets/web/` | Web-sized copies of large photos, one folder per project (originals stay in `assets/Documentation/`) |

## Highlighted project pages

Every highlighted page uses `case-study.css` + `case-study.js`:
a rounded opening video or image (`.st-hero`), Timeline / Role / Tools (`.cs-meta`, add `is-4` for a 4th column),
a sticky chapter bar (`.st-bar`, one link per chapter), numbered chapters (`<section class="st-chapter" id="…">`),
then Back to Top (added automatically) and a "Next project" bar (`.cs-next`).

Building blocks you can use inside a chapter:

- `.st-row`: pull quote on the left, text on the right
- `.cs-grid`: captioned process grid (`<b>` inside the caption is the small label)
- `.st-strip`: images side by side at equal height (set `--ar` on each figure to its width ÷ height)
- `.st-tabs`: one artefact at a time (Research, Strategy, Process phases…)
- `.st-cards`: small cards; `is-feature` for cards with an image or video
- `.st-labelled`: numbered dots on a photo with matching labels (`is-compact` for labels underneath)
- `.st-learn`: numbered key learnings
- `.st-embed`: video, game or sketch embeds; `.st-doc`: a card that opens a PDF

Any photo or video in a case study opens full size when clicked.

## Media

- Page videos live in `assets/video/` as H.264 MP4s (they play in every browser). The original `.mov` files are still in `assets/Documentation/`.
- Large photos get a web-sized copy in `assets/web/<project>/` (about 1200–2400px wide). Keep videos around 1–2 Mbps; very low bitrates look blocky.
- To convert a new video:
  `ffmpeg -i input.mov -an -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p -vf "scale='min(1280,iw)':-2" -movflags +faststart assets/video/name.mp4`
- File names are case-sensitive on GitHub Pages, even though they aren't on a Mac.

## Contact details

The email and social links are set once at the top of `site.js` (`SITE`).

## Adding an archive project

Add an entry under `archive` in `projects.json` with `name`, `year`, `summary` (one line), `type`, `category` (`sketch`, `web`, `ux` or `physical`, which sets the group it appears in), `material` (tools), `link` + `linkLabel` (e.g. "Play sketch") if it has a live version, `documentation` (process images or videos: a path, or `{ "src": path, "caption": text, "group": name }`; with groups, Process splits into labelled sets, and an optional `groups` object can add `{ "text": …, "layout": "phones" }` per group), an optional `reflection`, and `thumb` (a web-sized image in `assets/thumbs/archive/`). The group order is set in `GROUPS` at the bottom of `archive.html`.
