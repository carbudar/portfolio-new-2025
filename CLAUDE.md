# CLAUDE.md — carlabudar.com

Carla Budar's hand-coded portfolio. Vanilla HTML/CSS/JS, no framework and no build step, hosted on GitHub Pages from `main` (custom domain in `CNAME`). See `README.md` for the file map.

## Who it's for

Carla is a Parsons Design & Technology grad (2026) applying for **UX / product design, web design and creative technologist** roles. The site has to work for a recruiter skimming for under a minute: role, projects and contact must be clear right away. But it must keep her personality: the isometric building, the live NYC clock, the mouse trail, the emoji in her copy, the teal color swap at About.

## Hard rules

- **Don't change the colors or fonts** unless Carla asks. Palette: teal `#126889`, yellow `#EDED14`, pink `#FFD2FF`, cream `#F9F7F2`, grey `#AAA7A2`, dark green `#323F2F`. Fonts: Quasimoda (Adobe Typekit kit `tzn2kmr`) across the site, DM Sans for project-page body text via `stroll.css`. Carla likes Jost (Google Fonts) and may switch to it later. Ask before doing it.
- **Keep each project page's layout.** Fix and improve without redesigning them unless asked.
- **Every JS feature checks its element exists before running** (see `site.js`). One missing element must never stop the rest of the script.
- **File names are case-sensitive on GitHub Pages**, even though they aren't on her Mac. Check paths match exactly.
- **No resume link or button.** Carla decided not to put her resume on the site.
- Contact email is `carlabudar@gmail.com`, set once in `SITE` at the top of `site.js`.
- Work on a branch and open a PR. Don't push to `main` directly.

## Design decisions so far (Nov 2026 redesign)

Prototypes for these live on a Claude design canvas; the version chosen was "C".

- **Homepage hero:** clock, "I'm [name gif], a Creative Technologist & UX Designer based in New York City", a one-line tagline, Email / LinkedIn / Instagram buttons. The building stays as the site menu, with each floor labeled and clickable: Floor 3 Highlights, Floor 2 Archive, Floor 1 About Me.
- **Quick-facts strip:** education, roles open to, location, current role (Web Design Intern at Thresh).
- **Projects:** numbered list (No. / Project / Type / Year) with filter buttons (All / UX / Product / Web / Creative tech) and a preview panel showing image, description and role on hover. On phones each row shows its thumbnail and there's no preview panel. Built from `projects.json` `highlight` entries, which use `summary`, `type`, `categories` (`ux`, `web`, `ct`), `role`, `preview` and `thumb`.
- **About:** photo and caption on the left. On the right: yellow "About Me" heading, pink intro line, bio, toolkit as two text lines, photo archive link. Stacks on phones.
- **Project page template idea (not built yet):** a summary row at the top of each case study (role / timeline / tools / outcome), with the outcome highlighted. Carla chose to keep current layouts for now.

## Media

- Page videos are H.264 MP4s in `assets/video/`. The original HEVC `.mov` files don't play in Chrome on Windows or in Firefox. Convert new videos with the `ffmpeg` command in `README.md`.
- Homepage thumbnails are in `assets/thumbs/`: about 1200px wide, under 300 KB.
- Still to do: some archive items in `projects.json` point at large `.mov` files (Sunrise, Sircle demo and others) that should get the same MP4 treatment. The Sircle thumbnail is hot-linked from a New School site that may go away.

## Working with Carla

She's newer to git and the terminal. Explain git steps plainly and say what each command does. Check before deleting anything or doing anything that touches `main`.
