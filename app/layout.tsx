import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  title: 'For Maria Mathew | A Letter',
  description: 'A personal handwritten letter for Maria Mathew, sealed with love.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💌</text></svg>',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#120e0b',
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
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@500;600;700&family=Parisienne&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#120e0b] text-[#211915] min-h-screen antialiased selection:bg-[#ebdcb9] selection:text-[#1a1715]">
        <AnalyticsTracker />
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
