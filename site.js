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
    placeholder.innerHTML = `
        <footer class="footer" id="contact">
            <div class="contact-title"><h1>Connect With Me!</h1></div>
            <div class="contact-info">
                <h2><a href="mailto:${SITE.email}">Email: ${SITE.email}</a></h2>
                <h2><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn: Carla Budar</a></h2>
                <h2><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram: @carbudar</a></h2>
            </div>
            <div class="fineprint">
                <p>&copy; ${year} Carla Budar. All rights reserved. Designed and developed with 🤎 somewhere in New York City.</p>
            </div>
        </footer>`;
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
        Object.assign(button.style, { background: 'none', padding: '0', color: 'inherit', borderRadius: '5px', font: 'inherit' });
    }
    button.style.textDecoration = 'none';
    button.style.position = 'relative';

    const buttonExpand = document.createElement('span');
    buttonExpand.classList.add('button-expand');

    const buttonContent = document.createElement('span');
    buttonContent.classList.add('buttonContent');
    buttonContent.style.padding = '1vw';
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

/* ---------- Archive page: two looping columns of thumbnails ---------- */

async function archivePage() {
    const left = document.querySelector('#archive-carousel-left');
    const right = document.querySelector('#archive-carousel-right');
    const info = document.querySelector('#archive-info');
    if (!left || !right || !info || typeof gsap === 'undefined') return;

    const data = await loadProjects();
    const projects = Object.values(data.archive || {});
    const idleText = 'Hover over the images!';
    info.innerHTML = idleText;

    // direction: -1 scrolls up (left column), +1 scrolls down (right column)
    function carousel(container, direction) {
        let animation;
        let isDragging = false;
        let hasDragged = false;
        let startY = 0;
        let resumeTimer;

        [...projects, ...projects].forEach(project => {
            const thumb = document.createElement('a');
            thumb.className = 'eachProjectThumbnail';
            thumb.href = `project-info.html?project=${encodeURIComponent(project.name)}`;
            thumb.setAttribute('aria-label', `${project.name} (${project.year})`);
            thumb.draggable = false;
            Object.assign(thumb.style, {
                backgroundImage: `url('${project.documentation.thumbnail}')`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                position: 'absolute', userSelect: 'none', display: 'block',
            });
            if (direction > 0) Object.assign(thumb.style, { width: '100%', height: '50vh', flexShrink: '0' });

            thumb.addEventListener('click', e => { if (hasDragged) e.preventDefault(); });

            const show = () => {
                if (isDragging) return;
                gsap.to(thumb, { scale: 1.1, duration: 0.25, ease: 'power2.out' });
                animation?.pause();
                info.innerHTML = `<h1>${project.name}</h1><h2>${project.year}</h2><p>${project.info}</p><span>Click on the image to learn more</span>`;
            };
            const hide = () => {
                if (isDragging) return;
                gsap.to(thumb, { scale: 1, duration: 0.25, ease: 'power2.out' });
                animation?.resume();
                info.innerHTML = idleText;
            };
            thumb.addEventListener('mouseenter', show);
            thumb.addEventListener('focus', show);
            thumb.addEventListener('mouseleave', hide);
            thumb.addEventListener('blur', hide);

            container.appendChild(thumb);
        });

        setTimeout(() => {
            const thumbs = Array.from(container.children);
            const heights = thumbs.map(t => t.offsetHeight);
            const cycle = heights.slice(0, projects.length).reduce((sum, h) => sum + h, 0);
            const start = direction > 0 ? -cycle + container.offsetHeight : 0;

            gsap.set(thumbs, { y: i => start + heights.slice(0, i).reduce((sum, h) => sum + h, 0) });

            if (!prefersReducedMotion) {
                animation = gsap.to(thumbs, {
                    duration: cycle / 50,
                    ease: 'none',
                    y: `${direction > 0 ? '+' : '-'}=${cycle}`,
                    modifiers: { y: gsap.utils.unitize(y => parseFloat(y) % cycle) },
                    repeat: -1,
                });
            }

            container.style.cursor = 'grab';
            container.addEventListener('mousedown', e => {
                isDragging = true;
                hasDragged = false;
                startY = e.clientY;
                container.style.cursor = 'grabbing';
                animation?.pause();
                clearTimeout(resumeTimer);
            });
            document.addEventListener('mousemove', e => {
                if (!isDragging) return;
                e.preventDefault();
                const delta = e.clientY - startY;
                if (Math.abs(delta) > 5) hasDragged = true;
                thumbs.forEach(t => gsap.set(t, { y: gsap.getProperty(t, 'y') + delta }));
                startY = e.clientY;
            });
            document.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                container.style.cursor = 'grab';
                resumeTimer = setTimeout(() => animation?.resume(), 1500);
                setTimeout(() => { hasDragged = false; }, 100);
            });
        }, 100);
    }

    carousel(left, -1);
    carousel(right, 1);
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
    const features = [makeHeader, makeFooter, backButton, backToTopButtons, customCursor, dotMapGenerator, archivePage, archiveProjectPage];
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
