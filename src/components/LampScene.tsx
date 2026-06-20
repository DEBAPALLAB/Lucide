'use client';

/**
 * LampScene — composable SVG street-lamp scene
 *
 * Design intent: cinematic, restrained. Light falls DOWNWARD from the lamp.
 * All elements are individually addressable for GSAP / Framer Motion.
 *
 * Props:
 *   lampOn           — master light toggle (default true)
 *   showRays         — stylised volumetric rays (loader use only, default false)
 *   personAnimated   — false lets GSAP control the person entrance
 *   preserveAspectRatio — SVG attr, use "xMidYMid slice" for full-bleed
 */

import React, { type CSSProperties } from 'react';
import styles from './LampScene.module.css';

// ── Scene coordinate system ───────────────────────────────────────────────────
const VW = 1000;
const VH = 580;

const GY = 472;    // ground y — lower for realistic pole proportion
const PX = 152;    // pole x (shifted left for better composition)
const PT = 96;     // pole top y
const LX = 258;    // lamp head x, end of shorter horizontal arm
const LY = 132;    // lamp emission face y (bottom of housing)
const FX = 322;    // person x, inside right edge of beam
const FY = GY;     // person feet y

// Beam cone — DOWNWARD, symmetric around lamp
const HALF = 190;
const BL   = LX - HALF;  // = 158 — left footprint at ground
const BR   = LX + HALF;  // = 538 — right footprint at ground

// ── Exported element IDs ─────────────────────────────────────────────────────
export const SCENE_IDS = {
  scene:       'ls-scene',
  beam:        'ls-beam',
  rays:        'ls-rays',
  lampHalo:    'ls-halo',
  fixtureLens: 'ls-lens',
  post:        'ls-post',
  pole:        'ls-pole',
  arm:         'ls-arm',
  person:      'ls-person',
  groundPool:  'ls-ground-pool',
  personPool:  'ls-person-pool',
  atmosphere:  'ls-atmosphere',
} as const;

// ─────────────────────────────────────────────────────────────────────────────

interface LampSceneProps {
  width?:               string | number;
  height?:              string | number;
  className?:           string;
  style?:               CSSProperties;
  lampOn?:              boolean;
  /** Stylised volumetric rays — only use in loader for dramatic effect */
  showRays?:            boolean;
  /** false = GSAP controls person; true = CSS lsAppear animation fires */
  personAnimated?:      boolean;
  preserveAspectRatio?: string;
  aimAtText?:           boolean;
}

export default function LampScene({
  width               = '100%',
  height              = '100%',
  className           = '',
  style,
  lampOn              = true,
  showRays            = false,
  personAnimated      = true,
  preserveAspectRatio = 'xMidYMid meet',
  aimAtText           = false,
}: LampSceneProps) {

  const svgStyle: CSSProperties = {
    '--ls-intensity': lampOn ? (aimAtText ? '1.35' : '1') : '0',
    ...style,
  } as CSSProperties;

  const light = styles.lightGroup;

  return (
    <svg
      id={SCENE_IDS.scene}
      className={`${styles.scene} ${aimAtText ? styles.aimed : ''} ${className}`}
      style={svgStyle}
      viewBox={`0 0 ${VW} ${VH}`}
      width={width}
      height={height}
      preserveAspectRatio={preserveAspectRatio}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Street lamp casting light down onto a lone figure"
      role="img"
    >
      <defs>

        {/* ── Filters ─────────────────────────────────────────────────── */}

        {/* Lamp bloom — soft, not cartoonish */}
        <filter id="ls-f-lamp" x="-600%" y="-600%" width="1300%" height="1300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="outer"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7"  result="inner"/>
          <feMerge>
            <feMergeNode in="outer"/>
            <feMergeNode in="inner"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Person bloom — wide, atmospheric */}
        <filter id="ls-f-person" x="-160%" y="-100%" width="420%" height="320%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="outer"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="5"  result="inner"/>
          <feMerge>
            <feMergeNode in="outer"/>
            <feMergeNode in="inner"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Pole — barely noticeable edge blur */}
        <filter id="ls-f-pole" x="-60%" y="-1%" width="220%" height="102%">
          <feGaussianBlur stdDeviation="1.0"/>
        </filter>

        {/* ── Gradients ───────────────────────────────────────────────── */}

        {/* Beam outer — very subtle downward cone; low opacity is the point */}
        <linearGradient id="ls-g-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#bcd4ff" stopOpacity="0.22"/>
          <stop offset="30%"  stopColor="#6688ee" stopOpacity="0.12"/>
          <stop offset="68%"  stopColor="#2244bb" stopOpacity="0.055"/>
          <stop offset="100%" stopColor="#0a1a88" stopOpacity="0"/>
        </linearGradient>

        {/* Beam core — brighter centre column */}
        <linearGradient id="ls-g-core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e6f0ff" stopOpacity="0.32"/>
          <stop offset="32%"  stopColor="#88aaff" stopOpacity="0.17"/>
          <stop offset="70%"  stopColor="#3355dd" stopOpacity="0.07"/>
          <stop offset="100%" stopColor="#0f2299" stopOpacity="0"/>
        </linearGradient>

        {/* Halo — warm white center, cool blue fade; single smooth gradient, NO rings */}
        <radialGradient id="ls-g-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fffaf4" stopOpacity="0.78"/>
          <stop offset="20%"  stopColor="#dceaff" stopOpacity="0.50"/>
          <stop offset="52%"  stopColor="#4466cc" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#000d33" stopOpacity="0"/>
        </radialGradient>

        {/* Ground pool */}
        <radialGradient id="ls-g-pool" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#a6c6ff" stopOpacity="0.40"/>
          <stop offset="48%"  stopColor="#3355cc" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#081a88" stopOpacity="0"/>
        </radialGradient>

        {/* Person aura */}
        <radialGradient id="ls-g-aura" cx="50%" cy="68%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>

        {/* Atmospheric haze around the beam volume */}
        <radialGradient id="ls-g-atmo" cx="50%" cy="44%" r="50%">
          <stop offset="0%"   stopColor="#0c1e88" stopOpacity="0.17"/>
          <stop offset="58%"  stopColor="#060e44" stopOpacity="0.07"/>
          <stop offset="100%" stopColor="#000008" stopOpacity="0"/>
        </radialGradient>

        {/* ── Metal / material gradients (3D shading) ─────────────────── */}

        {/* Pole — cylindrical: dark edges, faint cool specular off-centre */}
        <linearGradient id="ls-g-pole" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#020509"/>
          <stop offset="32%"  stopColor="#16293f"/>
          <stop offset="46%"  stopColor="#24405e"/>
          <stop offset="60%"  stopColor="#0c1828"/>
          <stop offset="100%" stopColor="#010306"/>
        </linearGradient>

        {/* Arm — same cylindrical read, tuned for a thinner tube */}
        <linearGradient id="ls-g-arm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#223c58"/>
          <stop offset="38%"  stopColor="#102134"/>
          <stop offset="100%" stopColor="#01040a"/>
        </linearGradient>

        {/* Fixture housing — top-lit metal volume */}
        <linearGradient id="ls-g-fixture" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#22364f"/>
          <stop offset="30%"  stopColor="#0e1d30"/>
          <stop offset="100%" stopColor="#02060d"/>
        </linearGradient>

        {/* Lens emitter — hot core to cool edge */}
        <linearGradient id="ls-g-lens" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="55%"  stopColor="#dcecff"/>
          <stop offset="100%" stopColor="#8fb4ff"/>
        </linearGradient>

      </defs>

      {/* ══════════════════════════════════════════════════════════════════
          0. BACKGROUND
          ══════════════════════════════════════════════════════════════════ */}
      <rect x="0" y="0" width={VW} height={VH} fill="#050709"/>

      {/* ══════════════════════════════════════════════════════════════════
          1. ATMOSPHERE — contained around the beam volume
          ══════════════════════════════════════════════════════════════════ */}
      <g
        id={SCENE_IDS.atmosphere}
        className={`${styles.atmosphere} ${light}`}
      >
        <ellipse
          className={styles.atmosphereShape}
          cx={LX + 10} cy={GY * 0.62}
          rx={220} ry={200}
          fill="url(#ls-g-atmo)"
        />
      </g>

      {/* ══════════════════════════════════════════════════════════════════
          2. BEAM — downward cone from lamp face to ground
          ══════════════════════════════════════════════════════════════════ */}
      <g
        id={SCENE_IDS.beam}
        className={`${styles.beam} ${light}`}
      >
        {/* Outer soft cone */}
        <polygon
          className={styles.beamOuter}
          points={`${LX - 5},${LY + 6}  ${BL},${GY}  ${BR},${GY}  ${LX + 5},${LY + 6}`}
          fill="url(#ls-g-beam)"
        />
        {/* Inner brighter column */}
        <polygon
          className={styles.beamCore}
          points={`${LX - 4},${LY + 6}  ${LX - 82},${GY}  ${LX + 82},${GY}  ${LX + 4},${LY + 6}`}
          fill="url(#ls-g-core)"
        />
      </g>

      {/* ══════════════════════════════════════════════════════════════════
          3. RAYS — optional, stylised (loader use only)
          ══════════════════════════════════════════════════════════════════ */}
      <g className={`${styles.aimBeam} ${light}`}>
        <polygon
          className={styles.aimBeamOuter}
          points={`${LX + 2},${LY + 8} ${LX + 410},${LY + 98} ${LX + 508},${LY + 236} ${LX + 8},${LY + 18}`}
          fill="url(#ls-g-beam)"
        />
        <polygon
          className={styles.aimBeamCore}
          points={`${LX + 4},${LY + 8} ${LX + 382},${LY + 116} ${LX + 426},${LY + 196} ${LX + 8},${LY + 14}`}
          fill="url(#ls-g-core)"
        />
      </g>

      {showRays && (
        <g id={SCENE_IDS.rays} className={`${styles.rays} ${light}`}>
          {([
            { x2: BL - 30, w: 0.9, d: '0.0s' },
            { x2: BL + 55, w: 1.7, d: '0.8s' },
            { x2: LX - 70, w: 2.1, d: '1.4s' },
            { x2: LX + 55, w: 2.1, d: '0.4s' },
            { x2: BR - 55, w: 1.7, d: '1.0s' },
            { x2: BR + 30, w: 0.9, d: '0.6s' },
          ] as const).map((r, i) => (
            <line
              key={i}
              className={styles.ray}
              x1={LX} y1={LY}
              x2={r.x2} y2={GY}
              stroke="#5577bb"
              strokeWidth={r.w}
              style={{ '--ray-delay': r.d } as CSSProperties}
            />
          ))}
        </g>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          4. GROUND POOL — directly under lamp
          ══════════════════════════════════════════════════════════════════ */}
      <g
        id={SCENE_IDS.groundPool}
        className={`${styles.groundPool} ${light}`}
      >
        <ellipse
          className={styles.poolOuter}
          cx={LX} cy={GY}
          rx={198} ry={20}
          fill="url(#ls-g-pool)"
        />
        <ellipse
          className={styles.poolInner}
          cx={LX} cy={GY}
          rx={74} ry={9}
          fill="#5577cc"
          fillOpacity="0.20"
        />
      </g>

      {/* ══════════════════════════════════════════════════════════════════
          5. GROUND LINE
          ══════════════════════════════════════════════════════════════════ */}
      <line
        className={styles.groundLine}
        x1="-20" y1={GY}
        x2={VW + 20} y2={GY}
        stroke="#0f1e33"
        strokeWidth="1"
        strokeOpacity="0.55"
      />

      {/* ══════════════════════════════════════════════════════════════════
          6. LAMP POST — pole, arm, bracket
          ══════════════════════════════════════════════════════════════════ */}
      <g id={SCENE_IDS.post} className={styles.post}>
        {/* Main pole — cylindrical metal */}
        <rect
          id={SCENE_IDS.pole}
          x={PX - 4} y={PT}
          width={8} height={GY - PT}
          fill="url(#ls-g-pole)"
          rx={1.5}
        />
        {/* Tight specular highlight — sells the round tube */}
        <rect
          x={PX - 0.5} y={PT + 6}
          width={1.2} height={GY - PT - 30}
          fill="#3a607f"
          opacity="0.55"
          rx={0.6}
        />
        {/* Pole base — tapered collar */}
        <path
          d={`M ${PX - 8},${GY} L ${PX - 5},${GY - 26} L ${PX + 5},${GY - 26} L ${PX + 8},${GY} Z`}
          fill="url(#ls-g-pole)"
        />
        <rect
          x={PX - 9} y={GY - 4}
          width={18} height={5}
          fill="#020509"
          rx={1.5}
        />

        {/* Diagonal support brace — pole to underside of arm */}
        <path
          d={`M ${PX + 2},${PT + 30} L ${LX - 58},${PT + 8.5} L ${LX - 58},${PT + 11} L ${PX + 2},${PT + 35} Z`}
          fill="url(#ls-g-arm)"
          opacity="0.92"
        />

        {/* Horizontal arm — thinner tapered tube (thicker at pole) */}
        <path
          id={SCENE_IDS.arm}
          d={`M ${PX - 1},${PT + 4} L ${LX + 1},${PT + 6.4} L ${LX + 1},${PT + 9.2} L ${PX - 1},${PT + 9.5} Z`}
          fill="url(#ls-g-arm)"
        />
        {/* Arm top-edge specular */}
        <path
          d={`M ${PX + 2},${PT + 4.4} L ${LX - 2},${PT + 6.6} L ${LX - 2},${PT + 7.3} L ${PX + 2},${PT + 5.2} Z`}
          fill="#36577a"
          opacity="0.7"
        />
        {/* Cast collar where arm meets pole */}
        <rect
          x={PX - 5} y={PT + 2}
          width={9} height={10}
          fill="url(#ls-g-pole)"
          rx={2}
        />
        {/* Vertical drop connector to housing */}
        <rect
          x={LX - 3.5} y={PT + 8}
          width={7} height={26}
          fill="url(#ls-g-fixture)"
          rx={2}
        />
      </g>

      {/* ══════════════════════════════════════════════════════════════════
          7. FIXTURE HOUSING
          ══════════════════════════════════════════════════════════════════ */}
      <g className={styles.fixtureRig}>
      <g className={styles.fixture}>
        {/* Housing body — tapered cobra head, top-lit metal */}
        <path
          className={styles.fixtureBody}
          d={`M ${LX - 26},${LY - 18}
              C ${LX - 26},${LY - 22} ${LX - 22},${LY - 23} ${LX - 18},${LY - 23}
              L ${LX + 19},${LY - 21}
              C ${LX + 24},${LY - 20} ${LX + 26},${LY - 17} ${LX + 25},${LY - 12}
              L ${LX + 21},${LY + 2}
              C ${LX + 20},${LY + 4} ${LX + 17},${LY + 5} ${LX + 14},${LY + 5}
              L ${LX - 15},${LY + 5}
              C ${LX - 19},${LY + 5} ${LX - 22},${LY + 3} ${LX - 23},${LY}
              Z`}
          fill="url(#ls-g-fixture)"
        />
        {/* Top spine highlight — crisp metal edge */}
        <path
          className={styles.fixtureTop}
          d={`M ${LX - 17},${LY - 21.5} L ${LX + 17},${LY - 19.5}`}
          stroke="#3c6189"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Under-shadow — separates housing from lens */}
        <rect
          x={LX - 19} y={LY - 1}
          width={38} height={3}
          fill="#01040a"
          opacity="0.6"
          rx={1.5}
        />
        {/* Lens / emitter face */}
        <rect
          id={SCENE_IDS.fixtureLens}
          className={`${styles.fixtureLens} ${light}`}
          x={LX - 17} y={LY + 1}
          width={34} height={7}
          fill="url(#ls-g-lens)"
          rx={3}
          opacity="0.95"
        />
      </g>
      </g>

      {/* ══════════════════════════════════════════════════════════════════
          8. LAMP GLOW — single radial gradient, no hard rings
          ══════════════════════════════════════════════════════════════════ */}
      <g
        id={SCENE_IDS.lampHalo}
        className={`${styles.lampHalo} ${styles.fixtureRig} ${light}`}
        filter="url(#ls-f-lamp)"
      >
        {/* Outer soft halo */}
        <circle
          className={styles.haloOuter}
          cx={LX} cy={LY}
          r={70}
          fill="url(#ls-g-halo)"
          opacity="0.56"
        />
        {/* Inner glow */}
        <circle
          className={styles.haloInner}
          cx={LX} cy={LY}
          r={16}
          fill="#c8deff"
          opacity="0.70"
        />
        {/* Hot spot */}
        <circle
          className={styles.haloHot}
          cx={LX} cy={LY}
          r={5}
          fill="#ffffff"
          opacity="1"
        />
      </g>

      {/* ══════════════════════════════════════════════════════════════════
          9. PERSON AURA — soft backlit glow
          ══════════════════════════════════════════════════════════════════ */}
      <ellipse
        className={`${styles.personAura} ${light}`}
        cx={FX} cy={FY - 64}
        rx={48} ry={86}
        fill="url(#ls-g-aura)"
      />

      {/* ══════════════════════════════════════════════════════════════════
          10. PERSON SILHOUETTE
          ══════════════════════════════════════════════════════════════════ */}
      <g
        id={SCENE_IDS.person}
        className={styles.person}
        transform={`translate(${FX},${FY})`}
        filter="url(#ls-f-person)"
        style={!personAnimated ? { opacity: 0, animation: 'none' } : undefined}
      >
        <circle cx="0"  cy="-132" r="14"  fill="white" className="ls-head"/>
        <rect   x="-5"  y="-118" width="10" height="12" rx="2" fill="white" className="ls-neck"/>
        <path d="M -24,-108 C -27,-104 -25,-90 -21,-74 L -14,-60 L 14,-60 L 21,-74 C 25,-90 27,-104 24,-108 Z" fill="white" className="ls-torso"/>
        <path d="M -14,-60 L 14,-60 L 16,-44 L -16,-44 Z" fill="white" className="ls-hips"/>
        <path d="M -16,-44 L -16,0 L -7,0 L -10,-44 Z"   fill="white" opacity="0.94" className="ls-leg-l"/>
        <path d="M 16,-44 L 16,0 L 7,0 L 10,-44 Z"       fill="white" opacity="0.94" className="ls-leg-r"/>
        <path d="M -21,-104 C -28,-92 -33,-74 -31,-60 L -25,-60 C -27,-74 -22,-92 -15,-104 Z" fill="white" opacity="0.88" className="ls-arm-l"/>
        <path d="M 21,-104 C 28,-92 32,-76 30,-62 L 24,-62 C 26,-76 22,-92 15,-104 Z"         fill="white" opacity="0.88" className="ls-arm-r"/>
      </g>

      {/* ══════════════════════════════════════════════════════════════════
          11. PERSON GROUND POOL
          ══════════════════════════════════════════════════════════════════ */}
      <ellipse
        id={SCENE_IDS.personPool}
        className={`${styles.personPool} ${light}`}
        cx={FX} cy={GY}
        rx={48} ry={10}
        fill="#88aaee"
        fillOpacity="0.22"
      />

    </svg>
  );
}
