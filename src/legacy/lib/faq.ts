import { plain } from './site';

interface Item { q: string; a: string; }

/** FAQPage structured data. Questions whose answer is still a placeholder are left out. */
export const faqSchema = (items: Item[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items
    .filter((i) => plain(i.a))
    .map((i) => ({ '@type': 'Question', name: plain(i.q), acceptedAnswer: { '@type': 'Answer', text: plain(i.a) } })),
});
