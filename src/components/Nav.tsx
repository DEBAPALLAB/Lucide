'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const homeLink = { label: 'Home', href: '#hero', id: 'hero' };

// The two primary destinations — rendered as a sliding segmented pill in the bar,
// and as full-size entries in the open menu.
const sectionLinks = [
  { label: 'Capabilities', href: '#work', id: 'work' },
  { label: 'Work', href: '#projects', id: 'projects' },
];

const menuLinks = [homeLink, ...sectionLinks];

function BrandMark({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const textColor = tone === 'dark' ? 'text-void' : 'text-white';
  const dotShadow =
    tone === 'dark'
      ? 'shadow-[0_0_10px_rgba(249,115,22,0.45)]'
      : 'shadow-[0_0_14px_rgba(249,115,22,0.8)]';

  return (
    <span
      className={`flex items-center font-accent text-[28px] font-bold leading-none md:text-[30px] ${textColor}`}
    >
      Luc
      <span className="relative inline-block">
        i
        <span
          aria-hidden
          className={`absolute left-1/2 top-[0.04em] h-[0.26em] w-[0.26em] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-300 via-orange-500 to-red-500 ${dotShadow}`}
        />
      </span>
      de
    </span>
  );
}

function MenuGlyph() {
  return (
    <span className="relative grid h-8 w-8 place-items-center rounded-full border border-white/[0.12] bg-white/[0.07] transition-colors duration-300 group-hover:border-white/[0.28] group-hover:bg-white/[0.11]">
      <span className="absolute h-px w-4 -translate-y-[3px] bg-white transition-transform duration-300 group-hover:w-[18px]" />
      <span className="absolute h-px w-3 translate-y-[3px] bg-white/80 transition-transform duration-300 group-hover:w-[18px]" />
    </span>
  );
}

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Scroll-spy — drives the sliding pill indicator in the bar.
  useEffect(() => {
    const els = sectionLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      // A section is "active" once it crosses the vertical middle of the viewport.
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    const el = document.getElementById(targetId);
    if (!el) return;

    const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: { offset?: number }) => void } }).lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(el, { offset: -80 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-0 z-[90] px-3 pt-3 pointer-events-none select-none sm:px-5 sm:pt-5 lg:px-10"
      >
        <nav
          aria-label="Primary navigation"
          className="relative mx-auto grid h-[58px] max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-full border border-white/[0.12] bg-[#06080d]/75 px-2 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl pointer-events-auto sm:h-16 sm:px-2.5"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-px rounded-full border border-white/[0.06]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
          />

          <div className="relative z-10 justify-self-start">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
              onClick={() => setIsMenuOpen(true)}
              data-cursor="hover"
              className="group inline-flex h-11 items-center gap-2 rounded-full py-1 pl-1 pr-2 text-white transition-colors duration-300 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:gap-3 sm:pr-4"
            >
              <MenuGlyph />
              <span className="hidden font-body text-[13px] font-medium uppercase leading-none text-white/82 transition-colors duration-300 group-hover:text-white sm:inline">
                Menu
              </span>
            </button>
          </div>

          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, 'hero')}
            data-cursor="hover"
            className="relative z-10 flex items-center justify-center rounded-full px-3 py-2 transition-colors duration-300 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Go to Lucide home"
          >
            <BrandMark />
          </a>

          <div className="relative z-10 flex items-center justify-end gap-1 justify-self-end sm:gap-2">
            <div className="hidden items-center rounded-full border border-white/[0.08] bg-white/[0.04] p-1 lg:flex">
              {sectionLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    data-cursor="hover"
                    aria-current={isActive ? 'true' : undefined}
                    className="relative rounded-full px-3.5 py-2 font-body text-[13px] font-medium leading-none transition-colors duration-300"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? 'text-white' : 'text-white/68 hover:text-white'} transition-colors duration-300`}>
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </div>

            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              data-cursor="hover"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white px-3 font-body text-[12px] font-semibold uppercase leading-none text-[#06080d] shadow-[0_10px_34px_rgba(255,255,255,0.16)] transition-all duration-300 hover:border-blue-sphere hover:bg-blue-sphere hover:text-white hover:shadow-[0_14px_38px_rgba(59,127,232,0.34)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:px-5 sm:text-[13px]"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <span className="leading-none transition-transform duration-300 group-hover:translate-x-0.5">
                &rarr;
              </span>
            </a>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0, y: '-10%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-10%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-paper px-[clamp(24px,5vw,80px)] py-[clamp(24px,4vw,60px)] select-none"
            style={{ color: 'var(--void)' }}
          >
            <div className="flex h-20 w-full items-center justify-between">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-void/90 transition-colors duration-200 hover:text-void focus:outline-none focus-visible:ring-2 focus-visible:ring-void/30"
              >
                <span className="text-[16px] font-light leading-none">&times;</span>
                <span className="font-body text-[13px] font-medium uppercase leading-none">Close</span>
              </button>

              <BrandMark tone="dark" />

              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="font-body text-[13px] font-medium leading-none text-void/90 transition-colors duration-200 hover:text-void focus:outline-none focus-visible:ring-2 focus-visible:ring-void/30"
              >
                Let&apos;s chat &rarr;
              </a>
            </div>

            <div className="flex flex-grow flex-col items-center justify-center py-12">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.15,
                    },
                  },
                }}
                className="flex flex-col items-center gap-5 md:gap-8"
              >
                {menuLinks.map((link, i) => (
                  <motion.div
                    key={link.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.id)}
                      className="group block text-center"
                    >
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.24em] text-void/35 transition-colors duration-200 group-hover:text-void/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="block font-public text-[54px] font-medium leading-none text-void transition-colors duration-200 group-hover:text-void/55 sm:text-[72px] lg:text-[104px]">
                        {link.label}
                      </span>
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="flex w-full flex-col items-center justify-center pb-4 text-center">
              <span className="mb-2 font-accent text-[14px] italic text-void/60">
                Contact us
              </span>
              <a
                href="mailto:team@lucide.in"
                className="font-body text-[14px] font-medium text-void underline decoration-1 underline-offset-4 transition-opacity hover:opacity-75 sm:text-[18px]"
              >
                team@lucide.in
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
