'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroLamp from './HeroLamp';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

// ── Letter-by-letter reveal on hover ─────────────────────────────────────────
const AnimatedLine = ({
  text,
  isHovered,
  delay = 0,
  fontFamily,
  className,
}: {
  text: string;
  isHovered: boolean;
  delay?: number;
  fontFamily: string;
  className: string;
}) => {
  const words = text.split(' ');
  return (
    <span className={className} style={{ fontFamily }}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.22em] last:mr-0">
          {word.split('').map((char, charIdx) => {
            const isDot = char === '.';
            return (
              <motion.span
                key={charIdx}
                className="inline-block"
                animate={{
                  y: isHovered ? 0 : 3,
                  color: isHovered
                    ? (isDot ? '#3B7FE8' : '#FFFFFF')
                    : (isDot ? 'rgba(59,127,232,0.6)' : 'rgba(255,255,255,0.9)'),
                }}
                transition={{
                  duration: 0.45,
                  ease: easeOutExpo,
                  delay: (wordIdx * 3 + charIdx) * 0.012 + delay,
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  // Hovering the headline LOCKS the lamp onto it; clicking the headline RELEASES
  // it back into the idle back-and-forth sweep.
  const [isLocked, setIsLocked] = useState(false);
  // After first hover the text doesn't go fully dark again — it stays dimly revealed
  const [hasEverLit, setHasEverLit] = useState(false);

  // Touch / no-hover devices can't reveal the headline by hovering. On mobile the
  // lamp is a TOP-DOWN spotlight (resting downward throw — not swung sideways to
  // the desktop text position), so we keep isLocked false there but force the
  // headline fully revealed instead. Desktop behaviour is untouched.
  const [isTouch, setIsTouch] = useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(hover: none), (max-width: 767px)');
    const apply = () => {
      setIsTouch(mq.matches);
      if (mq.matches) setHasEverLit(true);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-svh h-svh overflow-hidden bg-void select-none"
    >

      {/* ── HeroLamp — full-bleed background (z-0) ── */}
      <div className="hero-lamp-wrap absolute inset-0 z-0">
        <HeroLamp aimAtText={isLocked} />
      </div>

      {/* ── Depth / readability layers (z-1) ── */}

      {/* Right text-scrim: critical for headline legibility */}
      <div
        aria-hidden
        className="hero-rscrim"
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to left, rgba(6,8,13,0.82) 0%, rgba(6,8,13,0.48) 38%, transparent 60%)',
        }}
      />
      {/* Mobile bottom-scrim: legibility for the bottom-anchored headline (mobile only) */}
      <div
        aria-hidden
        className="hero-bscrim"
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0,
          background: 'linear-gradient(to top, rgba(6,8,13,0.92) 0%, rgba(6,8,13,0.7) 30%, rgba(6,8,13,0.25) 55%, transparent 78%)',
        }}
      />
      {/* Bottom fade: blends into the next section */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 56%, rgba(6,8,13,0.28) 76%, rgba(6,8,13,0.58) 88%, rgba(6,8,13,0.86) 96%, #06080d 100%)',
        }}
      />
      {/* Top nav shadow */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(6,8,13,0.55) 0%, transparent 15%)',
        }}
      />

      {/* ════════════════════════════════════════════════════════
          LAYOUT  z-3
          ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-3 pointer-events-none">

        {/* Left edge label — vertical agency text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.2 }}
          className="hero-vlabel"
          style={{
            position: 'absolute',
            left: 'clamp(14px, 2vw, 28px)',
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.24em' }}
            className="uppercase"
          >
            Creative Agency&nbsp;&nbsp;//&nbsp;&nbsp;Est. 2024
          </span>
        </motion.div>

        {/* Headline block — right-anchored on desktop, bottom-left on mobile */}
        <div
          style={{
            position: 'absolute',
            right: 'clamp(24px, 5vw, 80px)',
            top: '50%',
            transform: 'translateY(-52%)',
            width: 'min(56vw, 900px)',
            textAlign: 'right',
            cursor: isLocked && !isTouch ? 'pointer' : 'default',
          }}
          onMouseEnter={() => { if (!isTouch) { setIsLocked(true); setHasEverLit(true); } }}
          onClick={() => { if (!isTouch) setIsLocked(false); }}
          className="hero-headline pointer-events-auto select-text"
        >
          {/* 3-line headline — blurred until lit by the lamp. On touch it's fully
              revealed (the lamp stays a top-down spotlight rather than swinging). */}
          <motion.div
            animate={{
              filter: isLocked || isTouch
                ? 'blur(0px)'
                : hasEverLit
                  ? 'blur(1.5px)'
                  : 'blur(8px)',
              opacity: isLocked || isTouch ? 1 : hasEverLit ? 0.45 : 0.22,
            }}
            transition={{ duration: 0.7, ease: easeOutExpo }}
          >
            {([
              { text: 'WE BUILD',       delay: 0    },
              { text: 'WHAT FINDS YOU', delay: 0.10 },
              { text: 'IN THE DARK.',   delay: 0.20 },
            ] as const).map(({ text, delay }, i) => (
              <div key={i} className="hero-line" style={{ height: 'clamp(40px, 5.4vw, 86px)', overflow: 'hidden' }}>
                <AnimatedLine
                  text={text}
                  isHovered={isLocked || isTouch}
                  delay={delay}
                  fontFamily="'Public Sans', sans-serif"
                  className="hero-line-text block text-[clamp(40px,5.4vw,86px)] font-bold leading-[0.90] uppercase"
                />
              </div>
            ))}
          </motion.div>

          {/* CTA — visible while the lamp is locked (desktop) or always on touch */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isLocked || isTouch ? 1 : 0, y: isLocked || isTouch ? 0 : 8 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className={`hero-cta-row mt-[clamp(20px,2.4vw,38px)] flex justify-end ${isLocked || isTouch ? '' : 'pointer-events-none'}`}
          >
            <a
              href="#contact"
              onClick={(e) => { e.stopPropagation(); handleScrollToContact(e as React.MouseEvent<HTMLAnchorElement>); }}
              data-cursor="cta"
              className="hero-cta-nb inline-flex items-center gap-2.5 select-none"
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 'clamp(12px, 1.05vw, 14px)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'white',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.20)',
                padding: 'clamp(11px,1.1vw,14px) clamp(20px,2vw,28px)',
              }}
            >
              Start a Project
              <span style={{ fontSize: 14, lineHeight: 1 }}>↗</span>
            </a>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div
          className="hero-bottombar"
          style={{
            position: 'absolute',
            bottom: 'clamp(36px, 5vw, 64px)',
            left: 'clamp(24px, 5vw, 80px)',
            right: 'clamp(24px, 5vw, 80px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: subline */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: easeOutExpo }}
            style={{
              fontFamily: "'Public Sans', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(13px, 1.35vw, 16px)',
              color: 'rgba(255,255,255,0.40)',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
            className="hero-subline pointer-events-auto whitespace-nowrap"
          >
            Websites that work while you sleep.
          </motion.p>

          {/* Centre: scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center gap-2 pointer-events-none"
          >
            <motion.div style={{ opacity: scrollIndicatorOpacity }} className="flex flex-col items-center gap-2">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.20)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                // scroll
              </span>
              <div className="w-px h-[28px] scroll-line-drip" />
            </motion.div>
          </motion.div>

        </div>

      </div>

    </section>
  );
}
