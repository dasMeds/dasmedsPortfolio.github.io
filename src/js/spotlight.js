export function initSpotlightNav() {
    const links = [...document.querySelectorAll('[data-spotlight-nav] .nav-links a')];
    if (!window.matchMedia('(pointer: fine)').matches) return;

    links.forEach(link => {
        link.addEventListener('pointermove', event => {
            const bounds = link.getBoundingClientRect();
            link.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
            link.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
        });
        link.addEventListener('pointerleave', () => {
            link.style.removeProperty('--spotlight-x');
            link.style.removeProperty('--spotlight-y');
        });
    });
}
