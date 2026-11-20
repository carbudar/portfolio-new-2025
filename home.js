/* ==========================================================================
   home.js — homepage only. site.js calls initHome() once the page is ready.
   ========================================================================== */

function initHome() {
    const features = [liveClock, contactButtons, projectIndex, toolkitPicker, scrollColorSwap, mouseTrail, smoothScroll];
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
    createButton('h2', 'Email', 'email', SITE.yellow, SITE.teal, { href: `mailto:${SITE.email}` });
    createButton('h2', 'LinkedIn', 'linkedin', SITE.yellow, SITE.teal, { href: SITE.linkedin, newTab: true });
    createButton('h2', 'Instagram', 'instagram', SITE.yellow, SITE.teal, { href: SITE.instagram, newTab: true });
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

    // small count next to each filter, like the toolkit tabs
    filters.forEach(button => {
        const f = button.dataset.filter;
        const n = f === 'all' ? projects.length : projects.filter(p => (p.categories || []).includes(f)).length;
        button.insertAdjacentHTML('beforeend', ` <small>${n}</small>`);
    });

    // The preview waits a moment before switching, so sweeping the mouse down the list
    // doesn't flash through every project, then cross-fades the image and text.
    const media = document.querySelector('.work-preview-media');
    const copy = document.querySelector('.work-preview-copy');
    const [imgA, imgB] = media.querySelectorAll('.work-preview-img');
    let current = null;
    let hoverTimer;
    let swapToken = 0;

    function showPreview(project) {
        if (current === project) return;
        current = project;
        const token = ++swapToken;
        list.querySelectorAll('.work-row').forEach(row => {
            row.classList.toggle('is-active', row.dataset.name === project.name);
        });

        const front = imgA.classList.contains('is-front') ? imgA : imgB;
        const back = front === imgA ? imgB : imgA;
        const src = project.thumb || project.documentation.thumbnail;
        const swap = () => {
            if (token !== swapToken) return; // a newer hover already took over
            back.alt = `${project.name} project image`;
            back.removeAttribute('aria-hidden');
            front.setAttribute('aria-hidden', 'true');
            back.classList.add('is-front');
            front.classList.remove('is-front');
        };
        if (!front.getAttribute('src')) { // first load: no fade needed
            front.src = src; front.alt = `${project.name} project image`;
        } else {
            back.onload = swap;
            back.src = src;
            if (back.complete && back.naturalWidth) swap();
        }

        copy.classList.add('is-fading');
        setTimeout(() => {
            if (token !== swapToken) return;
            previewText.textContent = project.preview || project.info;
            previewRole.textContent = project.role || '';
            copy.classList.remove('is-fading');
        }, prefersReducedMotion ? 0 : 200);
    }

    function previewSoon(project) {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => showPreview(project), 140);
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
            row.addEventListener('mouseenter', () => previewSoon(project));
            row.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
            row.addEventListener('focus', () => showPreview(project));
            list.appendChild(li);
        });
        current = null;
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
        const top = about.getBoundingClientRect().top;
        tealMode = top < window.innerHeight * 0.6;

        page.style.backgroundColor = tealMode ? SITE.teal : SITE.cream;
        if (header) {
            header.style.backgroundColor = tealMode ? SITE.cream : SITE.teal;
            header.style.color = tealMode ? SITE.teal : SITE.yellow;
        }
        if (logo) logo.src = tealMode ? 'assets/logo header teal.png' : 'assets/logo header yellow.png';
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

// "My Toolkit" in the About section: Design / Code / AI tabs, a pill per tool,
// and a card that explains the selected tool. Text lives in toolkit.js.
function toolkitPicker() {
    const tabs = document.querySelector('.home-toolkit .tk-tabs');
    const pills = document.querySelector('.home-toolkit .tk-pills');
    const card = document.querySelector('.home-toolkit .tk-card');
    if (!tabs || !pills || !card || typeof TOOLKIT === 'undefined') return;

    const toolsOf = c => c.groups.flatMap(g => g.tools);
    let category = TOOLKIT[0];
    let selected = 0;

    tabs.innerHTML = TOOLKIT.map((c, i) => `
        <button type="button" class="tk-tab" role="tab" id="tk-tab-${c.id}" aria-controls="tk-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${c.id}">
            ${c.title} <small>${toolsOf(c).length}</small>
        </button>`).join('');

    let shownTool = null;
    let hoverTimer;
    function showCard(tool) {
        if (tool === shownTool) return;
        shownTool = tool;
        const used = toolkitUsedIn(tool);
        card.innerHTML = `
            <div class="tk-card-inner">
                <span class="tk-card-kicker">${category.title}</span>
                <h3>${tool.name}</h3>
                <p class="tk-card-use">${tool.use}</p>
                ${used ? `<div class="tk-card-used"><span>Used in</span>${used}</div>` : ''}
            </div>`;
    }

    function select(index) {
        clearTimeout(hoverTimer);
        selected = index;
        pills.querySelectorAll('.tk-pill').forEach((p, i) => p.setAttribute('aria-pressed', String(i === index)));
        showCard(toolsOf(category)[index]);
    }

    function showCategory(c) {
        category = c;
        pills.setAttribute('aria-labelledby', `tk-tab-${c.id}`);
        pills.innerHTML = toolsOf(c).map((t, i) =>
            `<li><button type="button" class="tk-pill" aria-pressed="false" data-i="${i}">${t.short && t.name.length > 22 ? t.short : t.name}</button></li>`).join('');
        select(0);
    }

    pills.addEventListener('click', e => {
        const pill = e.target.closest('.tk-pill');
        if (pill) select(+pill.dataset.i);
    });
    // with a mouse, hovering previews a tool; leaving the pills goes back to the selected one
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    pills.addEventListener('mouseover', e => {
        const pill = e.target.closest('.tk-pill');
        if (!pill || !finePointer.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => showCard(toolsOf(category)[+pill.dataset.i]), 140);
    });
    pills.addEventListener('mouseleave', () => {
        if (!finePointer.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => showCard(toolsOf(category)[selected]), 250);
    });

    function activateTab(tab) {
        tabs.querySelectorAll('.tk-tab').forEach(t => {
            const on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
        });
        showCategory(TOOLKIT.find(c => c.id === tab.dataset.id));
    }
    tabs.addEventListener('click', e => {
        const tab = e.target.closest('.tk-tab');
        if (tab) activateTab(tab);
    });
    // arrow keys move between tabs, like a native tab bar
    tabs.addEventListener('keydown', e => {
        if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        const all = [...tabs.querySelectorAll('.tk-tab')];
        const next = all[(all.indexOf(document.activeElement) + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
        next.focus();
        activateTab(next);
    });

    showCategory(TOOLKIT[0]);
}

// Smooth, slightly delayed scrolling (Lenis) plus soft snapping: when you stop scrolling
// close to the top of a section, the page eases the rest of the way. Skipped for people
// who ask their device to reduce motion. Touch scrolling stays native.
function smoothScroll() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;

    const lenis = new Lenis({ lerp: 0.10, smoothWheel: true });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    const headerHeight = () => document.querySelector('.header')?.offsetHeight || 0;

    // in-page links (#aboutMe, index.html#project-highlight, …) glide instead of jumping
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href*="#"]');
        if (!a) return;
        const url = new URL(a.href, location.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        const target = document.querySelector(url.hash);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -headerHeight(), duration: 1.2 });
        history.replaceState(null, '', url.hash);
    });

    // soft snap, only with a mouse/trackpad: on phones it would fight the finger
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const stops = ['.home-hero', '#project-highlight', '#aboutMe', '.home-toolkit']
        .map(s => document.querySelector(s)).filter(Boolean);
    const lastStop = stops[stops.length - 1];
    let timer;
    let snapping = false;

    lenis.on('scroll', () => {
        if (snapping) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
            // past the last section (into the footer reveal): leave it alone
            if (lastStop.getBoundingClientRect().bottom < window.innerHeight - 40) return;
            const offset = headerHeight();
            let best = null;
            stops.forEach(el => {
                const distance = el === stops[0] ? -window.scrollY : el.getBoundingClientRect().top - offset;
                if (!best || Math.abs(distance) < Math.abs(best.distance)) best = { el, distance };
            });
            if (!best || Math.abs(best.distance) < 4 || Math.abs(best.distance) > window.innerHeight * 0.22) return;
            snapping = true;
            lenis.scrollTo(best.el === stops[0] ? 0 : best.el, {
                offset: best.el === stops[0] ? 0 : -offset,
                duration: 0.9,
                easing: t => 1 - Math.pow(1 - t, 3),
                onComplete: () => { snapping = false; },
            });
            setTimeout(() => { snapping = false; }, 1200); // in case the snap was interrupted
        }, 100);
    });
}
