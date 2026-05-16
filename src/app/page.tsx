import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

const GameClient = dynamicImport(() => import('./GameClient'), { ssr: false });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://contianer-tetris.adityadahake.dev';

export const metadata: Metadata = {
  title: 'Container Tetris – Free DevOps Browser Game',
  description:
    'Stack Docker containers, Kubernetes pods, Redis caches and more in this free DevOps-themed Tetris game. ' +
    'Play instantly in your browser — no download, no sign-up required.',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  keywords: [
    'container tetris', 'devops game', 'docker game', 'kubernetes tetris',
    'free tetris online', 'browser tetris', 'devops puzzle game',
    'docker containers game', 'engineering game', 'free browser game',
    'tetris no download', 'tech game', 'sre game', 'cloud game',
  ],
  openGraph: {
    title: 'Container Tetris – Free DevOps Browser Game',
    description:
      'Stack Docker containers, Kubernetes pods, Redis caches and more. Free to play instantly in your browser.',
    url: SITE_URL,
    siteName: 'Container Tetris',
    images: [
      {
        url: `${SITE_URL}/og-image`,
        width: 1200,
        height: 630,
        alt: 'Container Tetris – DevOps Browser Game',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Container Tetris – Free DevOps Browser Game',
    description:
      'Stack Docker containers, Redis, Kafka and more in this free DevOps Tetris game. Play now in your browser!',
    images: [`${SITE_URL}/og-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'game',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Container Tetris',
  description:
    'A DevOps-themed Tetris browser game. Stack Docker containers, Redis caches, Kafka brokers, ' +
    'Postgres databases and more into a server rack. Free to play, no download required.',
  url: SITE_URL,
  image: `${SITE_URL}/og-image`,
  inLanguage: 'en',
  applicationCategory: 'BrowserGame',
  operatingSystem: 'Web Browser',
  gamePlatform: 'Web Browser',
  genre: ['Puzzle', 'Arcade'],
  playMode: 'SinglePlayer',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  accessibilityFeature: ['keyboard', 'touchscreen'],
};

export const dynamic = 'force-static';

export default function HomePage() {
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
