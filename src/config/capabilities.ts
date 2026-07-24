/**
 * Core capabilities and working-relationship advantages.
 *
 * Shared between the homepage "A direct working relationship" section and
 * the About page.
 */

/** Core capabilities, listed on the About page. */
export const CAPABILITIES: string[] = [
  'Information architecture',
  'UI/UX design',
  'Corporate website design',
  'Frontend development',
  'Responsive systems',
  'Design systems',
  'Motion and interaction',
  'Performance optimisation',
  'Accessibility',
  'Deployment and handover',
];

/** Practical advantages of a direct working relationship. */
export const WORKING_ADVANTAGES: string[] = [
  'Clear scope before work begins',
  'Regular progress updates',
  'Shared staging website',
  'Responsive implementation',
  'Performance and accessibility checks',
  'Basic technical SEO',
  'Deployment support',
  'Organised code handover',
];

/** Tools and technologies, grouped for the About page. */
export const TOOL_GROUPS: { category: string; items: string[] }[] = [
  {
    category: 'Design & frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'Interaction & 3D',
    items: ['GSAP', 'Three.js', 'React Three Fiber', 'WebGL'],
  },
  {
    category: 'Delivery',
    items: ['GitHub', 'Vercel', 'Design systems', 'Accessibility', 'Technical SEO'],
  },
];
