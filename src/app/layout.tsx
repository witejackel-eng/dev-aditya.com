import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Aditya — Front-End Developer & UI/UX Designer",
    template: "%s | Aditya",
  },
  description:
    "Aditya is a Delhi-based Front-End Developer and UI/UX Designer building high-performance digital interfaces, immersive 3D web experiences, corporate websites, dashboards, and interactive web apps.",
  metadataBase: new URL("https://dev-aditya.com"),
  openGraph: {
    title: "Aditya — Front-End Developer & UI/UX Designer",
    description:
      "Building high-performance digital interfaces with precision engineering and intentional design.",
    url: "https://dev-aditya.com",
    siteName: "Aditya Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya — Front-End Developer & UI/UX Designer",
    description:
      "Building high-performance digital interfaces with precision engineering and intentional design.",
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