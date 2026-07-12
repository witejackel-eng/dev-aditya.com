/**
 * RSS / Atom Feed Route Handler
 *
 * Generates an Atom 1.0 feed of resource articles from the content registry.
 * Consumed by RSS readers and feed aggregators.
 * Served at /feed.xml via rewrite in next.config.ts.
 */

import { routes } from '@/config/content-registry';
import { siteConfig, getCanonicalOrigin } from '@/config/site';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const origin = getCanonicalOrigin();
  const resourceArticles = routes.filter((r) => r.type === 'resource-article');

  const feedId = `urn:uuid:${Buffer.from(origin).toString('base64url')}:resources`;
  const now = new Date().toISOString();

  const entries = resourceArticles
    .map((article) => {
      const title = article.title ?? article.path.split('/').pop() ?? 'Untitled';
      const description = article.description ?? '';
      const url = `${origin}${article.path}`;
      const published = article.datePublished
        ? new Date(article.datePublished).toISOString()
        : new Date(article.lastModified).toISOString();
      const updated = new Date(article.lastModified).toISOString();

      return `  <entry>
    <title>${escapeXml(title)}</title>
    <link href="${escapeXml(url)}" rel="alternate" type="text/html" hreflang="en" />
    <id>urn:uuid:${Buffer.from(url).toString('base64url')}</id>
    <updated>${updated}</updated>
    <published>${published}</published>
    <summary>${escapeXml(description)}</summary>
    <author>
      <name>${escapeXml(siteConfig.owner.fullName)}</name>
      <uri>${escapeXml(siteConfig.owner.portfolio)}</uri>
      <email>${escapeXml(siteConfig.owner.email)}</email>
    </author>
    <category term="Web Design" />
    <category term="Web Development" />
  </entry>`;
    })
    .join('\n');

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <title>${escapeXml('Aditya Singh — Web Design & Development Resources')}</title>
  <subtitle>${escapeXml('Practical resources for building better websites: checklists, comparisons, and guides written from real project experience by Aditya Singh.')}</subtitle>
  <link href="${escapeXml(`${origin}/feed.xml`)}" rel="self" type="application/atom+xml" />
  <link href="${escapeXml(`${origin}/resources`)}" rel="alternate" type="text/html" hreflang="en" />
  <id>${feedId}</id>
  <updated>${now}</updated>
  <author>
    <name>${escapeXml(siteConfig.owner.fullName)}</name>
    <uri>${escapeXml(siteConfig.owner.portfolio)}</uri>
    <email>${escapeXml(siteConfig.owner.email)}</email>
  </author>
  <generator uri="https://nextjs.org" version="16">Next.js</generator>
  <rights>Copyright ${new Date().getFullYear()} ${escapeXml(siteConfig.owner.fullName)}</rights>
${entries}
</feed>`;

  return new Response(atomFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
