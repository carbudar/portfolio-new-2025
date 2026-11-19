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
    const ticker = 'Open to UX / product design ✦ Web design ✦ Creative technology ✦ Based in New York City ✦ Say hi! ✦ ';

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
            el.style.backgroundColor = isClear(bodyBg) ? SITE.cream : bodyBg;
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

    const buttonExpand = document.createElement('span');
    buttonExpand.classList.add('button-expand');

    const buttonContent = document.createElement('span');
    buttonContent.classList.add('buttonContent');
    buttonContent.style.padding = 'clamp(6px, 0.6vw, 12px) clamp(16px, 1.6vw, 28px)';
    buttonContent.style.color = color;

    const buttonTitle = document.createElement(size);
    buttonTitle.innerHTML = buttonText;
    buttonContent.appendChild(buttonTitle);

    button.append(buttonExpand, buttonContent);

    const highlight = () => {
        const rect = buttonContent.getBoundingClientRect();
        buttonExpand.style.width = `${rect.width}px`;
        buttonExpand.style.height = `${rect.height}px`;
        buttonExpand.style.backgroundColor = highlightColor;
        buttonContent.style.color = SITE.teal;
    };
    const reset = () => {
        buttonExpand.style.width = '0';
        buttonContent.style.color = color;
    };
    button.addEventListener('mouseenter', highlight);
    button.addEventListener('focus', highlight);
    button.addEventListener('mouseleave', reset);
    button.addEventListener('blur', reset);

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
    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    createButton('h1', 'Back to Top', 'backToTop', SITE.pink, SITE.pink, { onClick: scrollTop });
    createButton('h3', 'Back To Top', 'content-backToTop', SITE.yellow, SITE.teal, { onClick: scrollTop });
}

/* ---------- Small page features ---------- */

// Click any image to open it full size (add class="noEnlarge" to opt out).
function enlargeMedia(root = document) {
    root.querySelectorAll('.progressPhoto img:not(.noEnlarge), .documentationElement:not(video)').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => window.open(img.src, '_blank'));
    });
}

function customCursor() {
    const cursors = {
        'stroll-container': 'assets/Documentation/Stroll/Flower Pink.png',
        'dotmap-container': 'assets/Documentation/dotmap-cursor.png',
    };
    const id = Object.keys(cursors).find(key => document.getElementById(key));
    if (!id || matchMedia('(pointer: coarse)').matches) return;

    document.body.style.cursor = 'none';
    const cursor = document.createElement('img');
    cursor.src = cursors[id];
    cursor.alt = '';
    Object.assign(cursor.style, {
        position: 'fixed', pointerEvents: 'none', width: 'auto', height: '34px',
        borderRadius: '0px', zIndex: '10000', transform: 'translate(-50%, -50%)',
    });
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

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

/* ---------- project-info.html?project=Name (archive projects) ---------- */

async function archiveProjectPage() {
    const container = document.querySelector('#project-info-container');
    if (!container) return;

    const name = new URLSearchParams(location.search).get('project');
    const data = await loadProjects();
    const project = data.archive?.[name];
    if (!project) {
        container.querySelector('#content').innerHTML = '<h2>Project not found. <a href="archive.html">Back to the archive</a></h2>';
        return;
    }

    document.title = `${project.name} · Carla Budar`;
    container.querySelector('.content-left').innerHTML = `<h2>${project.name}</h2><h3>${project.year}</h3>`;
    container.querySelector('.content-center').textContent = project.info;
    container.querySelector('.content-right').innerHTML = (project.material || []).filter(Boolean).map(m => `<li>${m}</li>`).join('') || '<li>Not specified</li>';

    const thumbnail = container.querySelector('.projectThumbnail');
    thumbnail.classList.add('noEnlarge');
    thumbnail.src = project.documentation.thumbnail;
    thumbnail.alt = project.name;
    if (project.link) {
        thumbnail.style.cursor = 'pointer';
        thumbnail.addEventListener('click', () => window.open(project.link, '_blank'));
    }

    container.querySelector('.progressTitle').textContent = 'Progress';
    container.querySelector('.reflectionTitle').textContent = 'Reflection';

    if (project.link) {
        createButton('h3', 'Visit Site', 'visitSite', SITE.yellow, SITE.teal, { href: project.link, newTab: true });
    }

    const gallery = container.querySelector('.progressPhoto');
    gallery.innerHTML = '';
    Object.entries(project.documentation).forEach(([key, src]) => {
        if (key === 'thumbnail' || !src) return;
        let media;
        if (isVideo(src)) {
            media = document.createElement('video');
            Object.assign(media, { src, controls: true, autoplay: true, loop: true, muted: true, playsInline: true });
        } else {
            media = document.createElement('img');
            media.src = src;
            media.alt = `${project.name} documentation`;
            media.loading = 'lazy';
        }
        media.classList.add('documentationElement');
        gallery.appendChild(media);
    });
    enlargeMedia(container);
}

/* ---------- Start ---------- */

document.addEventListener('DOMContentLoaded', () => {
    const features = [makeHeader, makeFooter, backButton, backToTopButtons, customCursor, dotMapGenerator, archiveProjectPage];
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
