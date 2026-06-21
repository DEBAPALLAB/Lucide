'use client';

import { useState, useEffect } from 'react';

const EMAIL = 'team@lucide.in';

const sitemap = [
  { label: 'Home', id: 'hero' },
  { label: 'Capabilities', id: 'work' },
  { label: 'Work', id: 'projects' },
  { label: 'Team', id: 'team' },
  { label: 'Contact', id: 'contact' },
  { label: 'FAQ', id: 'faq' },
];

const socials = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/techlucide' },
  { label: 'Instagram', href: 'https://instagram.com/lucide.tech' },
  { label: 'X / Twitter', href: 'https://x.com/techlucide' },
];

type Lenis = { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void };
const getLenis = () => (window as unknown as { lenis?: Lenis }).lenis;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis?.scrollTo) lenis.scrollTo(el, { offset: -80 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
  const lenis = getLenis();
  if (lenis?.scrollTo) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Giant closing wordmark — a clean gradient-clipped "Lucide" with an orange spark
   replacing the dot of the i. The clipped text and the spark are SEPARATE layers
   (the spark lives outside the bg-clip-text run, so its glow never gets clipped or
   reads as a dark box). The lower portion melts away via a bottom fade-mask. */
function GiantWordmark() {
  return (
    <span
      aria-hidden
      className="relative inline-block font-accent font-bold leading-[0.78] tracking-[-0.04em]"
      style={{ fontSize: 'clamp(78px, 21.5vw, 360px)' }}
    >
      {/* The word, clipped to a white→grey gradient, with a bottom fade-mask. "ı"
          is the dotless i (U+0131) so there's no natural tittle to clash with —
          its stem still inherits the clip like every other letter. */}
      <span
        className="bg-linear-to-b from-white to-white/18 bg-clip-text text-transparent"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, #000 50%, rgba(0,0,0,0.5) 80%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 50%, rgba(0,0,0,0.5) 80%, transparent 100%)',
        }}
      >
        Luc&#x131;de
      </span>
      {/* Orange spark = the tittle. A SIBLING of the clipped run (not a descendant),
          so its colour/glow is never clipped and no dark box appears. The soft edge
          is a radial gradient fading to transparent — not a box-shadow. */}
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          left: '57.2%',
          top: '0.05em',
          width: '0.14em',
          height: '0.14em',
          background: 'radial-gradient(circle at 36% 32%, #fcd34d 0%, #f97316 46%, #ef4444 100%)',
        }}
      />
    </span>
  );
}

function ColLink({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const className =
    'group/fl inline-flex items-center gap-1.5 font-body text-[14px] text-white/45 transition-colors duration-300 hover:text-white';
  const arrow = (
    <span className="text-[11px] text-white/0 transition-all duration-300 -translate-x-1 group-hover/fl:translate-x-0 group-hover/fl:text-blue-sphere">
      {href ? '↗' : '→'}
    </span>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="cta" className={className}>
      {children}
      {arrow}
    </a>
  ) : (
    <button type="button" onClick={onClick} data-cursor="cta" className={className}>
      {children}
      {arrow}
    </button>
  );
}

export default function Footer() {
  const [time, setTime] = useState('--:--:--');
  const year = new Date().getFullYear();

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <footer className="relative w-full overflow-hidden bg-void px-6 pt-24 pb-9 md:px-[clamp(24px,5vw,80px)] md:pt-32">
      {/* Ambient corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-blue-sphere/6 blur-[130px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        {/* Closing CTA + columns */}
        <div className="grid gap-16 border-t border-white/10 pt-16 md:grid-cols-[1.25fr_1fr] md:gap-24 md:pt-20">
          {/* CTA */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
              Let&apos;s collaborate
            </span>
            <h2 className="mt-7 font-heading text-[clamp(38px,4.6vw,72px)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
              Let&apos;s build something{' '}
              <span
                className="text-white/90"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
              >
                people remember
              </span>
              <span className="text-blue-sphere">.</span>
            </h2>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="button"
                onClick={() => scrollToId('contact')}
                data-cursor="cta"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-body text-[13px] font-semibold uppercase tracking-[0.04em] text-[#06080d] transition-all duration-300 hover:bg-blue-sphere hover:text-white hover:shadow-[0_14px_38px_rgba(59,127,232,0.34)]"
              >
                Start a project
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </button>
              <a
                href={`mailto:${EMAIL}`}
                data-cursor="cta"
                className="group/fl inline-flex items-center gap-2 font-body text-[14px] text-white/55 transition-colors duration-300 hover:text-white"
              >
                <span className="relative">
                  {EMAIL}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/60 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/fl:scale-x-100" />
                </span>
              </a>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:justify-items-end">
            <nav className="flex flex-col gap-3.5">
              <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">Sitemap</span>
              {sitemap.map((s) => (
                <ColLink key={s.id} onClick={() => scrollToId(s.id)}>
                  {s.label}
                </ColLink>
              ))}
            </nav>

            <nav className="flex flex-col gap-3.5">
              <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">Social</span>
              {socials.map((s) => (
                <ColLink key={s.label} href={s.href}>
                  {s.label}
                </ColLink>
              ))}
            </nav>

            <div className="col-span-2 flex flex-col gap-3.5 sm:col-span-1">
              <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">Studio</span>
              <span className="font-body text-[14px] leading-relaxed text-white/45">
                Remote-first
                <br />
                Working worldwide · IST
              </span>
              <span className="mt-1 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available for work
              </span>
            </div>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="mt-20 md:mt-28">
          <GiantWordmark />
        </div>

        {/* Bottom status bar */}
        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
            © {year} Lucide Tech — All rights reserved
          </span>

          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
              India · IST <span className="text-white/55 tabular-nums">{time}</span>
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              data-cursor="cta"
              className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 transition-colors duration-300 hover:text-white"
            >
              Back to top
              <span className="grid h-6 w-6 place-items-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-white/40 group-hover:-translate-y-0.5">
                ↑
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
