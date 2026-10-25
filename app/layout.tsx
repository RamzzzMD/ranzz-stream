import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'RANZZ STREAM — Neon Nights. Infinite Stories.',
    template: '%s | RANZZ STREAM',
  },
  description:
    'Platform streaming film box office, drama Korea (K-Drama), drama Asia, anime, dan serial TV terlengkap kualitas HD & 4K dengan visual sinematik Crimson Cinema berkecepatan tinggi.',
  keywords: [
    'RANZZ STREAM',
    'RanzzFlix',
    'Ranzz',
    'streaming film',
    'nonton anime sub indo',
    'drama korea',
    'drama china',
    'streaming kdrama',
    'crimson stream',
  ],
  authors: [{ name: 'Ranzz', url: 'https://ranzzajaah.bio' }],
  creator: 'Ranzz',
  publisher: 'Ranzz',
  metadataBase: new URL('https://ranzzajaah.bio'),
  openGraph: {
    title: 'RANZZ STREAM — Neon Nights. Infinite Stories.',
    description:
      'Platform streaming film, serial TV, drama Korea, drama Asia, dan anime berkecepatan tinggi dengan visual sinematik premium.',
    url: 'https://ranzzajaah.bio',
    siteName: 'RANZZ STREAM',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RANZZ STREAM',
    description: 'Neon Nights. Infinite Stories. Created by Ranzz.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0b0e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/app-icon.png" />
      </head>
      <body className="bg-[#09090b] text-white min-h-screen flex flex-col antialiased selection:bg-[#e50914] selection:text-white">
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col pt-16">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
