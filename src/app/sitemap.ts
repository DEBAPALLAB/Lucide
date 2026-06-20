import type { MetadataRoute } from 'next';

const SITE_URL = 'https://lucide.in';

// Single-page site — the homepage is the only indexable route today. As real
// routes are added (e.g. /work/[slug]), append them here. Served at /sitemap.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
