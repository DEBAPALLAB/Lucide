'use client';

/**
 * Intro — the loading sequence that resolves INTO the real homepage.
 *
 * It is entirely additive: a fixed white overlay above everything that plays
 *   1. logo  →  2. carousel flood-in  →  3. bloom  →  4. reveal the live hero.
 * It never touches <Hero/> — on resolve it just fades away to expose the real,
 * untouched hero rendered beneath it in page.tsx.
 *
 * Plays once per session (sessionStorage). Reduced-motion / repeat visits skip
 * straight to the live site. The whole component unmounts on 'done', so it
 * costs nothing afterward. The slot-machine swaps <img> src via refs (no React
 * re-renders) so it never competes with the Framer animations.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import HeroScene from './HeroScene';

const STORAGE_KEY = 'lucide_intro_played_v1';

// Slot-machine sources — reuse the existing project screenshots.
const THUMBS = [
  '/images/workcrazy/aaradhya.png',
  '/images/workcrazy/comparefi.png',
  '/images/workcrazy/notaprompt12.png',
  '/images/workcrazy/superforms.png',
];
const OFFSETS = [0, 1, 2, 3, 1]; // per-slot flicker offset so they're out of sync
const CENTER = 2;

// Approx fraction of viewport width a single thumbnail occupies — the bloom
// layer starts at this scale (overlaying the centre thumb) then grows to 1.
const THUMB_SCALE = 0.07;

type Phase =
  | 'logo' | 'blank' | 'flood' | 'hold' | 'settle'
  | 'swell' | 'bloom' | 'heroHold' | 'reveal' | 'done';

const ORDER: Phase[] = ['logo','blank','flood','hold','settle','swell','bloom','heroHold','reveal','done'];

// [delay-from-start (ms), phase]
const TIMELINE: [number, Phase][] = [
  [0,    'logo'],
  [340,  'blank'],   // logo hold 0.2s + fade 0.14s
  [920,  'flood'],   // blank-white hold ~0.58s
  [2150, 'hold'],    // ~1.23s of chained wipes
  [3150, 'settle'],  // centre lands on the hero scene (~0.3s before bloom)
  [3450, 'swell'],   // anticipatory swell 0.37s
  [3820, 'bloom'],   // centre scales to full (~0.56s), others fly out
  [4380, 'heroHold'],// full-bleed hold 0.67s
  [5050, 'reveal'],  // crossfade to the live hero (dim headline appears)
  [5400, 'done'],
];

const EASE_IO = [0.76, 0, 0.24, 1] as const; // fast-middle ease for the bloom
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const order = (p: Phase) => ORDER.indexOf(p);

function LucideMark() {
  return (
    <span className="flex items-center font-accent font-bold leading-none text-void" style={{ fontSize: 'clamp(26px, 4.6vw, 58px)' }}>
      Luc
      <span className="relative inline-block">
        i
        <span
          aria-hidden
          className="absolute left-1/2 top-[0.06em] h-[0.22em] w-[0.22em] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-300 via-orange-500 to-red-500 shadow-[0_0_0.6em_rgba(249,115,22,0.7)]"
        />
      </span>
      de
    </span>
  );
}

export default function Intro() {
  const [phase, setPhase] = useState<Phase>('logo');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phaseRef = useRef<Phase>('logo');
  phaseRef.current = phase;
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const pi = order(phase);
  const atLeast = (p: Phase) => pi >= order(p);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const finish = () => {
    clearTimers();
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
    const lenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
    lenis?.start();
    document.documentElement.style.overflow = '';
    setPhase('done');
  };

  // Decide before paint whether to play at all (avoids a flash on repeat visits).
  useIsoLayoutEffect(() => {
    let skip = false;
    try { skip = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (skip || reduce) { setPhase('done'); return; }

    // Lock scroll for the duration.
    const lenis = (window as unknown as { lenis?: { stop: () => void } }).lenis;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';

    TIMELINE.forEach(([delay, p]) => {
      timers.current.push(setTimeout(() => (p === 'done' ? finish() : setPhase(p)), delay));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload slot-machine images + run the flicker by swapping src directly on
  // the <img> elements — no setState, so the Framer animations stay smooth.
  useEffect(() => {
    THUMBS.forEach((src) => { const im = new window.Image(); im.src = src; });
    let n = 0;
    const id = setInterval(() => {
      if (order(phaseRef.current) >= order('bloom')) return; // settled — stop cycling
      n += 1;
      for (let i = 0; i < imgRefs.current.length; i++) {
        const img = imgRefs.current[i];
        if (img) img.src = THUMBS[(n + OFFSETS[i]) % THUMBS.length];
      }
    }, 90);
    return () => { clearInterval(id); clearTimers(); };
  }, []);

  if (phase === 'done') return null;

  const floodStarted = atLeast('flood');
  const settled = atLeast('settle');
  const swelled = atLeast('swell');
  const bloomed = atLeast('bloom');
  const revealing = atLeast('reveal');

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{ background: '#ffffff' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: revealing ? 0 : 1 }}
      transition={{ duration: 0.34, ease: EASE_OUT }}
    >
      {/* ── Stage 1 — logo (only mounted through the white beats) ──────── */}
      {!floodStarted && (
        <motion.div
          className="absolute"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'logo' ? 1 : 0 }}
          transition={{ duration: phase === 'logo' ? 0 : 0.14, ease: 'linear' }}
        >
          <LucideMark />
        </motion.div>
      )}

      {/* ── Stage 2/3 — carousel strip (mounted only from flood onward) ─── */}
      {floodStarted && (
        <motion.div
          className="flex"
          style={{
            gap: 'clamp(16px, 1.6vw, 36px)',
            // Outer edges of the end thumbs fade; every inner edge stays crisp.
            WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)',
          }}
          initial={{ scale: 1 }}
          animate={{ scale: swelled && !bloomed ? 1.3 : 1 }}
          transition={{ duration: 0.37, ease: 'easeInOut' }}
        >
          {OFFSETS.map((off, i) => {
            const isCenter = i === CENTER;
            const dir = i < CENTER ? -1 : 1;
            return (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-[2px] bg-[#0d1018]"
                style={{
                  width: 'clamp(74px, 6.6vw, 150px)',
                  aspectRatio: '1.4 / 1',
                  transformOrigin: 'left center',
                  willChange: 'transform, opacity',
                }}
                initial={{ scaleX: 0.02 }}
                animate={{
                  scaleX: 1,
                  x: bloomed && !isCenter ? dir * 220 : 0,
                  scale: bloomed && !isCenter ? 0.6 : 1,
                  opacity: bloomed && !isCenter ? 0 : isCenter && settled ? 0 : 1,
                  filter: bloomed && !isCenter ? 'blur(6px)' : 'blur(0px)',
                }}
                transition={{
                  scaleX: { duration: 0.2, ease: EASE_OUT, delay: i * 0.2 },
                  x: { duration: 0.33, ease: EASE_IO },
                  scale: { duration: 0.33, ease: EASE_IO },
                  opacity: { duration: isCenter && settled && !bloomed ? 0.22 : 0.3 },
                  filter: { duration: 0.33 },
                }}
              >
                <img
                  ref={(el) => { imgRefs.current[i] = el; }}
                  src={THUMBS[off % THUMBS.length]}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Stage 3/4 — bloom layer (the live lamp scene) ──────────────── */}
      {settled && (
        <motion.div
          className="fixed inset-0 z-[210]"
          style={{ transformOrigin: 'center center', willChange: 'transform, opacity' }}
          initial={{ scale: THUMB_SCALE, opacity: 0 }}
          animate={{
            scale: bloomed ? 1 : swelled ? THUMB_SCALE * 1.3 : THUMB_SCALE,
            opacity: 1,
          }}
          transition={{
            scale: bloomed
              ? { duration: 0.56, ease: EASE_IO }
              : { duration: 0.37, ease: 'easeInOut' },
            opacity: { duration: 0.25, ease: EASE_OUT },
          }}
        >
          <HeroScene />
        </motion.div>
      )}

      {/* ── Skip ───────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={finish}
        className="fixed bottom-6 right-6 z-[220] font-mono text-[10px] uppercase tracking-[0.2em] text-void/40 transition-colors duration-200 hover:text-void"
        style={{ opacity: revealing ? 0 : 1 }}
      >
        Skip&nbsp;↵
      </button>
    </motion.div>
  );
}
