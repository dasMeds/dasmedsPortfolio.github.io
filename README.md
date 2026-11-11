# dasmeds Portfolio

A personal portfolio for Pat Kristian Manalastas, bringing together software projects, IT coursework, graphic design, and video edits in an editorial, scroll-led experience.

## Experience and technology

- **Single-page PHP site:** `public/index.php` serves the complete portfolio, with shared templates in `includes/` and structured content in `data/portfolio-data.php`.
- **Vercel:** runs PHP page entrypoints, serves static assets from `public/`, and keeps the Node.js contact function at `/api/contact`.
- **Vite:** bundles the JavaScript modules and dependencies into `public/build/main.js`.
- **GSAP and ScrollTrigger:** reduced-motion-aware text-scramble reveals, clip-path media transitions, a pinned horizontal repository sequence, and a multi-axis scroll-tied orb.
- **Three.js:** a decorative architectural wireframe orb with light/dark contrast, continuous rotation, and a diagonal scroll trajectory.
- **Theme control:** light is the default; the dark theme can be selected and is remembered between visits.
- **Media:** videos are muted, inline-capable MP4s; poster images preserve their full aspect ratio.

## Project structure

```text
.
├── data/
│   └── portfolio-data.php
├── includes/
│   ├── header.php
│   ├── nav.php
│   ├── orb.php
│   └── footer.php
├── public/
│   ├── index.php
│   ├── styles.css
│   ├── build/            # generated JavaScript bundle
│   ├── documents/        # PDF certificates
│   ├── fonts/
│   ├── images/
│   └── videos/
├── api/
│   └── contact.js
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

Requirements: Node.js 20 or newer, npm, and PHP for the optional local PHP development server.

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

Deploy the repository to Vercel using the root `vercel.json`. PHP entrypoints use `vercel-php@0.9.0`; Vite bundles the browser modules to `public/build/main.js`. Set the `RESEND_API_KEY` and `CONTACT_EMAIL` project environment variables; optionally set `CONTACT_FROM` to a sender address verified with Resend. The contact form uses Resend's HTTP API through `api/contact.js`.

Videos use absolute site-root URLs and are activated by the viewport-aware video controller. MP4 files are tracked with Git LFS; ensure the deployment environment checks out LFS objects rather than pointer files.

## Accessibility and performance

- The light theme is available without JavaScript; theme selection is persisted when browser storage is available.
- Motion is reduced when `prefers-reduced-motion` is enabled. The 3D scene becomes a still composition and scroll animations are skipped.
- Showcase videos are muted and inline-capable to meet autoplay policies; playback is limited to the video nearest the viewport center.
- Poster artwork uses `object-fit: contain` so the full design remains visible.
