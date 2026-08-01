/**
 * Service categories.
 *
 * Shared between the homepage Services section and the dedicated
 * /services route. No pricing is included by design.
 */

export interface Service {
  id: string;
  number: string;
  title: string;
  summary: string;
  deliverables: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'corporate-website-design',
    number: '01',
    title: 'Corporate Website Design and Development',
    summary:
      'A complete corporate website built around what your organisation offers and what your audience needs to understand. Structure and messaging come first, then a clear interface and a production-ready frontend.',
    deliverables: [
      'Information architecture and page structure',
      'Homepage and core service pages',
      'Design system for consistent pages',
      'Responsive frontend implementation',
      'Basic technical SEO and metadata',
      'Deployment and code handover',
    ],
  },
  {
    id: 'website-redesign',
    number: '02',
    title: 'Website Redesign and Modernisation',
    summary:
      'A focused rebuild of an existing website that no longer reflects the business. I keep what already works, resolve the structural and performance problems, and modernise the design without discarding your established credibility.',
    deliverables: [
      'Review of the current structure and content',
      'Reworked navigation and page hierarchy',
      'Updated visual direction and design system',
      'Performance and accessibility improvements',
      'Content migration into the new structure',
      'Staged launch with redirects preserved',
    ],
  },
  {
    id: 'b2b-landing-pages',
    number: '03',
    title: 'B2B Landing Pages and Lead Generation',
    summary:
      'Campaign and service landing pages designed to explain a specific offer and turn qualified visitors into enquiries. Clear messaging, a single purpose per page and a form flow built to be measured.',
    deliverables: [
      'Message and offer structure',
      'Conversion-focused page layout',
      'Enquiry form with validation',
      'Reusable sections for future campaigns',
      'Analytics-ready event structure',
      'Responsive implementation and deployment',
    ],
  },
  {
    id: 'frontend-development',
    number: '04',
    title: 'Frontend Development',
    summary:
      'Frontend implementation for teams that already have a design or an existing product. I build accessible, maintainable interfaces from designs, component systems or dashboards, faithful to the approved direction.',
    deliverables: [
      'Implementation from Figma or existing designs',
      'Reusable component systems',
      'Dashboard and web-application interfaces',
      'Motion and interaction where it adds clarity',
      'Performance and accessibility checks',
      'Organised, documented code handover',
    ],
  },
];
