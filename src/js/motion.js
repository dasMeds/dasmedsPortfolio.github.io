import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function wrapHeadingWords(heading, headingIndex) {
    // Keep an accessible single label while GSAP animates the visual word spans.
    heading.setAttribute('aria-label', heading.innerText.replace(/\s+/g, ' ').trim());
    heading.classList.add('kinetic-heading');

    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim()) textNodes.push(walker.currentNode);
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
            word.style.setProperty('--word-index', String(wordIndex++ + headingIndex % 3));
            word.setAttribute('aria-hidden', 'true');
            word.textContent = part;
            mask.append(word);
            fragment.append(mask);
        });
        textNode.replaceWith(fragment);
    });

    gsap.fromTo(heading.querySelectorAll('.kinetic-word'), {
        yPercent: 115,
        autoAlpha: 0
    }, {
        immediateRender: false,
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.82,
        ease: 'power3.out',
        stagger: 0.035,
        scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            once: true
        }
    });
}

export function initMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const headings = document.querySelectorAll(
        '.hero-title, .section-title, .project-title, .job-title, .side-title'
    );
    headings.forEach(wrapHeadingWords);

    const revealTargets = new Set(document.querySelectorAll(
        '.hero-desc, .hero-stats > div, .about-text, .stack-category, ' +
        '.projects-grid > .project-card, .job-item, .certification-item'
    ));

    revealTargets.forEach(target => {
        gsap.fromTo(target, {
            y: 28,
            autoAlpha: 0
        }, {
            immediateRender: false,
            y: 0,
            autoAlpha: 1,
            duration: 0.78,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: target,
                start: 'top 91%',
                once: true
            }
        });
    });

    // The orbital accent drifts at a slower rate than the page to add depth without competing with content.
    gsap.to('.ambient-orbit', {
        yPercent: 14,
        rotation: 8,
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8
        }
    });
}
