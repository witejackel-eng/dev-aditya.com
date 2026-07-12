import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import CaseStudyContent from '@/components/CaseStudyContent';
import JsonLd from '@/components/seo/JsonLd';
import { generateCreativeWorkSchema, generateBreadcrumbs } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Driftwear Studio — Editorial E-commerce Website Case Study',
  description: 'Case study: an editorial e-commerce experience for relaxed clothing with full cart flow, persistent cart state, category filtering, and Razorpay payment integration. Built with Next.js, TypeScript, and Zustand.',
  path: '/work/driftwear-ecommerce',
  type: 'article',
  publishedTime: '2026-07-10T00:00:00+05:30',
  modifiedTime: '2026-07-10T00:00:00+05:30',
  section: 'Case Study',
  keywords: ['e-commerce website', 'online store design', 'Razorpay integration'],
});

export default function DriftwearEcommerceCaseStudy() {
  const creativeWorkSchema = generateCreativeWorkSchema({
    title: 'Driftwear Studio — Editorial E-commerce Website',
    description: 'An editorial e-commerce experience for relaxed clothing with full cart flow and Razorpay integration.',
    path: '/work/driftwear-ecommerce',
    year: '2026',
    stack: 'Next.js, TypeScript, Zustand, Tailwind CSS',
    liveUrl: 'https://driftwear-ecommerce.vercel.app/',
    codeRepository: 'https://github.com/witejackel-eng/driftwear-ecommerce',
    keywords: ['e-commerce', 'online store', 'Razorpay'],
    projectType: 'Portfolio Project',
  });

  const breadcrumbs = generateBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Driftwear Studio', path: '/work/driftwear-ecommerce' },
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
          <li className="text-text-primary" aria-current="page">Driftwear Studio</li>
        </ol>
      </nav>
      <CaseStudyContent
        meta="CASE STUDY 03 · E-COMMERCE · NEXT.JS / TYPESCRIPT / ZUSTAND / TAILWIND CSS · PORTFOLIO PROJECT"
        title="Building an editorial e-commerce experience for warm-weather fashion"
        summary="An editorial e-commerce experience for relaxed, breathable clothing designed for Indian warm-weather living. Features a full shopping flow from product browsing through cart to checkout, persistent cart state via Zustand, category and collection filtering, and Razorpay payment integration."
        proof={[
          { label: 'Full E-commerce Flow', value: 'Product catalog, cart, checkout, and Razorpay payment integration from browse to buy.' },
          { label: 'Persistent Cart', value: 'Zustand-powered cart with local storage persistence across sessions.' },
          { label: 'Editorial Design', value: 'Brand story, sustainability pages, size guides, and curated collections.' },
        ]}
        problem="Fashion e-commerce in India needs to feel relaxed and trustworthy at the same time. The challenge was to build a shopping experience that matches the brand ethos — slow, breathable, zero fuss — while still delivering a complete, functional checkout flow with payment integration and persistent cart state."
        decision="Design the entire experience around editorial storytelling. Let the product pages breathe with generous spacing and warm tones. Build a robust cart system with Zustand for state persistence, and integrate Razorpay for seamless payment. Keep the demo mode tasteful with a subtle notice rather than blocking the experience."
        built={[
          'Full product catalog with category filtering (Women, Men, Accessories)',
          'Collection curation (Linen Edit, Best Sellers, Last Call/Sale)',
          'Product detail pages with size selection, fabric/care info, and image galleries',
          'Persistent shopping cart powered by Zustand with local storage',
          'Checkout flow with Razorpay payment integration (demo + production modes)',
          'Newsletter subscription form with validation',
          'Size guide, FAQ, shipping/returns policy pages',
          'Responsive design across mobile, tablet, and desktop',
        ]}
        proofText="The site proves that e-commerce doesn't have to feel transactional. Every element — from the editorial product pages to the seamless cart experience — is designed to make shopping feel as relaxed as the clothing itself."
        honestMoment="The biggest challenge was the cart and checkout flow. Making Zustand persistence work reliably across browser sessions while keeping the demo mode functional without real payment credentials required careful state management and a tasteful demo notice that doesn't break the experience."
        timeline={[
          { num: '01', title: 'Brand & Products', desc: 'Define the editorial direction and product data structure.' },
          { num: '02', title: 'Catalog & Cart', desc: 'Build product pages, filtering, and Zustand-powered cart system.' },
          { num: '03', title: 'Checkout Flow', desc: 'Implement Razorpay integration and form validation.' },
          { num: '04', title: 'Polish', desc: 'Refine responsive design, accessibility, and demo mode.' },
        ]}
        stack="Next.js, TypeScript, Zustand, Framer Motion, Zod, Tailwind CSS"
        liveUrl="https://driftwear-ecommerce.vercel.app/"
        githubUrl="https://github.com/witejackel-eng/driftwear-ecommerce"
      />
    </>
  );
}
