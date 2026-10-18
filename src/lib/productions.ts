type Fields = { link?: string; info?: string };

export function hasLinkOrInfo(production: Fields): boolean {
  return Boolean(production.link?.trim() || production.info?.trim());
}

// Productions with info get their own page; the rest link straight out.
export function hasPage<T extends Fields>(production: T): production is T & { info: string } {
  return Boolean(production.info?.trim());
}
