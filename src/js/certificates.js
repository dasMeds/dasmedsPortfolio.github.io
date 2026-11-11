import { Flip } from 'gsap/Flip';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Flip, ScrollTrigger);

export function initCertificateLedger() {
    const section = document.querySelector('#certifications');
    const rows = [...(section?.querySelectorAll('.cert-row') ?? [])];
    const filters = [...(section?.querySelectorAll('.cert-filter') ?? [])];
    const tracks = [...(section?.querySelectorAll('.cert-track') ?? [])];
    const constellation = section?.querySelector('.cert-constellation');
    const accessibleList = section?.querySelector('.cert-accessible-list');
    const preview = section?.querySelector('#cert-preview');
    const previewImage = preview?.querySelector('img');
    if (!section || !rows.length || !filters.length || !preview || !previewImage || !constellation || !accessibleList) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const simpleLayout = reducedMotion || window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    accessibleList.open = simpleLayout;
    const moveX = gsap.quickTo(preview, 'x', { duration: 0.22, ease: 'power2.out' });
    const moveY = gsap.quickTo(preview, 'y', { duration: 0.22, ease: 'power2.out' });
    let activeFilter = 'all';
    const mapNodes = new Map();

    tracks.forEach((track, trackIndex) => {
        const trackName = track.querySelector('.cert-track-title')?.childNodes[1]?.textContent.trim() || `Track ${trackIndex + 1}`;
        const trackRows = [...track.querySelectorAll('.cert-row')];
        const cluster = document.createElement('div');
        cluster.className = 'cert-cluster';
        cluster.dataset.track = track.dataset.track || '';
        cluster.setAttribute('aria-label', `${trackName} certification constellation`);

        const heading = document.createElement('h3');
        heading.className = 'cert-cluster-title';
        heading.textContent = trackName;

        const field = document.createElement('div');
        field.className = 'cert-cluster-field';
        const connector = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        connector.setAttribute('viewBox', '0 0 100 100');
        connector.setAttribute('preserveAspectRatio', 'none');
        connector.setAttribute('aria-hidden', 'true');
        connector.classList.add('cert-cluster-links');

        const points = trackRows.map((_, index) => {
            if (trackRows.length === 1) return [50, 50];
            const x = 10 + index * (80 / (trackRows.length - 1));
            const y = index % 2 === 0 ? 30 : 72;
            return [x, y];
        });

        points.slice(1).forEach((point, index) => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', String(points[index][0]));
            line.setAttribute('y1', String(points[index][1]));
            line.setAttribute('x2', String(point[0]));
            line.setAttribute('y2', String(point[1]));
            line.classList.add('cert-link');
            connector.append(line);
        });
        field.append(connector);

        trackRows.forEach((row, index) => {
            const node = document.createElement('button');
            const [x, y] = points[index];
            node.type = 'button';
            node.className = 'cert-node';
            node.style.setProperty('--node-x', `${x}%`);
            node.style.setProperty('--node-y', `${y}%`);
            node.setAttribute('aria-label', `${row.dataset.title || 'Certificate'}, ${row.dataset.issuer || 'issuer not listed'}`);
            node.dataset.category = row.dataset.category || '';
            const nodeIndex = document.createElement('span');
            nodeIndex.textContent = row.querySelector('.cert-row-index')?.textContent.trim().slice(0, 2) ||
                String(index + 1).padStart(2, '0');
            node.append(nodeIndex);
            node.addEventListener('pointerenter', event => showPreview(row, event));
            node.addEventListener('pointermove', event => {
                if (preview.classList.contains('is-visible')) {
                    positionPreview(event.clientX + 24, event.clientY + 18);
                }
            });
            node.addEventListener('pointerleave', () => hidePreview());
            node.addEventListener('focus', () => showPreview(row));
            node.addEventListener('blur', () => hidePreview());
            node.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('portfolio:open-lightbox', {
                    detail: { card: row }
                }));
            });
            mapNodes.set(row, node);
            field.append(node);
        });

        cluster.append(heading, field);
        constellation.append(cluster);

        if (!reducedMotion && trackRows.length > 1) {
            gsap.fromTo(connector.querySelectorAll('.cert-link'), {
                scaleX: 0,
                autoAlpha: 0,
                transformOrigin: 'left center'
            }, {
                scaleX: 1,
                autoAlpha: 1,
                stagger: 0.08,
                duration: 0.65,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: cluster,
                    start: 'top 78%',
                    once: true
                }
            });
        }
    });

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

        mapNodes.forEach((node, row) => {
            node.classList.toggle(
                'is-filtered',
                activeFilter !== 'all' && !row.dataset.category?.split(' ').includes(activeFilter)
            );
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
            const state = Flip.getState([...rows, ...tracks, ...mapNodes.values()]);
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
            mapNodes.forEach((node, row) => {
                node.classList.toggle(
                    'is-filtered',
                    nextFilter !== 'all' && !row.dataset.category?.split(' ').includes(nextFilter)
                );
            });
            constellation.querySelectorAll('.cert-cluster').forEach(cluster => {
                cluster.classList.toggle('is-filtered', !cluster.querySelector('.cert-node:not(.is-filtered)'));
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
