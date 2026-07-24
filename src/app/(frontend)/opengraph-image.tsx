import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Xelarvis Technologies'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0F172A',
        color: '#F8FAFC',
        padding: '64px',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>
        Xelarvis Technologies
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 900,
          }}
        >
          Engineering Digital Excellence.
        </div>
        <div style={{ fontSize: 24, color: '#94A3B8', maxWidth: 720 }}>
          Enterprise consulting, product engineering, and cloud platforms.
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 20, color: '#64748B' }}>xelarvis.in</div>
    </div>,
    { ...size },
  )
}
