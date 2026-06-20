# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build — run after meaningful changes
npm run lint      # ESLint
```

No test suite exists yet.

## Architecture

This is the **v8** iteration of the Lucide Tech agency site. The root workspace (`d:/codings/web design tests/`) holds v1–v8 as sibling directories; only `v8/` is active.

### Render pipeline

```
layout.tsx
  └─ <Cursor />            ← custom cursor, always mounted, pointer-events layer
  └─ <SmoothScroll>        ← Lenis instance bridged to GSAP ticker
       └─ page.tsx
            └─ <Nav />
            └─ <Hero />
            └─ <Work />
            └─ <Studio />
            └─ <Projects />
            └─ <Team />
            └─ <Contact />   ← imports <ContactForm />
```

`ClientShell` / `PageLoader` exist but are not currently wired into `layout.tsx`.

### Animation ownership — strict split

| Area | Library | Notes |
|---|---|---|
| Hero, Nav | Framer Motion | `animate`, `motion.*`, CSS var `--lamp` |
| Work section | GSAP + ScrollTrigger | `useLayoutEffect`, `gsap.context()` cleanup mandatory |
| Everything else | CSS / rAF / IntersectionObserver | No GSAP or Framer outside the above two |
| Smooth scroll | Lenis → GSAP ticker | `window.lenis` exposed for scroll-lock |

Do not mix the two systems in the same component. GSAP ScrollTrigger is registered once in `SmoothScroll.tsx` and again locally in `Work.tsx` (safe via `gsap.context`).

### Scroll system constraint

Lenis drives smooth scroll and feeds `ScrollTrigger.update` on every frame. **Never use native `window.scrollY` for scroll-driven values** — always go through Lenis or ScrollTrigger. `gsap.ticker.lagSmoothing(0)` is intentional; don't remove it.

### CSS architecture

**Tailwind v4** — `@import "tailwindcss"` in `globals.css`, `@theme inline` block re-exports CSS vars as Tailwind tokens. Use Tailwind utility classes for layout/spacing. Component-specific styles live in either `*.module.css` or `<style jsx>` blocks (Work section uses `<style jsx>`).

**Canonical Tailwind v4 class names** — use `bg-linear-to-b` not `bg-gradient-to-b`, `border-white/18` not `border-white/[0.18]`, `bg-white/9` not `bg-white/[0.09]`. Bracket notation only when no canonical exists.

**Design tokens** are in `globals.css` `:root`. Always use them — never hard-code colors.

Key tokens:
- `--void: #080808` — page background
- `--blue-sphere: #3B7FE8` — accent, used sparingly (tags, active dots, the period in headlines)
- `--font-heading` / `--font-body`: Public Sans; `--font-mono`: JetBrains Mono
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` — standard easing

### Custom cursor

`Cursor.tsx` replaces the native cursor on hover-capable devices (`cursor: none` via globals). Use `data-cursor="cta"` on anchor/button elements to trigger the enlarged CTA ring state. Never add `cursor: pointer` via CSS — the native cursor is hidden.

### Hero lamp system

`HeroLamp.tsx` renders an SVG street lamp whose rig rotates around a fixed pivot using a GSAP `animate` call on an angle ref. The `--lamp` CSS var (0–1) gates beam/emission opacity. `HeroLamp.module.css` owns all keyframe animations. `Hero.tsx` controls `aimAtText` / `isLocked` state.

### Work section rules

The most fragile part of the site. A pinned GSAP ScrollTrigger timeline scrubs through `760vh` while `work-sticky` stays fixed.

- All desktop logic lives inside `ScrollTrigger.matchMedia('(min-width: 768px)')` inside `gsap.context()`.
- Text/number state (`activeProject`) is synced via `timeline.eventCallback('onUpdate', ...)` — not from scroll position directly.
- The image rail moves diagonally; copy is fixed UI. Never attach copy to the rail.
- Mobile uses `.work-mobile` with IntersectionObserver — no ScrollTrigger.
- Typography uses `<style jsx>` with `.svc-*` class names. Deliverable numbers use `order: -1` to appear left of text without JSX changes.

### WorkLight (section 2 background)

`WorkLight.tsx` is the first child of `.work-sticky` at `z-index: 0`. It renders a right-edge light spill via three screen-blended CSS layers animated by a single rAF loop driving `--wl-y`, `--wl-intensity`, and `--wl-flicker`.

### Projects section

`Projects.tsx` is `'use client'`. Key patterns:

- **Cursor pill**: perpetual rAF lerp loop running from mount to unmount (no start/stop races). On `mouseenter`, seed both target (`tx/ty`) and current (`cx/cy`) to the cursor position to prevent center-jump.
- **Tech pill suppression**: `suppressed` state set by `onMouseEnter`/`onMouseLeave` on the tech pill container. View pill gated on `hovered && !suppressed`. Tech pills at `z-30`, View pill at `z-20`, card link overlay at `z-10`.
- **Full-card link**: `<a className="absolute inset-0 z-10" />` overlay — no `data-cursor="cta"` to avoid double cursor ring.
- **Entrance animation**: `IntersectionObserver` triggers blur-fade on card, then text 160ms later.
- **Section uses `overflow-x-clip`** not `overflow-hidden` — clip doesn't break `position: sticky`.
- **Violet transition glow** at top: `radial-gradient(120% 100% at 50% 0%, rgba(192,150,238,0.16)...)` bridging from Work section above.
- `ProjectData` type has `id`, `title`, `meta`, `description`, `image`, `link`, `techStack`, `glow` fields.
- 4 real projects wired to live URLs: Aaradhya Herbals, CompareFi, NotAPrompt, Superforms.

### ContactForm

`ContactForm.tsx` is `'use client'`. Conversational mad-lib style — no card or border panel.

- `Blank` component: auto-sizing inline input, `border-white/30 bg-white/9` empty, `border-blue-sphere/60 bg-blue-sphere/15` filled.
- `InlineSelect` component: same visual language, dropdown with expo-pop animation.
- Empty fields pulse with `cf-fieldpulse` keyframe (defined via `<style jsx global>`) with staggered per-field delays.
- Success state uses Cormorant Garamond italic.
- Hint system (not error list): single mono line driven by `hint` state.
- **Backend not yet wired** — `onSubmit` has a `TODO` comment; currently fakes a 1.1s delay.

### Team section

`Team.tsx` is a server component. Editorial roster of 6 people:

| # | Name | Role |
|---|---|---|
| 01 | Dev | Founder · Head of Product |
| 02 | Dhruv | CTO · Developer |
| 03 | Soham | COO · Backend Developer |
| 04 | Shivam | Product · Growth |
| 05 | Priya | Design · Jr Developer |
| 06 | Tanvi | CMO · Growth & Sales |

Rows are `border-b` separated; index turns `blue-sphere` on hover; name snaps to full white. Role is right-aligned on desktop, drops below name on mobile.

### Contact section

`Contact.tsx` imports `ContactForm`. Left column is sticky on desktop. Channel list (Email, X, LinkedIn, Instagram) renders below the paragraph with hover slide/highlight animation. The old 3-card `contactDetails` grid still exists at the bottom of the file but renders as dead JSX — it can be cleaned up.

Contact details to update when ready:
- Email: `firstcontact@fromanother.love` (placeholder)
- X: `@lucidetech` (placeholder)
- LinkedIn: `/company/lucidetech` (placeholder)
- Instagram: `@lucide.tech` (placeholder)

## Brand direction

Dark, cinematic, precise. Avoid: gradients with bright color blobs, scroll-snap, carousels, SaaS-style boxed form UI. Blue (`--blue-sphere`) is an accent only — never dominant. Typography inspiration: awwwards editorial — large names, indexed lists, muted supporting text.

Fonts: Clash Display and Cabinet Grotesk (Fontshare); Public Sans and JetBrains Mono (Google Fonts). Cormorant Garamond italic used for success states and editorial accents.

## Pending / known gaps

- `ProjectsAmbient.tsx` — orphaned file, nothing imports it, safe to delete
- Contact form backend — needs `/api/contact`, Formspree, or Resend
- Real social handles for Contact channels
- Footer — doesn't exist yet
