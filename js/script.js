document.addEventListener('DOMContentLoaded', () => {

    /* ========================================= scroll logic ========================================= */
    // handles seamless page transitions using the mouse wheel.
    const pages = ['index.html', 'about.html', 'experience.html', 'portfolio.html'];
    
    // gets the current file name from the url path
    let path = window.location.pathname;
    let currentPage = path.split('/').pop();
    
    // default to index.html if the path is empty (root)
    if (currentPage === '' || currentPage === '/') {
        currentPage = 'index.html';
    }

    let currentIndex = pages.indexOf(currentPage);
    
    // fallback: if current page isn't in the array, assumes its at the start
    if (currentIndex === -1) {
        currentIndex = 0;
    }

    // to prevent multiple triggers during a single animation/transition
    let isNavigating = false;

    window.addEventListener('wheel', (e) => {
        if (isNavigating) return;

        // the very bottom or very top of the current page?
        const atBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10;
        const atTop = window.scrollY <= 10;

        // if scrolling down at the bottom, move to the next page
        if (e.deltaY > 0 && atBottom) {
            if (currentIndex < pages.length - 1) {
                isNavigating = true;
                document.getElementById('page-wrapper').classList.add('slide-out-up'); 
                
                // delay redirect to allow slide-out-up animation to play
                setTimeout(() => {
                    window.location.href = pages[currentIndex + 1];
                }, 700); 
            }
        } 
        // scrolling up move to the previous page
        else if (e.deltaY < 0 && atTop) {
            if (currentIndex > 0) {
                isNavigating = true;
                document.getElementById('page-wrapper').classList.add('slide-out-down'); 
                
                setTimeout(() => {
                    window.location.href = pages[currentIndex - 1];
                }, 700);
            }
        }
    });

    // handles standard navbar links to maintain the slide-out animation theme
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            if(targetUrl && targetUrl.includes('.html') && !targetUrl.includes('#')) {
                e.preventDefault();
                isNavigating = true;
                document.getElementById('page-wrapper').classList.add('slide-out-up');
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 700);
            }
        });
    });

    /* ========================================= pop-up window logic ========================================= */

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

        const posterDescriptions = {
            "F-2 Viper Zero": `A precision-timed, highly detailed cinematic edit focusing on the Mitsubishi F-2 multirole fighter. The sequence highlights its striking aerodynamic design, advanced maneuverability, and versatile maritime strike capabilities in contested skies.\n\nREAL-LIFE CONTEXT:\nThe Mitsubishi F-2, commonly referred to as the "Viper Zero," is a 4.5-generation multirole fighter co-developed by Mitsubishi Heavy Industries and Lockheed Martin for the Japan Air Self-Defense Force (JASDF). Based heavily on the F-16 Fighting Falcon, the F-2 features a 25% larger wing area made from advanced radar-absorbing composite materials, allowing for a heavier payload of anti-ship missiles. Notably, it was the first operational military aircraft in the world to be equipped with an Active Electronically Scanned Array (AESA) radar system.\n\nREFERENCE:\nJapan Air Self-Defense Force. (n.d.). Equipment: F-2 close-up. Ministry of Defense. Retrieved March 11, 2026, from https://www.mod.go.jp/asdf/english/equipment/`,

            "F-2 Viper Zero Grounded": `An atmospheric, tension-building sequence showcasing the F-2 Viper Zero during its pre-flight operations. The edit captures the meticulous ground preparation, complex mechanical checks, and the heavy armament loading required before a high-stakes tactical deployment.\n\nREAL-LIFE CONTEXT:\nGround operations for the F-2 are critical to the JASDF's rapid response capabilities. Squadrons are frequently kept on high alert, requiring ground crews to transition the aircraft from a cold state to a combat-ready launch in under five minutes. Preparations involve comprehensive avionics system checks and the careful loading of heavy ordnance, including ASM-2 anti-ship missiles and AAM-series air-to-air missiles, testing the load-bearing capabilities of its reinforced composite wings.\n\nREFERENCE:\nGrevatt, J., & MacDonald, A. (2020). JASDF fighter fleet readiness and modernization. Jane's Defence Weekly.`,

            "F-15J Peace Eagle": `A high-energy, adrenaline-fueled edit highlighting the sheer thrust and absolute dominance of the McDonnell Douglas F-15J. The sequence emphasizes its aggressive climb rates, kinetic energy, and its role as Japan's premier twin-engine air superiority interceptor.\n\nREAL-LIFE CONTEXT:\nThe F-15J "Peace Eagle" is a twin-engine, all-weather air superiority fighter produced under license by Mitsubishi Heavy Industries for the JASDF, based on the American F-15C. While the airframe is nearly identical to its American counterpart, the F-15J is equipped with highly classified, indigenous Japanese avionics, including the J/TEWS electronic warfare system. It serves as Japan's primary interceptor, continually modernized to carry advanced domestic missiles like the AAM-4 and AAM-5.\n\nREFERENCE:\nBoeing. (n.d.). F-15 Eagle. Retrieved March 11, 2026, from https://www.boeing.com/defense/f-15`,

            "Above You Behind You": `A fast-paced, tactical perspective edit that throws the viewer right into the merge. This sequence showcases the complex geometry, crucial positional advantage, and raw, high-G adrenaline of close-quarters aerial dogfighting.\n\nREAL-LIFE CONTEXT:\nThe phrase "above you, behind you" perfectly encapsulates the ultimate goal of offensive Basic Fighter Maneuvers (BFM). In air combat, maintaining an altitude advantage grants superior kinetic energy, while maneuvering into an adversary's "six o'clock" blind spot places the attacker safely inside their weapons envelope. This dominant positioning, known as the "Control Zone," allows the attacking pilot to dictate the flow of the engagement and secure a kill shot while minimizing the defender's evasive options.\n\nREFERENCE:\nShaw, R. L. (1985). Fighter combat: Tactics and maneuvering. Naval Institute Press.`,

            "M1A1 Abrams": `A heavy, rhythm-driven cinematic sequence focusing on the impenetrable composite armor, immense physical presence, and devastating kinetic firepower of the legendary M1A1 Abrams main battle tank operating in hostile environments.\n\nREAL-LIFE CONTEXT:\nThe M1A1 Abrams is a third-generation American main battle tank renowned for its battlefield survivability and lethal firepower. Introduced in the 1980s, the M1A1 variant replaced the original 105mm gun with a German-designed Rheinmetall 120mm M256 smoothbore cannon, capable of firing depleted uranium armor-piercing rounds. Powered by a 1,500-horsepower gas turbine engine and protected by classified Chobham composite armor, the Abrams remains a highly mobile and formidable force in modern armored warfare.\n\nREFERENCE:\nHunnicutt, R. P. (1990). Abrams: A history of the American main battle tank. Presidio Press.`,

            "SU-33 Flanker D": `A highly dynamic, visually striking edit of the Sukhoi Su-33, capturing the unique carrier-based takeoff operations, extreme post-stall maneuverability, and raw aerodynamic power of this all-weather Russian naval fighter.\n\nREAL-LIFE CONTEXT:\nThe Sukhoi Su-33 (NATO reporting name: "Flanker-D") is a twin-engine, all-weather air superiority fighter designed specifically for aircraft carrier operations. Derived from the Su-27, it features several naval modifications, including folding wings, a reinforced undercarriage, an arresting hook, and distinctive canards (small forewings) that increase lift and maneuverability. The Su-33 launches via a STOBAR (Short Take-Off But Arrested Recovery) system, using a ski-jump ramp on the carrier deck rather than steam catapults.\n\nREFERENCE:\nGordon, Y., & Komissarov, D. (2021). Sukhoi Su-27 & 30/33/34/35: Famous Russian aircraft. Crecy Publishing.`
        };

        posterCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                modalImg.src = img.src;
                modalImgBg.src = img.src; // background blur image
                modalTitle.textContent = img.alt;
                
                // fallback to default text if alt is missing in object
                modalDesc.innerHTML = posterDescriptions[img.alt] || "A high-quality edit.";
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // lock scroll while viewing
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // restore scroll
        };

        closeModalBtn.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);
    }

    /* ========================================= moving slider logic ========================================= */
    // auto-scrolling track loops.
    const sliderContainer = document.querySelector('.slider-container');
    
    if (sliderContainer) {
        const wrapper = document.querySelector('.marquee-wrapper'); 
        const track = document.querySelector('.marquee-track'); 
        const leftArrow = document.querySelector('.left-arrow'); 
        const rightArrow = document.querySelector('.right-arrow'); 

        let isHovered = false;
        let scrollInterval;
        const scrollSpeed = 1; // pixels per frame

        // if the scroll position hits the halfway point, snap back to 0
        const resetScrollPosition = () => {
            if (wrapper.scrollLeft >= track.scrollWidth / 2) { 
                wrapper.scrollLeft = 0; 
            } else if (wrapper.scrollLeft <= 0) { 
                wrapper.scrollLeft = track.scrollWidth / 2; 
            }
        };

        function startScroll() {
            scrollInterval = setInterval(() => {
                if (!isHovered) {
                    wrapper.scrollLeft += scrollSpeed;
                    resetScrollPosition();
                }
            }, 20); // update rate
        }

        // pause when interacting with the slider
        sliderContainer.addEventListener('mouseenter', () => isHovered = true);
        sliderContainer.addEventListener('mouseleave', () => isHovered = false);

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

        startScroll();
    }

    /* ========================================= videos showcase ========================================= */
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

        videoCards.forEach(card => {
            const video = card.querySelector('video');
            
            // mMute and play on mouse enter
            card.addEventListener('mouseenter', () => {
                if (video.paused) {
                    video.muted = true;
                    video.play().catch(error => console.log("User interaction required for autoplay.")); 
                }
            });

            // stop and reset video when mouse leaves
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; 
            });
        });
    }

    /* ========================================= background fx ========================================= */
    function initFizzyGrid() {
        // the Background Container
        const grid = document.createElement('div');
        grid.id = 'magic-bg-grid';
        document.body.insertBefore(grid, document.body.firstChild);

        const tileSize = 60; // size of each reactive zone
        let cols = Math.ceil(window.innerWidth / tileSize);
        let rows = Math.ceil(window.innerHeight / tileSize);
        let tiles = [];

        let mouseX = -1000;
        let mouseY = -1000;

        // the tile array
        function createGrid() {
            grid.innerHTML = '';
            grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            tiles = Array.from({ length: cols * rows }, (_, i) => {
                const tile = document.createElement('div');
                tile.className = 'magic-tile';
                grid.appendChild(tile);
                //the center coordinates for calculations
                return {
                    el: tile,
                    x: (i % cols) * tileSize + tileSize / 2,
                    y: Math.floor(i / cols) * tileSize + tileSize / 2
                };
            });
        }
        createGrid();

        window.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 1024) return; // disable on mobile

            mouseX = e.clientX;
            mouseY = e.clientY;
            updateScaling();
        });

        // scale up as the mouse gets closer
        function updateScaling() {
            const radius = 180; 
            tiles.forEach(tile => {
                // Pythagorean distance formula: sqrt(a^2 + b^2)
                const dist = Math.sqrt((mouseX - tile.x) ** 2 + (mouseY - tile.y) ** 2);
                if (dist < radius) {
                    // tiles closer to mouse get bigger (max 13x)
                    const scale = 1 + (1 - dist / radius) * 12; 
                    tile.el.style.transform = `scale(${scale})`;
                    tile.el.classList.add('glowing');
                } else {
                    tile.el.style.transform = 'scale(1)';
                    tile.el.classList.remove('glowing');
                }
            });
        }

        // periodically emits fizz from tiles near the mouse
        setInterval(() => {
            if (window.innerWidth <= 1024) return; // stops particle emitions on mobile for performance

            const outerFizzRadius = 140; 
            const proximityRadius = 180;

            tiles.forEach(tile => {
                const dist = Math.sqrt((mouseX - tile.x) ** 2 + (mouseY - tile.y) ** 2);
                // trigger particles only around the cursor
                if (dist < proximityRadius && dist > outerFizzRadius && !tile.el.dataset.fizzing) {
                    tile.el.dataset.fizzing = "true";
                    createFizz(tile.el);
                    // cooldown 
                    setTimeout(() => delete tile.el.dataset.fizzing, 800); 
                }
            });
        }, 400); 

        // article animation
        function createFizz(parentTile) {
            for (let i = 0; i < 3; i++) { 
                const p = document.createElement('div');
                p.className = 'magic-particle';
                const size = Math.random() * 2 + 1;
                p.style.width = `${size}px`;
                p.style.height = `${size}px`;
                parentTile.appendChild(p);

                // calculates a random outward trajectory
                const angle = Math.random() * Math.PI * 2;
                const destX = Math.cos(angle) * (Math.random() * 60 + 20);
                const destY = Math.sin(angle) * (Math.random() * 60 + 20);
                
                const duration = 2500 + Math.random() * 1500;

                p.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                    fill: 'forwards'
                });
                
                setTimeout(() => p.remove(), duration);
            }
        }
    }
    initFizzyGrid();
});

/* ========================================= mobile logic ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }