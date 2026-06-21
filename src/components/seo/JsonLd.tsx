/**
 * JsonLd — structured data for entity disambiguation.
 *
 * The bare word "Lucide" is dominated by lucide.dev (the icon library). These
 * schemas teach Google that "Lucide Tech" / "Tech Lucide" is a DISTINCT brand
 * entity — an agency — by tying the name, alternate names, and every social
 * profile (sameAs) together. This is what wins the two-word queries immediately
 * and, over time, earns a knowledge presence for the brand.
 *
 * Rendered as <script type="application/ld+json"> in the <head>. Invisible to
 * humans, machine-readable to crawlers. No layout impact whatsoever.
 */

const SITE_URL = 'https://www.lucide.in';

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Lucide Tech',
  alternateName: ['Tech Lucide', 'Lucide', 'Lucide Agency', 'Lucid Tech'],
  legalName: 'Lucide Tech',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/opengraph-image`,
  description:
    'Lucide Tech (Tech Lucide) is a premium web design and development studio building high-performance, bespoke websites, web apps, and digital products for ambitious brands.',
  email: 'team@lucide.in',
  foundingDate: '2024',
  slogan: 'We build what finds you in the dark.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nagpur',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  areaServed: [
    { '@type': 'City', name: 'Nagpur' },
    { '@type': 'Country', name: 'India' },
  ],
  knowsAbout: [
    'Web Design',
    'Web Development',
    'UI/UX Design',
    'SaaS Development',
    'Web Application Development',
    'SEO',
    'Brand Identity',
  ],
  // sameAs ties the brand entity across the web — the core of disambiguation.
  sameAs: [
    'https://x.com/techlucide',
    'https://www.linkedin.com/company/techlucide',
    'https://instagram.com/lucide.tech',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'team@lucide.in',
    contactType: 'sales',
    availableLanguage: ['English'],
  },
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Lucide Tech',
  alternateName: ['Tech Lucide', 'Lucide', 'Lucid Tech'],
  description:
    'Premium web design & development agency — Lucide Tech builds bespoke, high-performance websites and digital products.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en',
};

const professionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#service`,
  name: 'Lucide Tech',
  alternateName: 'Tech Lucide',
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  email: 'team@lucide.in',
  description:
    'Bespoke web design, development, SaaS builds, and SEO. Based in Nagpur, India — serving clients across India and worldwide.',
  priceRange: '$$$',
  // Home city (Nagpur) for local-pack relevance; remote-first so no street
  // address. areaServed covers both the city and the country.
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nagpur',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  areaServed: [
    { '@type': 'City', name: 'Nagpur' },
    { '@type': 'Country', name: 'India' },
  ],
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Design that converts — UI/UX & interface design' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Engineered to perform — custom web development' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Idea to product — SaaS & app builds' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Built to be found — SEO & growth' } },
    ],
  },
};

export default function JsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [organization, website, professionalService],
  };
  return (
    <script
      type="application/ld+json"
      // Schemas are static, author-controlled strings — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
