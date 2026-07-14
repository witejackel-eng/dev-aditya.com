import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Aditya — Front-End Developer & UI/UX Designer",
    template: "%s | Aditya",
  },
  description:
    "Aditya is a Delhi-based Front-End Developer and UI/UX Designer building high-performance digital interfaces, immersive 3D web experiences, corporate websites, dashboards, and interactive web apps.",
  metadataBase: new URL("https://dev-aditya.com"),
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
    title: "Aditya — Front-End Developer & UI/UX Designer",
    description:
      "Building high-performance digital interfaces with precision engineering and intentional design.",
    url: "https://dev-aditya.com",
    siteName: "Aditya Portfolio",
    locale: "en_US",
    type: "website",
    // Image is auto-served by src/app/opengraph-image.tsx at /opengraph-image.
    // metadataBase above resolves this to an absolute https://dev-aditya.com/opengraph-image URL.
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Aditya — Front-End Developer & UI/UX Designer based in Delhi, India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya — Front-End Developer & UI/UX Designer",
    description:
      "Building high-performance digital interfaces with precision engineering and intentional design.",
    // Same image as Open Graph — served by src/app/twitter-image.tsx at /twitter-image.
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
              jobTitle: "Front-End Developer & UI/UX Designer",
              email: "hi.aditya.dev@gmail.com",
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