import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SkipLink } from "@/components/site/skip-link";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://aditya.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aditya — Designer & Developer for Business Websites and Digital Products",
    template: "%s — Aditya",
  },
  description:
    "Aditya designs and builds corporate websites, ecommerce platforms and digital products that make complicated businesses easier to understand, trust and choose.",
  keywords: [
    "Aditya",
    "portfolio",
    "designer",
    "developer",
    "business websites",
    "ecommerce",
    "digital products",
    "B2B web design",
    "industrial web design",
    "case studies",
  ],
  authors: [{ name: "Aditya" }],
  creator: "Aditya",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aditya — Designer & Developer for Business Websites and Digital Products",
    description:
      "Corporate websites, ecommerce platforms and digital products shaped around the result your business needs, then engineered to work properly after launch.",
    url: siteUrl,
    siteName: "Aditya",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya — Designer & Developer",
    description:
      "Corporate websites, ecommerce platforms and digital products shaped around the result your business needs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <SkipLink />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
