import { MetadataRoute } from 'next';
import { getCanonicalOrigin } from '@/config/site';
import { getIndexableRoutes } from '@/config/content-registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getCanonicalOrigin();
  const indexable = getIndexableRoutes();

  return indexable.map((route) => ({
    url: `${origin}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
