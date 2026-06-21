'use client';

import { useState } from 'react';

/**
 * FAQ — brand disambiguation + exact-phrase targeting.
 *
 * Two jobs:
 *  1. SEO: the questions use the literal phrases people type ("What is Lucide
 *     Tech", "Is Lucide Tech the same as Lucide icons") and the answers tie the
 *     brand to "Tech Lucide" / "Lucide" so Google separates us from lucide.dev,
 *     lucid.co, and the other Lucid* companies. A FAQPage JSON-LD block (below)
 *     makes the Q&A eligible for rich results.
 *  2. UX: it reads as an editorial "Frequently asked" close to the site, in the
 *     same mono-label + bold-sans language as the rest of the page.
 */

type QA = { q: string; a: string };

export const faqs: QA[] = [
  {
    q: 'What is Lucide Tech?',
    a: 'Lucide Tech is a premium web design and development studio based in Nagpur, India, working with clients across India and worldwide. We build bespoke, high-performance websites, web apps, and SaaS products for ambitious brands — from interface design through full-stack engineering and search visibility.',
  },
  {
    q: 'Where is Lucide Tech based?',
    a: 'Lucide Tech is based in Nagpur, Maharashtra, India. We work remote-first with clients across India and internationally, so location is never a constraint on the projects we take on.',
  },
  {
    q: 'Is Lucide Tech the same as Tech Lucide?',
    a: 'Yes. Lucide Tech and Tech Lucide refer to the same studio — it’s the same team, the same work, reachable at team@lucide.in and on lucide.in.',
  },
  {
    q: 'Is Lucide Tech related to the Lucide icon library (lucide.dev)?',
    a: 'No. Lucide Tech is an independent web design and development agency. We are not affiliated with the Lucide open-source icon library, Lucidchart, or any other company using a similar name.',
  },
  {
    q: 'What services does Lucide Tech offer?',
    a: 'Four core services: conversion-focused interface design, custom web development engineered for performance, full product builds (SaaS and mobile apps), and SEO and growth so the work keeps paying off after launch.',
  },
  {
    q: 'How do I contact Lucide Tech?',
    a: 'Email team@lucide.in, message us on WhatsApp, or start a project through the contact form on lucide.in. We reply within one business day.',
  },
];

function FaqJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function FaqRow({ q, a, index }: QA & { index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-cursor="cta"
        aria-expanded={open}
        className="group flex w-full items-center gap-5 py-7 text-left md:gap-8 md:py-8"
      >
        <span className="font-mono text-[10px] tabular-nums text-white/30 transition-colors duration-300 group-hover:text-blue-sphere">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="flex-1 font-heading text-[clamp(20px,2.4vw,30px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white/85 transition-colors duration-300 group-hover:text-white">
          {q}
        </h3>
        <span
          aria-hidden
          className="relative grid h-6 w-6 shrink-0 place-items-center text-white/45 transition-colors duration-300 group-hover:text-white"
        >
          <span className="absolute h-px w-3.5 bg-current" />
          <span
            className="absolute h-3.5 w-px bg-current transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: open ? 'scaleY(0)' : 'scaleY(1)' }}
          />
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="max-w-[60ch] pb-8 pl-[calc(10px+1.25rem)] font-body text-[clamp(14px,1.1vw,16px)] font-light leading-[1.7] text-white/50 md:pl-[calc(10px+2rem)]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section
      id="faq"
      aria-label="Frequently asked questions about Lucide Tech"
      className="relative w-full bg-[#05070c] px-6 py-24 md:px-[clamp(24px,5vw,80px)] md:py-28"
    >
      <FaqJsonLd />
      <div className="mx-auto w-full max-w-[1400px] border-t border-white/10 pt-14">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <h2 className="font-heading text-[clamp(38px,4.6vw,68px)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
              Frequently
              <br />
              asked<span className="text-blue-sphere">.</span>
            </h2>
            <p className="mt-7 max-w-xs font-body text-[15px] font-light leading-[1.6] text-white/45">
              The short answers — who we are, what we do, and how Lucide Tech is
              different.
            </p>
          </div>

          <div>
            {faqs.map((item, i) => (
              <FaqRow key={item.q} index={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
