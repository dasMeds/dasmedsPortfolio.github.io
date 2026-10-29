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
            filter: 'blur(12px)',
            autoAlpha: 0
        }, {
            yPercent: 0,
            rotation: 0,
            filter: 'blur(0px)',
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
        filter: 'blur(12px)',
        autoAlpha: 0
    }, {
        immediateRender: false,
        yPercent: 0,
        rotation: 0,
        filter: 'blur(0px)',
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
        filter: 'blur(12px)',
        autoAlpha: 0
    }, {
        immediateRender: false,
        yPercent: 0,
        rotation: 0,
        filter: 'blur(0px)',
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

    initHorizontalProjects();
    initHorizontalPosters();
    initAboutMarquee();
    initMediaStacks();

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

    // Reveal large media with an expanding crop instead of a generic opacity fade.
    document.querySelectorAll(
        '.cert-img, .about-grid img, #demoreel-video, .video-card video'
    ).forEach(media => {
        media.classList.add('media-reveal-ready');
        gsap.fromTo(media, {
            clipPath: 'inset(0 100% 0 0)'
        }, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.05,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: media,
                start: 'top 80%',
                once: true
            }
        });
    });
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

function initMediaStacks() {
    const videoCards = [...document.querySelectorAll('#videos .video-card')];

    videoCards.slice(1).forEach((card, index) => {
        const cardTop = () => card.offsetTop;
        gsap.fromTo(videoCards[index], {
            scale: 1,
            autoAlpha: 1
        }, {
            scale: 0.95,
            autoAlpha: 0.5,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: () => cardTop() - window.innerHeight * 0.85,
                end: () => cardTop() - window.innerHeight * 0.12,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    });
}

function initHorizontalPosters() {
    const section = document.querySelector('#posters');
    const viewport = section?.querySelector('.poster-viewport');
    const track = section?.querySelector('.poster-track');
    const images = [...(section?.querySelectorAll('.poster-card img') ?? [])];
    if (!section || !viewport || !track || images.length < 2) return;

    ScrollTrigger.matchMedia({
        '(min-width: 769px)': () => {
            section.classList.add('is-horizontal-pinned');

            const horizontalDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
            const skewSetters = images.map(image => gsap.quickTo(image, 'skewX', {
                duration: 0.24,
                ease: 'power2.out'
            }));
            let settleSkew;

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${horizontalDistance()}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    onUpdate: self => {
                        const skew = gsap.utils.clamp(-5, 5, self.getVelocity() / 800);
                        skewSetters.forEach(setSkew => setSkew(skew));
                        settleSkew?.kill();
                        settleSkew = gsap.delayedCall(0.12, () => {
                            skewSetters.forEach(setSkew => setSkew(0));
                        });
                    }
                }
            });

            timeline.to(track, {
                x: () => -horizontalDistance(),
                ease: 'none'
            });

            return () => {
                settleSkew?.kill();
                timeline.scrollTrigger?.kill();
                timeline.kill();
                gsap.set(track, { clearProps: 'transform' });
                gsap.set(images, { skewX: 0 });
                section.classList.remove('is-horizontal-pinned');
            };
        }
    });
}

function initHorizontalProjects() {
    const section = document.querySelector('.horizontal-projects');
    const viewport = section?.querySelector('.horizontal-projects-viewport');
    const track = section?.querySelector('.horizontal-projects-track');
    if (!section || !viewport || !track) return;

    // Keep the repository sequence touch-scrollable on smaller screens where vertical context matters more.
    ScrollTrigger.matchMedia({
        '(min-width: 769px)': () => {
            const horizontalDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${horizontalDistance()}`,
                    pin: section,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });

            timeline.to(track, {
                x: () => -horizontalDistance(),
                ease: 'none'
            });

            return () => {
                timeline.scrollTrigger?.kill();
                gsap.set(track, { clearProps: 'transform' });
            };
        }
    });
}
