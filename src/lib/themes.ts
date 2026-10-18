export const themes = ['red', 'green', 'blue', 'purple'] as const;

export type Theme = (typeof themes)[number];
