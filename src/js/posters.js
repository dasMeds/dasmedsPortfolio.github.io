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

    if (finePointer && !reducedMotion) {
        const loupe = document.createElement('div');
        loupe.className = 'poster-loupe';
        loupe.setAttribute('aria-hidden', 'true');
        document.body.append(loupe);

        posters.forEach(poster => {
            const image = poster.querySelector('img');
            if (!image) return;
            poster.addEventListener('pointerenter', () => {
                loupe.style.backgroundImage = `url("${image.currentSrc || image.src}")`;
                loupe.classList.add('is-visible');
            });
            poster.addEventListener('pointermove', event => {
                const bounds = image.getBoundingClientRect();
                if (!bounds.width || !bounds.height) return;
                const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
                const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
                loupe.style.left = `${event.clientX + 18}px`;
                loupe.style.top = `${event.clientY + 18}px`;
                loupe.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
            });
            poster.addEventListener('pointerleave', () => loupe.classList.remove('is-visible'));
        });
    }
}
