// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages marked noindex in this draft. Keep in step with each page's noindex setting.
const NOT_IN_SITEMAP = [
  '/contact/sent/',
  '/submit-rfq/received/', '/privacy/', '/terms/', '/brand/', '/404/',
  '/options/', '/options/a/', '/options/b/', '/options/c/',
];

export default defineConfig({
  site: 'https://exronglobal.com',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    sitemap({
      filter: (page) => !NOT_IN_SITEMAP.includes(new URL(page).pathname),
    }),
  ],
});
