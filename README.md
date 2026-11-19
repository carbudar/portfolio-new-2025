# carlabudar.com

Hand-coded portfolio, hosted on GitHub Pages (no build step).

## Files

| File | What it does |
| --- | --- |
| `index.html` + `home.css` + `home.js` | Homepage: hero, building menu, quick facts, filterable project list |
| `site.js` | Shared by every page: header, footer (with the scroll-reveal effect and ticker text), buttons, `project-info.html` loader |
| `style.css` | Main styles (colors, fonts, every page) |
| `stroll.css` | Shared case-study layout used by the project pages |
| `projects.json` | Project data for the homepage list (`highlight`) and the archive page (`archive`) |
| `<project>.html` | One hand-built case study per highlighted project |
| `archive.html` / `project-info.html` | Archive grid (grouped by `category`), and the detail page each archive item opens |
| `dot-map-carousel-scroll.js` | GSAP horizontal-scroll process carousels on project pages |

## Adding a highlighted project

1. Build its page (copy an existing project page as a starting point).
2. Add an entry under `highlight` in `projects.json` with `name`, `year`, `pageLink`, `summary` (one line), `type`, `categories` (`ux`, `web`, `ct`), `role`, `preview` and `thumb`.
3. Put a web-sized thumbnail (about 1200px wide, under 300 KB) in `assets/thumbs/`.

## Media

- Page videos live in `assets/video/` as H.264 MP4s (they play in every browser). The original `.mov` files are still in `assets/Documentation/`.
- To convert a new video:
  `ffmpeg -i input.mov -an -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p -vf "scale='min(1280,iw)':-2" -movflags +faststart assets/video/name.mp4`
- File names are case-sensitive on GitHub Pages, even though they aren't on a Mac.

## Contact details

The email and social links are set once at the top of `site.js` (`SITE`).

## Adding an archive project

Add an entry under `archive` in `projects.json` with `name`, `year`, `summary` (one line), `type`, `category` (`sketch`, `web`, `ux` or `physical`, which sets the group it appears in), `material` (tools), `link` + `linkLabel` (e.g. "Play sketch") if it has a live version, and `thumb` (a web-sized image in `assets/thumbs/archive/`). The group order is set in `GROUPS` at the bottom of `archive.html`.
