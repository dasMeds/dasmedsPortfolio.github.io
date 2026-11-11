import { gsap } from 'gsap';

export function initPosterBento() {
    const tiles = document.querySelectorAll('.poster-tile');
    if (!tiles.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    tiles.forEach(tile => {
        const rotateX = gsap.quickTo(tile, 'rotationX', { duration: 0.3, ease: 'power2.out' });
        const rotateY = gsap.quickTo(tile, 'rotationY', { duration: 0.3, ease: 'power2.out' });

        tile.addEventListener('pointermove', event => {
            if (event.pointerType !== 'mouse') return;
            const bounds = tile.getBoundingClientRect();
            const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
            const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
            rotateX(-normalizedY * 3);
            rotateY(normalizedX * 3);
        });

        tile.addEventListener('pointerleave', () => {
            rotateX(0);
            rotateY(0);
        });
    });
}
