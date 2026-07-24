import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const routes = [
    '', '/work', '/services', '/process',
    '/work/aarohan-legal', '/work/corporate-leadgen-platform',
    '/work/saffron-steam-experience', '/work/dust-signal',
    '/about', '/contact', '/mentoring',
    '/resources', '/resources/portfolio-checklist',
    '/resources/ai-website-agency', '/resources/frontend-qa',
    '/privacy', '/terms', '/accessibility',
    '/audit',
  ];

  const priorityFor = (route: string) => {
    if (route === '') return 1;
    if (['/work', '/services', '/process', '/contact'].includes(route)) return 0.9;
    if (route === '/audit') return 0.8;
    return 0.7;
  };

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2026-07-24'),
    changeFrequency: 'monthly' as const,
    priority: priorityFor(route),
  }));
}
