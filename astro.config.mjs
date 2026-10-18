// @ts-check

import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { demoteHeadings } from './src/lib/demote-headings';
import { externalLinks } from './src/lib/external-links';

const { CONTEXT, DEPLOY_PRIME_URL } = process.env;

export default defineConfig({
  site: CONTEXT === 'production' || !DEPLOY_PRIME_URL ? 'https://dist.se' : DEPLOY_PRIME_URL,
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  markdown: {
    processor: satteri({ mdastPlugins: [demoteHeadings], hastPlugins: [externalLinks] }),
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 3000,
    },
  },
});
