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
    const radarPing = document.createElement('div');
    radarPing.className = 'orb-radar-ping';
    radarPing.setAttribute('aria-hidden', 'true');
    document.body.append(radarPing);

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
            color: 0x0f172a,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        })
    );
    const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 1),
        new THREE.MeshBasicMaterial({
            color: 0x334155,
            wireframe: true,
            transparent: true,
            opacity: 0.34
        })
    );
    inner.rotation.set(0.35, 0.6, 0.2);
    sculpture.add(outer, inner);

    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = 0;
    let rendering = false;
    let scrollTween;
    let rotationTween;

    const viewHalfWidth = () =>
        camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;

    const viewportWorld = () => ({
        width: viewHalfWidth() * 2,
        height: 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    });

    const renderFrame = () => {
        frameId = 0;
        if (!rendering || document.hidden) return;
        pointer.lerp(targetPointer, 0.035);
        sculpture.rotation.x += (pointer.y * 0.12 - sculpture.rotation.x) * 0.025;
        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(renderFrame);
    };

    const renderStill = () => {
        if (!document.hidden) renderer.render(scene, camera);
    };

    const startRendering = () => {
        if (reducedMotion || document.hidden || rendering) return;
        rendering = true;
        rotationTween?.resume();
        frameId = window.requestAnimationFrame(renderFrame);
    };

    const stopRendering = () => {
        rendering = false;
        window.cancelAnimationFrame(frameId);
        frameId = 0;
        rotationTween?.pause();
    };

    const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        if (reducedMotion) renderStill();
    };

    const updateTheme = (animate = true) => {
        const styles = getComputedStyle(document.documentElement);
        const primary = new THREE.Color(styles.getPropertyValue('--orb-primary').trim());
        const secondary = new THREE.Color(styles.getPropertyValue('--orb-secondary').trim());
        const primaryOpacity = Number.parseFloat(styles.getPropertyValue('--orb-primary-opacity'));
        const secondaryOpacity = Number.parseFloat(styles.getPropertyValue('--orb-secondary-opacity'));
        if (animate && !reducedMotion) {
            gsap.to(outer.material.color, {
                r: primary.r, g: primary.g, b: primary.b,
                duration: 0.5
            });
            gsap.to(outer.material, {
                opacity: primaryOpacity,
                duration: 0.5
            });
            gsap.to(inner.material.color, {
                r: secondary.r, g: secondary.g, b: secondary.b,
                duration: 0.5
            });
            gsap.to(inner.material, {
                opacity: secondaryOpacity,
                duration: 0.5
            });
        } else {
            outer.material.color.copy(primary);
            inner.material.color.copy(secondary);
            outer.material.opacity = primaryOpacity;
            inner.material.opacity = secondaryOpacity;
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
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
        const point = (xViewport, yViewport) => ({
            x: () => xViewport * viewportWorld().width,
            y: () => -yViewport * viewportWorld().height
        });
        spherePath
            .set(orb.position, point(0.12, -0.04), 0)
            .to(orb.position, { ...point(-0.15, 0.12), duration: 0.25, ease: 'none' }, 0)
            .to(orb.position, { ...point(0.15, 0.25), duration: 0.25, ease: 'none' }, 0.25)
            .to(orb.position, { ...point(0, 0.38), duration: 0.25, ease: 'none' }, 0.5)
            .to(orb.position, { ...point(-0.12, 0.48), duration: 0.25, ease: 'none' }, 0.75);
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
        rotationTween = gsap.to(sculpture.rotation, {
            y: Math.PI * 2,
            z: Math.PI * 2,
            duration: 100,
            ease: 'none',
            repeat: -1
        });

        window.addEventListener('pointermove', event => {
            if (event.pointerType !== 'mouse') return;
            targetPointer.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                1 - (event.clientY / window.innerHeight) * 2
            );
        }, { passive: true });
    }

    const handleVisibilityChange = () => {
        if (document.hidden) {
            stopRendering();
        } else if (reducedMotion) {
            renderStill();
        } else {
            startRendering();
        }
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('portfolio:theme-change', () => updateTheme());
    window.addEventListener('portfolio:hero-reveal', () => {
        if (reducedMotion) return;
        gsap.fromTo(sculpture.scale, {
            x: 1.78, y: 1.78, z: 1.78
        }, {
            x: 1.45, y: 1.45, z: 1.45,
            duration: 1.15,
            ease: 'power3.out'
        });
    }, { once: true });
    window.addEventListener('portfolio:section-change', event => {
        const section = event.detail?.id || 'home';
        const styles = getComputedStyle(document.documentElement);
        const base = new THREE.Color(styles.getPropertyValue('--orb-primary').trim());
        const accent = new THREE.Color(styles.getPropertyValue('--accent-color').trim());
        const choreography = {
            home: { scale: 1.02, speed: 0.9 },
            about: { scale: 0.96, speed: 0.76 },
            experience: { scale: 1, speed: 0.88 },
            certifications: { scale: 1.04, speed: 0.82 },
            'github-projects': { scale: 0.98, speed: 0.94 },
            posters: { scale: 1.08, speed: 1.12 },
            videos: { scale: 1.05, speed: 1.08 },
            contact: { scale: 0.97, speed: 0.74 }
        };
        const sectionMotion = choreography[section] || choreography.home;
        const isVisualSection = ['posters', 'videos'].includes(section);
        const target = isVisualSection ? accent : base;
        if (reducedMotion) {
            renderStill();
            return;
        }
        if (document.hidden) {
            outer.material.color.copy(target);
            orb.scale.setScalar(sectionMotion.scale);
            return;
        }
        gsap.killTweensOf(outer.material.color);
        gsap.killTweensOf(orb.scale);
        gsap.to(outer.material.color, {
            r: target.r, g: target.g, b: target.b,
            duration: 0.7
        });
        gsap.to(orb.scale, {
            x: sectionMotion.scale,
            y: sectionMotion.scale,
            z: sectionMotion.scale,
            duration: 0.7,
            ease: 'power2.out'
        });
        gsap.to(rotationTween, {
            timeScale: sectionMotion.speed,
            duration: 0.7
        });
        gsap.fromTo(radarPing, {
            scale: 0.24,
            opacity: 0.34
        }, {
            scale: 1.55,
            opacity: 0,
            duration: 0.85,
            ease: 'power2.out',
            overwrite: true
        });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', () => {
        stopRendering();
        scrollTween?.kill();
        rotationTween?.kill();
        renderer.dispose();
        radarPing.remove();
        outer.geometry.dispose();
        inner.geometry.dispose();
        outer.material.dispose();
        inner.material.dispose();
    }, { once: true });

    resize();
    updateTheme(false);
    startRendering();
}
