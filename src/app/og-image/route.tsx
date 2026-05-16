import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d1117',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,65,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            position: 'relative',
          }}
        >
          <div
            style={{
              color: '#00ff41',
              fontSize: '18px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            &gt;_ DEVOPS PORTFOLIO GAME
          </div>

          <div
            style={{
              color: '#ffffff',
              fontSize: '72px',
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            CONTAINER
          </div>
          <div
            style={{
              color: '#00ff41',
              fontSize: '72px',
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            TETRIS
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '800px',
            }}
          >
            {['nginx', 'redis', 'docker', 'postgres', 'kafka', 'prometheus', 'rabbitmq'].map(
              (name) => (
                <div
                  key={name}
                  style={{
                    backgroundColor: 'rgba(0,255,65,0.12)',
                    border: '1px solid rgba(0,255,65,0.4)',
                    color: '#00ff41',
                    fontSize: '14px',
                    padding: '4px 12px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
