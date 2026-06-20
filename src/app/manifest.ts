import type { MetadataRoute } from 'next';

// Served at /manifest.webmanifest. Google reads `name` here as part of the
// brand-entity signal, so the names mirror the structured data exactly.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lucide Tech — Web Design & Development Agency',
    short_name: 'Lucide Tech',
    description:
      'Premium web design & development studio. Lucide Tech (Tech Lucide) builds bespoke, high-performance websites and digital products.',
    start_url: '/',
    display: 'standalone',
    background_color: '#06080d',
    theme_color: '#06080d',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
