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

    const orb = new THREE.Group();
    scene.add(orb);
    const sculpture = new THREE.Group();
    orb.add(sculpture);
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
    let frameId = 0;
    let scrollTween;

    const viewHalfWidth = () =>
        camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;

    const viewportWorld = () => ({
        width: viewHalfWidth() * 2,
        height: 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    });

    const renderFrame = () => {
        pointer.lerp(targetPointer, 0.035);
        sculpture.rotation.x += (pointer.y * 0.12 - sculpture.rotation.x) * 0.025;
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
        ScrollTrigger.refresh();
        if (reducedMotion) renderStill();
    };

    const updateTheme = (animate = true) => {
        const styles = getComputedStyle(document.documentElement);
        const primary = new THREE.Color(styles.getPropertyValue('--orb-primary').trim());
        const secondary = new THREE.Color(styles.getPropertyValue('--orb-secondary').trim());
        if (animate && !reducedMotion) {
            gsap.to(outer.material.color, {
                r: primary.r, g: primary.g, b: primary.b,
                duration: 0.5,
                onUpdate: renderStill
            });
            gsap.to(inner.material.color, {
                r: secondary.r, g: secondary.g, b: secondary.b,
                duration: 0.5,
                onUpdate: renderStill
            });
        } else {
            outer.material.color.copy(primary);
            inner.material.color.copy(secondary);
        }
        if (reducedMotion) renderStill();
    };

    if (!reducedMotion) {
        // Keyframes carry the oversized sphere along a diagonal path as the document scrolls.
        const spherePath = gsap.timeline({
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: () => `+=${ScrollTrigger.maxScroll(window)}`,
                scrub: true,
                invalidateOnRefresh: true
            }
        });
        const point = (xViewport, yViewport) => ({
            x: () => xViewport * viewportWorld().width,
            y: () => -yViewport * viewportWorld().height
        });
        spherePath
            .set(orb.position, point(0.3, -0.1), 0)
            .to(orb.position, { ...point(-0.4, 0.3), duration: 0.25, ease: 'none' }, 0)
            .to(orb.position, { ...point(0.4, 0.6), duration: 0.25, ease: 'none' }, 0.25)
            .to(orb.position, { ...point(0, 0.8), duration: 0.25, ease: 'none' }, 0.5)
            .to(orb.position, { ...point(-0.3, 1.1), duration: 0.25, ease: 'none' }, 0.75);
        spherePath.to(sculpture.scale, {
            x: 2.5, y: 2.5, z: 2.5,
            duration: 0.25,
            ease: 'none'
        }, 0.5).to(sculpture.scale, {
            x: 1.8, y: 1.8, z: 1.8,
            duration: 0.25,
            ease: 'none'
        }, 0.75);
        scrollTween = spherePath.scrollTrigger;

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
        scrollTween?.kill();
        renderer.dispose();
        outer.geometry.dispose();
        inner.geometry.dispose();
        outer.material.dispose();
        inner.material.dispose();
    }, { once: true });

    resize();
    updateTheme(false);
}
