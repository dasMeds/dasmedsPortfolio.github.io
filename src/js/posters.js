import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPosterBento() {
    const section = document.querySelector('#posters');
    const ring = section?.querySelector('.poster-ring');
    const tiles = [...(ring?.querySelectorAll('.poster-tile') ?? [])];
    const simpleLayout = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 900px), (pointer: coarse)').matches;
    if (!section || !ring || !tiles.length || simpleLayout) return;

    const scaleXTo = tiles.map(tile => gsap.quickTo(tile, 'scaleX', {
        duration: 0.2,
        ease: 'power2.out'
    }));
    const scaleYTo = tiles.map(tile => gsap.quickTo(tile, 'scaleY', {
        duration: 0.2,
        ease: 'power2.out'
    }));

    gsap.to(ring, {
        rotationY: -360,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 15%',
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: self => {
                const rotation = self.progress * 360;
                tiles.forEach((_, index) => {
                    const angle = ((index * 45 - rotation) * Math.PI) / 180;
                    const scale = 0.76 + Math.max(0, Math.cos(angle)) * 0.38;
                    scaleXTo[index](scale);
                    scaleYTo[index](scale);
                });
            }
        }
    });
}
