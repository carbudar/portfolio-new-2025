/* ==========================================================================
   site.js — shared code for every page on carlabudar.com
   Replaces the old script.js, test2.js, changeBackground.js and loadProjects.js.

   Rule of thumb: every feature checks that its element exists before it
   runs, so a page only gets the features it has markup for and one missing
   element can never stop the rest of the script.
   ========================================================================== */

const SITE = {
    email: 'carlabudar@gmail.com',
    linkedin: 'https://www.linkedin.com/in/carlabudar',
    instagram: 'https://www.instagram.com/carbudar',
    photoArchive: 'https://carbudar.github.io/Photo-Archive/index.html#pageContainer',
    teal: '#126889',
    yellow: '#EDED14',
    pink: '#FFD2FF',
    cream: '#F9F7F2',
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header & footer (built once, used on every page) ---------- */

function makeHeader() {
    const placeholder = document.querySelector('.headerPlaceHolder');
    if (!placeholder) return;

    placeholder.innerHTML = `
        <header class="header">
            <div class="header-left">
                <a href="index.html" class="header-home-link">Carla Budar | Design and Technology</a>
            </div>
            <div class="header-center">
                <a href="index.html" aria-label="Carla Budar, home">
                    <img src="assets/logo header yellow.png" alt="" class="logo-img noEnlarge">
                </a>
            </div>
            <nav class="header-right" aria-label="Main">
                <div class="headerButton">
                    <h3><a href="index.html">Home</a></h3>
                    <h3><a href="index.html#project-highlight">Work</a></h3>
                    <h3><a href="archive.html">Archive</a></h3>
                    <h3><a href="index.html#aboutMe">About</a></h3>
                </div>
            </nav>
        </header>`;
}

function makeFooter() {
    const placeholder = document.querySelector('.footerPlaceholder');
    if (!placeholder) return;

    const year = new Date().getFullYear();
    const ticker = 'UX / product designer ✦ Web designer ✦ Creative technologist ✦ Based in New York City ✦ Say hi! ✦ ';

    const footer = document.createElement('footer');
    footer.id = 'contact';
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="sf-main">
            <p class="sf-kicker">Open to UX / product design, web design and creative technology</p>
            <h2 class="sf-big">Let's make something <em>together.</em></h2>
            <ul class="sf-pills">
                <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
                <li><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn <span aria-hidden="true">↗</span></a></li>
                <li><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram <span aria-hidden="true">↗</span></a></li>
            </ul>
        </div>
        <div class="sf-bottom">
            <p>&copy; ${year} Carla Budar. Designed and developed with 🤎 somewhere in New York City.</p>
            <p class="sf-clock" aria-label="Current time in New York"></p>
        </div>
        <div class="sf-wordmark" aria-hidden="true">carla budar</div>
        <div class="sf-marquee" aria-hidden="true"><div class="sf-track"><span>${ticker}</span><span>${ticker}</span></div></div>`;

    // The footer lives at the end of <body> so it can sit behind the page.
    document.body.appendChild(footer);
    placeholder.remove();

    const clock = footer.querySelector('.sf-clock');
    const timeFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
    const tick = () => { clock.textContent = `NYC · ${timeFormat.format(new Date())}`; };
    tick();
    setInterval(tick, 30000);

    revealFooter(footer);
}

// "Garage door": the page scrolls up and uncovers the footer fixed behind it.
// Falls back to a normal footer if it's taller than the screen (small phones).
function revealFooter(footer) {
    const isClear = c => c === 'transparent' || c === 'rgba(0, 0, 0, 0)';
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const content = [...document.body.children].filter(el =>
        el !== footer && el.matches('div, main') && getComputedStyle(el).position !== 'fixed');

    content.forEach(el => {
        el.classList.add('reveal-content');
        // the page has to be opaque, or the footer would show through it
        if (isClear(getComputedStyle(el).backgroundColor)) {
            // style.css fades every background over 0.5s; skip that here so the footer never flashes through
            el.style.transition = 'none';
            el.style.backgroundColor = isClear(bodyBg) ? SITE.cream : bodyBg;
            el.offsetHeight; // apply the colour before the transition comes back
            el.style.transition = '';
        }
    });

    // body has a fixed height in style.css, so an empty spacer (not padding)
    // makes the scroll room the footer is uncovered in
    const spacer = document.createElement('div');
    spacer.className = 'footer-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    footer.before(spacer);

    const update = () => {
        const fits = footer.offsetHeight < window.innerHeight * 0.9;
        footer.classList.toggle('is-revealed', fits);
        content.forEach(el => el.classList.toggle('reveal-on', fits));
        // the page overlaps the footer's top by its corner radius, so green shows in the corners
        const overlap = parseFloat(getComputedStyle(footer).paddingTop) || 0;
        spacer.style.height = fits ? `${footer.offsetHeight - overlap}px` : '0';
    };
    new ResizeObserver(update).observe(footer);
    window.addEventListener('resize', update);
    update();
}

/* ---------- The expanding-highlight button used across the site ----------
   createButton(tag, text, placeholderClass, highlightColor, color, options)
   options.href  -> renders a real link (keyboard + right-click friendly)
   options.onClick -> click handler for buttons that aren't links          */

function createButton(size, buttonText, className, highlightColor, color, options = {}) {
    const placeholder = options.parent || document.querySelector(`.${className}`);
    if (!placeholder) return null;

    const button = document.createElement(options.href ? 'a' : 'button');
    button.classList.add('button');
    if (options.href) {
        button.href = options.href;
        if (options.newTab) { button.target = '_blank'; button.rel = 'noopener'; }
    } else {
        button.type = 'button';
        // reset the global <button> styles so it looks like the original div version
        Object.assign(button.style, { background: 'none', padding: '0', color: 'inherit', borderRadius: '999px', font: 'inherit' });
    }
    button.style.textDecoration = 'none';
    button.style.position = 'relative';

    // colours go in CSS variables; the hover sweep itself is pure CSS (style.css → .button-expand)
    button.style.setProperty('--btn-color', color);
    button.style.setProperty('--btn-highlight', highlightColor);
    button.style.setProperty('--btn-highlight-text', SITE.teal);

    const buttonExpand = document.createElement('span');
    buttonExpand.classList.add('button-expand');
    buttonExpand.setAttribute('aria-hidden', 'true');

    const buttonContent = document.createElement('span');
    buttonContent.classList.add('buttonContent');
    buttonContent.style.padding = 'clamp(6px, 0.6vw, 12px) clamp(16px, 1.6vw, 28px)';

    const buttonTitle = document.createElement(size);
    buttonTitle.innerHTML = buttonText;
    buttonContent.appendChild(buttonTitle);

    button.append(buttonExpand, buttonContent);

    if (options.onClick) button.addEventListener('click', options.onClick);

    placeholder.appendChild(button);
    return button;
}

function backButton() {
    // Goes back if you came from inside the site, otherwise to the work list.
    const cameFromSite = document.referrer && new URL(document.referrer).origin === location.origin;
    createButton('h3', 'Back', 'backBtn', SITE.yellow, SITE.teal, cameFromSite
        ? { onClick: () => history.back() }
        : { href: 'index.html#project-highlight' });
}

function backToTopButtons() {
    const scrollTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

    // Pages without their own Back to Top get one at the very end of the page content, above the footer.
    if (!document.querySelector('.backToTop')) {
        const holder = document.createElement('div');
        holder.className = 'page-backToTop';
        const content = document.querySelector('main') || document.querySelector('.page-container');
        if (content) {
            // before the "Next project" bar when there is one, otherwise at the end of the content
            const spot = content.querySelector('.cs-next') || content.querySelector(':scope > .footerPlaceholder');
            spot ? spot.before(holder) : content.appendChild(holder);
            createButton('h3', 'Back to Top', 'page-backToTop', SITE.yellow, SITE.teal, { onClick: scrollTop, parent: holder });
        }
    }

    createButton('h1', 'Back to Top', 'backToTop', SITE.pink, SITE.pink, { onClick: scrollTop });
}

/* ---------- Small page features ---------- */

function dotMapGenerator() {
    createButton('h3', 'Generate new Dot Map', 'generateNewDotMap', SITE.yellow, SITE.teal, {
        onClick: () => {
            const iframe = document.getElementById('dotMapIFrame');
            if (iframe) iframe.src = iframe.src;
        },
    });
}

/* ---------- Data ---------- */

let projectsPromise;
function loadProjects() {
    projectsPromise ??= fetch('projects.json').then(r => {
        if (!r.ok) throw new Error('Could not load projects.json');
        return r.json();
    });
    return projectsPromise;
}

function isVideo(path) {
    return /\.(mp4|mov|webm|ogg)$/i.test(path);
}

/* ---------- project-info.html?project=Name (archive projects) ----------
   Built from the "archive" list in projects.json. Sections: Description (info),
   Process (documentation images/videos), Reflection (only if "reflection" is set). */

async function archiveProjectPage() {
    const main = document.querySelector('#archive-project');
    if (!main) return;

    const name = new URLSearchParams(location.search).get('project');
    const data = await loadProjects();
    const project = data.archive?.[name];
    const loading = main.querySelector('.ap-loading');
    if (!project) {
        loading.innerHTML = 'Project not found. <a href="archive.html">Back to the archive</a>';
        return;
    }
    document.title = `${project.name} · Carla Budar`;

    // same order as the archive page: by group, newest first
    const groupOrder = ['sketch', 'web', 'ux', 'physical'];
    const ordered = Object.values(data.archive).sort((a, b) =>
        (groupOrder.indexOf(a.category) - groupOrder.indexOf(b.category)) || (b.year - a.year));
    const at = ordered.findIndex(p => p.name === project.name);
    const prev = ordered[(at - 1 + ordered.length) % ordered.length];
    const next = ordered[(at + 1) % ordered.length];
    const href = p => p.pageLink || `project-info.html?project=${encodeURIComponent(p.name)}`;

    const paragraphs = text => (text || '').split(/<br\s*\/?>\s*(?:<br\s*\/?>)?/i).map(t => t.trim()).filter(Boolean).map(t => `<p>${t}</p>`).join('');
    const tools = (project.material || []).filter(Boolean);
    // each documentation entry is a path, or { "src": path, "caption": text, "group": name }.
    // With groups, Process is split into labelled sets; "groups" in the project can add a line of
    // context per group, and "layout": "phones" for tall phone screens.
    const docs = Object.entries(project.documentation || {})
        .filter(([key, doc]) => key !== 'thumbnail' && doc)
        .map(([, doc]) => typeof doc === 'string' ? { src: doc } : doc)
        .filter(doc => doc.src !== project.documentation.thumbnail || doc.caption); // the cover is already at the top
    const item = ({ src, caption }) => `<li><figure>${isVideo(src)
        ? `<video muted loop playsinline preload="metadata" src="${src}"></video>`
        : `<img src="${src}" alt="${caption || project.name + ', process'}" loading="lazy">`}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure></li>`;
    let media = '';
    if (docs.some(doc => doc.group)) {
        const names = [...new Set(docs.map(doc => doc.group || 'More'))];
        media = names.map(name => {
            const info = project.groups?.[name] || {};
            const grid = info.layout === 'phones' ? 'ap-phones' : 'cs-grid is-contain';
            return `<div class="ap-group">
                <h3>${name}</h3>${info.text ? `<p>${info.text}</p>` : ''}
                <ul class="${grid}">${docs.filter(doc => (doc.group || 'More') === name).map(item).join('')}</ul>
            </div>`;
        }).join('');
    } else if (docs.length) {
        media = `<ul class="cs-grid is-contain">${docs.map(item).join('')}</ul>`;
    }

    let n = 0;
    const section = (id, title, body) => `
        <section class="st-chapter" id="${id}">
            <div class="st-chapter-head"><span>${String(++n).padStart(2, '0')}</span><h2>${title}</h2></div>
            ${body}
        </section>`;

    loading.remove();
    main.insertAdjacentHTML('beforeend', `
        <header class="ap-intro">
            <figure class="ap-media"><img src="${project.thumb || project.documentation.thumbnail}" alt="${project.name}"></figure>
            <div>
                <span class="ap-kicker">Archive · ${project.type || ''}</span>
                <h1>${project.name}</h1>
                ${project.summary ? `<p class="ap-summary">${project.summary}</p>` : ''}
                <dl class="ap-facts">
                    <dt>Year</dt><dd>${project.year}</dd>
                    ${tools.length ? `<dt>Tools</dt><dd><ul class="cs-tags">${tools.map(t => `<li>${t}</li>`).join('')}</ul></dd>` : ''}
                </dl>
                ${project.link ? `<a class="ap-live" href="${project.link}" target="_blank" rel="noopener">${project.linkLabel || 'View live'} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in new tab)</span></a>` : ''}
            </div>
        </header>
        ${project.info ? section('description', 'Description', `<div class="ap-text">${paragraphs(project.info)}</div>`) : ''}
        ${media ? section('process', 'Process', media) : ''}
        ${project.reflection ? section('reflection', 'Reflection', `<div class="ap-text">${paragraphs(project.reflection)}</div>`) : ''}
        <nav class="ap-nav" aria-label="More from the archive">
            <a href="${href(prev)}"><small>← Previous</small><strong>${prev.name}</strong></a>
            <a href="${href(next)}"><small>Next →</small><strong>${next.name}</strong></a>
        </nav>`);

    // Back to Top goes above the previous/next links
    const top = document.querySelector('.page-backToTop');
    if (top) main.querySelector('.ap-nav').before(top);

    // shared case-study behaviour: click media to open full size, play videos only while visible
    const script = document.createElement('script');
    script.src = 'case-study.js';
    document.body.appendChild(script);
}

/* ---------- Start ---------- */

document.addEventListener('DOMContentLoaded', () => {
    const features = [makeHeader, makeFooter, backButton, backToTopButtons, dotMapGenerator, archiveProjectPage];
    // Each feature runs on its own, so one failing can't take the others down.
    features.forEach(feature => {
        try {
            const result = feature();
            if (result instanceof Promise) result.catch(err => console.error(feature.name, err));
        } catch (err) {
            console.error(feature.name, err);
        }
    });
    if (typeof initHome === 'function') initHome();
});
