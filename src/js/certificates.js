import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const certifications = window.portfolioData.certifications;

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
    const summary = section?.querySelector('#cert-summary');
    const routeContainer = section?.querySelector('#cert-route-view');
    const boardContainer = section?.querySelector('#cert-board-view');
    const viewButtons = [...(section?.querySelectorAll('[data-cert-view]') ?? [])];
    const preview = section?.querySelector('#cert-preview');
    const previewImage = preview?.querySelector('img');
    if (!section || !rowsContainer || !filtersContainer || !sortButton || !countLabel || !summary ||
        !routeContainer || !boardContainer || !viewButtons.length || !preview || !previewImage) return;

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
    let routeTimeline;

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
            { className: 'cert-track-cell', content: certification.track },
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

    const shapeContents = {
        Networking: '<circle cx="10" cy="10" r="6"/>',
        SQL: '<rect x="4" y="4" width="12" height="12"/>',
        Python: '<path d="M10 3 17 16H3Z"/>',
        Cybersecurity: '<path d="m10 2 8 8-8 8-8-8Z"/>',
        'Data Analytics': '<path d="m5 3 10 0 5 7-5 7H5L0 10Z"/>'
    };

    const createShape = track => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = shapeContents[track] || shapeContents.Networking;
        return svg;
    };

    const createStamp = () => {
        const stamp = document.createElement('span');
        stamp.className = 'cert-stamp';
        stamp.hidden = true;
        stamp.setAttribute('aria-label', 'Verified credential');
        stamp.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="37"/><path d="m31 51 12 12 27-29"/></svg><span>VERIFIED</span>';
        return stamp;
    };

    const createStop = (certification, index, seenTracks, seenYears) => {
        const stop = document.createElement('article');
        stop.className = `cert-route-stop ${index % 2 ? 'is-right' : 'is-left'}`;
        stop.dataset.track = certification.track;
        stop.dataset.routeIndex = String(index);

        const marker = document.createElement('div');
        marker.className = 'cert-route-marker';
        const pin = document.createElement('span');
        pin.className = 'cert-route-pin';
        pin.append(createShape(certification.track));
        marker.append(pin);
        const date = new Date(`${certification.date}T00:00:00Z`);
        const month = document.createElement('span');
        month.className = 'cert-month-marker';
        month.textContent = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(date).toUpperCase();
        const year = document.createElement('span');
        year.className = 'cert-year-marker';
        year.textContent = String(date.getUTCFullYear());
        year.hidden = seenYears.has(date.getUTCFullYear());
        seenYears.add(date.getUTCFullYear());
        marker.append(month, year);
        stop.append(marker);

        const sticker = document.createElement('button');
        sticker.type = 'button';
        sticker.className = 'cert-sticker';
        sticker.dataset.id = certification.id;
        sticker.dataset.title = certification.title;
        sticker.dataset.issuer = certification.issuer;
        sticker.dataset.date = formatDate(certification.date);
        sticker.dataset.image = certification.image;
        sticker.dataset.imageAlt = certification.title;
        sticker.dataset.imageWidth = '1240';
        sticker.dataset.imageHeight = '835';
        sticker.dataset.description = `${certification.track} credential`;
        sticker.style.setProperty('--sticker-tilt', `${[2, -2.8, 3.2, -3.7][index % 4]}deg`);
        if (certification.verifyUrl) sticker.dataset.verifyUrl = certification.verifyUrl;

        if (!seenTracks.has(certification.track)) {
            const leg = document.createElement('span');
            leg.className = 'cert-leg-marker';
            leg.textContent = `LEG / ${String(tracks.indexOf(certification.track) + 1).padStart(2, '0')} — ${certification.track}`;
            sticker.append(leg);
            seenTracks.add(certification.track);
        }

        const title = document.createElement('strong');
        title.className = 'cert-sticker-title';
        title.textContent = certification.title;
        const thumb = document.createElement('img');
        thumb.className = 'cert-sticker-thumb';
        thumb.src = certification.image;
        thumb.alt = '';
        thumb.loading = 'lazy';
        thumb.width = 120;
        thumb.height = 80;
        sticker.append(title, thumb);

        [
            ['ISSUER', certification.issuer],
            ['DATE', formatDate(certification.date)],
            ['ID', certification.id]
        ].forEach(([label, value]) => {
            const field = document.createElement('span');
            field.className = 'cert-sticker-field';
            const key = document.createElement('span');
            key.textContent = label;
            const content = document.createElement('strong');
            content.textContent = value;
            field.append(key, content);
            sticker.append(field);
        });

        if (certification.verifyUrl) sticker.append(createStamp());
        sticker.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('portfolio:open-lightbox', { detail: { card: sticker } }));
        });
        stop.append(sticker);
        return stop;
    };

    const drawRoute = (svg, stops) => {
        if (!routeContainer.contains(svg)) return;
        const bounds = routeContainer.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
        const points = stops.map(stop => {
            const pin = stop.querySelector('.cert-route-pin');
            const pinBounds = pin.getBoundingClientRect();
            return {
                x: pinBounds.left + pinBounds.width / 2 - bounds.left,
                y: pinBounds.top + pinBounds.height / 2 - bounds.top
            };
        });
        if (!points.length) return;
        const path = points.reduce((pathData, point, index) => {
            if (index === 0) return `M ${point.x} ${point.y}`;
            const previous = points[index - 1];
            const midY = (previous.y + point.y) / 2;
            return `${pathData} C ${previous.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
        }, '');
        const backgroundPath = svg.querySelector('.cert-route-track');
        const progressPath = svg.querySelector('.cert-route-progress');
        const plane = svg.querySelector('.cert-route-plane');
        backgroundPath.setAttribute('d', path);
        progressPath.setAttribute('d', path);
        const length = progressPath.getTotalLength();
        gsap.set(progressPath, {
            strokeDasharray: length,
            strokeDashoffset: reducedMotion ? 0 : length
        });

        routeTimeline?.scrollTrigger?.kill();
        routeTimeline?.kill();
        if (reducedMotion) {
            svg.classList.add('is-static');
            stops.forEach(stop => {
                const stamp = stop.querySelector('.cert-stamp');
                if (stamp) stamp.hidden = false;
            });
            plane.hidden = true;
            return;
        }

        if (stops.length < 2) {
            plane.hidden = true;
            gsap.set(progressPath, { strokeDashoffset: 0 });
            return;
        }

        svg.classList.remove('is-static');
        plane.hidden = false;
        let lastStamped = -1;
        routeTimeline = gsap.timeline({
            scrollTrigger: {
                id: 'cert-route-flight',
                trigger: routeContainer,
                start: 'top 75%',
                end: 'bottom 70%',
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: self => {
                    const reached = Math.floor(self.progress * stops.length);
                    for (let index = lastStamped + 1; index < reached; index += 1) {
                        const stamp = stops[index]?.querySelector('.cert-stamp');
                        if (!stamp) continue;
                        stamp.hidden = false;
                        gsap.fromTo(stamp, { scale: 1.65, rotation: -12, autoAlpha: 0 }, {
                            scale: 1,
                            rotation: -12,
                            autoAlpha: 1,
                            duration: .32,
                            ease: 'back.out(2)',
                            overwrite: true
                        });
                    }
                    lastStamped = Math.max(lastStamped, reached - 1);
                }
            }
        });
        routeTimeline
            .to(progressPath, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
            .to(plane, {
                motionPath: { path: backgroundPath, align: backgroundPath, autoRotate: true, alignOrigin: [.5, .5] },
                ease: 'none',
                duration: 1
            }, 0);
    };

    function renderRoute(sorted) {
        routeTimeline?.scrollTrigger?.kill();
        routeTimeline?.kill();
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('cert-route-svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = '<path class="cert-route-track"/><path class="cert-route-progress"/><g class="cert-route-plane"><path d="m0-7 22 7-22 7 4-7Z"/></g>';

        const seenTracks = new Set();
        const seenYears = new Set();
        const nodes = sorted.map((certification, index) => createStop(certification, index, seenTracks, seenYears));
        routeContainer.replaceChildren(svg, ...nodes);
        requestAnimationFrame(() => {
            drawRoute(svg, nodes);
            ScrollTrigger.refresh();
        });
    }

    function renderRows(animate = false) {
        const fragment = document.createDocumentFragment();
        const sorted = sortedCertifications();
        const renderedRows = sorted.map(createRow);
        renderedRows.forEach(row => fragment.append(row));
        rowsContainer.replaceChildren(fragment);
        const issuerCount = new Set(sorted.map(certification => certification.issuer)).size;
        const range = sorted.length
            ? `${formatDate(sorted[0].date)} — ${formatDate(sorted[sorted.length - 1].date)}`
            : 'No credentials in this track';
        countLabel.textContent = String(sorted.length).padStart(2, '0');
        summary.textContent = `${sorted.length} stops · ${issuerCount} issuers · ${range}`;
        renderRoute(sorted);
        if (animate) animateRows(renderedRows);
    }

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const routeIsActive = button.dataset.certView === 'route';
            viewButtons.forEach(viewButton => {
                viewButton.setAttribute('aria-pressed', String(viewButton === button));
            });

            window.addEventListener('resize', () => renderRoute(sortedCertifications()), { passive: true });
            routeContainer.hidden = !routeIsActive;
            boardContainer.hidden = routeIsActive;
            if (routeIsActive) renderRoute(sortedCertifications());
        });
    });

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
