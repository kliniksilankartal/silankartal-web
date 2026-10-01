import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SITE_CONFIG } from '@/lib/constants';
import { getSiteContent } from '@/lib/content';
import { defaultCustomColors } from '@/lib/content-types';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/icon.png',
    shortcut: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = getSiteContent();
  const colors = content.customColors || defaultCustomColors;

  return (
    <html lang="tr" className={inter.variable}>
      <head>
        {/* Dinamik Özel Renk Paleti Enjeksiyonu */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: ${colors.primary};
                --color-primary-light: ${colors.secondary};
                --color-secondary: ${colors.secondary};
                --color-accent: ${colors.accent};
                --color-text-primary: ${colors.dark};
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased text-slate-900 bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
