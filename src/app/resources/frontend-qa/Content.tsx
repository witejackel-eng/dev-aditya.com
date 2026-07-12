export default function Content() {
  const categories = [
    {
      title: 'Responsive',
      items: [
        'Test on mobile (375px), tablet (768px), desktop (1280px+)',
        'No horizontal scroll on any viewport',
        'Touch targets at least 44px',
        'Images and media scale properly',
        'Text remains readable at all sizes',
      ],
    },
    {
      title: 'Accessibility',
      items: [
        'Semantic HTML elements (nav, main, section, article)',
        'Alt text for all meaningful images',
        'Visible focus states on interactive elements',
        'ARIA labels where needed',
        'Color contrast ratio of at least 4.5:1 for text',
        'Full keyboard navigation support',
      ],
    },
    {
      title: 'SEO',
      items: [
        'Unique meta title and description per page',
        'Open Graph tags for social sharing',
        'Proper heading hierarchy (h1 → h2 → h3)',
        'Clean, descriptive URLs',
        'XML sitemap generated',
        'robots.txt configured',
      ],
    },
    {
      title: 'Performance',
      items: [
        'Lighthouse score 90+ on all categories',
        'Images optimized and lazy-loaded',
        'No layout shift (CLS < 0.1)',
        'First Contentful Paint under 1.8s',
        'Bundle size reasonable for the feature set',
        'No unnecessary third-party scripts',
      ],
    },
    {
      title: 'Deployment',
      items: [
        'Environment variables are secure and not exposed client-side',
        'Custom 404 page exists',
        'Favicon and app icons set',
        'robots.txt is present',
        'Build succeeds without warnings',
        'All routes return correct status codes',
      ],
    },
  ];

  return (
    <div className="mt-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Frontend Project QA Checklist</h1>
      <p className="text-text-muted mt-6 leading-relaxed">
        Run through this checklist before shipping any frontend project. It covers responsive behavior, accessibility, SEO, performance, and deployment readiness.
      </p>

      {categories.map((cat) => (
        <div key={cat.title} className="mt-10">
          <h2 className="text-xl font-bold">{cat.title}</h2>
          <ul className="mt-4 space-y-3">
            {cat.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-text-muted leading-relaxed">
                <span className="w-5 h-5 mt-0.5 border border-border-hard rounded flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}