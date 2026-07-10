export default function Content() {
  const items = [
    'Clean, readable URL and custom domain',
    'Fast load time (under 3 seconds on 4G)',
    'Mobile-responsive layout',
    'Clear hero with your name, role, and one-line value proposition',
    'At least 3 real projects with live links',
    'Project pages with problem, solution, and outcome',
    'Tech stack listed honestly',
    'Contact form or clear contact information',
    'Consistent design system (colors, fonts, spacing)',
    'Smooth, intentional animations',
    'Good contrast and readable text',
    'Proper meta titles and descriptions',
    'No broken links',
    'Accessibility basics (alt text, semantic HTML, keyboard navigation)',
  ];

  return (
    <div className="mt-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Portfolio Website Checklist</h1>
      <p className="text-text-muted mt-6 leading-relaxed">
        A practical checklist for making a portfolio look credible, fast, and client-ready. Go through each item before launching.
      </p>

      <ul className="mt-10 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-text-muted leading-relaxed">
            <span className="w-5 h-5 mt-0.5 border border-border-hard rounded flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}