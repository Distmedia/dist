import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [
    tailwind(), 
    react(),
    sanity({
      projectId: '6gim9zt5',
      dataset: 'production',
      useCdn: false,
      apiVersion: "2023-03-20",
      studioBasePath: '/admin'
    }),
  ],
  redirects: {
    // Three levels of nested routes
    '/admin/[slug]': '/admin',
    '/admin/[slug]/[slug]': '/admin',
    '/admin/[slug]/[slug]/[slug]': '/admin'
  }
});