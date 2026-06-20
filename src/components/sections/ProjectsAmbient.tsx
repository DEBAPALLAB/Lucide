'use client';

/**
 * ProjectsAmbient — a flowing field of light threads drifting behind the work.
 *
 * Hundreds of fine particles trace a layered-sine flow field and draw fading
 * trails with additive ('lighter') blending, so the strokes read as volumetric
 * light — silk / aurora, not a static blob. The whole canvas is screen-blended
 * over the void, so its dark trail-fade is invisible and only the light shows.
 * The thread colour is lerped toward the active project's hue, so as you scroll
 * the field crossfades blue → teal → orange → violet.
 *
 * Performance: viewport-sized canvas (pinned, not full-section), DPR capped,
 * no filter: blur, and the rAF loop pauses whenever the section leaves view.
 */

import { useEffect, useRef } from 'react';

const VOID: [number, number, number] = [8, 8, 8];

function parse(rgb: string): [number, number, number] {
  const [r, g, b] = rgb.split(',').map((n) => parseFloat(n.trim()));
  return [r, g, b];
}

export default function ProjectsAmbient({ rgb }: { rgb: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const target = useRef(parse(rgb));
  target.current = parse(rgb);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const cur = { r: target.current[0], g: target.current[1], b: target.current[2] };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    type P = { x: number; y: number; px: number; py: number; life: number; max: number; sp: number };
    const spawn = (p: P, seed = false) => {
      p.x = rand(-60, w + 60);
      p.y = rand(-60, h + 60);
      p.px = p.x;
      p.py = p.y;
      p.max = rand(140, 420);
      p.life = seed ? rand(0, p.max) : 0;
      p.sp = rand(0.5, 1.7);
    };

    const COUNT = Math.round(Math.min(280, Math.max(120, (w * h) / 7000)));
    const ps: P[] = Array.from({ length: COUNT }, () => {
      const p = { x: 0, y: 0, px: 0, py: 0, life: 0, max: 0, sp: 1 };
      spawn(p, true);
      return p;
    });

    // Layered sines → smooth, organic flow angle. Cheap (no noise lib).
    const flow = (x: number, y: number, t: number) => {
      const s = 0.0013;
      return (
        (Math.sin(x * s + t * 0.00017) * 1.2 +
          Math.cos(y * s * 1.25 - t * 0.00012) * 1.1 +
          Math.sin((x + y) * s * 0.55 + t * 0.00021) * 0.7) *
        Math.PI
      );
    };

    let raf = 0;
    let running = false;

    const frame = (t: number) => {
      const tg = target.current;
      cur.r += (tg[0] - cur.r) * 0.04;
      cur.g += (tg[1] - cur.g) * 0.04;
      cur.b += (tg[2] - cur.b) * 0.04;

      // Fade previous frame toward void → silky trails.
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(${VOID[0]}, ${VOID[1]}, ${VOID[2]}, 0.07)`;
      ctx.fillRect(0, 0, w, h);

      // Draw light additively.
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 1.15;
      const col = `${cur.r | 0}, ${cur.g | 0}, ${cur.b | 0}`;

      for (const p of ps) {
        const a = flow(p.x, p.y, t);
        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(a) * p.sp;
        p.y += Math.sin(a) * p.sp + 0.12; // faint downward drift
        p.life++;

        const edge = Math.sin(Math.PI * (p.life / p.max)); // soft fade-in/out
        ctx.strokeStyle = `rgba(${col}, ${0.14 * edge})`;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.life >= p.max || p.x < -70 || p.x > w + 70 || p.y < -70 || p.y > h + 70) spawn(p);
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduce) {
      // Static soft wash for reduced-motion users.
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.5);
      g.addColorStop(0, `rgba(${cur.r | 0}, ${cur.g | 0}, ${cur.b | 0}, 0.12)`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    } else {
      start();
    }

    // Pause when the section scrolls out of view.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
