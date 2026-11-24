import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F7E4E1',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://marwa-omer.vercel.app'),
  title: 'Marwa & Omer — Wedding Invitation',
  description: 'You are warmly invited to celebrate the wedding union of Marwa & Omer. 12 October 2026 at Ismailia, Egypt.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    title: 'Marwa & Omer — Wedding Invitation',
    description: 'Join us in celebrating the sacred wedding of Marwa & Omer. Monday, 12 October 2026.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marwa & Omer — Wedding Invitation',
    description: 'Join us in celebrating the sacred wedding of Marwa & Omer. Monday, 12 October 2026.',
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#1E1815] text-[#4E3E37] antialiased selection:bg-rose/40 selection:text-taupe-dark">
        {children}
      </body>
    </html>
  );
}
