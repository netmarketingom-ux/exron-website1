import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One Markdown file per page in src/content/pages/.
 * Page copy lives in the YAML frontmatter (structured sections);
 * the Markdown body is used for long-form pages (Privacy Policy, Terms of Use).
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z
    .object({
      seoTitle: z.string(),
      seoDescription: z.string(),
    })
    .passthrough(),
});

export const collections = { pages };
