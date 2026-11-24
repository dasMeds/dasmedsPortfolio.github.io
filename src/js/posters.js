import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPosterBento() {
    const section = document.querySelector('#posters');
    const gallery = section?.querySelector('.poster-ring');
    const posters = [...(gallery?.querySelectorAll('.poster-tile') ?? [])];
    if (!section || !gallery || !posters.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    const position = section.querySelector('#poster-position');

    posters.forEach((poster, index) => {
        poster.style.setProperty('--poster-tilt', `${((index % 5) - 2) * 0.6}deg`);
        poster.dataset.parallaxDepth = String((index % 3) + 1);
    });

    const setActivePoster = index => {
        activeIndex = index;
        posters.forEach((poster, posterIndex) => {
            poster.classList.toggle('is-current', posterIndex === activeIndex);
        });
        if (position) {
            position.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(posters.length).padStart(2, '0')}`;
        }
    };

    const updatePosition = () => {
        const center = gallery.scrollLeft + gallery.clientWidth / 2;
        const index = posters.reduce((closestIndex, poster, posterIndex) => {
            const posterCenter = poster.offsetLeft + poster.offsetWidth / 2;
            const closestCenter = posters[closestIndex].offsetLeft + posters[closestIndex].offsetWidth / 2;
            return Math.abs(posterCenter - center) < Math.abs(closestCenter - center) ? posterIndex : closestIndex;
        }, 0);
        setActivePoster(index);
    };

    const showPoster = index => {
        const targetIndex = (index + posters.length) % posters.length;
        const poster = posters[targetIndex];
        setActivePoster(targetIndex);
        poster.focus({ preventScroll: true });
        gallery.scrollTo({
            left: poster.offsetLeft - (gallery.clientWidth - poster.offsetWidth) / 2,
            behavior: reducedMotion ? 'auto' : 'smooth',
        });
    };

    section.querySelectorAll('[data-poster-step]').forEach(button => {
        button.addEventListener('click', () => {
            showPoster(activeIndex + Number(button.dataset.posterStep));
        });
    });

    posters.forEach((poster, index) => {
        poster.addEventListener('focus', () => {
            setActivePoster(index);
        });
    });

    gallery.addEventListener('scroll', () => requestAnimationFrame(updatePosition), { passive: true });
    updatePosition();

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