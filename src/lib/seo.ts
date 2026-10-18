import { site as content, type Person } from './content';

const site = import.meta.env.SITE;
const organizationId = new URL('/#organization', site).href;

const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };

function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, entity: string) => entities[entity])
    .replace(/\s+/g, ' ')
    .trim();
}

const email = /[\w.+-]+@[\w-]+(\.[\w-]+)+/g;
const phone = /(?:\+\d|\b0)[\d ()-]{6,}\d/g;
const contactLabel = /\b(?:tel|telefon|mobil|e-?post|mejl|e-?mail|mail)\b\.?:?/gi;
const minSentences = 80;

function isContact(text: string): boolean {
  return (
    text
      .replace(email, '')
      .replace(phone, '')
      .replace(contactLabel, '')
      .replace(/[\s,;|·–-]/g, '') === ''
  );
}

// The first paragraph or list item that isn't only contact details, skipping headings.
// Long ones end at the last whole sentence that fits, or at a word with an ellipsis.
export function excerpt(html: string, max = 160): string | undefined {
  const paragraph = html
    .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g, '</p>')
    .split(/<\/(?:p|li)>/)
    .map(plain)
    .find((text) => !isContact(text));
  if (!paragraph || paragraph.length <= max) return paragraph;
  const sentences = paragraph.slice(0, max + 1).match(/^.*[.!?](?=\s)/)?.[0];
  if (sentences && sentences.length >= minSentences) return sentences;
  return `${paragraph.slice(0, paragraph.lastIndexOf(' ', max - 1))}…`;
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DIST',
    url: new URL('/', site).href,
    inLanguage: 'sv',
    publisher: { '@id': organizationId },
  };
}

export function organizationSchema() {
  const { organization } = content;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: 'DIST',
    url: new URL('/', site).href,
    description: content.descriptions.home,
    email: organization.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: organization.street_address,
      postalCode: organization.postal_code,
      addressLocality: organization.city,
      addressCountry: 'SE',
    },
    sameAs: [`https://www.instagram.com/${organization.instagram}`],
  };
}

export function personSchema(person: Person, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: new URL(`/las/${person.slug}`, site).href,
    image,
    description: excerpt(person.info, Infinity),
    email: person.info.match(email)?.[0],
    telephone: person.info.match(phone)?.[0],
    worksFor: { '@type': 'Organization', '@id': organizationId, name: 'DIST' },
  };
}
