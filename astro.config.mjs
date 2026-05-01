import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://phlik.kasion.dev',
  build: {
    assets: '_astro',
  },
  integrations: [svelte()],
});
