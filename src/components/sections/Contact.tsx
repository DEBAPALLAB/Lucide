import ContactForm from './ContactForm';

type Channel = { label: string; value: string; href: string; icon: React.ReactNode };

const channels: Channel[] = [
  {
    label: 'Email',
    value: 'team@lucide.in',
    href: 'mailto:team@lucide.in',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    value: '@techlucide',
    href: 'https://x.com/techlucide',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: '/company/techlucide',
    href: 'https://linkedin.com/company/techlucide',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@lucide.tech',
    href: 'https://instagram.com/lucide.tech',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="2" width="20" height="20" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full bg-linear-to-b from-void to-[#05070c] px-6 py-24 md:px-[clamp(24px,5vw,80px)] md:py-28 overflow-hidden"
    >
      {/* Spotlight bottom-right aura */}
      <div className="absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-sphere/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto w-full max-w-[1400px] border-t border-white/10 pt-14">
        <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-24">
          <div className="md:sticky md:top-28">
            <h2 className="max-w-4xl font-heading text-[clamp(48px,6vw,96px)] font-bold leading-[0.92] tracking-[-0.04em] text-white">
              Start your conversation<span className="text-blue-sphere">.</span>
            </h2>
            <p className="mt-8 max-w-md font-accent text-[clamp(15px,1.4vw,18px)] font-light leading-[1.55] text-white/55">
              Bring the business goal, the messy context, and the ambition. We will help shape the path from first impression to shipped system.
            </p>

            {/* Other ways to reach us */}
            <div className="mt-12 max-w-md">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">Other ways to reach us</span>
              <ul className="mt-4 flex flex-col">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      data-cursor="cta"
                      className="group/ch flex items-center justify-between border-b border-white/[0.07] py-4 transition-colors duration-300 hover:border-white/20"
                    >
                      <span className="flex items-center gap-3.5">
                        <span className="text-white/30 transition-colors duration-300 group-hover/ch:text-blue-sphere">
                          {c.icon}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition-all duration-300 group-hover/ch:translate-x-0.5 group-hover/ch:text-white">
                          {c.label}
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-body text-[13px] text-white/35 transition-colors duration-300 group-hover/ch:text-white/70">
                          {c.value}
                        </span>
                        <span className="text-white/0 transition-all duration-300 group-hover/ch:translate-x-0 group-hover/ch:text-white/60 -translate-x-1" aria-hidden>
                          ↗
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

