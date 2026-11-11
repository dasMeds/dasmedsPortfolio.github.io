# dasmeds Portfolio

A personal portfolio for Pat Kristian Manalastas, bringing together software projects, IT coursework, graphic design, and video edits in an editorial, scroll-led experience.

## Experience and technology

- **Single-page PHP site:** `public/index.php` serves the complete portfolio, with navigation between sections using page anchors.
- **PHP:** serves the page and its local assets; use a PHP-capable web host.
- **Vite:** bundles the JavaScript modules and dependencies into `public/build/main.js`.
- **GSAP and ScrollTrigger:** reduced-motion-aware text-scramble reveals, clip-path media transitions, a pinned horizontal repository sequence, and a multi-axis scroll-tied orb.
- **Three.js:** a decorative architectural wireframe orb with light/dark contrast, continuous rotation, and a diagonal scroll trajectory.
- **Theme control:** light is the default; the dark theme can be selected and is remembered between visits.
- **Media:** videos are muted, inline-capable MP4s; poster images preserve their full aspect ratio.

## Project structure

```text
.
├── public/
│   ├── index.php
│   ├── styles.css
│   ├── build/            # generated JavaScript bundle
│   ├── documents/        # PDF certificates
│   ├── fonts/
│   ├── images/
│   └── videos/
├── src/
│   └── js/
│       ├── interactions.js
│       ├── main.js
│       ├── motion.js
│       ├── scene.js
│       └── theme.js
├── vite.config.js
└── package.json
```

The `public/` directory is the web document root. Static media uses URLs such as `/images/profile-picture.jpg` and `/videos/demoreel-showcase.mp4`.

## Local development

Requirements: PHP 8.0 or newer, Node.js 20 or newer, and npm.

```sh
npm install
npm run build
npm run dev
```

Open `http://localhost:8000`. The JavaScript bundle must be rebuilt after changing files under `src/js/`:

```sh
npm run build
```

Do not edit `public/build/main.js`; it is generated from `src/js/`.

## Deployment

Deploy the repository to a PHP-capable host, set `public/` as the document root, and run `npm ci && npm run build` during deployment. GitHub Pages and the previous static Vercel configuration do not execute PHP.

Videos use absolute site-root URLs and are activated by the viewport-aware video controller. Ensure Git LFS is enabled so MP4 files are deployed as media rather than pointer text.

## Accessibility and performance

- The light theme is available without JavaScript; theme selection is persisted when browser storage is available.
- Motion is reduced when `prefers-reduced-motion` is enabled. The 3D scene becomes a still composition and scroll animations are skipped.
- Showcase videos are muted and inline-capable to meet autoplay policies; playback is limited to the video nearest the viewport center.
- Poster artwork uses `object-fit: contain` so the full design remains visible.
