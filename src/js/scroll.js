import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScroll() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const altimeterValue = document.querySelector('#altimeter-value');
    const altimeterFill = document.querySelector('#altimeter-fill');
    let lenis;

    const updateAltimeter = progress => {
        const percentage = Math.round(Math.max(0, Math.min(1, progress)) * 100);
        if (altimeterValue) altimeterValue.textContent = String(percentage).padStart(3, '0');
        if (altimeterFill) altimeterFill.style.transform = `scaleY(${percentage / 100})`;
    };

    const updateFromNativeScroll = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        updateAltimeter(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };

    if (!reducedMotion) {
        lenis = new Lenis({ autoRaf: false, anchors: true, syncTouch: false });
        lenis.on('scroll', event => {
            ScrollTrigger.update();
            updateAltimeter(event.limit > 0 ? event.scroll / event.limit : 0);
        });

        const tick = time => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        document.addEventListener('portfolio:scroll-lock', event => {
            if (event.detail?.locked) lenis.stop();
            else lenis.start();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) lenis.stop();
            else if (
                !document.body.classList.contains('is-cinema') &&
                !document.querySelector('.modal.active')
            ) {
                lenis.start();
            }
        });
        window.addEventListener('pagehide', () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
        }, { once: true });
    } else {
        window.addEventListener('scroll', updateFromNativeScroll, { passive: true });
        window.addEventListener('resize', updateFromNativeScroll, { passive: true });
        updateFromNativeScroll();
    }

    window.addEventListener('portfolio:section-change', event => {
        const label = document.querySelector('#altimeter-section');
        if (!label) return;
        const labels = {
            home: 'FLIGHT DECK',
            about: 'PROFILE',
            experience: 'SERVICE',
            certifications: 'CERTS',
            'github-projects': 'REPOS',
            posters: 'VISUALS',
            videos: 'MOTION',
            contact: 'CONTACT'
        };
        label.textContent = labels[event.detail?.id] || 'PORTFOLIO';
    });

    const cursor = document.querySelector('.custom-cursor');
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (cursor && finePointer && !reducedMotion) {
        const moveX = gsap.quickTo(cursor, 'x', { duration: 0.16, ease: 'power3.out' });
        const moveY = gsap.quickTo(cursor, 'y', { duration: 0.16, ease: 'power3.out' });
        const interactiveSelector = 'a, button, .poster-card, .cert-row, .timeline-clip, [role="button"]';
        document.body.classList.add('has-custom-cursor');

        window.addEventListener('pointermove', event => {
            if (event.pointerType !== 'mouse') return;
            moveX(event.clientX);
            moveY(event.clientY);
            const target = event.target instanceof Element ? event.target : null;
            cursor.classList.toggle('is-visible', !target?.closest('video, input, textarea, select'));
        }, { passive: true });

        document.addEventListener('pointerover', event => {
            const target = event.target instanceof Element ? event.target : null;
            gsap.to(cursor, {
                scale: target?.closest(interactiveSelector) ? 0.68 : 1,
                duration: 0.18,
                overwrite: true
            });
        });
        document.addEventListener('pointerdown', () => {
            gsap.to(cursor, { scale: 0.48, duration: 0.12, overwrite: true });
        });
        document.addEventListener('pointerup', () => {
            gsap.to(cursor, { scale: 1, duration: 0.18, overwrite: true });
        });
    }

    return lenis;
}
