import { gsap } from 'gsap';

export function initVideoTimeline() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const player = document.querySelector('#timeline-player');
    const clips = [...document.querySelectorAll('.timeline-clip')];
    const title = document.querySelector('#timeline-title');
    const status = document.querySelector('.editor-status');
    const timecode = document.querySelector('.editor-timecode');
    const signalTimecode = document.querySelector('.signal-timecode');
    const videoSuite = document.querySelector('.editor-suite');
    const timelineTrack = document.querySelector('.timeline-track');
    const playhead = document.querySelector('.timeline-playhead');
    const playerShell = document.querySelector('.editor-player-shell');
    const signalFrame = document.querySelector('.signal-frame');
    const playToggle = document.querySelector('#player-play-toggle');
    const muteToggle = document.querySelector('#player-mute-toggle');
    const fullscreenToggle = document.querySelector('#player-fullscreen-toggle');
    const tapToPlay = document.querySelector('#video-tap-to-play');
    const cutTitle = document.querySelector('#video-cut-title');
    const durationLabel = document.querySelector('#video-duration');
    const softwareLabel = document.querySelector('.video-software');
    if (!player || !clips.length || !title || !playerShell) return;

    let activeIndex = 0;
    let transitionTimer;
    let activePointerId = null;
    const movePlayhead = !reducedMotion && playhead
        ? gsap.quickTo(playhead, 'left', { duration: 0.1, ease: 'none' })
        : null;

    const formatTimecode = seconds => {
        const wholeSeconds = Math.floor(seconds || 0);
        const hours = String(Math.floor(wholeSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((wholeSeconds % 3600) / 60)).padStart(2, '0');
        const remainder = String(wholeSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${remainder}:00`;
    };

    const updatePlayhead = () => {
        if (!timelineTrack || !playhead || !Number.isFinite(player.duration) || player.duration <= 0) return;
        const progress = Math.max(0, Math.min(1, player.currentTime / player.duration));
        if (movePlayhead) movePlayhead(`${progress * 100}%`);
        else playhead.style.left = `${progress * 100}%`;
        playhead.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
        playhead.setAttribute('aria-valuetext', `${Math.floor(player.currentTime)} seconds`);
    };

    const seekAt = clientX => {
        if (!timelineTrack || !Number.isFinite(player.duration) || player.duration <= 0) return;
        const bounds = timelineTrack.getBoundingClientRect();
        if (bounds.width <= 0) return;
        const progress = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
        player.currentTime = progress * player.duration;
        updatePlayhead();
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
        if (cutTitle) cutTitle.textContent = title.textContent;
        if (softwareLabel) softwareLabel.textContent = clip.dataset.software || '';
        if (durationLabel) durationLabel.textContent = '--:--';
        player.poster = poster;
        player.loop = isDemoreel;
        player.muted = isDemoreel;
        player.autoplay = isDemoreel;
        player.preload = isDemoreel ? 'metadata' : 'auto';
        player.controls = false;
        if (status) status.textContent = `SOURCE / ${String(index + 1).padStart(2, '0')} — ${isDemoreel ? 'AUTO' : 'ON DEMAND'}`;
        if (player.currentSrc.endsWith(source) && !player.paused) return;

        window.clearTimeout(transitionTimer);
        signalFrame?.classList.add('is-switching');
        transitionTimer = window.setTimeout(() => signalFrame?.classList.remove('is-switching'), 300);
        player.pause();
        player.src = source;
        player.load();
        updatePlayhead();

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

    const updatePlaybackControls = () => {
        const isPlaying = !player.paused;
        if (playToggle) {
            playToggle.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
            playToggle.setAttribute('aria-pressed', String(isPlaying));
            const label = playToggle.querySelector('span');
            if (label) label.textContent = isPlaying ? 'PAUSE' : 'PLAY';
        }
        if (tapToPlay) tapToPlay.hidden = isPlaying;
    };

    const updateDuration = () => {
        if (!durationLabel || !Number.isFinite(player.duration) || player.duration < 0) return;
        const total = Math.floor(player.duration);
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        const seconds = total % 60;
        durationLabel.textContent = hours
            ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const updateMuteControl = () => {
        if (!muteToggle) return;
        muteToggle.setAttribute('aria-label', player.muted ? 'Unmute video' : 'Mute video');
        muteToggle.setAttribute('aria-pressed', String(player.muted));
        const label = muteToggle.querySelector('span');
        if (label) label.textContent = player.muted ? 'MUTED' : 'SOUND ON';
    };

    playToggle?.addEventListener('click', () => {
        if (player.paused) {
            player.play()?.catch(error => {
                if (error.name !== 'AbortError') {
                    if (tapToPlay) tapToPlay.hidden = false;
                    console.warn('Video playback could not start.', error);
                }
            });
        } else {
            player.pause();
        }
    });
    tapToPlay?.addEventListener('click', () => playToggle?.click());
    muteToggle?.addEventListener('click', () => {
        player.muted = !player.muted;
        updateMuteControl();
    });
    fullscreenToggle?.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()?.catch(error => console.warn('Could not exit fullscreen.', error));
        } else if (signalFrame?.requestFullscreen) {
            signalFrame.requestFullscreen().catch(error => console.warn('Fullscreen is unavailable.', error));
        }
    });
    player.addEventListener('play', updatePlaybackControls);
    player.addEventListener('pause', updatePlaybackControls);
    player.addEventListener('volumechange', updateMuteControl);
    document.addEventListener('fullscreenchange', () => {
        if (fullscreenToggle) {
            fullscreenToggle.setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen');
        }
    });

    clips.forEach(clip => {
        clip.addEventListener('click', () => switchClip(clip));
    });

    document.querySelectorAll('[data-clip-step]').forEach(button => {
        button.addEventListener('click', () => stepClip(Number(button.dataset.clipStep)));
    });

    if (playhead && timelineTrack) {
        playhead.addEventListener('pointerdown', event => {
            if (!event.isPrimary || event.button !== 0) return;
            event.preventDefault();
            activePointerId = event.pointerId;
            playhead.setPointerCapture(event.pointerId);
            timelineTrack.classList.add('is-scrubbing');
            seekAt(event.clientX);
        });
        playhead.addEventListener('pointermove', event => {
            if (event.pointerId === activePointerId) seekAt(event.clientX);
        });
        const endScrub = event => {
            if (event.pointerId !== activePointerId) return;
            activePointerId = null;
            timelineTrack.classList.remove('is-scrubbing');
        };
        playhead.addEventListener('pointerup', endScrub);
        playhead.addEventListener('pointercancel', endScrub);
        playhead.addEventListener('keydown', event => {
            if (!Number.isFinite(player.duration) || player.duration <= 0) return;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                player.currentTime = Math.max(0, Math.min(
                    player.duration,
                    player.currentTime + (event.key === 'ArrowRight' ? 5 : -5)
                ));
            } else if (event.key === 'Home') {
                event.preventDefault();
                player.currentTime = 0;
            } else if (event.key === 'End') {
                event.preventDefault();
                player.currentTime = player.duration;
            }
        });
    }

    player.addEventListener('timeupdate', () => {
        const formattedTime = formatTimecode(player.currentTime);
        if (timecode?.firstChild) timecode.firstChild.textContent = `${formattedTime} `;
        if (signalTimecode) signalTimecode.textContent = formattedTime;
        updatePlayhead();
    });
    player.addEventListener('loadedmetadata', updatePlayhead);
    player.addEventListener('durationchange', updatePlayhead);
    player.addEventListener('loadedmetadata', updateDuration);
    player.addEventListener('durationchange', updateDuration);
    window.addEventListener('resize', updatePlayhead, { passive: true });

    player.addEventListener('error', () => {
        if (status) status.textContent = 'SOURCE / LOAD ERROR';
        console.error('Unable to load timeline video:', player.currentSrc, player.error);
    });

    playerShell.setAttribute('role', 'dialog');
    playerShell.setAttribute('aria-modal', 'false');
    playerShell.setAttribute('aria-label', 'Portfolio video player');

    document.addEventListener('keydown', event => {
        const inPlayer = videoSuite?.contains(document.activeElement);
        if (!inPlayer) return;

        const target = event.target instanceof Element ? event.target : null;
        if (event.key === ' ' && !target?.closest('button, a, input, textarea')) {
            event.preventDefault();
            if (player.paused) {
                player.play()?.catch(error => {
                    if (error.name !== 'AbortError') console.warn('Video playback could not start.', error);
                });
            } else {
                player.pause();
            }
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            if (event.target === playhead) return;
            event.preventDefault();
            if (Number.isFinite(player.duration) && player.duration > 0) {
                player.currentTime = Math.max(0, Math.min(
                    player.duration,
                    player.currentTime + (event.key === 'ArrowRight' ? 5 : -5)
                ));
            }
        } else if (event.key.toLowerCase() === 'f') {
            event.preventDefault();
            if (document.fullscreenElement) {
                document.exitFullscreen()?.catch(error => console.warn('Could not exit fullscreen.', error));
            } else if (signalFrame?.requestFullscreen) {
                signalFrame.requestFullscreen().catch(error => console.warn('Fullscreen is unavailable.', error));
            }
        }
    });

    player.play()?.catch(error => {
        if (error.name !== 'AbortError') {
            if (status) status.textContent = 'SOURCE / AUTOPLAY BLOCKED';
            if (tapToPlay) tapToPlay.hidden = false;
            console.warn('Muted demoreel autoplay could not start.', error);
        }
    });
    updatePlaybackControls();
    updateMuteControl();
}
