import { gsap } from 'gsap';

export function initVideoTimeline() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const player = document.querySelector('#timeline-player');
    const clips = [...document.querySelectorAll('.timeline-clip')];
    const title = document.querySelector('#timeline-title');
    const status = document.querySelector('.editor-status');
    const timecode = document.querySelector('.editor-timecode');
    const timelineTrack = document.querySelector('.timeline-track');
    const playhead = document.querySelector('.timeline-playhead');
    const playerShell = document.querySelector('.editor-player-shell');
    const cinemaToggle = document.querySelector('.cinema-toggle');
    if (!player || !clips.length || !title || !playerShell || !cinemaToggle) return;

    let activeIndex = 0;
    let focusBeforeCinema;
    const movePlayhead = !reducedMotion && playhead
        ? gsap.quickTo(playhead, 'x', { duration: 0.1, ease: 'none' })
        : null;

    const updatePlayhead = () => {
        if (!timelineTrack || !playhead || !Number.isFinite(player.duration) || player.duration <= 0) return;
        const progress = Math.max(0, Math.min(1, player.currentTime / player.duration));
        const distance = Math.max(0, timelineTrack.clientWidth - playhead.offsetWidth);
        if (movePlayhead) movePlayhead(progress * distance);
        else gsap.set(playhead, { x: progress * distance });
    };

    const formatTimecode = seconds => {
        const wholeSeconds = Math.floor(seconds || 0);
        const hours = String(Math.floor(wholeSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((wholeSeconds % 3600) / 60)).padStart(2, '0');
        const remainder = String(wholeSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${remainder}:00`;
    };

    const switchClip = (clip, shouldPlay = true) => {
        const index = clips.indexOf(clip);
        if (index < 0) return;
        const source = clip.dataset.src;
        const poster = clip.dataset.poster;
        const isDemoreel = index === 0;
        if (!source || !poster) {
            console.error('Video timeline clip is missing media metadata.', clip);
            return;
        }

        activeIndex = index;
        clips.forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === index);
            item.setAttribute('aria-pressed', String(itemIndex === index));
        });
        title.textContent = clip.dataset.title || clip.querySelector('.timeline-clip-name')?.textContent || 'Untitled clip';
        player.poster = poster;
        player.loop = isDemoreel;
        player.muted = isDemoreel;
        player.autoplay = isDemoreel;
        player.preload = isDemoreel ? 'metadata' : 'auto';
        player.controls = true;
        updatePlayhead();

        if (status) status.textContent = `SOURCE / ${String(index + 1).padStart(2, '0')} — ${isDemoreel ? 'AUTO' : 'ON DEMAND'}`;
        if (player.currentSrc.endsWith(source) && !player.paused) return;

        player.pause();
        player.src = source;
        player.load();
        if (!reducedMotion) {
            gsap.killTweensOf(player);
            gsap.fromTo(player, { autoAlpha: 0.72, scale: 0.99 }, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.32,
                ease: 'power2.out'
            });
        }

        if (shouldPlay) {
            const playback = player.play();
            playback?.catch(error => {
                if (error.name !== 'AbortError') {
                    if (status) status.textContent = 'SOURCE / PLAYBACK BLOCKED';
                    console.warn('Selected timeline clip could not play.', error);
                }
            });
        }
    };

    const stepClip = direction => {
        const nextIndex = (activeIndex + direction + clips.length) % clips.length;
        switchClip(clips[nextIndex]);
        clips[nextIndex].focus({ preventScroll: true });
    };

    clips.forEach(clip => {
        clip.addEventListener('click', () => switchClip(clip));
    });

    document.querySelectorAll('[data-clip-step]').forEach(button => {
        button.addEventListener('click', () => stepClip(Number(button.dataset.clipStep)));
    });

    player.addEventListener('timeupdate', () => {
        if (timecode) timecode.firstChild.textContent = `${formatTimecode(player.currentTime)} `;
        updatePlayhead();
    });
    player.addEventListener('loadedmetadata', updatePlayhead);
    player.addEventListener('durationchange', updatePlayhead);
    window.addEventListener('resize', updatePlayhead, { passive: true });

    player.addEventListener('error', () => {
        if (status) status.textContent = 'SOURCE / LOAD ERROR';
        console.error('Unable to load timeline video:', player.currentSrc, player.error);
    });

    playerShell.setAttribute('role', 'dialog');
    playerShell.setAttribute('aria-modal', 'false');
    playerShell.setAttribute('aria-label', 'Portfolio video player');

    const closeCinema = () => {
        document.body.classList.remove('is-cinema');
        playerShell.setAttribute('aria-modal', 'false');
        cinemaToggle.setAttribute('aria-pressed', 'false');
        cinemaToggle.setAttribute('aria-label', 'Enter cinema mode');
        document.dispatchEvent(new CustomEvent('portfolio:scroll-lock', {
            detail: { locked: false }
        }));
        cinemaToggle.focus({ preventScroll: true });
    };

    cinemaToggle.addEventListener('click', () => {
        if (document.body.classList.contains('is-cinema')) {
            closeCinema();
            return;
        }
        focusBeforeCinema = document.activeElement;
        document.body.classList.add('is-cinema');
        playerShell.setAttribute('aria-modal', 'true');
        cinemaToggle.setAttribute('aria-pressed', 'true');
        cinemaToggle.setAttribute('aria-label', 'Exit cinema mode');
        document.dispatchEvent(new CustomEvent('portfolio:scroll-lock', {
            detail: { locked: true }
        }));
        document.querySelector('[data-clip-step="-1"]')?.focus({ preventScroll: true });
    });

    document.addEventListener('keydown', event => {
        if (!document.body.classList.contains('is-cinema')) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeCinema();
            focusBeforeCinema?.focus({ preventScroll: true });
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stepClip(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            stepClip(1);
        } else if (event.key === 'Tab') {
            const focusable = [...playerShell.querySelectorAll('button:not(:disabled), video[controls]')];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        }
    });
}
