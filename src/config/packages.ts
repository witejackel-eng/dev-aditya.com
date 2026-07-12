import { CONTACT_EMAIL, WHATSAPP_BASE_URL } from '@/config/contact';

/* ─── Package Data ─── */

export interface PackageData {
  id: string;
  num: string;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  ideal: string[];
  includes: string[];
  deliveryTime: string;
  recommended: boolean;
  /** Dynamic email subject */
  emailSubject: string;
  /** Dynamic email body (plain text, will be URI-encoded) */
  emailBody: string;
  /** Dynamic WhatsApp message (will be URI-encoded) */
  whatsappMessage: string;
}

export const packages: PackageData[] = [
  {
    id: 'starter',
    num: '01',
    name: 'Starter',
    price: '₹7,999',
    priceNote: 'Starting price',
    description:
      'For individuals and small projects that need a professional online presence without unnecessary complexity.',
    ideal: [
      'Personal portfolios',
      'Freelancer landing pages',
      'Event or launch pages',
      'Simple local-business websites',
      'Single-service promotional pages',
    ],
    includes: [
      'One landing page or single-page website',
      'Responsive mobile, tablet and desktop design',
      'Basic SEO metadata and Open Graph setup',
      'Contact form or call-to-action integration',
      'Social-media links',
      'Deployment to Vercel, Netlify or the client\u2019s existing host',
      'Up to two reasonable revision rounds',
      'Basic performance optimisation',
      'Estimated delivery: 5\u20137 working days',
    ],
    deliveryTime: '5\u20137 working days',
    recommended: false,
    emailSubject: 'Project enquiry \u2014 Starter package',
    emailBody: `Hi Aditya,\n\nI\u2019m interested in the Starter website package, starting at \u20B97,999.\n\nI understand the payment structure is:\n\u2022 50% upfront to begin the project\n\u2022 50% after the approved website is deployed to my chosen hosting provider and domain\n\nA little about my project:\n\nBusiness or project name:\nType of website:\nPreferred launch date:\nAdditional requirements:\n\nThank you.`,
    whatsappMessage:
      'Hi Aditya, I\u2019m interested in the Starter website package starting at \u20B97,999. I understand that payment is 50% upfront and the remaining 50% after the approved website is deployed to my chosen hosting provider and domain. I would like to discuss my project.',
  },
  {
    id: 'business',
    num: '02',
    name: 'Business',
    price: '₹19,999',
    priceNote: 'Starting price',
    description:
      'For businesses that need a credible multi-page website designed to turn visitors into genuine enquiries.',
    ideal: [
      'Service-based businesses',
      'Consultants',
      'Agencies',
      'Startups',
      'Local businesses',
      'Companies replacing an outdated website',
    ],
    includes: [
      'Up to five core pages',
      'Customised visual design',
      'Responsive and cross-browser implementation',
      'Contact form with basic spam protection',
      'SEO foundation including metadata, sitemap and schema where appropriate',
      'Smooth, purposeful animations',
      'WhatsApp contact integration',
      'Basic performance optimisation',
      'Deployment to the client\u2019s selected hosting platform',
      'Up to two revision rounds',
      'Estimated delivery: 10\u201314 working days',
    ],
    deliveryTime: '10\u201314 working days',
    recommended: true,
    emailSubject: 'Project enquiry \u2014 Business package',
    emailBody: `Hi Aditya,\n\nI\u2019m interested in the Business website package, starting at \u20B919,999.\n\nI understand the payment structure is:\n\u2022 50% upfront to begin the project\n\u2022 50% after the approved website is deployed to my chosen hosting provider and domain\n\nA little about my project:\n\nBusiness name:\nIndustry:\nCurrent website, if any:\nPages or features required:\nPreferred launch date:\nAdditional requirements:\n\nThank you.`,
    whatsappMessage:
      'Hi Aditya, I\u2019m interested in the Business website package starting at \u20B919,999. I understand that payment is 50% upfront and the remaining 50% after the approved website is deployed to my chosen hosting provider and domain. I would like to discuss my business website.',
  },
  {
    id: 'premium',
    num: '03',
    name: 'Premium',
    price: '₹39,999',
    priceNote: 'Starting price',
    description:
      'For brands that need a distinctive, custom-designed website with advanced interactions and a higher level of production polish.',
    ideal: [
      'Brands launching a product or service',
      'Established companies upgrading their digital presence',
      'Premium service businesses',
      'SaaS marketing websites',
      'Businesses requiring a custom visual system',
      'Websites with richer interaction design',
    ],
    includes: [
      'Up to ten core pages',
      'Custom UI and visual design system',
      'Reusable components and consistent spacing tokens',
      'Advanced but purposeful animations',
      'Page transitions and micro-interactions',
      'Detailed responsive optimisation',
      'Technical SEO foundation',
      'Structured contact or lead-generation experience',
      'Performance and Core Web Vitals optimisation',
      'Deployment to the client\u2019s chosen platform',
      'Up to three reasonable revision rounds',
      'Estimated delivery: 3\u20135 weeks',
    ],
    deliveryTime: '3\u20135 weeks',
    recommended: false,
    emailSubject: 'Project enquiry \u2014 Premium package',
    emailBody: `Hi Aditya,\n\nI\u2019m interested in the Premium website package, starting at \u20B939,999.\n\nI understand the payment structure is:\n\u2022 50% upfront to begin the project\n\u2022 50% after the approved website is deployed to my chosen hosting provider and domain\n\nA little about my project:\n\nCompany or brand:\nIndustry:\nProject objective:\nPages or functionality required:\nReference websites:\nPreferred launch date:\nAdditional requirements:\n\nThank you.`,
    whatsappMessage:
      'Hi Aditya, I\u2019m interested in the Premium website package starting at \u20B939,999. I understand that payment is 50% upfront and the remaining 50% after the approved website is deployed to my chosen hosting provider and domain. I would like to discuss my project requirements.',
  },
];

/* ─── Helpers ─── */

export function getMailtoLink(pkg: PackageData): string {
  const subject = encodeURIComponent(pkg.emailSubject);
  const body = encodeURIComponent(pkg.emailBody);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export function getWhatsAppLink(pkg: PackageData): string {
  const text = encodeURIComponent(pkg.whatsappMessage);
  return `${WHATSAPP_BASE_URL}?text=${text}`;
}
