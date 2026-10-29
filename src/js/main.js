import './interactions.js';
import { initMotion } from './motion.js';
import { initScene } from './scene.js';
import { initTheme } from './theme.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

initTheme();
initMotion();
initScene();

const refreshScrollTriggers = () => {
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
};

window.addEventListener('load', refreshScrollTriggers, { once: true });
document.fonts?.ready.then(refreshScrollTriggers);
window.setTimeout(refreshScrollTriggers, 250);
