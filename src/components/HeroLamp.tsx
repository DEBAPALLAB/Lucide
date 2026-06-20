'use client';

/**
 * HeroLamp — a single articulated street-luminaire for the hero.
 *
 * One head, one volumetric beam. The head + lens + emission + beam live in a
 * single rig that pivots at the arm joint. At rest the beam throws down-right;
 * when `aimAtText` is true the rig swings and the beam sweeps up onto the
 * headline, with a soft wash blooming across the words.
 *
 * The beam is built from blurred, gradient-faded cones — real light spread,
 * not hard 2D polygons.
 */

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import styles from './HeroLamp.module.css';

// ── Scene coordinate system ───────────────────────────────────────────────────
const VW = 1000;
const VH = 600;

const GY     = 505;   // ground y
const PX     = 84;    // pole x — pushed hard to the left
const PT     = 148;   // pole top y — lowered to clear the nav header
const LX     = 155;   // luminaire head x (short arm from pole)
const MY     = 208;   // mount / pivot y (arm-to-head joint)
const LENS_Y = 242;   // lens mouth y

// Beam authored pointing straight DOWN from the lens; the rig rotates it.
const BASE_Y = LENS_Y + 720;
const HOT_Y  = LENS_Y + 490;

// Head aim around the pivot (LX, MY). Negative = swing the downward beam to the
// RIGHT, toward the headline (SVG's y-down axis makes positive rotate go left).
const REST_ANGLE = -18;  // resting throw — down, slightly toward the scene
const AIM_ANGLE  = -82;  // locked onto the headline — beam aimed at text centre

// Idle back-and-forth scan — the beam slowly sweeps across the ground at rest.
const SWEEP_NEAR = -4;   // swung toward the scene (right)
const SWEEP_FAR  = -34;  // swung back toward the pole (left)

// ── Mobile framing ────────────────────────────────────────────────────────────
// In portrait we zoom into the head region (head ≈ x150,y222) and crop the long
// pole away — the result reads as a hanging spotlight pouring down the page.
//   "minX minY width height"
//   • minX 60  → the head (x150) lands ~30% from the left, fully inset
//   • minY 130 → the head sits ~13% down from the top (clear of the nav)
//   • 300×880  → a tall, narrow window so the beam falls the length of the screen
// With preserveAspectRatio "xMidYMin slice" the TOP and horizontal CENTRE are the
// anchors, so the head holds the same position across phone aspect ratios / DPRs —
// taller phones just show more beam below, never re-cropping the head.
const MOBILE_VIEWBOX = '60 30 300 880';

interface HeroLampProps {
  className?: string;
  style?:     CSSProperties;
  aimAtText?: boolean;
}

// Cold-start flicker sequence (ms durations), like a sodium lamp warming up
const FLICKER: { v: number; d: number }[] = [
  { v: 0,    d: 0   },
  { v: 0.75, d: 75  },
  { v: 0,    d: 95  },
  { v: 0.45, d: 55  },
  { v: 0,    d: 80  },
  { v: 0.88, d: 65  },
  { v: 0.06, d: 45  },
  { v: 0.92, d: 55  },
  { v: 0,    d: 85  },
  { v: 0.6,  d: 60  },
  { v: 0,    d: 70  },
  { v: 1,    d: 500 },  // warm to full
];

export default function HeroLamp({ className = '', style, aimAtText = false }: HeroLampProps) {
  const svgRef   = useRef<SVGSVGElement>(null);
  const rigRef   = useRef<SVGGElement>(null);
  const angleRef = useRef(REST_ANGLE);
  const [inView, setInView] = useState(true);

  // In portrait the default 'xMidYMid slice' center-crops the scene and cuts the
  // lamp out (it lives at the far LEFT of the viewBox). On narrow screens anchor
  // the crop to the LEFT instead so the luminaire is always in frame.
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsNarrow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Pause the (otherwise infinite) idle sweep when the hero scrolls off screen —
  // rotating the blurred SVG beam re-rasterizes filters every frame, so it's only
  // worth doing while visible.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px 0px 120px 0px' }
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  // Cold-start flicker on mount — drives the --lamp intensity var
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.style.setProperty('--lamp', '0');
    let elapsed = 300;
    const ids: ReturnType<typeof setTimeout>[] = [];
    FLICKER.forEach(({ v, d }) => {
      const val = v;
      ids.push(setTimeout(() => { svg.style.setProperty('--lamp', String(val)); }, elapsed));
      elapsed += d;
    });
    return () => ids.forEach(clearTimeout);
  }, []);

  // Aim animation. Aimed → swing onto the headline and hold. Released → ease
  // back to the scan range, then loop a slow back-and-forth idle sweep.
  useEffect(() => {
    const setAngle = (v: number) => {
      angleRef.current = v;
      rigRef.current?.setAttribute('transform', `rotate(${v} ${LX} ${MY})`);
    };

    if (aimAtText) {
      const lock = animate(angleRef.current, AIM_ANGLE, {
        duration: 0.66,
        ease: [0.22, 1.2, 0.3, 1],
        onUpdate: setAngle,
      });
      return () => lock.stop();
    }

    // Off screen → hold the last angle, run nothing.
    if (!inView) return;

    let sweep: ReturnType<typeof animate> | undefined;
    const intro = animate(angleRef.current, SWEEP_NEAR, {
      duration: 0.7,
      ease: [0.22, 1, 0.3, 1],
      onUpdate: setAngle,
      onComplete: () => {
        sweep = animate(SWEEP_NEAR, SWEEP_FAR, {
          duration: 5.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
          onUpdate: setAngle,
        });
      },
    });
    return () => { intro.stop(); sweep?.stop(); };
  }, [aimAtText, inView]);

  // While locked onto the text, drip in subtle flickers at small random delays —
  // keeps the fixed beam feeling alive without distracting.
  useEffect(() => {
    if (!aimAtText) return;
    const svg = svgRef.current;
    if (!svg) return;

    let active = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (val: string, d: number) =>
      timers.push(setTimeout(() => { if (active) svg.style.setProperty('--lamp', val); }, d));

    const flicker = () => {
      if (!active) return;
      // a quick, shallow dip-and-recover
      at('0.62', 0);
      at('1',    55);
      at('0.82', 105);
      at('1',    160);
      timers.push(setTimeout(flicker, 1400 + Math.random() * 2800));
    };

    timers.push(setTimeout(flicker, 800 + Math.random() * 600));
    return () => {
      active = false;
      timers.forEach(clearTimeout);
      svg.style.setProperty('--lamp', '1');
    };
  }, [aimAtText]);

  return (
    <svg
      ref={svgRef}
      className={`${styles.scene} ${aimAtText ? styles.aimed : ''} ${className}`}
      style={style}
      viewBox={isNarrow ? MOBILE_VIEWBOX : `0 0 ${VW} ${VH}`}
      width="100%"
      height="100%"
      preserveAspectRatio={isNarrow ? 'xMidYMin slice' : 'xMidYMid slice'}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="A street luminaire that turns to light the headline"
      role="img"
    >
      <defs>
        {/* ── Light gradients ─────────────────────────────────────────────── */}

        {/* Beam outer — wide, soft, fades to nothing */}
        <linearGradient id="hl-beam-outer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#bcd4ff" stopOpacity="0.20"/>
          <stop offset="16%"  stopColor="#7fa3ff" stopOpacity="0.11"/>
          <stop offset="42%"  stopColor="#2f4fb8" stopOpacity="0.035"/>
          <stop offset="100%" stopColor="#0a1a66" stopOpacity="0"/>
        </linearGradient>

        {/* Beam core — brighter central column */}
        <linearGradient id="hl-beam-core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e8f1ff" stopOpacity="0.42"/>
          <stop offset="14%"  stopColor="#9fc0ff" stopOpacity="0.22"/>
          <stop offset="40%"  stopColor="#3a5fd0" stopOpacity="0.065"/>
          <stop offset="100%" stopColor="#0f2299" stopOpacity="0"/>
        </linearGradient>

        {/* Beam hot — tight bright throat, softened so it blends out of the lens */}
        <linearGradient id="hl-beam-hot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.40"/>
          <stop offset="14%"  stopColor="#e4efff" stopOpacity="0.26"/>
          <stop offset="38%"  stopColor="#d2e4ff" stopOpacity="0.11"/>
          <stop offset="100%" stopColor="#9fc0ff" stopOpacity="0"/>
        </linearGradient>

        {/* Emission spilling from the lens */}
        <radialGradient id="hl-emit" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.95"/>
          <stop offset="34%"  stopColor="#d6e7ff" stopOpacity="0.55"/>
          <stop offset="70%"  stopColor="#6f96ff" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#1b3a99" stopOpacity="0"/>
        </radialGradient>

        {/* Soft bloom halo right at the source */}
        <radialGradient id="hl-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff8f0" stopOpacity="0.85"/>
          <stop offset="32%"  stopColor="#cfe2ff" stopOpacity="0.42"/>
          <stop offset="100%" stopColor="#0a1c55" stopOpacity="0"/>
        </radialGradient>

        {/* Lens face */}
        <linearGradient id="hl-lens" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#aecbff"/>
        </linearGradient>

        {/* Headline wash */}
        <radialGradient id="hl-wash" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#aac4ff" stopOpacity="0.16"/>
          <stop offset="46%"  stopColor="#4a6fd0" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#0a1a66" stopOpacity="0"/>
        </radialGradient>

        {/* Ground pool */}
        <radialGradient id="hl-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#a6c6ff" stopOpacity="0.34"/>
          <stop offset="50%"  stopColor="#3355cc" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#081a88" stopOpacity="0"/>
        </radialGradient>

        {/* Atmosphere */}
        <radialGradient id="hl-atmo" cx="50%" cy="46%" r="50%">
          <stop offset="0%"   stopColor="#16307f" stopOpacity="0.15"/>
          <stop offset="60%"  stopColor="#0a1844" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#000008" stopOpacity="0"/>
        </radialGradient>

        {/* ── Material gradients (3D) ─────────────────────────────────────── */}

        {/* Pole — cylindrical metal */}
        <linearGradient id="hl-pole" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#03070d"/>
          <stop offset="30%"  stopColor="#16293f"/>
          <stop offset="48%"  stopColor="#2c4a68"/>
          <stop offset="64%"  stopColor="#102032"/>
          <stop offset="100%" stopColor="#02060c"/>
        </linearGradient>

        {/* Head — top-lit luminaire shell */}
        <linearGradient id="hl-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2a425e"/>
          <stop offset="42%"  stopColor="#13273c"/>
          <stop offset="100%" stopColor="#050e1c"/>
        </linearGradient>

        {/* Arm — slim tube */}
        <linearGradient id="hl-arm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#24405e"/>
          <stop offset="45%"  stopColor="#10202f"/>
          <stop offset="100%" stopColor="#020509"/>
        </linearGradient>

        {/* Luminaire shell — cylindrical curvature (sheen, core, shadow side) */}
        <linearGradient id="hl-shell" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#070f1b"/>
          <stop offset="20%"  stopColor="#2a4a69"/>
          <stop offset="40%"  stopColor="#14283c"/>
          <stop offset="60%"  stopColor="#0e1f30"/>
          <stop offset="82%"  stopColor="#16293f"/>
          <stop offset="100%" stopColor="#05101d"/>
        </linearGradient>

        {/* Top cap — domed, lit from ambient above */}
        <linearGradient id="hl-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#33547a"/>
          <stop offset="100%" stopColor="#0b1d30"/>
        </linearGradient>

        {/* Cast fitter / clamp — machined metal */}
        <linearGradient id="hl-fitter" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#0a1828"/>
          <stop offset="34%"  stopColor="#34567a"/>
          <stop offset="60%"  stopColor="#162c42"/>
          <stop offset="100%" stopColor="#070f1c"/>
        </linearGradient>

        {/* Diffuser — glowing frosted disc */}
        <radialGradient id="hl-diffuser" cx="50%" cy="42%" r="62%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
          <stop offset="32%"  stopColor="#eaf3ff" stopOpacity="0.95"/>
          <stop offset="64%"  stopColor="#bcd6ff" stopOpacity="0.72"/>
          <stop offset="100%" stopColor="#5a86d8" stopOpacity="0.32"/>
        </radialGradient>

        {/* Lower-lip catch light — the metal rim catching the diffuser glow */}
        <linearGradient id="hl-lip" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#3a5f8a" stopOpacity="0"/>
          <stop offset="50%"  stopColor="#9cc0f0" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#3a5f8a" stopOpacity="0"/>
        </linearGradient>

        {/* ── Light blur is done with CSS filter (GPU-cached), not SVG
            feGaussianBlur. SVG filters re-rasterize on the CPU every frame the
            rig rotates; a CSS-blurred group promoted to its own layer is
            rasterized once and the rotation just transforms the cached bitmap.
            See .beam / .emit in HeroLamp.module.css. ──────────────────────── */}

        {/* Soft frosted core — replaces the hard white ellipse for a smooth glow */}
        <radialGradient id="hl-hot" cx="50%" cy="48%" r="55%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
          <stop offset="42%"  stopColor="#eef5ff" stopOpacity="0.92"/>
          <stop offset="74%"  stopColor="#cfe2ff" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#a8c8ff" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ══ 0. Background ════════════════════════════════════════════════════ */}
      <rect x="0" y="0" width={VW} height={VH} fill="#06080d"/>

      {/* ══ 1. Atmosphere ═══════════════════════════════════════════════════ */}
      <ellipse
        className={styles.atmo}
        cx={LX + 60} cy={GY * 0.66}
        rx={240} ry={210}
        fill="url(#hl-atmo)"
      />

      {/* ══ 2. Headline wash — blooms in when aimed ═════════════════════════ */}
      <ellipse
        className={styles.textWash}
        cx={720} cy={322}
        rx={380} ry={260}
        fill="url(#hl-wash)"
      />

      {/* ══ 3. Ground pool under the resting beam ═══════════════════════════ */}
      <ellipse
        className={styles.groundPool}
        cx={240} cy={GY}
        rx={150} ry={20}
        fill="url(#hl-pool)"
      />

      {/* ══ 4. Ground line ══════════════════════════════════════════════════ */}
      <line
        x1="-20" y1={GY} x2={VW + 20} y2={GY}
        stroke="#0f1e33" strokeWidth="1" strokeOpacity="0.5"
      />

      {/* ══ 5. Lamp post — pole, arm, brace (static) ════════════════════════ */}
      <g className={styles.post}>
        {/* Pole */}
        <rect x={PX - 3.5} y={PT} width={7} height={GY - PT} fill="url(#hl-pole)" rx={1.5}/>
        {/* Specular highlight */}
        <rect x={PX - 0.4} y={PT + 6} width={1.1} height={GY - PT - 28}
              fill="#3a607f" opacity="0.5" rx={0.6}/>
        {/* Tapered base + footing */}
        <path d={`M ${PX - 7},${GY} L ${PX - 4},${GY - 24} L ${PX + 4},${GY - 24} L ${PX + 7},${GY} Z`}
              fill="url(#hl-pole)"/>
        <rect x={PX - 8} y={GY - 4} width={16} height={5} fill="#020509" rx={1.5}/>

        {/* Cobra arm — one clean curved tube, pole → head (descends vertically) */}
        <path
          d={`M ${PX},${PT + 1} C ${PX + 34},${PT - 24} ${LX},${PT} ${LX},${MY - 4}`}
          fill="none" stroke="url(#hl-arm)" strokeWidth="6" strokeLinecap="round"
        />
        {/* Arm spine highlight */}
        <path
          d={`M ${PX},${PT - 0.5} C ${PX + 34},${PT - 25.5} ${LX - 1.5},${PT} ${LX - 1.5},${MY - 4}`}
          fill="none" stroke="#436991" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"
        />
        {/* Cast collar at the pole junction */}
        <ellipse cx={PX} cy={PT + 2} rx={5.5} ry={5} fill="url(#hl-pole)"/>
      </g>

      {/* ══ 6. THE RIG — head + lens + emission + beam (rotates as one) ══════ */}
      <g
        ref={rigRef}
        className={styles.rig}
        transform={`rotate(${REST_ANGLE} ${LX} ${MY})`}
      >
        {/* Beam — soft volumetric cone (behind the head), gated by --lamp.
            Blur is applied via CSS filter on .beam (GPU-cached layer). */}
        <g
          className={styles.beam}
          style={{ opacity: 'var(--lamp, 0)', transition: 'opacity 50ms linear' }}
        >
          <polygon
            className={styles.beamOuter}
            points={`${LX - 12},${LENS_Y} ${LX - 182},${BASE_Y} ${LX + 182},${BASE_Y} ${LX + 12},${LENS_Y}`}
            fill="url(#hl-beam-outer)"
          />
          <polygon
            className={styles.beamCore}
            points={`${LX - 7},${LENS_Y} ${LX - 76},${BASE_Y} ${LX + 76},${BASE_Y} ${LX + 7},${LENS_Y}`}
            fill="url(#hl-beam-core)"
          />
          <polygon
            className={styles.beamHot}
            points={`${LX - 3.5},${LENS_Y} ${LX - 26},${HOT_Y} ${LX + 26},${HOT_Y} ${LX + 3.5},${LENS_Y}`}
            fill="url(#hl-beam-hot)"
          />
        </g>

        {/* Emission bloom — drawn BEHIND the head so the housing itself occludes
            any backward spill; only the glow forward of the lens shows. No mask
            needed (cheap), and gated by --lamp. */}
        <g
          className={styles.emit}
          style={{ opacity: 'var(--lamp, 0)', transition: 'opacity 50ms linear' }}
        >
          <ellipse
            className={styles.emitGlow}
            cx={LX} cy={LENS_Y + 22} rx={24} ry={44}
            fill="url(#hl-emit)"
          />
          <circle
            className={styles.emitGlow}
            cx={LX} cy={LENS_Y + 6} r={17}
            fill="url(#hl-halo)"
          />
        </g>

        {/* ── ONE continuous luminaire — narrow neck flares into the cone ──── */}
        <path
          d={`M ${LX - 6},${MY}
              C ${LX - 6.5},${MY + 4} ${LX - 11},${MY + 7} ${LX - 14},${MY + 10}
              L ${LX - 22},${LENS_Y}
              Q ${LX - 22},${LENS_Y + 5} ${LX - 18},${LENS_Y + 5}
              L ${LX + 18},${LENS_Y + 5}
              Q ${LX + 22},${LENS_Y + 5} ${LX + 22},${LENS_Y}
              L ${LX + 14},${MY + 10}
              C ${LX + 11},${MY + 7} ${LX + 6.5},${MY + 4} ${LX + 6},${MY}
              Z`}
          fill="url(#hl-shell)"
        />
        {/* Shoulder ambient occlusion (under the neck) */}
        <path
          d={`M ${LX - 6},${MY + 1} L ${LX + 6},${MY + 1} L ${LX + 12},${MY + 9} L ${LX - 12},${MY + 9} Z`}
          fill="#040c18" opacity="0.45"
        />
        {/* Vertical seam highlight (lit side) */}
        <path
          d={`M ${LX - 7},${MY + 8} L ${LX - 13},${LENS_Y - 1}`}
          stroke="#5e87b3" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"
        />
        {/* Lower-lip catch light — soft rim, always faintly catching ambient */}
        <path
          d={`M ${LX - 21},${LENS_Y - 1} Q ${LX},${LENS_Y + 8} ${LX + 21},${LENS_Y - 1}`}
          fill="none" stroke="url(#hl-lip)" strokeWidth="2.4" strokeLinecap="round"
        />
        {/* Front rim specular — tight bright edge, lit only when the lamp is on */}
        <path
          d={`M ${LX - 18.5},${LENS_Y - 1.5} Q ${LX},${LENS_Y + 5.5} ${LX + 18.5},${LENS_Y - 1.5}`}
          fill="none" stroke="#e2eeff" strokeWidth="1.25" strokeLinecap="round"
          style={{ opacity: 'var(--lamp, 0)', transition: 'opacity 50ms linear' }}
        />
        {/* Inner throat recess — depth above the diffuser */}
        <ellipse cx={LX} cy={LENS_Y - 1} rx={18} ry={4.6} fill="#02060e" opacity="0.85"/>
        {/* Diffuser glass — off-state base (always visible) */}
        <ellipse cx={LX} cy={LENS_Y} rx={16.5} ry={4} fill="#0a1a30"/>

        {/* ── Lit lens face (on top of the housing), gated by --lamp ────────── */}
        <g style={{ opacity: 'var(--lamp, 0)', transition: 'opacity 50ms linear' }}>
          {/* Bright frosted diffuser disc */}
          <ellipse
            className={styles.lens}
            cx={LX} cy={LENS_Y} rx={15.5} ry={3.6}
            fill="url(#hl-diffuser)"
          />
          {/* Hot centre — soft frosted glow rather than a hard white dot */}
          <ellipse
            className={styles.emitCore}
            cx={LX} cy={LENS_Y + 1} rx={10} ry={3.4}
            fill="url(#hl-hot)"
          />
        </g>
      </g>

      {/* ══ 7. SWIVEL HINGE — small joint where the arm meets the head;
              static, so it masks the head's pivot at every aim angle ════════ */}
      <g className={styles.post}>
        <rect x={LX - 7} y={MY - 5} width={14} height={10} rx={4} fill="url(#hl-fitter)"/>
        {/* groove */}
        <rect x={LX - 7} y={MY - 1} width={14} height={2} fill="#02060c" opacity="0.5" rx={1}/>
        {/* specular */}
        <path
          d={`M ${LX - 4.5},${MY - 4} L ${LX - 4.5},${MY + 4}`}
          stroke="#5481aa" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"
        />
      </g>
    </svg>
  );
}
