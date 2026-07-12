import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Aditya Singh — Web Designer & Next.js Developer in Delhi'

export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#080808',
          padding: '0',
        }}
      >
        {/* Maroon accent bar — left edge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            backgroundColor: '#7A1F2B',
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '80px 80px 80px 72px',
          }}
        >
          {/* Subtle role label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 40,
                height: 2,
                backgroundColor: '#7A1F2B',
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 500,
                color: '#7A1F2B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Web Designer &amp; Next.js Developer
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#FAFAF7',
              fontFamily: 'system-ui, sans-serif',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}
          >
            Aditya Singh
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: '#a3a3a3',
              fontFamily: 'system-ui, sans-serif',
              lineHeight: 1.5,
              maxWidth: 600,
              marginBottom: 48,
            }}
          >
            Designing &amp; developing fast, premium websites for service
            businesses, startups &amp; independent brands.
          </div>

          {/* Location pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7A1F2B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              style={{
                fontSize: 16,
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 500,
                color: '#a3a3a3',
                letterSpacing: '0.04em',
              }}
            >
              Delhi, India
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            display: 'flex',
            height: 4,
            backgroundColor: '#7A1F2B',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
