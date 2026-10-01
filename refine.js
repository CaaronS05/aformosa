/* Aformosa — extra motion/UX. Works WITH script.js (hero, headings, step-pinning and nav are already handled there). */
(() => {
    const $ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = $('.site-header')[0];
    const bar = Object.assign(document.createElement('div'), { className: 'rf-progress' }); document.body.prepend(bar);
    let lastHeaderScroll = Math.max(0, scrollY);
    const onScroll = () => {
        const h = document.documentElement;
        const m = h.scrollHeight - innerHeight;
        const current = Math.max(0, Math.min(scrollY, Math.max(0, m)));
        bar.style.transform = `scaleX(${m > 0 ? current / m : 0})`;
        if (!header) return;
        if (current > 24) header.classList.add('is-stuck');
        else if (current <= 4) header.classList.remove('is-stuck');
        const menuOpen = header.querySelector('.nav-toggle')?.getAttribute('aria-expanded') === 'true';
        const hasFocus = header.contains(document.activeElement);
        if (current <= header.offsetHeight || menuOpen || hasFocus) {
            header.classList.remove('is-scroll-hidden');
            lastHeaderScroll = current;
        } else if (Math.abs(current - lastHeaderScroll) >= 12) {
            header.classList.toggle('is-scroll-hidden', current > lastHeaderScroll);
            lastHeaderScroll = current;
        }
    };
    header?.addEventListener('focusin', () => {
        header.classList.remove('is-scroll-hidden');
        lastHeaderScroll = Math.max(0, scrollY);
    });
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    const start = () => {
        const g = window.gsap; if (reduce || !g) return;
        const ease = 'power3.out';
        // Hero: stagger the copy inside the block script.js already fades in
        g.fromTo('.hero-copy>*', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .09, ease, delay: .1, clearProps: 'transform,opacity' });
        g.fromTo('.food-note', { scale: .85, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, stagger: .15, ease: 'back.out(1.4)', delay: .7, clearProps: 'opacity,scale' });
        g.to('.food-blob', { rotate: 9, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        if (!window.ScrollTrigger) return;
        // Scroll reveals (steps are excluded: script.js pins them)
        const sel = '.benefit,.plan-card,.menu-card,.story-card,.video-slot,.little-tags span,.format-switch,.batch-bar,.faq-list details,.cta-layout form';
        const t = $(sel).filter(el => !el.closest('[data-loop-copy]')); g.set(t, { y: 28, opacity: 0 });
        ScrollTrigger.batch(t, { start: 'top 92%', once: true, onEnter: b => g.to(b, { y: 0, opacity: 1, duration: .7, stagger: .08, ease, clearProps: 'transform,opacity' }) });
        setTimeout(() => t.forEach(el => { if (getComputedStyle(el).opacity === '0' && el.getBoundingClientRect().top < innerHeight) g.to(el, { y: 0, opacity: 1, duration: .5, clearProps: 'transform,opacity' }) }), 2500);
        // Calculator: count-up when a result appears
        const out = $('#calculator-output')[0];
        if (out) new MutationObserver(() => { if (out.hidden) return;['#tdee-value', '#bmr-value'].forEach(s => { const el = $(s)[0], end = parseInt(el.textContent.replace(/\D/g, ''), 10); if (!end) return; const o = { v: 0 }; g.to(o, { v: end, duration: 1.1, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v).toLocaleString('id-ID'), onComplete: () => el.textContent = end.toLocaleString('id-ID') }) }) }).observe(out, { attributes: true, attributeFilter: ['hidden'] });
    };
    document.readyState === 'complete' ? start() : addEventListener('load', start);
})();
