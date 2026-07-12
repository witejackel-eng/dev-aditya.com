import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import CaseStudyContent from '@/components/CaseStudyContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateCreativeWorkSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Real Estate Atelier — Luxury Property Advisory Website Case Study',
  description: 'Case study: a premium real estate advisory website with curated property collections, cinematic editorial design, custom filtering, and immersive property detail pages. Built with Next.js, TypeScript, GSAP, and Framer Motion.',
  path: '/work/real-estate-atelier',
  type: 'article',
  publishedTime: '2026-07-10T00:00:00+05:30',
  modifiedTime: '2026-07-10T00:00:00+05:30',
  section: 'Case Study',
  keywords: ['real estate website', 'luxury property website', 'property listing design'],
});

export default function RealEstateAtelierCaseStudy() {
  const creativeWorkSchema = generateCreativeWorkSchema({
    title: 'Real Estate Atelier — Luxury Property Advisory Website',
    description: 'A premium real estate advisory website with curated property collections and cinematic editorial design.',
    path: '/work/real-estate-atelier',
    year: '2026',
    stack: 'Next.js, TypeScript, GSAP, Framer Motion',
    liveUrl: 'https://real-estate-atelier.vercel.app/',
    codeRepository: 'https://github.com/witejackel-eng/real-estate-atelier',
    keywords: ['real estate website', 'luxury property', 'property listing'],
    projectType: 'Portfolio Project',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Real Estate Atelier', path: '/work/real-estate-atelier' },
  ]);

  return (
    <>
      <JsonLd data={[creativeWorkSchema, breadcrumbs]} />
      <nav aria-label="Breadcrumb" className="mb-6 max-w-4xl mx-auto px-6 pt-28 md:pt-32">
        <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-mono)]">
          <li><Link href="/" className="hover:text-maroon transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/work" className="hover:text-maroon transition-colors">Work</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-text-primary" aria-current="page">Real Estate Atelier</li>
        </ol>
      </nav>
      <CaseStudyContent
        meta="CASE STUDY 04 · REAL ESTATE · NEXT.JS / TYPESCRIPT / GSAP / FRAMER MOTION · PORTFOLIO PROJECT"
        title="Building a cinematic luxury property advisory platform"
        summary="A premium real estate advisory website for considered homes across India. Cinematic editorial design with curated property collections, custom filtering by city and type, immersive property detail pages, seller advisory, neighbourhood guides, and a branded luxury experience with custom cursor and page loader."
        proof={[
          { label: 'Curated Properties', value: 'Filtered by city, property type, bedrooms, price range, and text search.' },
          { label: 'Cinematic Design', value: 'Branded page loader, custom cursor, numbered narrative sections, and smooth scrolling.' },
          { label: 'Full Advisory Flow', value: 'Seller valuation requests, neighbourhood guides, and inquiry forms with honeypot protection.' },
        ]}
        problem="Luxury real estate websites often fall into one of two traps: either they feel like generic property listings with no personality, or they prioritize aesthetics so heavily that finding and filtering properties becomes frustrating. The challenge was to build a site that feels cinematic and premium while still being a functional property discovery platform."
        decision="Treat the website like a cinematic editorial experience with numbered narrative sections. Use custom cursor and page loader to establish luxury from the first interaction. Build robust property filtering and immersive detail pages so the functionality matches the design ambition. Add seller advisory and neighbourhood guides to serve both buyers and sellers."
        built={[
          'Cinematic editorial homepage with numbered narrative sections',
          'Curated property collection with custom filtering (city, type, bedrooms, price, search)',
          'Immersive property detail pages with editorial gallery and lightbox',
          'Full-screen navigation menu with numbered links',
          'Branded page loader and custom cursor for luxury feel',
          'Seller advisory section with valuation request form',
          'Neighbourhood guides for Delhi NCR, Mumbai, Goa, Bangalore, Pune, Hyderabad',
          'Form handling with honeypot anti-spam and Zod validation',
        ]}
        proofText="Every section of the site serves both aesthetics and function — the cinematic design makes properties feel premium, while the filtering system and detail pages ensure buyers can actually find and explore homes that match their criteria."
        honestMoment="The hardest balance was making the custom cursor and page loader feel luxurious without adding friction. A slow loader on a property site costs engagement. The solution was keeping the loader brief (just enough to establish mood) and making the custom cursor optional — it enhances the experience without becoming a barrier."
        timeline={[
          { num: '01', title: 'Narrative Structure', desc: 'Define the cinematic editorial flow and section hierarchy.' },
          { num: '02', title: 'Property System', desc: 'Build curated listings, filtering, and detail pages.' },
          { num: '03', title: 'Luxury Details', desc: 'Implement custom cursor, page loader, and smooth scrolling.' },
          { num: '04', title: 'Polish', desc: 'Refine forms, accessibility, SEO, and mobile experience.' },
        ]}
        stack="Next.js, TypeScript, GSAP, Framer Motion, React Hook Form, Zod, Tailwind CSS"
        liveUrl="https://real-estate-atelier.vercel.app/"
        githubUrl="https://github.com/witejackel-eng/real-estate-atelier"
      />
    </>
  );
}
