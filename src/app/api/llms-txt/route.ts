/**
 * llms.txt Route Handler
 *
 * Generates a plain-text llms.txt file following the llms.txt convention
 * (https://llmstxt.org/) — a machine-readable overview of the site for
 * LLM consumers and AI agents.
 *
 * IMPORTANT: All case studies are portfolio projects (not client work).
 * Served at /llms.txt via rewrite in next.config.ts.
 */

import { routes } from '@/config/content-registry';

export async function GET() {
  const resourceArticles = routes.filter((r) => r.type === 'resource-article');
  const caseStudies = routes.filter((r) => r.type === 'case-study');
  const servicePages = routes.filter((r) => r.type === 'service-page');
  const otherPages = routes.filter(
    (r) =>
      r.type !== 'resource-article' &&
      r.type !== 'case-study' &&
      r.type !== 'service-page' &&
      r.type !== 'legal' &&
      r.type !== 'resource-hub' &&
      r.type !== 'service-hub' &&
      r.path !== '/',
  );

  const baseUrl = 'https://dev-aditya.com';

  const lines: string[] = [
    '# Aditya Singh — Web Designer & Next.js Developer',
    '',
    '> Delhi-based web designer and front-end developer building premium websites for service businesses, startups, and independent brands.',
    '',
    '- Owner: Aditya Singh',
    '- Location: Delhi, India',
    '- Email: hi.aditya.dev@gmail.com',
    '- GitHub: https://github.com/witejackel-eng',
    `- Portfolio: ${baseUrl}`,
    '',
  ];

  // Services
  lines.push('## Services');
  for (const svc of servicePages) {
    const label = svc.title ?? 'Untitled';
    lines.push(`- ${label}: ${baseUrl}${svc.path}`);
  }
  lines.push('');

  // Case Studies — all are portfolio projects, not client work
  lines.push('## Case Studies');
  for (const cs of caseStudies) {
    const label = cs.title ?? 'Untitled';
    lines.push(`- ${label} (Portfolio Project): ${baseUrl}${cs.path}`);
  }
  lines.push('');

  // Resources
  lines.push('## Resources');
  for (const res of resourceArticles) {
    const label = res.title ?? 'Untitled';
    lines.push(`- ${label}: ${baseUrl}${res.path}`);
  }
  lines.push('');

  // Other Pages
  lines.push('## Other Pages');
  for (const pg of otherPages) {
    const slug = pg.path.replace(/^\//, '');
    const label = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    lines.push(`- ${label}: ${baseUrl}${pg.path}`);
  }
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
