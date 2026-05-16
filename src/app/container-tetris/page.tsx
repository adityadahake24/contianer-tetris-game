import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

const GameClient = dynamicImport(() => import('./GameClient'), { ssr: false });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contianer-tetris.adityadahake.dev';
const CANONICAL = `${SITE_URL}/container-tetris`;

export const metadata: Metadata = {
  title: 'Container Tetris | DevOps Portfolio Game',
  description:
    'A DevOps-themed Tetris game where Docker containers stack into a server rack. ' +
    'Built by a DevOps Engineer.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: 'Container Tetris | DevOps Portfolio Game',
    description:
      'A DevOps-themed Tetris game where Docker containers stack into a server rack.',
    url: CANONICAL,
    siteName: 'Container Tetris',
    images: [
      {
        url: `${SITE_URL}/og-image`,
        width: 1200,
        height: 630,
        alt: 'Container Tetris – DevOps Portfolio Game',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Container Tetris | DevOps Portfolio Game',
    description:
      'A DevOps-themed Tetris game where Docker containers stack into a server rack.',
    images: [`${SITE_URL}/og-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Container Tetris',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web',
  description:
    'A DevOps-themed Tetris game where Docker containers (nginx, redis, postgres, docker, kafka, rabbitmq, prometheus) stack into a server rack.',
  url: CANONICAL,
  inLanguage: 'en',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

// Static generation — no dynamic data needed at build time
export const dynamic = 'force-static';

export default function ContainerTetrisPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GameClient />
    </>
  );
}
