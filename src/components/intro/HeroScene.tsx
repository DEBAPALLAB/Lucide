'use client';

/**
 * HeroScene — a non-interactive visual twin of the hero's BACKGROUND only
 * (lamp + bg + scrims, no headline). Used by the intro loader as the bloom
 * target so the climax lands on something pixel-identical to the real hero.
 *
 * It REUSES <HeroLamp/> verbatim and copies the hero's scrim gradients — it
 * never imports or mutates <Hero/>. The real hero is revealed underneath on
 * resolve; a short crossfade hides any lamp-phase difference.
 */

import HeroLamp from '../HeroLamp';

export default function HeroScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      {/* Lamp — same component the real hero uses */}
      <div className="absolute inset-0 z-0">
        <HeroLamp aimAtText={false} />
      </div>

      {/* Scrims copied from Hero (for crossfade parity) */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to left, rgba(6,8,13,0.82) 0%, rgba(6,8,13,0.48) 38%, transparent 60%)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 56%, rgba(6,8,13,0.28) 76%, rgba(6,8,13,0.58) 88%, rgba(6,8,13,0.86) 96%, #06080d 100%)',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(6,8,13,0.55) 0%, transparent 15%)',
        }}
      />
    </div>
  );
}
