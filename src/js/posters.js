import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

export function initPosterBento() {
    const section = document.querySelector('#posters');
    const bento = section?.querySelector('.poster-bento');
    const ring = bento?.querySelector('.poster-ring');
    const tiles = [...(ring?.querySelectorAll('.poster-tile') ?? [])];
    if (!section || !bento || !ring || !tiles.length) return;

    const dataPlate = document.createElement('aside');
    dataPlate.className = 'poster-data-plate';
    dataPlate.setAttribute('aria-hidden', 'true');
    dataPlate.innerHTML = `
        <span class="poster-plate-kicker">TARGET DATA / <span class="poster-plate-index">01</span></span>
        <strong class="poster-plate-title"></strong>
        <span class="poster-plate-meta"><span>TOOLS</span><span class="poster-plate-tools"></span></span>
        <span class="poster-plate-meta"><span>INTENT</span><span class="poster-plate-intent"></span></span>
    `;
    bento.append(dataPlate);

    const plateTitle = dataPlate.querySelector('.poster-plate-title');
    const plateTools = dataPlate.querySelector('.poster-plate-tools');
    const plateIntent = dataPlate.querySelector('.poster-plate-intent');
    const plateIndex = dataPlate.querySelector('.poster-plate-index');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const simpleLayout = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
    const scaleXTo = tiles.map(tile => gsap.quickTo(tile, 'scaleX', {
        duration: 0.24,
        ease: 'power2.out'
    }));
    const scaleYTo = tiles.map(tile => gsap.quickTo(tile, 'scaleY', {
        duration: 0.24,
        ease: 'power2.out'
    }));
    let activeIndex = -1;
    let dragAngle = 0;
    let scrollAngle = 0;
    let pointerStartX = 0;
    let dragStartAngle = 0;
    let activePointerId = null;
    let dragging = false;
    let suppressClickUntil = 0;

    const typeText = (element, value, duration = 0.32) => {
        if (reducedMotion) {
            element.textContent = value;
            return;
        }
        const progress = { value: 0 };
        gsap.killTweensOf(element);
        gsap.to(progress, {
            value: value.length,
            duration,
            ease: 'none',
            onUpdate: () => {
                element.textContent = value.slice(0, Math.floor(progress.value));
            },
            onComplete: () => {
                element.textContent = value;
            }
        });
    };

    const updateFront = angle => {
        const nextIndex = tiles.reduce((front, _, index) => {
            const distance = Math.min(
                mod(index * 360 / tiles.length + angle, 360),
                mod(-(index * 360 / tiles.length + angle), 360)
            );
            return distance < front.distance ? { index, distance } : front;
        }, { index: 0, distance: Infinity }).index;

        if (activeIndex === nextIndex) return;
        activeIndex = nextIndex;
        tiles.forEach((tile, index) => {
            const isFront = index === nextIndex;
            tile.classList.toggle('is-front', isFront);
            const scale = isFront ? 1.08 : 0.78;
            scaleXTo[index](scale);
            scaleYTo[index](scale);
        });

        const card = tiles[nextIndex];
        plateIndex.textContent = String(nextIndex + 1).padStart(2, '0');
        typeText(plateTitle, card.dataset.title || 'Untitled study');
        typeText(plateTools, card.dataset.tools || 'TOOLS / TBD');
        typeText(plateIntent, card.dataset.intent || 'INTENT / TBD');
    };

    const setRotation = () => {
        const totalAngle = scrollAngle + dragAngle;
        ring.style.setProperty('--poster-scroll-angle', `${scrollAngle}deg`);
        ring.style.setProperty('--poster-drag-angle', `${dragAngle}deg`);
        updateFront(totalAngle);
    };

    setRotation();

    if (!reducedMotion && !simpleLayout) {
        const scrollProgress = { angle: 0 };
        gsap.to(scrollProgress, {
            angle: -360,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'bottom 15%',
                scrub: 1,
                invalidateOnRefresh: true,
            },
            onUpdate: () => {
                scrollAngle = scrollProgress.angle;
                setRotation();
            }
        });

        if (window.matchMedia('(pointer: fine)').matches) {
            bento.addEventListener('pointerdown', event => {
                if (!event.isPrimary || event.button !== 0) return;
                activePointerId = event.pointerId;
                pointerStartX = event.clientX;
                dragStartAngle = dragAngle;
                dragging = false;
            });

            bento.addEventListener('pointermove', event => {
                if (event.pointerId !== activePointerId) return;
                const delta = event.clientX - pointerStartX;
                if (!dragging && Math.abs(delta) < 5) return;
                dragging = true;
                bento.classList.add('is-dragging');
                dragAngle = dragStartAngle + delta * 0.22;
                setRotation();
            });

            const endDrag = event => {
                if (event.pointerId !== activePointerId) return;
                if (dragging) suppressClickUntil = performance.now() + 350;
                activePointerId = null;
                dragging = false;
                bento.classList.remove('is-dragging');
            };
            bento.addEventListener('pointerup', endDrag);
            bento.addEventListener('pointercancel', endDrag);
            bento.addEventListener('click', event => {
                if (performance.now() < suppressClickUntil) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }, true);
        }
    } else {
        tiles.forEach(tile => tile.classList.remove('is-front'));
        dataPlate.hidden = true;
    }
}
