'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const services = ['a brand site', 'a web app', 'a portfolio', 'something else'] as const;
const budgets = ['below ₹30k', '₹30–60k', '₹60–90k', 'flexible'] as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Superforms submission endpoint — receives the contact form as JSON.
const WEBHOOK_URL = 'https://www.superforms.in/api/submit/d4d89bd4-c57f-43f3-8766-ee2989cf1ca7';

// Inputs/buttons don't inherit the surrounding prose font — force it.
const inherit: React.CSSProperties = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
};

export default function ContactForm() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('');
  const [budget, setBudget] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [status, setStatus] = useState<Status>('idle');
  const [hint, setHint] = useState('');

  const openWhatsApp = useCallback(() => {
    const parts: string[] = [];
    if (name.trim()) parts.push(`Hi, I'm ${name.trim()}${company.trim() ? ` from ${company.trim()}` : ''}.`);
    if (service) parts.push(`I'm looking to build ${service}.`);
    if (budget) parts.push(`Budget: ${budget}.`);
    if (message.trim()) parts.push(message.trim());
    const text = parts.length ? parts.join(' ') : "Hi! I'd like to discuss a project with Lucide.";
    const url = `https://wa.me/916000942593?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [name, company, service, budget, message]);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const grow = useCallback(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status === 'submitting') return;

      if (!name.trim()) return setHint('Add your name so we know who we’re talking to.');
      if (!EMAIL_RE.test(email)) return setHint('We’ll need a valid email to reply to.');
      if (!message.trim()) return setHint('Tell us a little about the idea.');
      setHint('');

      setStatus('submitting');
      try {
        const body = new URLSearchParams({ name, company, service, budget, email, message });
        const res = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });
        if (!res.ok) throw new Error(`${res.status}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        const code = err instanceof Error ? ` (${err.message})` : '';
        setHint(`Something went wrong on our end${code} — try once more.`);
      }
    },
    [status, name, company, service, budget, email, message]
  );

  if (status === 'success') {
    return (
      <div style={{ animation: `cf-rise 0.7s ${EASE} both` }}>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-sphere/90">Message received</p>
        <h3
          className="mt-5 text-white"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(34px, 4vw, 56px)', fontWeight: 400, lineHeight: 1.05 }}
        >
          Thanks{name ? `, ${name.split(' ')[0]}` : ''}.<br />We’ll be in touch shortly.
        </h3>
        <p className="mt-6 max-w-sm font-body text-[14px] leading-relaxed text-white/45">
          Every note is read by us, not a queue. Expect a reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setName(''); setCompany(''); setService(''); setBudget(''); setEmail(''); setMessage('');
            setHint('');

          }}
          data-cursor="cta"
          className="mt-9 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35 transition-colors duration-200 hover:text-white/80"
        >
          Write another ↗
        </button>
        <style jsx>{`
          @keyframes cf-rise {
            from { opacity: 0; transform: translateY(18px); filter: blur(8px); }
            to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <style jsx global>{`
        @keyframes cf-fieldpulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 127, 232, 0); }
          50%      { box-shadow: 0 0 0 4px rgba(59, 127, 232, 0.12); }
        }
      `}</style>

      {/* Cue — instantly tells the user the highlighted bits are theirs to fill */}
      <p className="mb-7 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-blue-sphere/70" />
        Fill in the blanks
      </p>

      {/* The conversation — prose is muted; the chips are clearly interactive. */}
      <div
        className="text-white/55"
        style={{
          fontFamily: 'var(--font-body), sans-serif',
          fontWeight: 300,
          fontSize: 'clamp(21px, 2vw, 28px)',
          lineHeight: 2,
        }}
      >
        Hi&nbsp;Lucide, I’m{' '}
        <Blank value={name} onChange={setName} placeholder="your name" autoComplete="name" delay={0} />{' '}
        from{' '}
        <Blank value={company} onChange={setCompany} placeholder="company" autoComplete="organization" delay={0.2} />,
        looking to build{' '}
        <InlineSelect options={services} value={service} prompt="a project type" onChange={setService} delay={0.4} />{' '}
        on a{' '}
        <InlineSelect options={budgets} value={budget} prompt="a range" onChange={setBudget} delay={0.6} />{' '}
        budget.
      </div>

      {/* Message — borderless, auto-growing */}
      <textarea
        ref={taRef}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          grow();
        }}
        rows={2}
        placeholder="Here’s the idea — the goal, the timeline, and what success looks like…"
        className="mt-9 block w-full resize-none rounded-lg border border-white/25 bg-white/5 p-4 font-body text-[clamp(15px,1.4vw,17px)] font-light leading-relaxed text-white outline-none transition-colors duration-300 placeholder:text-white/45 hover:border-white/40 focus:border-blue-sphere focus:bg-blue-sphere/8"
        style={{ animation: message ? undefined : 'cf-fieldpulse 2.6s ease-in-out infinite', animationDelay: message ? undefined : '0.8s' }}
      />

      {/* Sign-off */}
      <div
        className="mt-8 text-white/55"
        style={{ fontFamily: 'var(--font-body), sans-serif', fontWeight: 300, fontSize: 'clamp(21px, 2vw, 28px)', lineHeight: 2 }}
      >
        Reach me at{' '}
        <Blank value={email} onChange={setEmail} placeholder="your email" autoComplete="email" inputMode="email" delay={1} />.
      </div>

      {/* Send — reads as the action */}
      <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          disabled={status === 'submitting'}
          data-cursor="cta"
          className="group/send relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-[#06080d] transition-transform duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-blue-sphere transition-transform duration-500 group-hover/send:translate-x-0"
            style={{ transitionTimingFunction: EASE }}
          />
          <span
            className="relative z-10 transition-colors duration-300 group-hover/send:text-white"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </span>
          <span className="relative z-10 text-lg leading-none transition-all duration-300 group-hover/send:translate-x-1 group-hover/send:text-white">→</span>
        </button>

        {/* WhatsApp — opens wa.me with a pre-filled message built from the form */}
        <button
          type="button"
          data-cursor="cta"
          onClick={openWhatsApp}
          title="Message us on WhatsApp"
          className="group/wa inline-flex items-center gap-2 rounded-full border border-[#25D366]/25 bg-[#25D366]/8 px-4 py-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#25D366]/70 transition-all duration-300 hover:border-[#25D366]/55 hover:bg-[#25D366]/15 hover:text-[#25D366]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-300 group-hover/wa:scale-110">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </button>

        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-sphere/80">{hint}</span>
        )}
      </div>
    </form>
  );
}

/* ---------- inline blanks ---------- */

function Blank({
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  delay = 0,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  inputMode?: 'email' | 'text';
  delay?: number;
}) {
  const ch = Math.max(value.length, placeholder.length);
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      data-cursor="cta"
      className={`inline-block rounded-md border px-2.5 py-0.5 align-baseline text-white outline-none transition-colors duration-200 placeholder:text-white/50 ${
        value
          ? 'border-blue-sphere/60 bg-blue-sphere/15'
          : 'border-white/30 bg-white/9 hover:border-white/45 hover:bg-white/13'
      } focus:border-blue-sphere focus:bg-blue-sphere/15`}
      style={{
        ...inherit,
        width: `calc(${ch}ch + 24px)`,
        maxWidth: '100%',
        lineHeight: 1.35,
        fontWeight: 400,
        animation: value ? undefined : 'cf-fieldpulse 2.6s ease-in-out infinite',
        animationDelay: value ? undefined : `${delay}s`,
      }}
    />
  );
}

function InlineSelect({
  options,
  value,
  prompt,
  onChange,
  delay = 0,
}: {
  options: readonly string[];
  value: string;
  prompt: string;
  onChange: (v: string) => void;
  delay?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        data-cursor="cta"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 align-baseline transition-colors duration-200 ${
          value
            ? 'border-blue-sphere/60 bg-blue-sphere/15 text-blue-sphere'
            : 'border-white/30 bg-white/9 text-white/65 hover:border-white/45 hover:bg-white/13 hover:text-white/90'
        } ${open ? 'border-blue-sphere' : ''}`}
        style={{ ...inherit, lineHeight: 1.35, fontWeight: 400, animation: value ? undefined : 'cf-fieldpulse 2.6s ease-in-out infinite', animationDelay: value ? undefined : `${delay}s` }}
      >
        {value || prompt}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${open ? 'rotate-180 text-blue-sphere' : 'text-white/70'}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <span
          className="absolute left-0 top-full z-30 mt-3 flex min-w-[190px] flex-col rounded-xl border border-white/10 bg-[#0d1017]/95 p-1.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md"
          style={{ animation: `cf-pop 0.28s ${EASE} both` }}
        >
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={`rounded-lg px-3.5 py-2.5 text-left font-body text-[14px] font-normal not-italic tracking-normal transition-colors duration-200 ${
                value === o ? 'bg-white/5 text-blue-sphere' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {o}
            </button>
          ))}
          <style jsx>{`
            @keyframes cf-pop {
              from { opacity: 0; transform: translateY(-6px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
        </span>
      )}
    </span>
  );
}
