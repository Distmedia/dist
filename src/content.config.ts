import { defineCollection } from 'astro:content';
import { glob, type Loader, type LoaderContext } from 'astro/loaders';
import { z } from 'astro/zod';
import { isMediaImage } from './lib/media';
import { slugify } from './lib/slugify';

// One CMS singleton file as one entry, with the named markdown fields rendered to HTML at any depth.
function singleton(name: string, markdown: string[] = []): Loader {
  const inner = glob({ pattern: `${name}.yml`, base: './src/content' });

  async function render(value: unknown, context: LoaderContext): Promise<unknown> {
    if (Array.isArray(value)) return Promise.all(value.map((item) => render(item, context)));
    if (value === null || typeof value !== 'object') return value;
    const entries = Object.entries(value).map(async ([key, field]) => [
      key,
      markdown.includes(key) && typeof field === 'string'
        ? (await context.renderMarkdown(field)).html
        : await render(field, context),
    ]);
    return Object.fromEntries(await Promise.all(entries));
  }

  return {
    name: 'singleton',
    load: (context) =>
      inner.load({
        ...context,
        parseData: async (props) =>
          context.parseData({ ...props, data: (await render(props.data, context)) as typeof props.data }),
      }),
  };
}

const slug = z
  .string()
  .min(1)
  .max(80)
  .refine((text) => slugify(text).length > 0, 'Must contain a letter or digit');

const media = z.string().refine(isMediaImage, 'Image not found in public/media');

// The CMS saves cleared fields as empty strings, so treat blank as missing.
function blank<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => (typeof value === 'string' ? value.trim() || undefined : value), schema.optional());
}

// Colliding slugs get a number, so a duplicate name never fails the build.
function withSlugs<T>(items: T[], name: (item: T) => string) {
  const seen = new Set<string>();
  return items.map((item) => {
    const base = slugify(name(item));
    let slug = base;
    for (let n = 2; seen.has(slug); n++) slug = `${base}-${n}`;
    seen.add(slug);
    return { ...item, slug };
  });
}

const site = defineCollection({
  loader: singleton('site'),
  schema: z.object({
    videos: z.object({
      desktop_red: z.string(),
      desktop_green: z.string(),
      desktop_blue: z.string(),
      desktop_purple: z.string(),
      mobile_red: z.string(),
      mobile_green: z.string(),
      mobile_blue: z.string(),
      mobile_purple: z.string(),
    }),
    thumbnail: media,
    favicon: z.string(),
    descriptions: z.object({
      home: z.string(),
      las: blank(z.string()),
      lyssna: blank(z.string()),
    }),
    title: z.string(),
    organization: z.object({
      email: z.string(),
      street_address: z.string(),
      postal_code: z.coerce.string(),
      city: z.string(),
      instagram: z.string().regex(/^[A-Za-z0-9._]{1,30}$/, 'Instagram handle without @'),
    }),
  }),
});

const las = defineCollection({
  loader: singleton('las', ['intro', 'info', 'additional']),
  schema: z.object({
    intro: z.string(),
    people: z
      .array(
        z.object({
          name: slug,
          avatar_red: media,
          avatar_green: media,
          avatar_blue: media,
          avatar_purple: media,
          info: z.string(),
        }),
      )
      .transform((people) => withSlugs(people, (person) => person.name)),
    additional: z.string(),
  }),
});

const lyssna = defineCollection({
  loader: singleton('lyssna', ['info']),
  schema: z.object({
    productions: z
      .array(
        z.object({
          title: slug,
          link: blank(z.url()),
          info: blank(z.string()),
        }),
      )
      .transform((productions) => withSlugs(productions, (production) => production.title)),
  }),
});

export const collections = { site, las, lyssna };
