// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://1000gracias.studio',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
