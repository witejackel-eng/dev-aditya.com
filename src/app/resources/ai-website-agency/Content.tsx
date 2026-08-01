export default function Content() {
  return (
    <div className="mt-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Website Agency Starter Notes</h1>
      <p className="text-text-muted mt-6 leading-relaxed">
        Notes on packaging websites, AI chatbots, lead capture, and automation for small businesses looking to establish a modern web presence.
      </p>

      <h2 className="text-xl font-bold mt-12">The opportunity</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        Small businesses need web presence but often cannot afford traditional agencies. They need a clean website, basic SEO, and maybe a simple AI chatbot for common questions. The gap between what they need and what they can pay for is where freelancers and small studios can win.
      </p>

      <h2 className="text-xl font-bold mt-10">What to offer</h2>
      <ul className="mt-4 space-y-2 text-text-muted leading-relaxed">
        <li className="flex gap-2"><span className="text-maroon">—</span> Website build with modern stack (Next.js, Tailwind CSS)</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> AI chatbot integration for FAQs and lead capture</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Contact forms connected to email or CRM</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Basic SEO setup (meta tags, sitemap, Open Graph)</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Analytics integration if needed</li>
      </ul>

      <h2 className="text-xl font-bold mt-10">Tools to start</h2>
      <ul className="mt-4 space-y-2 text-text-muted leading-relaxed">
        <li className="flex gap-2"><span className="text-maroon">—</span> Next.js for the website framework</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Tailwind CSS for styling</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Vercel for deployment</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> OpenAI API or similar for chatbot</li>
        <li className="flex gap-2"><span className="text-maroon">—</span> Resend or similar for transactional email</li>
      </ul>

      <h2 className="text-xl font-bold mt-10">Pricing starting point</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        Simple sites can start at a basic package, marketing pages at a mid-tier, and dashboard or custom UI work at a higher rate. The key is to have clear packages so clients understand what they get.
      </p>

      <h2 className="text-xl font-bold mt-10">Getting first clients</h2>
      <p className="text-text-muted mt-4 leading-relaxed">
        Build a strong portfolio first. Then consider cold outreach to local businesses, freelance platforms, and referrals from your existing network. A polished portfolio with case studies is the best sales tool.
      </p>
    </div>
  );
}