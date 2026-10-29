import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScene() {
    if (!window.WebGLRenderingContext) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'story-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    // The canvas sits behind page content and stays decorative for assistive technology.
    document.body.prepend(canvas);

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (error) {
        canvas.remove();
        console.warn('The decorative 3D canvas is unavailable in this browser.', error);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camera.position.z = 9;

    const sculpture = new THREE.Group();
    scene.add(sculpture);
    sculpture.scale.setScalar(1.45);

    const outer = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.15, 2),
        new THREE.MeshBasicMaterial({
            color: 0x887459,
            wireframe: true,
            transparent: true,
            opacity: 0.16
        })
    );
    const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 1),
        new THREE.MeshBasicMaterial({
            color: 0x718496,
            wireframe: true,
            transparent: true,
            opacity: 0.12
        })
    );
    inner.rotation.set(0.35, 0.6, 0.2);
    sculpture.add(outer, inner);

    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollPosition = { progress: 0 };
    let frameId = 0;
    let scrollTween;

    const viewHalfWidth = () =>
        camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;

    const positionSphere = () => {
        sculpture.position.x = viewHalfWidth() * (1 - scrollPosition.progress * 2);
    };

    const renderFrame = () => {
        pointer.lerp(targetPointer, 0.035);
        sculpture.rotation.x += (pointer.y * 0.12 - sculpture.rotation.x) * 0.025;
        sculpture.position.y = 0.25 + pointer.y * 0.1;
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(renderFrame);
    };

    const renderStill = () => renderer.render(scene, camera);

    const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        positionSphere();
        ScrollTrigger.refresh();
        if (reducedMotion) renderStill();
    };

    const updateTheme = () => {
        const styles = getComputedStyle(document.documentElement);
        outer.material.color.set(styles.getPropertyValue('--accent-color').trim());
        inner.material.color.set(styles.getPropertyValue('--accent-cool').trim());
        if (reducedMotion) renderStill();
    };

    if (!reducedMotion) {
        // A scrubbed progress value moves the oversized sphere from edge to edge with the story.
        scrollTween = gsap.to(scrollPosition, {
            progress: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: () => `+=${ScrollTrigger.maxScroll(window)}`,
                scrub: true,
                onUpdate: positionSphere,
                onRefresh: positionSphere
            }
        });

        // Full rotations return to the same pose, keeping the wireframe turning without a visible reset.
        gsap.to(sculpture.rotation, {
            y: Math.PI * 2,
            z: Math.PI * 2,
            duration: 100,
            ease: 'none',
            repeat: -1,
            onUpdate: renderStill
        });

        window.addEventListener('pointermove', event => {
            if (event.pointerType !== 'mouse') return;
            targetPointer.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                1 - (event.clientY / window.innerHeight) * 2
            );
        }, { passive: true });
        frameId = window.requestAnimationFrame(renderFrame);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('portfolio:theme-change', updateTheme);
    window.addEventListener('pagehide', () => {
        window.cancelAnimationFrame(frameId);
        scrollTween?.scrollTrigger?.kill();
        renderer.dispose();
        outer.geometry.dispose();
        inner.geometry.dispose();
        outer.material.dispose();
        inner.material.dispose();
    }, { once: true });

    resize();
    updateTheme();
}
