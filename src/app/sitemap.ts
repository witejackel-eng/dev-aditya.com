import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dev-aditya.com';

  const routes = [
    '', '/work', '/work/ibs', '/work/corporate-leadgen-platform',
    '/work/aadi-card', '/work/pulse-dashboard', '/about', '/mentoring',
    '/contact', '/resources', '/resources/portfolio-checklist',
    '/resources/ai-website-agency', '/resources/frontend-qa',
    '/privacy', '/terms', '/accessibility',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2026-07-10'),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : route === '/work' ? 0.9 : 0.7,
  }));
}