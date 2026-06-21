import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.lucide.in';

// Served at /robots.txt. Allow all standard crawlers AND explicitly welcome the
// AI answer-engine crawlers (GEO) — these fetch content for ChatGPT, Claude,
// Perplexity, Gemini, etc. Listing them by name makes intent unambiguous so
// none are accidentally blocked by a future wildcard tweak.
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    'GPTBot', // OpenAI / ChatGPT
    'OAI-SearchBot', // ChatGPT Search
    'ChatGPT-User', // ChatGPT live browsing
    'ClaudeBot', // Anthropic / Claude
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot', // Perplexity
    'Perplexity-User',
    'Google-Extended', // Gemini / AI Overviews training
    'Applebot-Extended', // Apple Intelligence
    'CCBot', // Common Crawl (feeds many LLMs)
    'Bytespider',
    'Amazonbot',
    'cohere-ai',
    'Meta-ExternalAgent',
  ];
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: aiBots, allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
