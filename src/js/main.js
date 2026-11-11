import './interactions.js';
import { initMotion } from './motion.js';
import { initScene } from './scene.js';
import { initTheme } from './theme.js';
import { initVideoTimeline } from './timeline.js';
import { initCertificateLedger } from './certificates.js';
import { initPosterBento } from './posters.js';
import { initRepositories } from './repositories.js';
import { initScroll } from './scroll.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

initTheme();
initScroll();
initScene();
initCertificateLedger();
initRepositories();
initMotion();
initVideoTimeline();
initPosterBento();

const refreshScrollTriggers = () => {
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
};

window.addEventListener('load', refreshScrollTriggers, { once: true });
document.fonts?.ready.then(refreshScrollTriggers);
window.setTimeout(refreshScrollTriggers, 250);

const refreshAfterMediaChange = event => {
    if (event.target instanceof HTMLImageElement || event.target instanceof HTMLVideoElement) {
        refreshScrollTriggers();
    }
};

document.addEventListener('load', refreshAfterMediaChange, true);
document.addEventListener('loadedmetadata', refreshAfterMediaChange, true);
document.addEventListener('error', refreshAfterMediaChange, true);
