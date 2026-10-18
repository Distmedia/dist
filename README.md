# Dist

[![Netlify Status](https://api.netlify.com/api/v1/badges/e9320c09-9809-43c9-ace0-c66b5afbb606/deploy-status)](https://app.netlify.com/projects/distmedia/deploys)

Website for Dist Media, live at [dist.se](https://dist.se).

## Stack

- [Astro](https://astro.build): site
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms): content editing at `/admin`, commits to [GitHub](https://github.com/Distmedia/dist)
- [Netlify](https://www.netlify.com): hosting and deploys
- [Oderland](https://www.oderland.se): domain registrar and DNS for `dist.se`

## Versions

- Node 24, pinned in `mise.toml` and `netlify.toml` (`package.json` requires >=22.22.0)
- Astro 7
- Tailwind CSS 4
- Sveltia CMS 0.x (pre-1.0, minor updates can break)
- TypeScript 6
- Biome 2

## Development

```sh
npm install
npm run dev
```

## Deploy

1. Code changes are pushed to GitHub. Content changes saved in the CMS are committed to the `main` branch.
2. Netlify picks up the push and runs `npm run build` (see `netlify.toml`).
3. Pushes to the production branch go live on dist.se. Other branches and pull requests get deploy previews on Netlify.
