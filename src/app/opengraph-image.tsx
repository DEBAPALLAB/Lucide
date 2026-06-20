import { ImageResponse } from 'next/og';

// Branded social share card. Rendered on-demand by next/og and served at
// /opengraph-image — it only ever appears when someone shares a lucide.in link
// on social/chat. Never shown on the site itself.
export const alt = 'Lucide Tech — We build what finds you in the dark.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(120% 90% at 78% 8%, rgba(249,115,22,0.16) 0%, transparent 42%), #06080d',
          padding: '72px 80px',
        }}
      >
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Lucide
          </span>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              marginLeft: 4,
              marginTop: -22,
              background: 'linear-gradient(135deg, #fcd34d 0%, #f97316 52%, #ef4444 100%)',
            }}
          />
          <span
            style={{
              marginLeft: 16,
              fontSize: 18,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.42)',
            }}
          >
            Tech
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
            }}
          >
            We build what
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            finds you in the dark
            <span style={{ color: '#3B7FE8' }}>.</span>
          </div>
        </div>

        {/* Footer line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 24,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <span>Premium web design &amp; development</span>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>lucide.in</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
