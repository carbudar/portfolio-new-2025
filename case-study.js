/* ==========================================================================
   case-study.js: behaviour shared by the highlighted project pages
   (fade-in on scroll, videos play only while visible, click media to open
   full size, chapter bar highlight + reading progress).
   Chapters are found automatically: every <section class="st-chapter" id="…">.
   ========================================================================== */
(function caseStudy() {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveal = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); reveal.unobserve(e.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.st-reveal').forEach(el => reduce ? el.classList.add('is-in') : reveal.observe(el));

    // click (or Enter) on any photo or video opens it full size in a new tab
    document.querySelectorAll('main img, main video').forEach(m => {
        if (m.closest('a') || m.classList.contains('no-zoom')) return; // links keep their own target; tiny icons don't need it
        m.classList.add('st-zoom');
        m.tabIndex = 0;
        m.setAttribute('role', 'link');
        m.setAttribute('aria-label', `Open ${m.alt || 'video'} full size in a new tab`);
        const open = () => window.open(m.currentSrc || m.src, '_blank', 'noopener');
        m.addEventListener('click', open);
        m.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
    });

    // videos only play while visible
    const vids = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { if (!reduce) e.target.play().catch(() => {}); } else e.target.pause();
    }), { threshold: 0.35 });
    document.querySelectorAll('.st-chapter video').forEach(v => vids.observe(v));

    // chapter bar: highlight the current chapter, and fill the progress line as you read
    const links = [...document.querySelectorAll('.st-chapters a')];
    const byId = Object.fromEntries(links.map(a => [a.hash.slice(1), a]));
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.remove('is-active'));
        byId[e.target.id].classList.add('is-active');
        byId[e.target.id].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }), { rootMargin: '-30% 0px -65% 0px' });
    document.querySelectorAll('.st-chapter').forEach(s => spy.observe(s));

    const bar = document.querySelector('.st-progress');
    if (bar) {
    const chapters = document.querySelectorAll('.st-chapter');
    const first = chapters[0];
    const last = chapters[chapters.length - 1];
    const progress = () => {
        const start = first.getBoundingClientRect().top + scrollY - innerHeight * 0.3;
        const end = last.getBoundingClientRect().bottom + scrollY - innerHeight;
        bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (scrollY - start) / (end - start)))})`;
    };
    addEventListener('scroll', progress, { passive: true });
    progress();
    }

    // live sketches (.st-sketch data-w/-h = canvas size, data-top = height of the host's title bar to hide)
    document.querySelectorAll('.st-sketch').forEach(box => {
        const w = +box.dataset.w, h = +box.dataset.h, top = +(box.dataset.top || 0);
        const frame = box.querySelector('iframe');
        box.style.setProperty('--w', w + 'px');
        box.style.setProperty('--ratio', w / h);
        frame.width = w;
        frame.height = h + top;
        const fit = () => { frame.style.transform = `scale(${box.clientWidth / w}) translateY(${-top}px)`; };
        new ResizeObserver(fit).observe(box);
        fit();
    });

    // click-to-load embeds (.st-play data-src): nothing loads, and no API calls happen, until Start is pressed;
    // End game removes the iframe again
    document.querySelectorAll('.st-play').forEach(box => {
        const start = box.querySelector('.st-play-start');
        const end = box.querySelector('.st-play-end');
        start.addEventListener('click', () => {
            const frame = document.createElement('iframe');
            frame.src = box.dataset.src;
            frame.title = box.dataset.title || '';
            frame.referrerPolicy = 'no-referrer';
            box.appendChild(frame);
            box.classList.add('is-playing');
            end.hidden = false;
            frame.focus();
        });
        end.addEventListener('click', () => {
            box.querySelector('iframe')?.remove();
            box.classList.remove('is-playing');
            end.hidden = true;
            start.focus();
        });
    });

    // tabs: <div class="st-tabs"><div class="st-tablist" role="tablist"><button class="st-tab" role="tab" aria-controls="id">…
    //       …<div class="st-tabpanel" role="tabpanel" id="id">… (arrow keys move between tabs)
    document.querySelectorAll('.st-tabs').forEach(box => {
        const tabs = [...box.querySelectorAll('.st-tab')];
        const select = tab => tabs.forEach(t => {
            const on = t === tab;
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
        tabs.forEach((t, i) => {
            t.addEventListener('click', () => select(t));
            t.addEventListener('keydown', e => {
                const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
                if (!step) return;
                e.preventDefault();
                const next = tabs[(i + step + tabs.length) % tabs.length];
                next.focus();
                select(next);
            });
        });
        select(tabs[0]);
    });

    // labelled photos: draw a leader line from each label to its dot, and link hover/focus/tap between them
    document.querySelectorAll('.st-labelled').forEach(box => {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.classList.add('st-lines');
        svg.setAttribute('aria-hidden', 'true');
        box.appendChild(svg);
        const dots = [...box.querySelectorAll('.st-dot')];
        const labels = [...box.querySelectorAll('.st-labels button')];
        const flipped = box.classList.contains('is-flipped');

        const draw = () => {
            svg.innerHTML = '';
            if (getComputedStyle(svg).display === 'none') return;
            const b = box.getBoundingClientRect();
            labels.forEach(label => {
                const dot = dots.find(d => d.dataset.part === label.dataset.part);
                if (!dot) return;
                const l = label.getBoundingClientRect(), d = dot.getBoundingClientRect();
                const x1 = (flipped ? l.right : l.left) - b.left + (flipped ? 6 : -6);
                const y1 = l.top + l.height / 2 - b.top;
                const x2 = d.left + d.width / 2 - b.left, y2 = d.top + d.height / 2 - b.top;
                const line = document.createElementNS(svgNS, 'line');
                Object.entries({ x1, y1, x2, y2 }).forEach(([k, v]) => line.setAttribute(k, v));
                line.dataset.part = label.dataset.part;
                const end = document.createElementNS(svgNS, 'circle');
                Object.entries({ cx: x1, cy: y1, r: 3 }).forEach(([k, v]) => end.setAttribute(k, v));
                end.dataset.part = label.dataset.part;
                svg.append(line, end);
            });
        };

        let pinned = null; // a tapped part stays highlighted until something else is chosen
        const show = part => {
            box.classList.toggle('has-active', !!part);
            [...dots, ...labels, ...svg.children].forEach(el => el.classList.toggle('is-active', !!part && el.dataset.part === part));
        };
        [...dots, ...labels].forEach(el => {
            el.addEventListener('mouseenter', () => show(el.dataset.part));
            el.addEventListener('mouseleave', () => show(pinned));
            el.addEventListener('focus', () => show(el.dataset.part));
            el.addEventListener('blur', () => show(pinned));
            el.addEventListener('click', () => { pinned = pinned === el.dataset.part ? null : el.dataset.part; show(pinned); });
        });

        new ResizeObserver(draw).observe(box);
        box.querySelector('img').addEventListener('load', draw);
        draw();
    });

})();
