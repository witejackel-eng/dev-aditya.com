import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import JsonLd from '@/components/seo/JsonLd';
import { siteConfig, getCanonicalOrigin } from '@/config/site';
import { generateHomepageSchemaGraph } from '@/lib/schema';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const origin = getCanonicalOrigin();

export const viewport: Viewport = {
  themeColor: siteConfig.brand.primaryColor,
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: siteConfig.defaults.title,
    template: siteConfig.defaults.template,
  },
  description: siteConfig.defaults.description,
  alternates: {
    canonical: origin,
  },
  openGraph: {
    title: siteConfig.defaults.title,
    description: siteConfig.defaults.description,
    url: origin,
    siteName: siteConfig.siteName,
    locale: siteConfig.locale,
    type: 'website',
    images: [
      {
        url: `${origin}/og-default.png`,
        width: siteConfig.og.imageWidth,
        height: siteConfig.og.imageHeight,
        alt: siteConfig.og.imageAlt,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter.card,
    title: siteConfig.defaults.title,
    description: siteConfig.defaults.description,
    images: [`${origin}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  creator: siteConfig.owner.fullName,
  authors: [{ name: siteConfig.owner.fullName, url: siteConfig.owner.portfolio }],
  ...(siteConfig.verification.google
    ? { verification: { google: siteConfig.verification.google } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaGraph = generateHomepageSchemaGraph();

  return (
    <html
      lang={siteConfig.language}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={schemaGraph} />
        {siteConfig.verification.google && (
          <meta
            name="google-site-verification"
            content={siteConfig.verification.google}
          />
        )}
        {siteConfig.verification.bing && (
          <meta
            name="msvalidate.01"
            content={siteConfig.verification.bing}
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] bg-maroon text-white px-4 py-2 text-sm font-[family-name:var(--font-mono)] uppercase tracking-widest"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
