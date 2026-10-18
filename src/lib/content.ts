import { getEntry } from 'astro:content';

// biome-ignore lint/style/noNonNullAssertion: singleton entries always exist
export const site = (await getEntry('site', 'site'))!.data;
// biome-ignore lint/style/noNonNullAssertion: singleton entries always exist
export const las = (await getEntry('las', 'las'))!.data;
// biome-ignore lint/style/noNonNullAssertion: singleton entries always exist
export const lyssna = (await getEntry('lyssna', 'lyssna'))!.data;

export type Person = (typeof las.people)[number];
export type Production = (typeof lyssna.productions)[number];
