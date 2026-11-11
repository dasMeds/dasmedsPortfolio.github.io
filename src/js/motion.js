import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function animateSplitText(target, index, selector = null) {
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    const textNodes = [];

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.textContent.trim() && (!selector || node.parentElement.closest(selector))) {
            textNodes.push(node);
        }
    }

    let wordIndex = 0;
    textNodes.forEach(textNode => {
        const fragment = document.createDocumentFragment();
        textNode.textContent.split(/(\s+)/).forEach(part => {
            if (!part.trim()) {
                fragment.append(document.createTextNode(part));
                return;
            }

            const mask = document.createElement('span');
            mask.className = 'kinetic-mask';
            const word = document.createElement('span');
            word.className = 'kinetic-word';
            word.style.setProperty('--word-index', String(wordIndex++ + index % 3));
            word.setAttribute('aria-hidden', 'true');
            word.textContent = part;
            mask.append(word);
            fragment.append(mask);
        });
        textNode.replaceWith(fragment);
    });

    return target.querySelectorAll('.kinetic-word');
}

function wrapHeadingWords(heading, headingIndex) {
    // Keep an accessible single label while GSAP animates the visual word spans.
    heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
    heading.classList.add('kinetic-heading');
    const words = animateSplitText(heading, headingIndex);

    const revealTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            once: true
        }
    });

    words.forEach((word, index) => {
        const originalText = word.textContent;
        const scramble = { progress: 0 };
        const scrambleCharacters = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';

        revealTimeline.fromTo(word, {
            yPercent: 110,
            rotation: 5,
            autoAlpha: 0
        }, {
            yPercent: 0,
            rotation: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out'
        }, index * 0.05);

        if (heading.classList.contains('hero-title')) {
            revealTimeline.to(scramble, {
                progress: 1,
                duration: 0.68,
                ease: 'none',
                onUpdate: () => {
                    const settled = Math.floor(scramble.progress * originalText.length);
                    const noise = Array.from({ length: originalText.length - settled }, () =>
                        scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)]
                    ).join('');
                    word.textContent = originalText.slice(0, settled) + noise;
                },
                onComplete: () => { word.textContent = originalText; }
            }, index * 0.05);
        }
    });
}

function wrapTextBlock(target, index) {
    const mask = document.createElement('div');
    mask.className = 'kinetic-block-mask';
    target.parentNode.insertBefore(mask, target);
    mask.append(target);

    const label = target.innerText.replace(/\s+/g, ' ').trim();
    target.setAttribute('aria-label', label);
    target.classList.add('kinetic-text');
    const words = animateSplitText(target, index);

    gsap.fromTo(words, {
        yPercent: 110,
        rotation: 3,
        autoAlpha: 0
    }, {
        immediateRender: false,
        yPercent: 0,
        rotation: 0,
        autoAlpha: 1,
        duration: 0.72,
        ease: 'power3.out',
        stagger: 0.012,
        scrollTrigger: {
            trigger: mask,
            start: 'top 80%',
            once: true
        }
    });
}

function wrapListItem(item, index) {
    const mask = document.createElement('span');
    mask.className = 'kinetic-item-mask';
    const content = document.createElement('span');
    content.className = 'kinetic-item';

    while (item.firstChild) content.append(item.firstChild);
    mask.append(content);
    item.append(mask);

    gsap.fromTo(content, {
        yPercent: 110,
        rotation: 5,
        autoAlpha: 0
    }, {
        immediateRender: false,
        yPercent: 0,
        rotation: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: (index % 4) * 0.05,
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            once: true
        }
    });
}

export function initMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    initHeroReveal();
    initAboutMarquee();

    document.querySelectorAll(
        '.hero-title, .section-title, .project-title, .job-title, .side-title, .stat-number'
    ).forEach((heading, index) => {
        if (heading.closest('#home')) return;
        wrapHeadingWords(heading, index);
    });

    const textBlocks = document.querySelectorAll(
        '.hero-desc, .about-text:not(.about-marquee-track), .project-desc, .job-role, .section-label, .stat-label'
    );
    textBlocks.forEach(wrapTextBlock);

    // Split each list item as one unit so icons and labels rise together behind a clipping mask.
    document.querySelectorAll('.stack-list li, .video-tags .tag').forEach(wrapListItem);

    document.querySelectorAll('[data-count-target]').forEach(counter => {
        const target = Number(counter.dataset.countTarget);
        if (!Number.isFinite(target)) return;
        const count = { value: 0 };
        gsap.to(count, {
            value: target,
            duration: 1.15,
            ease: 'power2.out',
            onUpdate: () => { counter.textContent = String(Math.round(count.value)); },
            scrollTrigger: {
                trigger: counter,
                start: 'top 90%',
                once: true
            }
        });
    });
}

function initHeroReveal() {
    const hero = document.querySelector('#home.hero-stage');
    const paths = hero?.querySelectorAll('.hero-coordinate-lines path');
    if (!hero || !paths?.length) return;

    const readouts = hero.querySelectorAll('.hero-readout, .coordinate-label, .hero-index');
    const title = hero.querySelector('.hero-title');
    const copy = hero.querySelector('.hero-copy');
    const timeline = gsap.timeline({ delay: 0.12 });
    window.dispatchEvent(new CustomEvent('portfolio:hero-reveal'));

    timeline
        .fromTo(paths, { scaleX: 0, autoAlpha: 0 }, {
            scaleX: 1,
            autoAlpha: 0.72,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power2.out'
        })
        .fromTo(readouts, { y: 8, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: 'power2.out'
        }, 0.2)
        .fromTo(title, { y: 24, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.18)
        .fromTo(copy, { y: 14, autoAlpha: 0 }, {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: 'power2.out'
        }, 0.5);
}

function initAboutMarquee() {
    const track = document.querySelector('.about-marquee-track');
    const viewport = track?.closest('.about-marquee');
    if (!track || !viewport) return;

    const text = track.textContent.trim();
    const segment = document.createElement('span');
    segment.className = 'about-marquee-segment';
    segment.textContent = `${text} `;
    track.replaceChildren(segment, segment.cloneNode(true));

    const loop = gsap.to(track, {
        xPercent: -50,
        duration: 32,
        ease: 'none',
        repeat: -1
    });

    const setSpeed = gsap.quickTo(loop, 'timeScale', {
        duration: 0.25,
        ease: 'power2.out'
    });
    let previousY = window.scrollY;
    let previousTime = performance.now();
    let settleSpeed;

    window.addEventListener('scroll', () => {
        const now = performance.now();
        const currentY = window.scrollY;
        const elapsed = Math.max(now - previousTime, 16);
        const velocity = Math.abs(currentY - previousY) / elapsed;
        previousY = currentY;
        previousTime = now;

        setSpeed(gsap.utils.clamp(1, 5, 1 + velocity * 2.5));
        settleSpeed?.kill();
        settleSpeed = gsap.delayedCall(0.2, () => setSpeed(1));
    }, { passive: true });
}
