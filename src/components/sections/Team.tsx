import Image from 'next/image';

type Member = {
  id: string;
  name: string;
  role: string;
  linkedin: string;
  photo?: string;
};

const team: Member[] = [
  { id: '01', name: 'Dev',    role: 'Founder & CEO', linkedin: 'https://www.linkedin.com/in/dev-designs/',                  photo: '/images/team/Dev.jpg' },
  { id: '02', name: 'Dhruv',  role: 'Co-founder · CTO · Sr. Developer',           linkedin: 'https://www.linkedin.com/in/dhruv-shah-7a4482323',          photo: '/images/team/Dhruv.jpg' },
  { id: '06', name: 'Tanvi',  role: 'CMO · Growth & Sales',      linkedin: 'https://www.linkedin.com/in/tanvi-gujarathi-10763b32a/',    photo: '/images/team/tanvi.jpg' },
  { id: '04', name: 'Shivam', role: 'Product · Growth',          linkedin: 'https://www.linkedin.com/in/shivam-prajapati-9aa553387/',   photo: '/images/team/Shivam.jpg' },
  { id: '03', name: 'Soham',  role: 'COO · Backend Developer',   linkedin: 'https://www.linkedin.com/in/soham-t-7b7889242/' },
  { id: '05', name: 'Priya',  role: 'Design · Jr Developer',     linkedin: 'https://www.linkedin.com/in/priya-basumatary-41097237a/' },
];

const LinkedInGlyph = ({ className }: { className?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
  </svg>
);

export default function Team() {
  const featured = team.filter((m) => m.photo);
  const others = team.filter((m) => !m.photo);

  return (
    <section
      id="team"
      className="relative w-full bg-linear-to-b from-[#0a0c14] to-void px-6 py-28 md:px-[clamp(24px,5vw,80px)] md:py-36"
    >
      <div className="mx-auto w-full max-w-[1400px]">

        {/* Header block */}
        <div className="grid gap-10 border-t border-white/10 pt-14 md:grid-cols-[1fr_1fr] md:items-end md:gap-24">
          <div>
            <h2 className="font-heading text-[clamp(42px,5.2vw,82px)] font-bold leading-[0.92] tracking-[-0.03em] text-white">
              Senior hands on every decisive detail<span className="text-blue-sphere">.</span>
            </h2>
          </div>
          <div>
            <p className="font-accent text-[clamp(16px,1.5vw,20px)] font-light leading-[1.55] text-white/55">
              A small studio team means fewer layers, tighter thinking, and direct ownership from the people shaping the work.
            </p>
          </div>
        </div>

        {/* Portrait grid */}
        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-14 md:mt-24 md:grid-cols-4 md:gap-x-10">
          {featured.map((member) => (
            <a
              key={member.id}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="cta"
              aria-label={`${member.name} — ${member.role} · LinkedIn (opens in a new tab)`}
              className="group flex flex-col"
            >
              {/* Circular portrait */}
              <div className="relative aspect-square w-full overflow-hidden rounded-full">
                <Image
                  src={member.photo!}
                  alt={`${member.name}, ${member.role} at Lucide Tech`}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                  className="object-cover filter-[grayscale(0.2)_contrast(1.05)_brightness(1.05)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:filter-[grayscale(0)_contrast(1.08)_brightness(1.08)]"
                />
                {/* Vignette for depth + legibility */}
                <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-t from-black/25 via-transparent to-transparent" />
                {/* Even outline — drawn on top of the photo so it reads identically across every shot */}
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/15 transition-all duration-500 group-hover:ring-blue-sphere/35" />
              </div>

              {/* Name + role */}
              <h3 className="mt-6 font-heading text-[clamp(20px,1.7vw,26px)] font-bold tracking-[-0.02em] text-white/90 transition-colors duration-300 group-hover:text-white">
                {member.name}
              </h3>
              <span className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 transition-colors duration-300 group-hover:text-white/55">
                {member.role}
              </span>

              {/* LinkedIn affordance */}
              <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 transition-colors duration-300 group-hover:text-blue-sphere">
                <LinkedInGlyph />
                Connect
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
              </span>
            </a>
          ))}
        </div>

        {/* The rest of the studio — names without portraits yet */}
        {others.length > 0 && (
          <div className="mt-20 border-t border-white/[0.07] pt-8 md:mt-24">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">
              Also in the studio
            </span>
            <div className="mt-6 flex flex-col gap-x-16 gap-y-5 sm:flex-row sm:flex-wrap">
              {others.map((member) => (
                <a
                  key={member.id}
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="cta"
                  aria-label={`${member.name} — ${member.role} · LinkedIn (opens in a new tab)`}
                  className="group flex items-baseline gap-4"
                >
                  <span className="font-heading text-[clamp(20px,1.7vw,26px)] font-bold tracking-[-0.02em] text-white/80 transition-colors duration-300 group-hover:text-white">
                    {member.name}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/32 transition-colors duration-300 group-hover:text-white/55">
                    {member.role}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/0 transition-colors duration-300 group-hover:text-blue-sphere">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footnote */}
        <div className="mt-14 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/18">
            {team.length} people · Studio
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/18">
            India
          </span>
        </div>

      </div>
    </section>
  );
}
