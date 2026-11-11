import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const svgNamespace = 'http://www.w3.org/2000/svg';

const createSvg = (viewBox, className) => {
    const svg = document.createElementNS(svgNamespace, 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('class', className);
    svg.setAttribute('aria-hidden', 'true');
    return svg;
};

const createShape = (svg, name, attributes) => {
    const shape = document.createElementNS(svgNamespace, name);
    Object.entries(attributes).forEach(([key, value]) => shape.setAttribute(key, value));
    svg.append(shape);
    return shape;
};

const hash = value => Array.from(value).reduce(
    (result, character) => (result * 31 + character.charCodeAt(0)) >>> 0,
    7
);

function createEmblem(container) {
    const callSign = container.dataset.callSign || container.dataset.name || 'FLIGHT UNIT';
    const seed = hash(`${container.dataset.name || ''} ${callSign}`);
    const svg = createSvg('0 0 160 160', 'squadron-patch');
    const ringId = `patch-ring-${seed.toString(16)}`;

    createShape(svg, 'circle', { cx: '80', cy: '80', r: '72', class: 'patch-outer-ring' });
    createShape(svg, 'circle', { cx: '80', cy: '80', r: '59', class: 'patch-inner-ring' });
    createShape(svg, 'path', {
        id: ringId,
        d: 'M 23 80 a 57 57 0 1 1 114 0 a 57 57 0 1 1 -114 0',
        fill: 'none'
    });

    const ringText = document.createElementNS(svgNamespace, 'text');
    ringText.setAttribute('class', 'patch-call-sign');
    const textPath = document.createElementNS(svgNamespace, 'textPath');
    textPath.setAttribute('href', `#${ringId}`);
    textPath.setAttribute('startOffset', '50%');
    textPath.setAttribute('text-anchor', 'middle');
    textPath.textContent = callSign.toUpperCase();
    ringText.append(textPath);
    svg.append(ringText);

    const sides = 3 + (seed % 4);
    const offset = (seed % 360) * (Math.PI / 180);
    const points = Array.from({ length: sides }, (_, index) => {
        const angle = offset + (Math.PI * 2 * index) / sides - Math.PI / 2;
        const radius = 30 + ((seed >>> (index * 3)) % 9);
        return `${(80 + Math.cos(angle) * radius).toFixed(2)},${(80 + Math.sin(angle) * radius).toFixed(2)}`;
    }).join(' ');
    createShape(svg, 'polygon', { points, class: 'patch-motif' });
    createShape(svg, 'path', {
        d: `M80 48v64M48 80h64M${points.split(' ')[0]} ${points.split(' ').at(-1)}`,
        class: 'patch-crosshair'
    });
    createShape(svg, 'circle', { cx: '80', cy: '80', r: String(4 + (seed % 3)), class: 'patch-center' });

    container.replaceChildren(svg);
}

const languageShapes = {
    html: [['path', { d: 'm5 4-4 4 4 4m6-8 4 4-4 4' }]],
    css: [['path', { d: 'M3 2h10l-1 11-4 2-4-2L3 2Zm2 3h6M5.5 8h5' }]],
    java: [['path', { d: 'M5 7h6l-1 5H6L5 7Zm1 7c1.6 1 4.4 1 6 0M7 3c2 1 2 2 0 3M10 2c2 1 2 2 0 4' }]],
    swing: [['rect', { x: '2', y: '3', width: '12', height: '10', rx: '1' }], ['path', { d: 'M2 6h12M5 5h.01M7 5h.01' }]],
    sql: [['ellipse', { cx: '8', cy: '4', rx: '5.5', ry: '2' }], ['path', { d: 'M2.5 4v8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2V4M2.5 8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2' }]],
    javascript: [['path', { d: 'M8 1 2 9h5l-1 6 7-9H8l1-5Z' }]],
    python: [['path', { d: 'M8 2H5C3 2 3 4 3 6v2h5V6h3c2 0 2-2 2-4V2H8Zm0 12h3c2 0 2-2 2-4V8H8c-2 0-2 2-2 4v2h2Zm-3-10h.01M9 12h.01' }]]
};

function createLanguageIcon(label) {
    const key = label.toLowerCase();
    const svg = createSvg('0 0 16 16', 'repo-stack-icon');
    const shapes = languageShapes[key] || languageShapes.html;
    shapes.forEach(([name, attributes]) => createShape(svg, name, attributes));
    return svg;
}

function initializeEmblems() {
    document.querySelectorAll('.repo-emblem[data-call-sign]').forEach(createEmblem);
}

function initializeStackIcons() {
    document.querySelectorAll('.repo-card .video-tags .tag').forEach(tag => {
        const language = tag.textContent.trim();
        const label = document.createElement('span');
        label.textContent = language;
        tag.replaceChildren(createLanguageIcon(language), label);
    });
}

function initializeCardMotion() {
    const cards = [...document.querySelectorAll('.repo-card')];
    if (!cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
        gsap.fromTo(cards, { y: 18, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: document.querySelector('.repo-grid'),
                start: 'top 84%',
                once: true
            }
        });
    }

    cards.forEach(card => {
        const briefing = card.querySelector('.repo-briefing');
        const toggle = card.querySelector('.repo-row-toggle');
        if (!briefing || !toggle) return;
        const setExpanded = expanded => {
            if (toggle.getAttribute('aria-expanded') === String(expanded)) return;
            toggle.setAttribute('aria-expanded', String(expanded));
            briefing.setAttribute('aria-hidden', String(!expanded));
            if (reducedMotion) {
                gsap.set(briefing, { height: expanded ? 'auto' : 0, autoAlpha: expanded ? 1 : 0 });
                return;
            }
            gsap.to(briefing, {
                height: expanded ? 'auto' : 0,
                autoAlpha: expanded ? 1 : 0,
                duration: 0.38,
                ease: 'power2.out',
                overwrite: true
            });
        };
        toggle.addEventListener('click', () => {
            setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
        });
    });

    if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
    cards.forEach(card => {
        const emblem = card.querySelector('.repo-emblem');
        if (!emblem) return;
        const moveX = gsap.quickTo(emblem, 'x', { duration: 0.3, ease: 'power2.out' });
        const moveY = gsap.quickTo(emblem, 'y', { duration: 0.3, ease: 'power2.out' });
        card.addEventListener('pointermove', event => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            moveX(x * 10);
            moveY(y * 10);
        });
        card.addEventListener('pointerleave', () => {
            moveX(0);
            moveY(0);
        });
    });
}

function copyWithFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Clipboard copy was not available in this browser.');
}

export function initRepositories() {
    initializeEmblems();
    initializeStackIcons();
    initializeCardMotion();

    document.querySelectorAll('.repo-copy').forEach(button => {
        button.addEventListener('click', async () => {
            const command = button.dataset.copyText;
            const status = button.closest('.repo-card')?.querySelector('.repo-copy-status');
            const label = button.querySelector('span');
            if (!command || !status) {
                console.error('Repository copy control is missing its command or status element.', button);
                return;
            }

            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(command);
                } else {
                    copyWithFallback(command);
                }
                if (label) label.textContent = 'COPIED';
                status.textContent = 'CLONE COMMAND COPIED';
                window.setTimeout(() => {
                    if (label) label.textContent = 'COPY';
                    status.textContent = '';
                }, 1800);
            } catch (error) {
                console.error('Unable to copy the repository clone command.', error);
                if (label) label.textContent = 'RETRY';
                status.textContent = 'COPY FAILED — SELECT THE COMMAND ABOVE';
            }
        });
    });
}
