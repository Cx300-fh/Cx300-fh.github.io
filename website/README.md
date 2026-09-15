# Yuxin Li — Personal Research Homepage

English academic homepage for Yuxin Li, Tsinghua University (Xinya College / Department of Electronic Engineering).

## Develop

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
```

The static site is exported to `dist/client/`. It has no backend, tracking, sign-in, or third-party font dependency.

## Edit content

- `app/page.tsx`: profile, publications, research experience, and awards.
- `app/globals.css`: typography, colors, layout, and responsive styling.
- `public/interactions.js`: scroll reveals, pointer tilt, and email copy.
- `public/images/avatar.jpg`: user-supplied WeChat avatar.
- `public/Yuxin-Li-CV.pdf`: English CV.

Paper titles, authors, and project links were checked against arXiv and the papers' official project pages on 6 September 2026. Both works are described as 2026 research/preprints; no conference acceptance is claimed. Individual research contributions were not inferred from authorship order.

## Sources and motion references

- MBench: https://arxiv.org/abs/2606.00793 and https://peanutup.github.io/MBench-project/
- ParallelWorld: https://arxiv.org/abs/2608.22971 and https://chen-min-22.github.io/ParallelWorld-page/
- Research figures are from the respective project pages; ownership remains with their authors.
- The profile, experience, awards, and CV content were supplied by Yuxin Li.
- Motion: https://motion.dev/docs/react — scroll reveals and gesture interaction reference.
- GSAP: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — scroll-triggered animation reference.
- Rive: https://www.rive.app/use-cases/websites — an option for future interactive mascot animation.

Current interactions use native Web Animations, IntersectionObserver, and CSS, with reduced-motion support. No third-party animation embeds or subscriptions are required.

The export step removes unused React hydration and makes asset URLs relative. The same output works at a root domain or a GitHub Pages repository path. All interactions are progressively enhanced by `public/interactions.js`.
