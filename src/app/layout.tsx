import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#7A1F2B",
};

// Fallback when request headers are not available (e.g. build-time
// metadata extraction, generateStaticParams). The custom domain is being
// configured now (see docs/DOMAIN_SETUP.md). getBaseUrl() still prefers the
// live request Host header, so OG / Twitter image URLs are always served
// from the same domain the page was crawled on.
const FALLBACK_BASE_URL = "https://dev-aditya.com";

/**
 * Resolve the absolute base URL of the current request.
 *
 * Uses the live request's Host header so OG / Twitter image URLs are
 * always served from the same domain the page was crawled on. This is
 * critical for X's crawler: if `og:image` points at a different host
 * that fails to resolve (e.g. an unconfigured custom domain), the
 * card renders with a blank white icon.
 *
 * Vercel sets `x-forwarded-proto` and `host` correctly for both the
 * default *.vercel.app URL and any custom domains added later.
 */
async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  if (!host) return FALLBACK_BASE_URL;
  return `${proto}://${host}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();
  const base = new URL(baseUrl);

  return {
    title: {
      default: "Aditya — Corporate Web Designer & Frontend Developer",
      template: "%s | Aditya",
    },
    description:
      "Independent web designer and frontend developer helping B2B companies and professional-service firms build clear, credible and high-performance websites.",
    metadataBase: base,
    manifest: "/manifest.webmanifest",
    icons: {
      // SVG is preferred by modern browsers — sharp at any DPI.
      // favicon.ico is auto-detected by Next.js file-based metadata
      // convention (src/app/favicon.ico) and emitted with a
      // fingerprinted URL — we do not duplicate it here.
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      // Apple touch icon — iOS home-screen bookmark. Next.js file-based
      // convention expects `apple-icon.png`, but the brief requires the
      // standard `apple-touch-icon.png` filename, so we reference it
      // explicitly here.
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title: "Aditya — Corporate Web Design & Frontend Development",
      description:
        "Corporate websites, professional-service platforms and production-ready frontend development for companies in India and internationally.",
      url: baseUrl,
      siteName: "Aditya",
      locale: "en_US",
      type: "website",
      // Image is auto-served by src/app/opengraph-image.tsx at /opengraph-image.
      // metadataBase above resolves this to an absolute URL on the current host.
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Aditya — Independent Web Designer & Frontend Developer based in Delhi, India",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Aditya — Corporate Web Design & Frontend Development",
      description:
        "Corporate websites, professional-service platforms and production-ready frontend development for companies in India and internationally.",
      // Same image as Open Graph — served by src/app/twitter-image.tsx at /twitter-image.
      images: ["/twitter-image"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Aditya",
              jobTitle: "Independent Web Designer & Frontend Developer",
              email: "work@dev-aditya.com",
              url: "https://dev-aditya.com",
              sameAs: ["https://github.com/witejackel-eng"],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Delhi",
                addressCountry: "IN",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased">
        <SmoothScroll>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}