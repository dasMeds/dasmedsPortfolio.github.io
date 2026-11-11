import { Flip } from 'gsap/Flip';
import { gsap } from 'gsap';

gsap.registerPlugin(Flip);

document.addEventListener('DOMContentLoaded', () => {

    /* pop-up window logic */

    const modal = document.getElementById('poster-modal'); 
    
    if (modal) {
        // ui element references
        let modalImg = document.getElementById('modal-img');
        const modalImageContainer = modal.querySelector('.modal-image-container');
        const modalImagePlaceholder = modalImg;
        const modalImgBg = document.getElementById('modal-img-bg'); 
        const modalTitle = document.getElementById('modal-title'); 
        const modalDesc = document.getElementById('modal-desc');  
        const closeModalBtn = document.querySelector('.close-modal'); 
        const modalBackdrop = document.querySelector('.modal-backdrop');  
        const posterCards = document.querySelectorAll('.poster-card');
        const previousButton = modal.querySelector('.modal-previous');
        const nextButton = modal.querySelector('.modal-next');
        const specLabelOne = document.getElementById('modal-spec-label-one');
        const specValueOne = document.getElementById('modal-spec-value-one');
        const specLabelTwo = document.getElementById('modal-spec-label-two');
        const specValueTwo = document.getElementById('modal-spec-value-two');
        const modalSerial = document.getElementById('modal-serial');
        const modalEditionTitle = document.getElementById('modal-edition-title');
        let lastFocusedItem;
        let galleryItems = [];
        let activeGalleryIndex = -1;
        let bodyOverflowBeforeModal = '';
        let sharedPosterImage;
        let sharedPosterParent;
        let sharedPosterNextSibling;

        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');

        const posterDescriptions = {
            "F-2 Viper Zero": `A precision-timed, highly detailed cinematic edit focusing on the Mitsubishi F-2 multirole fighter. The sequence highlights its striking aerodynamic design, advanced maneuverability, and versatile maritime strike capabilities in contested skies.\n\nREAL-LIFE CONTEXT:\nThe Mitsubishi F-2, commonly referred to as the "Viper Zero," is a 4.5-generation multirole fighter co-developed by Mitsubishi Heavy Industries and Lockheed Martin for the Japan Air Self-Defense Force (JASDF). Based heavily on the F-16 Fighting Falcon, the F-2 features a 25% larger wing area made from advanced radar-absorbing composite materials, allowing for a heavier payload of anti-ship missiles. Notably, it was the first operational military aircraft in the world to be equipped with an Active Electronically Scanned Array (AESA) radar system.\n\nREFERENCE:\nJapan Air Self-Defense Force. (n.d.). Equipment: F-2 close-up. Ministry of Defense. Retrieved March 11, 2026, from https://www.mod.go.jp/asdf/english/equipment/`,

            "F-2 Viper Zero Grounded": `An atmospheric, tension-building sequence showcasing the F-2 Viper Zero during its pre-flight operations. The edit captures the meticulous ground preparation, complex mechanical checks, and the heavy armament loading required before a high-stakes tactical deployment.\n\nREAL-LIFE CONTEXT:\nGround operations for the F-2 are critical to the JASDF's rapid response capabilities. Squadrons are frequently kept on high alert, requiring ground crews to transition the aircraft from a cold state to a combat-ready launch in under five minutes. Preparations involve comprehensive avionics system checks and the careful loading of heavy ordnance, including ASM-2 anti-ship missiles and AAM-series air-to-air missiles, testing the load-bearing capabilities of its reinforced composite wings.\n\nREFERENCE:\nGrevatt, J., & MacDonald, A. (2020). JASDF fighter fleet readiness and modernization. Jane's Defence Weekly.`,

            "F-15J Peace Eagle": `A high-energy, adrenaline-fueled edit highlighting the sheer thrust and absolute dominance of the McDonnell Douglas F-15J. The sequence emphasizes its aggressive climb rates, kinetic energy, and its role as Japan's premier twin-engine air superiority interceptor.\n\nREAL-LIFE CONTEXT:\nThe F-15J "Peace Eagle" is a twin-engine, all-weather air superiority fighter produced under license by Mitsubishi Heavy Industries for the JASDF, based on the American F-15C. While the airframe is nearly identical to its American counterpart, the F-15J is equipped with highly classified, indigenous Japanese avionics, including the J/TEWS electronic warfare system. It serves as Japan's primary interceptor, continually modernized to carry advanced domestic missiles like the AAM-4 and AAM-5.\n\nREFERENCE:\nBoeing. (n.d.). F-15 Eagle. Retrieved March 11, 2026, from https://www.boeing.com/defense/f-15`,

            "Above You Behind You": `A fast-paced, tactical perspective edit that throws the viewer right into the merge. This sequence showcases the complex geometry, crucial positional advantage, and raw, high-G adrenaline of close-quarters aerial dogfighting.\n\nREAL-LIFE CONTEXT:\nThe phrase "above you, behind you" perfectly encapsulates the ultimate goal of offensive Basic Fighter Maneuvers (BFM). In air combat, maintaining an altitude advantage grants superior kinetic energy, while maneuvering into an adversary's "six o'clock" blind spot places the attacker safely inside their weapons envelope. This dominant positioning, known as the "Control Zone," allows the attacking pilot to dictate the flow of the engagement and secure a kill shot while minimizing the defender's evasive options.\n\nREFERENCE:\nShaw, R. L. (1985). Fighter combat: Tactics and maneuvering. Naval Institute Press.`,

            "M1A1 Abrams": `A heavy, rhythm-driven cinematic sequence focusing on the impenetrable composite armor, immense physical presence, and devastating kinetic firepower of the legendary M1A1 Abrams main battle tank operating in hostile environments.\n\nREAL-LIFE CONTEXT:\nThe M1A1 Abrams is a third-generation American main battle tank renowned for its battlefield survivability and lethal firepower. Introduced in the 1980s, the M1A1 variant replaced the original 105mm gun with a German-designed Rheinmetall 120mm M256 smoothbore cannon, capable of firing depleted uranium armor-piercing rounds. Powered by a 1,500-horsepower gas turbine engine and protected by classified Chobham composite armor, the Abrams remains a highly mobile and formidable force in modern armored warfare.\n\nREFERENCE:\nHunnicutt, R. P. (1990). Abrams: A history of the American main battle tank. Presidio Press.`,

            "SU-33 Flanker D": `A highly dynamic, visually striking edit of the Sukhoi Su-33, capturing the unique carrier-based takeoff operations, extreme post-stall maneuverability, and raw aerodynamic power of this all-weather Russian naval fighter.\n\nREAL-LIFE CONTEXT:\nThe Sukhoi Su-33 (NATO reporting name: "Flanker-D") is a twin-engine, all-weather air superiority fighter designed specifically for aircraft carrier operations. Derived from the Su-27, it features several naval modifications, including folding wings, a reinforced undercarriage, an arresting hook, and distinctive canards (small forewings) that increase lift and maneuverability. The Su-33 launches via a STOBAR (Short Take-Off But Arrested Recovery) system, using a ski-jump ramp on the carrier deck rather than steam catapults.\n\nREFERENCE:\nGordon, Y., & Komissarov, D. (2021). Sukhoi Su-27 & 30/33/34/35: Famous Russian aircraft. Crecy Publishing.`,
        
            "Chicco Promotional Poster": `A sophisticated, high-contrast promotional poster created for a Multimedia project. The design reimagines "Chicco" as a premium Espresso Bar, utilizing bold slab-serif typography and warm lighting to evoke a sense of heritage and the "Classic Italian Taste."\n\nPROJECT CONTEXT:\nThis piece was developed to showcase branding versatility within a multimedia framework. It focuses on lifestyle marketing, emphasizing "Morning Rituals" and "Local Culture." The layout balances a large, cinematic product shot with clean editorial-style text blocks to create a professional, magazine-inspired aesthetic.\n\nREFERENCE:\nMultimedia Design Project. (2026). Branding & Promotional Layouts: Espresso Bar Concept.`,

            "Masterpiece Sportswear Design Board": `A dynamic, multi-asset design board created to establish a cohesive brand identity for Masterpiece Sportswear. The layout utilizes aggressive sans-serif typography and a strictly monochromatic palette to convey the brand’s "Move Powerful, Play Proud" philosophy through a professional, high-performance lens.\n\nPROJECT CONTEXT:\nThis project serves as a comprehensive exploration of visual strategy in athletic branding. It integrates product renderings, social media posts UI concepts, and logo variations to demonstrate a scalable design ecosystem. The board emphasizes technical precision, highlighting moisture-wicking textures and ergonomic tailoring through a clean, grid-based presentation.\n\nREFERENCE:\nGraphic Design & Branding Project. (2026). Visual Identity Systems: Masterpiece Sportswear.`
            };

        const restoreSharedPosterImage = animate => {
            if (!sharedPosterImage || !sharedPosterParent) return;
            const state = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? Flip.getState(sharedPosterImage)
                : null;
            sharedPosterImage.removeAttribute('id');
            sharedPosterImage.classList.remove('modal-shared-image');
            const nextSibling = sharedPosterNextSibling?.parentNode === sharedPosterParent
                ? sharedPosterNextSibling
                : null;
            sharedPosterParent.insertBefore(sharedPosterImage, nextSibling);
            modalImagePlaceholder.id = 'modal-img';
            modalImagePlaceholder.hidden = false;
            modalImg = modalImagePlaceholder;
            sharedPosterImage = undefined;
            sharedPosterParent = undefined;
            sharedPosterNextSibling = undefined;
            if (state) {
                Flip.from(state, {
                    duration: 0.48,
                    ease: 'power2.inOut',
                    absolute: true,
                    scale: true
                });
            }
        };

        const openGalleryItem = (card, focusClose = false) => {
            const image = card.querySelector('img');
            const imageSource = card.dataset.image || image?.currentSrc || image?.src;
            const title = card.dataset.title || image?.alt || 'Portfolio item';
            const isCertificate = card.matches('.cert-row, .cert-sticker');
            if (!imageSource) {
                console.error('Gallery item is missing its image.', card);
                return;
            }
            if (sharedPosterImage && sharedPosterImage !== image) restoreSharedPosterImage(false);

            galleryItems = [...document.querySelectorAll(
                isCertificate
                    ? (card.matches('.cert-sticker') ? '.cert-sticker' : '.cert-row:not([hidden])')
                    : '.poster-card'
            )];
            activeGalleryIndex = galleryItems.indexOf(card);
            modalImgBg.src = imageSource;
            if (!isCertificate && image) {
                const state = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? Flip.getState(image)
                    : null;
                sharedPosterImage = image;
                sharedPosterParent = image.parentNode;
                sharedPosterNextSibling = image.nextSibling;
                modalImagePlaceholder.removeAttribute('id');
                modalImagePlaceholder.hidden = true;
                image.id = 'modal-img';
                image.classList.add('modal-shared-image');
                modalImageContainer.append(image);
                modalImg = image;
                if (state) {
                    Flip.from(state, {
                        duration: 0.58,
                        ease: 'power2.inOut',
                        absolute: true,
                        scale: true
                    });
                }
            } else {
                modalImg.src = imageSource;
                modalImg.alt = card.dataset.imageAlt || image?.alt || title;
                modalImg.width = Number(card.dataset.imageWidth) || image?.naturalWidth || 1200;
                modalImg.height = Number(card.dataset.imageHeight) || image?.naturalHeight || 800;
            }
            modalTitle.textContent = title;
            modal.classList.toggle('is-certificate', isCertificate);
            if (modalEditionTitle) modalEditionTitle.textContent = isCertificate ? '' : title;
            if (modalSerial) {
                modalSerial.hidden = isCertificate;
                modalSerial.textContent = isCertificate
                    ? ''
                    : `POSTER ${String(activeGalleryIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
            }
            modalDesc.textContent = card.dataset.description ||
                (isCertificate
                    ? `${card.dataset.issuer || ''}${card.dataset.date ? ` · ${card.dataset.date}` : ''}`
                    : posterDescriptions[title] || 'A high-quality edit.');
            specLabelOne.textContent = isCertificate ? 'ISSUER' : 'TOOLS';
            specValueOne.textContent = isCertificate
                ? card.dataset.issuer || 'Not listed'
                : card.dataset.tools || 'Details supplied by owner';
            specLabelTwo.textContent = isCertificate ? 'ISSUED' : 'INTENT';
            specValueTwo.textContent = isCertificate
                ? card.dataset.date || 'Not listed'
                : card.dataset.intent || 'Details supplied by owner';
            if (!modal.classList.contains('active')) {
                bodyOverflowBeforeModal = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
                document.dispatchEvent(new CustomEvent('portfolio:scroll-lock', {
                    detail: { locked: true }
                }));
            }
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('aria-modal', 'true');
            lastFocusedItem = card;
            if (focusClose) closeModalBtn.focus();
        };

        const stepGallery = direction => {
            if (!galleryItems.length) return;
            const nextIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
            openGalleryItem(galleryItems[nextIndex]);
        };

        posterCards.forEach(card => {
            card.addEventListener('click', () => openGalleryItem(card, true));
        });

        document.addEventListener('portfolio:open-lightbox', event => {
            if (event.detail?.card) openGalleryItem(event.detail.card, true);
        });

        const closeModal = () => {
            modal.classList.remove('active');
            modal.classList.remove('is-certificate');
            if (modalSerial) modalSerial.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
            modal.setAttribute('aria-modal', 'false');
            document.body.style.overflow = bodyOverflowBeforeModal;
            document.dispatchEvent(new CustomEvent('portfolio:scroll-lock', {
                detail: { locked: false }
            }));
            restoreSharedPosterImage(true);
            lastFocusedItem?.focus({ preventScroll: true });
        };

        closeModalBtn.addEventListener('click', closeModal);
        previousButton.addEventListener('click', () => stepGallery(-1));
        nextButton.addEventListener('click', () => stepGallery(1));
        modalBackdrop.addEventListener('click', closeModal);
        document.addEventListener('keydown', event => {
            if (!modal.classList.contains('active')) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                closeModal();
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                stepGallery(-1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                stepGallery(1);
            } else if (event.key === 'Tab') {
                const focusable = [...modal.querySelectorAll('button:not(:disabled), a[href]:not([hidden])')];
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    }

    /*  moving slider logic */
    // auto-scrolling track loops.
    const sliderContainer = document.querySelector('.slider-container');
    
    if (sliderContainer) {
        const wrapper = document.querySelector('.marquee-wrapper'); 
        const track = document.querySelector('.marquee-track'); 
        const leftArrow = document.querySelector('.left-arrow'); 
        const rightArrow = document.querySelector('.right-arrow'); 

        const scrollAmount = 332; 

        leftArrow.addEventListener('click', () => {
            if (wrapper.scrollLeft <= 0) {
                wrapper.scrollLeft = track.scrollWidth / 2;
            }
            wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => { 
            if (wrapper.scrollLeft >= track.scrollWidth / 2) {
                wrapper.scrollLeft = 0;
            }
            wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    /* videos showcase */
    // hover-to-play and intelligent pausing.
    const videoCards = document.querySelectorAll('.video-card');
    
    if (videoCards.length > 0) {
        const videos = document.querySelectorAll('.video-card video');

        videos.forEach(video => {
            video.muted = true;
            video.playsInline = true;

            // if one video plays, pause all others
            video.addEventListener('play', () => {
                videos.forEach(otherVideo => {
                    if (otherVideo !== video) {
                        otherVideo.pause();
                    }
                });
            });

            // unmute automatically when entered fullscreen
            const handleFullscreen = () => {
                if (document.fullscreenElement === video || document.webkitFullscreenElement === video) {
                    video.muted = false;
                }
            };
            video.addEventListener('fullscreenchange', handleFullscreen);
            video.addEventListener('webkitfullscreenchange', handleFullscreen); 
        });

    }

    /* contact form logic */
    // Using the class name instead of an ID just to be safe
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async event => {
            event.preventDefault();
            const submitButton = contactForm.querySelector('[type="submit"]');
            submitButton.disabled = true;

            try {
                const formData = Object.fromEntries(new FormData(contactForm));
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'The message could not be sent.');
                }

                alert('Thanks! Your message has been sent.');
                contactForm.reset();
            } catch (error) {
                console.error('Contact form submission failed.', error);
                alert(error.message || 'Oops! There was a problem sending your message.');
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    const waveform = contactForm?.querySelector('.waveform-bars');
    const waveformBars = waveform ? Array.from(waveform.querySelectorAll('i')) : [];
    if (waveformBars.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        contactForm.addEventListener('input', event => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
            const value = target.value;
            waveformBars.forEach((bar, index) => {
                const sample = value.charCodeAt((index * 7) % Math.max(value.length, 1)) || 0;
                const wave = value.length ? 0.18 + ((sample + index * 19) % 83) / 100 : 0.18;
                gsap.to(bar, {
                    scaleY: wave,
                    opacity: value.length ? 0.42 + wave * 0.55 : 0.35,
                    duration: 0.18,
                    overwrite: true
                });
            });
        });
    }

});

/* mobile logic */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinksContainer.addEventListener('click', event => {
            if (event.target.closest('a')) {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.btn-solid, .btn-outline').forEach(button => {
            button.addEventListener('pointermove', event => {
                if (event.pointerType !== 'mouse') return;
                const bounds = button.getBoundingClientRect();
                const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.08;
                const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.08;
                button.style.setProperty('--mag-x', `${offsetX.toFixed(1)}px`);
                button.style.setProperty('--mag-y', `${offsetY.toFixed(1)}px`);
            });

            button.addEventListener('pointerleave', () => {
                button.style.setProperty('--mag-x', '0px');
                button.style.setProperty('--mag-y', '0px');
            });
        });
    }

    const aboutSection = document.querySelector('#about');
    const aboutGrid = aboutSection?.querySelector('.about-grid');
    const stackGrid = aboutSection?.querySelector('.stack-grid');
    if (aboutGrid && stackGrid) {
        const dossier = document.createElement('div');
        dossier.className = 'pilot-dossier';
        const dossierInner = document.createElement('div');
        dossierInner.className = 'pilot-dossier-inner';
        const profileFace = document.createElement('div');
        profileFace.className = 'dossier-face dossier-profile';
        const stackFace = document.createElement('div');
        stackFace.className = 'dossier-face dossier-stack';
        const flipButton = document.createElement('button');
        flipButton.className = 'dossier-toggle';
        flipButton.type = 'button';
        flipButton.textContent = 'View stack loadout';
        flipButton.setAttribute('aria-pressed', 'false');
        flipButton.setAttribute('aria-label', 'Show technical stack');

        aboutGrid.before(dossier);
        dossier.append(dossierInner, flipButton);
        dossierInner.append(profileFace, stackFace);
        profileFace.append(aboutGrid);
        stackFace.append(stackGrid);

        const setFlipped = flipped => {
            dossier.classList.toggle('is-flipped', flipped);
            flipButton.setAttribute('aria-pressed', String(flipped));
            flipButton.textContent = flipped ? 'Return to pilot ID' : 'View stack loadout';
            flipButton.setAttribute('aria-label', flipped ? 'Show pilot profile' : 'Show technical stack');
            profileFace.setAttribute('aria-hidden', String(flipped));
            stackFace.setAttribute('aria-hidden', String(!flipped));
            profileFace.inert = flipped;
            stackFace.inert = !flipped;
        };
        setFlipped(false);
        flipButton.addEventListener('click', () => {
            setFlipped(flipButton.getAttribute('aria-pressed') !== 'true');
        });
    }

    if (document.querySelector('.scroll-guide')) {
        document.body.classList.add('has-scroll-guide');
    }

    if (document.body.classList.contains('continuous-portfolio') && 'IntersectionObserver' in window) {
        let activeSectionId = '';
        const sectionObserver = new IntersectionObserver(entries => {
            const activeEntry = entries
                .filter(entry => entry.isIntersecting)
                .sort((left, right) => {
                    const marker = window.innerHeight * 0.4;
                    return Math.abs(left.boundingClientRect.top - marker) -
                        Math.abs(right.boundingClientRect.top - marker);
                })[0];

            if (!activeEntry || !activeEntry.target.id) return;
            const sectionId = activeEntry.target.id;
            if (sectionId !== activeSectionId) {
                activeSectionId = sectionId;
                window.dispatchEvent(new CustomEvent('portfolio:section-change', {
                    detail: { id: sectionId }
                }));
            }
            const nextHash = `#${sectionId}`;
            if (window.location.hash !== nextHash) {
                window.history.replaceState(
                    window.history.state,
                    '',
                    `${window.location.pathname}${window.location.search}${nextHash}`
                );
            }
        }, { threshold: 0, rootMargin: '-40% 0px -59% 0px' });

        document.querySelectorAll('.continuous-sections section[id], #home').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    const loaderKey = 'dasmeds-portfolio-loader-seen';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let showLoader = !reducedMotion;
    try {
        showLoader = showLoader && window.sessionStorage.getItem(loaderKey) !== 'true';
        if (showLoader) window.sessionStorage.setItem(loaderKey, 'true');
    } catch (error) {
        console.warn('Pre-loader session state could not be saved; this visit will still continue.', error);
    }

    if (showLoader) {
        const loader = document.createElement('div');
        loader.id = 'preloader';
        loader.className = 'site-loader loader-orb';
        loader.setAttribute('role', 'status');
        loader.setAttribute('aria-label', 'Loading portfolio systems');
        loader.innerHTML = `
            <div class="loader-stage">
                <svg class="loader-globe" viewBox="0 0 240 240" aria-hidden="true">
                    <circle class="loader-globe-line" cx="120" cy="120" r="92" pathLength="100"/>
                    <ellipse class="loader-globe-line" cx="120" cy="120" rx="43" ry="92" pathLength="100"/>
                    <ellipse class="loader-globe-line" cx="120" cy="120" rx="72" ry="92" pathLength="100"/>
                    <path class="loader-globe-line" d="M32 120h176M43 82h154M43 158h154" pathLength="100"/>
                    <path class="loader-globe-line" d="M120 28v184" pathLength="100"/>
                    <path class="loader-globe-line" d="m55 55 130 130m0-130L55 185" pathLength="100"/>
                    <circle class="loader-globe-center" cx="120" cy="120" r="4"/>
                </svg>
                <div class="loader-console">
                    <p class="loader-caption">PKM / FLIGHT SYSTEMS</p>
                    <p class="loader-progress" aria-hidden="true"><span id="loader-percent">000</span><span class="loader-percent-unit">%</span></p>
                    <ol class="loader-checks" aria-hidden="true">
                        <li><span class="loader-check-code">01</span><span>NAV / POSITION FIX</span><svg class="loader-check" viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg></li>
                        <li><span class="loader-check-code">02</span><span>GFX / ORB ONLINE</span><svg class="loader-check" viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg></li>
                        <li><span class="loader-check-code">03</span><span>LINK / CHANNEL CLEAR</span><svg class="loader-check" viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7"/></svg></li>
                    </ol>
                </div>
                <span class="loader-coordinate" aria-hidden="true">14° 40′ N / 120° 58′ E</span>
            </div>`;
        document.body.prepend(loader);

        const loaderPercent = loader.querySelector('#loader-percent');
        const globeLines = loader.querySelectorAll('.loader-globe-line');
        const checks = loader.querySelectorAll('.loader-checks li');
        const checkPaths = loader.querySelectorAll('.loader-check path');
        const counter = { value: 0 };
        gsap.set(globeLines, { strokeDasharray: 100, strokeDashoffset: 100 });
        gsap.set(checks, { y: 6, autoAlpha: 0 });
        gsap.set(checkPaths, { strokeDasharray: 24, strokeDashoffset: 24 });

        const timeline = gsap.timeline({
            onComplete: () => {
                loader.classList.add('is-exiting');
                gsap.to(loader, {
                    autoAlpha: 0,
                    duration: 0.3,
                    ease: 'power1.in',
                    onComplete: () => loader.remove()
                });
            }
        });
        timeline
            .to(globeLines, {
                strokeDashoffset: 0,
                duration: 0.82,
                stagger: 0.055,
                ease: 'power2.out'
            }, 0)
            .to(counter, {
                value: 100,
                duration: 1.18,
                ease: 'power1.inOut',
                onUpdate: () => { loaderPercent.textContent = String(Math.round(counter.value)).padStart(3, '0'); }
            }, 0)
            .to(checks, {
                y: 0,
                autoAlpha: 1,
                duration: 0.2,
                stagger: 0.18,
                ease: 'power2.out'
            }, 0.3)
            .to(checkPaths, {
                strokeDashoffset: 0,
                duration: 0.2,
                stagger: 0.18,
                ease: 'power2.out'
            }, 0.3);
    }

    const manilaClock = document.getElementById('manila-clock');
    const utcClock = document.getElementById('utc-clock');

    if (manilaClock && utcClock) {
        const updateClocks = () => {
            const now = new Date();
            manilaClock.dateTime = now.toISOString();
            manilaClock.textContent = new Intl.DateTimeFormat('en-PH', {
                timeZone: 'Asia/Manila',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(now);
            utcClock.textContent = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'UTC',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(now);
        };

        updateClocks();
        window.setInterval(updateClocks, 1000);
    }
