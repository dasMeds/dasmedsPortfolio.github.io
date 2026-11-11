<?php
declare(strict_types=1);

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if ($requestPath === '/api/contact') {
    require __DIR__ . '/../includes/contact-handler.php';
    exit;
}
if ($requestPath === '/health') {
    header('Content-Type: application/json');
    echo '{"status":"ok"}';
    exit;
}
if ($requestPath !== '/' && $requestPath !== '/index.php') {
    http_response_code(404);
    echo 'Not found';
    exit;
}
?>
<?php require __DIR__ . '/../includes/header.php'; ?>
<?php require __DIR__ . '/../includes/nav.php'; ?>
<?php require __DIR__ . '/../includes/orb.php'; ?>

    <div id="page-wrapper">
        <main class="container scroll-story continuous-portfolio-content">
            <section id="home" class="hero-stage">
                <p class="coordinate-label">[ 14° 40′ N, 120° 58′ E — METRO MANILA ]</p>
                <svg class="hero-coordinate-lines" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M92 150 280 230 440 110M760 120 910 250 1080 170M110 520 360 430 510 570M850 420 1040 550"/>
                    <circle cx="92" cy="150" r="4"/><circle cx="440" cy="110" r="4"/>
                    <circle cx="760" cy="120" r="4"/><circle cx="1080" cy="170" r="4"/>
                    <circle cx="110" cy="520" r="4"/><circle cx="510" cy="570" r="4"/>
                    <circle cx="850" cy="420" r="4"/><circle cx="1040" cy="550" r="4"/>
                </svg>
                <h1 class="hero-title">BSIT <br><span class="hero-title-secondary">KRISTIAN</span></h1>
                <div class="hero-content">
                    <div class="hero-copy">
                        <p class="hero-desc">
                            Hi! I'm Pat Kristian Manalastas. A student taking the program Bachelor of Science in Information Technology and this is my portfolio website. I have listed some of my experience and edits here. Feel free to check them out and contact me if you have any questions or if you want to work together.
                        </p>
                        <a href="mailto:indieharry49@gmail.com" class="btn-solid">Hire Me</a>
                    </div>
                    <div class="hero-stats">
                        <div class="hero-stat">
                            <div class="stat-number" data-cert-stat="total">0</div>
                            <div class="stat-label">Certifications Logged</div>
                        </div>
                        <div class="hero-stat">
                            <div class="stat-number">9</div>
                            <div class="stat-label">Completed Projects</div>
                        </div>
                        <div class="hero-stat">
                            <div class="stat-number">400</div>
                            <div class="stat-label">Hours Programming/Scripting</div>
                        </div>
                        <div class="hero-stat">
                            <div class="stat-number" data-cert-stat="issuers">0</div>
                            <div class="stat-label">Issuing Organizations</div>
                        </div>
                        <div class="stat-card system-card hero-stat">
                            <div class="system-card-heading"><span class="system-indicator"></span> SYSTEM / LOCAL</div>
                            <time id="manila-clock" class="system-time" datetime="">--:--:--</time>
                            <div class="system-card-footer">
                                <span class="stat-label">UTC <time id="utc-clock">--:--:--</time></span>
                                <span class="frequency-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="hero-index">PKM <span>—</span> ENGINEERING / VISUAL SYSTEMS</p>
            </section>
        <div class="continuous-sections">
<section id="about">
                <span class="section-coordinate" aria-hidden="true"></span>
                <span class="section-label">This is me.</span>
                <div class="about-grid">
                    <div class="about-copy">
                        <h2 class="section-title">Hi, I'm Pat Kristian.<br>I'm an IT student dedicated to turning ideas into creative solutions.</h2>
                        <p class="about-text">
                                As an IT student, I bring an analytical, solutions-oriented mindset to the creative process of video editing. This approach is central to how I craft my visual projects—carefully sequencing footage to demonstrate a mastery of pacing, technical fidelity, and narrative flow. I focus on delivering polished, engaging content that highlights both my technical capabilities and my dedication to the craft.
                        </p>
                    </div>
                    <div class="about-image">
                        <img src="/images/profile-picture.jpg" alt="Pat Kristian Profile Picture">
                    </div>
                </div>
                <div class="about-marquee" aria-hidden="true">
                    <p class="about-text about-marquee-track">
                        ANALYTICAL THINKING / VISUAL STORYTELLING / TECHNICAL FIDELITY / NARRATIVE FLOW /
                    </p>
                </div>

                <div class="stack-grid">
                    <div class="stack-category">
                        <h4>Frontend</h4>
                        <ul class="stack-list">
                            <li><svg class="tech-icon tech-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg> CSS</li>
                            <li><svg class="tech-icon tech-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg> JS</li>
                        </ul>
                    </div>
                    <div class="stack-category">
                        <h4>Tools</h4>
                        <ul class="stack-list">
                            <li><svg class="tech-icon tech-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> Git / GitHub</li>
                            <li><svg class="tech-icon tech-logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 10.5 10.7 6l16.2 15.5-5.8 4.5L5 10.5Zm22 0L21.3 6 5.1 21.5l5.8 4.5L27 10.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"/></svg> CapCut</li>
                            <li><svg class="tech-icon tech-logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M4 4h24v24H4zM10 23V9h5.2c3.5 0 5.6 1.8 5.6 4.8 0 3.1-2.1 4.9-5.6 4.9h-2V23m2-7.5c1.4 0 2.2-.5 2.2-1.7s-.8-1.7-2.2-1.7h-2.1v3.4h2.1Zm7.8 3.7c.8.6 1.7.9 2.5.9.7 0 1.1-.2 1.1-.6 0-1.1-4.1-.4-4.1-3.5 0-1.8 1.5-3 3.7-3 1.4 0 2.6.4 3.5 1l-1.2 2c-.7-.5-1.5-.8-2.3-.8-.6 0-.9.2-.9.5 0 1.1 4.2.3 4.2 3.5 0 1.9-1.5 3.1-3.9 3.1-1.5 0-3-.5-4-1.3l1.4-1.8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg> Adobe Photoshop</li>
                            <li><svg class="tech-icon tech-logo" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M21 10.5a7 7 0 1 0 0 11M20 13c-1-.9-2.3-1.4-3.8-1.4-2.8 0-4.7 1.8-4.7 4.4s1.9 4.4 4.7 4.4c1.5 0 2.8-.5 3.8-1.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg> Canva</li>
                        </ul>
                    </div>
                </div>
            </section>

<section id="experience">
    <span class="section-coordinate" aria-hidden="true"></span>
                <span class="section-label">My Experience</span>

                <div class="job-item">
                    <div>
                        <h3 class="job-title">Bachelor of Science of Information Technology</h3>
                        <p class="job-role">Pamantasan of Lungsod ng Valenzuela</p>
                    </div>
                    <div class="job-date">Aug 2024 - May 2028</div>
                </div>
            </section>

<section id="certifications">
    <div class="cert-heading">
        <div><span class="section-label">Flight log / credentials</span><h2 class="section-title">Certifications</h2></div>
        <p class="section-coordinate">[ 03 / CERTS — <span id="cert-total">--</span> LOGGED ]</p>
    </div>
    <p class="cert-summary" id="cert-summary"></p>

    <div class="cert-board-toolbar">
        <div class="cert-filters" id="cert-filters" role="group" aria-label="Filter certifications"></div>
        <div class="cert-toolbar-actions">
            <div class="cert-view-toggle" role="group" aria-label="Certification layout">
                <button type="button" data-cert-view="route" aria-pressed="true">ROUTE</button>
                <button type="button" data-cert-view="board" aria-pressed="false">BOARD</button>
            </div>
            <button type="button" class="cert-sort" id="cert-sort-toggle" aria-pressed="false">OLDEST FIRST</button>
        </div>
    </div>

    <div class="cert-route" id="cert-route-view" aria-label="Certification route"></div>
    <div class="cert-table-wrap" id="cert-board-view" hidden>
        <table class="cert-table" aria-label="Certification flight log">
            <thead><tr><th scope="col">IDX</th><th scope="col" aria-sort="ascending">DATE</th><th scope="col">TRACK</th><th scope="col">CREDENTIAL</th><th scope="col">ISSUER</th><th scope="col">STATUS</th></tr></thead>
            <tbody id="cert-rows"></tbody>
        </table>
    </div>
    <div class="cert-preview" id="cert-preview" aria-hidden="true"><img alt="" width="320" height="216"></div>
</section>

<section id="github-projects" class="repo-section">
    <div class="repo-heading">
        <div><span class="section-label">Coding Projects</span><h2 class="section-title">GitHub Repos</h2></div>
        <span class="section-coordinate" aria-hidden="true"></span>
    </div>

    <div class="repo-grid">
        <?php foreach ($portfolioData['repositories'] as $repositoryIndex => $repository):
            $name = htmlspecialchars($repository['name'], ENT_QUOTES, 'UTF-8');
            $callSign = htmlspecialchars($repository['callSign'], ENT_QUOTES, 'UTF-8');
            $objective = htmlspecialchars($repository['objective'], ENT_QUOTES, 'UTF-8');
            $briefingId = 'repo-briefing-' . ($repositoryIndex + 1);
            $repoUrl = 'https://github.com/dasMeds/' . rawurlencode($repository['name']);
            $cloneCommand = 'git clone ' . $repoUrl . '.git';
        ?>
        <article class="repo-card" data-repo="<?= $name ?>">
            <button class="repo-row-toggle" type="button" aria-expanded="false" aria-controls="<?= $briefingId ?>">
            <span class="repo-index" aria-hidden="true"><?= sprintf('%02d', $repositoryIndex + 1) ?></span>
            <span class="repo-emblem" data-call-sign="<?= $callSign ?>" data-name="<?= $name ?>" aria-hidden="true"></span>
            <span class="repo-identity"><span class="repo-callsign">CALLSIGN / <?= $callSign ?></span><span class="project-title"><?= $name ?></span>
            <span class="project-desc repo-objective"><?= $objective ?></span>
            </span><span class="repo-loadout-label">LOADOUT</span>
            <span class="video-tags"><?php foreach ($repository['technologies'] as $technology): ?><span class="tag"><?= htmlspecialchars($technology, ENT_QUOTES, 'UTF-8') ?></span><?php endforeach; ?></span>
            </button>
            <div class="repo-briefing" id="<?= $briefingId ?>" aria-hidden="true">
                <p class="repo-full-description"><?= $objective ?></p>
                <div class="repo-terminal">
                    <code class="repo-clone-command">$ <?= htmlspecialchars($cloneCommand, ENT_QUOTES, 'UTF-8') ?></code>
                    <button class="repo-copy" type="button" data-copy-text="<?= htmlspecialchars($cloneCommand, ENT_QUOTES, 'UTF-8') ?>" aria-label="Copy clone command for <?= $name ?>"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1"/><path d="M11 5V3H3v8h2"/></svg><span>COPY</span></button>
                </div>
                <span class="repo-copy-status" aria-live="polite"></span>
                <a href="<?= htmlspecialchars($repoUrl, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" class="btn-outline">View Repo <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5 4h7v7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></a>
            </div>
        </article>
        <?php endforeach; ?>
    </div>
</section>

<section id="posters" class="poster-scrollytelling">
    <span class="section-label">My Designs</span>
    <h2 class="section-title">Poster Showcase</h2>
    <span class="section-coordinate" aria-hidden="true"></span>
    <div class="poster-bento" aria-label="Poster design gallery">
      <div class="poster-ring">
        <?php foreach ($portfolioData['posters'] as $index => $poster):
            $title = htmlspecialchars($poster['title'], ENT_QUOTES, 'UTF-8');
            $note = trim($poster['note'] ?? '');
        ?>
        <button class="poster-card poster-tile <?= htmlspecialchars($poster['class'], ENT_QUOTES, 'UTF-8') ?>" type="button"
            data-title="<?= $title ?>"
            data-tools="<?= htmlspecialchars($poster['tools'], ENT_QUOTES, 'UTF-8') ?>"
            data-intent="<?= htmlspecialchars($poster['intent'], ENT_QUOTES, 'UTF-8') ?>"
            <?php if ($note !== ''): ?>data-note="<?= htmlspecialchars($note, ENT_QUOTES, 'UTF-8') ?>"<?php endif; ?>>
            <img src="<?= htmlspecialchars($poster['image'], ENT_QUOTES, 'UTF-8') ?>" alt="<?= $title ?>" width="<?= (int) $poster['width'] ?>" height="<?= (int) $poster['height'] ?>" loading="lazy" decoding="async">
            <span class="poster-tile-index"><?= sprintf('%02d', $index + 1) ?> / <?= htmlspecialchars($poster['category'], ENT_QUOTES, 'UTF-8') ?></span><span class="poster-tile-title"><?= $title ?></span>
            <?php if ($note !== ''): ?>
            <aside class="poster-note">
                <svg class="poster-note-arrow" viewBox="0 0 120 48" aria-hidden="true"><path d="M4 35C34 4 77 7 110 21m0 0-17-7m17 7-14 10"/></svg>
                <span><?= htmlspecialchars($note, ENT_QUOTES, 'UTF-8') ?></span>
            </aside>
            <?php endif; ?>
        </button>
        <?php endforeach; ?>
      </div>
    </div>
    <div class="poster-showcase-controls" aria-label="Poster navigation">
        <button type="button" data-poster-step="-1" aria-label="Show previous poster">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5M7.5 10h8"/></svg>
        </button>
        <button type="button" data-poster-step="1" aria-label="Show next poster">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5M12.5 10h-8"/></svg>
        </button>
    </div>
</section>

<section id="videos">
    <span class="section-label">My Edits</span>
    <h2 class="section-title">Video Showcase</h2>
    <span class="section-coordinate" aria-hidden="true"></span>

    <div class="editor-suite">
        <div class="editor-player-shell" id="demoreel-card">
            <div class="editor-toolbar">
                <span class="reel-readout">01 / MOTION STUDY — DEMOREEL</span>
                <span class="editor-status" aria-live="polite">SOURCE / READY</span>
            </div>
            <div class="signal-frame">
    <video id="timeline-player" class="portfolio-video" autoplay muted loop playsinline preload="metadata" poster="<?= htmlspecialchars($portfolioData['videos'][0]['poster'] ?? '', ENT_QUOTES, 'UTF-8') ?>">
        <source src="<?= htmlspecialchars($portfolioData['videos'][0]['src'], ENT_QUOTES, 'UTF-8') ?>" type="video/mp4">
        Your browser does not support HTML5 video playback.
    </video>
    <span class="signal-letterbox signal-letterbox-top" aria-hidden="true"></span>
    <span class="signal-letterbox signal-letterbox-bottom" aria-hidden="true"></span>
    <span class="signal-rec" aria-hidden="true"><i></i> REC</span>
    <span class="signal-timecode" aria-hidden="true">00:00:00:00</span>
    <span class="signal-brackets" aria-hidden="true"></span>
    <span class="signal-static" aria-hidden="true"></span>
    <button class="video-tap-to-play" id="video-tap-to-play" type="button" hidden>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 12 7-12 7z"/></svg>
        <span>TAP TO PLAY</span>
    </button>

    <!-- PASTE HERE: Left & Right Video Navigation Arrows -->
    <button type="button" class="video-arrow video-arrow-prev" data-clip-step="-1" aria-label="Previous video">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    </button>
    <button type="button" class="video-arrow video-arrow-next" data-clip-step="1" aria-label="Next video">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    </button>
</div>
            <div class="editor-player-caption">
                <div>
                    <h3 class="project-title" id="timeline-title">Demoreel</h3>
                    <div class="video-tags"><span class="tag">Cinematics</span><span class="tag">Video Editing</span></div>
                </div>
            </div>
            <div class="video-controls" role="group" aria-label="Video controls">
                <button class="video-control" id="player-play-toggle" type="button" aria-label="Pause video" aria-pressed="true">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4v12M14 4v12"/></svg>
                    <span>PAUSE</span>
                </button>
                <button class="video-control" id="player-mute-toggle" type="button" aria-label="Unmute video" aria-pressed="true">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 8v4h3l4 3V5L6 8H3Zm10-1 4 6m0-6-4 6"/></svg>
                    <span>MUTED</span>
                </button>
                <button class="video-control" id="player-fullscreen-toggle" type="button" aria-label="Enter fullscreen">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 7V3h4m6 0h4v4m0 6v4h-4m-6 0H3v-4"/></svg>
                    <span>FULLSCREEN</span>
                </button>
            </div>
            <dl class="video-data-plate">
                <div><dt>TITLE</dt><dd id="video-cut-title">Demoreel</dd></div>
                <div><dt>DURATION</dt><dd id="video-duration">--:--</dd></div>
                <div><dt>SOFTWARE</dt><dd class="video-software">Video Editing</dd></div>
            </dl>
        </div>

        <div class="editor-transport" aria-label="Video playback controls">
            <button class="editor-step" type="button" data-clip-step="-1" aria-label="Play previous clip">PREV</button>
            <span class="editor-timecode" aria-live="polite">00:00:00:00 <span> / </span> PORTFOLIO REEL</span>
            <button class="editor-step" type="button" data-clip-step="1" aria-label="Play next clip">NEXT</button>
        </div>

        <div class="editor-timeline" role="group" aria-label="Choose a portfolio video">
            <span class="timeline-ruler" aria-hidden="true">V1&nbsp;&nbsp;&nbsp;&nbsp; 00:00&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 00:15&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 00:30&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 00:45</span>
            <div class="timeline-track">
                <div class="timeline-playhead" role="slider" tabindex="0" aria-label="Seek within selected video" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="0 seconds"></div>
                <?php foreach ($portfolioData['videos'] as $index => $video): ?>
                <button class="timeline-clip<?= $index === 0 ? ' is-active' : '' ?>" type="button"
                    data-title="<?= htmlspecialchars($video['title'], ENT_QUOTES, 'UTF-8') ?>"
                    data-src="<?= htmlspecialchars($video['src'], ENT_QUOTES, 'UTF-8') ?>"
                    data-poster="<?= htmlspecialchars($video['poster'], ENT_QUOTES, 'UTF-8') ?>"
                    data-software="<?= htmlspecialchars(implode(', ', $video['software']), ENT_QUOTES, 'UTF-8') ?>"
                    aria-pressed="<?= $index === 0 ? 'true' : 'false' ?>">
                    <img src="<?= htmlspecialchars($video['poster'], ENT_QUOTES, 'UTF-8') ?>" alt="" width="1280" height="720" loading="lazy" decoding="async">
                    <span class="timeline-clip-name"><?= htmlspecialchars($video['shortTitle'], ENT_QUOTES, 'UTF-8') ?></span>
                    <span class="timeline-clip-meta"><?= htmlspecialchars($video['channel'], ENT_QUOTES, 'UTF-8') ?> / <?= sprintf('%02d', $index + 1) ?></span>
                </button>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>

<section id="contact">
    <span class="section-coordinate" aria-hidden="true"></span>

                <div class="contact-split-layout">

                    <div class="contact-left">
                        <h1 class="hero-title">GET IN <br> TOUCH</h1>
                        <p class="hero-desc contact-intro">
                            Have a question or want to work together? Fill out the form below.
                        </p>

                        <form class="contact-form" action="/api/contact" method="POST">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" required placeholder="Your Name">
                            </div>

                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required placeholder="Your Email">
                            </div>

                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" rows="6" required placeholder="How can I help you?"></textarea>
                            </div>

                            <div class="contact-waveform" aria-hidden="true">
                                <span class="waveform-label">LIVE SIGNAL / TX</span>
                                <div class="waveform-bars">
                                    <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                                    <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                                </div>
                            </div>

                            <button type="submit" class="btn-solid contact-submit">Send Message</button>
                        </form>
                    </div>

                    <div class="contact-right">
                        <h3 class="side-title">Contact Information</h3>
                        <p class="side-email">
                            <a href="mailto:indieharry49@gmail.com">indieharry49@gmail.com</a>
                        </p>

                        <h3 class="side-title contact-social-heading">Socials</h3>
                        <!-- Social SVG paths are inline and local; verify against current platform brand guides when updating. -->
                    <div class="side-social-links">
                            <a href="https://www.facebook.com/kristian.manalastas.1?rdid=CKX6pbhutJwmxq06&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CWSYwoSuA%2F" target="_blank" rel="noopener noreferrer" class="social-item">
                                <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>
                                <span>Facebook - Kristian Manalastas</span>
                            </a>

                            <a href="https://www.instagram.com/das.krstn?igsh=cmZ3cnB2cnE0ZzM3" target="_blank" rel="noopener noreferrer" class="social-item">
                                <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
                                <span>Instagram - das.krstn</span>
                            </a>

                            <a href="https://www.linkedin.com/in/pat-kristian-manalastas-2179682a3" target="_blank" rel="noopener noreferrer" class="social-item">
                                <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM3.56 9h3.553v11.452H3.56zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg>
                                <span>LinkedIn - Pat Kristian Manalastas</span>
                            </a>

                            <a href="https://discord.com/users/435787691339153429" target="_blank" rel="noopener noreferrer" class="social-item">
                                <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 .9-.946 2.4189-2.1568 2.4189Z"/></svg>
                                <span>Discord - dasmeds</span>
                            </a>

                            <a href="https://github.com/dasmeds" target="_blank" rel="noopener noreferrer" class="social-item">
                                <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                                <span>GitHub - dasmeds</span>
                            </a>
                        </div>
                    </div>

                </div>
            </section>
        </div>
        </main>

        <div id="poster-modal" class="modal" aria-hidden="true">
        <div class="modal-backdrop"></div>
        <div class="modal-content" tabindex="-1">
            <button class="close-modal" type="button" aria-label="Close poster details"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg></button>
            <span class="modal-serial" id="modal-serial" aria-hidden="true" hidden></span>
            <span class="modal-edition-title" id="modal-edition-title" aria-hidden="true"></span>
            <button class="modal-previous" type="button" aria-label="Previous item"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5M7.5 10h8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></button>
            <div class="modal-image-container">
                <img class="modal-img-blur" id="modal-img-bg" alt="">
                <img id="modal-img" alt="">
            </div>
            <div class="modal-info">
                <h3 id="modal-title">Title</h3>
                <p id="modal-desc"></p>
                <dl class="modal-datums">
                    <div><dt id="modal-spec-label-one">ISSUER</dt><dd id="modal-spec-value-one"></dd></div>
                    <div><dt id="modal-spec-label-two">ISSUED</dt><dd id="modal-spec-value-two"></dd></div>
                </dl>
            </div>
            <button class="modal-next" type="button" aria-label="Next item"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5M12.5 10h-8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg></button>
        </div>
    </div>

        <footer>
            <div class="container">
                <h2 class="footer-title">Have a project in mind?</h2>
                <p class="footer-contact-text">
                    Contact me: <a href="mailto:indieharry49@gmail.com" class="footer-email">indieharry49@gmail.com</a>
                </p>

                <!-- Social SVG paths are inline and local; verify against current platform brand guides when updating. -->
                    <div class="social-links">
                    <a href="https://www.facebook.com/kristian.manalastas.1?rdid=CKX6pbhutJwmxq06&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CWSYwoSuA%2F" target="_blank" rel="noopener noreferrer" class="social-item">
                        <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>
                        <span>Facebook - Kristian Manalastas</span>
                    </a>

                    <a href="https://www.instagram.com/das.krstn?igsh=cmZ3cnB2cnE0ZzM3" target="_blank" rel="noopener noreferrer" class="social-item">
                        <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
                        <span>Instagram - das.krstn</span>
                    </a>

                    <a href="https://www.linkedin.com/in/pat-kristian-manalastas-2179682a3" target="_blank" rel="noopener noreferrer" class="social-item">
                        <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM3.56 9h3.553v11.452H3.56zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg>
                        <span>LinkedIn - Pat Kristian Manalastas</span>
                    </a>

                    <a href="https://discord.com/users/435787691339153429" target="_blank" rel="noopener noreferrer" class="social-item">
                        <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 .9-.946 2.4189-2.1568 2.4189Z"/></svg>
                        <span>Discord - dasmeds</span>
                    </a>

                    <a href="https://github.com/dasMeds" target="_blank" rel="noopener noreferrer" class="social-item">
                        <svg class="tech-icon social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        <span>GitHub - dasmeds</span>
                    </a>
                </div>

                <p class="copyright">Design & built by Pat Kristian Manalastas @ 2026</p>
            </div>
        </footer>
    </div>

    <?php require __DIR__ . '/../includes/footer.php'; ?>
