import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPosterBento() {
    const section = document.querySelector('#posters');
    const gallery = section?.querySelector('.poster-ring');
    const posters = [...(gallery?.querySelectorAll('.poster-tile') ?? [])];
    if (!section || !gallery || !posters.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    let activeIndex = 0;

    posters.forEach((poster, index) => {
        poster.style.setProperty('--poster-tilt', `${((index % 5) - 2) * 0.6}deg`);
        poster.dataset.parallaxDepth = String((index % 3) + 1);
    });

    const showPoster = index => {
        activeIndex = (index + posters.length) % posters.length;
        const poster = posters[activeIndex];
        posters.forEach((item, itemIndex) => {
            item.classList.toggle('is-current', itemIndex === activeIndex);
        });
        poster.focus({ preventScroll: true });
        poster.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    };

    section.querySelectorAll('[data-poster-step]').forEach(button => {
        button.addEventListener('click', () => {
            showPoster(activeIndex + Number(button.dataset.posterStep));
        });
    });

    posters.forEach((poster, index) => {
        poster.addEventListener('focus', () => {
            activeIndex = index;
            posters.forEach((item, itemIndex) => {
                item.classList.toggle('is-current', itemIndex === index);
            });
        });
    });

    if (!reducedMotion) {
        gsap.utils.toArray('.poster-tile').forEach((poster, index) => {
            gsap.to(poster, {
                '--poster-parallax': `${(index % 3 - 1) * -24}px`,
                ease: 'none',
                scrollTrigger: {
                    trigger: poster,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
        gsap.utils.toArray('.poster-note-arrow path').forEach(path => {
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(path, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: path.closest('.poster-tile'),
                    start: 'top 80%',
                    end: 'center center',
                    scrub: true
                }
            });
        });
    }
}