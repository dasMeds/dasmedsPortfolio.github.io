document.addEventListener('DOMContentLoaded', () => {

    /* pop-up window logic */

    const modal = document.getElementById('poster-modal'); 
    
    if (modal) {
        // ui element references
        const modalImg = document.getElementById('modal-img'); 
        const modalImgBg = document.getElementById('modal-img-bg'); 
        const modalTitle = document.getElementById('modal-title'); 
        const modalDesc = document.getElementById('modal-desc');  
        const closeModalBtn = document.querySelector('.close-modal'); 
        const modalBackdrop = document.querySelector('.modal-backdrop');  
        const posterCards = document.querySelectorAll('.poster-card');  
        let lastFocusedPoster;

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

        const openPoster = card => {
                const img = card.querySelector('img');
                modalImg.src = img.src;
                modalImgBg.src = img.src; // background blur image
                modalTitle.textContent = img.alt;
                
                // fallback to default text if alt is missing in object
                modalDesc.innerHTML = posterDescriptions[img.alt] || "A high-quality edit.";
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // lock scroll while viewing
                lastFocusedPoster = card;
                closeModalBtn.focus();
        };

        posterCards.forEach(card => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.addEventListener('click', () => openPoster(card));
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openPoster(card);
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // restore scroll
            lastFocusedPoster?.focus();
        };

        closeModalBtn.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
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
        contactForm.addEventListener('submit', function(e) {
            // Stop the default redirect
            e.preventDefault(); 
            console.log("Form submission intercepted!"); // Check your browser console for this

            // Gather the data
            const formData = new FormData(this);

            // Send to Formspree
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert("Thanks! Your message has been sent.");
                    contactForm.reset(); 
                } else {
                    response.json().then(data => {
                        console.error("Formspree Error:", data);
                        alert("Oops! There was a problem sending your message.");
                    });
                }
            }).catch(error => {
                console.error("Fetch Error:", error);
                alert("Oops! There was a problem sending your message.");
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

    if (document.querySelector('.scroll-guide')) {
        document.body.classList.add('has-scroll-guide');
    }

    if (document.body.classList.contains('continuous-portfolio') && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            const activeEntry = entries
                .filter(entry => entry.isIntersecting)
                .sort((left, right) => {
                    const marker = window.innerHeight * 0.4;
                    return Math.abs(left.boundingClientRect.top - marker) -
                        Math.abs(right.boundingClientRect.top - marker);
                })[0];

            if (!activeEntry || !activeEntry.target.id) return;
            const nextHash = `#${activeEntry.target.id}`;
            if (window.location.hash !== nextHash) {
                window.history.replaceState(
                    window.history.state,
                    '',
                    `${window.location.pathname}${window.location.search}${nextHash}`
                );
            }
        }, { threshold: 0, rootMargin: '-40% 0px -59% 0px' });

        document.querySelectorAll('.continuous-sections section[id], #home, #demoreel-card').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    const loaderKey = 'dasmeds-portfolio-loader-seen';
    let showLoader = true;
    try {
        showLoader = window.sessionStorage.getItem(loaderKey) !== 'true';
        if (showLoader) window.sessionStorage.setItem(loaderKey, 'true');
    } catch (error) {
        console.warn('Pre-loader session state could not be saved; this visit will still continue.', error);
    }

    if (showLoader) {
        const loader = document.createElement('div');
        loader.id = 'preloader';
        loader.className = 'site-loader';
        loader.setAttribute('role', 'status');
        loader.setAttribute('aria-label', 'Loading portfolio');
        loader.innerHTML = '<div><svg class="loader-mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6a26 26 0 1 1 0 52 26 26 0 1 1 0-52"/><path d="M23 39V25l9 10 9-10v14"/></svg><p class="loader-caption">DASMEDS / PORTFOLIO</p><p class="loader-progress" aria-hidden="true"><span id="loader-percent">00</span>% <span>→</span> 100%</p><p class="loader-log" id="loader-log" aria-live="polite">INITIALIZING_SYSTEMS...</p></div>';
        document.body.prepend(loader);

        let dismissed = false;
        const loaderStart = performance.now();
        const loaderPercent = document.getElementById('loader-percent');
        const loaderLog = document.getElementById('loader-log');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const minimumLoaderTime = reducedMotion ? 180 : 1100;
        const loaderLogMessages = ['INITIALIZING_SYSTEMS...', 'MAPPING_PORTFOLIO...', 'CALIBRATING_VISUALS...', 'COMPILING_VECTORS...', 'SYSTEM_READY'];

        const progressTimer = window.setInterval(() => {
            const progress = Math.min(99, Math.floor(((performance.now() - loaderStart) / minimumLoaderTime) * 100));
            loaderPercent.textContent = String(progress).padStart(2, '0');
            loaderLog.textContent = loaderLogMessages[Math.min(loaderLogMessages.length - 1, Math.floor(progress / 25))];
        }, 40);

        const dismissPreloader = () => {
            if (dismissed) return;
            dismissed = true;
            window.clearInterval(progressTimer);
            loaderPercent.textContent = '100';
            loaderLog.textContent = loaderLogMessages[loaderLogMessages.length - 1];
            loader.classList.add('dismissed', 'is-hidden');
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
            window.setTimeout(() => {
                loader.style.display = 'none';
                loader.remove();
            }, 600);
        };

        const finishAfterMinimumTime = () => {
            window.setTimeout(
                dismissPreloader,
                Math.max(0, minimumLoaderTime - (performance.now() - loaderStart))
            );
        };

        if (document.readyState === 'complete') {
            finishAfterMinimumTime();
        } else {
            window.addEventListener('load', finishAfterMinimumTime, { once: true });
        }
        window.setTimeout(dismissPreloader, 2000);
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

    const showcaseVideos = document.querySelectorAll('#demoreel-video, .video-card video');
    // Defer media requests and autoplay to the single video currently closest to the viewport center.
    showcaseVideos.forEach(video => {
        video.pause();
        video.autoplay = false;
        video.preload = 'none';
        video.muted = true;
        video.playsInline = true;
    });

    if (showcaseVideos.length && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver(() => {
            const viewportCenter = window.innerHeight / 2;
            const activeVideo = [...showcaseVideos]
                .map(video => {
                    const bounds = video.getBoundingClientRect();
                    const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
                    const visibleWidth = Math.max(0, Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0));
                    const visibleRatio = (visibleHeight * visibleWidth) / Math.max(1, bounds.width * bounds.height);
                    return { video, bounds, visibleRatio };
                })
                .filter(item => item.visibleRatio >= 0.5)
                .sort((left, right) =>
                    Math.abs((left.bounds.top + left.bounds.bottom) / 2 - viewportCenter) -
                    Math.abs((right.bounds.top + right.bounds.bottom) / 2 - viewportCenter)
                )[0]?.video;

            showcaseVideos.forEach(video => {
                if (video !== activeVideo) {
                    video.pause();
                    video.autoplay = false;
                    return;
                }

                video.muted = true;
                video.playsInline = true;
                video.preload = 'metadata';
                video.autoplay = true;
                if (video.paused) {
                    const playback = video.play();
                    if (playback) {
                        playback.catch(error => {
                            if (error.name !== 'AbortError') {
                                console.warn('Showcase video autoplay was blocked by the browser.', error);
                            }
                        });
                    }
                }
            });
        }, { threshold: 0.5 });

        showcaseVideos.forEach(video => videoObserver.observe(video));
    } else {
        showcaseVideos.forEach(video => {
            video.autoplay = false;
        });
    }