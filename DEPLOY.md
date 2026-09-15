# Website maintenance

This repository hosts Yuxin Li's personal research homepage.

- Public site: https://cx300-fh.github.io/
- Primary repository: `Cx300-fh/Cx300-fh.github.io`.
- The original profile repository keeps a working copy at https://cx300-fh.github.io/Cx300-fh/.
- Publishing source: `main` branch, `/docs` folder (GitHub Pages).
- Editable source: `website/`.
- English CV: `website/public/Yuxin-Li-CV.pdf`.

The five navigation tabs are Blog, CV, Publications, Gallery, and Projects. Shared navigation and the profile sidebar live in `website/components/site.tsx`. Paper, project, and experience data live in `website/lib/content.ts`. Styling lives in `website/app/globals.css`.

Blog posts are intentionally empty. The image-card layout is ready in `website/app/blog/page.tsx`. To add an article, create its page under `website/app/blog/<slug>/page.tsx`, then add a record to `website/lib/posts.ts` with its title, excerpt, image, category, tags, date, reading time, and matching route. Unpublished drafts should stay out of that array. Gallery content lives in `website/app/gallery/page.tsx`.

Project cover images are conceptual diagrams, not photographs of the competition systems. Publication figures link back to their original project pages.

To update the website, edit the relevant source files, then run:

```sh
cd website
npm ci
npm run build
```

Copy all files from `website/dist/client/` into `docs/`, including `.nojekyll`, and commit the changes. GitHub Pages publishes updates pushed to `main`.

The website uses relative asset URLs and native JavaScript interactions, and supports reduced motion. It does not require a database or server.
