'use client';

import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WorkLight from '@/components/WorkLight';

gsap.registerPlugin(ScrollTrigger);

type Service = {
  number: string;
  category: string;
  title: string;
  lead: string;
  description: string;
  deliverables: string[];
  metric: { value: string; label: string };
  link: string;
  image: string;
};

const services: Service[] = [
  {
    number: '01',
    category: 'Interface · Experience',
    title: 'Design that converts',
    lead: 'Interfaces that turn visitors into clients.',
    description:
      'We design every screen around one job — moving the right people to act. Strategy first, beauty always, nothing left to chance.',
    deliverables: ['Discovery & UX strategy', 'Bespoke interface design', 'Interactive prototypes'],
    metric: { value: '+210%', label: 'avg. conversion lift' },
    link: '#',
    image: '/images/work/project-1.jpg',
  },
  {
    number: '02',
    category: 'Engineering · Build',
    title: 'Engineered to perform',
    lead: 'Fast, custom, and built to last.',
    description:
      'No page-builders, no bloat. We hand-build front-ends and back-ends that load in a blink and never get in your way.',
    deliverables: ['Custom front-end build', 'Headless CMS & APIs', 'Performance & SEO foundation'],
    metric: { value: '0.8s', label: 'median load time' },
    link: '#',
    image: '/images/work/project-2.jpg',
  },
  {
    number: '03',
    category: 'Product · SaaS · Apps',
    title: 'Idea to product',
    lead: 'From napkin sketch to shipped product.',
    description:
      'Have an idea? We take it to a live SaaS or mobile app — product strategy, full-stack build, and a launch that holds up under load.',
    deliverables: ['Product & technical strategy', 'Full-stack web & app builds', 'MVP to scale-ready'],
    metric: { value: '0→1', label: 'idea to launch' },
    link: '#',
    image: '/images/work/project-3.jpg',
  },
  {
    number: '04',
    category: 'Visibility · Growth',
    title: 'Built to be found',
    lead: 'Rankings that compound into revenue.',
    description:
      'Gorgeous means nothing if you’re invisible. We engineer the search presence and traffic that keep paying off long after launch.',
    deliverables: ['Technical SEO & audits', 'Content & keyword strategy', 'Analytics & growth loops'],
    metric: { value: '3.4×', label: 'organic traffic growth' },
    link: '#',
    image: '/images/work/project-4.jpg',
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const projectRefs = useRef<Array<HTMLElement | null>>([]);
  const mobileProjectRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeProject, setActiveProject] = useState(0);
  // Light phase: intro frame keeps the light centred; showcase drives it per-service.
  const [lightPhase, setLightPhase] = useState<'intro' | 'showcase'>('intro');
  const lightPhaseRef = useRef<'intro' | 'showcase'>('intro');
  const activeService = services[activeProject];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        '(min-width: 768px)': function setupDesktopWork() {
          const outer = outerRef.current;
          const sticky = stickyRef.current;
          const rail = railRef.current;
          const number = numberRef.current;
          const copy = copyRef.current;
          const cards = projectRefs.current.filter(Boolean) as HTMLElement[];
          let currentIndex = 0;
          let textTween: gsap.core.Timeline | null = null;

          if (!outer || !sticky || !rail || !number || !copy || cards.length === 0) return;

          const activateProject = (index: number) => {
            if (index === currentIndex) return;
            currentIndex = index;
            textTween?.kill();
            // The giant number rolls (reel) — no fade. The copy does a staggered
            // word/line RISE: a quick block fade-out clears the old text, then the
            // new title/lead words and the remaining lines each rise from y:15,
            // opacity:0 with a small per-element stagger and an ease-out settle.
            textTween = gsap
              .timeline({ defaults: { overwrite: true } })
              // Swap content while the words are still clipped below their wrappers —
              // no container fade so the block never disappears from the screen.
              .call(() => {
                flushSync(() => setActiveProject(index));
              })
              // Title + lead words cascade up (the fluid hero effect).
              .fromTo(
                copy.querySelectorAll('.svc-word'),
                { yPercent: 110, opacity: 0 },
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.58,
                  ease: 'power3.out',
                  stagger: 0.028,
                },
              )
              // Supporting lines rise in behind the words.
              .fromTo(
                copy.querySelectorAll('.svc-category, .svc-desc, .svc-deliverables .work-copy-line, .svc-footer'),
                { y: 12, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.46,
                  ease: 'power3.out',
                  stagger: 0.04,
                },
                '-=0.38',
              );
          };

          gsap.set(rail, {
            x: '0vw',
            y: '0vh',
            rotate: 0,
            transformOrigin: '50% 50%',
          });
          gsap.set(cards, {
            autoAlpha: 0.14,
            xPercent: -50,
            yPercent: -50,
            scale: 0.86,
            filter: 'blur(7px)',
          });
          gsap.set(cards[0], {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px)',
          });
          gsap.set('.work-intro-content', { autoAlpha: 1, y: 0 });
          gsap.set('.work-showcase-layer', { autoAlpha: 0, y: 24 });
          gsap.set([number, copy], { autoAlpha: 1, y: 0, filter: 'blur(0px)' });

          // Intro entrance — elements start hidden, animate in on scroll-into-view
          gsap.set('.work-intro-word', { autoAlpha: 0, y: 30, filter: 'blur(6px)' });
          gsap.set('.work-intro-content p', { autoAlpha: 0, y: 16 });
          gsap.set('.work-scroll-hint', { autoAlpha: 0, y: 8 });

          ScrollTrigger.create({
            trigger: outer,
            start: 'top 78%',
            once: true,
            onEnter() {
              gsap.timeline({ defaults: { ease: 'power3.out' } })
                .to('.work-intro-word', {
                  autoAlpha: 1, y: 0, filter: 'blur(0px)',
                  duration: 0.72, stagger: 0.07,
                }, '-=0.28')
                .to('.work-intro-content p', { autoAlpha: 1, y: 0, duration: 0.52 }, '-=0.4')
                .to('.work-scroll-hint', { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.28');
            },
          });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: outer,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.4,
              pin: sticky,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const syncProjectToTimeline = () => {
            const time = timeline.time();
            // Each stop is the moment that card is fully centred and active.
            // advance threshold: cross 60% of the way to the next stop → commit.
            // retreat threshold: fall back 40% toward the previous stop → revert.
            // This creates a hysteresis band so you can hover at a boundary without
            // the section flickering between two states.
            const stops = [1.6, 2.6, 3.68, 4.76];
            let next = currentIndex;
            if (currentIndex < stops.length - 1) {
              const midFwd = stops[currentIndex] + (stops[currentIndex + 1] - stops[currentIndex]) * 0.6;
              if (time >= midFwd) next = currentIndex + 1;
            }
            if (currentIndex > 0) {
              const midBwd = stops[currentIndex] - (stops[currentIndex] - stops[currentIndex - 1]) * 0.4;
              if (time < midBwd) next = currentIndex - 1;
            }
            // Clamp for the edge case where the timeline overshoots slightly
            next = Math.max(0, Math.min(stops.length - 1, next));

            activateProject(next);

            // Intro frame holds the light centred; showcase hands it to the rail.
            const nextPhase = time >= 1.05 ? 'showcase' : 'intro';
            if (nextPhase !== lightPhaseRef.current) {
              lightPhaseRef.current = nextPhase;
              setLightPhase(nextPhase);
            }
          };

          timeline.eventCallback('onUpdate', syncProjectToTimeline);

          timeline.to(
            '.work-intro-content',
            {
              autoAlpha: 0,
              y: -42,
              duration: 0.65,
              ease: 'power2.out',
            },
            0.65,
          );

          timeline.to(
            '.work-showcase-layer',
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: 'power2.out',
            },
            1.08,
          );

          services.slice(1).forEach((_, projectOffset) => {
            const index = projectOffset + 1;
            const card = cards[index];
            const at = 1.9 + projectOffset * 1.08;

            timeline.to(
              rail,
              {
                x: `${index * -30}vw`,
                y: `${index * -64}vh`,
                rotate: 0,
                duration: 0.9,
                ease: 'power2.inOut',
              },
              at,
            );

            timeline.to(
              cards,
              {
                autoAlpha: 0.14,
                scale: 0.86,
                filter: 'blur(7px)',
                duration: 0.5,
                ease: 'power2.out',
              },
              at + 0.16,
            );

            timeline.to(
              card,
              {
                autoAlpha: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.58,
                ease: 'power3.out',
              },
              at + 0.4,
            );

          });

          timeline.to(
            rail,
            {
              x: `${(services.length - 1) * -30}vw`,
              y: `${(services.length - 1) * -64}vh`,
              rotate: 0,
              duration: 1.1,
              ease: 'none',
            },
            services.length + 1.5,
          );
        },
      });
    }, section);

    const mobileObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.18 },
    );

    mobileProjectRefs.current.forEach((project) => {
      if (project) mobileObserver.observe(project);
    });

    return () => {
      mobileObserver.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className="work-section" aria-label="Our services">
      <div ref={outerRef} className="work-outer">
        <div ref={stickyRef} className="work-sticky">
          <WorkLight phase={lightPhase} project={activeProject} />
          <div className="work-intro-content">
            <h2>
              <span className="work-intro-word">Four</span>{' '}
              <span className="work-intro-word">things</span>{' '}
              <span className="work-intro-word">we</span>
              <br />
              <span className="work-intro-word">do</span>{' '}
              <span className="work-intro-word">best</span>
              <span className="work-intro-word work-intro-period">.</span>
            </h2>
            <p>Four services. One obsession: turning attention into revenue.</p>
            <span className="work-scroll-hint">scroll to explore →</span>
          </div>

          <div className="work-showcase-layer">
            <div className="work-progress" aria-hidden="true">
              <div className="work-progress-dots">
                {services.map((service, index) => (
                  <span
                    key={service.number}
                    className={`work-progress-dot ${activeProject === index ? 'is-active' : ''}`}
                  />
                ))}
              </div>
              <span className="work-progress-label">SERVICES</span>
            </div>

            {/* Giant index — the leading 0 is static; the second digit rolls like
                a counter (1→2→3→4 and back) instead of fading out/in. */}
            <div ref={numberRef} className="work-fixed-number" aria-hidden="true">
              <span className="wfn-zero">0</span>
              <span className="wfn-reel-window">
                <span
                  className="wfn-reel"
                  style={{ transform: `translateY(-${activeProject}em)` }}
                >
                  {services.map((s) => (
                    <span key={s.number} className="wfn-digit">
                      {s.number.slice(-1)}
                    </span>
                  ))}
                </span>
              </span>
            </div>

            <div ref={copyRef} className="work-fixed-copy">
              <div className="work-copy-line svc-category">
                <span className="svc-index">{activeService.number}</span>
                <span className="svc-divider" />
                <span className="svc-category-label">{activeService.category}</span>
              </div>
              <h3 className="work-copy-line svc-title">
                {activeService.title.split(' ').map((word, i, arr) => (
                  <span key={i}>
                    <span className="svc-word-wrap"><span className="svc-word">{word}</span></span>
                    {i < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h3>
              <p className="work-copy-line svc-lead">
                {activeService.lead.split(' ').map((word, i, arr) => (
                  <span key={i}>
                    <span className="svc-word-wrap"><span className="svc-word">{word}</span></span>
                    {i < arr.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
              <p className="work-copy-line svc-desc">{activeService.description}</p>
              <ul className="svc-deliverables">
                {activeService.deliverables.map((item, i) => (
                  <li key={item} className="work-copy-line">
                    <span>{item}</span>
                    <span className="svc-del-num">0{i + 1}</span>
                  </li>
                ))}
              </ul>
              <div className="work-copy-line svc-footer">
                <div className="svc-metric">
                  <span className="svc-metric-value">{activeService.metric.value}</span>
                  <span className="svc-metric-label">{activeService.metric.label}</span>
                </div>
                <a className="svc-cta" href={activeService.link}>
                  <span>View service</span>
                  <span className="svc-cta-arrow">↗</span>
                </a>
              </div>
            </div>

            <div ref={railRef} className="work-diagonal-rail" aria-live="polite">
              {services.map((service, index) => (
                <article
                  key={service.number}
                  ref={(node) => {
                    projectRefs.current[index] = node;
                  }}
                  className="work-project-panel"
                  style={{ '--card-index': index } as CSSProperties}
                >
                  <div className="work-image-wrap">
                    <Image
                      src={service.image}
                      alt={`${service.title} preview`}
                      width={1120}
                      height={1160}
                      sizes="(min-width: 768px) 42vw, 100vw"
                      className="work-project-image"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="work-mobile">
        <div className="work-mobile-intro">
          <h2>
            Four things we
            <br />
            do best<span>.</span>
          </h2>
          <p>Four services. One obsession: turning attention into revenue.</p>
        </div>

        <div className="work-mobile-list">
          {services.map((service, index) => (
            <article
              key={service.number}
              ref={(node) => {
                mobileProjectRefs.current[index] = node;
              }}
              className="work-mobile-project"
            >
              <Image
                src={service.image}
                alt={`${service.title} preview`}
                width={1120}
                height={780}
                sizes="100vw"
                className="work-mobile-image"
              />
              <div className="work-mobile-copy">
                <div className="svc-category">
                  <span className="svc-index">{service.number}</span>
                  <span className="svc-divider" />
                  <span className="svc-category-label">{service.category}</span>
                </div>
                <h3 className="svc-title">{service.title}</h3>
                <p className="svc-lead">{service.lead}</p>
                <p className="svc-desc">{service.description}</p>
                <ul className="svc-deliverables">
                  {service.deliverables.map((item) => (
                    <li key={item}>
                      <span className="svc-dot" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="svc-footer">
                  <div className="svc-metric">
                    <span className="svc-metric-value">{service.metric.value}</span>
                    <span className="svc-metric-label">{service.metric.label}</span>
                  </div>
                  <a className="svc-cta" href={service.link}>
                    <span>View service</span>
                    <span className="svc-cta-arrow">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .work-section {
          background: var(--void);
          color: var(--white);
          overflow: hidden;
          position: relative;
        }

        .work-outer {
          height: 760vh;
          position: relative;
        }

        .work-sticky {
          background: var(--void);
          height: 100vh;
          overflow: hidden;
          position: relative;
          top: 0;
          width: 100%;
        }

        .work-intro-content {
          inset: 0;
          padding: 0 clamp(24px, 5vw, 80px);
          position: absolute;
          z-index: 8;
        }

        .work-showcase-layer {
          inset: 0;
          opacity: 0;
          position: absolute;
          z-index: 5;
        }

.work-intro-content h2,
        .work-mobile-intro h2 {
          color: var(--white);
          font-family: var(--font-heading);
          font-size: clamp(56px, 6.8vw, 100px);
          font-weight: 700;
          left: clamp(24px, 5vw, 80px);
          letter-spacing: -0.025em;
          line-height: 0.95;
          margin: 0;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }

        .work-mobile-intro h2 span {
          color: var(--blue-sphere);
        }

        .work-intro-word {
          display: inline-block;
          will-change: transform, opacity, filter;
        }

        .work-intro-period {
          color: var(--blue-sphere);
        }

        .work-intro-content p {
          bottom: clamp(60px, 8vh, 100px);
          color: rgba(255, 255, 255, 0.45);
          font-family: var(--font-body);
          font-size: clamp(14px, 1.4vw, 17px);
          font-weight: 300;
          left: clamp(24px, 5vw, 80px);
          line-height: 1.6;
          margin: 0;
          max-width: 420px;
          position: absolute;
        }

        .work-scroll-hint {
          animation: workHint 2s ease-in-out infinite;
          bottom: clamp(60px, 8vh, 100px);
          color: rgba(255, 255, 255, 0.25);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.14em;
          position: absolute;
          right: clamp(24px, 5vw, 80px);
          text-transform: lowercase;
        }

        .work-diagonal-rail {
          height: 330vh;
          left: 0;
          position: absolute;
          top: 0;
          width: 190vw;
          will-change: transform;
          z-index: 2;
        }

        /* Image sits left-of-centre, freeing the right column for copy. */
        .work-project-panel {
          height: clamp(300px, 44vh, 470px);
          left: calc(40vw + (var(--card-index) * 30vw));
          overflow: visible;
          position: absolute;
          top: calc(47vh + (var(--card-index) * 64vh));
          width: clamp(380px, 29vw, 520px);
        }

        .work-fixed-number {
          bottom: clamp(58px, 8vh, 104px);
          color: rgba(255, 255, 255, 0.9);
          font-family: var(--font-heading);
          font-size: clamp(128px, 14vw, 220px);
          font-weight: 700;
          left: clamp(90px, 10vw, 190px);
          letter-spacing: -0.04em;
          line-height: 0.72;
          position: absolute;
          z-index: 7;
          display: inline-flex;
          align-items: flex-start;
          line-height: 1;        /* reel manages its own glyph boxes below */
        }
        /* Static leading zero — same box as a reel digit so they baseline-align */
        .wfn-zero {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 1em;
        }
        /* Window clips to exactly ONE digit box; the reel slides within it. */
        .wfn-reel-window {
          display: block;
          height: 1em;
          overflow: hidden;
        }
        /* Vertical stack of digit boxes; translateY rolls to the active one. */
        .wfn-reel {
          display: flex;
          flex-direction: column;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        /* Each digit is a full 1em box, glyph centred — no overflow, so adjacent
           digits never peek into the window. */
        .wfn-digit {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 1em;
          line-height: 1;
        }

        /* ── Right column — editorial service copy ───────────────────────── */
        .work-fixed-copy {
          display: flex;
          flex-direction: column;
          gap: 0;
          left: 57vw;
          max-width: 540px;
          position: absolute;
          right: clamp(32px, 4vw, 80px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 7;
        }

        .work-copy-line {
          will-change: transform, opacity;
        }

        /* Category — thin top rule + mono label */
        .svc-category {
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.10);
          color: rgba(255, 255, 255, 0.38);
          display: flex;
          font-family: var(--font-mono);
          font-size: 10px;
          gap: 12px;
          letter-spacing: 0.24em;
          padding-top: clamp(14px, 1.4vw, 20px);
          margin-bottom: clamp(18px, 1.8vw, 28px);
          text-transform: uppercase;
        }

        .svc-index {
          color: var(--blue-sphere);
        }

        .svc-divider {
          background: rgba(255, 255, 255, 0.16);
          flex: 0 0 auto;
          height: 1px;
          width: 22px;
        }

        /* Title — bold Public Sans, matching the hero + team headings */
        .svc-title {
          color: var(--white);
          font-family: var(--font-heading);
          font-style: normal;
          font-size: clamp(46px, 5vw, 82px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 0.92;
          margin: 0 0 clamp(18px, 1.6vw, 26px);
        }

        /* Lead — elegant standfirst, not a bold sub-heading */
        .svc-lead {
          color: rgba(255, 255, 255, 0.85);
          font-family: var(--font-body);
          font-size: clamp(16px, 1.3vw, 19px);
          font-weight: 400;
          letter-spacing: -0.005em;
          line-height: 1.45;
          margin: 0 0 clamp(12px, 1.1vw, 16px);
          max-width: 32ch;
        }

        /* Word-reveal: each word sits in a clipping wrapper so it rises up from
           behind the line on entrance (GSAP animates .svc-word yPercent). The
           padding/negative-margin pair gives italic descenders room to render
           without being clipped, while still masking the upward rise. */
        .svc-word-wrap {
          display: inline-flex;
          overflow: hidden;
          vertical-align: top;
          padding-bottom: 0.12em;
          margin-bottom: -0.12em;
        }
        .svc-word {
          display: inline-block;
          will-change: transform;
        }

        /* Description — supporting note, more muted */
        .svc-desc {
          color: rgba(255, 255, 255, 0.40);
          font-family: var(--font-body);
          font-size: clamp(13px, 0.92vw, 14.5px);
          font-weight: 400;
          line-height: 1.75;
          margin: 0 0 clamp(30px, 2.8vw, 46px);
          max-width: 44ch;
        }

        /* Deliverables — editorial left-indexed list */
        .svc-deliverables {
          display: flex;
          flex-direction: column;
          list-style: none;
          margin: 0 0 clamp(30px, 2.8vw, 46px);
          padding: 0;
        }

        .svc-deliverables li {
          align-items: baseline;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.55);
          display: flex;
          font-family: var(--font-body);
          font-size: clamp(13px, 0.98vw, 15px);
          font-weight: 400;
          gap: clamp(16px, 1.5vw, 28px);
          letter-spacing: 0.005em;
          padding: clamp(13px, 1.15vw, 17px) 0;
          transition: color 320ms ease;
        }

        .svc-deliverables li:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .svc-deliverables li:hover {
          color: var(--white);
        }

        /* Index moves to the left and reads like an editorial numeral */
        .svc-del-num {
          color: rgba(255, 255, 255, 0.30);
          flex: 0 0 auto;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.1em;
          order: -1;
          transition: color 320ms ease;
          width: 1.7em;
        }

        .svc-deliverables li:hover .svc-del-num {
          color: var(--blue-sphere);
        }

        /* Footer */
        .svc-footer {
          align-items: flex-end;
          display: flex;
          gap: 20px;
          justify-content: space-between;
        }

        .svc-metric {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .svc-metric-value {
          color: var(--white);
          font-family: var(--font-heading);
          font-style: normal;
          font-size: clamp(30px, 2.8vw, 46px);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 0.9;
        }

        .svc-metric-label {
          color: rgba(255, 255, 255, 0.34);
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .svc-cta {
          align-items: center;
          color: rgba(255, 255, 255, 0.5);
          display: inline-flex;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 400;
          gap: 10px;
          letter-spacing: 0.2em;
          padding-bottom: 4px;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 250ms ease, gap 250ms ease;
          white-space: nowrap;
        }

        .svc-cta:hover {
          color: var(--white);
          gap: 14px;
        }

        .svc-cta-arrow {
          display: inline-block;
          font-size: 12px;
          transition: transform 250ms ease;
        }

        .svc-cta:hover .svc-cta-arrow {
          transform: translate(2px, -2px);
        }

        .work-image-wrap {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
          height: 100%;
          overflow: hidden;
          position: relative;
          width: 100%;
          z-index: 2;
        }

        :global(.work-project-image) {
          border-radius: 0;
          display: block;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }

        .work-progress {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 10px;
          left: clamp(24px, 3vw, 40px);
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
        }

        .work-progress-dots {
          align-items: center;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .work-progress-dot {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          display: block;
          height: 4px;
          transition: transform 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
          width: 4px;
        }

        .work-progress-dot.is-active {
          background: var(--blue-sphere);
          box-shadow: 0 0 8px rgba(59, 127, 232, 0.5);
          transform: scale(1.5);
        }

        .work-progress-label {
          color: rgba(255, 255, 255, 0.25);
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.14em;
          margin-top: 16px;
          transform: rotate(180deg);
          writing-mode: vertical-rl;
        }

        .work-mobile {
          display: none;
        }

        @keyframes workHint {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(8px);
          }
        }

        @media (max-width: 767px) {
          .work-outer {
            display: none;
          }

          .work-mobile {
            background: var(--void);
            display: block;
            padding: 0 24px 96px;
          }

          .work-mobile-intro {
            min-height: 100svh;
            padding: 96px 0 72px;
            position: relative;
          }

.work-mobile-intro h2 {
            font-size: clamp(54px, 17vw, 80px);
            left: 0;
            padding-top: 34vh;
            position: static;
            transform: none;
          }

          .work-mobile-intro p {
            bottom: 72px;
            color: rgba(255, 255, 255, 0.45);
            font-family: var(--font-body);
            font-size: 15px;
            font-weight: 300;
            line-height: 1.6;
            margin: 0;
            max-width: 320px;
            position: absolute;
          }

          .work-mobile-list {
            display: flex;
            flex-direction: column;
            gap: 80px;
          }

          .work-mobile-project {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 700ms var(--ease-out-expo), transform 700ms var(--ease-out-expo);
            width: 100%;
          }

          .work-mobile-project.is-visible {
            opacity: 1;
            transform: translateY(0);
          }

          :global(.work-mobile-image) {
            border-radius: 0;
            height: 55vw;
            object-fit: cover;
            width: 100%;
          }

          .work-mobile-copy {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding-top: 24px;
            position: relative;
          }

          .work-mobile-copy .svc-title {
            font-size: clamp(30px, 9vw, 42px);
          }

          .work-mobile-copy .svc-desc {
            max-width: none;
          }
        }
      `}</style>
    </section>
  );
}
