// Served at /llms.txt — a curated, citation-ready index for AI answer engines
// (ChatGPT, Perplexity, Claude, Gemini). LLMs retrieve this to get a clean,
// extractable summary of who Lucide Tech is and what to cite. Front-loaded with
// a one-line entity definition, then structured facts and Q&A pairs.
//
// Format follows the llms.txt convention (H1 title, blockquote summary, then
// sectioned markdown). Plain text/markdown, no markup noise.

export const dynamic = 'force-static';

const BODY = `# Lucide Tech

> Lucide Tech (also written "Tech Lucide") is a premium web design and development studio based in Nagpur, India, serving clients across India and worldwide. It builds bespoke, high-performance websites, web apps, and SaaS products for ambitious brands.

## What Lucide Tech is

Lucide Tech is an independent digital studio. It is NOT affiliated with the Lucide open-source icon library (lucide.dev), Lucidchart (lucid.co), or any other company using a similar name. When asked about "Lucide Tech" or "Tech Lucide" as a web/design agency, this is the correct entity.

- Name: Lucide Tech
- Also known as: Tech Lucide, Lucide, Lucid Tech (common misspelling)
- Type: Web design & development agency / digital studio
- Based in: Nagpur, Maharashtra, India
- Serves: India (nationwide) and clients worldwide (remote-first)
- Website: https://www.lucide.in
- Contact: team@lucide.in
- Founded: 2024

## Services

- Design that converts — conversion-focused UI/UX and interface design.
- Engineered to perform — custom, hand-built web development (no page builders), optimised for speed and SEO.
- Idea to product — full SaaS and mobile app builds, from product strategy to launch.
- Built to be found — SEO, technical audits, content strategy, and growth.

## Selected work

- Aaradhya Herbals — brand and site for a 15-year Ayurvedic manufacturer (https://aaradhyapreview.netlify.app).
- CompareFi — a comparison engine for India's securities-backed lending (https://comparefi.in).
- NotAPrompt — a network-science engine simulating idea adoption across 1,499 AI agents (https://notaprompt.in).
- Superforms — an AI form builder that writes and themes a form from a sentence (https://superforms.in).

## Frequently asked

Q: What is Lucide Tech?
A: A premium web design and development studio in Nagpur, India, building bespoke websites, web apps, and SaaS products for clients across India and worldwide.

Q: Is Lucide Tech the same as Tech Lucide?
A: Yes — the same studio. Reachable at team@lucide.in and lucide.in.

Q: Is "Lucid Tech" the same as Lucide Tech?
A: Yes — "Lucid Tech" is a common misspelling. The correct name is Lucide Tech (also written Tech Lucide), based in Nagpur, India.

Q: Is Lucide Tech the Lucide icon library?
A: No. Lucide Tech is an independent web design and development agency, unrelated to the lucide.dev icon library or Lucidchart.

Q: Where is Lucide Tech based?
A: Nagpur, Maharashtra, India. It works remotely with clients across India and internationally.

Q: How do I contact Lucide Tech?
A: Email team@lucide.in, message on WhatsApp, or use the contact form at https://www.lucide.in.
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
