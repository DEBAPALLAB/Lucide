'use client';

/**
 * PageLoader — cinematic intro sequence
 *
 * Timeline (total ~4.8s):
 *   0.35s — flicker sequence fires (10 steps, ~0.75s total)
 *   1.1s  — lamp settles at full intensity
 *   1.4s  — person slides up from below, glowing
 *   2.1s  — wordmark + tagline fade in
 *   3.5s  — short hold
 *   4.0s  — overlay fades to black-transparent → onComplete fires
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import LampScene from './LampScene';
import styles from './PageLoader.module.css';

// Mirror the same flicker timings used in Hero.tsx
const FLICKER: { val: number; dur: number }[] = [
  { val: 0,    dur: 0.12  },
  { val: 0.7,  dur: 0.055 },
  { val: 0,    dur: 0.09  },
  { val: 0.5,  dur: 0.04  },
  { val: 0,    dur: 0.07  },
  { val: 0.85, dur: 0.065 },
  { val: 0.2,  dur: 0.045 },
  { val: 0.9,  dur: 0.05  },
  { val: 0,    dur: 0.08  },
  { val: 1,    dur: 0.6   },   // settle
];

interface PageLoaderProps {
  onComplete: () => void;
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  // Stable ref so the effect never re-runs if parent re-renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    const text = textRef.current;
    if (!root || !text) return;

    // Query the SVG and person group rendered by LampScene
    const svg    = root.querySelector<SVGSVGElement>('#ls-scene');
    const person = root.querySelector<SVGGElement>('#ls-person');
    if (!svg || !person) return;

    // ── Initial state (all invisible) ──────────────────────────────────────
    svg.style.setProperty('--ls-intensity', '0');
    gsap.set(person, { opacity: 0, y: 18 });
    gsap.set(text,   { opacity: 0, y: 16 });

    // ── Build the master timeline ───────────────────────────────────────────
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
    });

    // Phase 1: flicker sequence — use tl.call() for instant CSS var jumps
    let cursor = 0.35;
    for (const step of FLICKER) {
      const capturedVal = step.val;          // capture for closure
      tl.call(
        () => svg.style.setProperty('--ls-intensity', String(capturedVal)),
        [],
        cursor,
      );
      cursor += step.dur;
    }

    // Phase 2: person materialises from below
    tl.to(
      person,
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' },
      cursor + 0.3,
    );

    // Phase 3: wordmark + tagline slide up
    tl.to(
      text,
      { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
      cursor + 1.0,
    );

    // Phase 4: hold, then fade the entire overlay out
    tl.to(
      root,
      {
        opacity: 0,
        duration: 0.85,
        ease: 'power2.inOut',
        delay: 1.5,
        onComplete: () => onCompleteRef.current(),
      },
      cursor + 1.9,
    );

    return () => {
      tl.kill();
    };
  }, []);   // intentionally empty — runs once on mount

  return (
    <div ref={rootRef} className={styles.overlay}>
      <LampScene
        className={styles.scene}
        lampOn={false}         /* GSAP animates --ls-intensity, not the prop */
        showRays               /* dramatic rays for the loader sequence */
        personAnimated={false} /* GSAP drives the person entrance */
      />
      <div ref={textRef} className={styles.text}>
        <span className={styles.wordmark}>Lucide Tech</span>
        <span className={styles.tagline}>// we build what finds you in the dark</span>
      </div>
    </div>
  );
}
