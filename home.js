/* ==========================================================================
   home.js — homepage only. site.js calls initHome() once the page is ready.
   ========================================================================== */

function initHome() {
    const features = [liveClock, contactButtons, toolkitMarquee, projectIndex, scrollColorSwap, mouseTrail];
    features.forEach(feature => {
        try {
            const result = feature();
            if (result instanceof Promise) result.catch(err => console.error(feature.name, err));
        } catch (err) {
            console.error(feature.name, err);
        }
    });
}

function liveClock() {
    const el = document.querySelector('#dynamic-time');
    if (!el) return;
    const format = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const tick = () => { el.textContent = `New York, NY - ${format.format(new Date())}`; };
    tick();
    setInterval(tick, 1000);
}

function contactButtons() {
    createButton('h2', 'Email', 'email', SITE.yellow, '#000', { href: `mailto:${SITE.email}` });
    createButton('h2', 'LinkedIn', 'linkedin', SITE.yellow, '#000', { href: SITE.linkedin, newTab: true });
    createButton('h2', 'Instagram', 'instagram', SITE.yellow, '#000', { href: SITE.instagram, newTab: true });
    createButton('h3', 'Visit my photo archive here!', 'photo-archive-btn', SITE.yellow, SITE.pink, { href: SITE.photoArchive, newTab: true });
}

// Builds the scrolling icon strips from the data-icons list in index.html.
function toolkitMarquee() {
    document.querySelectorAll('.skill-icon-carousel[data-icons]').forEach(carousel => {
        const icons = carousel.dataset.icons.split(',');
        const set = () => {
            const div = document.createElement('div');
            div.className = 'marquee-set';
            [...icons, ...icons].forEach(file => {
                const img = document.createElement('img');
                img.src = `assets/toolkit-icons/${file}`;
                img.alt = '';
                img.className = 'noEnlarge';
                div.appendChild(img);
            });
            return div;
        };
        const track = document.createElement('div');
        track.className = 'marquee-track';
        track.append(set(), set());
        carousel.appendChild(track);
    });
}

// The project list + preview panel, built from projects.json.
async function projectIndex() {
    const list = document.querySelector('.work-rows');
    if (!list) return;

    const previewImg = document.querySelector('.work-preview-img');
    const previewText = document.querySelector('.work-preview-text');
    const previewRole = document.querySelector('.work-preview-role');
    const filters = document.querySelectorAll('.work-filters button');

    const data = await loadProjects();
    const projects = Object.values(data.highlight);

    function showPreview(project) {
        previewImg.src = project.thumb || project.documentation.thumbnail;
        previewImg.alt = `${project.name} project image`;
        previewText.textContent = project.preview || project.info;
        previewRole.textContent = project.role || '';
        list.querySelectorAll('.work-row').forEach(row => {
            row.classList.toggle('is-active', row.dataset.name === project.name);
        });
    }

    function render(filter) {
        const shown = projects.filter(p => filter === 'all' || (p.categories || []).includes(filter));
        list.innerHTML = '';
        shown.forEach((project, i) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a class="work-row" href="${project.pageLink}" data-name="${project.name}">
                    <span class="work-no">${String(i + 1).padStart(2, '0')}</span>
                    <span class="work-title">
                        <span class="work-name">${project.name}</span>
                        <span class="work-summary">${project.summary || ''}</span>
                        <img class="work-thumb-mobile noEnlarge" src="${project.thumb}" alt="" loading="lazy">
                    </span>
                    <span class="work-type">${project.type || ''}</span>
                    <span class="work-year">${project.year}</span>
                </a>`;
            const row = li.querySelector('a');
            row.addEventListener('mouseenter', () => showPreview(project));
            row.addEventListener('focus', () => showPreview(project));
            list.appendChild(li);
        });
        if (shown[0]) showPreview(shown[0]);
    }

    filters.forEach(button => {
        button.addEventListener('click', () => {
            filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
            render(button.dataset.filter);
        });
    });

    // Preload the other thumbnails so hovering feels instant.
    projects.forEach(p => { if (p.thumb) new Image().src = p.thumb; });

    render('all');
}

// Page turns teal once the About section scrolls in (the original effect,
// now tied to the section instead of a scroll percentage).
let tealMode = false;
function scrollColorSwap() {
    const page = document.querySelector('.landing-page-container');
    const about = document.querySelector('#aboutMe');
    if (!page || !about) return;

    const update = () => {
        const header = document.querySelector('.header');
        const logo = document.querySelector('.logo-img');
        const blur = document.querySelector('.blurEffect');
        const top = about.getBoundingClientRect().top;
        tealMode = top < window.innerHeight * 0.6;

        page.style.backgroundColor = tealMode ? SITE.teal : SITE.cream;
        if (header) {
            header.style.backgroundColor = tealMode ? SITE.cream : SITE.teal;
            header.style.color = tealMode ? SITE.teal : SITE.yellow;
        }
        if (logo) logo.src = tealMode ? 'assets/logo header teal.png' : 'assets/logo header yellow.png';
        if (blur) blur.style.opacity = top < window.innerHeight * 0.2 ? '1' : '0';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

function mouseTrail() {
    if (prefersReducedMotion || matchMedia('(pointer: coarse)').matches) return;
    document.addEventListener('mousemove', e => {
        const trail = document.createElement('div');
        trail.className = 'trail';
        Object.assign(trail.style, {
            position: 'absolute', left: `${e.clientX - 10}px`, top: `${e.clientY + window.scrollY - 10}px`,
            pointerEvents: 'none', zIndex: '100', width: '20px', height: '20px', borderRadius: '50%',
            backgroundColor: tealMode ? 'rgba(237, 237, 20, 0.8)' : 'rgba(255, 210, 255, 0.8)',
        });
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 200);
    });
}
