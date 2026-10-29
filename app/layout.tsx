import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'GSEB Std. 12 Mathematics (ધોરણ ૧૨ ગણિત) | Notebook Solutions & Practice Hub',
  description:
    'GSEB Gujarati Medium Class 12 Mathematics textbook solutions presented in realistic notebook format with step-by-step proofs, formulas, and self-assessment.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="gu">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
