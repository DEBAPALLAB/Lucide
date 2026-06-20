import type { MetadataRoute } from 'next';

const SITE_URL = 'https://lucide.in';

// Served at /robots.txt. Allow everything, point crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
