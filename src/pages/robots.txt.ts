import type { APIRoute } from 'astro';
import { INDEXABLE } from '../lib/hosting';

/** Blocks all crawling on the temporary address; allows it on exronglobal.com. */
export const GET: APIRoute = () =>
  new Response(
    INDEXABLE
      ? 'User-agent: *\nDisallow: /admin/\n\nSitemap: https://exronglobal.com/sitemap-index.xml\n'
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
