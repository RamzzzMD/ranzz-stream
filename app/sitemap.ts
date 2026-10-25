import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ranzzajaah.bio';
  const now = new Date();

  const staticRoutes = [
    '',
    '/movies',
    '/series',
    '/anime',
    '/kdrama',
    '/collections',
    '/search',
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
