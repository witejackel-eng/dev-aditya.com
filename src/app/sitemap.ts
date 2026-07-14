import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dev-aditya.com';

  const routes = [
    '', '/work', '/packages', '/work/saffron-steam-experience', '/work/corporate-leadgen-platform',
    '/work/driftwear-ecommerce', '/work/aarohan-legal', '/about', '/mentoring',
    '/contact', '/resources', '/resources/portfolio-checklist',
    '/resources/ai-website-agency', '/resources/frontend-qa',
    '/privacy', '/terms', '/accessibility',
    '/audit',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date('2026-07-10'),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : route === '/work' ? 0.9 : route === '/audit' ? 0.8 : 0.7,
  }));
}
