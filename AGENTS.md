## Commands

- Dev server: `astro dev --background` (manage with `astro dev stop|status|logs`)
- Lint/format: `npm run lint`, `npm run format` (Biome)
- Build: `npm run build`

## Content

Site content lives in `src/content/*.yml`, edited through Sveltia CMS (`/admin`). When changing a content field, keep `src/content.config.ts` and `public/admin/config.yml` in sync. Media goes in `public/media`.

Astro docs: https://docs.astro.build
