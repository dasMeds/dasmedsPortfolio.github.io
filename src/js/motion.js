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

    gsap.fromTo(words, {
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
        stagger: 0.05,
        scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            once: true
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

    document.querySelectorAll(
        '.hero-title, .section-title, .project-title, .job-title, .side-title, .stat-number'
    ).forEach(wrapHeadingWords);

    const textBlocks = document.querySelectorAll(
        '.hero-desc, .about-text, .project-desc, .job-role, .section-label, .stat-label'
    );
    textBlocks.forEach(wrapTextBlock);

    // Split each list item as one unit so icons and labels rise together behind a clipping mask.
    document.querySelectorAll('.stack-list li, .video-tags .tag').forEach(wrapListItem);
}
