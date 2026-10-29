import * as THREE from 'three';

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
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
    camera.position.z = 7;

    const sculpture = new THREE.Group();
    scene.add(sculpture);
    sculpture.position.set(2.15, 0.3, 0);
    sculpture.scale.setScalar(0.68);

    const outer = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.15, 2),
        new THREE.MeshBasicMaterial({
            color: 0x887459,
            wireframe: true,
            transparent: true,
            opacity: 0.09
        })
    );
    const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 1),
        new THREE.MeshBasicMaterial({
            color: 0x718496,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        })
    );
    inner.rotation.set(0.35, 0.6, 0.2);
    sculpture.add(outer, inner);

    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scrollProgress = 0;
    let frameId = 0;

    const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.position.x = width < 720 ? 1.25 : 1.7;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    };

    const updateTheme = () => {
        const styles = getComputedStyle(document.documentElement);
        outer.material.color.set(styles.getPropertyValue('--accent-color').trim());
        inner.material.color.set(styles.getPropertyValue('--accent-cool').trim());
        renderer.render(scene, camera);
    };

    const renderFrame = () => {
        pointer.lerp(targetPointer, 0.035);
        sculpture.rotation.x += (pointer.y * 0.12 - sculpture.rotation.x) * 0.025;
        sculpture.rotation.y += (pointer.x * 0.16 + scrollProgress * 0.3 - sculpture.rotation.y) * 0.025;
        sculpture.position.y = 0.3 + pointer.y * 0.08 - scrollProgress * 0.18;
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(renderFrame);
    };

    if (!reducedMotion) {
        window.addEventListener('pointermove', event => {
            if (event.pointerType !== 'mouse') return;
            targetPointer.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                1 - (event.clientY / window.innerHeight) * 2
            );
        }, { passive: true });
        window.addEventListener('scroll', () => {
            scrollProgress = window.scrollY /
                Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        }, { passive: true });
        frameId = window.requestAnimationFrame(renderFrame);
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('portfolio:theme-change', updateTheme);
    window.addEventListener('pagehide', () => {
        window.cancelAnimationFrame(frameId);
        renderer.dispose();
        outer.geometry.dispose();
        inner.geometry.dispose();
        outer.material.dispose();
        inner.material.dispose();
    }, { once: true });

    resize();
    updateTheme();
}
