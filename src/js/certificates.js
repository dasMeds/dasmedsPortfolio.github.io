import { Flip } from 'gsap/Flip';
import { gsap } from 'gsap';

gsap.registerPlugin(Flip);

export function initCertificateLedger() {
    const section = document.querySelector('#certifications');
    const rows = [...(section?.querySelectorAll('.cert-row') ?? [])];
    const filters = [...(section?.querySelectorAll('.cert-filter') ?? [])];
    const tracks = [...(section?.querySelectorAll('.cert-track') ?? [])];
    const preview = section?.querySelector('#cert-preview');
    const previewImage = preview?.querySelector('img');
    if (!section || !rows.length || !filters.length || !preview || !previewImage) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const moveX = gsap.quickTo(preview, 'x', { duration: 0.22, ease: 'power2.out' });
    const moveY = gsap.quickTo(preview, 'y', { duration: 0.22, ease: 'power2.out' });
    let activeFilter = 'all';

    const setPreviewImage = row => {
        const source = row.dataset.image;
        if (!source) {
            console.error('Certificate row is missing its preview image.', row);
            return false;
        }
        if (previewImage.getAttribute('src') !== source) {
            previewImage.src = source;
            previewImage.alt = '';
            previewImage.width = Number(row.dataset.imageWidth) || 320;
            previewImage.height = Number(row.dataset.imageHeight) || 216;
        }
        return true;
    };

    const positionPreview = (x, y) => {
        const previewWidth = preview.offsetWidth || 260;
        const previewHeight = preview.offsetHeight || 200;
        moveX(Math.max(12, Math.min(window.innerWidth - previewWidth - 12, x)));
        moveY(Math.max(12, Math.min(window.innerHeight - previewHeight - 12, y)));
    };

    const showPreview = (row, event) => {
        if (reducedMotion || !window.matchMedia('(pointer: fine)').matches || !setPreviewImage(row)) return;
        preview.classList.add('is-visible');
        gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.2, overwrite: true });
        if (event) {
            positionPreview(event.clientX + 24, event.clientY + 18);
        } else {
            const bounds = row.getBoundingClientRect();
            positionPreview(bounds.right + 18, bounds.top + bounds.height / 2);
        }
    };

    const hidePreview = () => {
        if (reducedMotion) return;
        gsap.to(preview, {
            autoAlpha: 0,
            scale: 0.98,
            duration: 0.16,
            overwrite: true,
            onComplete: () => preview.classList.remove('is-visible')
        });
    };

    rows.forEach(row => {
        row.addEventListener('pointerenter', event => showPreview(row, event));
        row.addEventListener('pointermove', event => {
            if (preview.classList.contains('is-visible')) {
                positionPreview(event.clientX + 24, event.clientY + 18);
            }
        });
        row.addEventListener('pointerleave', hidePreview);
        row.addEventListener('focus', () => showPreview(row));
        row.addEventListener('blur', hidePreview);
        row.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('portfolio:open-lightbox', {
                detail: { card: row }
            }));
        });
    });

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const nextFilter = filter.dataset.filter || 'all';
            if (nextFilter === activeFilter) return;
            const state = Flip.getState([...rows, ...tracks]);
            activeFilter = nextFilter;

            filters.forEach(button => {
                const isActive = button === filter;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });

            rows.forEach(row => {
                row.classList.toggle('is-filtered', nextFilter !== 'all' && !row.dataset.category?.split(' ').includes(nextFilter));
            });
            tracks.forEach(track => {
                track.classList.toggle('is-filtered', !track.querySelector('.cert-row:not(.is-filtered)'));
            });

            if (!reducedMotion) {
                Flip.from(state, {
                    duration: 0.42,
                    ease: 'power2.inOut',
                    absolute: false,
                    onEnter: elements => gsap.fromTo(elements, {
                        autoAlpha: 0,
                        y: 8
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.28,
                        stagger: 0.025,
                        overwrite: true
                    })
                });
            }
        });
    });
}
