// theme.svelte.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Define theme type
type Theme = 'light' | 'dark';

// Create writable store with initial value
const themeStore = writable<Theme>('light');

// Initialize theme based on localStorage or prefers-color-scheme
if (browser) {
  const stored = localStorage.getItem('theme') as Theme | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
  
  themeStore.set(initialTheme);
  document.documentElement.classList.toggle('dark', initialTheme === 'dark');
}

// Export store and utility functions
export const theme = {
  // Subscribe to the store for reactive updates
  subscribe: themeStore.subscribe,
  
  // Toggle theme
  toggle() {
    themeStore.update((current) => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      if (browser) {
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
      }
      return newTheme;
    });
  },

  // Optional: Explicit initialization (if needed elsewhere)
  init() {
    if (browser) {
      const stored = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
      themeStore.set(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }
  }
};