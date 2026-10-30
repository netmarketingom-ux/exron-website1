import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    seo_title: z.string(),
    description: z.string(),
    summary: z.string(),
    noindex: z.boolean().default(true),
  }),
});

export const collections = { pages };
