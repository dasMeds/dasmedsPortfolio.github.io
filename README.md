# dasmeds Portfolio

A personal portfolio for Pat Kristian Manalastas, bringing together software projects, IT coursework, graphic design, and video edits in an editorial, scroll-led experience.

## Experience and technology

- **Single-page PHP site:** `public/index.php` serves the complete portfolio, with shared templates in `includes/` and structured content in `data/portfolio-data.php`.
- **Vercel:** runs the PHP site in a FrankenPHP container and serves static assets from `public/`.
- **Vite:** bundles the JavaScript modules and dependencies into `public/build/main.js`.
- **GSAP and ScrollTrigger:** reduced-motion-aware text-scramble reveals, clip-path media transitions, a pinned horizontal repository sequence, and a multi-axis scroll-tied orb.
- **Three.js:** a decorative architectural wireframe orb with light/dark contrast, continuous rotation, and a diagonal scroll trajectory.
- **Theme control:** light is the default; the dark theme can be selected and is remembered between visits.
- **Media:** videos are muted, inline-capable MP4s when Git LFS objects are present; poster images preserve their full aspect ratio.

## Project structure

```text
.
├── data/
│   └── portfolio-data.php
├── includes/
│   ├── header.php
│   ├── nav.php
│   ├── orb.php
│   ├── footer.php
│   └── contact-handler.php
├── public/
│   ├── index.php
│   ├── router.php
│   ├── styles.css
│   ├── build/            # generated JavaScript bundle
│   ├── documents/        # PDF certificates
│   ├── fonts/
│   ├── images/
│   └── videos/
├── api/
│   └── contact.js
├── Caddyfile
├── Dockerfile
├── vercel.json
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

Requirements: Node.js 22 or newer, npm, and PHP 8.1 or newer with cURL and mbstring extensions. Docker and the Vercel CLI are required to test and deploy the container.

```sh
npm ci
npm run build
npm run dev
```

Open `http://localhost:8000`. The JavaScript bundle must be rebuilt after changing files under `src/js/`:

```sh
npm run build
```

Do not edit `public/build/main.js`; it is generated from `src/js/`.

The orb visibility script starts the PHP development server on port 8000 by default:

```sh
npm run test:orb-visibility
```

To run it against an already-running site or a preview deployment, set `ORB_VISIBILITY_URL` to that site's origin.

## Deployment

Vercel's Container Runtime and Services are currently in Beta and are documented as available on all plans. This project uses the explicit `services` configuration because the repository also contains Vite; current Vercel docs only auto-select the root `Dockerfile` when no other framework is detected. The Docker build runs `npm ci` and `npm run build`, then serves the generated `public/build/main.js` and PHP site through FrankenPHP and Caddy.

Before changing a live deployment, use Vercel's Instant Rollback from the last working deployment. Add the contact variables to both Production and Preview; each command prompts for the value:

```sh
vercel env add RESEND_API_KEY production
vercel env add RESEND_API_KEY preview
vercel env add CONTACT_EMAIL production
vercel env add CONTACT_EMAIL preview
vercel env add CONTACT_FROM production
vercel env add CONTACT_FROM preview
```

`CONTACT_FROM` is optional and should be a sender address verified with Resend. Never commit real values; `.env.example` contains placeholders, and local `.env*` files are ignored. Redeploy after changing environment variables.

Create and verify a Preview deployment before production:

```sh
vercel link
vercel deploy
```

Check `/health`, the generated `/build/main.js`, PHP routes, static asset cache headers, contact-form outcomes, browser console, and orb visibility on the preview URL. Then, only after all preview checks pass, deploy production with `vercel deploy --prod`.

The contact form is routed through `includes/contact-handler.php` and sends mail with Resend. `api/contact.js` is retained during the preview migration and is not the container's request handler.

Videos use absolute site-root URLs and are activated by the viewport-aware video controller. MP4 files are tracked with Git LFS. The Docker build removes unresolved LFS pointer files instead of publishing them; real video playback in the deployment therefore depends on the build context containing the actual LFS objects. Confirm the MP4 routes in the Preview deployment before promoting it.

## Accessibility and performance

- The light theme is available without JavaScript; theme selection is persisted when browser storage is available.
- Motion is reduced when `prefers-reduced-motion` is enabled. The 3D scene becomes a still composition and scroll animations are skipped.
- Showcase videos are muted and inline-capable to meet autoplay policies; playback is limited to the video nearest the viewport center.
- Poster artwork uses `object-fit: contain` so the full design remains visible.
