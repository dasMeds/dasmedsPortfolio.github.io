# dasmeds Portfolio

A personal portfolio for Pat Kristian Manalastas, bringing together software projects, IT coursework, graphic design, and video edits in an editorial, scroll-led experience.

## Experience and technology

- **Multi-page static site:** semantic HTML pages styled with modular CSS and small JavaScript modules.
- **Vite:** local development server and optimized multi-page production build. Static files in `public/` are published at the site root.
- **GSAP and ScrollTrigger:** reduced-motion-aware kinetic headings, scroll reveals, and subtle parallax.
- **Three.js:** a lightweight, decorative 3D wireframe field that responds gently to pointer movement and scrolling.
- **Theme control:** light is the default; the dark theme can be selected and is remembered between pages and visits.
- **Media:** videos are muted, inline-capable MP4s; poster images preserve their full aspect ratio.

## Project structure

```text
.
├── about.html
├── contact.html
├── experience.html
├── index.html
├── portfolio.html
├── public/
│   ├── documents/        # PDF certificates
│   ├── fonts/
│   ├── images/
│   └── videos/
├── src/
│   ├── css/styles.css
│   └── js/
│       ├── interactions.js
│       ├── main.js
│       ├── motion.js
│       ├── scene.js
│       └── theme.js
├── vite.config.js
└── package.json
```

The HTML entry pages remain at the repository root for simple multi-page hosting. Vite copies `public/` files without renaming them, so media can use stable root-relative URLs such as `/images/profile-picture.jpg` and `/videos/demoreel-showcase.mp4`.

## Local development

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview the production build:

```sh
npm run build
npm run preview
```

The production site is written to `dist/`. Do not edit generated files in `dist/`; make changes in the HTML, `src/`, or `public/` instead.

## Deployment

### Vercel

Import the repository into Vercel and use the Vite defaults, or configure:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

Videos use absolute site-root URLs, include the browser-friendly muted/inline playback attributes, and are activated by the viewport-aware video controller. Ensure Git LFS is enabled for deployment so MP4 files are fetched as actual media rather than LFS pointer text.

The current MP4 assets are each larger than 100 MB. Vercel documents a 100 MB source-upload limit for Hobby CLI deployments, so deploying this repository directly with the CLI will require compressing the videos or hosting them externally. For Git-based deployments, confirm the build has access to the LFS objects.

### GitHub Pages

The GitHub Actions workflow builds the site with Node.js and deploys `dist/`. MP4 files are tracked with Git LFS; the workflow checks out LFS content before building.

## Accessibility and performance

- The light theme is available without JavaScript; theme selection is persisted when browser storage is available.
- Motion is reduced when `prefers-reduced-motion` is enabled. The 3D scene becomes a still composition and scroll animations are skipped.
- Showcase videos are muted and inline-capable to meet autoplay policies; playback is limited to the video nearest the viewport center.
- Poster artwork uses `object-fit: contain` so the full design remains visible.
