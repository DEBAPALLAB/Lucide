'use client';

/**
 * WorkLight — a sourceless wash of light spilling in from the RIGHT edge of the
 * Work section. No visible fixture; the light just bleeds across the dark page.
 *
 * Two driving modes:
 *   • Intro frame  → static, vertically centred, signature blue-white.
 *   • Showcase     → the light tracks the active project. The viewport height is
 *     split into four bands; project 1 sits at the top, each subsequent project
 *     drops a band toward the bottom, and every project carries its own colour.
 *     Position AND colour are interpolated on a rAF loop, so the move stays in
 *     smooth sync with the image/text crossfade — never a hard cut.
 *
 * On top of that, a continuous shimmer + sparse dip bursts keep the beam alive
 * (the `--wl-flicker` var). Lives behind the section content (z-0), pointer-safe.
 */

import { useEffect, useRef } from 'react';

type Phase = 'intro' | 'showcase';

interface WorkLightProps {
  phase: Phase;
  project: number; // 0..3
}

// Per-project light stages: vertical centre (%) + colour (rgb triplet string).
// Top → bottom as projects advance; hue shifts each step but stays cinematic.
const STAGES: { y: number; rgb: [number, number, number] }[] = [
  { y: 15, rgb: [150, 186, 255] }, // 01 — cool blue-white (top)
  { y: 38, rgb: [96, 206, 206] },  // 02 — teal / aqua
  { y: 62, rgb: [255, 110, 42] },  // 03 — vivid orange
  { y: 85, rgb: [192, 150, 238] }, // 04 — violet / orchid (bottom)
];

// Intro: centred vertically, signature blue.
const INTRO = { y: 50, rgb: [150, 186, 255] as [number, number, number] };

export default function WorkLight({ phase, project }: WorkLightProps) {
  const fieldRef = useRef<HTMLDivElement>(null);

  // Live targets, updated from props without tearing down the rAF loop.
  const targetRef = useRef({ phase, project });
  targetRef.current = { phase, project };

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resolveTarget = () => {
      const { phase: p, project: idx } = targetRef.current;
      if (p === 'intro') return { y: INTRO.y, rgb: INTRO.rgb, i: 0.72 };
      const stage = STAGES[Math.max(0, Math.min(STAGES.length - 1, idx))];
      return { y: stage.y, rgb: stage.rgb, i: 0.95 };
    };

    // Smoothed current state.
    const start = resolveTarget();
    const cur = {
      y: start.y,
      r: start.rgb[0],
      g: start.rgb[1],
      b: start.rgb[2],
      i: start.i,
      flk: 1,
    };

    const writeVars = () => {
      field.style.setProperty('--wl-y', `${cur.y.toFixed(2)}%`);
      field.style.setProperty('--wl-rgb', `${cur.r | 0}, ${cur.g | 0}, ${cur.b | 0}`);
      field.style.setProperty('--wl-intensity', cur.i.toFixed(3));
      field.style.setProperty('--wl-flicker', cur.flk.toFixed(3));
    };

    if (reduce) {
      // Snap to target on every prop change, no flicker.
      const t = resolveTarget();
      cur.y = t.y; [cur.r, cur.g, cur.b] = t.rgb; cur.i = t.i; cur.flk = 1;
      writeVars();
      return;
    }

    // Sparse, sharper flicker bursts on top of the continuous shimmer.
    let burstUntil = 0;
    let burstVal = 1;
    let nextBurst = performance.now() + 900 + Math.random() * 1800;

    let raf = 0;
    const tick = (t: number) => {
      const tgt = resolveTarget();

      // Ease position, colour and intensity toward the active target.
      cur.y += (tgt.y - cur.y) * 0.06;
      cur.r += (tgt.rgb[0] - cur.r) * 0.05;
      cur.g += (tgt.rgb[1] - cur.g) * 0.05;
      cur.b += (tgt.rgb[2] - cur.b) * 0.05;
      cur.i += (tgt.i - cur.i) * 0.06;

      // Continuous shimmer — summed sines, gentle ±4%.
      const shimmer =
        0.5 * Math.sin(t * 0.013) +
        0.3 * Math.sin(t * 0.027 + 1.3) +
        0.2 * Math.sin(t * 0.053 + 2.1);

      // Schedule + run sparse dips.
      if (t >= nextBurst) {
        burstVal = 0.5 + Math.random() * 0.28;
        burstUntil = t + 45 + Math.random() * 95;
        nextBurst = t + 700 + Math.random() * 2600;
      }
      const dip = t < burstUntil ? burstVal : 1;

      const flkTarget = (1 + shimmer * 0.04) * dip;
      cur.flk += (flkTarget - cur.flk) * 0.35;

      writeVars();
      raf = requestAnimationFrame(tick);
    };

    // Only burn frames while the Work section is actually on screen — the conic
    // gradient + mask repaint is expensive, so we pause it the moment it scrolls away.
    const startLoop = () => {
      if (!raf) {
        nextBurst = performance.now() + 700 + Math.random() * 2600;
        raf = requestAnimationFrame(tick);
      }
    };
    const stopLoop = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()),
      { rootMargin: '200px 0px 200px 0px' }
    );
    io.observe(field);

    return () => { io.disconnect(); stopLoop(); };
  }, []);

  return (
    <div ref={fieldRef} className="work-light" aria-hidden="true">
      <div className="wl-field">
        <div className="wl-wash" />
        <div className="wl-core" />
        <div className="wl-rays" />
      </div>

      <style jsx>{`
        .work-light {
          --wl-x: 103%;
          --wl-y: 50%;
          --wl-rgb: 150, 186, 255;
          --wl-intensity: 0.72;
          --wl-flicker: 1;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          z-index: 0;
        }

        /* The whole field dims/brightens together via intensity × flicker. */
        .wl-field {
          inset: 0;
          opacity: calc(var(--wl-intensity) * var(--wl-flicker));
          position: absolute;
          will-change: opacity;
        }

        .wl-wash,
        .wl-core,
        .wl-rays {
          inset: 0;
          mix-blend-mode: screen;
          position: absolute;
          will-change: background;
        }

        /* Broad, soft spill — the project colour fading deep into the page. */
        .wl-wash {
          background: radial-gradient(
            135% 105% at var(--wl-x) var(--wl-y),
            rgba(var(--wl-rgb), 0.24) 0%,
            rgba(var(--wl-rgb), 0.12) 22%,
            rgba(var(--wl-rgb), 0.045) 45%,
            transparent 66%
          );
        }

        /* Tight white-hot bloom hugging the right edge near the source. */
        .wl-core {
          background: radial-gradient(
            58% 72% at var(--wl-x) var(--wl-y),
            rgba(255, 255, 255, 0.3) 0%,
            rgba(var(--wl-rgb), 0.16) 34%,
            transparent 58%
          );
        }

        /* Faint volumetric shafts fanning out from the off-screen source. */
        .wl-rays {
          background: repeating-conic-gradient(
            from 0deg at var(--wl-x) var(--wl-y),
            rgba(var(--wl-rgb), 0) 0deg,
            rgba(var(--wl-rgb), 0.05) 1.3deg,
            rgba(var(--wl-rgb), 0) 3deg,
            rgba(var(--wl-rgb), 0) 6.2deg
          );
          opacity: 0.55;
          -webkit-mask: radial-gradient(
            78% 88% at var(--wl-x) var(--wl-y),
            #000 0%,
            rgba(0, 0, 0, 0.45) 34%,
            transparent 68%
          );
          mask: radial-gradient(
            78% 88% at var(--wl-x) var(--wl-y),
            #000 0%,
            rgba(0, 0, 0, 0.45) 34%,
            transparent 68%
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .wl-field {
            opacity: var(--wl-intensity);
          }
          .wl-rays {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
