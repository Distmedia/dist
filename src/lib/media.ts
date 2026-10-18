import type { ImageMetadata } from 'astro';

// CMS uploads live in public/media, so import them from there to let Astro optimize them.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '../../public/media/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  {
    eager: true,
  },
);

export function isMediaImage(path: string): boolean {
  return `../../public${path}` in images;
}

export function mediaImage(path: string): ImageMetadata {
  const image = images[`../../public${path}`];
  if (!image) throw new Error(`Image not found in public/media: ${path}`);
  return image.default;
}
