import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { certifications } from './certifications-data.js';

gsap.registerPlugin(ScrollTrigger);

const formatDate = date => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
}).format(new Date(`${date}T00:00:00Z`));

export function initCertificateLedger() {
    const section = document.querySelector('#certifications');
    const rowsContainer = section?.querySelector('#cert-rows');
    const filtersContainer = section?.querySelector('#cert-filters');
    const sortButton = section?.querySelector('#cert-sort-toggle');
    const countLabel = section?.querySelector('#cert-total');
    const preview = section?.querySelector('#cert-preview');
    const previewImage = preview?.querySelector('img');
    if (!section || !rowsContainer || !filtersContainer || !sortButton || !countLabel || !preview || !previewImage) return;

    const tracks = [...new Set(certifications.map(certification => certification.track))];
    const issuerCount = new Set(certifications.map(certification => certification.issuer)).size;
    const totalStat = document.querySelector('[data-cert-stat="total"]');
    const issuerStat = document.querySelector('[data-cert-stat="issuers"]');
    if (totalStat) {
        totalStat.textContent = String(certifications.length);
        totalStat.dataset.countTarget = String(certifications.length);
    }
    if (issuerStat) {
        issuerStat.textContent = String(issuerCount);
        issuerStat.dataset.countTarget = String(issuerCount);
    }
    countLabel.textContent = String(certifications.length).padStart(2, '0');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const moveX = gsap.quickTo(preview, 'x', { duration: 0.2, ease: 'power2.out' });
    const moveY = gsap.quickTo(preview, 'y', { duration: 0.2, ease: 'power2.out' });
    const sourceOrder = certifications.map((certification, sourceIndex) => ({ ...certification, sourceIndex }));
    let activeFilter = 'all';
    let newestFirst = false;
    let hasAnimatedOnEnter = false;

    const sortedCertifications = () => sourceOrder
        .filter(certification => activeFilter === 'all' || certification.track === activeFilter)
        .sort((left, right) => {
            const dateOrder = left.date.localeCompare(right.date);
            if (dateOrder === 0) return left.sourceIndex - right.sourceIndex;
            return (newestFirst ? -1 : 1) * dateOrder;
        });

    const animateRows = rows => {
        if (reducedMotion || !rows.length) return;
        const flaps = rows.flatMap(row => [...row.querySelectorAll('.cert-flap')]);
        gsap.fromTo(flaps, {
            rotationX: -82,
            y: -4,
            autoAlpha: 0,
            transformOrigin: '50% 0%'
        }, {
            rotationX: 0,
            y: 0,
            autoAlpha: 1,
            duration: 0.34,
            stagger: { each: 0.018, from: newestFirst ? 'start' : 'end' },
            ease: 'power2.out',
            overwrite: true
        });
    };

    const positionPreview = (x, y) => {
        const width = preview.offsetWidth || 260;
        const height = preview.offsetHeight || 180;
        moveX(Math.max(12, Math.min(window.innerWidth - width - 12, x)));
        moveY(Math.max(12, Math.min(window.innerHeight - height - 12, y)));
    };

    const showPreview = (row, event) => {
        if (event && !window.matchMedia('(pointer: fine)').matches) return;
        const source = row.dataset.image;
        if (!source) {
            console.error('Certificate row is missing its preview image.', row);
            return;
        }
        if (previewImage.getAttribute('src') !== source) {
            previewImage.src = source;
            previewImage.alt = '';
        }
        preview.setAttribute('aria-hidden', 'false');
        preview.classList.add('is-visible');
        if (event) {
            positionPreview(event.clientX + 20, event.clientY + 16);
        } else {
            const bounds = row.getBoundingClientRect();
            positionPreview(bounds.right + 16, bounds.top + bounds.height / 2);
        }
        if (reducedMotion) {
            gsap.set(preview, { autoAlpha: 1, scale: 1 });
        } else {
            gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.18, overwrite: true });
        }
    };

    const hidePreview = () => {
        if (reducedMotion) {
            preview.classList.remove('is-visible');
            preview.setAttribute('aria-hidden', 'true');
            return;
        }
        gsap.to(preview, {
            autoAlpha: 0,
            scale: 0.98,
            duration: 0.14,
            overwrite: true,
            onComplete: () => {
                preview.classList.remove('is-visible');
                preview.setAttribute('aria-hidden', 'true');
            }
        });
    };

    const createFilter = (label, value, count) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cert-filter';
        button.dataset.filter = value;
        button.setAttribute('aria-pressed', String(value === activeFilter));
        if (value === activeFilter) button.classList.add('is-active');
        const name = document.createElement('span');
        name.textContent = label;
        const total = document.createElement('span');
        total.className = 'cert-filter-count';
        total.textContent = String(count).padStart(2, '0');
        total.setAttribute('aria-label', `${count} certifications`);
        button.append(name, total);
        button.addEventListener('click', () => {
            if (activeFilter === value) return;
            activeFilter = value;
            renderRows(true);
            refreshFilters();
        });
        return button;
    };

    const refreshFilters = () => {
        filtersContainer.replaceChildren(
            createFilter('ALL', 'all', certifications.length),
            ...tracks.map(track => createFilter(
                track.toUpperCase(),
                track,
                certifications.filter(certification => certification.track === track).length
            ))
        );
    };

    const createRow = (certification, index) => {
        const row = document.createElement('tr');
        row.className = 'cert-row';
        row.tabIndex = 0;
        row.dataset.id = certification.id;
        row.dataset.title = certification.title;
        row.dataset.issuer = certification.issuer;
        row.dataset.date = formatDate(certification.date);
        row.dataset.image = certification.image;
        row.dataset.imageAlt = certification.title;
        row.dataset.imageWidth = '1240';
        row.dataset.imageHeight = '835';
        row.dataset.description = `${certification.track} credential`;
        if (certification.verifyUrl) row.dataset.verifyUrl = certification.verifyUrl;

        const columns = [
            { className: 'cert-index', content: String(index + 1).padStart(2, '0') },
            { className: 'cert-date', content: formatDate(certification.date), dateTime: certification.date },
            { className: 'cert-title', content: certification.title },
            { className: 'cert-issuer', content: certification.issuer },
            { className: 'cert-status-cell', status: true }
        ];

        columns.forEach(column => {
            const cell = document.createElement('td');
            const flap = document.createElement('span');
            flap.className = 'cert-flap';
            if (column.status) {
                const status = document.createElement('span');
                status.className = `cert-status${certification.verifyUrl ? ' is-verified' : ''}`;
                if (certification.verifyUrl) {
                    status.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5"/></svg><span>VERIFIED</span>';
                } else {
                    status.textContent = 'LOGGED';
                }
                flap.append(status);
            } else if (column.dateTime) {
                const time = document.createElement('time');
                time.dateTime = column.dateTime;
                time.textContent = column.content;
                flap.append(time);
            } else {
                flap.textContent = column.content;
            }
            cell.className = column.className;
            cell.append(flap);
            row.append(cell);
        });

        row.addEventListener('pointerenter', event => showPreview(row, event));
        row.addEventListener('pointermove', event => {
            if (preview.classList.contains('is-visible')) positionPreview(event.clientX + 20, event.clientY + 16);
        });
        row.addEventListener('pointerleave', hidePreview);
        row.addEventListener('focus', () => showPreview(row));
        row.addEventListener('blur', hidePreview);
        row.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('portfolio:open-lightbox', { detail: { card: row } }));
        });
        row.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                document.dispatchEvent(new CustomEvent('portfolio:open-lightbox', { detail: { card: row } }));
            }
        });
        return row;
    };

    function renderRows(animate = false) {
        const fragment = document.createDocumentFragment();
        const sorted = sortedCertifications();
        let lastTrack = '';
        const renderedRows = [];
        sorted.forEach((certification, index) => {
            if (lastTrack !== certification.track) {
                const gate = document.createElement('tr');
                gate.className = 'cert-gate';
                const heading = document.createElement('th');
                heading.scope = 'rowgroup';
                heading.colSpan = 5;
                heading.textContent = `GATE / ${String(tracks.indexOf(certification.track) + 1).padStart(2, '0')} — ${certification.track}`;
                gate.append(heading);
                fragment.append(gate);
                lastTrack = certification.track;
            }
            const row = createRow(certification, index);
            fragment.append(row);
            renderedRows.push(row);
        });
        rowsContainer.replaceChildren(fragment);
        if (animate) animateRows(renderedRows);
    }

    sortButton.addEventListener('click', () => {
        newestFirst = !newestFirst;
        sortButton.setAttribute('aria-pressed', String(newestFirst));
        sortButton.setAttribute('aria-label', `Sort ${newestFirst ? 'oldest' : 'newest'} first`);
        sortButton.textContent = newestFirst ? 'NEWEST FIRST' : 'OLDEST FIRST';
        section.querySelector('.cert-table thead th[aria-sort]')?.setAttribute('aria-sort', newestFirst ? 'descending' : 'ascending');
        renderRows(true);
    });

    refreshFilters();
    renderRows();
    ScrollTrigger.create({
        trigger: section,
        start: 'top 78%',
        once: true,
        onEnter: () => {
            if (hasAnimatedOnEnter) return;
            hasAnimatedOnEnter = true;
            animateRows([...rowsContainer.querySelectorAll('.cert-row')]);
        }
    });
}
