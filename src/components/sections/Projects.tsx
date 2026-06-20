'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect } from 'react';

type ProjectData = {
  id: string;
  title: string;
  meta: string; // short category line
  description: string;
  image: string;
  link: string;
  techStack: string[];
  glow: string; // rgb triplet — backlight colour, continues the WorkLight palette
};

const projectsData: ProjectData[] = [
  {
    id: 'p1',
    title: 'Aaradhya Herbals',
    meta: 'Ayurveda — Brand & Site',
    description:
      'A 15-year Ayurvedic manufacturer brought online — 120+ GMP-certified, AYUSH-compliant formulations framed in Sanskrit ritual and modern proof, built to earn the trust of wellness brands and clinics.',
    image: '/images/workcrazy/aaradhya.png',
    link: 'https://aaradhyapreview.netlify.app',
    techStack: ['React', 'Tailwind', 'GSAP'],
    glow: '150, 186, 255', // blue-white
  },
  {
    id: 'p2',
    title: 'CompareFi',
    meta: 'Fintech — Comparison Engine',
    description:
      'An independent engine for India’s securities-backed lending — loans against shares, mutual funds, and margin facilities weighed side by side. No hidden charges, no jargon, no biased recommendations.',
    image: '/images/workcrazy/comparefi.png',
    link: 'https://comparefi.in',
    techStack: ['Next.js', 'React', 'Tailwind'],
    glow: '96, 206, 206', // teal
  },
  {
    id: 'p3',
    title: 'NotAPrompt',
    meta: 'AI — Network Simulation',
    description:
      'Not another chatbot — a network-science engine that runs an idea through 1,499 sociometric AI agents, visualising adoption cascades and tipping points before a single rupee goes into the launch.',
    image: '/images/workcrazy/notaprompt12.png',
    link: 'https://notaprompt.in',
    techStack: ['Next.js', 'React', 'Framer'],
    glow: '255, 110, 42', // orange
  },
  {
    id: 'p4',
    title: 'Superforms',
    meta: 'AI — Form Builder',
    description:
      'The blank-page problem, solved — describe a form in a sentence and Superforms writes, orders, and themes it in under a minute. Because the best form is the one people actually finish.',
    image: '/images/workcrazy/superforms.png',
    link: 'https://superforms.in',
    techStack: ['Next.js', 'React', 'Tailwind'],
    glow: '192, 150, 238', // violet
  },
];

function TechIcon({ tech }: { tech: string }) {
  switch (tech) {
    case 'SvelteKit':
      return (
        <svg width="17" height="20" viewBox="0 0 98 118" fill="none" aria-label="SvelteKit">
          <path fill="#FF3E00" d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 2 44c-1.2 7.2.2 14.7 3.9 20.9-.9 1.3-1.6 2.8-2.2 4.3-2.2 6.1-1.5 13 1.9 18.5 10.9 15.7 32.6 20.3 48.2 10.4l27.5-17.6c7.5-4.7 12.7-12.4 14.1-21.2 1.2-7.2-.2-14.7-3.9-20.9.9-1.3 1.6-2.8 2.2-4.3 2.2-6.1 1.5-13-1.9-18.5z"/>
          <path fill="#fff" d="M40.9 103.9c-8.9 2.3-18.2-1.2-23.4-8.7-3.1-4.4-4.3-9.9-3.2-15.3.2-.9.4-1.7.6-2.6l.5-1.6 1.4 1c3.3 2.4 6.9 4.2 10.8 5.4l1 .3-.1 1c-.1 1.4.3 2.9 1.1 4 1.7 2.4 4.7 3.4 7.4 2.7.6-.2 1.2-.4 1.7-.8L65.4 72c1.4-.9 2.3-2.2 2.6-3.8.3-1.6-.1-3.3-1-4.6-1.7-2.4-4.7-3.4-7.4-2.7-.6.2-1.2.4-1.7.8l-10.5 6.7c-1.7 1.1-3.6 1.9-5.6 2.4-8.9 2.3-18.2-1.2-23.4-8.7-3.1-4.4-4.3-9.9-3.2-15.3 1-5.3 4.2-9.9 8.8-12.8l27.5-17.5c1.7-1.1 3.6-1.9 5.6-2.4 8.9-2.3 18.2 1.2 23.4 8.7 3.1 4.4 4.3 9.9 3.2 15.3-.2.9-.4 1.7-.6 2.6l-.5 1.6-1.4-1c-3.3-2.4-6.9-4.2-10.8-5.4l-1-.3.1-1c.1-1.4-.3-2.9-1.1-4-1.7-2.4-4.7-3.4-7.4-2.7-.6.2-1.2.4-1.7.8L32.2 46.7c-1.4.9-2.3 2.2-2.6 3.8-.3 1.6.1 3.3 1 4.6 1.7 2.4 4.7 3.4 7.4 2.7.6-.2 1.2-.4 1.7-.8l10.5-6.7c1.7-1.1 3.6-1.9 5.6-2.4 8.9-2.3 18.2 1.2 23.4 8.7 3.1 4.4 4.3 9.9 3.2 15.3-1 5.3-4.2 9.9-8.8 12.8L46.5 102.3c-1.7 1.1-3.6 1.9-5.6 2.4v-.8z"/>
        </svg>
      );
    case 'Tailwind':
      return (
        <svg width="24" height="15" viewBox="0 0 54 33" fill="#38BDF8" aria-label="Tailwind CSS">
          <path d="M27 0C19.8 0 15.3 3.6 13.5 10.8c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/>
        </svg>
      );
    case 'GSAP':
      return (
        <svg width="20" height="20" viewBox="0 0 100 100" fill="none" aria-label="GSAP">
          <circle cx="50" cy="50" r="48" fill="#0E100F"/>
          <text x="50" y="63" textAnchor="middle" fill="#88CE02" style={{ fontSize: 30, fontWeight: 700, fontFamily: 'Arial, sans-serif' }}>GS</text>
        </svg>
      );
    case 'Next.js':
      return (
        <svg width="20" height="20" viewBox="0 0 180 180" fill="none" aria-label="Next.js">
          <defs>
            <clipPath id="nextjs-circle-clip">
              <circle cx="90" cy="90" r="90"/>
            </clipPath>
          </defs>
          <circle cx="90" cy="90" r="90" fill="black"/>
          <path clipPath="url(#nextjs-circle-clip)" fill="white" d="M149.508 157.52L69.142 54H54V126H66.6137V69.3955L141.27 164.845C144.087 162.606 146.827 160.243 149.508 157.52Z"/>
          <rect clipPath="url(#nextjs-circle-clip)" x="115" y="54" width="12" height="72" fill="white"/>
        </svg>
      );
    case 'React':
      return (
        <svg width="20" height="20" viewBox="0 0 100 100" fill="none" aria-label="React">
          <circle cx="50" cy="50" r="8" fill="#61DAFB"/>
          <ellipse cx="50" cy="50" rx="47" ry="18" stroke="#61DAFB" strokeWidth="5" fill="none"/>
          <ellipse cx="50" cy="50" rx="47" ry="18" stroke="#61DAFB" strokeWidth="5" fill="none" transform="rotate(60 50 50)"/>
          <ellipse cx="50" cy="50" rx="47" ry="18" stroke="#61DAFB" strokeWidth="5" fill="none" transform="rotate(120 50 50)"/>
        </svg>
      );
    case 'Framer':
      return (
        <svg width="14" height="20" viewBox="0 0 14 21" fill="#0055FF" aria-label="Framer">
          <path d="M0 0h14v7H7z"/>
          <path d="M0 7h7l7 7H0z"/>
          <path d="M0 14h7v7z"/>
        </svg>
      );
    default:
      return <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#888' }}>{tech}</span>;
  }
}

function ProjectCard({ project, index, total }: { project: ProjectData; index: number; total: number }) {
  const [hovered, setHovered] = useState(false);
  const [suppressed, setSuppressed] = useState(false); // true while over the tech pills
  const articleRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered blur-fade entrance
  useEffect(() => {
    const article = articleRef.current;
    const card = cardRef.current;
    const text = textRef.current;
    if (!article || !card || !text) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Set hidden state instantly (before first paint via layout effect timing)
    const hide = (el: HTMLElement) => {
      el.style.opacity = '0';
      el.style.filter = 'blur(18px)';
      el.style.transform = 'translateY(36px)';
      el.style.willChange = 'opacity, filter, transform';
    };
    hide(card);
    hide(text);

    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

    // Drop the layer-promoting will-change once the reveal has finished, so we
    // don't permanently hold GPU layers for every card + text block.
    const clearWillChange = (el: HTMLElement) => {
      el.addEventListener('transitionend', () => { el.style.willChange = 'auto'; }, { once: true });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Card reveals first
        card.style.transition = `opacity 1s ${EASE}, filter 1.1s ${EASE}, transform 1s ${EASE}`;
        card.style.opacity = '1';
        card.style.filter = 'blur(0px)';
        card.style.transform = 'translateY(0px)';
        clearWillChange(card);
        // Text follows 160ms later
        setTimeout(() => {
          text.style.transition = `opacity 0.9s ${EASE}, filter 1s ${EASE}, transform 0.9s ${EASE}`;
          text.style.opacity = '1';
          text.style.filter = 'blur(0px)';
          text.style.transform = 'translateY(0px)';
          clearWillChange(text);
        }, 160);
        observer.disconnect();
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(article);
    return () => observer.disconnect();
  }, []);

  // Lerp follower — current eases toward target. The loop only runs while the
  // pointer is over the card, then self-terminates: no perpetual idle frames,
  // and no start/stop race (it never cancels on leave — it just stops itself).
  const pos = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const rafRef = useRef(0);
  const hoverRef = useRef(false);

  const write = useCallback((x: number, y: number) => {
    const pill = pillRef.current;
    if (pill) pill.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }, []);

  const ensureLoop = useCallback(() => {
    if (rafRef.current) return; // already running
    const tick = () => {
      const p = pos.current;
      p.cx += (p.tx - p.cx) * 0.2;
      p.cy += (p.ty - p.cy) * 0.2;
      write(p.cx, p.cy);
      const settled = Math.abs(p.tx - p.cx) < 0.1 && Math.abs(p.ty - p.cy) < 0.1;
      // Keep going while hovered, or until the pill has caught up after leaving.
      if (hoverRef.current || !settled) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [write]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const onEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Seed current AND target to the cursor so the pill grows in place — no jump
      pos.current = { tx: x, ty: y, cx: x, cy: y };
      write(x, y);
      hoverRef.current = true;
      setHovered(true);
      ensureLoop();
    },
    [write, ensureLoop]
  );

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    pos.current.tx = e.clientX - rect.left;
    pos.current.ty = e.clientY - rect.top;
  }, []);

  const onLeave = useCallback(() => {
    hoverRef.current = false;
    setHovered(false);
  }, []);

  return (
    <article ref={articleRef} className="group relative isolate">
      {/* Card */}
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative z-10 w-full overflow-hidden rounded-[20px] border border-white/6 bg-[#0d1018] transition-[border-color] duration-500 group-hover:border-white/14"
        style={{
          height: 'clamp(300px, 68vh, 740px)',
          boxShadow: '0 40px 80px -40px rgba(0, 0, 0, 0.7)',
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 90vw, 100vw"
          className="object-cover object-center transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.03]"
        />

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-[#0d1018]/70 to-transparent" />

        {/* Live-site link — covers the card; tech pills (z-30) stay clickable above it */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} (opens in a new tab)`}
          className="absolute inset-0 z-10"
        />

        {/* Project index — top left */}
        <div className="pointer-events-none absolute left-6 top-6 z-20 font-mono text-[9px] uppercase tracking-[0.22em] text-white/28">
          {String(index + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
        </div>

        {/* Tech stack pill — glassmorphic, names reveal on hover */}
        <div
          onMouseEnter={() => setSuppressed(true)}
          onMouseLeave={() => setSuppressed(false)}
          className="absolute bottom-6 left-6 z-30 flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-md"
        >
          {project.techStack.map((tech) => (
            <span
              key={tech}
              title={tech}
              className="group/tech flex items-center rounded-full px-2 py-1.5 transition-colors duration-300 hover:bg-white/15"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-300 group-hover/tech:scale-110">
                <TechIcon tech={tech} />
              </span>
              <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-widest text-white opacity-0 transition-all duration-300 ease-[0.16,1,0.3,1] group-hover/tech:ml-2 group-hover/tech:max-w-[110px] group-hover/tech:opacity-100">
                {tech}
              </span>
            </span>
          ))}
        </div>

      </div>

      {/* Following cursor pill — sibling of the card so it isn't clipped by overflow-hidden */}
      <div
        ref={pillRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20"
        style={{ transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)', willChange: 'transform' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            borderRadius: 9999,
            background: 'white',
            color: '#06080d',
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '13px 24px',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 28px rgba(0,0,0,0.32), 0 0 0 5px rgba(255,255,255,0.10)',
            opacity: hovered && !suppressed ? 1 : 0,
            transform: hovered && !suppressed ? 'scale(1)' : 'scale(0.5)',
            transition: hovered && !suppressed
              ? 'opacity 0.22s ease, transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'opacity 0.28s ease, transform 0.34s cubic-bezier(0.7, 0, 0.84, 0)',
            willChange: 'transform, opacity',
          }}
        >
          View <span style={{ fontSize: 14, lineHeight: 1 }}>→</span>
        </div>
      </div>

      {/* Editorial case note */}
      <div ref={textRef} className="mt-9 md:mt-11">
        {/* Title — the confident hero */}
        <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:gap-16 lg:gap-24">
          <h3
            className="text-white/90"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(40px, 4.6vw, 68px)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
            }}
          >
            {project.title}
          </h3>

          {/* Body — readable lead + spec/action footer */}
          <div className="md:pt-1">
            <p
              className="font-body text-white/62"
              style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.72, maxWidth: '46ch' }}
            >
              {project.description}
            </p>

            <div className="mt-7 flex items-end justify-between gap-6 border-t border-white/8 pt-5 md:mt-9">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="cta"
                className="group/cta inline-flex items-center gap-2.5 text-white/75 transition-colors duration-300 hover:text-white"
              >
                <span className="relative font-mono text-[11px] uppercase tracking-[0.2em]">
                  Visit live site
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:scale-x-100" />
                </span>
                <span className="text-[13px] leading-none transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5">
                  ↗
                </span>
              </a>

              <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-white/28 sm:block">
                {project.techStack.join(' · ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// Description split into words, each animated individually via IntersectionObserver.
const DESCRIPTION_SENTENCES = [
  'Every project here started as a conversation about what a business actually needs.',
  'These are the ones where design, engineering, and strategy landed exactly where they should.',
];

function ProjectsHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const headline = headlineRef.current;
    const words = wordsRef.current.filter(Boolean);
    if (!headline || words.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

    headline.style.opacity = '0';
    headline.style.filter = 'blur(14px)';
    headline.style.transform = 'translateY(18px)';
    headline.style.willChange = 'opacity, filter, transform';

    words.forEach((w) => {
      w.style.opacity = '0';
      w.style.filter = 'blur(10px)';
      w.style.transform = 'translateY(10px)';
      w.style.willChange = 'opacity, filter, transform';
      w.style.display = 'inline-block';
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        // Headline first
        requestAnimationFrame(() => {
          headline.style.transition = `opacity 0.8s ${EASE}, filter 0.9s ${EASE}, transform 0.8s ${EASE}`;
          headline.style.opacity = '1';
          headline.style.filter = 'blur(0px)';
          headline.style.transform = 'translateY(0)';
        });

        // Description words staggered after headline starts
        words.forEach((w, i) => {
          setTimeout(() => {
            w.style.transition = `opacity 0.55s ${EASE}, filter 0.65s ${EASE}, transform 0.55s ${EASE}`;
            w.style.opacity = '1';
            w.style.filter = 'blur(0px)';
            w.style.transform = 'translateY(0)';
            w.addEventListener('transitionend', () => { w.style.willChange = 'auto'; }, { once: true });
          }, 220 + i * 38);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  // Flatten both sentences into word tokens, tracking sentence boundaries for spacing
  const allWords: { word: string; sentenceEnd: boolean }[] = [];
  DESCRIPTION_SENTENCES.forEach((sentence, si) => {
    sentence.split(' ').forEach((word, wi, arr) => {
      allWords.push({ word, sentenceEnd: wi === arr.length - 1 && si < DESCRIPTION_SENTENCES.length - 1 });
    });
  });

  return (
    <div ref={headerRef} className="mb-20 md:mb-24">
      <h2
        ref={headlineRef}
        className="font-heading text-[clamp(42px,5.4vw,84px)] font-bold leading-[0.92] tracking-[-0.03em] text-white"
      >
        Deeper case notes<span className="text-blue-sphere">.</span>
      </h2>

      {/* Word-by-word description reveal */}
      <p
        className="mt-7 max-w-[60ch]"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 1.15vw, 18px)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.48)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {allWords.map(({ word, sentenceEnd }, i) => (
          <span key={i}>
            <span
              ref={(el) => { if (el) wordsRef.current[i] = el; }}
            >
              {word}
            </span>
            {sentenceEnd ? ' ' : i < allWords.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full bg-void px-6 py-28 md:px-[clamp(24px,5vw,80px)] md:py-36 overflow-x-clip"
    >
      {/* Transition glow — violet light from the Work section above bleeds in and fades. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(192,150,238,0.16) 0%, rgba(192,150,238,0.06) 32%, transparent 68%)',
          mixBlendMode: 'screen',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        {/* Section header */}
        <ProjectsHeader />

        {/* Project list */}
        <div className="flex flex-col gap-28 md:gap-36">
          {projectsData.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              total={projectsData.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
