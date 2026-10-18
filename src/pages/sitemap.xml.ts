import type { APIRoute } from 'astro';
import { las, lyssna } from '../lib/content';
import { hasPage } from '../lib/productions';

export const GET: APIRoute = ({ site }) => {
  const paths = [
    '/',
    '/las',
    '/lyssna',
    ...las.people.map((person) => `/las/${person.slug}`),
    ...lyssna.productions.filter(hasPage).map((production) => `/lyssna/${production.slug}`),
  ];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
