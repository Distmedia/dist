import type { Theme } from './lib/themes';

declare global {
  interface Window {
    theme: Theme;
  }
}
